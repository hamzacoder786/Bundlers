/**
 * Projects: named, isolated workspaces. Each project has its own saved
 * config (token address / RPC URL / router) and its own wallet vault (see
 * wallet-vault.mjs, whose documents now carry a projectId). A user only sees
 * projects they've been explicitly granted access to — super_admin sees
 * every project without needing an explicit grant, everyone else needs one.
 *
 * Access model: a `project_access` collection holds one document per
 * (projectId, username) grant. This is deliberately a separate collection
 * rather than a `members: [...]` array on the project document — an array
 * gets awkward to query ("which projects can user X see") and risky to
 * update concurrently (two admins granting access at once can race and drop
 * one grant with $set/array-splice patterns). A join-table-style collection
 * avoids both.
 */
import { getCollection } from "./db.mjs";

// The 4 launchpad tabs a project can target — kept in sync with
// sidebarTabs in src/main.js by hand (pons/lunch/lunchCombo/doppler; the
// 5th launch tab, lunchBurst, is deliberately not offered here since only
// these 4 were asked for as "platforms").
export const PROJECT_PLATFORMS = [
  { id: "pons", label: "Pons Launch" },
  { id: "lunch", label: "Lunch.fun Launch" },
  { id: "lunchCombo", label: "Lunch.fun + Burst" },
  { id: "doppler", label: "Feel Cash" },
];
const PROJECT_PLATFORM_IDS = PROJECT_PLATFORMS.map((p) => p.id);

async function projectsCollection() {
  const collection = await getCollection("projects");
  await collection.createIndex({ slug: 1 }, { unique: true });
  return collection;
}

async function accessCollection() {
  const collection = await getCollection("project_access");
  await collection.createIndex({ projectId: 1, usernameLower: 1 }, { unique: true });
  await collection.createIndex({ usernameLower: 1 });
  return collection;
}

