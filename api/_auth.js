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
  return { id: u.id, name: u.name, username: u.username };
}

module.exports = {
  parseCookies: parseCookies,
  sessionToken: sessionToken,
  currentUser: currentUser,
  getUsers: getUsers,
  hashPassword: hashPassword,
  verifyPassword: verifyPassword,
  USERS_KEY: USERS_KEY,
};
