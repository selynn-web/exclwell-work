const db = require("./_db");
const auth = require("./_auth");

const STATE_KEY = "team-archive:state";
const MODULE_PREFIX = {
  meetings: "MTG",
  sops: "SOP",
  // 人员管理 (Staff) has no UI any more — removed in favor of 账号管理
  // holding contact phone numbers directly, plus the new 设备维修记录
  // (repairs) module. "staff" stays in this map ONLY so any staff data
  // already saved in Supabase before this change keeps round-tripping
  // through normalize()/kvUpdate unchanged instead of being silently
  // dropped on the next write — real production data, never delete it by
  // removing this line. See public/app.js's defaultState() for the
  // matching client-side note.
  staff: "STF",
  damages: "DMG",
  trackers: "TRK",
  repairs: "RPR",
  vehicles: "VEH",
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

// Lightweight change log: {at, by, action} entries only — no full field
// diffing (the field types vary too much across modules to diff generically,
// and a full diff would grow the already-single-blob storage even faster).
// Capped so one record's history can't grow unbounded over years of edits.
var MAX_HISTORY = 20;
function pushHistory(existing, entry) {
  var next = (Array.isArray(existing) ? existing.slice() : []).concat([entry]);
  if (next.length > MAX_HISTORY) next = next.slice(next.length - MAX_HISTORY);
  return next;
}

function badRequest(status, body) {
  var err = new Error(body.error || "bad_request");
  err.httpStatus = status;
  err.httpBody = body;
  return err;
}

// Deleting a record no longer removes it from storage — it's flagged
// deleted:true/deletedAt/deletedBy and stays in the same array (see the
// "delete" op below). This function turns that one array into the live
// list view the client already expects everywhere, plus a per-module
// trashCounts map for the "🗑 回收站 (N)" badge. It does NOT include the
// full trash arrays — those carry every deleted record's full data
// (photos included), and shipping them on every poll/page load regardless
// of whether anyone's looking at a recycle bin is wasted bandwidth that
// only grows as trash accumulates over time. Use trashForModule() below to
// fetch one module's actual trashed records on demand (recycle bin opened,
// or right after an op that touched that module). Module permission
// (canAccess) gates both the live list and the counts the same way it
// already gated the live list, so a restricted account can't see deleted
// records from a module it can't access either.
function shapeForClient(state, me) {
  var out = { counters: state.counters, trashCounts: {} };
  VALID_MODULES.forEach(function (k) {
    if (!auth.canAccess(me, k)) {
      out[k] = [];
      out.trashCounts[k] = 0;
      return;
    }
    var arr = Array.isArray(state[k]) ? state[k] : [];
    out[k] = arr.filter(function (r) { return !r.deleted; });
    out.trashCounts[k] = arr.reduce(function (n, r) { return r.deleted ? n + 1 : n; }, 0);
  });
  return out;
}

// One module's actual trashed records — only computed when asked for
// (recycle bin opened for that module, or as a courtesy right after an op
// that touched it), not bundled into every routine state fetch. Same
// permission gate as shapeForClient().
function trashForModule(state, me, moduleKey) {
  if (VALID_MODULES.indexOf(moduleKey) === -1 || !auth.canAccess(me, moduleKey)) return [];
  var arr = Array.isArray(state[moduleKey]) ? state[moduleKey] : [];
  return arr.filter(function (r) { return r.deleted; });
}

module.exports = async function handler(req, res) {
  var me = await auth.currentUser(req);
  if (!me) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  try {
    if (req.method === "GET") {
      // shapeForClient() also enforces module permissions on both the live
      // list and the trash counts — not just hidden in the UI, a restricted
      // account can't read that data by calling the API directly either.
      var rawState = normalize(await db.kvGet(STATE_KEY));
      var current = shapeForClient(rawState, me);
      // The recycle-bin UI asks for one module's actual trashed records by
      // adding ?trashModule=xxx — either because that module's panel is
      // open (see toggleTrash() in app.js) or because a currently-open
      // panel is being kept fresh alongside the normal poll. Anything else
      // (invalid module, or no permission) is just ignored rather than
      // erroring, since this is a courtesy addition to a normal state read.
      var trashModuleParam = req.query && req.query.trashModule;
      if (typeof trashModuleParam === "string" && auth.canAccess(me, trashModuleParam) && VALID_MODULES.indexOf(trashModuleParam) > -1) {
        current.trash = {};
        current.trash[trashModuleParam] = trashForModule(rawState, me, trashModuleParam);
      }
      // A lightweight name+phone directory, available to every logged-in
      // teammate regardless of module permissions (unlike the full account
      // list behind 账号管理/"accounts"). Used so anyone working a tracker
      // item can send a WhatsApp reminder to whoever it's assigned to,
      // without needing account-management access themselves. Only name
      // and phone are exposed here — never username/password/permissions.
      var allUsers = await auth.getUsers();
      var contacts = allUsers
        .filter(function (u) { return !u.deleted && u.phone; })
        .map(function (u) { return { name: u.name, phone: u.phone }; });
      res.status(200).json({ state: current, user: me, contacts: contacts });
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
          delete incoming.history;

          if (record.id && record.id !== "（保存中…）") {
            var idx = arr.findIndex(function (r) {
              return r.id === record.id;
            });
            if (idx > -1) {
              var editHistory = pushHistory(arr[idx].history, { at: now, by: me.name, action: "update" });
              arr[idx] = Object.assign({}, arr[idx], incoming, { updatedBy: me.name, updatedAt: now, history: editHistory });
            } else {
              var createHistory = pushHistory(null, { at: now, by: me.name, action: "create" });
              arr.push(Object.assign({}, incoming, { createdBy: me.name, createdAt: now, updatedBy: me.name, updatedAt: now, history: createHistory }));
            }
          } else {
            var prefix = MODULE_PREFIX[moduleKey];
            state.counters[prefix] = (state.counters[prefix] || 0) + 1;
            var newId = prefix + "-" + String(state.counters[prefix]).padStart(4, "0");
            delete incoming.id;
            var newHistory = pushHistory(null, { at: now, by: me.name, action: "create" });
            arr.push(Object.assign({}, incoming, { id: newId, createdBy: me.name, createdAt: now, updatedBy: me.name, updatedAt: now, history: newHistory }));
          }
        } else if (body.op === "delete") {
          // Soft delete: flag it and leave it in place so it can be
          // recovered from the recycle bin — see shapeForClient() above.
          if (!body.id) throw badRequest(400, { error: "bad_id" });
          var delIdx = arr.findIndex(function (r) { return r.id === body.id; });
          if (delIdx === -1) throw badRequest(404, { error: "not_found" });
          var delHistory = pushHistory(arr[delIdx].history, { at: now, by: me.name, action: "delete" });
          arr[delIdx] = Object.assign({}, arr[delIdx], { deleted: true, deletedAt: now, deletedBy: me.name, history: delHistory });
        } else if (body.op === "restore") {
          if (!body.id) throw badRequest(400, { error: "bad_id" });
          var resIdx = arr.findIndex(function (r) { return r.id === body.id && r.deleted; });
          if (resIdx === -1) throw badRequest(404, { error: "not_found" });
          var restored = Object.assign({}, arr[resIdx]);
          restored.history = pushHistory(restored.history, { at: now, by: me.name, action: "restore" });
          delete restored.deleted;
          delete restored.deletedAt;
          delete restored.deletedBy;
          restored.updatedBy = me.name;
          restored.updatedAt = now;
          arr[resIdx] = restored;
        } else if (body.op === "purge") {
          // Permanent delete — only allowed on a record that's ALREADY in
          // the recycle bin (deleted:true). This two-step requirement
          // (delete, then purge from the bin) is a deliberate guard against
          // accidentally wiping a record with no way back.
          if (!body.id) throw badRequest(400, { error: "bad_id" });
          var purgeIdx = arr.findIndex(function (r) { return r.id === body.id; });
          if (purgeIdx === -1) throw badRequest(404, { error: "not_found" });
          if (!arr[purgeIdx].deleted) throw badRequest(400, { error: "not_in_trash", message: "只能彻底删除回收站里的记录" });
          state[moduleKey] = arr.filter(function (r) { return r.id !== body.id; });
        } else {
          throw badRequest(400, { error: "bad_op" });
        }

        return { value: state };
      });

      // Bundle fresh trash for the module this op just touched (delete
      // populates it, restore/purge/upsert change what's in it) so a
      // currently-open recycle-bin panel for that module updates from this
      // same response — no separate round trip needed for the common case
      // of acting on a module whose trash panel you're already looking at.
      var shaped = shapeForClient(result.value, me);
      shaped.trash = {};
      shaped.trash[body.module] = trashForModule(result.value, me, body.module);
      res.status(200).json({ state: shaped, user: me });
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