function slugify(name) {
  return String(name || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function toProjectView(doc) {
  return {
    id: String(doc._id),
    name: doc.name,
    slug: doc.slug,
    config: {
      tokenAddress: doc.config?.tokenAddress || "",
      rpcUrl: doc.config?.rpcUrl || "",
      router: doc.config?.router || "",
      platform: doc.config?.platform || "",
    },
    createdAt: doc.createdAt,
    createdBy: doc.createdBy || null,
  };
}

export async function createProject(actor, { name, tokenAddress, rpcUrl, router, platform }) {
  const trimmedName = String(name || "").trim();
  if (trimmedName.length < 2 || trimmedName.length > 60) {
    throw httpError(400, "Project name must be 2-60 characters.");
  }
  const slug = slugify(trimmedName);
  if (!slug) throw httpError(400, "Project name must contain at least one letter or number.");
  const platformValue = String(platform || "").trim();
  if (platformValue && !PROJECT_PLATFORM_IDS.includes(platformValue)) {
    throw httpError(400, `Unknown platform "${platformValue}".`);
  }

  const collection = await projectsCollection();
  const doc = {
    name: trimmedName,
    slug,
    config: {
      tokenAddress: String(tokenAddress || "").trim(),
      rpcUrl: String(rpcUrl || "").trim(),
      router: String(router || "").trim(),
      platform: platformValue,
    },
    createdAt: new Date(),
    createdBy: actor.username,
  };
  try {
    const result = await collection.insertOne(doc);
    // The creator always gets access to what they just made — otherwise a
    // super_admin who isn't auto-granted (see listProjectsForUser) would
    // create a project and immediately be unable to select it.
    await grantAccess(actor, String(result.insertedId), actor.username);
    return toProjectView({ ...doc, _id: result.insertedId });
  } catch (error) {
    if (error?.code === 11000) throw httpError(409, `A project named "${trimmedName}" already exists.`);
    throw error;
  }
}

export async function updateProjectConfig(actor, projectId, { name, tokenAddress, rpcUrl, router, platform }) {
  const collection = await projectsCollection();
  const { ObjectId } = await import("mongodb");
  const _id = toObjectId(ObjectId, projectId);
  const set = {};
  if (name !== undefined) {
    const trimmed = String(name).trim();
    if (trimmed.length < 2 || trimmed.length > 60) throw httpError(400, "Project name must be 2-60 characters.");
    set.name = trimmed;
    set.slug = slugify(trimmed);
  }
  if (tokenAddress !== undefined) set["config.tokenAddress"] = String(tokenAddress).trim();
  if (rpcUrl !== undefined) set["config.rpcUrl"] = String(rpcUrl).trim();
  if (router !== undefined) set["config.router"] = String(router).trim();
  if (platform !== undefined) {
    const platformValue = String(platform || "").trim();
    if (platformValue && !PROJECT_PLATFORM_IDS.includes(platformValue)) {
      throw httpError(400, `Unknown platform "${platformValue}".`);
    }
    set["config.platform"] = platformValue;
  }

  const result = await collection.findOneAndUpdate({ _id }, { $set: set }, { returnDocument: "after" });
  if (!result) throw httpError(404, "Project not found.");
  return toProjectView(result);
}

export async function deleteProject(actor, projectId) {
  const { ObjectId } = await import("mongodb");
  const _id = toObjectId(ObjectId, projectId);
  const collection = await projectsCollection();
  const doc = await collection.findOne({ _id });
  if (!doc) throw httpError(404, "Project not found.");

  // Refuse to silently orphan a project's saved wallets — deleting the
  // project would otherwise leave encrypted keys in the database with no UI
  // path left to reach, reveal, or sweep them.
  const wallets = await getCollection("wallets");
  const walletCount = await wallets.countDocuments({ projectId: String(_id) });
  if (walletCount > 0) {
    throw httpError(400, `This project still has ${walletCount} saved wallet(s). Delete or move them first.`);
  }

  await collection.deleteOne({ _id });
  const access = await accessCollection();
  await access.deleteMany({ projectId: String(_id) });
  return { id: String(_id) };
}

/**
 * Every project a user may select. super_admin implicitly sees all of
 * them — the alternative (requiring an explicit grant even for
 * super_admin) means the very first project ever created would be
 * invisible to the account that's supposed to administer everything.
 */
export async function listProjectsForUser(actor) {
  const collection = await projectsCollection();
  if (actor.isSuperAdmin) {
    const docs = await collection.find({}).sort({ name: 1 }).toArray();
    return docs.map(toProjectView);
  }
  const access = await accessCollection();
  const grants = await access.find({ usernameLower: actor.username.toLowerCase() }).toArray();
  if (grants.length === 0) return [];
  const { ObjectId } = await import("mongodb");
  const ids = grants.map((g) => toObjectId(ObjectId, g.projectId));
  const docs = await collection.find({ _id: { $in: ids } }).sort({ name: 1 }).toArray();
  return docs.map(toProjectView);
}

export async function getProjectForUser(actor, projectId) {
  const projects = await listProjectsForUser(actor);
  const found = projects.find((p) => p.id === String(projectId));
  if (!found) throw httpError(403, "You do not have access to this project, or it does not exist.");
  return found;
}

export async function listAccessForProject(projectId) {
  const access = await accessCollection();
  const grants = await access.find({ projectId: String(projectId) }).sort({ username: 1 }).toArray();
  return grants.map((g) => ({ username: g.username, grantedAt: g.grantedAt, grantedBy: g.grantedBy || null }));
}

export async function grantAccess(actor, projectId, username) {
  const trimmed = String(username || "").trim();
  if (!trimmed) throw httpError(400, "Username is required.");
  const access = await accessCollection();
  await access.updateOne(
    { projectId: String(projectId), usernameLower: trimmed.toLowerCase() },
    { $set: { username: trimmed, grantedAt: new Date(), grantedBy: actor.username } },
    { upsert: true },
  );
  return { projectId: String(projectId), username: trimmed };
}

export async function revokeAccess(projectId, username) {
  const access = await accessCollection();
  const result = await access.deleteOne({ projectId: String(projectId), usernameLower: String(username || "").toLowerCase() });
  return result.deletedCount > 0;
}

function toObjectId(ObjectId, value) {
  try {
    return new ObjectId(String(value));
  } catch {
    throw httpError(400, "Invalid project id.");
  }
}

function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
