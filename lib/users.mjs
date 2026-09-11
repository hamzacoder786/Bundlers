/**
 * User administration: list, create, change role, reset password, delete.
 *
 * Every mutating function takes the ACTING user's context and enforces two
 * escalation guards that matter more than they might look:
 *
 *   1. A non-super_admin can never create, modify or delete a super_admin.
 *      Without this, anyone with users.manage could hand themselves
 *      super_admin and bypass every other check here.
 *
 *   2. A non-super_admin can only assign a role whose permissions are a
 *      SUBSET of their own. Without this, a manager could create a role with
 *      every permission, assign it to a new account, log in as that account,
 *      and effectively become super_admin.
 *
 * super_admin bypasses both, which is the point of it being super_admin.
 */
import bcrypt from "bcryptjs";
import { getCollection } from "./db.mjs";
import { SUPER_ADMIN_ROLE, getRole, permissionsForRole } from "./roles.mjs";

const USERNAME_RE = /^[a-zA-Z0-9_.-]{3,32}$/;

async function accountsCollection() {
  return getCollection("accounts");
}

export async function listUsers() {
  const collection = await accountsCollection();
  const docs = await collection.find({}).sort({ username: 1 }).toArray();
  return docs.map((doc) => ({
    username: doc.username,
    role: doc.role,
    createdAt: doc.createdAt,
    seeded: Boolean(doc.seeded),
  }));
}

/**
 * Throws unless `actor` is allowed to grant `targetRole`. Shared by create and
 * role-change so the two paths can't drift apart and leave one unguarded.
 */
async function assertCanAssignRole(actor, targetRole) {
  if (actor.role === SUPER_ADMIN_ROLE) return;

  if (targetRole === SUPER_ADMIN_ROLE) {
    throw httpError(403, "Only a super_admin can grant the super_admin role.");
  }
  const role = await getRole(targetRole);
  if (!role) throw httpError(400, `Role "${targetRole}" does not exist.`);

  const actorPerms = await permissionsForRole(actor.role);
  const escalating = role.permissions.filter((p) => !actorPerms.has(p));
  if (escalating.length > 0) {
    throw httpError(403, `You cannot grant permissions you do not have yourself: ${escalating.join(", ")}`);
  }
}

async function assertCanModifyUser(actor, targetUsername) {
  const collection = await accountsCollection();
  const target = await collection.findOne({ usernameLower: String(targetUsername || "").toLowerCase() });
  if (!target) throw httpError(404, `User "${targetUsername}" not found.`);
  if (target.role === SUPER_ADMIN_ROLE && actor.role !== SUPER_ADMIN_ROLE) {
    throw httpError(403, "Only a super_admin can modify a super_admin account.");
  }
  return target;
}

export async function createUser(actor, { username, password, role }) {
  const trimmed = String(username || "").trim();
  if (!USERNAME_RE.test(trimmed)) {
    throw httpError(400, "Username must be 3-32 characters (letters, numbers, _ . -).");
  }
  if (String(password || "").length < 8) {
    throw httpError(400, "Password must be at least 8 characters.");
  }
  await assertCanAssignRole(actor, role);

  const collection = await accountsCollection();
  const usernameLower = trimmed.toLowerCase();
  if (await collection.findOne({ usernameLower })) {
    throw httpError(409, "That username is already taken.");
  }
  await collection.insertOne({
    username: trimmed,
    usernameLower,
    passwordHash: await bcrypt.hash(password, 10),
    role,
    createdAt: new Date(),
    createdBy: actor.username,
    seeded: false,
  });
  return { username: trimmed, role };
}

export async function setUserRole(actor, username, role) {
  const target = await assertCanModifyUser(actor, username);
  await assertCanAssignRole(actor, role);

  // Guard against removing the last super_admin — doing so would leave nobody
  // able to manage roles or recover the system through the UI.
  if (target.role === SUPER_ADMIN_ROLE && role !== SUPER_ADMIN_ROLE) {
    const collection = await accountsCollection();
    const remaining = await collection.countDocuments({ role: SUPER_ADMIN_ROLE });
    if (remaining <= 1) throw httpError(400, "Cannot change the role of the last super_admin.");
  }

  const collection = await accountsCollection();
  await collection.updateOne({ _id: target._id }, { $set: { role } });
  return { username: target.username, role };
}

export async function resetUserPassword(actor, username, newPassword) {
  const target = await assertCanModifyUser(actor, username);
  if (String(newPassword || "").length < 8) {
    throw httpError(400, "Password must be at least 8 characters.");
  }
  const collection = await accountsCollection();
  await collection.updateOne(
    { _id: target._id },
    { $set: { passwordHash: await bcrypt.hash(newPassword, 10) } },
  );

  // Invalidate the target's existing sessions: a password reset that leaves
  // old sessions alive does not actually lock out whoever prompted the reset.
  const sessions = await getCollection("sessions");
  await sessions.deleteMany({ username: target.username });
  return { username: target.username };
}

export async function deleteUser(actor, username) {
  const target = await assertCanModifyUser(actor, username);
  if (target.usernameLower === actor.username.toLowerCase()) {
    throw httpError(400, "You cannot delete your own account.");
  }
  if (target.role === SUPER_ADMIN_ROLE) {
    const collection = await accountsCollection();
    const remaining = await collection.countDocuments({ role: SUPER_ADMIN_ROLE });
    if (remaining <= 1) throw httpError(400, "Cannot delete the last super_admin.");
  }

  const collection = await accountsCollection();
  await collection.deleteOne({ _id: target._id });
  const sessions = await getCollection("sessions");
  await sessions.deleteMany({ username: target.username });
  return { username: target.username };
}

function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
