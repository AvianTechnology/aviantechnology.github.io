/* ===== Pulse — Analytics Dashboard · Avian Technology =====
   Self-contained. No backend, no libraries. Baked-in sample data,
   SVG charts rendered by hand, all interactions client-side. */

(function () {
  "use strict";

  /* ---------- Sample data per date range ---------- */
  const CHANNELS = [
    { name: "Online store", color: "#0a66c2" },
    { name: "Marketplace",  color: "#3f93c9" },
    { name: "In-store",     color: "#8fc0e0" },
    { name: "Social",       color: "#b9dcef" },
  ];

  const CATEGORIES = ["Apparel", "Footwear", "Accessories", "Home", "Beauty"];

  const DATA = {
    today: {
      sub: "Today, hour by hour",
      labels: ["8a","10a","12p","2p","4p","6p","8p","10p"],
      revenue: [320, 540, 880, 760, 1020, 1340, 1180, 640],
      prev:    [280, 470, 690, 820, 900, 1100, 1020, 700],
      donut:   [54, 22, 16, 8],
      bars:    [38, 24, 19, 12, 9],
      kpis: { revenue: 7180, orders: 64, customers: 51, growth: 8.4 },
      deltas:{ revenue: 8.4, orders: 5.1, customers: 11.2, growth: 1.3 },
    },
    "7d": {
      sub: "Last 7 days",
      labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
      revenue: [4200, 5100, 4800, 6300, 7100, 9200, 8100],
      prev:    [3800, 4600, 4900, 5400, 6100, 7800, 7200],
      donut:   [48, 26, 17, 9],
      bars:    [142, 98, 76, 54, 41],
      kpis: { revenue: 44800, orders: 412, customers: 318, growth: 12.6 },
      deltas:{ revenue: 14.2, orders: 9.3, customers: 6.8, growth: 2.1 },
    },
    "30d": {
      sub: "Last 30 days",
      labels: ["W1","W2","W3","W4","W5"],
      revenue: [38200, 41100, 45600, 49800, 52400],
      prev:    [35100, 37800, 40200, 43900, 46100],
      donut:   [46, 27, 18, 9],
      bars:    [612, 438, 351, 240, 188],
      kpis: { revenue: 227100, orders: 1829, customers: 1264, growth: 15.1 },
      deltas:{ revenue: 11.8, orders: 7.4, customers: 9.9, growth: -1.2 },
    },
    "12m": {
      sub: "Last 12 months",
      labels: ["Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun"],
      revenue: [142, 158, 171, 165, 198, 246, 188, 176, 204, 221, 238, 263].map(v=>v*1000),
      prev:    [128, 139, 150, 162, 170, 205, 174, 161, 182, 196, 210, 228].map(v=>v*1000),
      donut:   [44, 28, 18, 10],
      bars:    [7320, 5240, 4180, 3010, 2360],
      kpis: { revenue: 2370000, orders: 21640, customers: 14820, growth: 18.9 },
      deltas:{ revenue: 16.4, orders: 12.1, customers: 14.3, growth: 3.2 },
    },
  };

  const ORDERS = [
    { id:"#PT-4824", customer:"Aisha Rahman",    channel:"Online store", status:"Paid",     total:268.50, date:"Jun 15" },
    { id:"#PT-4823", customer:"Maya Sørensen",   channel:"Online store", status:"Paid",     total:312.00, date:"Jun 15" },
    { id:"#PT-4822", customer:"Ethan Wright",    channel:"Social",       status:"Paid",     total:142.20, date:"Jun 14" },
    { id:"#PT-4821", customer:"Maya Sørensen",   channel:"Online store", status:"Paid",     total:248.00, date:"Jun 14" },
    { id:"#PT-4820", customer:"Liam O'Connor",   channel:"Marketplace",  status:"Paid",     total:89.50,  date:"Jun 14" },
    { id:"#PT-4819", customer:"Aisha Rahman",    channel:"Online store", status:"Pending",  total:412.00, date:"Jun 13" },
    { id:"#PT-4818", customer:"Noah Becker",     channel:"In-store",     status:"Paid",     total:64.25,  date:"Jun 13" },
    { id:"#PT-4817", customer:"Sofia Costa",     channel:"Social",       status:"Refunded", total:130.00, date:"Jun 13" },
    { id:"#PT-4816", customer:"Ethan Wright",    channel:"Online store", status:"Paid",     total:317.80, date:"Jun 12" },
    { id:"#PT-4815", customer:"Priya Nair",      channel:"Marketplace",  status:"Paid",     total:55.00,  date:"Jun 12" },
    { id:"#PT-4814", customer:"Diego Fernández", channel:"Online store", status:"Pending",  total:198.40, date:"Jun 12" },
    { id:"#PT-4813", customer:"Hannah Kim",      channel:"In-store",     status:"Paid",     total:402.10, date:"Jun 11" },
    { id:"#PT-4812", customer:"Aisha Rahman",    channel:"Marketplace",  status:"Paid",     total:176.30, date:"Jun 11" },
    { id:"#PT-4811", customer:"Grace Mensah",    channel:"Online store", status:"Refunded", total:144.00, date:"Jun 10" },
    { id:"#PT-4810", customer:"Yuki Tanaka",     channel:"Marketplace",  status:"Paid",     total:289.99, date:"Jun 10" },
    { id:"#PT-4809", customer:"Maya Sørensen",   channel:"Social",       status:"Paid",     total:98.40,  date:"Jun 10" },
    { id:"#PT-4808", customer:"Hannah Kim",      channel:"Online store", status:"Paid",     total:221.00, date:"Jun 9"  },
    { id:"#PT-4807", customer:"Ethan Wright",    channel:"In-store",     status:"Pending",  total:88.75,  date:"Jun 9"  },
    { id:"#PT-4806", customer:"Priya Nair",      channel:"Online store", status:"Paid",     total:134.60, date:"Jun 8"  },
    { id:"#PT-4805", customer:"Liam O'Connor",   channel:"Online store", status:"Refunded", total:72.00,  date:"Jun 8"  },
    { id:"#PT-4804", customer:"Aisha Rahman",    channel:"Online store", status:"Paid",     total:305.10, date:"Jun 7"  },
    { id:"#PT-4803", customer:"Tomas Novak",     channel:"Social",       status:"Paid",     total:76.90,  date:"Jun 7"  },
  ];

  const AV_COLORS = ["#0a66c2","#3f93c9","#1f9d6b","#b9831a","#7c5cff","#e0556b","#0fb5ba","#d6699a"];

  /* ---------- Helpers ---------- */
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const clamp = (n,a,b) => Math.max(a, Math.min(b, n));
  const money = n => "$" + Math.round(n).toLocaleString("en-US");
  const moneyShort = n => n>=1e6 ? "$"+(n/1e6).toFixed(2)+"M" : n>=1e3 ? "$"+(n/1e3).toFixed(0)+"k" : "$"+Math.round(n);
  const initials = name => name.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase();
  const colorFor = str => AV_COLORS[[...str].reduce((a,c)=>a+c.charCodeAt(0),0) % AV_COLORS.length];

  let currentRange = "7d";
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Animated count-up ---------- */
  const lastShown = {};           // remember last numeric value per KPI key
  function animateNumber(el, key, to, fmt) {
    const from = (key in lastShown) ? lastShown[key] : 0;
    lastShown[key] = to;
    if (prefersReduced || from === to) { el.textContent = fmt(to); return; }
    const dur = 650, t0 = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    (function frame(now){
      const t = clamp((now - t0) / dur, 0, 1);
      el.textContent = fmt(from + (to - from) * ease(t));
      if (t < 1) requestAnimationFrame(frame);
    })(t0);
    // safety net: guarantee the final value lands even if rAF is throttled/paused
    setTimeout(() => { el.textContent = fmt(to); }, dur + 60);
  }

  /* ---------- KPI cards ---------- */
  const KPI_CFG = [
    { key:"revenue",   label:"Revenue",   icon:"$", fmt:money,                  spark:d=>d.revenue },
    { key:"orders",    label:"Orders",    icon:"◷", fmt:n=>Math.round(n).toLocaleString(), spark:d=>d.revenue.map(v=>v*0.92) },
    { key:"customers", label:"Customers", icon:"◐", fmt:n=>Math.round(n).toLocaleString(), spark:d=>d.prev },
    { key:"growth",    label:"Growth",    icon:"↗", fmt:n=>n.toFixed(1)+"%",     spark:d=>d.revenue.map((v,i)=>v-d.prev[i]) },
  ];

  function renderKPIs(d) {
    const exists = $("#kpis").children.length > 0;
    if (!exists) {
      $("#kpis").innerHTML = KPI_CFG.map(c => {
        const dl = d.deltas[c.key], up = dl >= 0;
        return `<div class="kpi">
          <div class="kpi__top"><span class="kpi__label">${c.label}</span><span class="kpi__icon">${c.icon}</span></div>
          <div class="kpi__value" data-key="${c.key}">0</div>
          <div class="kpi__delta ${up?"up":"down"}" data-key="${c.key}">${up?"▲":"▼"} ${Math.abs(dl).toFixed(1)}% <span>vs prev</span></div>
          <div class="kpi__sparkholder" data-key="${c.key}">${sparkline(c.spark(d))}</div>
        </div>`;
      }).join("");
    }
    // animate values + refresh deltas/sparklines
    KPI_CFG.forEach(c => {
      const dl = d.deltas[c.key], up = dl >= 0;
      animateNumber($(`.kpi__value[data-key="${c.key}"]`), c.key, d.kpis[c.key], c.fmt);
      const del = $(`.kpi__delta[data-key="${c.key}"]`);
      del.className = `kpi__delta ${up?"up":"down"}`;
      del.dataset.key = c.key;
      del.innerHTML = `${up?"▲":"▼"} ${Math.abs(dl).toFixed(1)}% <span>vs prev</span>`;
      $(`.kpi__sparkholder[data-key="${c.key}"]`).innerHTML = sparkline(c.spark(d));
    });
  }

  function sparkline(vals) {
    const w=240, h=42, min=Math.min(...vals), max=Math.max(...vals), r=(max-min)||1;
    const pts = vals.map((v,i)=>[ i/(vals.length-1)*w, h - ((v-min)/r)*(h-8) - 4 ]);
    const line = pts.map((p,i)=>(i?"L":"M")+p[0].toFixed(1)+" "+p[1].toFixed(1)).join(" ");
    const area = line + ` L${w} ${h} L0 ${h} Z`;
    return `<svg class="kpi__spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
      <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#3f93c9" stop-opacity=".30"/><stop offset="1" stop-color="#3f93c9" stop-opacity="0"/></linearGradient></defs>
      <path d="${area}" fill="url(#sg)"/><path d="${line}" fill="none" stroke="#0a66c2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }

  /* ---------- Line / area chart (with hover tooltip) ---------- */
  const LC = { w:720, h:300, padL:58, padR:16, padT:18, padB:34 };
  let lineState = null;   // { d, x(i), y(v) }

  function renderLine(d) {
    const { w,h,padL,padR,padT,padB } = LC;
    const iw=w-padL-padR, ih=h-padT-padB;
    const max=Math.max(...d.revenue,...d.prev)*1.08, min=0;
    const x=i=> padL + (i/(d.labels.length-1))*iw;
    const y=v=> padT + ih - ((v-min)/(max-min))*ih;
    const path=(arr)=>arr.map((v,i)=>(i?"L":"M")+x(i).toFixed(1)+" "+y(v).toFixed(1)).join(" ");
    const area=path(d.revenue)+` L${x(d.revenue.length-1)} ${padT+ih} L${padL} ${padT+ih} Z`;

    const ticks=4; let grid="", ylab="";
    for(let i=0;i<=ticks;i++){
      const v=max/ticks*i, gy=y(v);
      grid+=`<line x1="${padL}" y1="${gy.toFixed(1)}" x2="${w-padR}" y2="${gy.toFixed(1)}" class="gl"/>`;
      ylab+=`<text x="${padL-10}" y="${(gy+4).toFixed(1)}" class="ax ax--y">${moneyShort(v)}</text>`;
    }
    const xlab=d.labels.map((l,i)=>`<text x="${x(i).toFixed(1)}" y="${h-12}" class="ax ax--x">${l}</text>`).join("");

    $("#lineChart").innerHTML = `<svg viewBox="0 0 ${w} ${h}">
      <style>
        .gl{stroke:var(--border);stroke-width:1}
        .ax{fill:var(--muted);font:500 11px var(--font-body)}
        .ax--y{text-anchor:end}.ax--x{text-anchor:middle}
        .dot{fill:var(--panel);stroke:#0a66c2;stroke-width:2}
        #revLine{stroke-dasharray:var(--len);stroke-dashoffset:var(--len);animation:draw .9s ease forwards}
        @keyframes draw{to{stroke-dashoffset:0}}
      </style>
      <defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#0a66c2" stop-opacity=".22"/><stop offset="1" stop-color="#0a66c2" stop-opacity="0"/></linearGradient></defs>
      ${grid}${ylab}
      <path d="${path(d.prev)}" fill="none" stroke="#8fc0e0" stroke-width="2.5" stroke-dasharray="5 5" stroke-linecap="round"/>
      <path d="${area}" fill="url(#lg)"/>
      <line id="cross" x1="0" y1="${padT}" x2="0" y2="${padT+ih}" stroke="#0a66c2" stroke-width="1" stroke-dasharray="3 3" opacity="0"/>
      <path id="revLine" d="${path(d.revenue)}" fill="none" stroke="#0a66c2" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <circle id="hot" r="5" fill="#0a66c2" stroke="#fff" stroke-width="2" opacity="0"/>
      ${d.revenue.map((v,i)=>`<circle cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="3.5" class="dot"/>`).join("")}
      ${xlab}
    </svg>`;
    $("#revSub").textContent = d.sub;

    const svg = $("#lineChart svg");
    const revLine = $("#revLine", svg);
    if (!prefersReduced && revLine.getTotalLength) {
      const len = revLine.getTotalLength();
      revLine.style.setProperty("--len", len);
    } else if (revLine) { revLine.style.animation = "none"; }

    lineState = { d, x, y };
    if (!$("#lineTip")) {
      const tip = document.createElement("div");
      tip.id = "lineTip"; tip.className = "chart-tip"; tip.hidden = true;
      $("#lineChart").appendChild(tip);
    }
  }

  function moveTip(evt) {
    if (!lineState) return;
    const host = $("#lineChart"), svg = $("svg", host);
    const rect = svg.getBoundingClientRect();
    if (!rect.width) return;   // chart not laid out (hidden/zero-size) — nothing to point at
    const px = (evt.touches ? evt.touches[0].clientX : evt.clientX) - rect.left;
    const fx = clamp(px / rect.width, 0, 1) * LC.w;       // back to viewBox coords
    const { d, x, y } = lineState;
    const i = clamp(Math.round((fx - LC.padL) / ((LC.w - LC.padL - LC.padR) / (d.labels.length - 1))), 0, d.labels.length - 1);
    const cx = x(i), cy = y(d.revenue[i]);
    $("#cross", svg).setAttribute("x1", cx); $("#cross", svg).setAttribute("x2", cx); $("#cross", svg).setAttribute("opacity", ".5");
    const hot = $("#hot", svg); hot.setAttribute("cx", cx); hot.setAttribute("cy", cy); hot.setAttribute("opacity", "1");
    const tip = $("#lineTip");
    tip.hidden = false;
    tip.innerHTML = `<strong>${d.labels[i]}</strong>${money(d.revenue[i])}<span class="chart-tip__prev">prev ${money(d.prev[i])}</span>`;
    const left = clamp((cx / LC.w) * host.clientWidth, 60, host.clientWidth - 60);
    tip.style.left = left + "px";
    tip.style.top = ((cy / LC.h) * host.clientHeight - 14) + "px";
  }
  function hideTip() {
    const svg = $("#lineChart svg"); if (!svg) return;
    $("#cross", svg) && $("#cross", svg).setAttribute("opacity", "0");
    $("#hot", svg) && $("#hot", svg).setAttribute("opacity", "0");
    if ($("#lineTip")) $("#lineTip").hidden = true;
  }

  /* ---------- Donut ---------- */
  function renderDonut(d) {
    const total=d.donut.reduce((a,b)=>a+b,0), r=52, c=2*Math.PI*r, cx=70, cy=70;
    let off=0;
    const segs=d.donut.map((v,i)=>{
      const len=(v/total)*c;
      const s=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${CHANNELS[i].color}" stroke-width="20"
        stroke-dasharray="${len.toFixed(2)} ${(c-len).toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}"
        transform="rotate(-90 ${cx} ${cy})"><title>${CHANNELS[i].name}: ${v}%</title></circle>`;
      off+=len; return s;
    }).join("");
    $("#donutChart").innerHTML=`<svg viewBox="0 0 140 140">${segs}
      <text x="70" y="66" text-anchor="middle" style="font:600 22px var(--font-display);fill:var(--text)">${d.kpis.orders.toLocaleString()}</text>
      <text x="70" y="86" text-anchor="middle" style="font:500 11px var(--font-body);fill:var(--muted)">orders</text></svg>`;
    $("#donutLegend").innerHTML=CHANNELS.map((ch,i)=>`<li>
      <span class="dotc" style="background:${ch.color}"></span>
      <span class="nm">${ch.name}</span><span class="pc">${d.donut[i]}%</span></li>`).join("");
  }

  /* ---------- Bars ---------- */
  function renderBars(d) {
    const w=320, h=210, padB=26, padT=8, gap=18, n=d.bars.length;
    const bw=(w-gap*(n-1))/n, max=Math.max(...d.bars)*1.1;
    const bars=d.bars.map((v,i)=>{
      const bh=(v/max)*(h-padB-padT), x=i*(bw+gap), yy=h-padB-bh;
      return `<g>
        <rect x="${x.toFixed(1)}" y="${yy.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="6" fill="url(#bg)"><title>${CATEGORIES[i]}: ${v}</title></rect>
        <text x="${(x+bw/2).toFixed(1)}" y="${(yy-7).toFixed(1)}" text-anchor="middle" style="font:600 11px var(--font-body);fill:var(--text)">${v}</text>
        <text x="${(x+bw/2).toFixed(1)}" y="${h-9}" text-anchor="middle" style="font:500 10.5px var(--font-body);fill:var(--muted)">${CATEGORIES[i]}</text>
      </g>`;
    }).join("");
    $("#barChart").innerHTML=`<svg viewBox="0 0 ${w} ${h}">
      <defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#0a66c2"/><stop offset="1" stop-color="#3f93c9"/></linearGradient></defs>
      ${bars}</svg>`;
  }

  /* ---------- Orders table ---------- */
  let sortKey="id", sortDir=-1, query="";
  function visibleRows() {
    let rows=ORDERS.filter(o=>{
      if(!query) return true;
      const q=query.toLowerCase();
      return o.id.toLowerCase().includes(q)||o.customer.toLowerCase().includes(q)||
             o.channel.toLowerCase().includes(q)||o.status.toLowerCase().includes(q);
    });
    return rows.sort((a,b)=>{
      let A=a[sortKey], B=b[sortKey];
      if(typeof A==="string"){A=A.toLowerCase();B=B.toLowerCase();}
      return A<B?-1*sortDir:A>B?1*sortDir:0;
    });
  }
  function renderTable() {
    const rows=visibleRows();
    const cls={Paid:"paid",Pending:"pending",Refunded:"refunded"};
    $("#ordersBody").innerHTML=rows.map(o=>`<tr>
      <td class="tnum">${o.id}</td>
      <td><div class="cust"><span class="avatar" style="background:${colorFor(o.customer)}">${initials(o.customer)}</span>${o.customer}</div></td>
      <td>${o.channel}</td>
      <td><span class="pill pill--${cls[o.status]}">${o.status}</span></td>
      <td class="num tnum">$${o.total.toFixed(2)}</td>
    </tr>`).join("");
    $("#tableEmpty").hidden = rows.length>0;
    $("#tableSub").textContent = `${rows.length} of ${ORDERS.length} transactions`;
    $$("#ordersTable th").forEach(th=>{
      th.classList.remove("sort-asc","sort-desc");
      if(th.dataset.key===sortKey) th.classList.add(sortDir===1?"sort-asc":"sort-desc");
    });
  }
  const esc = s => `"${String(s).replace(/"/g,'""')}"`;
  function toCSV(head, rows) { return [head.map(esc).join(","), ...rows.map(r=>r.map(esc).join(","))].join("\r\n"); }
  function download(csv, name) {
    const url=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
    const a=document.createElement("a");
    a.href=url; a.download=name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url), 1000);
  }
  function exportCSV() {
    const rows=visibleRows().map(o=>[o.id,o.customer,o.channel,o.status,o.total.toFixed(2)]);
    download(toCSV(["Order","Customer","Channel","Status","Total"], rows), `pulse-orders-${currentRange}.csv`);
  }
  function exportReport(kind) {
    const d=DATA[currentRange];
    if (kind==="orders") return exportCSV();
    if (kind==="revenue")
      return download(toCSV(["Period","Revenue","Previous"], d.labels.map((l,i)=>[l,d.revenue[i],d.prev[i]])), `pulse-revenue-${currentRange}.csv`);
    if (kind==="channel")
      return download(toCSV(["Channel","Share %"], CHANNELS.map((c,i)=>[c.name,d.donut[i]])), `pulse-channels-${currentRange}.csv`);
    if (kind==="category")
      return download(toCSV(["Category","Units"], CATEGORIES.map((c,i)=>[c,d.bars[i]])), `pulse-categories-${currentRange}.csv`);
  }

  /* ---------- Top customers (aggregated from orders) ---------- */
  function renderCustomers() {
    const by={};
    ORDERS.forEach(o=>{
      const c=by[o.customer] || (by[o.customer]={customer:o.customer, orders:0, total:0, channels:{}});
      c.orders++; c.total+=o.total; c.channels[o.channel]=(c.channels[o.channel]||0)+1;
    });
    const rows=Object.values(by).sort((a,b)=>b.total-a.total);
    $("#customersBody").innerHTML=rows.map(c=>{
      const main=Object.entries(c.channels).sort((a,b)=>b[1]-a[1])[0][0];
      return `<tr>
        <td><div class="cust"><span class="avatar" style="background:${colorFor(c.customer)}">${initials(c.customer)}</span>${c.customer}</div></td>
        <td>${main}</td>
        <td class="num tnum">${c.orders}</td>
        <td class="num tnum">$${c.total.toFixed(2)}</td>
      </tr>`;
    }).join("");
    $("#custSub").textContent=`${rows.length} customers · ranked by total spend`;
  }

  /* ---------- Render everything ---------- */
  function render(range) {
    const d=DATA[range];
    renderKPIs(d); renderLine(d); renderDonut(d); renderBars(d); renderTable(); renderCustomers();
    const rr=$("#reportRange"); if (rr) rr.textContent=d.sub;
  }

  /* ---------- View router ---------- */
  const VIEWS = {
    overview:  { title:"Overview",  sub:"Welcome back — here's how the store is performing.", cards:["kpis","card-revenue","card-channel","card-category","card-orders"], range:true },
    revenue:   { title:"Revenue",   sub:"Revenue performance and trends over time.",          cards:["kpis","card-revenue","card-category"], range:true },
    orders:    { title:"Orders",    sub:"Every transaction — search, sort and export.",        cards:["kpis","card-channel","card-orders"], range:true },
    customers: { title:"Customers", sub:"Who's buying, and how much they spend.",               cards:["kpis","card-customers"], range:true },
    reports:   { title:"Reports",   sub:"Download snapshots of your data.",                     cards:["card-reports"], range:true },
    settings:  { title:"Settings",  sub:"Preferences for this workspace.",                      cards:["card-settings"], range:false },
  };
  const ALL_CARDS = ["kpis","card-revenue","card-channel","card-category","card-orders","card-customers","card-reports","card-settings"];
  let currentView = "overview";

  function setView(view) {
    const v = VIEWS[view]; if (!v) return;
    currentView = view;
    $("#viewTitle").textContent = v.title;
    $("#viewSub").textContent = v.sub;
    ALL_CARDS.forEach(id => { const el=$("#"+id); if (el) el.hidden = !v.cards.includes(id); });
    $$(".side-nav__item").forEach(a => a.classList.toggle("is-active", a.dataset.view === view));
    $("#rangeSeg").style.visibility = v.range ? "visible" : "hidden";
    document.body.classList.remove("nav-open");
    // line chart needs a re-measure when it becomes visible again
    if (v.cards.includes("card-revenue")) renderLine(DATA[currentRange]);
  }

  /* ---------- "Last updated" + subtle live drift ---------- */
  let lastUpdate = 0, secs = 0;
  function tickClock() {
    secs += 1;
    const el = $("#lastUpdated"); if (!el) return;
    el.textContent = secs < 5 ? "updated just now" : `updated ${secs}s ago`;
  }
  function liveDrift() {
    // nudge revenue & orders up a touch so the board feels live, then re-animate
    const d = DATA[currentRange];
    const bumpRev = Math.round(d.kpis.revenue * 0.0008 * (1 + Math.random()));
    const bumpOrd = Math.random() < 0.6 ? 1 : 0;
    d.kpis.revenue += bumpRev; d.kpis.orders += bumpOrd;
    animateNumber($('.kpi__value[data-key="revenue"]'), "revenue", d.kpis.revenue, money);
    if (bumpOrd) animateNumber($('.kpi__value[data-key="orders"]'), "orders", d.kpis.orders, n=>Math.round(n).toLocaleString());
    secs = 0; tickClock();
  }

  /* ---------- Theme ---------- */
  const THEME_KEY = "avian-theme";   /* shared across all Avian pages so the theme follows the visitor */
  function applyTheme(t) {
    document.body.dataset.theme = t;
    $("#themeBtn").textContent = t === "dark" ? "☀️" : "🌙";
  }
  function syncThemeButtons(opt) {
    const seg = $("#setTheme"); if (!seg) return;
    $$("button", seg).forEach(b => b.classList.toggle("is-on", b.dataset.themeOpt === opt));
  }
  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    const isSystem = !saved;
    if (!saved) saved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    applyTheme(saved);
    syncThemeButtons(isSystem ? "system" : saved);
  }

  /* ---------- Wire up ---------- */
  function init() {
    initTheme();
    render(currentRange);
    setView("overview");

    $("#rangeSeg").addEventListener("click", e=>{
      const btn=e.target.closest(".seg__btn"); if(!btn) return;
      $$(".seg__btn").forEach(b=>b.classList.remove("is-active"));
      btn.classList.add("is-active");
      currentRange=btn.dataset.range;
      render(currentRange);
    });

    $("#search").addEventListener("input", e=>{ query=e.target.value.trim(); renderTable(); });
    $("#exportBtn").addEventListener("click", exportCSV);

    // sidebar view switching
    $$(".side-nav__item").forEach(a => a.addEventListener("click", e=>{
      e.preventDefault();
      setView(a.dataset.view);
    }));

    // reports
    $("#reportList").addEventListener("click", e=>{
      const btn=e.target.closest("[data-report]"); if(!btn) return;
      exportReport(btn.dataset.report);
    });

    // settings — appearance
    $("#setTheme").addEventListener("click", e=>{
      const btn=e.target.closest("[data-theme-opt]"); if(!btn) return;
      const opt=btn.dataset.themeOpt;
      const resolved = opt==="system"
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : opt;
      applyTheme(resolved);
      try { opt==="system" ? localStorage.removeItem(THEME_KEY) : localStorage.setItem(THEME_KEY, resolved); } catch(e){}
      syncThemeButtons(opt);
    });
    // settings — table density
    $("#setDensity").addEventListener("click", e=>{
      const btn=e.target.closest("[data-density]"); if(!btn) return;
      document.body.classList.toggle("dense", btn.dataset.density==="compact");
      $$("#setDensity button").forEach(b=>b.classList.toggle("is-on", b===btn));
    });
    // settings — email toggle (cosmetic)
    $("#setEmail").addEventListener("click", e=>{
      const on = e.currentTarget.getAttribute("aria-checked")==="true";
      e.currentTarget.setAttribute("aria-checked", String(!on));
    });

    $$("#ordersTable th").forEach(th=>th.addEventListener("click", ()=>{
      const k=th.dataset.key;
      if(sortKey===k) sortDir*=-1; else { sortKey=k; sortDir=1; }
      renderTable();
    }));

    $("#themeBtn").addEventListener("click", ()=>{
      const next = document.body.dataset.theme==="dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      syncThemeButtons(next);
    });

    // line chart hover
    const host = $("#lineChart");
    host.addEventListener("pointermove", moveTip);
    host.addEventListener("pointerleave", hideTip);

    const closeNav=()=>document.body.classList.remove("nav-open");
    $("#menuBtn").addEventListener("click", ()=>document.body.classList.toggle("nav-open"));
    $("#scrim").addEventListener("click", closeNav);

    setInterval(tickClock, 1000);
    setInterval(liveDrift, 6000);
  }

  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
