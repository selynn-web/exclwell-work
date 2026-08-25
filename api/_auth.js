// Shared auth helpers for the team-archive API routes.
const crypto = require("crypto");

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

function expectedToken() {
  var pin = process.env.TEAM_PIN || "";
  var secret = process.env.AUTH_SECRET || "";
  return crypto.createHmac("sha256", secret).update(pin).digest("hex");
}

function isAuthed(req) {
  if (!process.env.TEAM_PIN || !process.env.AUTH_SECRET) return false;
  var cookies = parseCookies(req);
  var token = cookies["team_auth"];
  if (!token) return false;
  var expected = expectedToken();
  if (token.length !== expected.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch (err) {
    return false;
  }
}

module.exports = { parseCookies: parseCookies, expectedToken: expectedToken, isAuthed: isAuthed };
