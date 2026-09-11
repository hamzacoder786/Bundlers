/**
 * Dynamic role + permission system, stored in MongoDB.
 *
 * Design notes worth knowing before changing anything here:
 *
 * - Permissions are resolved FRESH from the database on every request, never
 *   read from the session document. Sessions snapshot the role name at login
 *   (see auth.mjs), so trusting that snapshot would mean a permission change
 *   didn't take effect until the affected user happened to log out — exactly
 *   the case where you most want it immediate (revoking access).
 *
 * - "super_admin" is deliberately hardcoded as all-powerful and NOT stored as
 *   an editable role. If it were editable, an admin could remove
 *   MANAGE_ROLES from it and permanently lock everyone out of the permission
 *   UI, with no way back in short of editing the database by hand.
 *
 * - Privilege escalation is blocked in assignRole/saveRole: a manager can
 *   only grant permissions it already holds itself, and cannot touch
 *   super_admin accounts. Without that, MANAGE_USERS alone would be enough
 *   to grant yourself every other permission.
 */
import { getCollection } from "./db.mjs";

export const SUPER_ADMIN_ROLE = "super_admin";

// Every tab id from src/main.js's sidebarTabs, plus the action permissions.
// Keep TAB_PERMISSIONS in sync with that array — a tab with no entry here is
// treated as super-admin-only by requireTabAccess, which fails closed rather
// than silently exposing a new tab to everyone.
export const TABS = [
  { id: "write", label: "Write Functions" },
  { id: "read", label: "Read Functions" },
  { id: "buy", label: "Buy" },
  { id: "sell", label: "Sell" },
  { id: "lp", label: "LP" },
  { id: "burn", label: "Burn" },
  { id: "accounts", label: "Accounts" },
  { id: "multisend", label: "Multisend" },
  { id: "sweep", label: "Collect ETH" },
  { id: "mmBot", label: "Market Maker Bot" },
  { id: "wallets", label: "Wallets" },
  { id: "projectMgmt", label: "Project Management" },
  { id: "disperse", label: "Disperse" },
  { id: "walletWash", label: "Wallet Wash" },
  { id: "walletReport", label: "Check Balance" },
  { id: "launch", label: "Launch Planner" },
  { id: "pons", label: "Pons Launch" },
  { id: "ponsWash", label: "Pons + Wash" },
  { id: "multiBuys", label: "Multiple Buys" },
  { id: "lunch", label: "Lunch.fun Launch" },
  { id: "lunchBurst", label: "Lunch Burst" },
  { id: "lunchCombo", label: "Lunch + Burst" },
  { id: "doppler", label: "DopplerERC20V1" },
  { id: "verify", label: "Verify" },
];

// Action permissions gate specific high-risk operations rather than whole
// tabs — these are the ones that expose keys, move funds irreversibly, or
// change who can do what.
export const ACTIONS = [
  { id: "wallets.reveal", label: "Reveal wallet private keys", danger: true },
  { id: "wallets.export", label: "Export wallets to file", danger: true },
  { id: "wallets.generate", label: "Generate new wallets", danger: false },
  { id: "wallets.delete", label: "Delete saved wallets", danger: true },
  { id: "contract.owner", label: "Use contract owner controls", danger: true },
  { id: "users.manage", label: "Create and edit users", danger: true },
  { id: "roles.manage", label: "Create and edit roles", danger: true },
  { id: "projects.manage", label: "Create, edit and delete projects; grant project access", danger: true },
];

export const TAB_PERMISSION_IDS = TABS.map((t) => `tab.${t.id}`);
export const ACTION_PERMISSION_IDS = ACTIONS.map((a) => a.id);
export const ALL_PERMISSIONS = [...TAB_PERMISSION_IDS, ...ACTION_PERMISSION_IDS];

// Roles created on first run so a fresh install is usable immediately.
// super_admin is not here — it is implicit and always has everything.
const SEED_ROLES = [
  {
    name: "admin",
    description: "Full operational access, but cannot manage users or roles.",
    permissions: [...TAB_PERMISSION_IDS, "wallets.reveal", "wallets.export", "wallets.generate", "wallets.delete", "contract.owner"],
  },
  {
    name: "manager",
    description: "Operational access plus user and role management.",
    permissions: [...TAB_PERMISSION_IDS, "wallets.reveal", "wallets.export", "wallets.generate", "contract.owner", "users.manage", "roles.manage", "projects.manage"],
  },
  {
    name: "trader",
    description: "Trading and project wallet access without admin controls.",
    permissions: [
      "tab.buy",
      "tab.sell",
      "tab.read",
      "tab.wallets",
      "tab.projectMgmt",
      "tab.walletReport",
      "tab.launch",
      "tab.mmBot",
      "wallets.generate",
      "wallets.delete",
      "projects.manage",
    ],
  },
  {
    name: "viewer",
    description: "Read-only. Can look at balances and contract state, nothing else.",
    permissions: ["tab.read", "tab.walletReport"],
  },
];

