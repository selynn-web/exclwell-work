// Shared auth helpers for the team-archive API routes.
//
// Accounts model: each team member has their own username + password,
// stored (hashed) in the kv_store under USERS_KEY, in the SAME Supabase
// table already used for the app data — no new table/SQL needed.
//
// TEAM_PIN (existing env var) is repurposed as a standing "team invite
// code": it gates joining as a new member or resetting a forgotten
// password (see api/login.js "join" mode and api/users.js "add" op).
// It is no longer used for day-to-day login.
const crypto = require("crypto");
const db = require("./_db");

var USERS_KEY = "team-archive:users";

// Brute-force protection for the login/reset endpoint. Failed attempts are
// tracked per "key" (a username for a normal wrong-password login, or the
// literal string "teampin" for a wrong team-invite-code attempt in join
// mode — the invite code is shared, not per-account, so it's tracked as
// one bucket rather than per-username) in their own kv_store row —
// completely separate from USERS_KEY / STATE_KEY, so this never contends
// with or risks any real app data.
var LOGIN_ATTEMPTS_KEY = "team-archive:login_attempts";
var MAX_FAILS = 5;
var LOCK_MINUTES = 15;
var FAIL_RESET_MINUTES = 30; // a fail streak that went cold this long ago no longer counts

// Returns { lockedUntil } if `key` is currently locked out, otherwise null.
// Cheap read-only check — call this BEFORE doing any password verification
// so a locked-out attempt never even touches scrypt.
async function checkLoginLock(key) {
  var all = await db.kvGet(LOGIN_ATTEMPTS_KEY);
  var entry = all && all[key];
  if (!entry || !entry.lockedUntil) return null;
  if (new Date(entry.lockedUntil) > new Date()) return { lockedUntil: entry.lockedUntil };
  return null;
}

async function recordLoginFailure(key) {
  await db.kvUpdate(LOGIN_ATTEMPTS_KEY, function (raw) {
    var all = raw && typeof raw === "object" ? Object.assign({}, raw) : {};
    var now = new Date();
    var entry = all[key];
    if (!entry || !entry.lastFailAt || now - new Date(entry.lastFailAt) > FAIL_RESET_MINUTES * 60 * 1000) {
      entry = { fails: 0, lastFailAt: null, lockedUntil: null };
    }
    entry.fails = (entry.fails || 0) + 1;
    entry.lastFailAt = now.toISOString();
    if (entry.fails >= MAX_FAILS) {
      entry.lockedUntil = new Date(now.getTime() + LOCK_MINUTES * 60 * 1000).toISOString();
    }
    all[key] = entry;
    return { value: all };
  });
}

async function clearLoginFailures(key) {
  await db.kvUpdate(LOGIN_ATTEMPTS_KEY, function (raw) {
    var all = raw && typeof raw === "object" ? Object.assign({}, raw) : {};
    if (all[key]) {
      var next = Object.assign({}, all);
      delete next[key];
      return { value: next };
    }
    return { value: all };
  });
}

function lockMessage(lockedUntil) {
  var minutesLeft = Math.max(1, Math.ceil((new Date(lockedUntil) - new Date()) / 60000));
  return "尝试次数过多，账号已暂时锁定，请 " + minutesLeft + " 分钟后再试";
}

// Modules that a user's account can be restricted to a subset of.
// "overview" and "leaves" are never restricted (leaves is just an
// external link; overview is filtered down to whatever the user can see).
var RESTRICTABLE_MODULES = [
  "meetings", "sops", "inspections", "complaints", "calibrations", "repairs", "traces",
  "vehicles", "damages", "trackers", "accounts"
];

// A user's `allowedModules` is either null/undefined (full access, the
// default for every existing account and any newly added without picking
// a restriction) or an array of module keys they're limited to.
function canAccess(user, moduleKey) {
  if (!user || !Array.isArray(user.allowedModules)) return true;
  return user.allowedModules.indexOf(moduleKey) > -1;
}

function parseCookies(req) {
  var header = req.headers.cookie || "";
  var out = {};
  header.split(";").forEach(function (part) {
    var idx = part.indexOf("=");
    if (idx === -1) return;
    var k = part.slice(0, idx).trim();
    var v = part.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  });
  return out;
}

function sign(payload) {
  var secret = process.env.AUTH_SECRET || "";
  var b64 = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  var sig = crypto.createHmac("sha256", secret).update(b64).digest("base64url");
  return b64 + "." + sig;
}

function verifyToken(token) {
  if (!token || token.indexOf(".") === -1) return null;
  var parts = token.split(".");
  if (parts.length !== 2) return null;
  var secret = process.env.AUTH_SECRET || "";
  var expectedSig = crypto.createHmac("sha256", secret).update(parts[0]).digest("base64url");
  try {
    if (parts[1].length !== expectedSig.length) return null;
    if (!crypto.timingSafeEqual(Buffer.from(parts[1]), Buffer.from(expectedSig))) return null;
  } catch (err) {
    return null;
  }
  try {
    return JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
  } catch (err) {
    return null;
  }
}

function sessionToken(uid) {
  return sign({ uid: uid, iat: Date.now() });
}

function hashPassword(password) {
  var salt = crypto.randomBytes(16).toString("hex");
  var hash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return salt + ":" + hash;
}

function verifyPassword(password, stored) {
  if (!stored || stored.indexOf(":") === -1) return false;
  var parts = stored.split(":");
  var check = crypto.scryptSync(String(password), parts[0], 64).toString("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(parts[1], "hex"), Buffer.from(check, "hex"));
  } catch (err) {
    return false;
  }
}

async function getUsers() {
  var users = await db.kvGet(USERS_KEY);
  return Array.isArray(users) ? users : [];
}

async function currentUser(req) {
  if (!process.env.AUTH_SECRET) return null;
  var cookies = parseCookies(req);
  var payload = verifyToken(cookies["team_session"]);
  if (!payload || !payload.uid) return null;
  var users = await getUsers();
  var u = users.find(function (x) { return x.id === payload.uid && !x.deleted; });
  if (!u) return null;
  return {
    id: u.id,
    name: u.name,
    username: u.username,
    allowedModules: Array.isArray(u.allowedModules) ? u.allowedModules : null,
  };
}

module.exports = {
  parseCookies: parseCookies,
  sessionToken: sessionToken,
  currentUser: currentUser,
  getUsers: getUsers,
  hashPassword: hashPassword,
  verifyPassword: verifyPassword,
  canAccess: canAccess,
  RESTRICTABLE_MODULES: RESTRICTABLE_MODULES,
  checkLoginLock: checkLoginLock,
  recordLoginFailure: recordLoginFailure,
  clearLoginFailures: clearLoginFailures,
  lockMessage: lockMessage,
  USERS_KEY: USERS_KEY,
};
