const db = require("./_db");
const auth = require("./_auth");

const STATE_KEY = "team-archive:state";
const MODULE_PREFIX = {
  meetings: "MTG",
  sops: "SOP",
  staff: "STF",
  damages: "DMG",
  trackers: "TRK",
  inspections: "INS",
  complaints: "CPL",
  calibrations: "CAL",
  traces: "TRC",
};
const VALID_MODULES = Object.keys(MODULE_PREFIX);

function defaultState() {
  var s = { counters: {} };
  VALID_MODULES.forEach(function (k) {
    s[k] = [];
    s.counters[MODULE_PREFIX[k]] = 0;
  });
  return s;
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

function badRequest(status, body) {
  var err = new Error(body.error || "bad_request");
  err.httpStatus = status;
  err.httpBody = body;
  return err;
}

module.exports = async function handler(req, res) {
  var me = await auth.currentUser(req);
  if (!me) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  try {
    if (req.method === "GET") {
      var current = normalize(await db.kvGet(STATE_KEY));
      // Modules the account isn't allowed to see are returned empty —
      // enforced here, not just hidden in the UI, so a restricted account
      // can't read that data by calling the API directly either.
      VALID_MODULES.forEach(function (k) {
        if (!auth.canAccess(me, k)) current[k] = [];
      });
      res.status(200).json({ state: current, user: me });
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
      if (!auth.canAccess(me, body.module)) {
        res.status(403).json({ error: "forbidden", message: "你的账号没有这个模块的权限" });
        return;
      }

      var now = new Date().toISOString();

      // Read-modify-write against Supabase with optimistic-concurrency
      // retry: if another request saved in between our read and write,
      // kvUpdate re-reads the fresh state and re-applies this same op
      // instead of silently clobbering that other change.
      var result = await db.kvUpdate(STATE_KEY, function (raw) {
        var state = normalize(raw);
        var moduleKey = body.module;
        var arr = state[moduleKey];

        if (body.op === "upsert") {
          var record = body.record;
          if (!record || typeof record !== "object") throw badRequest(400, { error: "bad_record" });

          // Audit fields are server-authoritative — strip any client-sent
          // values before stamping so they can't be spoofed.
          var incoming = Object.assign({}, record);
          delete incoming.createdBy;
          delete incoming.createdAt;
          delete incoming.updatedBy;
          delete incoming.updatedAt;

          if (record.id && record.id !== "（保存中…）") {
            var idx = arr.findIndex(function (r) {
              return r.id === record.id;
            });
            if (idx > -1) {
              arr[idx] = Object.assign({}, arr[idx], incoming, { updatedBy: me.name, updatedAt: now });
            } else {
              arr.push(Object.assign({}, incoming, { createdBy: me.name, createdAt: now, updatedBy: me.name, updatedAt: now }));
            }
          } else {
            var prefix = MODULE_PREFIX[moduleKey];
            state.counters[prefix] = (state.counters[prefix] || 0) + 1;
            var newId = prefix + "-" + String(state.counters[prefix]).padStart(4, "0");
            delete incoming.id;
            arr.push(Object.assign({}, incoming, { id: newId, createdBy: me.name, createdAt: now, updatedBy: me.name, updatedAt: now }));
          }
        } else if (body.op === "delete") {
          if (!body.id) throw badRequest(400, { error: "bad_id" });
          state[moduleKey] = arr.filter(function (r) {
            return r.id !== body.id;
          });
        } else {
          throw badRequest(400, { error: "bad_op" });
        }

        return { value: state };
      });

      res.status(200).json({ state: result.value, user: me });
      return;
    }

    res.status(405).json({ error: "method_not_allowed" });
  } catch (err) {
    if (err && err.httpStatus) {
      res.status(err.httpStatus).json(err.httpBody);
      return;
    }
    var msg = (err && err.message) || "server_error";
    res.status(500).json({ error: "server_error", message: msg });
  }
};