const SEED_ROLE_MAP = new Map(SEED_ROLES.map((role) => [role.name.toLowerCase(), role]));

let seeded = false;

async function rolesCollection() {
  const collection = await getCollection("roles");
  await collection.createIndex({ nameLower: 1 }, { unique: true });
  if (!seeded) {
    seeded = true;
    for (const role of SEED_ROLES) {
      const nameLower = role.name.toLowerCase();
      const existing = await collection.findOne({ nameLower });
      if (!existing) {
        await collection.insertOne({
          name: role.name,
          nameLower,
          description: role.description,
          permissions: role.permissions,
          createdAt: new Date(),
          seeded: true,
        });
        continue;
      }

      // Existing installs may have stale seeded-role permissions from an earlier
      // version of the app. Keep the Mongo role document aligned with the current
      // definition so a restarted server immediately fixes hidden tabs for users
      // already assigned that role.
      const desiredPermissions = [...new Set(role.permissions)].sort();
      const currentPermissions = [...new Set(existing.permissions || [])].sort();
      const shouldRefresh = Boolean(existing.seeded) && JSON.stringify(currentPermissions) !== JSON.stringify(desiredPermissions);
      if (shouldRefresh) {
        await collection.updateOne(
          { nameLower },
          {
            $set: {
              name: role.name,
              description: role.description,
              permissions: role.permissions,
            },
          },
        );
      }
    }
  }
  return collection;
}

export async function listRoles() {
  const collection = await rolesCollection();
  const docs = await collection.find({}).sort({ name: 1 }).toArray();
  return docs.map((doc) => ({
    name: doc.name,
    description: doc.description || "",
    permissions: doc.permissions || [],
    seeded: Boolean(doc.seeded),
  }));
}

export async function getRole(name) {
  const collection = await rolesCollection();
  const doc = await collection.findOne({ nameLower: String(name || "").trim().toLowerCase() });
  if (!doc) return null;
  return {
    name: doc.name,
    description: doc.description || "",
    permissions: doc.permissions || [],
    seeded: Boolean(doc.seeded),
  };
}

/**
 * Resolves a role name to its permission list. super_admin short-circuits to
 * everything; an unknown or deleted role resolves to NO permissions rather
 * than throwing, so a user whose role was deleted loses access instead of
 * crashing every request they make.
 */
export async function permissionsForRole(roleName) {
  if (roleName === SUPER_ADMIN_ROLE) return new Set(ALL_PERMISSIONS);
  const role = await getRole(roleName);
  if (!role) return new Set();
  return new Set(role.permissions);
}

export async function saveRole(name, { description = "", permissions = [] } = {}) {
  const trimmed = String(name || "").trim();
  if (!/^[a-zA-Z0-9 _-]{2,32}$/.test(trimmed)) {
    throw httpError(400, "Role name must be 2-32 characters (letters, numbers, spaces, _ or -).");
  }
  if (trimmed.toLowerCase() === SUPER_ADMIN_ROLE) {
    throw httpError(400, "The super_admin role is built in and cannot be edited.");
  }
  const unknown = permissions.filter((p) => !ALL_PERMISSIONS.includes(p));
  if (unknown.length > 0) throw httpError(400, `Unknown permission(s): ${unknown.join(", ")}`);

  const collection = await rolesCollection();
  await collection.updateOne(
    { nameLower: trimmed.toLowerCase() },
    {
      $set: { name: trimmed, description: String(description || ""), permissions },
      $setOnInsert: { nameLower: trimmed.toLowerCase(), createdAt: new Date(), seeded: false },
    },
    { upsert: true },
  );
  return getRole(trimmed);
}

export async function deleteRole(name) {
  const trimmed = String(name || "").trim();
  if (trimmed.toLowerCase() === SUPER_ADMIN_ROLE) throw httpError(400, "The super_admin role cannot be deleted.");

  // Refuse to orphan accounts: a user pointing at a deleted role would resolve
  // to zero permissions and be silently locked out with a confusing UI.
  const accounts = await getCollection("accounts");
  const inUse = await accounts.countDocuments({ role: trimmed });
  if (inUse > 0) {
    throw httpError(400, `${inUse} user(s) still have the "${trimmed}" role. Reassign them before deleting it.`);
  }

  const collection = await rolesCollection();
  const result = await collection.deleteOne({ nameLower: trimmed.toLowerCase() });
  return result.deletedCount > 0;
}

function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
