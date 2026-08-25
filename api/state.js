const db = require("./_db");
const auth = require("./_auth");

const STATE_KEY = "team-archive:state";
const MODULE_PREFIX = { meetings: "MTG", sops: "SOP", staff: "STF", damages: "DMG", trackers: "TRK" };
const VALID_MODULES = Object.keys(MODULE_PREFIX);

function defaultState() {
  return {
    meetings: [],
    sops: [],
    staff: [],
    damages: [],
    trackers: [],
    counters: { MTG: 0, SOP: 0, STF: 0, DMG: 0, TRK: 0 },
  };
}

function normalize(state) {
  var d = defaultState();
  if (!state || typeof state !== "object") return d;
  VALID_MODULES.forEach(function (k) {
    if (Array.isArray(state[k])) d[k] = state[k];
  });
  d.counters = Object.assign(d.counters, state.counters || {});
  return d;
}

module.exports = async function handler(req, res) {
  if (!auth.isAuthed(req)) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  try {
    if (req.method === "GET") {
      var current = normalize(await db.kvGet(STATE_KEY));
      res.status(200).json({ state: current });
      return;
    }

    if (req.method === "POST") {
      var body = req.body;
      if (typeof body === "string") {
        try {
          body = JSON.parse(body);
        } catch (err) {
          body = null;
        }
      }
      if (!body || !body.op || !body.module || VALID_MODULES.indexOf(body.module) === -1) {
        res.status(400).json({ error: "bad_request" });
        return;
      }

      var state = normalize(await db.kvGet(STATE_KEY));
      var moduleKey = body.module;
      var arr = state[moduleKey];

      if (body.op === "upsert") {
        var record = body.record;
        if (!record || typeof record !== "object") {
          res.status(400).json({ error: "bad_record" });
          return;
        }
        if (record.id && record.id !== "（保存中…）") {
          var idx = arr.findIndex(function (r) {
            return r.id === record.id;
          });
          if (idx > -1) {
            arr[idx] = Object.assign({}, arr[idx], record);
          } else {
            arr.push(record);
          }
        } else {
          var prefix = MODULE_PREFIX[moduleKey];
          state.counters[prefix] = (state.counters[prefix] || 0) + 1;
          var newId = prefix + "-" + String(state.counters[prefix]).padStart(4, "0");
          var clean = Object.assign({}, record);
          delete clean.id;
          arr.push(Object.assign({ id: newId }, clean));
        }
      } else if (body.op === "delete") {
        if (!body.id) {
          res.status(400).json({ error: "bad_id" });
          return;
        }
        state[moduleKey] = arr.filter(function (r) {
          return r.id !== body.id;
        });
      } else {
        res.status(400).json({ error: "bad_op" });
        return;
      }

      await db.kvSet(STATE_KEY, state);
      res.status(200).json({ state: state });
      return;
    }

    res.status(405).json({ error: "method_not_allowed" });
  } catch (err) {
    var msg = (err && err.message) || "server_error";
    res.status(500).json({ error: "server_error", message: msg });
  }
};
