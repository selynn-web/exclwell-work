
(function(){
  "use strict";

  var DEPARTMENTS = ["大豆部门","面筋部门","包装部门","QC部门","维修部门","HACCP部门","出货部门","人事部门","采购部门","其他部门"];

  var MODULES = {
    meetings:{
      key:"meetings", label:"会议记录", singular:"会议", idPrefix:"MTG", titleField:"title",
      badgeField:"meetingType",
      reportSections:[
        {itemsKey:"soyReportItems", short:"大豆"},
        {itemsKey:"glutenReportItems", short:"面筋"},
        {itemsKey:"packagingReportItems", short:"包装"},
        {itemsKey:"qcReportItems", short:"QC"},
        {itemsKey:"maintenanceReportItems", short:"维修"},
        {itemsKey:"haccpReportItems", short:"HACCP"},
        {itemsKey:"shippingReportItems", short:"出货"},
        {itemsKey:"hrReportItems", short:"人事"},
        {itemsKey:"procurementReportItems", short:"采购"},
        {itemsKey:"otherDeptReportItems", short:"其他"}
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
        {type:"heading", text:"各部门汇报（可自由添加多项事项，每项可单独标记是否追踪）", showIf:routineOnly},
        {name:"soyReportItems", type:"hidden"},
        {type:"itemlist", label:"大豆生产部门汇报", targetField:"soyReportItems", showIf:routineOnly, full:true, placeholder:"产量 · 良率 · 异常情况 · 改进计划"},
        {name:"glutenReportItems", type:"hidden"},
        {type:"itemlist", label:"面筋生产部门汇报", targetField:"glutenReportItems", showIf:routineOnly, full:true, placeholder:"产量 · 良率 · 异常情况 · 改进计划"},
        {name:"packagingReportItems", type:"hidden"},
        {type:"itemlist", label:"包装部门汇报", targetField:"packagingReportItems", showIf:routineOnly, full:true, placeholder:"包装进度 · 物料损耗 · 异常情况 · 改进计划"},
        {name:"qcReportItems", type:"hidden"},
        {type:"itemlist", label:"QC 部门汇报", targetField:"qcReportItems", showIf:routineOnly, full:true, placeholder:"检验结果 · 不合格项 · 客户投诉 · 改进措施"},
        {name:"maintenanceReportItems", type:"hidden"},
        {type:"itemlist", label:"维修部门汇报", targetField:"maintenanceReportItems", showIf:routineOnly, full:true, placeholder:"设备状况 · 维修记录 · 待处理故障 · 保养计划"},
        {name:"haccpReportItems", type:"hidden"},
        {type:"itemlist", label:"HACCP 部门汇报", targetField:"haccpReportItems", showIf:routineOnly, full:true, placeholder:"食品安全监控结果 · 稽核情况 · 不符合项与纠正措施"},
        {name:"shippingReportItems", type:"hidden"},
        {type:"itemlist", label:"出货部门汇报", targetField:"shippingReportItems", showIf:routineOnly, full:true, placeholder:"出货量 · 交期达成率 · 异常情况"},
        {name:"hrReportItems", type:"hidden"},
        {type:"itemlist", label:"人事部门汇报", targetField:"hrReportItems", showIf:routineOnly, full:true, placeholder:"人力配置 · 招聘/离职 · 培训 · 考勤异常"},
        {name:"procurementReportItems", type:"hidden"},
        {type:"itemlist", label:"采购部门汇报", targetField:"procurementReportItems", showIf:routineOnly, full:true, placeholder:"原料采购进度 · 库存状况 · 供应商问题"},
        {name:"otherDeptReportItems", type:"hidden"},
        {type:"itemlist", label:"其他部门汇报", targetField:"otherDeptReportItems", showIf:routineOnly, full:true, placeholder:"以上部门之外的事项"},
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
        var secs = MODULES.meetings.reportSections;
        var filled = secs.filter(function(s){ return itemsWithText(r[s.itemsKey]).length > 0; }).length;
        var color = filled === secs.length ? "good" : (filled === 0 ? "neutral" : "warn");
        var needTrack = 0;
        secs.forEach(function(s){ needTrack += itemsWithText(r[s.itemsKey]).filter(function(it){ return it.track; }).length; });
        var text = filled+"/"+secs.length+" 已填写";
        if(needTrack){ text += " · 需追踪 "+needTrack; color = "warn"; }
        return { text: text, color: color };
      },
      secondaryBadge:function(r){
        var count = (STATE.trackers||[]).filter(function(t){ return t.meetingRef === r.id; }).length;
        if(!count) return null;
        return { text: count+" 项追踪", color:"accent" };
      },
      extraActions:function(r){
        var needTrack = 0;
        MODULES.meetings.reportSections.forEach(function(s){ needTrack += itemsWithText(r[s.itemsKey]).filter(function(it){ return it.track; }).length; });
        if(!needTrack) return [];
        return [{ label:"查看追踪 ("+needTrack+")", onclick:"app.setView('trackers')" }];
      },
      metaLines:function(r){
        var head = [r.date, r.time, r.venue].filter(Boolean).join(" · ");
        var lines = [head, r.department ? "部门："+r.department : "", r.attendees ? "出席："+r.attendees : ""];
        if(r.meetingType === "检讨会议"){
          lines.push(r.highlights ? "亮点："+r.highlights : "");
          lines.push(r.actionPlan ? "行动计划："+r.actionPlan : "");
        } else {
          var pending = MODULES.meetings.reportSections.filter(function(s){ return itemsWithText(r[s.itemsKey]).length === 0; }).map(function(s){ return s.short; });
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
        {name:"notes", label:"进度备注", type:"textarea", full:true},
        {name:"sourceItem", type:"hidden"}
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
    },
    inspections:{
      key:"inspections", label:"检验记录", singular:"检验记录", idPrefix:"INS", titleField:"product",
      badgeField:"inspType",
      fields:[
        {name:"inspType", label:"检验类型", type:"select", options:["来料检验","制程检验","成品检验"], def:"来料检验"},
        {name:"product", label:"产品 / 物料名称", type:"text", required:true},
        {name:"batchNo", label:"批号", type:"text"},
        {name:"date", label:"检验日期", type:"date", required:true},
        {name:"inspector", label:"检验员", type:"text"},
        {name:"checkItems", label:"检验项目 / 标准", type:"textarea", full:true, placeholder:"外观 · 重量 · 水分 · 微生物指标等"},
        {name:"result", label:"检验结果", type:"select", options:["合格","不合格","待复检"], def:"合格"},
        {name:"nonConformNote", label:"不合格说明 / 处理方式", type:"textarea", full:true},
        {name:"status", label:"处理状态", type:"select", options:["待处理","跟进中","已关闭"], def:"待处理"}
      ],
      statusColors:{"待处理":"warn","跟进中":"accent","已关闭":"good"},
      extraBadge:function(r){
        var color = r.result === "合格" ? "good" : (r.result === "不合格" ? "seal" : "warn");
        return r.result ? { text:r.result, color:color } : null;
      },
      metaLines:function(r){
        return [
          [r.date, r.batchNo ? ("批号："+r.batchNo) : ""].filter(Boolean).join(" · "),
          r.inspector ? "检验员："+r.inspector : "",
          r.checkItems || "",
          r.nonConformNote || ""
        ].filter(Boolean);
      },
      emptyText:'暂无检验记录，点击"新建检验记录"登记来料 / 制程 / 成品检验结果。'
    },
    complaints:{
      key:"complaints", label:"客户投诉记录", singular:"投诉记录", idPrefix:"CPL", titleField:"customer",
      badgeField:"severity",
      fields:[
        {name:"customer", label:"客户名称", type:"text", required:true},
        {name:"product", label:"产品 / 批号", type:"text"},
        {name:"date", label:"投诉日期", type:"date", required:true},
        {name:"channel", label:"投诉渠道", type:"select", options:["电话","微信 / 邮件","现场","其他"], def:"电话"},
        {name:"description", label:"投诉内容", type:"textarea", full:true, required:true},
        {name:"severity", label:"严重程度", type:"select", options:["轻微","一般","严重"], def:"一般"},
        {name:"owner", label:"负责人", type:"text"},
        {name:"handling", label:"处理措施", type:"textarea", full:true},
        {name:"status", label:"处理状态", type:"select", options:["待处理","处理中","已完成"], def:"待处理"}
      ],
      statusColors:{"待处理":"warn","处理中":"accent","已完成":"good"},
      metaLines:function(r){
        return [
          [r.date, r.channel].filter(Boolean).join(" · "),
          r.product ? "产品：" +r.product : "",
          r.description || "",
          r.handling ? "处理："+r.handling : ""
        ].filter(Boolean);
      },
      emptyText:'暂无客户投诉记录，点击"新建投诉记录"登记。'
    },
    calibrations:{
      key:"calibrations", label:"设备校准记录", singular:"校准记录", idPrefix:"CAL", titleField:"equipment",
      badgeField:"type",
      fields:[
        {name:"equipment", label:"设备名称", type:"text", required:true},
        {name:"type", label:"类型", type:"select", options:["校准","保养","维修"], def:"校准"},
        {name:"date", label:"执行日期", type:"date", required:true},
        {name:"nextDueDate", label:"下次到期日期", type:"date"},
        {name:"vendor", label:"执行单位 / 人员", type:"text"},
        {name:"result", label:"结果 / 备注", type:"textarea", full:true},
        {name:"status", label:"状态", type:"select", options:["正常","即将到期","已过期"], def:"正常"}
      ],
      statusColors:{"正常":"good","即将到期":"warn","已过期":"seal"},
      extraBadge:function(r){
        if(!r.nextDueDate) return null;
        var due = new Date(r.nextDueDate+"T00:00:00");
        if(isNaN(due.getTime())) return null;
        var today = new Date(); today.setHours(0,0,0,0);
        var days = Math.round((due-today)/86400000);
        if(days < 0) return { text:"已逾期 "+Math.abs(days)+" 天", color:"seal" };
        if(days <= 14) return { text:days+" 天后到期", color:"warn" };
        return { text:days+" 天后到期", color:"good" };
      },
      metaLines:function(r){
        return [
          [r.date, r.vendor].filter(Boolean).join(" · "),
          r.nextDueDate ? "下次到期："+r.nextDueDate : "",
          r.result || ""
        ].filter(Boolean);
      },
      emptyText:'暂无设备校准 / 保养记录，点击"新建校准记录"登记。'
    },
    traces:{
      key:"traces", label:"批次追溯", singular:"追溯记录", idPrefix:"TRC", titleField:"productBatch",
      fields:[
        {name:"productBatch", label:"生产批号", type:"text", required:true},
        {name:"product", label:"产品名称", type:"text", required:true},
        {name:"productionDate", label:"生产日期", type:"date"},
        {name:"rawBatches", label:"对应原料批号", type:"textarea", full:true, placeholder:"大豆批号 XXX · 包装材料批号 XXX 等，可逐行列出"},
        {name:"shipBatches", label:"对应出货批号 / 客户", type:"textarea", full:true, placeholder:"出货批号、发往客户、数量等"},
        {name:"notes", label:"备注", type:"textarea", full:true},
        {name:"status", label:"状态", type:"select", options:["生产中","已出货","已封存"], def:"生产中"}
      ],
      statusColors:{"生产中":"accent","已出货":"good","已封存":"neutral"},
      metaLines:function(r){
        return [
          [r.product, r.productionDate].filter(Boolean).join(" · "),
          r.rawBatches ? "原料批号："+r.rawBatches : "",
          r.shipBatches ? "出货批号："+r.shipBatches : ""
        ].filter(Boolean);
      },
      emptyText:'暂无批次追溯记录，点击"新建追溯记录"登记原料到出货的批号对应关系。'
    }
  };
  var NAV_ORDER = ["overview","meetings","sops","inspections","complaints","calibrations","traces","damages","trackers","staff","leaves","accounts"];
  var LEAVE_APP_URL = "https://exclwell-leave-app.vercel.app/";
  var EXTERNAL_VIEWS = {
    leaves: { label:"请假管理", url: LEAVE_APP_URL, title:"请假申请已迁移至独立系统",
      desc:"团队的请假申请、审批与记录统一在 exclwell 请假系统处理。点击下方按钮，在新标签页打开该系统提交或查看申请。",
      cta:"打开请假申请系统 ↗" }
  };
  var INTERNAL_VIEWS = {
    accounts: { label:"账号管理" }
  };
  // Modules an account can be restricted to a subset of — mirrors
  // api/_auth.js's RESTRICTABLE_MODULES. "overview" and "leaves" are
  // never restricted.
  var RESTRICTABLE_MODULES = ["meetings","sops","inspections","complaints","calibrations","traces","damages","trackers","staff","accounts"];
  function moduleLabel(key){
    if(MODULES[key]) return MODULES[key].label;
    if(INTERNAL_VIEWS[key]) return INTERNAL_VIEWS[key].label;
    return key;
  }
  function isModuleAllowed(key){
    // "overview" and "leaves" are never restrictable (see RESTRICTABLE_MODULES
    // above) — they're never offered as checkboxes, so they'd never appear in
    // an account's allowedModules array. Without this check they'd wrongly
    // look "not allowed" for every restricted account and vanish from the nav.
    if(RESTRICTABLE_MODULES.indexOf(key) === -1) return true;
    if(!CURRENT_USER || !Array.isArray(CURRENT_USER.allowedModules)) return true;
    return CURRENT_USER.allowedModules.indexOf(key) > -1;
  }

  var STATE = null, UI = null;
  var mode = "connecting"; // connecting | writer
  var transientStatus = null; // null | saving | error
  var toastTimer = null;
  var pollTimer = null;
  var MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024;
  var CURRENT_USER = null;
  var ACCOUNTS = { list:null, loading:false, error:null, editingId:null };

  function defaultState(){
    return {
      meetings:[], sops:[], staff:[], damages:[], trackers:[],
      inspections:[], complaints:[], calibrations:[], traces:[],
      counters:{MTG:0,SOP:0,STF:0,DMG:0,TRK:0,INS:0,CPL:0,CAL:0,TRC:0}
    };
  }
  function defaultUI(){
    return {
      view:"overview",
      search:{meetings:"",sops:"",staff:"",damages:"",trackers:"",inspections:"",complaints:"",calibrations:"",traces:""},
      modal:null, confirmDelete:null
    };
  }
  function deepClone(o){ return JSON.parse(JSON.stringify(o)); }
  function esc(s){
    return String(s == null ? "" : s)
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  }
  function writeDisabled(){ return (mode !== "writer" || transientStatus === "saving") ? "disabled" : ""; }

  /* ---------- report item-list helpers (department reports with per-item tracking) ---------- */

  function parseItems(raw){
    if(!raw) return [];
    try{
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    }catch(err){ return []; }
  }
  function itemsWithText(raw){
    return parseItems(raw).filter(function(it){ return it && String(it.text||"").trim(); });
  }
  function newItemId(){
    return "itm-" + Date.now().toString(36) + Math.random().toString(36).slice(2,7);
  }

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

  function renderItemRow(item){
    var id = (item && item.id) || newItemId();
    var text = (item && item.text) || "";
    var track = !!(item && item.track);
    return '<div class="item-row" data-id="'+esc(id)+'">'
      + '<textarea class="input item-text" rows="2" placeholder="填写事项内容…" oninput="app.syncReportItems(this)">'+esc(text)+'</textarea>'
      + '<label class="item-track-toggle"><input type="checkbox" class="item-track" '+(track?"checked":"")+' onchange="app.syncReportItems(this)"> 需要追踪</label>'
      + '<button type="button" class="btn btn-ghost btn-sm item-remove" onclick="app.removeReportItem(this)">删除</button>'
      + '</div>';
  }

  function renderItemListField(f, record){
    var raw = record ? record[f.targetField] : null;
    var items = parseItems(raw);
    if(!items.length) items = [{id:newItemId(), text:"", track:false}];
    var rows = items.map(renderItemRow).join("");
    return '<div class="field field-full item-list-field" data-placeholder="'+esc(f.placeholder||"")+'">'
      + '<span class="field-label">'+esc(fieldLabel(f,record))+'</span>'
      + '<div class="item-list" data-target="'+f.targetField+'">'+rows+'</div>'
      + '<button type="button" class="btn btn-ghost btn-sm item-add-btn" onclick="app.addReportItem(this)">+ 添加事项</button>'
      + '</div>';
  }

  function readItemsFromContainer(container){
    var rows = container.querySelectorAll(".item-row");
    var items = [];
    rows.forEach(function(row){
      items.push({
        id: row.getAttribute("data-id"),
        text: row.querySelector(".item-text").value,
        track: row.querySelector(".item-track").checked
      });
    });
    return items;
  }

  function writeItemsToHidden(container){
    var form = container.closest("form");
    var targetName = container.getAttribute("data-target");
    var hidden = form ? form.elements[targetName] : null;
    if(hidden) hidden.value = JSON.stringify(readItemsFromContainer(container));
  }

  function syncReportItems(el){
    var container = el.closest(".item-list");
    if(container) writeItemsToHidden(container);
  }

  function addReportItem(btn){
    var wrap = btn.closest(".item-list-field");
    if(!wrap) return;
    var container = wrap.querySelector(".item-list");
    var temp = document.createElement("div");
    temp.innerHTML = renderItemRow({id:newItemId(), text:"", track:false});
    var row = temp.firstChild;
    container.appendChild(row);
    writeItemsToHidden(container);
    var ta = row.querySelector(".item-text");
    if(ta) ta.focus();
  }

  function removeReportItem(btn){
    var row = btn.closest(".item-row");
    var container = btn.closest(".item-list");
    if(!row || !container) return;
    row.remove();
    if(!container.querySelector(".item-row")){
      addReportItem(container.closest(".item-list-field").querySelector(".item-add-btn"));
      return;
    }
    writeItemsToHidden(container);
  }

  /* ---------- rendering ---------- */

  function statusBreakdown(arr, statuses){
    return statuses.map(function(s){ return s+" "+arr.filter(function(x){return x.status===s;}).length; }).join(" · ");
  }

  function renderSidebar(){
    var items = NAV_ORDER.filter(function(key){ return isModuleAllowed(key); }).map(function(key){
      var isOverview = key === "overview";
      var isExternal = !!EXTERNAL_VIEWS[key];
      var isInternal = !!INTERNAL_VIEWS[key];
      var label = isOverview ? "总览" : (isExternal ? EXTERNAL_VIEWS[key].label : (isInternal ? INTERNAL_VIEWS[key].label : MODULES[key].label));
      var count = (isOverview || isExternal || isInternal) ? null : STATE[key].length;
      var active = UI.view === key;
      return '<button class="nav-item '+(active?"nav-item-active":"")+'" onclick="app.setView(\''+key+'\')">'
        + '<span class="nav-label">'+esc(label)+'</span>'
        + (count!==null ? '<span class="nav-count num">'+count+'</span>' : (isExternal ? '<span class="nav-ext">外部 ↗</span>' : ''))
        + '</button>';
    }).join("");
    return '<div class="brand">团队档案台<span class="brand-sub">会议 · SOP · 品质 · 人员</span></div><nav class="nav">'+items+'</nav>';
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
    var userHtml = CURRENT_USER ? '<span class="current-user">'+esc(CURRENT_USER.name)+'</span><button type="button" class="btn btn-ghost btn-sm" onclick="app.logout()">退出登录</button>' : '';
    return userHtml + '<span class="save-pill '+s.cls+'">'+s.text+'</span>';
  }

  function logout(){
    fetch("/api/logout", { method:"POST" }).then(function(){
      CURRENT_USER = null;
      STATE = null;
      if(pollTimer){ clearInterval(pollTimer); pollTimer = null; }
      LOGIN_MODE = "login";
      showLogin();
    }).catch(function(){
      CURRENT_USER = null;
      showLogin();
    });
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
    if(f.type === "itemlist"){
      return renderItemListField(f, record);
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
    var extraActions = mod.extraActions ? mod.extraActions(r) : [];
    var extraActionsHtml = extraActions.map(function(a){
      return '<button class="btn btn-ghost btn-sm" onclick="'+a.onclick+'">'+esc(a.label)+'</button>';
    }).join("");
    var auditBits = [];
    if(r.createdBy) auditBits.push("创建："+r.createdBy);
    if(r.updatedBy && r.updatedBy !== r.createdBy) auditBits.push("最近修改："+r.updatedBy);
    var auditHtml = auditBits.length ? '<p class="card-audit">'+esc(auditBits.join(" · "))+'</p>' : '';
    return '<div class="card" style="--card-color:var(--'+colorKey+')">'
      + '<div class="card-top"><span class="card-id num">'+esc(r.id)+'</span><div class="card-top-chips">'+badge+extraChip+secondaryChip+'<span class="chip chip-'+colorKey+'">'+esc(r.status||"")+'</span></div></div>'
      + '<h3 class="card-title">'+esc(r[mod.titleField] || "(未命名)")+'</h3>'
      + '<div class="card-meta">' + mod.metaLines(r).map(function(l){ return '<p>'+esc(l)+'</p>'; }).join("") + '</div>'
      + auditHtml
      + docLinkHtml
      + attachHtml
      + '<div class="card-actions">'
      + extraActionsHtml
      + '<button class="btn btn-ghost btn-sm" onclick="app.openModal(\''+mod.key+'\',\''+r.id+'\')" '+wd+'>编辑</button>'
      + '<button class="btn btn-danger btn-sm" onclick="app.requestDelete(\''+mod.key+'\',\''+r.id+'\')" '+wd+'>删除</button>'
      + '</div></div>';
  }

  function getFlaggedTrackItems(){
    var items = [];
    (STATE.meetings||[]).forEach(function(m){
      if(m.meetingType === "检讨会议") return;
      MODULES.meetings.reportSections.forEach(function(s){
        parseItems(m[s.itemsKey]).forEach(function(it){
          if(!it || !it.track || !String(it.text||"").trim()) return;
          var dept = s.short + "部门";
          var sourceKey = m.id + "::" + s.itemsKey + "::" + (it.id || "");
          var already = (STATE.trackers||[]).some(function(t){ return t.sourceItem === sourceKey; });
          if(already) return;
          items.push({
            meetingId: m.id,
            meetingTitle: m.title || m.id,
            meetingDate: m.date || "",
            dept: dept,
            deptShort: s.short,
            itemText: it.text,
            sourceKey: sourceKey
          });
        });
      });
    });
    return items;
  }

  function getFiltered(moduleKey){
    var q = (UI.search[moduleKey] || "").trim().toLowerCase();
    var arr = STATE[moduleKey];
    if(!q) return arr;
    return arr.filter(function(r){
      return Object.keys(r).some(function(k){ return String(r[k]||"").toLowerCase().indexOf(q) > -1; });
    });
  }

  function renderFlaggedPanel(){
    var wd = writeDisabled();
    var items = getFlaggedTrackItems();
    if(!items.length) return "";
    var rows = items.map(function(i){
      return '<div class="flagged-row">'
        + '<div class="flagged-info"><strong>'+esc(i.dept)+'</strong><span class="flagged-meeting">来自会议：'+esc(i.meetingTitle)+(i.meetingDate?(" · "+esc(i.meetingDate)):"")+'</span>'
        + '<p class="flagged-text">'+esc(i.itemText)+'</p>'
        + '</div>'
        + '<button class="btn btn-primary btn-sm" data-meeting="'+esc(i.meetingId)+'" data-dept="'+esc(i.dept)+'" data-source="'+esc(i.sourceKey)+'" data-text="'+esc(i.itemText)+'" onclick="app.createTrackerFromFlag(this)" '+wd+'>生成追踪记录</button>'
        + '</div>';
    }).join("");
    return '<div class="panel flagged-panel">'
      + '<h3 class="panel-title">会议部门汇报标记为需要追踪 <span class="chip chip-warn">'+items.length+'</span></h3>'
      + '<div class="flagged-list">'+rows+'</div>'
      + '</div>';
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
      + (moduleKey === "trackers" ? renderFlaggedPanel() : "")
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
    var insp = STATE.inspections, cpl = STATE.complaints, cal = STATE.calibrations, trc = STATE.traces;
    var dPending = d.filter(function(x){ return x.status === "待处理"; });
    var tOpen = t.filter(function(x){ return x.status !== "已完成"; });
    var tOverdue = t.filter(function(x){ return x.status === "已延误"; });
    var inspFail = insp.filter(function(x){ return x.result === "不合格"; });
    var cplPending = cpl.filter(function(x){ return x.status !== "已完成"; });
    var today = new Date(); today.setHours(0,0,0,0);
    var calDue = cal.filter(function(x){
      if(!x.nextDueDate) return false;
      var due = new Date(x.nextDueDate+"T00:00:00");
      if(isNaN(due.getTime())) return false;
      return Math.round((due-today)/86400000) <= 14;
    });
    var cards = [
      {key:"meetings", label:"会议记录", big:m.length, sub: m.length ? statusBreakdown(m,["进行中","已完成","待跟进"]) : "尚无记录"},
      {key:"sops", label:"SOP 文档", big:s.length, sub: s.length ? statusBreakdown(s,["启用","草稿","停用"]) : "尚无记录"},
      {key:"inspections", label:"检验记录", big: inspFail.length, sub: "共 "+insp.length+" 条 · 不合格 "+inspFail.length, highlight: inspFail.length>0},
      {key:"complaints", label:"客户投诉", big: cplPending.length, sub: "共 "+cpl.length+" 条 · 待处理 "+cplPending.length, highlight: cplPending.length>0},
      {key:"calibrations", label:"设备校准", big: calDue.length, sub: "共 "+cal.length+" 条 · 即将/已到期 "+calDue.length, highlight: calDue.length>0},
      {key:"traces", label:"批次追溯", big: trc.length, sub: "共 "+trc.length+" 条记录"},
      {key:"damages", label:"产品损毁记录", big: dPending.length, sub: "共 "+d.length+" 条记录", highlight: dPending.length>0},
      {key:"trackers", label:"追踪记录", big: tOpen.length, sub: tOverdue.length ? ("共 "+t.length+" 条 · 已延误 "+tOverdue.length) : ("共 "+t.length+" 条"), highlight: tOverdue.length>0},
      {key:"staff", label:"在职人员", big: st.filter(function(x){return x.status==="在职";}).length, sub: "共 "+st.length+" 人"},
      {key:"leaves", label:"请假申请", link: LEAVE_APP_URL, sub:"前往 exclwell 系统"}
    ].filter(function(c){ return isModuleAllowed(c.key); });
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

  function fetchAccounts(){
    ACCOUNTS.loading = true;
    ACCOUNTS.error = null;
    render();
    fetch("/api/users").then(function(res){
      if(res.status === 401){ showLogin("登录已过期，请重新输入密码。"); throw new Error("__unauthorized__"); }
      if(res.status === 403){ ACCOUNTS.loading = false; ACCOUNTS.error = "你的账号没有账号管理的权限。"; render(); throw new Error("__forbidden__"); }
      if(!res.ok) throw new Error("load_failed");
      return res.json();
    }).then(function(json){
      ACCOUNTS.list = json.users || [];
      ACCOUNTS.loading = false;
      render();
    }).catch(function(err){
      if(err && (err.message === "__unauthorized__" || err.message === "__forbidden__")) return;
      ACCOUNTS.loading = false;
      ACCOUNTS.error = "加载失败，请重试";
      render();
    });
  }

  function renderModuleCheckboxes(namePrefix, checked){
    checked = checked || [];
    return '<div class="perm-grid">' + RESTRICTABLE_MODULES.map(function(key){
      var isChecked = checked.indexOf(key) > -1;
      return '<label class="perm-item"><input type="checkbox" name="'+namePrefix+key+'" value="'+key+'" '+(isChecked?"checked":"")+'> '+esc(moduleLabel(key))+'</label>';
    }).join("") + '</div>';
  }

  function collectCheckedModules(form, namePrefix){
    var checked = RESTRICTABLE_MODULES.filter(function(key){
      var el = form.elements[namePrefix+key];
      return el && el.checked;
    });
    return checked.length ? checked : null; // none checked = unrestricted
  }

  function renderAccountsView(){
    var wd = writeDisabled();
    var rows;
    if(ACCOUNTS.loading && !ACCOUNTS.list){
      rows = '<div class="empty-state">加载中…</div>';
    } else if(ACCOUNTS.error){
      rows = '<div class="empty-state">'+esc(ACCOUNTS.error)+'</div>';
    } else if(!ACCOUNTS.list || !ACCOUNTS.list.length){
      rows = '<div class="empty-state">还没有团队成员账号。</div>';
    } else {
      rows = '<div class="card-grid">' + ACCOUNTS.list.map(function(u){
        var isMe = CURRENT_USER && CURRENT_USER.id === u.id;
        var permSummary = Array.isArray(u.allowedModules)
          ? (u.allowedModules.length ? ("可见：" + u.allowedModules.map(moduleLabel).join("、")) : "可见：无（未分配任何模块）")
          : "可见：全部";
        var editing = ACCOUNTS.editingId === u.id;
        var editPanel = editing
          ? '<form class="perm-edit-form" onsubmit="app.savePermissions(event,\''+u.id+'\')">'
            + renderModuleCheckboxes("perm_", u.allowedModules)
            + '<p class="external-desc" style="margin:8px 0;">一个都不勾 = 不限制，可看到全部模块。</p>'
            + '<div class="card-actions">'
            + '<button type="submit" class="btn btn-primary btn-sm" '+wd+'>保存权限</button>'
            + '<button type="button" class="btn btn-ghost btn-sm" onclick="app.togglePermEdit(null)">取消</button>'
            + '</div></form>'
          : '';
        return '<div class="card">'
          + '<div class="card-top"><span class="card-id num">@'+esc(u.username)+'</span>'+(isMe?'<span class="chip chip-accent">我</span>':'')+'</div>'
          + '<h3 class="card-title">'+esc(u.name)+'</h3>'
          + '<div class="card-meta"><p>'+(u.createdAt?("加入时间："+esc(u.createdAt.slice(0,10))):"")+'</p><p>'+esc(permSummary)+'</p></div>'
          + (editing ? editPanel : (
              '<div class="card-actions">'
              + '<button class="btn btn-ghost btn-sm" onclick="app.togglePermEdit(\''+u.id+'\')" '+wd+'>编辑权限</button>'
              + '<button class="btn btn-danger btn-sm" onclick="app.removeTeammate(\''+u.id+'\',\''+esc(u.name)+'\')" '+wd+'>移除账号</button>'
              + '</div>'
            ))
          + '</div>';
      }).join("") + '</div>';
    }
    return '<div class="view-header"><h2 class="view-title">账号管理</h2></div>'
      + '<div class="panel" style="margin-bottom:18px;">'
      + '<h3 class="panel-title">添加团队成员</h3>'
      + '<p class="external-desc">需要团队邀请码（跟登录页"没有账号"用的是同一个），新成员自己在登录页设置账号也可以，不一定要你来加。默认能看到全部模块，需要限制的话在下面勾选。</p>'
      + '<form id="add-teammate-form" class="add-teammate-form" onsubmit="app.addTeammate(event)">'
      + '<input class="input" type="password" name="teamPin" placeholder="团队邀请码" autocomplete="off">'
      + '<input class="input" type="text" name="name" placeholder="姓名">'
      + '<input class="input" type="text" name="username" placeholder="用户名">'
      + '<input class="input" type="password" name="password" placeholder="初始密码（至少 4 位）" autocomplete="new-password">'
      + '<p class="external-desc" style="margin:10px 0 4px;">限制这个人只能看到（不勾选 = 不限制，全部可见）：</p>'
      + renderModuleCheckboxes("new_", [])
      + '<button type="submit" class="btn btn-primary" '+wd+'>添加</button>'
      + '</form>'
      + '</div>'
      + rows;
  }

  function togglePermEdit(id){
    ACCOUNTS.editingId = id;
    render();
  }

  function addTeammate(e){
    e.preventDefault();
    var form = e.target;
    var payload = {
      op:"add",
      teamPin: form.elements["teamPin"].value,
      name: form.elements["name"].value,
      username: form.elements["username"].value,
      password: form.elements["password"].value,
      allowedModules: collectCheckedModules(form, "new_")
    };
    var btn = form.querySelector('button[type="submit"]');
    if(btn) btn.disabled = true;
    fetch("/api/users", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify(payload)
    }).then(function(res){
      if(res.status === 401 && !form.elements["teamPin"].value){ showLogin("登录已过期，请重新输入密码。"); throw new Error("__unauthorized__"); }
      return res.json().catch(function(){ return {}; }).then(function(json){
        if(!res.ok) throw new Error(json.message || "添加失败，请检查邀请码是否正确");
        return json;
      });
    }).then(function(){
      toast("已添加团队成员");
      form.reset();
      if(btn) btn.disabled = false;
      fetchAccounts();
    }).catch(function(err){
      if(err && err.message === "__unauthorized__") return;
      toast(err.message || "添加失败，请重试");
      if(btn) btn.disabled = false;
    });
  }

  function savePermissions(e, id){
    e.preventDefault();
    var form = e.target;
    var allowedModules = collectCheckedModules(form, "perm_");
    var btn = form.querySelector('button[type="submit"]');
    if(btn) btn.disabled = true;
    fetch("/api/users", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({op:"setPermissions", id:id, allowedModules:allowedModules})
    }).then(function(res){
      if(res.status === 401){ showLogin("登录已过期，请重新输入密码。"); throw new Error("__unauthorized__"); }
      return res.json().catch(function(){ return {}; }).then(function(json){
        if(!res.ok) throw new Error(json.message || "保存失败，请重试");
        return json;
      });
    }).then(function(){
      toast("已更新权限");
      ACCOUNTS.editingId = null;
      fetchAccounts();
    }).catch(function(err){
      if(err && err.message === "__unauthorized__") return;
      toast(err.message || "保存失败，请重试");
      if(btn) btn.disabled = false;
    });
  }

  function removeTeammate(id, name){
    if(!window.confirm('确定要移除 "'+name+'" 的账号吗？此操作无法撤销，对方将无法再登录（已保存的记录不受影响）。')) return;
    fetch("/api/users", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({op:"remove", id:id})
    }).then(function(res){
      if(res.status === 401){ showLogin("登录已过期，请重新输入密码。"); throw new Error("__unauthorized__"); }
      if(!res.ok) throw new Error("remove_failed");
      return res.json();
    }).then(function(){
      toast("已移除账号");
      fetchAccounts();
    }).catch(function(err){
      if(err && err.message === "__unauthorized__") return;
      toast("移除失败，请重试");
    });
  }

  function render(){
    var root = document.getElementById("app-root");
    var body = UI.view === "overview" ? renderOverview()
      : UI.view === "accounts" ? renderAccountsView()
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

  function setView(key){
    if(!isModuleAllowed(key)) key = "overview";
    UI.view = key; UI.modal = null; UI.confirmDelete = null;
    render();
    if(key === "accounts") fetchAccounts();
  }
  function setSearch(moduleKey, value){ UI.search[moduleKey] = value; render(); }
  function openModal(moduleKey, id, draft){ UI.modal = {module:moduleKey, id: id || null, draft: draft || null}; render(); }

  function createTrackerFromFlag(btn){
    var meetingId = btn.getAttribute("data-meeting");
    var dept = btn.getAttribute("data-dept");
    var sourceKey = btn.getAttribute("data-source");
    var text = btn.getAttribute("data-text") || "";
    var issue = (dept+"追踪："+text).slice(0,120);
    openModal("trackers", null, { department: dept, issue: issue, meetingRef: meetingId, sourceItem: sourceKey });
  }
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
    if(!STATE.counters) STATE.counters = {MTG:0,SOP:0,STF:0,DMG:0,TRK:0,INS:0,CPL:0,CAL:0,TRC:0};
    ["meetings","sops","staff","damages","trackers","inspections","complaints","calibrations","traces"].forEach(function(k){
      if(!STATE[k]) STATE[k] = [];
    });
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
      if(json.user) CURRENT_USER = json.user;
      if(UI && !isModuleAllowed(UI.view)) UI.view = "overview";
      render();
    }).catch(function(){});
  }

  /* ---------- login gate ---------- */

  var LOGIN_MODE = "login"; // "login" | "join"

  function renderLogin(msg){
    document.getElementById("app-root").innerHTML = "";
    var root = document.getElementById("login-root");
    if(LOGIN_MODE === "join"){
      root.innerHTML = '<div class="login-gate"><div class="login-card">'
        + '<h2 class="login-title">团队档案台</h2>'
        + '<p class="login-sub">用团队邀请码设置你的账号——首次使用、忘记密码、新成员加入都用这个</p>'
        + '<form id="login-form" onsubmit="app.submitJoin(event)">'
        + '<input class="input login-input" type="password" name="teamPin" placeholder="团队邀请码" autofocus autocomplete="off">'
        + '<input class="input login-input" type="text" name="name" placeholder="你的姓名" autocomplete="name">'
        + '<input class="input login-input" type="text" name="username" placeholder="用户名（登录用，如拼音）" autocomplete="username">'
        + '<input class="input login-input" type="password" name="password" placeholder="设置密码（至少 4 位）" autocomplete="new-password">'
        + '<p class="login-error">'+esc(msg||"")+'</p>'
        + '<button type="submit" class="btn btn-primary login-btn">设置并进入</button>'
        + '</form>'
        + '<button type="button" class="login-toggle" onclick="app.toggleLoginMode()">已经有账号？点此登录</button>'
        + '</div></div>';
    } else {
      root.innerHTML = '<div class="login-gate"><div class="login-card">'
        + '<h2 class="login-title">团队档案台</h2>'
        + '<p class="login-sub">用你自己的账号登录</p>'
        + '<form id="login-form" onsubmit="app.submitLogin(event)">'
        + '<input class="input login-input" type="text" name="username" placeholder="用户名" autocomplete="username" autofocus>'
        + '<input class="input login-input" type="password" name="password" placeholder="密码" autocomplete="current-password">'
        + '<p class="login-error">'+esc(msg||"")+'</p>'
        + '<button type="submit" class="btn btn-primary login-btn">登录</button>'
        + '</form>'
        + '<button type="button" class="login-toggle" onclick="app.toggleLoginMode()">没有账号 / 忘记密码 / 新成员加入</button>'
        + '</div></div>';
    }
    var input = root.querySelector('.login-input');
    if(input) input.focus();
  }

  function showLogin(msg){ mode = "connecting"; renderLogin(msg); }
  function hideLogin(){ document.getElementById("login-root").innerHTML = ""; }
  function toggleLoginMode(){ LOGIN_MODE = LOGIN_MODE === "login" ? "join" : "login"; renderLogin(); }

  function submitLogin(e){
    e.preventDefault();
    var form = e.target;
    var username = form.elements["username"].value;
    var password = form.elements["password"].value;
    var btn = form.querySelector('button[type="submit"]');
    if(btn) btn.disabled = true;
    fetch("/api/login", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({username:username, password:password})
    }).then(function(res){
      return res.json().catch(function(){ return {}; }).then(function(json){
        if(!res.ok) throw new Error(json.message || (res.status === 401 ? "用户名或密码不对，请重试" : "登录失败，请重试"));
        return json;
      });
    }).then(function(){
      hideLogin();
      boot();
    }).catch(function(err){
      renderLogin(err.message || "登录失败，请重试");
    });
  }

  function submitJoin(e){
    e.preventDefault();
    var form = e.target;
    var payload = {
      mode:"join",
      teamPin: form.elements["teamPin"].value,
      name: form.elements["name"].value,
      username: form.elements["username"].value,
      password: form.elements["password"].value
    };
    var btn = form.querySelector('button[type="submit"]');
    if(btn) btn.disabled = true;
    fetch("/api/login", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify(payload)
    }).then(function(res){
      return res.json().catch(function(){ return {}; }).then(function(json){
        if(!res.ok) throw new Error(json.message || (res.status === 401 ? "团队邀请码不对，请找管理员确认" : "设置失败，请重试"));
        return json;
      });
    }).then(function(){
      hideLogin();
      boot();
    }).catch(function(err){
      renderLogin(err.message || "设置失败，请重试");
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
      if(json.user) CURRENT_USER = json.user;
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
    submitLogin: submitLogin, submitJoin: submitJoin, toggleLoginMode: toggleLoginMode, logout: logout,
    createTrackerFromFlag: createTrackerFromFlag,
    addReportItem: addReportItem, removeReportItem: removeReportItem, syncReportItems: syncReportItems,
    addTeammate: addTeammate, removeTeammate: removeTeammate,
    togglePermEdit: togglePermEdit, savePermissions: savePermissions
  };

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
