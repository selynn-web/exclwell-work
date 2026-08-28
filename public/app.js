
(function(){
  "use strict";

  /* ---------- i18n (中文 / English / Bahasa Malaysia) ---------- */

  var LANG_KEY = "team_archive_lang";
  var LANG = "zh"; // "zh" | "en" | "ms"
  try {
    var storedLang = window.localStorage && localStorage.getItem(LANG_KEY);
    if (storedLang === "en" || storedLang === "ms") LANG = storedLang;
  } catch (err) {}

  // Flat dictionary keyed by the exact original Chinese UI string (as it
  // appears verbatim in MODULES / EXTERNAL_VIEWS / INTERNAL_VIEWS / literal
  // labels below). Looked up via T() at the point each string is rendered,
  // so switching language is reactive without restructuring the (static)
  // MODULES config object. Strings that embed a dynamic value (a number, a
  // name, a joined list) are NOT put here — those are built inline with
  // T3(zh, en, ms) at their point of construction instead, since word order
  // and pluralization differ across languages.
  var DICT = {
    // departments
    "大豆部门": {en:"Soybean Department", ms:"Jabatan Soya"},
    "面筋部门": {en:"Gluten Department", ms:"Jabatan Gluten"},
    "包装部门": {en:"Packaging Department", ms:"Jabatan Pembungkusan"},
    "QC部门": {en:"QC Department", ms:"Jabatan QC"},
    "维修部门": {en:"Maintenance Department", ms:"Jabatan Penyelenggaraan"},
    "HACCP部门": {en:"HACCP Department", ms:"Jabatan HACCP"},
    "出货部门": {en:"Shipping Department", ms:"Jabatan Penghantaran"},
    "人事部门": {en:"HR Department", ms:"Jabatan Sumber Manusia"},
    "采购部门": {en:"Procurement Department", ms:"Jabatan Perolehan"},
    "其他部门": {en:"Other Department", ms:"Jabatan Lain"},
    "大豆": {en:"Soy", ms:"Soya"},
    "面筋": {en:"Gluten", ms:"Gluten"},
    "包装": {en:"Packaging", ms:"Pembungkusan"},
    "维修": {en:"Maintenance", ms:"Penyelenggaraan"},
    "出货": {en:"Shipping", ms:"Penghantaran"},
    "人事": {en:"HR", ms:"HR"},
    "采购": {en:"Procurement", ms:"Perolehan"},
    "其他": {en:"Other", ms:"Lain"},

    // meetings module
    "会议记录": {en:"Meeting Minutes", ms:"Minit Mesyuarat"},
    "会议": {en:"Meeting", ms:"Mesyuarat"},
    "会议类型": {en:"Meeting Type", ms:"Jenis Mesyuarat"},
    "例常会议": {en:"Routine Meeting", ms:"Mesyuarat Rutin"},
    "检讨会议": {en:"Review Meeting", ms:"Mesyuarat Semakan"},
    "活动 / 产品名称": {en:"Event / Product Name", ms:"Nama Acara / Produk"},
    "会议主题": {en:"Meeting Topic", ms:"Topik Mesyuarat"},
    "日期": {en:"Date", ms:"Tarikh"},
    "时间": {en:"Time", ms:"Masa"},
    "地点": {en:"Venue", ms:"Lokasi"},
    "部门": {en:"Department", ms:"Jabatan"},
    "出席人员（约 12–15 人，可逐行列出）": {en:"Attendees (approx. 12–15, one per line)", ms:"Kehadiran (anggaran 12–15 orang, satu setiap baris)"},
    "缺席人员": {en:"Absentees", ms:"Tidak Hadir"},
    "列席人员": {en:"Observers", ms:"Pemerhati"},
    "备注": {en:"Remarks", ms:"Catatan"},
    "各部门汇报（可自由添加多项事项，每项可单独标记是否追踪）": {en:"Department Reports (freely add items; each can be flagged for tracking)", ms:"Laporan Jabatan (boleh tambah item secara bebas; setiap item boleh ditanda untuk penjejakan)"},
    "大豆生产部门汇报": {en:"Soybean Production Dept Report", ms:"Laporan Jabatan Pengeluaran Soya"},
    "产量 · 良率 · 异常情况 · 改进计划": {en:"Output · Yield Rate · Issues · Improvement Plan", ms:"Output · Kadar Hasil · Isu · Pelan Penambahbaikan"},
    "面筋生产部门汇报": {en:"Gluten Production Dept Report", ms:"Laporan Jabatan Pengeluaran Gluten"},
    "包装部门汇报": {en:"Packaging Dept Report", ms:"Laporan Jabatan Pembungkusan"},
    "包装进度 · 物料损耗 · 异常情况 · 改进计划": {en:"Packaging Progress · Material Loss · Issues · Improvement Plan", ms:"Kemajuan Pembungkusan · Kehilangan Bahan · Isu · Pelan Penambahbaikan"},
    "QC 部门汇报": {en:"QC Dept Report", ms:"Laporan Jabatan QC"},
    "检验结果 · 不合格项 · 客户投诉 · 改进措施": {en:"Inspection Results · Non-conformities · Customer Complaints · Corrective Actions", ms:"Keputusan Pemeriksaan · Ketidakpatuhan · Aduan Pelanggan · Tindakan Pembetulan"},
    "维修部门汇报": {en:"Maintenance Dept Report", ms:"Laporan Jabatan Penyelenggaraan"},
    "设备状况 · 维修记录 · 待处理故障 · 保养计划": {en:"Equipment Condition · Repair Log · Pending Faults · Maintenance Plan", ms:"Keadaan Peralatan · Log Pembaikan · Kerosakan Belum Selesai · Pelan Penyelenggaraan"},
    "HACCP 部门汇报": {en:"HACCP Dept Report", ms:"Laporan Jabatan HACCP"},
    "食品安全监控结果 · 稽核情况 · 不符合项与纠正措施": {en:"Food Safety Monitoring Results · Audit Status · Nonconformities & Corrective Actions", ms:"Keputusan Pemantauan Keselamatan Makanan · Status Audit · Ketidakpatuhan & Tindakan Pembetulan"},
    "出货部门汇报": {en:"Shipping Dept Report", ms:"Laporan Jabatan Penghantaran"},
    "出货量 · 交期达成率 · 异常情况": {en:"Shipment Volume · On-time Delivery Rate · Issues", ms:"Jumlah Penghantaran · Kadar Ketepatan Masa · Isu"},
    "人事部门汇报": {en:"HR Dept Report", ms:"Laporan Jabatan Sumber Manusia"},
    "人力配置 · 招聘/离职 · 培训 · 考勤异常": {en:"Staffing · Hiring/Resignations · Training · Attendance Issues", ms:"Susunan Tenaga Kerja · Pengambilan/Peletakan Jawatan · Latihan · Isu Kehadiran"},
    "采购部门汇报": {en:"Procurement Dept Report", ms:"Laporan Jabatan Perolehan"},
    "原料采购进度 · 库存状况 · 供应商问题": {en:"Raw Material Procurement Progress · Inventory Status · Supplier Issues", ms:"Kemajuan Perolehan Bahan Mentah · Status Inventori · Isu Pembekal"},
    "其他部门汇报": {en:"Other Dept Report", ms:"Laporan Jabatan Lain"},
    "以上部门之外的事项": {en:"Items outside the above departments", ms:"Perkara di luar jabatan di atas"},
    "讨论与建议事项": {en:"Discussion & Proposals", ms:"Perbincangan & Cadangan"},
    "提议 Proposal": {en:"Proposal", ms:"Cadangan (Proposal)"},
    "本次会议提出的议案 / 建议": {en:"Motions / suggestions raised in this meeting", ms:"Usul / cadangan yang dibangkitkan dalam mesyuarat ini"},
    "附议 Second": {en:"Second", ms:"Sokongan (Second)"},
    "附议人及附议内容": {en:"Seconder and content of the second", ms:"Nama penyokong dan kandungan sokongan"},
    "总结": {en:"Summary", ms:"Ringkasan"},
    "总结内容": {en:"Summary Content", ms:"Kandungan Ringkasan"},
    "会议总结与后续待办": {en:"Meeting summary and follow-up to-dos", ms:"Ringkasan mesyuarat dan tindakan susulan"},
    "值得嘉许 · 亮点（What Went Well）": {en:"Kudos · Highlights (What Went Well)", ms:"Pujian · Perkara Baik (What Went Well)"},
    "值得学习 · 待改进（What Can Be Learned）": {en:"Lessons · Areas to Improve (What Can Be Learned)", ms:"Pengajaran · Perkara Perlu Diperbaiki (What Can Be Learned)"},
    "关键数据（出席人数 / 转化率 / 业绩等）": {en:"Key Metrics (Attendance / Conversion Rate / Performance, etc.)", ms:"Data Utama (Kehadiran / Kadar Penukaran / Prestasi, dll.)"},
    "收支结算（收入 / 支出 / 损益）": {en:"Financial Summary (Income / Expenses / P&L)", ms:"Ringkasan Kewangan (Pendapatan / Perbelanjaan / Untung Rugi)"},
    "总结与行动计划": {en:"Summary & Action Plan", ms:"Ringkasan & Pelan Tindakan"},
    "状态": {en:"Status", ms:"Status"},
    "进行中": {en:"In Progress", ms:"Sedang Berjalan"},
    "已完成": {en:"Completed", ms:"Selesai"},
    "待跟进": {en:"Follow-up Needed", ms:"Perlu Susulan"},
    "已填写": {en:"filled", ms:"diisi"},
    "需追踪": {en:"Needs tracking", ms:"Perlu dijejak"},
    "项追踪": {en:"tracked items", ms:"item dijejak"},
    "查看追踪": {en:"View Tracking", ms:"Lihat Penjejakan"},
    "各部门均已填写": {en:"All departments have reported", ms:"Semua jabatan telah melapor"},
    "暂无会议记录，点击\"新建会议\"开始记录例常会议或检讨会议。": {en:"No meeting records yet. Click \"New Meeting\" to start recording a routine or review meeting.", ms:"Belum ada rekod mesyuarat. Klik \"Mesyuarat Baharu\" untuk mula merekod mesyuarat rutin atau semakan."},

    // sops module
    "SOP 管理": {en:"SOP Management", ms:"Pengurusan SOP"},
    "标题": {en:"Title", ms:"Tajuk"},
    "部门分类": {en:"Department Category", ms:"Kategori Jabatan"},
    "版本": {en:"Version", ms:"Versi"},
    "内容 / 步骤": {en:"Content / Steps", ms:"Kandungan / Langkah"},
    "文档链接（云盘 / 企业微信 / 钉钉等，PDF/Word 请用此方式）": {en:"Document Link (cloud drive / WeCom / DingTalk, etc. — use this for PDF/Word)", ms:"Pautan Dokumen (cloud drive / WeCom / DingTalk, dll. — guna cara ini untuk PDF/Word)"},
    "附件文件（图片 / PDF / Word 等，最大 4MB）": {en:"Attachment File (image / PDF / Word, etc., max 4MB)", ms:"Fail Lampiran (imej / PDF / Word, dll., maksimum 4MB)"},
    "启用": {en:"Active", ms:"Aktif"},
    "草稿": {en:"Draft", ms:"Draf"},
    "停用": {en:"Inactive", ms:"Tidak Aktif"},
    "暂无 SOP，点击\"新建 SOP\"添加第一份流程文档。": {en:"No SOPs yet. Click \"New SOP\" to add your first procedure document.", ms:"Belum ada SOP. Klik \"SOP Baharu\" untuk menambah dokumen prosedur pertama."},

    // staff module
    "人员管理": {en:"Staff Management", ms:"Pengurusan Kakitangan"},
    "姓名": {en:"Name", ms:"Nama"},
    "职位": {en:"Position", ms:"Jawatan"},
    "联系方式": {en:"Contact", ms:"Hubungan"},
    "入职日期": {en:"Join Date", ms:"Tarikh Mula Bekerja"},
    "在职": {en:"Active", ms:"Aktif"},
    "休假中": {en:"On Leave", ms:"Bercuti"},
    "离职": {en:"Resigned", ms:"Berhenti"},
    "暂无人员记录，点击\"新建人员\"添加团队成员。": {en:"No staff records yet. Click \"New Staff\" to add a team member.", ms:"Belum ada rekod kakitangan. Klik \"Kakitangan Baharu\" untuk menambah ahli pasukan."},

    // damages module
    "产品损毁记录": {en:"Product Damage Records", ms:"Rekod Kerosakan Produk"},
    "产品名称 / 品项": {en:"Product Name / Item", ms:"Nama Produk / Item"},
    "损毁数量": {en:"Damaged Quantity", ms:"Kuantiti Rosak"},
    "损毁原因": {en:"Reason for Damage", ms:"Sebab Kerosakan"},
    "包装破损": {en:"Packaging Damage", ms:"Kerosakan Pembungkusan"},
    "品质不合格": {en:"Quality Failure", ms:"Kegagalan Kualiti"},
    "设备故障": {en:"Equipment Malfunction", ms:"Kerosakan Peralatan"},
    "过期 / 超期": {en:"Expired / Overdue", ms:"Luput / Tertunggak"},
    "客户退货": {en:"Customer Return", ms:"Pemulangan Pelanggan"},
    "运输损坏": {en:"Transport Damage", ms:"Kerosakan Pengangkutan"},
    "详细说明": {en:"Detailed Explanation", ms:"Penjelasan Terperinci"},
    "预估损失（RM）": {en:"Estimated Loss (RM)", ms:"Anggaran Kerugian (RM)"},
    "处理状态": {en:"Handling Status", ms:"Status Pengendalian"},
    "待处理": {en:"Pending", ms:"Belum Selesai"},
    "已处理": {en:"Resolved", ms:"Selesai"},
    "已上报": {en:"Reported", ms:"Dilaporkan"},
    "处理备注": {en:"Handling Notes", ms:"Catatan Pengendalian"},
    "预估损失：": {en:"Estimated Loss: ", ms:"Anggaran Kerugian: "},
    "暂无产品损毁记录，点击\"新建记录\"开始登记。": {en:"No damage records yet. Click \"New Record\" to start logging.", ms:"Belum ada rekod kerosakan. Klik \"Rekod Baharu\" untuk mula mendaftar."},

    // trackers module
    "追踪记录": {en:"Tracking Records", ms:"Rekod Penjejakan"},
    "追踪事项": {en:"Tracked Item", ms:"Item Dijejak"},
    "来源会议（可选）": {en:"Source Meeting (optional)", ms:"Mesyuarat Sumber (pilihan)"},
    "（无，直接新建）": {en:"(None, create directly)", ms:"(Tiada, cipta terus)"},
    "未命名": {en:"Untitled", ms:"Tiada Tajuk"},
    "负责人": {en:"Owner", ms:"Bertanggungjawab"},
    "预计完成日期": {en:"Expected Completion Date", ms:"Tarikh Siap Dijangka"},
    "已延误": {en:"Overdue", ms:"Tertunggak"},
    "进度备注": {en:"Progress Notes", ms:"Catatan Kemajuan"},
    "部门：": {en:"Department: ", ms:"Jabatan: "},
    "出席：": {en:"Attendees: ", ms:"Kehadiran: "},
    "亮点：": {en:"Highlights: ", ms:"Perkara Baik: "},
    "行动计划：": {en:"Action Plan: ", ms:"Pelan Tindakan: "},
    "待填写：": {en:"Pending: ", ms:"Belum Diisi: "},
    "来源会议：": {en:"Source Meeting: ", ms:"Mesyuarat Sumber: "},
    "负责人：": {en:"Owner: ", ms:"Bertanggungjawab: "},
    "预计完成：": {en:"Due: ", ms:"Tarikh Siap: "},
    "进度备注：": {en:"Progress Notes: ", ms:"Catatan Kemajuan: "},
    "暂无追踪事项。可以在会议记录里发现需要跟进的事，来这里新建并关联对应会议。": {en:"No tracked items yet. Flag something that needs follow-up in Meeting Minutes, then create and link it to that meeting here.", ms:"Belum ada item dijejak. Tandakan perkara yang perlu disusuli dalam Minit Mesyuarat, kemudian cipta dan kaitkan dengan mesyuarat berkenaan di sini."},
    "WhatsApp 提醒": {en:"WhatsApp Reminder", ms:"Peringatan WhatsApp"},

    // inspections module
    "检验记录": {en:"Inspection Records", ms:"Rekod Pemeriksaan"},
    "检验类型": {en:"Inspection Type", ms:"Jenis Pemeriksaan"},
    "来料检验": {en:"Incoming Inspection", ms:"Pemeriksaan Bahan Masuk"},
    "制程检验": {en:"In-process Inspection", ms:"Pemeriksaan Proses"},
    "成品检验": {en:"Final Inspection", ms:"Pemeriksaan Produk Siap"},
    "产品 / 物料名称": {en:"Product / Material Name", ms:"Nama Produk / Bahan"},
    "批号": {en:"Batch No.", ms:"No. Kelompok"},
    "检验日期": {en:"Inspection Date", ms:"Tarikh Pemeriksaan"},
    "检验员": {en:"Inspector", ms:"Pemeriksa"},
    "检验项目 / 标准": {en:"Inspection Items / Criteria", ms:"Item / Kriteria Pemeriksaan"},
    "外观 · 重量 · 水分 · 微生物指标等": {en:"Appearance · Weight · Moisture · Microbial indicators, etc.", ms:"Rupa · Berat · Lembapan · Penunjuk Mikrob, dll."},
    "检验结果": {en:"Inspection Result", ms:"Keputusan Pemeriksaan"},
    "合格": {en:"Pass", ms:"Lulus"},
    "不合格": {en:"Fail", ms:"Gagal"},
    "待复检": {en:"Pending Re-inspection", ms:"Menunggu Pemeriksaan Semula"},
    "不合格说明 / 处理方式": {en:"Non-conformance Notes / Handling", ms:"Catatan Ketidakpatuhan / Tindakan"},
    "跟进中": {en:"Following Up", ms:"Dalam Susulan"},
    "已关闭": {en:"Closed", ms:"Ditutup"},
    "批号：": {en:"Batch: ", ms:"Kelompok: "},
    "检验员：": {en:"Inspector: ", ms:"Pemeriksa: "},
    "暂无检验记录，点击\"新建检验记录\"登记来料 / 制程 / 成品检验结果。": {en:"No inspection records yet. Click \"New Inspection Record\" to log incoming / in-process / final inspection results.", ms:"Belum ada rekod pemeriksaan. Klik \"Rekod Pemeriksaan Baharu\" untuk mendaftar keputusan pemeriksaan bahan masuk / proses / produk siap."},

    // complaints module
    "客户投诉记录": {en:"Customer Complaint Records", ms:"Rekod Aduan Pelanggan"},
    "客户投诉": {en:"Customer Complaints", ms:"Aduan Pelanggan"},
    "客户名称": {en:"Customer Name", ms:"Nama Pelanggan"},
    "产品 / 批号": {en:"Product / Batch", ms:"Produk / Kelompok"},
    "投诉日期": {en:"Complaint Date", ms:"Tarikh Aduan"},
    "投诉渠道": {en:"Complaint Channel", ms:"Saluran Aduan"},
    "电话": {en:"Phone", ms:"Telefon"},
    "微信 / 邮件": {en:"WeChat / Email", ms:"WeChat / E-mel"},
    "现场": {en:"In-person", ms:"Bersemuka"},
    "投诉内容": {en:"Complaint Details", ms:"Butiran Aduan"},
    "严重程度": {en:"Severity", ms:"Tahap Keseriusan"},
    "轻微": {en:"Minor", ms:"Ringan"},
    "一般": {en:"Moderate", ms:"Sederhana"},
    "严重": {en:"Severe", ms:"Serius"},
    "处理措施": {en:"Handling Actions", ms:"Tindakan Pengendalian"},
    "处理中": {en:"In Progress", ms:"Sedang Diproses"},
    "产品：": {en:"Product: ", ms:"Produk: "},
    "处理：": {en:"Handling: ", ms:"Tindakan: "},
    "暂无客户投诉记录，点击\"新建投诉记录\"登记。": {en:"No complaint records yet. Click \"New Complaint Record\" to log one.", ms:"Belum ada rekod aduan pelanggan. Klik \"Rekod Aduan Baharu\" untuk mendaftar."},

    // calibrations module
    "设备校准记录": {en:"Equipment Calibration Records", ms:"Rekod Penentukuran Peralatan"},
    "设备校准": {en:"Equipment Calibration", ms:"Penentukuran Peralatan"},
    "设备名称": {en:"Equipment Name", ms:"Nama Peralatan"},
    "类型": {en:"Type", ms:"Jenis"},
    "校准": {en:"Calibration", ms:"Penentukuran"},
    "保养": {en:"Maintenance", ms:"Penyelenggaraan"},
    "执行日期": {en:"Date Performed", ms:"Tarikh Dilaksanakan"},
    "下次到期日期": {en:"Next Due Date", ms:"Tarikh Akan Datang"},
    "执行单位 / 人员": {en:"Performed By (Vendor/Person)", ms:"Dilaksanakan Oleh (Vendor/Orang)"},
    "结果 / 备注": {en:"Result / Notes", ms:"Keputusan / Catatan"},
    "正常": {en:"Normal", ms:"Normal"},
    "即将到期": {en:"Due Soon", ms:"Akan Tamat Tempoh"},
    "已过期": {en:"Overdue", ms:"Tertunggak"},
    "下次到期：": {en:"Next Due: ", ms:"Tarikh Akan Datang: "},
    "暂无设备校准 / 保养记录，点击\"新建校准记录\"登记。": {en:"No calibration/maintenance records yet. Click \"New Calibration Record\" to log one.", ms:"Belum ada rekod penentukuran/penyelenggaraan peralatan. Klik \"Rekod Penentukuran Baharu\" untuk mendaftar."},

    // repairs module
    "设备维修记录": {en:"Equipment Repair Records", ms:"Rekod Pembaikan Peralatan"},
    "设备维修": {en:"Equipment Repairs", ms:"Pembaikan Peralatan"},
    "维修记录": {en:"Repair Record", ms:"Rekod Pembaikan"},
    "维修日期": {en:"Repair Date", ms:"Tarikh Pembaikan"},
    "故障描述": {en:"Issue Description", ms:"Penerangan Masalah"},
    "维修内容 / 处理方式": {en:"Repair Actions Taken", ms:"Tindakan Pembaikan"},
    "维修人员 / 单位": {en:"Technician / Vendor", ms:"Juruteknik / Vendor"},
    "维修费用（RM）": {en:"Repair Cost (RM)", ms:"Kos Pembaikan (RM)"},
    "待维修": {en:"Awaiting Repair", ms:"Menunggu Pembaikan"},
    "维修中": {en:"In Repair", ms:"Sedang Dibaiki"},
    "维修人员：": {en:"Technician: ", ms:"Juruteknik: "},
    "费用：": {en:"Cost: ", ms:"Kos: "},
    "来源维修记录（可选）": {en:"Source Repair Record (optional)", ms:"Rekod Pembaikan Sumber (pilihan)"},
    "来源维修：": {en:"Source Repair: ", ms:"Pembaikan Sumber: "},
    "暂无设备维修记录，点击\"新建维修记录\"登记，也可以切换到\"日历\"视图按日期查看。": {en:"No repair records yet. Click \"New Repair Record\" to log one, or switch to the \"Calendar\" view to browse by date.", ms:"Belum ada rekod pembaikan. Klik \"Rekod Pembaikan Baharu\" untuk mendaftar, atau tukar ke paparan \"Kalendar\" untuk melihat mengikut tarikh."},

    // traces module
    "批次追溯": {en:"Batch Traceability", ms:"Kebolehjejakan Kelompok"},
    "生产批号": {en:"Production Batch No.", ms:"No. Kelompok Pengeluaran"},
    "产品名称": {en:"Product Name", ms:"Nama Produk"},
    "生产日期": {en:"Production Date", ms:"Tarikh Pengeluaran"},
    "对应原料批号": {en:"Corresponding Raw Material Batch(es)", ms:"Kelompok Bahan Mentah Berkaitan"},
    "大豆批号 XXX · 包装材料批号 XXX 等，可逐行列出": {en:"e.g. Soybean batch XXX · Packaging material batch XXX, one per line", ms:"cth. Kelompok soya XXX · Kelompok bahan pembungkusan XXX, satu setiap baris"},
    "对应出货批号 / 客户": {en:"Corresponding Shipment Batch(es) / Customer", ms:"Kelompok Penghantaran / Pelanggan Berkaitan"},
    "出货批号、发往客户、数量等": {en:"Shipment batch, customer, quantity, etc.", ms:"Kelompok penghantaran, pelanggan, kuantiti, dll."},
    "生产中": {en:"In Production", ms:"Sedang Dikeluarkan"},
    "已出货": {en:"Shipped", ms:"Telah Dihantar"},
    "已封存": {en:"Archived", ms:"Diarkibkan"},
    "原料批号：": {en:"Raw Batches: ", ms:"Kelompok Bahan Mentah: "},
    "出货批号：": {en:"Shipment Batches: ", ms:"Kelompok Penghantaran: "},
    "暂无批次追溯记录，点击\"新建追溯记录\"登记原料到出货的批号对应关系。": {en:"No trace records yet. Click \"New Trace Record\" to log the raw-material-to-shipment batch mapping.", ms:"Belum ada rekod jejak. Klik \"Rekod Jejak Baharu\" untuk mendaftar pemetaan kelompok bahan mentah ke penghantaran."},

    // vehicles module
    "汽车管理": {en:"Vehicle Management", ms:"Pengurusan Kenderaan"},
    "车辆": {en:"Vehicle", ms:"Kenderaan"},
    "车牌号码": {en:"Plate Number", ms:"Nombor Plat"},
    "车型": {en:"Model", ms:"Model"},
    "使用部门": {en:"Department", ms:"Jabatan"},
    "司机 / 使用人": {en:"Driver / User", ms:"Pemandu / Pengguna"},
    "司机 / 使用人：": {en:"Driver / User: ", ms:"Pemandu / Pengguna: "},
    "负责人（WhatsApp 提醒对象）": {en:"Responsible Person (WhatsApp reminder contact)", ms:"Orang Bertanggungjawab (kenalan peringatan WhatsApp)"},
    "路税到期日": {en:"Road Tax Expiry", ms:"Tamat Tempoh Cukai Jalan"},
    "路税到期：": {en:"Road Tax Due: ", ms:"Cukai Jalan Tamat: "},
    "保险到期日": {en:"Insurance Expiry", ms:"Tamat Tempoh Insurans"},
    "保险到期：": {en:"Insurance Due: ", ms:"Insurans Tamat: "},
    "保险公司": {en:"Insurer", ms:"Syarikat Insurans"},
    "使用中": {en:"In Use", ms:"Sedang Digunakan"},
    "已停用": {en:"Decommissioned", ms:"Tidak Digunakan Lagi"},
    "暂无车辆记录，点击\"新建车辆\"登记公司车辆的路税与保险到期日，系统会自动提示即将到期或已逾期的车辆。": {en:"No vehicle records yet. Click \"New Vehicle\" to log a company vehicle's road tax and insurance expiry dates — the system will flag vehicles that are due soon or overdue.", ms:"Belum ada rekod kenderaan. Klik \"Kenderaan Baharu\" untuk mendaftar tarikh tamat tempoh cukai jalan dan insurans kenderaan syarikat — sistem akan menanda kenderaan yang akan atau telah tamat tempoh."},

    // nav / general / shell
    "总览": {en:"Overview", ms:"Ringkasan"},
    "尚无记录": {en:"No records yet", ms:"Belum ada rekod"},
    "请假管理": {en:"Leave Management", ms:"Pengurusan Cuti"},
    "请假申请已迁移至独立系统": {en:"Leave requests have moved to a separate system", ms:"Permohonan cuti telah dipindah ke sistem berasingan"},
    "团队的请假申请、审批与记录统一在 exclwell 请假系统处理。点击下方按钮，在新标签页打开该系统提交或查看申请。": {en:"Team leave requests, approvals, and records are all handled in the exclwell leave system. Click the button below to open it in a new tab to submit or view requests.", ms:"Permohonan cuti, kelulusan dan rekod pasukan dikendalikan sepenuhnya dalam sistem cuti exclwell. Klik butang di bawah untuk membuka sistem tersebut dalam tab baharu bagi menghantar atau melihat permohonan."},
    "打开请假申请系统 ↗": {en:"Open Leave System ↗", ms:"Buka Sistem Cuti ↗"},
    "账号管理": {en:"Account Management", ms:"Pengurusan Akaun"},
    "团队档案台": {en:"Team Archive", ms:"Arkib Pasukan"},
    "会议 · SOP · 品质 · 设备": {en:"Meetings · SOPs · Quality · Equipment", ms:"Mesyuarat · SOP · Kualiti · Peralatan"},
    "外部 ↗": {en:"External ↗", ms:"Luaran ↗"},
    "连接中…": {en:"Connecting…", ms:"Menyambung…"},
    "已连接 · 可编辑": {en:"Connected · Editable", ms:"Disambung · Boleh Edit"},
    "保存中…": {en:"Saving…", ms:"Menyimpan…"},
    "保存失败，请重试": {en:"Save failed, please retry", ms:"Simpan gagal, sila cuba lagi"},
    "退出登录": {en:"Log Out", ms:"Log Keluar"},

    // modal / cards
    "确认删除": {en:"Confirm Delete", ms:"Sahkan Padam"},
    "取消": {en:"Cancel", ms:"Batal"},
    "编辑": {en:"Edit", ms:"Edit"},
    "新建": {en:"New", ms:"Baharu"},
    "保存": {en:"Save", ms:"Simpan"},
    "删除": {en:"Delete", ms:"Padam"},
    "创建：": {en:"Created by: ", ms:"Dicipta oleh: "},
    "最近修改：": {en:"Last edited by: ", ms:"Terakhir disunting oleh: "},
    "(未命名)": {en:"(Untitled)", ms:"(Tiada Tajuk)"},
    "下载附件：": {en:"Download Attachment: ", ms:"Muat Turun Lampiran: "},
    "📄 打开文档链接": {en:"📄 Open Document Link", ms:"📄 Buka Pautan Dokumen"},
    "来自会议：": {en:"From meeting: ", ms:"Daripada mesyuarat: "},
    "生成追踪记录": {en:"Create Tracking Record", ms:"Cipta Rekod Penjejakan"},
    "会议部门汇报标记为需要追踪": {en:"Department Reports Flagged for Tracking", ms:"Laporan Jabatan Ditanda untuk Penjejakan"},
    "（保存中…）": {en:"(saving…)", ms:"(sedang disimpan…)"},

    // item-list (department report items)
    "需要追踪": {en:"Needs tracking", ms:"Perlu dijejak"},
    "填写事项内容…": {en:"Enter item details…", ms:"Masukkan butiran item…"},
    "+ 添加事项": {en:"+ Add Item", ms:"+ Tambah Item"},
    "已选择：": {en:"Selected: ", ms:"Dipilih: "},
    "当前附件：": {en:"Current attachment: ", ms:"Lampiran semasa: "},
    "移除": {en:"Remove", ms:"Buang"},
    "未上传附件": {en:"No attachment uploaded", ms:"Tiada lampiran dimuat naik"},

    // document export
    "导出": {en:"Export", ms:"Eksport"},
    "导出全部": {en:"Export All", ms:"Eksport Semua"},
    "找不到记录": {en:"Record not found", ms:"Rekod tidak dijumpai"},
    "没有可导出的记录": {en:"No records to export", ms:"Tiada rekod untuk dieksport"},

    // toasts / errors
    "文件太大，附件请控制在 4MB 以内": {en:"File too large. Please keep attachments under 4MB.", ms:"Fail terlalu besar. Sila pastikan lampiran di bawah 4MB."},
    "文件读取失败，请重试": {en:"Failed to read file, please retry", ms:"Gagal membaca fail, sila cuba lagi"},
    "找不到附件": {en:"Attachment not found", ms:"Lampiran tidak dijumpai"},
    "附件数据损坏": {en:"Attachment data is corrupted", ms:"Data lampiran rosak"},
    "下载失败，请重试": {en:"Download failed, please retry", ms:"Muat turun gagal, sila cuba lagi"},
    "加载中…": {en:"Loading…", ms:"Memuatkan…"},
    "加载失败，请重试": {en:"Failed to load, please retry", ms:"Gagal memuatkan, sila cuba lagi"},
    "加载失败，请刷新页面重试": {en:"Failed to load. Please refresh the page and try again.", ms:"Gagal memuatkan. Sila muat semula halaman dan cuba lagi."},
    "登录已过期，请重新输入密码。": {en:"Your session has expired. Please log in again.", ms:"Sesi anda telah tamat tempoh. Sila log masuk semula."},
    "登录已过期，请重新输入团队密码。": {en:"Your session has expired. Please log in again.", ms:"Sesi anda telah tamat tempoh. Sila log masuk semula."},
    "请检查网络后重试": {en:"Please check your network and retry", ms:"Sila semak sambungan rangkaian dan cuba lagi"},
    "已添加团队成员": {en:"Team member added", ms:"Ahli pasukan ditambah"},
    "添加失败，请检查邀请码是否正确": {en:"Failed to add. Please check the invite code.", ms:"Gagal menambah. Sila semak kod jemputan."},
    "添加失败，请重试": {en:"Failed to add, please retry", ms:"Gagal menambah, sila cuba lagi"},
    "已更新权限": {en:"Permissions updated", ms:"Kebenaran dikemas kini"},
    "已移除账号": {en:"Account removed", ms:"Akaun dibuang"},
    "移除失败，请重试": {en:"Failed to remove, please retry", ms:"Gagal membuang, sila cuba lagi"},

    // accounts view
    "还没有团队成员账号。": {en:"No team member accounts yet.", ms:"Belum ada akaun ahli pasukan."},
    "可见：全部": {en:"Visible: All", ms:"Boleh Lihat: Semua"},
    "可见：": {en:"Visible: ", ms:"Boleh Lihat: "},
    "可见：无（未分配任何模块）": {en:"Visible: None (no modules assigned)", ms:"Boleh Lihat: Tiada (tiada modul ditetapkan)"},
    "我": {en:"Me", ms:"Saya"},
    "加入时间：": {en:"Joined: ", ms:"Sertai: "},
    "编辑权限": {en:"Edit Permissions", ms:"Sunting Kebenaran"},
    "移除账号": {en:"Remove Account", ms:"Buang Akaun"},
    "保存权限": {en:"Save Permissions", ms:"Simpan Kebenaran"},
    "一个都不勾 = 不限制，可看到全部模块。": {en:"Leave all unchecked = unrestricted, can see all modules.", ms:"Jangan tandakan mana-mana = tiada had, boleh lihat semua modul."},
    "添加团队成员": {en:"Add Team Member", ms:"Tambah Ahli Pasukan"},
    "需要团队邀请码（跟登录页\"没有账号\"用的是同一个），新成员自己在登录页设置账号也可以，不一定要你来加。默认能看到全部模块，需要限制的话在下面勾选。": {en:"Requires the team invite code (the same one used for \"No account\" on the login page). New members can also set up their own account from the login page — you don't have to add them yourself. Full access is granted by default; check the boxes below to restrict.", ms:"Memerlukan kod jemputan pasukan (sama seperti yang digunakan untuk \"Tiada akaun\" di halaman log masuk). Ahli baharu juga boleh menyediakan akaun mereka sendiri di halaman log masuk — anda tidak perlu menambah mereka sendiri. Akses penuh diberikan secara lalai; tandakan kotak di bawah untuk mengehadkan."},
    "团队邀请码": {en:"Team invite code", ms:"Kod jemputan pasukan"},
    "用户名": {en:"Username", ms:"Nama Pengguna"},
    "初始密码（至少 4 位）": {en:"Initial Password (min. 4 chars)", ms:"Kata Laluan Awal (min. 4 aksara)"},
    "手机号码（可选，用于 WhatsApp 提醒）": {en:"Phone number (optional, used for WhatsApp reminders)", ms:"Nombor telefon (pilihan, untuk peringatan WhatsApp)"},
    "手机号码：": {en:"Phone: ", ms:"Telefon: "},
    "限制这个人只能看到（不勾选 = 不限制，全部可见）：": {en:"Restrict this person to only see (leave unchecked = unrestricted, all visible):", ms:"Hadkan orang ini supaya hanya boleh lihat (jangan tandakan = tiada had, semua boleh lihat):"},
    "添加": {en:"Add", ms:"Tambah"},
    "你的账号没有账号管理的权限。": {en:"Your account doesn't have permission to manage accounts.", ms:"Akaun anda tiada kebenaran untuk mengurus akaun."},
    "你的账号没有账号管理的权限": {en:"Your account doesn't have permission to manage accounts", ms:"Akaun anda tiada kebenaran untuk mengurus akaun"},

    // server-side messages (shown verbatim via err.message)
    "请填写姓名、用户名，密码至少 4 位": {en:"Please fill in name, username, and a password of at least 4 characters", ms:"Sila isi nama, nama pengguna, dan kata laluan sekurang-kurangnya 4 aksara"},
    "这个用户名已经有人用了，换一个试试": {en:"This username is already taken, please try another", ms:"Nama pengguna ini sudah digunakan, sila cuba yang lain"},
    "不能取消自己的账号管理权限，请让其他同事帮你调整": {en:"You can't remove your own account-management access — ask a colleague to adjust it for you", ms:"Anda tidak boleh membuang akses pengurusan akaun anda sendiri — minta rakan sekerja membantu anda menyesuaikannya"},
    "你的账号没有这个模块的权限": {en:"Your account doesn't have permission for this module", ms:"Akaun anda tiada kebenaran untuk modul ini"},

    // login / join screens
    "用团队邀请码设置你的账号——首次使用、忘记密码、新成员加入都用这个": {en:"Set up your account with the team invite code — use this for first-time setup, a forgotten password, or joining as a new member.", ms:"Sediakan akaun anda dengan kod jemputan pasukan — gunakan ini untuk persediaan pertama kali, kata laluan terlupa, atau menyertai sebagai ahli baharu."},
    "你的姓名": {en:"Your Name", ms:"Nama Anda"},
    "用户名（登录用，如拼音）": {en:"Username (for login)", ms:"Nama Pengguna (untuk log masuk)"},
    "设置密码（至少 4 位）": {en:"Set Password (min. 4 chars)", ms:"Tetapkan Kata Laluan (min. 4 aksara)"},
    "设置并进入": {en:"Set Up & Enter", ms:"Sediakan & Masuk"},
    "已经有账号？点此登录": {en:"Already have an account? Log in here", ms:"Sudah ada akaun? Log masuk di sini"},
    "用你自己的账号登录": {en:"Log in with your own account", ms:"Log masuk dengan akaun anda sendiri"},
    "密码": {en:"Password", ms:"Kata Laluan"},
    "登录": {en:"Log In", ms:"Log Masuk"},
    "没有账号 / 忘记密码 / 新成员加入": {en:"No account / Forgot password / New member joining", ms:"Tiada akaun / Lupa kata laluan / Ahli baharu menyertai"},
    "用户名或密码不对，请重试": {en:"Incorrect username or password, please retry", ms:"Nama pengguna atau kata laluan salah, sila cuba lagi"},
    "登录失败，请重试": {en:"Login failed, please retry", ms:"Log masuk gagal, sila cuba lagi"},
    "团队邀请码不对，请找管理员确认": {en:"Incorrect team invite code, please check with an admin", ms:"Kod jemputan pasukan salah, sila semak dengan pentadbir"},
    "设置失败，请重试": {en:"Setup failed, please retry", ms:"Persediaan gagal, sila cuba lagi"}
  };

  function T(zh) {
    if (!zh || LANG === "zh") return zh;
    var e = DICT[zh];
    if (!e) return zh;
    return e[LANG] || zh;
  }

  // For strings assembled with a dynamic value (numbers, names, dates,
  // joined lists) where word order/pluralization differs by language —
  // pass the fully-built string for each language directly.
  function T3(zh, en, ms) {
    if (LANG === "en") return en;
    if (LANG === "ms") return ms;
    return zh;
  }

  function setLang(lang) {
    if (lang !== "zh" && lang !== "en" && lang !== "ms") return;
    if (lang === LANG) return;
    LANG = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch (err) {}
    try { document.title = T("团队档案台"); } catch (err) {}
    var loginRoot = document.getElementById("login-root");
    if (loginRoot && loginRoot.innerHTML) {
      renderLogin();
    } else if (UI) {
      render();
    }
  }

  function renderLangSwitcher(extraClass) {
    var opts = [["zh", "中文"], ["en", "EN"], ["ms", "BM"]];
    return '<div class="lang-switch' + (extraClass ? (" " + extraClass) : "") + '">' + opts.map(function (o) {
      return '<button type="button" class="lang-btn' + (LANG === o[0] ? " lang-btn-active" : "") + '" onclick="app.setLang(\'' + o[0] + '\')">' + o[1] + '</button>';
    }).join("") + '</div>';
  }

  try { document.title = T("团队档案台"); } catch (err) {}

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
        var text = filled+"/"+secs.length+" "+T("已填写");
        if(needTrack){ text += " · "+T("需追踪")+" "+needTrack; color = "warn"; }
        return { text: text, color: color };
      },
      secondaryBadge:function(r){
        var count = (STATE.trackers||[]).filter(function(t){ return t.meetingRef === r.id; }).length;
        if(!count) return null;
        return { text: count+" "+T("项追踪"), color:"accent" };
      },
      extraActions:function(r){
        var needTrack = 0;
        MODULES.meetings.reportSections.forEach(function(s){ needTrack += itemsWithText(r[s.itemsKey]).filter(function(it){ return it.track; }).length; });
        if(!needTrack) return [];
        return [{ label:T("查看追踪")+" ("+needTrack+")", onclick:"app.setView('trackers')" }];
      },
      metaLines:function(r){
        var head = [r.date, r.time, r.venue].filter(Boolean).join(" · ");
        var lines = [head, r.department ? T("部门：")+r.department : "", r.attendees ? T("出席：")+r.attendees : ""];
        if(r.meetingType === "检讨会议"){
          lines.push(r.highlights ? T("亮点：")+r.highlights : "");
          lines.push(r.actionPlan ? T("行动计划：")+r.actionPlan : "");
        } else {
          var pending = MODULES.meetings.reportSections.filter(function(s){ return itemsWithText(r[s.itemsKey]).length === 0; }).map(function(s){ return T(s.short); });
          lines.push(pending.length ? (T("待填写：")+pending.join(LANG==="zh"?"、":", ")) : T("各部门均已填写"));
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
          [T(r.category), r.version].filter(Boolean).join(" · "),
          r.content || ""
        ].filter(Boolean);
      },
      emptyText:'暂无 SOP，点击"新建 SOP"添加第一份流程文档。'
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
          [r.date, T(r.department)].filter(Boolean).join(" · "),
          [r.quantity, T(r.reason)].filter(Boolean).join(" · "),
          r.lossValue ? T("预估损失：")+"RM "+r.lossValue : "",
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
          var opts = [{value:"", label:T("（无，直接新建）")}];
          STATE.meetings.slice().reverse().forEach(function(m){
            opts.push({value:m.id, label:m.id+" · "+(m.title||T("未命名"))+(m.date?(" ("+m.date+")"):"")});
          });
          return opts;
        }},
        {name:"repairRef", label:"来源维修记录（可选）", type:"select", options:function(){
          var opts = [{value:"", label:T("（无，直接新建）")}];
          (STATE.repairs||[]).slice().reverse().forEach(function(m){
            opts.push({value:m.id, label:m.id+" · "+(m.equipment||T("未命名"))+(m.date?(" ("+m.date+")"):"")});
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
      extraBadge:function(r){
        var info = trackerReminderInfo(r);
        if(!info) return null;
        if(info.overdue){
          var overdueText = info.days != null
            ? T3("已延误 "+info.days+" 天", "Overdue by "+info.days+" day"+(info.days===1?"":"s"), "Tertunggak "+info.days+" hari")
            : T("已延误");
          return { text: "⏰ "+overdueText, color:"seal" };
        }
        var dueText = info.days === 0
          ? T3("今天到期", "Due today", "Tamat tempoh hari ini")
          : T3(info.days+" 天后到期", "Due in "+info.days+" day"+(info.days===1?"":"s"), "Tamat tempoh dalam "+info.days+" hari");
        return { text: "⏰ "+dueText, color:"warn" };
      },
      extraActions:function(r){
        var info = trackerReminderInfo(r);
        if(!info) return [];
        return [{ label:"📱 "+T("WhatsApp 提醒"), onclick:"app.sendWhatsAppReminder('trackers','"+r.id+"')" }];
      },
      // WhatsApp reminders are generalized across modules (see
      // sendWhatsAppReminder): reminderOwnerField defaults to "owner" so
      // trackers doesn't need to set it explicitly; reminderMessage builds
      // the draft text for this module specifically.
      reminderMessage:function(r){ return trackerReminderMessage(r); },
      metaLines:function(r){
        var lines = [r.department ? T("部门：")+T(r.department) : ""];
        if(r.meetingRef){
          var mm = STATE.meetings.find(function(x){ return x.id === r.meetingRef; });
          lines.push(T("来源会议：")+(mm ? (mm.title||mm.id) : r.meetingRef));
        }
        if(r.repairRef){
          var rr = (STATE.repairs||[]).find(function(x){ return x.id === r.repairRef; });
          lines.push(T("来源维修：")+(rr ? (rr.equipment||rr.id) : r.repairRef));
        }
        lines.push([r.owner ? T("负责人：")+r.owner : "", r.dueDate ? T("预计完成：")+r.dueDate : ""].filter(Boolean).join(" · "));
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
        return r.result ? { text:T(r.result), color:color } : null;
      },
      metaLines:function(r){
        return [
          [r.date, r.batchNo ? (T("批号：")+r.batchNo) : ""].filter(Boolean).join(" · "),
          r.inspector ? T("检验员：")+r.inspector : "",
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
          [r.date, T(r.channel)].filter(Boolean).join(" · "),
          r.product ? T("产品：") +r.product : "",
          r.description || "",
          r.handling ? T("处理：")+r.handling : ""
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
        if(days < 0){
          var abs = Math.abs(days);
          return { text: T3("已逾期 "+abs+" 天", "Overdue by "+abs+" day"+(abs===1?"":"s"), "Tertunggak "+abs+" hari"), color:"seal" };
        }
        var dueText = T3(days+" 天后到期", "Due in "+days+" day"+(days===1?"":"s"), "Akan tamat tempoh dalam "+days+" hari");
        if(days <= 14) return { text:dueText, color:"warn" };
        return { text:dueText, color:"good" };
      },
      metaLines:function(r){
        return [
          [r.date, r.vendor].filter(Boolean).join(" · "),
          r.nextDueDate ? T("下次到期：")+r.nextDueDate : "",
          r.result || ""
        ].filter(Boolean);
      },
      emptyText:'暂无设备校准 / 保养记录，点击"新建校准记录"登记。'
    },
    repairs:{
      key:"repairs", label:"设备维修记录", singular:"维修记录", idPrefix:"RPR", titleField:"equipment",
      fields:[
        {name:"equipment", label:"设备名称", type:"text", required:true},
        {name:"department", label:"部门", type:"select", options:DEPARTMENTS, def:"大豆部门"},
        {name:"date", label:"维修日期", type:"date", required:true},
        {name:"issue", label:"故障描述", type:"textarea", full:true, required:true},
        {name:"action", label:"维修内容 / 处理方式", type:"textarea", full:true},
        {name:"technician", label:"维修人员 / 单位", type:"text"},
        {name:"cost", label:"维修费用（RM）", type:"text"},
        {name:"status", label:"状态", type:"select", options:["待维修","维修中","已完成"], def:"待维修"}
      ],
      statusColors:{"待维修":"warn","维修中":"accent","已完成":"good"},
      secondaryBadge:function(r){
        var count = (STATE.trackers||[]).filter(function(t){ return t.repairRef === r.id; }).length;
        if(!count) return null;
        return { text: count+" "+T("项追踪"), color:"accent" };
      },
      extraActions:function(r){
        var count = (STATE.trackers||[]).filter(function(t){ return t.repairRef === r.id; }).length;
        var actions = [];
        if(count) actions.push({ label:T("查看追踪")+" ("+count+")", onclick:"app.setView('trackers')" });
        actions.push({ label:"+ "+T3("建追踪事项","New Tracked Item","Item Dijejak Baharu"), onclick:"app.createTrackerFromRepair('"+r.id+"')" });
        return actions;
      },
      metaLines:function(r){
        return [
          [r.date, r.department ? T(r.department) : ""].filter(Boolean).join(" · "),
          r.issue || "",
          r.action ? T("处理：")+r.action : "",
          [r.technician ? T("维修人员：")+r.technician : "", r.cost ? T("费用：")+"RM "+r.cost : ""].filter(Boolean).join(" · ")
        ].filter(Boolean);
      },
      emptyText:'暂无设备维修记录，点击"新建维修记录"登记，也可以切换到"日历"视图按日期查看。'
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
          r.rawBatches ? T("原料批号：")+r.rawBatches : "",
          r.shipBatches ? T("出货批号：")+r.shipBatches : ""
        ].filter(Boolean);
      },
      emptyText:'暂无批次追溯记录，点击"新建追溯记录"登记原料到出货的批号对应关系。'
    },
    vehicles:{
      key:"vehicles", label:"汽车管理", singular:"车辆", idPrefix:"VEH", titleField:"plateNo",
      fields:[
        {name:"plateNo", label:"车牌号码", type:"text", required:true},
        {name:"model", label:"车型", type:"text"},
        {name:"department", label:"使用部门", type:"select", options:DEPARTMENTS, def:"大豆部门"},
        {name:"driver", label:"司机 / 使用人", type:"text"},
        {name:"responsible", label:"负责人（WhatsApp 提醒对象）", type:"text"},
        {name:"roadTaxExpiry", label:"路税到期日", type:"date", required:true},
        {name:"insuranceExpiry", label:"保险到期日", type:"date", required:true},
        {name:"insurer", label:"保险公司", type:"text"},
        {name:"notes", label:"备注", type:"textarea", full:true},
        {name:"status", label:"状态", type:"select", options:["使用中","维修中","已停用"], def:"使用中"}
      ],
      statusColors:{"使用中":"good","维修中":"warn","已停用":"neutral"},
      extraBadge:function(r){ return expiryBadge(r.roadTaxExpiry, "路税", "Road tax", "Cukai jalan", 30); },
      secondaryBadge:function(r){ return expiryBadge(r.insuranceExpiry, "保险", "Insurance", "Insurans", 30); },
      extraActions:function(r){
        var actions = [];
        if(vehicleReminderUrgent(r)) actions.push({ label:"📱 "+T("WhatsApp 提醒"), onclick:"app.sendWhatsAppReminder('vehicles','"+r.id+"')" });
        return actions;
      },
      reminderOwnerField:"responsible",
      reminderMessage:function(r){ return vehicleReminderMessage(r); },
      metaLines:function(r){
        return [
          [r.model, r.department ? T(r.department) : ""].filter(Boolean).join(" · "),
          r.driver ? T("司机 / 使用人：")+r.driver : "",
          r.roadTaxExpiry ? T("路税到期：")+r.roadTaxExpiry : "",
          r.insuranceExpiry ? T("保险到期：")+r.insuranceExpiry+(r.insurer?(" · "+r.insurer):"") : ""
        ].filter(Boolean);
      },
      emptyText:'暂无车辆记录，点击"新建车辆"登记公司车辆的路税与保险到期日，系统会自动提示即将到期或已逾期的车辆。'
    }
  };
  var NAV_ORDER = ["overview","meetings","sops","inspections","complaints","calibrations","repairs","traces","vehicles","damages","trackers","leaves","accounts"];
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
  var RESTRICTABLE_MODULES = ["meetings","sops","inspections","complaints","calibrations","repairs","traces","vehicles","damages","trackers","accounts"];
  function moduleLabel(key){
    if(MODULES[key]) return T(MODULES[key].label);
    if(INTERNAL_VIEWS[key]) return T(INTERNAL_VIEWS[key].label);
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
  // Lightweight {name, phone} directory from every account that has a phone
  // set, refreshed alongside the normal state poll. Available to any logged
  // -in teammate (unlike the full ACCOUNTS list, which needs 账号管理
  // access) so anyone can send a WhatsApp reminder to a tracker's owner.
  var CONTACTS = [];

  function defaultState(){
    return {
      // "staff" stays here even though 人员管理 has no UI anymore — it's
      // load-bearing plumbing, not a leftover: any staff data already saved
      // in Supabase before this module was removed from the interface must
      // keep round-tripping through this shape unchanged (see api/state.js
      // for the matching server-side note), and the WhatsApp-reminder phone
      // lookup still reads it as a fallback (see findStaffContact()).
      meetings:[], sops:[], staff:[], damages:[], trackers:[], repairs:[], vehicles:[],
      inspections:[], complaints:[], calibrations:[], traces:[],
      counters:{MTG:0,SOP:0,STF:0,DMG:0,TRK:0,INS:0,CPL:0,CAL:0,TRC:0,RPR:0,VEH:0}
    };
  }
  function defaultUI(){
    var now = new Date();
    return {
      view:"overview",
      search:{meetings:"",sops:"",staff:"",damages:"",trackers:"",inspections:"",complaints:"",calibrations:"",traces:"",repairs:"",vehicles:""},
      modal:null, confirmDelete:null,
      repairsViewMode:"list",
      calendarCursor:{y:now.getFullYear(), m:now.getMonth()},
      calendarSelectedDate:null
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
    return '<span class="file-chip">'+esc(isNew?T("已选择："):T("当前附件："))+esc(name)+'（'+formatBytes(size)+'）</span> '
      + '<button type="button" class="btn btn-ghost btn-sm" onclick="app.removeAttachment(this)">'+esc(T("移除"))+'</button>';
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
      toast(T("文件太大，附件请控制在 4MB 以内"));
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
    reader.onerror = function(){ toast(T("文件读取失败，请重试")); };
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
    if(statusEl) statusEl.innerHTML = '<span class="file-empty">'+esc(T("未上传附件"))+'</span>';
  }

  function downloadAttachment(moduleKey, id, fieldName){
    var rec = (STATE[moduleKey]||[]).find(function(r){ return r.id === id; });
    if(!rec || !rec[fieldName]){ toast(T("找不到附件")); return; }
    var attach;
    try{ attach = JSON.parse(rec[fieldName]); }catch(err){ toast(T("附件数据损坏")); return; }
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
      toast(T("下载失败，请重试"));
    }
  }

  /* ---------- document export (Word) ----------
     Zero-dependency approach: build an HTML document and hand it to the
     browser as a Blob typed application/msword. Word (and Google Docs /
     Pages) opens this as a normal document — no library, no server call,
     no new npm dependency, consistent with the rest of this project. */

  function safeFilename(s){
    /* Some Chromium builds silently fall back to a generic "download" name
       when the <a download="..."> attribute contains ANY non-ASCII
       character (confirmed even with a single accented Latin letter, not
       just CJK) — so the on-disk filename must stay plain ASCII. This does
       not affect the document's actual title/content, which is still fully
       translated inside the file. */
    return String(s || "file")
      .replace(/[\\/:*?"<>|]+/g, "_")
      .replace(/\s+/g, "_")
      .replace(/[^\x20-\x7E]+/g, "")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 80) || "file";
  }

  function nl2br(s){
    return esc(s).replace(/\r\n|\r|\n/g, "<br>");
  }

  function wrapWordHtml(title, bodyHtml){
    return "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>"
      + "<head><meta charset='utf-8'><title>"+esc(title)+"</title>"
      + "<style>body{font-family:Calibri,Arial,sans-serif; font-size:11pt; color:#222;} table{border-collapse:collapse; width:100%;} td{border:1px solid #ccc; padding:6px 10px; vertical-align:top;} .doc-label{font-weight:bold; width:190px;}</style>"
      + "</head><body>" + bodyHtml + "</body></html>";
  }

  function downloadWordDoc(filename, html){
    var blob = new Blob(["\ufeff", html], { type: "application/msword" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function(){ URL.revokeObjectURL(url); }, 4000);
  }

  function recordDocTitle(mod, r){
    var singularT = T(mod.singular);
    return singularT + " " + r.id + (r[mod.titleField] ? (" - " + r[mod.titleField]) : "");
  }

  function docFieldRows(mod, record){
    var rows = "";
    mod.fields.forEach(function(f){
      if(f.showIf && !f.showIf(record)) return;
      if(f.type === "hidden") return;
      if(f.type === "heading"){
        rows += '<tr><td colspan="2" style="font-weight:bold; font-size:13pt; border:none; padding-top:16px;">'+esc(T(f.text))+'</td></tr>';
        return;
      }
      if(f.type === "itemlist"){
        var items = itemsWithText(record[f.targetField]);
        if(!items.length) return;
        var listHtml = items.map(function(it, idx){
          return (idx+1)+". "+nl2br(it.text)+(it.track ? " <b>["+esc(T("需要追踪"))+"]</b>" : "");
        }).join("<br>");
        rows += '<tr><td class="doc-label">'+esc(fieldLabel(f, record))+'</td><td>'+listHtml+'</td></tr>';
        return;
      }
      if(f.type === "file"){
        var raw = record[f.targetField];
        if(!raw) return;
        var att; try{ att = JSON.parse(raw); }catch(e){ att = null; }
        if(!att) return;
        rows += '<tr><td class="doc-label">'+esc(fieldLabel(f, record))+'</td><td>'+esc(att.name)+'</td></tr>';
        return;
      }
      var val = record[f.name];
      if(val == null || val === "") return;
      var displayVal = f.type === "select" ? esc(T(val)) : nl2br(val);
      rows += '<tr><td class="doc-label">'+esc(fieldLabel(f, record))+'</td><td>'+displayVal+'</td></tr>';
    });
    return rows;
  }

  function docAuditLine(r){
    var bits = [];
    if(r.createdBy) bits.push(T("创建：")+r.createdBy+(r.createdAt?(" ("+r.createdAt.slice(0,10)+")"):""));
    if(r.updatedBy && r.updatedBy !== r.createdBy) bits.push(T("最近修改：")+r.updatedBy+(r.updatedAt?(" ("+r.updatedAt.slice(0,10)+")"):""));
    return bits.length ? '<p style="color:#666; font-size:9pt;">'+esc(bits.join(" · "))+'</p>' : "";
  }

  function exportRecord(moduleKey, id){
    var mod = MODULES[moduleKey];
    var r = (STATE[moduleKey]||[]).find(function(x){ return x.id === id; });
    if(!r){ toast(T("找不到记录")); return; }
    var title = recordDocTitle(mod, r);
    var bodyHtml = '<h1 style="font-size:18pt; margin-bottom:2px;">'+esc(title)+'</h1>'
      + docAuditLine(r)
      + '<table style="margin-top:10px;"><tbody>' + docFieldRows(mod, r) + '</tbody></table>';
    downloadWordDoc(safeFilename(moduleKey+"_"+r.id)+".doc", wrapWordHtml(title, bodyHtml));
  }

  function exportModule(moduleKey){
    var mod = MODULES[moduleKey];
    var list = getFiltered(moduleKey).slice().reverse();
    if(!list.length){ toast(T("没有可导出的记录")); return; }
    var modLabel = T(mod.label);
    var title = modLabel + " " + T3("全部记录导出", "Full Export", "Eksport Penuh");
    var sections = list.map(function(r){
      return '<h2 style="font-size:14pt; margin-top:26px; border-top:2px solid #333; padding-top:14px;">'+esc(recordDocTitle(mod, r))+'</h2>'
        + docAuditLine(r)
        + '<table style="margin-top:6px;"><tbody>' + docFieldRows(mod, r) + '</tbody></table>';
    }).join("");
    var countLine = '<p style="color:#666; font-size:9pt;">'+esc(T3("共 ","Total ","Jumlah "))+list.length+esc(T3(" 条记录"," records"," rekod"))+'</p>';
    var bodyHtml = '<h1 style="font-size:18pt;">'+esc(title)+'</h1>' + countLine + sections;
    downloadWordDoc(safeFilename(moduleKey+"_export")+".doc", wrapWordHtml(title, bodyHtml));
  }

  /* --- WhatsApp reminders for tracker items ------------------------------
     Click-to-send: builds a wa.me deep link with a pre-filled message and
     opens it in a new tab. This does NOT send anything automatically — the
     person still reviews and taps Send inside WhatsApp themselves. That
     keeps it free and instant, with no WhatsApp Business API / Twilio
     account, no approval process, and no per-message cost. The phone
     number is looked up by matching the tracker's "负责人" (owner) name
     against an account's name in 账号管理 first, then (for any legacy
     record predating that field) against an old 人员管理 record's name. */

  function trackerReminderInfo(r){
    if(!r || r.status === "已完成") return null;
    var days = null;
    if(r.dueDate){
      var due = new Date(r.dueDate+"T00:00:00");
      if(!isNaN(due.getTime())){
        var today = new Date(); today.setHours(0,0,0,0);
        days = Math.round((due-today)/86400000);
      }
    }
    var overdue = (r.status === "已延误") || (days !== null && days < 0);
    if(overdue) return { overdue:true, days: days !== null ? Math.abs(days) : null };
    if(days !== null && days <= 3) return { overdue:false, days:days };
    return null;
  }

  // Generic "N days overdue / N days until due" badge, shared by any module
  // that tracks a due date on a record (currently 设备校准记录's own inline
  // version, and 汽车管理's road-tax / insurance expiry — each vehicle has
  // two independent due dates, so this needs to run twice per card).
  // warnDays controls when the badge turns yellow ("即将到期"); defaults to
  // 14 but 汽车管理 passes 30 so the badge and the WhatsApp reminder button
  // (see vehicleReminderUrgent) turn on together, a full month ahead.
  function expiryBadge(dateStr, labelZh, labelEn, labelMs, warnDays){
    if(!dateStr) return null;
    var due = new Date(dateStr+"T00:00:00");
    if(isNaN(due.getTime())) return null;
    var today = new Date(); today.setHours(0,0,0,0);
    var days = Math.round((due-today)/86400000);
    var text, color;
    if(days < 0){
      var abs = Math.abs(days);
      text = T3(labelZh+"已逾期 "+abs+" 天", labelEn+" overdue by "+abs+" day"+(abs===1?"":"s"), labelMs+" tertunggak "+abs+" hari");
      color = "seal";
    } else {
      text = T3(labelZh+" "+days+" 天后到期", labelEn+" due in "+days+" day"+(days===1?"":"s"), labelMs+" tamat tempoh dalam "+days+" hari");
      color = days <= (warnDays || 14) ? "warn" : "good";
    }
    return { text: text, color: color };
  }

  function daysUntil(dateStr){
    if(!dateStr) return null;
    var due = new Date(dateStr+"T00:00:00");
    if(isNaN(due.getTime())) return null;
    var today = new Date(); today.setHours(0,0,0,0);
    return Math.round((due-today)/86400000);
  }

  // Show the WhatsApp reminder button once road tax or insurance is
  // overdue, or due within 1 month (30 days) — vehicle renewals need more
  // lead time than a tracker follow-up, so this is a longer window than
  // trackers' 3-day rule. A decommissioned vehicle never needs a reminder.
  var VEHICLE_REMINDER_WINDOW_DAYS = 30;
  function vehicleReminderUrgent(r){
    if(!r || r.status === "已停用") return false;
    var rt = daysUntil(r.roadTaxExpiry);
    var ins = daysUntil(r.insuranceExpiry);
    return (rt !== null && rt <= VEHICLE_REMINDER_WINDOW_DAYS) || (ins !== null && ins <= VEHICLE_REMINDER_WINDOW_DAYS);
  }

  function vehicleReminderMessage(r){
    var lines = [];
    lines.push(T3("车辆提醒：", "Vehicle reminder: ", "Peringatan kenderaan: ") + (r.plateNo || T("车辆")) + (r.model ? " ("+r.model+")" : ""));
    var rtBadge = expiryBadge(r.roadTaxExpiry, "路税", "Road tax", "Cukai jalan");
    if(rtBadge) lines.push(rtBadge.text);
    var insBadge = expiryBadge(r.insuranceExpiry, "保险", "Insurance", "Insurans");
    if(insBadge) lines.push(insBadge.text);
    if(r.department) lines.push(T("使用部门：") + T(r.department));
    if(r.driver) lines.push(T("司机 / 使用人：") + r.driver);
    lines.push(T3(
      "—— 来自团队档案台的提醒草稿，请核对后发送。",
      "— Draft reminder from Team Archive. Please review before sending.",
      "— Draf peringatan daripada Team Archive. Sila semak sebelum menghantar."
    ));
    return lines.filter(Boolean).join("\n");
  }

  function findStaffContact(name){
    var n = String(name || "").trim();
    if(!n) return null;
    var matches = (STATE.staff || []).filter(function(s){ return String(s.name || "").trim() === n; });
    if(!matches.length) return null;
    matches.sort(function(a, b){
      var aa = a.status === "在职" ? 0 : 1;
      var bb = b.status === "在职" ? 0 : 1;
      return aa - bb;
    });
    return matches[0].contact || null;
  }

  function findAccountPhone(name){
    var n = String(name || "").trim();
    if(!n) return null;
    var match = (CONTACTS || []).find(function(c){ return String(c.name || "").trim() === n; });
    return match ? match.phone : null;
  }

  // Checks the account directory first (账号管理 → 编辑权限 — the only
  // place to enter a phone number now that 人员管理 has no UI), then falls
  // back to any pre-existing 人员管理 staff record with a matching name —
  // that data is still preserved server-side (see defaultState()'s note)
  // even though there's no screen to add new entries there any more.
  function findOwnerPhone(name){
    return findAccountPhone(name) || findStaffContact(name);
  }

  function extractPhoneCandidate(raw){
    var text = String(raw || "");
    var matches = text.match(/[\d+][\d\s\-]{5,}\d/g) || [];
    var best = null, bestLen = 0;
    matches.forEach(function(m){
      var digits = m.replace(/\D+/g, "");
      if(digits.length > bestLen){ bestLen = digits.length; best = m; }
    });
    return best;
  }

  function normalizeMsPhone(raw){
    var candidate = extractPhoneCandidate(raw);
    if(!candidate) return null;
    var digits = candidate.replace(/\D+/g, "");
    if(digits.length < 7) return null;
    var hasPlus = candidate.trim().charAt(0) === "+";
    if(hasPlus || digits.length >= 11) return digits;
    if(digits.charAt(0) === "0") return "60" + digits.slice(1);
    return "60" + digits;
  }

  function trackerReminderMessage(r){
    var lines = [];
    lines.push(T3("提醒：", "Reminder: ", "Peringatan: ") + (r.issue || T("追踪事项")));
    if(r.department) lines.push(T("部门：") + T(r.department));
    if(r.dueDate) lines.push(T("预计完成：") + r.dueDate);
    if(r.notes) lines.push(T("进度备注：") + r.notes);
    lines.push(T3(
      "—— 来自团队档案台的提醒草稿，请核对后发送。",
      "— Draft reminder from Team Archive. Please review before sending.",
      "— Draf peringatan daripada Team Archive. Sila semak sebelum menghantar."
    ));
    return lines.filter(Boolean).join("\n");
  }

  // Generalized across every module that offers a WhatsApp reminder button
  // (currently trackers' due-date reminders and vehicles' road-tax /
  // insurance expiry reminders): each module's config supplies which field
  // holds the person's name (reminderOwnerField, default "owner") and how
  // to build the draft message (reminderMessage(r)) — the phone lookup,
  // number normalization, and click-to-send mechanics stay shared here.
  function sendWhatsAppReminder(moduleKey, id){
    var r = (STATE[moduleKey] || []).find(function(x){ return x.id === id; });
    if(!r){ toast(T("找不到记录")); return; }
    var mod = MODULES[moduleKey] || {};
    var ownerField = mod.reminderOwnerField || "owner";
    var ownerName = String(r[ownerField] || "").trim();
    if(!ownerName){
      toast(T3(
        "请先在这条记录里填写\"负责人\"姓名",
        "Please fill in an \"Owner\" name on this record first",
        "Sila isi nama \"Bertanggungjawab\" pada rekod ini dahulu"
      ));
      return;
    }
    var contactRaw = findOwnerPhone(ownerName);
    if(!contactRaw){
      toast(T3(
        "找不到“" + ownerName + "”的手机号码，请去账号管理找到这个人，点「编辑权限」补上手机号码",
        "Could not find a phone number for “" + ownerName + "” — go to Account Management, find this person, and add one via \"Edit Permissions\"",
        "Tidak jumpa nombor telefon untuk “" + ownerName + "” — pergi ke Pengurusan Akaun, cari orang ini, dan tambah nombor melalui \"Edit Kebenaran\""
      ));
      return;
    }
    var phone = normalizeMsPhone(contactRaw);
    if(!phone){
      toast(T3(
        "“" + ownerName + "”的手机号码格式无法识别，请去账号管理检查填的号码",
        "Could not recognize “" + ownerName + "”'s phone number format — please check the number entered in Account Management",
        "Format nombor telefon “" + ownerName + "” tidak dapat dikenali — sila semak nombor dalam Pengurusan Akaun"
      ));
      return;
    }
    var text = mod.reminderMessage ? mod.reminderMessage(r) : trackerReminderMessage(r);
    var url = "https://wa.me/" + phone + "?text=" + encodeURIComponent(text);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function renderItemRow(item){
    var id = (item && item.id) || newItemId();
    var text = (item && item.text) || "";
    var track = !!(item && item.track);
    return '<div class="item-row" data-id="'+esc(id)+'">'
      + '<textarea class="input item-text" rows="2" placeholder="'+esc(T("填写事项内容…"))+'" oninput="app.syncReportItems(this)">'+esc(text)+'</textarea>'
      + '<label class="item-track-toggle"><input type="checkbox" class="item-track" '+(track?"checked":"")+' onchange="app.syncReportItems(this)"> '+esc(T("需要追踪"))+'</label>'
      + '<button type="button" class="btn btn-ghost btn-sm item-remove" onclick="app.removeReportItem(this)">'+esc(T("删除"))+'</button>'
      + '</div>';
  }

  function renderItemListField(f, record){
    var raw = record ? record[f.targetField] : null;
    var items = parseItems(raw);
    if(!items.length) items = [{id:newItemId(), text:"", track:false}];
    var rows = items.map(renderItemRow).join("");
    return '<div class="field field-full item-list-field" data-placeholder="'+esc(T(f.placeholder||""))+'">'
      + '<span class="field-label">'+esc(fieldLabel(f,record))+'</span>'
      + '<div class="item-list" data-target="'+f.targetField+'">'+rows+'</div>'
      + '<button type="button" class="btn btn-ghost btn-sm item-add-btn" onclick="app.addReportItem(this)">'+esc(T("+ 添加事项"))+'</button>'
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
    return statuses.map(function(s){ return T(s)+" "+arr.filter(function(x){return x.status===s;}).length; }).join(" · ");
  }

  function renderSidebar(){
    var items = NAV_ORDER.filter(function(key){ return isModuleAllowed(key); }).map(function(key){
      var isOverview = key === "overview";
      var isExternal = !!EXTERNAL_VIEWS[key];
      var isInternal = !!INTERNAL_VIEWS[key];
      var label = isOverview ? T("总览") : (isExternal ? T(EXTERNAL_VIEWS[key].label) : (isInternal ? T(INTERNAL_VIEWS[key].label) : T(MODULES[key].label)));
      var count = (isOverview || isExternal || isInternal) ? null : STATE[key].length;
      var active = UI.view === key;
      return '<button class="nav-item '+(active?"nav-item-active":"")+'" onclick="app.setView(\''+key+'\')">'
        + '<span class="nav-label">'+esc(label)+'</span>'
        + (count!==null ? '<span class="nav-count num">'+count+'</span>' : (isExternal ? '<span class="nav-ext">'+esc(T("外部 ↗"))+'</span>' : ''))
        + '</button>';
    }).join("");
    return '<div class="brand">'+esc(T("团队档案台"))+'<span class="brand-sub">'+esc(T("会议 · SOP · 品质 · 设备"))+'</span></div><nav class="nav">'+items+'</nav>'
      + renderLangSwitcher("lang-switch-sidebar");
  }

  function renderSaveStatus(){
    var map = {
      connecting:{text:T("连接中…"), cls:"pill-neutral"},
      writer:{text:T("已连接 · 可编辑"), cls:"pill-good"},
      saving:{text:T("保存中…"), cls:"pill-warn"},
      error:{text:T("保存失败，请重试"), cls:"pill-seal"}
    };
    var key = transientStatus || mode;
    var s = map[key] || map.connecting;
    var userHtml = CURRENT_USER ? '<span class="current-user">'+esc(CURRENT_USER.name)+'</span><button type="button" class="btn btn-ghost btn-sm" onclick="app.logout()">'+esc(T("退出登录"))+'</button>' : '';
    return userHtml + '<span class="save-pill '+s.cls+'">'+esc(s.text)+'</span>';
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

  function fieldLabel(f, record){
    var raw = typeof f.label === "function" ? f.label(record) : f.label;
    return T(raw);
  }

  function renderField(f, value, record){
    if(f.type === "heading"){
      return '<div class="field-heading field-full">'+esc(T(f.text))+'</div>';
    }
    if(f.type === "hidden"){
      return '<input type="hidden" name="'+f.name+'" value="'+esc(value||"")+'">';
    }
    if(f.type === "file"){
      var current = null;
      var raw = record ? record[f.targetField] : null;
      if(raw){ try{ current = JSON.parse(raw); }catch(err){ current = null; } }
      var statusHtml = current ? renderFileStatus(current.name, current.size, false) : '<span class="file-empty">'+esc(T("未上传附件"))+'</span>';
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
    var placeholderAttr = f.placeholder ? ('placeholder="'+esc(T(f.placeholder))+'"') : "";
    var html;
    if(f.type === "textarea"){
      html = '<textarea class="input" name="'+f.name+'" rows="3" '+req+' '+onchangeAttr+' '+placeholderAttr+'>'+esc(val)+'</textarea>';
    } else if(f.type === "select"){
      var opts = typeof f.options === "function" ? f.options() : f.options;
      html = '<select class="input" name="'+f.name+'" '+req+' '+onchangeAttr+'>' + opts.map(function(o){
        var ov = (o && typeof o === "object") ? o.value : o;
        var ol = (o && typeof o === "object") ? o.label : o;
        return '<option value="'+esc(ov)+'" '+(ov===val?"selected":"")+'>'+esc(T(ol))+'</option>';
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
        + '<h3 class="modal-title">'+esc(T("确认删除"))+'</h3>'
        + '<p class="modal-text">'+esc(T3('确定要删除"'+label0+'"吗？此操作无法撤销。', 'Are you sure you want to delete "'+label0+'"? This cannot be undone.', 'Adakah anda pasti mahu memadam "'+label0+'"? Tindakan ini tidak boleh dibuat asal.'))+'</p>'
        + '<div class="modal-actions"><button class="btn btn-ghost" onclick="app.cancelDelete()">'+esc(T("取消"))+'</button>'
        + '<button class="btn btn-danger" onclick="app.confirmDeleteNow()">'+esc(T("确认删除"))+'</button></div>'
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
    var singularT = T(mod.singular);
    var heading = (LANG==="zh" ? ((isEdit?"编辑":"新建")+singularT) : ((isEdit?T("编辑"):T("新建"))+" "+singularT)) + (isEdit ? ("　"+baseRecord.id) : "");
    return '<div class="overlay" onclick="app.closeModal()"><div class="modal" onclick="event.stopPropagation()">'
      + '<h3 class="modal-title">'+esc(heading)+'</h3>'
      + '<form id="record-form" onsubmit="app.submitForm(event,\''+mod.key+'\')">'
      + '<div class="form-grid">' + visibleFields.map(function(f){ return renderField(f, record[f.name], record); }).join("") + '</div>'
      + '<div class="modal-actions"><button type="button" class="btn btn-ghost" onclick="app.closeModal()">'+esc(T("取消"))+'</button>'
      + '<button type="submit" class="btn btn-primary">'+esc(T("保存"))+'</button></div>'
      + '</form>'
      + '<datalist id="deptList">'+deptList.map(function(d){return '<option value="'+esc(d)+'">';}).join("")+'</datalist>'
      + '</div></div>';
  }

  function renderCard(mod, r){
    var colorKey = mod.statusColors[r.status] || "neutral";
    var wd = writeDisabled();
    var badge = (mod.badgeField && r[mod.badgeField]) ? '<span class="chip chip-outline">'+esc(T(r[mod.badgeField]))+'</span>' : '';
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
        attachHtml = '<div class="card-attachment"><button type="button" class="btn btn-ghost btn-sm" onclick="app.downloadAttachment(\''+mod.key+'\',\''+r.id+'\',\''+mod.attachmentField+'\')">'+esc(T("下载附件："))+esc(attach.name)+'</button></div>';
      }
    }
    var docLinkHtml = "";
    if(r.docLink){
      docLinkHtml = '<div class="card-attachment"><a class="btn btn-ghost btn-sm" href="'+esc(r.docLink)+'" target="_blank" rel="noopener noreferrer">'+esc(T("📄 打开文档链接"))+'</a></div>';
    }
    var extraActions = mod.extraActions ? mod.extraActions(r) : [];
    var extraActionsHtml = extraActions.map(function(a){
      return '<button class="btn btn-ghost btn-sm" onclick="'+a.onclick+'">'+esc(a.label)+'</button>';
    }).join("");
    var auditBits = [];
    if(r.createdBy) auditBits.push(T("创建：")+r.createdBy);
    if(r.updatedBy && r.updatedBy !== r.createdBy) auditBits.push(T("最近修改：")+r.updatedBy);
    var auditHtml = auditBits.length ? '<p class="card-audit">'+esc(auditBits.join(" · "))+'</p>' : '';
    return '<div class="card" style="--card-color:var(--'+colorKey+')">'
      + '<div class="card-top"><span class="card-id num">'+esc(T(r.id))+'</span><div class="card-top-chips">'+badge+extraChip+secondaryChip+'<span class="chip chip-'+colorKey+'">'+esc(T(r.status||""))+'</span></div></div>'
      + '<h3 class="card-title">'+esc(r[mod.titleField] || T("(未命名)"))+'</h3>'
      + '<div class="card-meta">' + mod.metaLines(r).map(function(l){ return '<p>'+esc(l)+'</p>'; }).join("") + '</div>'
      + auditHtml
      + docLinkHtml
      + attachHtml
      + '<div class="card-actions">'
      + extraActionsHtml
      + '<button class="btn btn-ghost btn-sm" onclick="app.exportRecord(\''+mod.key+'\',\''+r.id+'\')">'+esc(T("导出"))+'</button>'
      + '<button class="btn btn-ghost btn-sm" onclick="app.openModal(\''+mod.key+'\',\''+r.id+'\')" '+wd+'>'+esc(T("编辑"))+'</button>'
      + '<button class="btn btn-danger btn-sm" onclick="app.requestDelete(\''+mod.key+'\',\''+r.id+'\')" '+wd+'>'+esc(T("删除"))+'</button>'
      + '</div></div>';
  }

  function getFlaggedTrackItems(){
    var items = [];
    (STATE.meetings||[]).forEach(function(m){
      if(m.meetingType === "检讨会议") return;
      MODULES.meetings.reportSections.forEach(function(s){
        parseItems(m[s.itemsKey]).forEach(function(it){
          if(!it || !it.track || !String(it.text||"").trim()) return;
          var dept = s.short + "部门"; // canonical Chinese value — kept as-is so it still matches DEPARTMENTS options after being carried into a new tracker record
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
        + '<div class="flagged-info"><strong>'+esc(T(i.dept))+'</strong><span class="flagged-meeting">'+esc(T("来自会议："))+esc(i.meetingTitle)+(i.meetingDate?(" · "+esc(i.meetingDate)):"")+'</span>'
        + '<p class="flagged-text">'+esc(i.itemText)+'</p>'
        + '</div>'
        + '<button class="btn btn-primary btn-sm" data-meeting="'+esc(i.meetingId)+'" data-dept="'+esc(i.dept)+'" data-source="'+esc(i.sourceKey)+'" data-text="'+esc(i.itemText)+'" onclick="app.createTrackerFromFlag(this)" '+wd+'>'+esc(T("生成追踪记录"))+'</button>'
        + '</div>';
    }).join("");
    return '<div class="panel flagged-panel">'
      + '<h3 class="panel-title">'+esc(T("会议部门汇报标记为需要追踪"))+' <span class="chip chip-warn">'+items.length+'</span></h3>'
      + '<div class="flagged-list">'+rows+'</div>'
      + '</div>';
  }

  function renderModuleView(moduleKey){
    if(moduleKey === "repairs") return renderRepairsView();
    var mod = MODULES[moduleKey];
    var list = getFiltered(moduleKey).slice().reverse();
    var wd = writeDisabled();
    var modLabel = T(mod.label), modSingular = T(mod.singular);
    var searchPlaceholder = T3("搜索"+modLabel+"…", "Search "+modLabel+"…", "Cari "+modLabel+"…");
    var newBtnLabel = T3("+ 新建"+modSingular, "+ New "+modSingular, "+ "+modSingular+" Baharu");
    return '<div class="view-header">'
      + '<h2 class="view-title">'+esc(modLabel)+' <span class="view-count num">'+STATE[moduleKey].length+'</span></h2>'
      + '<div class="view-tools">'
      + '<input class="input search-input" type="text" placeholder="'+esc(searchPlaceholder)+'" value="'+esc(UI.search[moduleKey]||"")+'" oninput="app.setSearch(\''+moduleKey+'\', this.value)">'
      + '<button class="btn btn-ghost" onclick="app.exportModule(\''+moduleKey+'\')">'+esc(T("导出全部"))+'</button>'
      + '<button class="btn btn-primary" onclick="app.openModal(\''+moduleKey+'\', null)" '+wd+'>'+esc(newBtnLabel)+'</button>'
      + '</div></div>'
      + (moduleKey === "trackers" ? renderFlaggedPanel() : "")
      + (list.length
          ? '<div class="card-grid">' + list.map(function(r){ return renderCard(mod, r); }).join("") + '</div>'
          : '<div class="empty-state">'+esc(T(mod.emptyText))+'</div>');
  }

  /* --- 设备维修记录: list / calendar toggle -------------------------------
     Repairs is the one module with two view modes. List mode is the same
     generic search+card-grid every other module gets; calendar mode groups
     the same records onto a month grid by "维修日期" (repair date) so a
     week or a month's worth of repairs can be scanned/edited by date. */

  function pad2(n){ return n < 10 ? "0"+n : ""+n; }
  function dateToStr(d){ return d.getFullYear()+"-"+pad2(d.getMonth()+1)+"-"+pad2(d.getDate()); }

  var WEEKDAY_NAMES = { zh:["日","一","二","三","四","五","六"], en:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"], ms:["Ahd","Isn","Sel","Rab","Kha","Jum","Sab"] };
  var MONTH_NAMES = { en:["January","February","March","April","May","June","July","August","September","October","November","December"],
                       ms:["Januari","Februari","Mac","April","Mei","Jun","Julai","Ogos","September","Oktober","November","Disember"] };

  function renderRepairsView(){
    var mod = MODULES.repairs;
    var mode = UI.repairsViewMode || "list";
    var wd = writeDisabled();
    var modLabel = T(mod.label), modSingular = T(mod.singular);
    var searchPlaceholder = T3("搜索"+modLabel+"…", "Search "+modLabel+"…", "Cari "+modLabel+"…");
    var newBtnLabel = T3("+ 新建"+modSingular, "+ New "+modSingular, "+ "+modSingular+" Baharu");
    var toggle = '<div class="view-mode-toggle">'
      + '<button type="button" class="btn btn-sm '+(mode==="list"?"btn-primary":"btn-ghost")+'" onclick="app.setRepairsViewMode(\'list\')">'+esc(T3("列表","List","Senarai"))+'</button>'
      + '<button type="button" class="btn btn-sm '+(mode==="calendar"?"btn-primary":"btn-ghost")+'" onclick="app.setRepairsViewMode(\'calendar\')">'+esc(T3("日历","Calendar","Kalendar"))+'</button>'
      + '</div>';
    var header = '<div class="view-header">'
      + '<h2 class="view-title">'+esc(modLabel)+' <span class="view-count num">'+STATE.repairs.length+'</span></h2>'
      + '<div class="view-tools">'
      + toggle
      + (mode === "list" ? (
          '<input class="input search-input" type="text" placeholder="'+esc(searchPlaceholder)+'" value="'+esc(UI.search.repairs||"")+'" oninput="app.setSearch(\'repairs\', this.value)">'
          + '<button class="btn btn-ghost" onclick="app.exportModule(\'repairs\')">'+esc(T("导出全部"))+'</button>'
        ) : '')
      + '<button class="btn btn-primary" onclick="app.openModal(\'repairs\', null)" '+wd+'>'+esc(newBtnLabel)+'</button>'
      + '</div></div>';
    if(mode === "calendar") return header + renderRepairsCalendar();
    var list = getFiltered("repairs").slice().reverse();
    return header + (list.length
      ? '<div class="card-grid">' + list.map(function(r){ return renderCard(mod, r); }).join("") + '</div>'
      : '<div class="empty-state">'+esc(T(mod.emptyText))+'</div>');
  }

  function renderRepairsCalendar(){
    var cursor = UI.calendarCursor;
    var y = cursor.y, m = cursor.m;
    var first = new Date(y, m, 1);
    var startWeekday = first.getDay();
    var daysInMonth = new Date(y, m+1, 0).getDate();
    var todayStr = dateToStr(new Date());

    var byDate = {};
    (STATE.repairs||[]).forEach(function(r){
      if(!r.date) return;
      (byDate[r.date] = byDate[r.date] || []).push(r);
    });

    var monthLabel = LANG === "zh" ? (y+" 年 "+(m+1)+" 月") : (MONTH_NAMES[LANG][m]+" "+y);
    var weekdayNames = WEEKDAY_NAMES[LANG] || WEEKDAY_NAMES.zh;

    var cells = [];
    for(var i=0;i<startWeekday;i++) cells.push('<div class="cal-cell cal-cell-empty"></div>');
    for(var day=1; day<=daysInMonth; day++){
      var dateStr = y+"-"+pad2(m+1)+"-"+pad2(day);
      var dayRecords = byDate[dateStr] || [];
      var isToday = dateStr === todayStr;
      var isSelected = UI.calendarSelectedDate === dateStr;
      var dots = dayRecords.slice(0,4).map(function(r){
        var colorKey = MODULES.repairs.statusColors[r.status] || "neutral";
        return '<span class="cal-dot cal-dot-'+colorKey+'" title="'+esc(r.equipment||"")+'"></span>';
      }).join("");
      var more = dayRecords.length > 4 ? '<span class="cal-more">+'+(dayRecords.length-4)+'</span>' : '';
      var cls = "cal-cell"+(isToday?" cal-cell-today":"")+(isSelected?" cal-cell-selected":"")+(dayRecords.length?" cal-cell-has":"");
      cells.push('<button type="button" class="'+cls+'" onclick="app.selectCalendarDate(\''+dateStr+'\')">'
        + '<span class="cal-daynum">'+day+'</span>'
        + '<span class="cal-dots">'+dots+more+'</span>'
        + '</button>');
    }

    var nav = '<div class="cal-nav">'
      + '<button type="button" class="btn btn-ghost btn-sm" onclick="app.calendarNav(-1)">‹</button>'
      + '<span class="cal-month-label">'+esc(monthLabel)+'</span>'
      + '<button type="button" class="btn btn-ghost btn-sm" onclick="app.calendarNav(1)">›</button>'
      + '<button type="button" class="btn btn-ghost btn-sm" onclick="app.calendarNav(0)">'+esc(T3("今天","Today","Hari Ini"))+'</button>'
      + '</div>';

    var grid = '<div class="cal-grid">'
      + weekdayNames.map(function(w){ return '<div class="cal-weekday">'+esc(w)+'</div>'; }).join("")
      + cells.join("")
      + '</div>';

    return '<div class="calendar-wrap">' + nav + grid + '</div>' + renderCalendarDayPanel();
  }

  function renderCalendarDayPanel(){
    var sel = UI.calendarSelectedDate;
    if(!sel) return '';
    var wd = writeDisabled();
    var records = (STATE.repairs||[]).filter(function(r){ return r.date === sel; });
    var listHtml = records.length
      ? '<div class="card-grid">' + records.map(function(r){ return renderCard(MODULES.repairs, r); }).join("") + '</div>'
      : '<div class="empty-state">'+esc(T3("这一天还没有维修记录。","No repair records on this day yet.","Belum ada rekod pembaikan pada hari ini."))+'</div>';
    return '<div class="panel cal-day-panel">'
      + '<div class="view-header"><h3 class="panel-title">'+esc(sel)+'</h3>'
      + '<div class="view-tools">'
      + '<button class="btn btn-primary btn-sm" onclick="app.openModal(\'repairs\', null, {date:\''+sel+'\'})" '+wd+'>'+esc(T3("+ 新建维修记录","+ New Repair Record","+ Rekod Pembaikan Baharu"))+'</button>'
      + '<button class="btn btn-ghost btn-sm" onclick="app.selectCalendarDate(null)">'+esc(T3("关闭","Close","Tutup"))+'</button>'
      + '</div></div>'
      + listHtml
      + '</div>';
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
    var m = STATE.meetings, s = STATE.sops, d = STATE.damages, t = STATE.trackers, rp = STATE.repairs||[];
    var insp = STATE.inspections, cpl = STATE.complaints, cal = STATE.calibrations, trc = STATE.traces;
    var veh = STATE.vehicles||[];
    var dPending = d.filter(function(x){ return x.status === "待处理"; });
    var tOpen = t.filter(function(x){ return x.status !== "已完成"; });
    var tOverdue = t.filter(function(x){ return x.status === "已延误"; });
    var inspFail = insp.filter(function(x){ return x.result === "不合格"; });
    var cplPending = cpl.filter(function(x){ return x.status !== "已完成"; });
    var rpOpen = rp.filter(function(x){ return x.status !== "已完成"; });
    var today = new Date(); today.setHours(0,0,0,0);
    var calDue = cal.filter(function(x){
      if(!x.nextDueDate) return false;
      var due = new Date(x.nextDueDate+"T00:00:00");
      if(isNaN(due.getTime())) return false;
      return Math.round((due-today)/86400000) <= 14;
    });
    var vehDue = veh.filter(function(x){
      return (daysUntil(x.roadTaxExpiry) !== null && daysUntil(x.roadTaxExpiry) <= 30)
        || (daysUntil(x.insuranceExpiry) !== null && daysUntil(x.insuranceExpiry) <= 30);
    });
    var cards = [
      {key:"meetings", label:T3("会议记录","Meeting Minutes","Minit Mesyuarat"), big:m.length, sub: m.length ? statusBreakdown(m,["进行中","已完成","待跟进"]) : T("尚无记录")},
      {key:"sops", label:T3("SOP 文档","SOP Documents","Dokumen SOP"), big:s.length, sub: s.length ? statusBreakdown(s,["启用","草稿","停用"]) : T("尚无记录")},
      {key:"inspections", label:T("检验记录"), big: inspFail.length, sub: T3("共 "+insp.length+" 条 · 不合格 "+inspFail.length, insp.length+" total · "+inspFail.length+" failed", insp.length+" jumlah · "+inspFail.length+" gagal"), highlight: inspFail.length>0},
      {key:"complaints", label:T("客户投诉"), big: cplPending.length, sub: T3("共 "+cpl.length+" 条 · 待处理 "+cplPending.length, cpl.length+" total · "+cplPending.length+" pending", cpl.length+" jumlah · "+cplPending.length+" belum selesai"), highlight: cplPending.length>0},
      {key:"calibrations", label:T("设备校准"), big: calDue.length, sub: T3("共 "+cal.length+" 条 · 即将/已到期 "+calDue.length, cal.length+" total · "+calDue.length+" due soon/overdue", cal.length+" jumlah · "+calDue.length+" akan/telah tamat tempoh"), highlight: calDue.length>0},
      {key:"repairs", label:T("设备维修"), big: rpOpen.length, sub: T3("共 "+rp.length+" 条 · 未完成 "+rpOpen.length, rp.length+" total · "+rpOpen.length+" open", rp.length+" jumlah · "+rpOpen.length+" belum selesai"), highlight: rpOpen.length>0},
      {key:"traces", label:T("批次追溯"), big: trc.length, sub: T3("共 "+trc.length+" 条记录", trc.length+" records", trc.length+" rekod")},
      {key:"vehicles", label:T("汽车管理"), big: vehDue.length, sub: T3("共 "+veh.length+" 辆 · 即将/已到期 "+vehDue.length, veh.length+" vehicles · "+vehDue.length+" due soon/overdue", veh.length+" kenderaan · "+vehDue.length+" akan/telah tamat tempoh"), highlight: vehDue.length>0},
      {key:"damages", label:T("产品损毁记录"), big: dPending.length, sub: T3("共 "+d.length+" 条记录", d.length+" records", d.length+" rekod"), highlight: dPending.length>0},
      {key:"trackers", label:T("追踪记录"), big: tOpen.length, sub: tOverdue.length ? T3("共 "+t.length+" 条 · 已延误 "+tOverdue.length, t.length+" total · "+tOverdue.length+" overdue", t.length+" jumlah · "+tOverdue.length+" tertunggak") : T3("共 "+t.length+" 条", t.length+" total", t.length+" jumlah"), highlight: tOverdue.length>0},
      {key:"leaves", label:T3("请假申请","Leave Requests","Permohonan Cuti"), link: LEAVE_APP_URL, sub:T3("前往 exclwell 系统","Go to exclwell system","Pergi ke sistem exclwell")}
    ].filter(function(c){ return isModuleAllowed(c.key); });
    return '<div class="view-header"><h2 class="view-title">'+esc(T("总览"))+'</h2></div>'
      + '<div class="stat-grid">' + cards.map(renderStatCard).join("") + '</div>';
  }

  function renderExternalEntry(key){
    var ext = EXTERNAL_VIEWS[key];
    return '<div class="view-header"><h2 class="view-title">'+esc(T(ext.label))+'</h2></div>'
      + '<div class="panel external-panel">'
      + '<h3 class="panel-title">'+esc(T(ext.title))+'</h3>'
      + '<p class="external-desc">'+esc(T(ext.desc))+'</p>'
      + '<a class="btn btn-primary" href="'+esc(ext.url)+'" target="_blank" rel="noopener noreferrer">'+esc(T(ext.cta))+'</a>'
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
      ACCOUNTS.error = "加载失败，请重试"; // translated at display site via T()
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
      rows = '<div class="empty-state">'+esc(T("加载中…"))+'</div>';
    } else if(ACCOUNTS.error){
      rows = '<div class="empty-state">'+esc(T(ACCOUNTS.error))+'</div>';
    } else if(!ACCOUNTS.list || !ACCOUNTS.list.length){
      rows = '<div class="empty-state">'+esc(T("还没有团队成员账号。"))+'</div>';
    } else {
      rows = '<div class="card-grid">' + ACCOUNTS.list.map(function(u){
        var isMe = CURRENT_USER && CURRENT_USER.id === u.id;
        var permSummary = Array.isArray(u.allowedModules)
          ? (u.allowedModules.length ? (T("可见：") + u.allowedModules.map(moduleLabel).join(LANG==="zh"?"、":", ")) : T("可见：无（未分配任何模块）"))
          : T("可见：全部");
        var editing = ACCOUNTS.editingId === u.id;
        var editPanel = editing
          ? '<form class="perm-edit-form" onsubmit="app.savePermissions(event,\''+u.id+'\')">'
            + '<input class="input" type="text" name="perm_phone" placeholder="'+esc(T("手机号码（可选，用于 WhatsApp 提醒）"))+'" value="'+esc(u.phone||"")+'" style="margin-bottom:10px;">'
            + renderModuleCheckboxes("perm_", u.allowedModules)
            + '<p class="external-desc" style="margin:8px 0;">'+esc(T("一个都不勾 = 不限制，可看到全部模块。"))+'</p>'
            + '<div class="card-actions">'
            + '<button type="submit" class="btn btn-primary btn-sm" '+wd+'>'+esc(T("保存权限"))+'</button>'
            + '<button type="button" class="btn btn-ghost btn-sm" onclick="app.togglePermEdit(null)">'+esc(T("取消"))+'</button>'
            + '</div></form>'
          : '';
        return '<div class="card">'
          + '<div class="card-top"><span class="card-id num">@'+esc(u.username)+'</span>'+(isMe?'<span class="chip chip-accent">'+esc(T("我"))+'</span>':'')+'</div>'
          + '<h3 class="card-title">'+esc(u.name)+'</h3>'
          + '<div class="card-meta"><p>'+(u.createdAt?(esc(T("加入时间："))+esc(u.createdAt.slice(0,10))):"")+'</p><p>'+esc(permSummary)+'</p>'+(u.phone?('<p>'+esc(T("手机号码："))+esc(u.phone)+'</p>'):'')+'</div>'
          + (editing ? editPanel : (
              '<div class="card-actions">'
              + '<button class="btn btn-ghost btn-sm" onclick="app.togglePermEdit(\''+u.id+'\')" '+wd+'>'+esc(T("编辑权限"))+'</button>'
              + '<button class="btn btn-danger btn-sm" onclick="app.removeTeammate(\''+u.id+'\',\''+esc(u.name)+'\')" '+wd+'>'+esc(T("移除账号"))+'</button>'
              + '</div>'
            ))
          + '</div>';
      }).join("") + '</div>';
    }
    return '<div class="view-header"><h2 class="view-title">'+esc(T("账号管理"))+'</h2></div>'
      + '<div class="panel" style="margin-bottom:18px;">'
      + '<h3 class="panel-title">'+esc(T("添加团队成员"))+'</h3>'
      + '<p class="external-desc">'+esc(T("需要团队邀请码（跟登录页\"没有账号\"用的是同一个），新成员自己在登录页设置账号也可以，不一定要你来加。默认能看到全部模块，需要限制的话在下面勾选。"))+'</p>'
      + '<form id="add-teammate-form" class="add-teammate-form" onsubmit="app.addTeammate(event)">'
      + '<input class="input" type="password" name="teamPin" placeholder="'+esc(T("团队邀请码"))+'" autocomplete="off">'
      + '<input class="input" type="text" name="name" placeholder="'+esc(T("姓名"))+'">'
      + '<input class="input" type="text" name="username" placeholder="'+esc(T("用户名"))+'">'
      + '<input class="input" type="password" name="password" placeholder="'+esc(T("初始密码（至少 4 位）"))+'" autocomplete="new-password">'
      + '<input class="input" type="text" name="phone" placeholder="'+esc(T("手机号码（可选，用于 WhatsApp 提醒）"))+'" autocomplete="tel">'
      + '<p class="external-desc" style="margin:10px 0 4px;">'+esc(T("限制这个人只能看到（不勾选 = 不限制，全部可见）："))+'</p>'
      + renderModuleCheckboxes("new_", [])
      + '<button type="submit" class="btn btn-primary" '+wd+'>'+esc(T("添加"))+'</button>'
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
      phone: form.elements["phone"].value,
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
      toast(T("已添加团队成员"));
      form.reset();
      if(btn) btn.disabled = false;
      fetchAccounts();
      refreshContacts();
    }).catch(function(err){
      if(err && err.message === "__unauthorized__") return;
      toast(T(err.message) || T("添加失败，请重试"));
      if(btn) btn.disabled = false;
    });
  }

  function savePermissions(e, id){
    e.preventDefault();
    var form = e.target;
    var allowedModules = collectCheckedModules(form, "perm_");
    var phone = form.elements["perm_phone"] ? form.elements["perm_phone"].value : undefined;
    var btn = form.querySelector('button[type="submit"]');
    if(btn) btn.disabled = true;
    fetch("/api/users", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({op:"setPermissions", id:id, allowedModules:allowedModules, phone:phone})
    }).then(function(res){
      if(res.status === 401){ showLogin("登录已过期，请重新输入密码。"); throw new Error("__unauthorized__"); }
      return res.json().catch(function(){ return {}; }).then(function(json){
        if(!res.ok) throw new Error(json.message || "保存失败，请重试");
        return json;
      });
    }).then(function(){
      toast(T("已更新权限"));
      ACCOUNTS.editingId = null;
      fetchAccounts();
      refreshContacts();
    }).catch(function(err){
      if(err && err.message === "__unauthorized__") return;
      toast(T(err.message) || T("保存失败，请重试"));
      if(btn) btn.disabled = false;
    });
  }

  function removeTeammate(id, name){
    if(!window.confirm(T3('确定要移除 "'+name+'" 的账号吗？此操作无法撤销，对方将无法再登录（已保存的记录不受影响）。', 'Are you sure you want to remove "'+name+'"\'s account? This cannot be undone — they will no longer be able to log in (their saved records are not affected).', 'Adakah anda pasti mahu membuang akaun "'+name+'"? Tindakan ini tidak boleh dibuat asal — mereka tidak akan dapat log masuk lagi (rekod yang disimpan tidak terjejas).'))) return;
    fetch("/api/users", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({op:"remove", id:id})
    }).then(function(res){
      if(res.status === 401){ showLogin("登录已过期，请重新输入密码。"); throw new Error("__unauthorized__"); }
      if(!res.ok) throw new Error("remove_failed");
      return res.json();
    }).then(function(){
      toast(T("已移除账号"));
      fetchAccounts();
    }).catch(function(err){
      if(err && err.message === "__unauthorized__") return;
      toast(T("移除失败，请重试"));
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

  function setRepairsViewMode(mode){
    UI.repairsViewMode = (mode === "calendar") ? "calendar" : "list";
    render();
  }
  function calendarNav(delta){
    if(delta === 0){
      var now = new Date();
      UI.calendarCursor = {y:now.getFullYear(), m:now.getMonth()};
    } else {
      var c = UI.calendarCursor;
      var next = new Date(c.y, c.m + delta, 1);
      UI.calendarCursor = {y:next.getFullYear(), m:next.getMonth()};
    }
    render();
  }
  function selectCalendarDate(dateStr){
    UI.calendarSelectedDate = (UI.calendarSelectedDate === dateStr) ? null : dateStr;
    render();
  }
  function openModal(moduleKey, id, draft){ UI.modal = {module:moduleKey, id: id || null, draft: draft || null}; render(); }

  function createTrackerFromFlag(btn){
    var meetingId = btn.getAttribute("data-meeting");
    var dept = btn.getAttribute("data-dept");
    var sourceKey = btn.getAttribute("data-source");
    var text = btn.getAttribute("data-text") || "";
    var issue = (T(dept)+T3("追踪：","Tracking: ","Penjejakan: ")+text).slice(0,120);
    openModal("trackers", null, { department: dept, issue: issue, meetingRef: meetingId, sourceItem: sourceKey });
  }
  function createTrackerFromRepair(repairId){
    var r = (STATE.repairs||[]).find(function(x){ return x.id === repairId; });
    if(!r) return;
    var issue = (T3("设备维修跟进：","Equipment repair follow-up: ","Susulan pembaikan peralatan: ")+(r.equipment||r.id)).slice(0,120);
    openModal("trackers", null, { department: r.department, issue: issue, repairRef: r.id });
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
      if(f.required && el && !data[f.name]){ toast(T3('请填写"'+fieldLabel(f, data)+'"', 'Please fill in "'+fieldLabel(f, data)+'"', 'Sila isi "'+fieldLabel(f, data)+'"')); return; }
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
    if(!STATE.counters) STATE.counters = {MTG:0,SOP:0,STF:0,DMG:0,TRK:0,INS:0,CPL:0,CAL:0,TRC:0,RPR:0,VEH:0};
    ["meetings","sops","staff","damages","trackers","repairs","vehicles","inspections","complaints","calibrations","traces"].forEach(function(k){
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
      toast(T3("保存失败：","Save failed: ","Simpan gagal: ") + ((err && err.message) || T("请检查网络后重试")));
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

  // CONTACTS otherwise only refreshes on the 20s poll — call this right
  // after adding a teammate or saving their phone number in 账号管理 so a
  // WhatsApp reminder can find it immediately instead of up to 20s later.
  function refreshContacts(){
    fetchState().then(function(json){
      if(json && Array.isArray(json.contacts)) CONTACTS = json.contacts;
    }).catch(function(){});
  }

  function pollState(){
    if(UI && UI.modal) return; // don't disrupt someone mid-edit
    fetchState().then(function(json){
      if(!json) return;
      applyServerState(json.state);
      if(json.user) CURRENT_USER = json.user;
      if(Array.isArray(json.contacts)) CONTACTS = json.contacts;
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
        + renderLangSwitcher("lang-switch-login")
        + '<h2 class="login-title">'+esc(T("团队档案台"))+'</h2>'
        + '<p class="login-sub">'+esc(T("用团队邀请码设置你的账号——首次使用、忘记密码、新成员加入都用这个"))+'</p>'
        + '<form id="login-form" onsubmit="app.submitJoin(event)">'
        + '<input class="input login-input" type="password" name="teamPin" placeholder="'+esc(T("团队邀请码"))+'" autofocus autocomplete="off">'
        + '<input class="input login-input" type="text" name="name" placeholder="'+esc(T("你的姓名"))+'" autocomplete="name">'
        + '<input class="input login-input" type="text" name="username" placeholder="'+esc(T("用户名（登录用，如拼音）"))+'" autocomplete="username">'
        + '<input class="input login-input" type="password" name="password" placeholder="'+esc(T("设置密码（至少 4 位）"))+'" autocomplete="new-password">'
        + '<p class="login-error">'+esc(T(msg)||"")+'</p>'
        + '<button type="submit" class="btn btn-primary login-btn">'+esc(T("设置并进入"))+'</button>'
        + '</form>'
        + '<button type="button" class="login-toggle" onclick="app.toggleLoginMode()">'+esc(T("已经有账号？点此登录"))+'</button>'
        + '</div></div>';
    } else {
      root.innerHTML = '<div class="login-gate"><div class="login-card">'
        + renderLangSwitcher("lang-switch-login")
        + '<h2 class="login-title">'+esc(T("团队档案台"))+'</h2>'
        + '<p class="login-sub">'+esc(T("用你自己的账号登录"))+'</p>'
        + '<form id="login-form" onsubmit="app.submitLogin(event)">'
        + '<input class="input login-input" type="text" name="username" placeholder="'+esc(T("用户名"))+'" autocomplete="username" autofocus>'
        + '<input class="input login-input" type="password" name="password" placeholder="'+esc(T("密码"))+'" autocomplete="current-password">'
        + '<p class="login-error">'+esc(T(msg)||"")+'</p>'
        + '<button type="submit" class="btn btn-primary login-btn">'+esc(T("登录"))+'</button>'
        + '</form>'
        + '<button type="button" class="login-toggle" onclick="app.toggleLoginMode()">'+esc(T("没有账号 / 忘记密码 / 新成员加入"))+'</button>'
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
    document.getElementById("app-root").innerHTML = '<div class="app-loading">'+esc(T("加载中…"))+'</div>';
    fetchState().then(function(json){
      if(!json){
        showLogin();
        return;
      }
      applyServerState(json.state);
      if(json.user) CURRENT_USER = json.user;
      if(Array.isArray(json.contacts)) CONTACTS = json.contacts;
      mode = "writer";
      render();
      if(pollTimer) clearInterval(pollTimer);
      pollTimer = setInterval(pollState, 20000);
    }).catch(function(){
      document.getElementById("app-root").innerHTML = '<div class="app-loading">'+esc(T("加载失败，请刷新页面重试"))+'</div>';
    });
  }

  window.app = {
    setView: setView, setSearch: setSearch, openModal: openModal, closeModal: closeModal,
    requestDelete: requestDelete, cancelDelete: cancelDelete, confirmDeleteNow: confirmDeleteNow,
    submitForm: submitForm, onMeetingTypeChange: onMeetingTypeChange,
    handleFileSelect: handleFileSelect, removeAttachment: removeAttachment, downloadAttachment: downloadAttachment,
    submitLogin: submitLogin, submitJoin: submitJoin, toggleLoginMode: toggleLoginMode, logout: logout,
    createTrackerFromFlag: createTrackerFromFlag, createTrackerFromRepair: createTrackerFromRepair,
    addReportItem: addReportItem, removeReportItem: removeReportItem, syncReportItems: syncReportItems,
    addTeammate: addTeammate, removeTeammate: removeTeammate,
    togglePermEdit: togglePermEdit, savePermissions: savePermissions,
    setLang: setLang,
    exportRecord: exportRecord, exportModule: exportModule,
    sendWhatsAppReminder: sendWhatsAppReminder,
    setRepairsViewMode: setRepairsViewMode, calendarNav: calendarNav, selectCalendarDate: selectCalendarDate
  };

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
