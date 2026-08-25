
(function(){
  "use strict";

  var DEPARTMENTS = ["大豆部门","面筋部门","包装部门","QC部门","维修部门","HACCP部门","出货部门","人事部门","采购部门","其他部门"];

  var MODULES = {
    meetings:{
      key:"meetings", label:"会议记录", singular:"会议", idPrefix:"MTG", titleField:"title",
      badgeField:"meetingType",
      reportSections:[
        {key:"soyReport", short:"大豆"},
        {key:"glutenReport", short:"面筋"},
        {key:"packagingReport", short:"包装"},
        {key:"qcReport", short:"QC"},
        {key:"maintenanceReport", short:"维修"},
        {key:"haccpReport", short:"HACCP"},
        {key:"shippingReport", short:"出货"},
        {key:"hrReport", short:"人事"},
        {key:"procurementReport", short:"采购"},
        {key:"otherDeptReport", short:"其他"}
      ],
      fields:(function(){
        var routineOnly = function(r){ return !r || r.meetingType!=="检讨会议"; };
        return [
        {name:"meetingType", label:"会议类型", type:"select", options:["例常会议","检讨会议"], def:"例常会议", onchange:"app.onMeetingTypeChange()"},
        {name:"title", label:function(r){ return (r && r.meetingType==="检讨会议") ? "活动 / 产品名称" : "会议主题"; }, type:"text", required:true},
        {name:"date", label:"日期", type:"date", required:true},
        {name:"time", label:"时间", type:"time"},
        {name:"venue", label:"地点", type:"text"},
        {name:"department", label:"部门", type:"text", datalist:"deptList"},
        {name:"attendees", label:"出席人员（约 12–15 人，可逐行列出）", type:"textarea", full:true},
        {name:"absentees", label:"缺席人员", type:"text"},
        {name:"observers", label:"列席人员", type:"text", showIf:routineOnly},
        {name:"remarks", label:"备注", type:"text"},
        {type:"heading", text:"各部门汇报", showIf:routineOnly},
        {name:"soyReport", label:"大豆生产部门汇报", type:"textarea", full:true, showIf:routineOnly, placeholder:"产量 · 良率 · 异常情况 · 改进计划"},
        {name:"glutenReport", label:"面筋生产部门汇报", type:"textarea", full:true, showIf:routineOnly, placeholder:"产量 · 良率 · 异常情况 · 改进计划"},
        {name:"packagingReport", label:"包装部门汇报", type:"textarea", full:true, showIf:routineOnly, placeholder:"包装进度 · 物料损耗 · 异常情况 · 改进计划"},
        {name:"qcReport", label:"QC 部门汇报", type:"textarea", full:true, showIf:routineOnly, placeholder:"检验结果 · 不合格项 · 客户投诉 · 改进措施"},
        {name:"maintenanceReport", label:"维修部门汇报", type:"textarea", full:true, showIf:routineOnly, placeholder:"设备状况 · 维修记录 · 待处理故障 · 保养计划"},
        {name:"haccpReport", label:"HACCP 部门汇报", type:"textarea", full:true, showIf:routineOnly, placeholder:"食品安全监控结果 · 稽核情况 · 不符合项与纠正措施"},
        {name:"shippingReport", label:"出货部门汇报", type:"textarea", full:true, showIf:routineOnly, placeholder:"出货量 · 交期达成率 · 异常情况"},
        {name:"hrReport", label:"人事部门汇报", type:"textarea", full:true, showIf:routineOnly, placeholder:"人力配置 · 招聘/离职 · 培训 · 考勤异常"},
        {name:"procurementReport", label:"采购部门汇报", type:"textarea", full:true, showIf:routineOnly, placeholder:"原料采购进度 · 库存状况 · 供应商问题"},
        {name:"otherDeptReport", label:"其他部门汇报", type:"textarea", full:true, showIf:routineOnly, placeholder:"以上部门之外的事项"},
        {type:"heading", text:"讨论与建议事项", showIf:routineOnly},
        {name:"proposal", label:"提议 Proposal", type:"textarea", full:true, showIf:routineOnly, placeholder:"本次会议提出的议案 / 建议"},
        {name:"second", label:"附议 Second", type:"textarea", full:true, showIf:routineOnly, placeholder:"附议人及附议内容"},
        {type:"heading", text:"总结", showIf:routineOnly},
        {name:"summary", label:"总结内容", type:"textarea", full:true, showIf:routineOnly, placeholder:"会议总结与后续待办"},
        {name:"highlights", label:"值得嘉许 · 亮点（What Went Well）", type:"textarea", full:true, showIf:function(r){ return r && r.meetingType==="检讨会议"; }},
        {name:"improvements", label:"值得学习 · 待改进（What Can Be Learned）", type:"textarea", full:true, showIf:function(r){ return r && r.meetingType==="检讨会议"; }},
        {name:"metrics", label:"关键数据（出席人数 / 转化率 / 业绩等）", type:"textarea", full:true, showIf:function(r){ return r && r.meetingType==="检讨会议"; }},
        {name:"finance", label:"收支结算（收入 / 支出 / 损益）", type:"textarea", full:true, showIf:function(r){ return r && r.meetingType==="检讨会议"; }},
        {name:"actionPlan", label:"总结与行动计划", type:"textarea", full:true, showIf:function(r){ return r && r.meetingType==="检讨会议"; }},
        {name:"status", label:"状态", type:"select", options:["进行中","已完成","待跟进"], def:"进行中"}
        ];
      })(),
      statusColors:{"进行中":"accent","已完成":"good","待跟进":"seal"},
      extraBadge:function(r){
        if(r.meetingType === "检讨会议") return null;
        var keys = MODULES.meetings.reportSections.map(function(s){ return s.key; });
        var filled = keys.filter(function(k){ return r[k]; }).length;
        var color = filled === keys.length ? "good" : (filled === 0 ? "neutral" : "warn");
        return { text: filled+"/"+keys.length+" 已填写", color: color };
      },
      secondaryBadge:function(r){
        var count = (STATE.trackers||[]).filter(function(t){ return t.meetingRef === r.id; }).length;
        if(!count) return null;
        return { text: count+" 项追踪", color:"accent" };
      },
      metaLines:function(r){
        var head = [r.date, r.time, r.venue].filter(Boolean).join(" · ");
        var lines = [head, r.department ? "部门："+r.department : "", r.attendees ? "出席："+r.attendees : ""];
        if(r.meetingType === "检讨会议"){
          lines.push(r.highlights ? "亮点："+r.highlights : "");
          lines.push(r.actionPlan ? "行动计划："+r.actionPlan : "");
        } else {
          var pending = MODULES.meetings.reportSections.filter(function(s){ return !r[s.key]; }).map(function(s){ return s.short; });
          lines.push(pending.length ? ("待填写："+pending.join("、")) : "各部门均已填写");
        }
        return lines.filter(Boolean);
      },
      emptyText:'暂无会议记录，点击"新建会议"开始记录例常会议或检讨会议。'
    },
    sops:{
      key:"sops", label:"SOP 管理", singular:"SOP", idPrefix:"SOP", titleField:"title",
      attachmentField:"attachment",
      fields:[
        {name:"title", label:"标题", type:"text", required:true},
        {name:"category", label:"部门分类", type:"select", options:["大豆部门","面筋部门","QC部门","维修部门","人事部门","其他部门"], def:"大豆部门"},
        {name:"version", label:"版本", type:"text", def:"v1.0"},
        {name:"content", label:"内容 / 步骤", type:"textarea", full:true},
        {name:"docLink", label:"文档链接（云盘 / 企业微信 / 钉钉等，PDF/Word 请用此方式）", type:"text", placeholder:"https://...", full:true},
        {name:"attachment", type:"hidden"},
        {type:"file", label:"附件文件（图片 / PDF / Word 等，最大 4MB）", targetField:"attachment", accept:".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.webp,.txt", full:true},
        {name:"status", label:"状态", type:"select", options:["启用","草稿","停用"], def:"启用"}
      ],
      statusColors:{"启用":"good","草稿":"warn","停用":"neutral"},
      metaLines:function(r){
        return [
          [r.category, r.version].filter(Boolean).join(" · "),
          r.content || ""
        ].filter(Boolean);
      },
      emptyText:'暂无 SOP，点击"新建 SOP"添加第一份流程文档。'
    },
    staff:{
      key:"staff", label:"人员管理", singular:"人员", idPrefix:"STF", titleField:"name",
      fields:[
        {name:"name", label:"姓名", type:"text", required:true},
        {name:"department", label:"部门", type:"text", datalist:"deptList"},
        {name:"position", label:"职位", type:"text"},
        {name:"contact", label:"联系方式", type:"text"},
        {name:"entryDate", label:"入职日期", type:"date"},
        {name:"status", label:"状态", type:"select", options:["在职","休假中","离职"], def:"在职"}
      ],
      statusColors:{"在职":"good","休假中":"warn","离职":"neutral"},
      metaLines:function(r){
        return [
          [r.department, r.position].filter(Boolean).join(" · "),
          r.contact || ""
        ].filter(Boolean);
      },
      emptyText:'暂无人员记录，点击"新建人员"添加团队成员。'
    },
    damages:{
      key:"damages", label:"产品损毁记录", singular:"损毁记录", idPrefix:"DMG", titleField:"product",
      fields:[
        {name:"product", label:"产品名称 / 品项", type:"text", required:true},
        {name:"department", label:"部门", type:"select", options:DEPARTMENTS, def:"大豆部门"},
        {name:"date", label:"日期", type:"date", required:true},
        {name:"quantity", label:"损毁数量", type:"text"},
        {name:"reason", label:"损毁原因", type:"select", options:["包装破损","品质不合格","设备故障","过期 / 超期","客户退货","运输损坏","其他"], def:"包装破损"},
        {name:"reasonDetail", label:"详细说明", type:"textarea", full:true},
        {name:"lossValue", label:"预估损失（RM）", type:"text"},
        {name:"status", label:"处理状态", type:"select", options:["待处理","已处理","已上报"], def:"待处理"},
        {name:"notes", label:"处理备注", type:"textarea", full:true}
      ],
      statusColors:{"待处理":"warn","已处理":"good","已上报":"accent"},
      metaLines:function(r){
        return [
          [r.date, r.department].filter(Boolean).join(" · "),
          [r.quantity, r.reason].filter(Boolean).join(" · "),
          r.lossValue ? "预估损失：RM "+r.lossValue : "",
          r.notes || ""
        ].filter(Boolean);
      },
      emptyText:'暂无产品损毁记录，点击"新建记录"开始登记。'
    },
    trackers:{
      key:"trackers", label:"追踪记录", singular:"追踪事项", idPrefix:"TRK", titleField:"issue",
      fields:[
        {name:"department", label:"部门", type:"select", options:DEPARTMENTS, def:"大豆部门"},
        {name:"issue", label:"追踪事项", type:"text", required:true},
        {name:"meetingRef", label:"来源会议（可选）", type:"select", options:function(){
          var opts = [{value:"", label:"（无，直接新建）"}];
          STATE.meetings.slice().reverse().forEach(function(m){
            opts.push({value:m.id, label:m.id+" · "+(m.title||"未命名")+(m.date?(" ("+m.date+")"):"")});
          });
          return opts;
        }},
        {name:"owner", label:"负责人", type:"text"},
        {name:"dueDate", label:"预计完成日期", type:"date"},
        {name:"status", label:"状态", type:"select", options:["待处理","进行中","已完成","已延误"], def:"待处理"},
        {name:"notes", label:"进度备注", type:"textarea", full:true}
      ],
      statusColors:{"待处理":"warn","进行中":"accent","已完成":"good","已延误":"seal"},
      metaLines:function(r){
        var lines = [r.department ? "部门："+r.department : ""];
        if(r.meetingRef){
          var mm = STATE.meetings.find(function(x){ return x.id === r.meetingRef; });
          lines.push("来源会议："+(mm ? (mm.title||mm.id) : r.meetingRef));
        }
        lines.push([r.owner ? "负责人："+r.owner : "", r.dueDate ? "预计完成："+r.dueDate : ""].filter(Boolean).join(" · "));
        lines.push(r.notes || "");
        return lines.filter(Boolean);
      },
      emptyText:'暂无追踪事项。可以在会议记录里发现需要跟进的事，来这里新建并关联对应会议。'
    }
  };
  var NAV_ORDER = ["overview","meetings","sops","damages","trackers","staff","leaves"];
  var LEAVE_APP_URL = "https://exclwell-leave-app.vercel.app/";
  var EXTERNAL_VIEWS = {
    leaves: { label:"请假管理", url: LEAVE_APP_URL, title:"请假申请已迁移至独立系统",
      desc:"团队的请假申请、审批与记录统一在 exclwell 请假系统处理。点击下方按钮，在新标签页打开该系统提交或查看申请。",
      cta:"打开请假申请系统 ↗" }
  };

  var STATE = null, UI = null;
  var mode = "connecting"; // connecting | writer
  var transientStatus = null; // null | saving | error
  var toastTimer = null;
  var pollTimer = null;
  var MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024;

  function defaultState(){
    return { meetings:[], sops:[], staff:[], damages:[], trackers:[], counters:{MTG:0,SOP:0,STF:0,DMG:0,TRK:0} };
  }
  function defaultUI(){
    return { view:"overview", search:{meetings:"",sops:"",staff:"",damages:"",trackers:""}, modal:null, confirmDelete:null };
  }
  function deepClone(o){ return JSON.parse(JSON.stringify(o)); }
  function esc(s){
    return String(s == null ? "" : s)
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  }
  function writeDisabled(){ return (mode !== "writer" || transientStatus === "saving") ? "disabled" : ""; }

  function toast(msg){
    var root = document.getElementById("toast-root");
    if(!root) return;
    root.innerHTML = '<div class="toast">'+esc(msg)+'</div>';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ root.innerHTML=""; }, 3200);
  }

  /* ---------- attachments ---------- */

  function formatBytes(n){
    if(n == null) return "";
    if(n < 1024) return n+" B";
    if(n < 1024*1024) return (n/1024).toFixed(0)+" KB";
    return (n/1024/1024).toFixed(1)+" MB";
  }

  function renderFileStatus(name, size, isNew){
    return '<span class="file-chip">'+(isNew?"已选择：":"当前附件：")+esc(name)+'（'+formatBytes(size)+'）</span> '
      + '<button type="button" class="btn btn-ghost btn-sm" onclick="app.removeAttachment(this)">移除</button>';
  }

  function dataUrlToBlob(dataUrl){
    var comma = dataUrl.indexOf(",");
    var meta = dataUrl.slice(0, comma);
    var body = dataUrl.slice(comma+1);
    var mimeMatch = meta.match(/^data:([^;]+)/);
    var mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
    var binary = atob(body);
    var bytes = new Uint8Array(binary.length);
    for(var i=0;i<binary.length;i++){ bytes[i] = binary.charCodeAt(i); }
    return new Blob([bytes], {type: mime});
  }

  function handleFileSelect(event, inputEl){
    var file = event.target.files && event.target.files[0];
    if(!file) return;
    if(file.size > MAX_ATTACHMENT_BYTES){
      toast("文件太大，附件请控制在 4MB 以内");
      event.target.value = "";
      return;
    }
    var container = inputEl.closest(".file-field");
    if(!container) return;
    var targetName = container.getAttribute("data-target");
    var form = container.closest("form");
    var hidden = form ? form.elements[targetName] : null;
    var statusEl = container.querySelector(".file-status");
    var reader = new FileReader();
    reader.onload = function(){
      var payload = JSON.stringify({ name:file.name, type:file.type||"application/octet-stream", size:file.size, data:reader.result });
      if(hidden) hidden.value = payload;
      if(statusEl) statusEl.innerHTML = renderFileStatus(file.name, file.size, true);
    };
    reader.onerror = function(){ toast("文件读取失败，请重试"); };
    reader.readAsDataURL(file);
  }

  function removeAttachment(btn){
    var container = btn.closest(".file-field");
    if(!container) return;
    var targetName = container.getAttribute("data-target");
    var form = container.closest("form");
    var hidden = form ? form.elements[targetName] : null;
    if(hidden) hidden.value = "";
    var fileInput = container.querySelector(".file-input-native");
    if(fileInput) fileInput.value = "";
    var statusEl = container.querySelector(".file-status");
    if(statusEl) statusEl.innerHTML = '<span class="file-empty">未上传附件</span>';
  }

  function downloadAttachment(moduleKey, id, fieldName){
    var rec = (STATE[moduleKey]||[]).find(function(r){ return r.id === id; });
    if(!rec || !rec[fieldName]){ toast("找不到附件"); return; }
    var attach;
    try{ attach = JSON.parse(rec[fieldName]); }catch(err){ toast("附件数据损坏"); return; }
    try{
      var blob = dataUrlToBlob(attach.data);
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = attach.name || "attachment";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function(){ URL.revokeObjectURL(url); }, 4000);
    }catch(err){
      toast("下载失败，请重试");
    }
  }

  /* ---------- rendering ---------- */

  function statusBreakdown(arr, statuses){
    return statuses.map(function(s){ return s+" "+arr.filter(function(x){return x.status===s;}).length; }).join(" · ");
  }

  function renderSidebar(){
    var items = NAV_ORDER.map(function(key){
      var isOverview = key === "overview";
      var isExternal = !!EXTERNAL_VIEWS[key];
      var label = isOverview ? "总览" : (isExternal ? EXTERNAL_VIEWS[key].label : MODULES[key].label);
      var count = (isOverview || isExternal) ? null : STATE[key].length;
      var active = UI.view === key;
      return '<button class="nav-item '+(active?"nav-item-active":"")+'" onclick="app.setView(\''+key+'\')">'
        + '<span class="nav-label">'+esc(label)+'</span>'
        + (count!==null ? '<span class="nav-count num">'+count+'</span>' : (isExternal ? '<span class="nav-ext">外部 ↗</span>' : ''))
        + '</button>';
    }).join("");
    return '<div class="brand">团队档案台<span class="brand-sub">会议 · SOP · 人员 · 请假</span></div><nav class="nav">'+items+'</nav>';
  }

  function renderSaveStatus(){
    var map = {
      connecting:{text:"连接中…", cls:"pill-neutral"},
      writer:{text:"已连接 · 可编辑", cls:"pill-good"},
      saving:{text:"保存中…", cls:"pill-warn"},
      error:{text:"保存失败，请重试", cls:"pill-seal"}
    };
    var key = transientStatus || mode;
    var s = map[key] || map.connecting;
    return '<span class="save-pill '+s.cls+'">'+s.text+'</span>';
  }

  function renderBanner(){
    return "";
  }

  function fieldLabel(f, record){ return typeof f.label === "function" ? f.label(record) : f.label; }

  function renderField(f, value, record){
    if(f.type === "heading"){
      return '<div class="field-heading field-full">'+esc(f.text)+'</div>';
    }
    if(f.type === "hidden"){
      return '<input type="hidden" name="'+f.name+'" value="'+esc(value||"")+'">';
    }
    if(f.type === "file"){
      var current = null;
      var raw = record ? record[f.targetField] : null;
      if(raw){ try{ current = JSON.parse(raw); }catch(err){ current = null; } }
      var statusHtml = current ? renderFileStatus(current.name, current.size, false) : '<span class="file-empty">未上传附件</span>';
      return '<div class="field field-full"><span class="field-label">'+esc(fieldLabel(f,record))+'</span>'
        + '<div class="file-field" data-target="'+f.targetField+'">'
        + '<input type="file" class="file-input-native" accept="'+(f.accept||"")+'" onchange="app.handleFileSelect(event, this)">'
        + '<div class="file-status">'+statusHtml+'</div>'
        + '</div></div>';
    }
    var val = value != null ? value : (f.def != null ? f.def : "");
    var req = f.required ? "required" : "";
    var cls = "field" + (f.full ? " field-full" : "");
    var onchangeAttr = f.onchange ? ('onchange="'+f.onchange+'"') : "";
    var placeholderAttr = f.placeholder ? ('placeholder="'+esc(f.placeholder)+'"') : "";
    var html;
    if(f.type === "textarea"){
      html = '<textarea class="input" name="'+f.name+'" rows="3" '+req+' '+onchangeAttr+' '+placeholderAttr+'>'+esc(val)+'</textarea>';
    } else if(f.type === "select"){
      var opts = typeof f.options === "function" ? f.options() : f.options;
      html = '<select class="input" name="'+f.name+'" '+req+' '+onchangeAttr+'>' + opts.map(function(o){
        var ov = (o && typeof o === "object") ? o.value : o;
        var ol = (o && typeof o === "object") ? o.label : o;
        return '<option value="'+esc(ov)+'" '+(ov===val?"selected":"")+'>'+esc(ol)+'</option>';
      }).join("") + '</select>';
    } else if(f.type === "date"){
      html = '<input class="input" type="date" name="'+f.name+'" value="'+esc(val)+'" '+req+' '+onchangeAttr+'>';
    } else if(f.type === "time"){
      html = '<input class="input" type="time" name="'+f.name+'" value="'+esc(val)+'" '+req+' '+onchangeAttr+'>';
    } else if(f.type === "number"){
      html = '<input class="input" type="number" name="'+f.name+'" value="'+esc(val)+'" '+req+' '+onchangeAttr+'>';
    } else {
      var listAttr = f.datalist ? ('list="'+f.datalist+'"') : "";
      html = '<input class="input" type="text" name="'+f.name+'" value="'+esc(val)+'" '+req+' '+listAttr+' '+onchangeAttr+' '+placeholderAttr+'>';
    }
    return '<label class="'+cls+'"><span class="field-label">'+esc(fieldLabel(f,record))+(f.required?" *":"")+'</span>'+html+'</label>';
  }

  function renderModal(){
    if(UI.confirmDelete){
      var mod0 = MODULES[UI.confirmDelete.module];
      var rec0 = STATE[UI.confirmDelete.module].find(function(r){ return r.id === UI.confirmDelete.id; });
      var label0 = rec0 ? (rec0[mod0.titleField] || rec0.id) : UI.confirmDelete.id;
      return '<div class="overlay" onclick="app.cancelDelete()"><div class="modal modal-sm" onclick="event.stopPropagation()">'
        + '<h3 class="modal-title">确认删除</h3>'
        + '<p class="modal-text">确定要删除"'+esc(label0)+'"吗？此操作无法撤销。</p>'
        + '<div class="modal-actions"><button class="btn btn-ghost" onclick="app.cancelDelete()">取消</button>'
        + '<button class="btn btn-danger" onclick="app.confirmDeleteNow()">确认删除</button></div>'
        + '</div></div>';
    }
    if(!UI.modal) return "";
    var mod = MODULES[UI.modal.module];
    var baseRecord = UI.modal.id ? STATE[UI.modal.module].find(function(r){ return r.id === UI.modal.id; }) : null;
    var isEdit = !!baseRecord;
    var record = baseRecord ? Object.assign({}, baseRecord) : {};
    if(UI.modal.draft) record = Object.assign({}, record, UI.modal.draft);
    var visibleFields = mod.fields.filter(function(f){ return !f.showIf || f.showIf(record); });
    var deptList = Array.from(new Set(DEPARTMENTS.concat(STATE.staff.map(function(s){return s.department;}).filter(Boolean))));
    var heading = (isEdit ? "编辑" : "新建") + mod.singular + (isEdit ? ("　"+baseRecord.id) : "");
    return '<div class="overlay" onclick="app.closeModal()"><div class="modal" onclick="event.stopPropagation()">'
      + '<h3 class="modal-title">'+esc(heading)+'</h3>'
      + '<form id="record-form" onsubmit="app.submitForm(event,\''+mod.key+'\')">'
      + '<div class="form-grid">' + visibleFields.map(function(f){ return renderField(f, record[f.name], record); }).join("") + '</div>'
      + '<div class="modal-actions"><button type="button" class="btn btn-ghost" onclick="app.closeModal()">取消</button>'
      + '<button type="submit" class="btn btn-primary">保存</button></div>'
      + '</form>'
      + '<datalist id="deptList">'+deptList.map(function(d){return '<option value="'+esc(d)+'">';}).join("")+'</datalist>'
      + '</div></div>';
  }

  function renderCard(mod, r){
    var colorKey = mod.statusColors[r.status] || "neutral";
    var wd = writeDisabled();
    var badge = (mod.badgeField && r[mod.badgeField]) ? '<span class="chip chip-outline">'+esc(r[mod.badgeField])+'</span>' : '';
    var extra = mod.extraBadge ? mod.extraBadge(r) : null;
    var extraChip = extra ? '<span class="chip chip-'+extra.color+'">'+esc(extra.text)+'</span>' : '';
    var secondary = mod.secondaryBadge ? mod.secondaryBadge(r) : null;
    var secondaryChip = secondary ? '<span class="chip chip-'+secondary.color+'">'+esc(secondary.text)+'</span>' : '';
    var attach = null;
    if(mod.attachmentField && r[mod.attachmentField]){
      try{ attach = JSON.parse(r[mod.attachmentField]); }catch(err){ attach = null; }
    }
    var attachHtml = "";
    if(attach){
      if(attach.type && attach.type.indexOf("image/") === 0){
        attachHtml = '<div class="card-attachment"><img class="card-attach-img" src="'+attach.data+'" alt="'+esc(attach.name)+'"></div>';
      } else {
        attachHtml = '<div class="card-attachment"><button type="button" class="btn btn-ghost btn-sm" onclick="app.downloadAttachment(\''+mod.key+'\',\''+r.id+'\',\''+mod.attachmentField+'\')">下载附件：'+esc(attach.name)+'</button></div>';
      }
    }
    var docLinkHtml = "";
    if(r.docLink){
      docLinkHtml = '<div class="card-attachment"><a class="btn btn-ghost btn-sm" href="'+esc(r.docLink)+'" target="_blank" rel="noopener noreferrer">📄 打开文档链接</a></div>';
    }
    return '<div class="card" style="--card-color:var(--'+colorKey+')">'
      + '<div class="card-top"><span class="card-id num">'+esc(r.id)+'</span><div class="card-top-chips">'+badge+extraChip+secondaryChip+'<span class="chip chip-'+colorKey+'">'+esc(r.status||"")+'</span></div></div>'
      + '<h3 class="card-title">'+esc(r[mod.titleField] || "(未命名)")+'</h3>'
      + '<div class="card-meta">' + mod.metaLines(r).map(function(l){ return '<p>'+esc(l)+'</p>'; }).join("") + '</div>'
      + docLinkHtml
      + attachHtml
      + '<div class="card-actions">'
      + '<button class="btn btn-ghost btn-sm" onclick="app.openModal(\''+mod.key+'\',\''+r.id+'\')" '+wd+'>编辑</button>'
      + '<button class="btn btn-danger btn-sm" onclick="app.requestDelete(\''+mod.key+'\',\''+r.id+'\')" '+wd+'>删除</button>'
      + '</div></div>';
  }

  function getFiltered(moduleKey){
    var q = (UI.search[moduleKey] || "").trim().toLowerCase();
    var arr = STATE[moduleKey];
    if(!q) return arr;
    return arr.filter(function(r){
      return Object.keys(r).some(function(k){ return String(r[k]||"").toLowerCase().indexOf(q) > -1; });
    });
  }

  function renderModuleView(moduleKey){
    var mod = MODULES[moduleKey];
    var list = getFiltered(moduleKey).slice().reverse();
    var wd = writeDisabled();
    return '<div class="view-header">'
      + '<h2 class="view-title">'+esc(mod.label)+' <span class="view-count num">'+STATE[moduleKey].length+'</span></h2>'
      + '<div class="view-tools">'
      + '<input class="input search-input" type="text" placeholder="搜索'+esc(mod.label)+'…" value="'+esc(UI.search[moduleKey]||"")+'" oninput="app.setSearch(\''+moduleKey+'\', this.value)">'
      + '<button class="btn btn-primary" onclick="app.openModal(\''+moduleKey+'\', null)" '+wd+'>+ 新建'+esc(mod.singular)+'</button>'
      + '</div></div>'
      + (list.length
          ? '<div class="card-grid">' + list.map(function(r){ return renderCard(mod, r); }).join("") + '</div>'
          : '<div class="empty-state">'+esc(mod.emptyText)+'</div>');
  }

  function renderStatCard(c){
    if(c.link){
      return '<a class="stat-card stat-card-link" href="'+esc(c.link)+'" target="_blank" rel="noopener noreferrer">'
        + '<div class="stat-num stat-num-arrow">↗</div>'
        + '<div class="stat-label">'+esc(c.label)+'</div>'
        + '<div class="stat-sub">'+esc(c.sub||"")+'</div>'
        + '</a>';
    }
    return '<div class="stat-card '+(c.highlight?"stat-card-alert":"")+'">'
      + '<div class="stat-num">'+c.big+'</div>'
      + '<div class="stat-label">'+esc(c.label)+'</div>'
      + '<div class="stat-sub">'+esc(c.sub||"")+'</div>'
      + '</div>';
  }

  function renderOverview(){
    var m = STATE.meetings, s = STATE.sops, st = STATE.staff, d = STATE.damages, t = STATE.trackers;
    var dPending = d.filter(function(x){ return x.status === "待处理"; });
    var tOpen = t.filter(function(x){ return x.status !== "已完成"; });
    var tOverdue = t.filter(function(x){ return x.status === "已延误"; });
    var cards = [
      {label:"会议记录", big:m.length, sub: m.length ? statusBreakdown(m,["进行中","已完成","待跟进"]) : "尚无记录"},
      {label:"SOP 文档", big:s.length, sub: s.length ? statusBreakdown(s,["启用","草稿","停用"]) : "尚无记录"},
      {label:"产品损毁记录", big: dPending.length, sub: "共 "+d.length+" 条记录", highlight: dPending.length>0},
      {label:"追踪记录", big: tOpen.length, sub: tOverdue.length ? ("共 "+t.length+" 条 · 已延误 "+tOverdue.length) : ("共 "+t.length+" 条"), highlight: tOverdue.length>0},
      {label:"在职人员", big: st.filter(function(x){return x.status==="在职";}).length, sub: "共 "+st.length+" 人"},
      {label:"请假申请", link: LEAVE_APP_URL, sub:"前往 exclwell 系统"}
    ];
    return '<div class="view-header"><h2 class="view-title">总览</h2></div>'
      + '<div class="stat-grid">' + cards.map(renderStatCard).join("") + '</div>';
  }

  function renderExternalEntry(key){
    var ext = EXTERNAL_VIEWS[key];
    return '<div class="view-header"><h2 class="view-title">'+esc(ext.label)+'</h2></div>'
      + '<div class="panel external-panel">'
      + '<h3 class="panel-title">'+esc(ext.title)+'</h3>'
      + '<p class="external-desc">'+esc(ext.desc)+'</p>'
      + '<a class="btn btn-primary" href="'+esc(ext.url)+'" target="_blank" rel="noopener noreferrer">'+esc(ext.cta)+'</a>'
      + '</div>';
  }

  function render(){
    var root = document.getElementById("app-root");
    var body = UI.view === "overview" ? renderOverview()
      : EXTERNAL_VIEWS[UI.view] ? renderExternalEntry(UI.view)
      : renderModuleView(UI.view);
    root.innerHTML = '<div class="app-shell">'
      + '<aside class="sidebar">'+renderSidebar()+'</aside>'
      + '<main class="main">'
      + '<div class="main-topbar">'+renderSaveStatus()+'</div>'
      + renderBanner()
      + body
      + '</main></div>'
      + renderModal();
  }

  /* ---------- actions ---------- */

  function setView(key){ UI.view = key; UI.modal = null; UI.confirmDelete = null; render(); }
  function setSearch(moduleKey, value){ UI.search[moduleKey] = value; render(); }
  function openModal(moduleKey, id){ UI.modal = {module:moduleKey, id: id || null}; render(); }
  function closeModal(){ UI.modal = null; render(); }
  function requestDelete(moduleKey, id){ UI.confirmDelete = {module:moduleKey, id:id}; render(); }
  function cancelDelete(){ UI.confirmDelete = null; render(); }

  function onMeetingTypeChange(){
    var form = document.getElementById("record-form");
    if(!form || !UI.modal) return;
    var draft = {};
    MODULES.meetings.fields.forEach(function(f){
      if(!f.name) return;
      var el = form.elements[f.name];
      if(el) draft[f.name] = el.value;
    });
    UI.modal.draft = draft;
    render();
  }

  function submitForm(e, moduleKey){
    e.preventDefault();
    var mod = MODULES[moduleKey];
    var form = e.target;
    var data = {};
    mod.fields.forEach(function(f){
      if(!f.name) return;
      var el = form.elements[f.name];
      if(el) data[f.name] = String(el.value).trim();
    });
    for(var i=0;i<mod.fields.length;i++){
      var f = mod.fields[i];
      if(!f.name) continue;
      var el = form.elements[f.name];
      if(f.required && el && !data[f.name]){ toast('请填写"'+fieldLabel(f, data)+'"'); return; }
    }
    var editingId = UI.modal && UI.modal.id;
    var before = deepClone(STATE);
    var record;
    if(editingId){
      var arr = STATE[moduleKey];
      var idx = arr.findIndex(function(r){ return r.id === editingId; });
      record = Object.assign({}, data, {id:editingId});
      if(idx > -1) arr[idx] = Object.assign({}, arr[idx], record);
    } else {
      record = data;
      STATE[moduleKey].push(Object.assign({id:"（保存中…）"}, data));
    }
    UI.modal = null;
    render();
    saveOp({op:"upsert", module:moduleKey, record:record}, before);
  }

  function confirmDeleteNow(){
    if(!UI.confirmDelete) return;
    var moduleKey = UI.confirmDelete.module, id = UI.confirmDelete.id;
    var before = deepClone(STATE);
    STATE[moduleKey] = STATE[moduleKey].filter(function(r){ return r.id !== id; });
    UI.confirmDelete = null;
    render();
    saveOp({op:"delete", module:moduleKey, id:id}, before);
  }

  /* ---------- persistence ---------- */

  function applyServerState(state){
    STATE = state;
    if(!STATE.counters) STATE.counters = {MTG:0,SOP:0,STF:0,DMG:0,TRK:0};
    if(!STATE.damages) STATE.damages = [];
    if(!STATE.trackers) STATE.trackers = [];
  }

  function setTransient(status){
    transientStatus = status;
    render();
    if(status === "error"){
      setTimeout(function(){ if(transientStatus === "error"){ transientStatus = null; render(); } }, 3000);
    }
  }

  function saveOp(op, before){
    setTransient("saving");
    fetch("/api/state", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify(op)
    }).then(function(res){
      if(res.status === 401){
        showLogin("登录已过期，请重新输入团队密码。");
        throw new Error("__unauthorized__");
      }
      if(!res.ok){ throw new Error("save_failed"); }
      return res.json();
    }).then(function(json){
      applyServerState(json.state);
      transientStatus = null;
      render();
    }).catch(function(err){
      if(err && err.message === "__unauthorized__") return;
      STATE = before;
      toast("保存失败：" + ((err && err.message) || "请检查网络后重试"));
      setTransient("error");
    });
  }

  function fetchState(){
    return fetch("/api/state").then(function(res){
      if(res.status === 401){ return null; }
      if(!res.ok){ throw new Error("load_failed"); }
      return res.json();
    });
  }

  function pollState(){
    if(UI && UI.modal) return; // don't disrupt someone mid-edit
    fetchState().then(function(json){
      if(!json) return;
      applyServerState(json.state);
      render();
    }).catch(function(){});
  }

  /* ---------- login gate ---------- */

  function renderLogin(msg){
    document.getElementById("app-root").innerHTML = "";
    var root = document.getElementById("login-root");
    root.innerHTML = '<div class="login-gate"><div class="login-card">'
      + '<h2 class="login-title">团队档案台</h2>'
      + '<p class="login-sub">请输入团队共用密码进入</p>'
      + '<form id="login-form" onsubmit="app.submitLogin(event)">'
      + '<input class="input login-input" type="password" name="pin" placeholder="团队密码" autofocus>'
      + '<p class="login-error">'+esc(msg||"")+'</p>'
      + '<button type="submit" class="btn btn-primary login-btn">进入</button>'
      + '</form></div></div>';
    var input = root.querySelector('input[name="pin"]');
    if(input) input.focus();
  }

  function showLogin(msg){ mode = "connecting"; renderLogin(msg); }
  function hideLogin(){ document.getElementById("login-root").innerHTML = ""; }

  function submitLogin(e){
    e.preventDefault();
    var form = e.target;
    var pin = form.elements["pin"].value;
    var btn = form.querySelector('button[type="submit"]');
    if(btn) btn.disabled = true;
    fetch("/api/login", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({pin:pin})
    }).then(function(res){
      if(!res.ok){ throw new Error(res.status === 401 ? "密码错误，请重试" : "登录失败，请重试"); }
      return res.json();
    }).then(function(){
      hideLogin();
      boot();
    }).catch(function(err){
      renderLogin(err.message || "登录失败，请重试");
    });
  }

  /* ---------- boot ---------- */

  function boot(){
    mode = "connecting";
    UI = defaultUI();
    document.getElementById("app-root").innerHTML = '<div class="app-loading">加载中…</div>';
    fetchState().then(function(json){
      if(!json){
        showLogin();
        return;
      }
      applyServerState(json.state);
      mode = "writer";
      render();
      if(pollTimer) clearInterval(pollTimer);
      pollTimer = setInterval(pollState, 20000);
    }).catch(function(){
      document.getElementById("app-root").innerHTML = '<div class="app-loading">加载失败，请刷新页面重试</div>';
    });
  }

  window.app = {
    setView: setView, setSearch: setSearch, openModal: openModal, closeModal: closeModal,
    requestDelete: requestDelete, cancelDelete: cancelDelete, confirmDeleteNow: confirmDeleteNow,
    submitForm: submitForm, onMeetingTypeChange: onMeetingTypeChange,
    handleFileSelect: handleFileSelect, removeAttachment: removeAttachment, downloadAttachment: downloadAttachment,
    submitLogin: submitLogin
  };

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
