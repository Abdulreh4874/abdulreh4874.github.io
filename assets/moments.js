/* Moments: things that switch on by themselves, by Colombo date and time.
   Preview any of them with a hash, e.g. index.html#moment-meteors
   ids: snow, meteors, poya, vesak, avurudu, newyear, nye, coffee, latenight, spaceweek, xtreme, wso2, birthday */
(function () {
  const BR = window.BR; if (!BR) return;
  const CONFIG = {
    birthday: '11-02',         // 2 November. 'MM-DD', or null to switch off.
    lat: 6.7951, lon: 79.9008, // Moratuwa
  };
  const root = document.documentElement;
  const reduce = BR.reduce;
  const preview = (location.hash.match(/^#moment-([a-z]+)$/) || [])[1] || null;

  /* ---------- time in Colombo ---------- */
  function colombo(d = new Date()) {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Colombo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(d).map(x => [x.type, x.value]));
    return { y: +p.year, m: +p.month, d: +p.day, h: +p.hour, min: +p.minute, key: `${p.year}-${p.month}-${p.day}` };
  }
  const C = colombo();
  const md = C.m * 100 + C.d; // e.g. 1021 for 21 Oct
  const inRange = (a, b) => a <= b ? md >= a && md <= b : md >= a || md <= b;

  /* ---------- sky maths ---------- */
  function sunAlt(date = new Date()) {
    const start = Date.UTC(date.getUTCFullYear(), 0, 0), n = Math.floor((date - start) / 864e5);
    const B = 2 * Math.PI * (n - 81) / 364, eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
    const dec = 23.44 * Math.sin(2 * Math.PI * (284 + n) / 365) * Math.PI / 180;
    const utcMin = date.getUTCHours() * 60 + date.getUTCMinutes();
    const H = ((utcMin + 4 * CONFIG.lon + eot) / 4 - 180) * Math.PI / 180, phi = CONFIG.lat * Math.PI / 180;
    return Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H)) * 180 / Math.PI;
  }
  function moonIllum(ms) {
    const syn = 29.530588853, age = (((ms / 864e5 - Date.UTC(2000, 0, 6, 18, 14) / 864e5) % syn) + syn) % syn;
    return (1 - Math.cos(2 * Math.PI * age / syn)) / 2;
  }
  const colomboNoon = Date.UTC(C.y, C.m - 1, C.d, 6, 30); // 12:00 in Colombo
  const isPoya = moonIllum(colomboNoon) > 0.985;
  const night = sunAlt() < -6;

  /* ---------- auto theme: follow the real sunset in Colombo (unless the visitor chose a theme) ---------- */
  let chosen = null; try { chosen = localStorage.getItem('br-theme'); } catch (e) {}
  if (!chosen && !root.dataset.mode) {
    let iv = 0;
    const apply = () => {
      let c = null; try { c = localStorage.getItem('br-theme'); } catch (e) {}
      if (c) { clearInterval(iv); delete root.dataset.auto; return; } // visitor chose; stop following the sun
      const t = sunAlt() < -2 ? 'dark' : 'light';
      if (root.dataset.theme !== t) { root.dataset.theme = t; window.dispatchEvent(new Event('br-theme')); }
    };
    apply(); iv = setInterval(apply, 60000);
    root.dataset.auto = 'sun';
  }

  /* ---------- meteor showers (IMO calendar, approximate) ---------- */
  const SHOWERS = [
    { id: 'Quadrantids', from: 1228, to: 112, peak: 103, look: 'north-east, before dawn' },
    { id: 'Lyrids', from: 416, to: 425, peak: 422, look: 'north-east, after midnight' },
    { id: 'Eta Aquariids', from: 419, to: 528, peak: 506, look: 'east, in the hour before dawn' },
    { id: 'Perseids', from: 717, to: 824, peak: 812, look: 'north-east, after midnight' },
    { id: 'Orionids', from: 1002, to: 1107, peak: 1021, look: 'east, after midnight' },
    { id: 'Leonids', from: 1106, to: 1130, peak: 1117, look: 'east, after midnight' },
    { id: 'Geminids', from: 1204, to: 1220, peak: 1214, look: 'north-east, from about 10 pm' },
  ];
  const shower = SHOWERS.find(s => inRange(s.from, s.to));
  const fmtPeak = v => new Date(2026, Math.floor(v / 100) - 1, v % 100).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  /* ---------- which moments are on ---------- */
  const on = new Set();
  if (inRange(1201, 105)) on.add('snow');
  if (shower) on.add('meteors');
  if (isPoya) on.add(C.m === 5 ? 'vesak' : 'poya');
  if (md === 413 || md === 414) on.add('avurudu');
  if (md === 1231) on.add('nye');
  if (md === 101) on.add('newyear');
  if (C.h >= 7 && C.h < 10) on.add('coffee');
  if (C.h >= 0 && C.h < 5) on.add('latenight');
  if (inRange(1004, 1010)) on.add('spaceweek');
  if (md === 1026) on.add('xtreme');
  if (md === 615 && C.y > 2026) on.add('wso2');
  if (CONFIG.birthday && CONFIG.birthday === `${String(C.m).padStart(2, '0')}-${String(C.d).padStart(2, '0')}`) on.add('birthday');
  if (preview) on.add(preview);
  BR.moments = on;

  /* ---------- shared pieces ---------- */
  const css = document.createElement('style');
  css.textContent = `
  .m-layer { position: fixed; inset: 0; z-index: 45; pointer-events: none; }
  .m-toast { position: fixed; z-index: 70; left: 16px; bottom: calc(env(safe-area-inset-bottom, 0px) + 16px); max-width: min(420px, calc(100% - 32px));
    display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 12px; align-items: start; padding: 14px 10px 14px 16px; border-radius: 18px;
    background: color-mix(in srgb, var(--bg) 78%, transparent); color: var(--ink); border: 1px solid var(--line);
    backdrop-filter: blur(18px) saturate(160%); -webkit-backdrop-filter: blur(18px) saturate(160%); box-shadow: 0 20px 50px -20px rgba(0,0,0,.45);
    transform: translateY(140%); transition: transform var(--beat) var(--ease-out); font-size: .92rem; line-height: 1.45; }
  .m-toast.in { transform: none; }
  .m-toast .k { font-family: var(--f-mono); font-size: .66rem; letter-spacing: .08em; text-transform: uppercase; color: var(--accent); display: block; margin-bottom: 2px; }
  .m-toast .ic { width: 10px; height: 10px; border-radius: 50%; background: var(--accent); margin-top: 6px; box-shadow: 0 0 12px var(--accent); }
  .m-toast button { border: 0; background: none; color: var(--ink-3); cursor: pointer; width: 32px; height: 32px; border-radius: 50%; }
  .m-toast button:hover { color: var(--ink); background: var(--line); }
  .steam { position: relative; }
  .steam::before, .steam::after { content: ""; position: absolute; left: 50%; bottom: 7px; width: 2px; height: 12px; border-radius: 2px; background: var(--ink-3); opacity: 0;
    animation: steam 2.5s ease-out infinite; }
  .steam::after { animation-delay: 1.25s; margin-left: 3px; }
  @keyframes steam { 0% { opacity: 0; transform: translateY(2px) scaleY(.4); } 30% { opacity: .7; } 100% { opacity: 0; transform: translate(3px, -12px) scaleY(1); } }
  .m-moonglow { position: fixed; z-index: 0; right: -18vmax; top: -18vmax; width: 50vmax; height: 50vmax; border-radius: 50%; pointer-events: none;
    background: radial-gradient(circle, color-mix(in srgb, var(--ink) 16%, transparent) 0%, transparent 62%); }
  .lanterns { position: fixed; z-index: 44; top: 0; right: 4vw; display: flex; gap: clamp(14px, 3vw, 36px); pointer-events: none; }
  .lantern { transform-origin: 50% 0; animation: sway 4.8s ease-in-out infinite alternate; }
  .lantern:nth-child(2) { animation-duration: 5.6s; animation-delay: -1s; } .lantern:nth-child(3) { animation-duration: 4.2s; animation-delay: -2s; }
  @keyframes sway { from { transform: rotate(-4deg); } to { transform: rotate(4deg); } }
  @media (max-width: 700px) { .lanterns { right: 2vw; transform: scale(.7); transform-origin: top right; } }
  @media (prefers-reduced-motion: reduce) { .lantern, .steam::before, .steam::after { animation: none; } .m-toast { transition: none; } }
  body { transition: background-color 1.2s ease, color 1.2s ease; }`;
  document.head.appendChild(css);

  let layer = null, lc = null, LW = 0, LH = 0;
  function canvasLayer() {
    if (layer) return lc;
    layer = document.createElement('canvas'); layer.className = 'm-layer'; layer.setAttribute('aria-hidden', 'true'); document.body.appendChild(layer);
    lc = layer.getContext('2d');
    const size = () => { const d = Math.min(2, devicePixelRatio || 1); LW = innerWidth; LH = innerHeight; layer.width = LW * d; layer.height = LH * d; lc.setTransform(d, 0, 0, d, 0, 0); };
    size(); addEventListener('resize', size);
    return lc;
  }
  const ink = () => getComputedStyle(root).getPropertyValue('--ink').trim();
  const acc = () => getComputedStyle(root).getPropertyValue('--accent').trim();

  const queue = [];
  function toast(id, kicker, html) {
    const k = `br-m-${id}-${C.key}`;
    if (!preview) { try { if (localStorage.getItem(k)) return; } catch (e) {} }
    (id === preview ? queue.unshift : queue.push).call(queue, { k, kicker, html });
  }
  function flush() {
    const t = queue.shift(); if (!t) return;
    const el = document.createElement('div'); el.className = 'm-toast'; el.setAttribute('role', 'status');
    el.innerHTML = `<span class="ic" aria-hidden="true"></span><div><span class="k">${t.kicker}</span>${t.html}</div><button type="button" aria-label="Dismiss">✕</button>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')));
    const close = () => { el.classList.remove('in'); try { localStorage.setItem(t.k, '1'); } catch (e) {} setTimeout(() => { el.remove(); flush(); }, 700); };
    el.querySelector('button').addEventListener('click', close);
    setTimeout(close, 12000);
  }

  /* ---------- particles: snow (as falling stars), meteors, bursts ---------- */
  const parts = []; let raf = 0;
  function loop() {
    const c = lc; c.clearRect(0, 0, LW, LH);
    const I = ink(), A = acc();
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]; p.t++;
      if (p.kind === 'snow') {
        p.y += p.vy; p.x += Math.sin((p.t + p.ph) / 60) * 0.35;
        if (p.y > LH + 6) { p.y = -6; p.x = Math.random() * LW; }
        c.globalAlpha = p.a; c.fillStyle = I; c.beginPath(); c.arc(p.x, p.y, p.r, 0, 6.283); c.fill();
      } else if (p.kind === 'meteor') {
        p.x += p.vx; p.y += p.vy; const life = 1 - p.t / p.life;
        if (life <= 0) { parts.splice(i, 1); continue; }
        const g = c.createLinearGradient(p.x, p.y, p.x - p.vx * 14, p.y - p.vy * 14);
        g.addColorStop(0, `rgba(255,255,255,${0.9 * life})`); g.addColorStop(1, 'rgba(255,255,255,0)');
        c.globalAlpha = 1; c.strokeStyle = root.dataset.theme === 'light' ? `rgba(11,14,19,${0.5 * life})` : g; c.lineWidth = 1.6;
        c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x - p.vx * 14, p.y - p.vy * 14); c.stroke();
      } else if (p.kind === 'burst') {
        p.x += p.vx; p.y += p.vy; p.vy += 0.03; p.vx *= 0.985; p.vy *= 0.985; const life = 1 - p.t / p.life;
        if (life <= 0) { parts.splice(i, 1); continue; }
        c.globalAlpha = life; c.fillStyle = p.red ? A : I; c.beginPath(); c.arc(p.x, p.y, p.r, 0, 6.283); c.fill();
      }
    }
    c.globalAlpha = 1;
    raf = parts.length ? requestAnimationFrame(loop) : 0;
  }
  const kick = () => { if (!raf && !document.hidden) raf = requestAnimationFrame(loop); };
  function snow() {
    canvasLayer(); const n = Math.round(Math.min(90, innerWidth / 16));
    for (let i = 0; i < n; i++) parts.push({ kind: 'snow', x: Math.random() * innerWidth, y: Math.random() * innerHeight, vy: 0.25 + Math.random() * 0.6, r: 0.6 + Math.random() * 1.6, a: 0.25 + Math.random() * 0.45, ph: Math.random() * 400, t: 0 });
    kick();
  }
  function meteor() {
    canvasLayer(); const fromLeft = Math.random() < 0.5, sp = 9 + Math.random() * 6, ang = (25 + Math.random() * 20) * Math.PI / 180;
    parts.push({ kind: 'meteor', x: fromLeft ? Math.random() * innerWidth * 0.5 : innerWidth * (0.5 + Math.random() * 0.5), y: Math.random() * innerHeight * 0.35,
      vx: (fromLeft ? 1 : -1) * sp * Math.cos(ang), vy: sp * Math.sin(ang), t: 0, life: 38 + Math.random() * 20 });
    kick();
  }
  function burst(x = innerWidth / 2, y = innerHeight / 3, n = 90) {
    canvasLayer();
    for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, s = 1.5 + Math.random() * 4.5; parts.push({ kind: 'burst', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, r: 1 + Math.random() * 2, red: Math.random() < 0.25, t: 0, life: 70 + Math.random() * 50 }); }
    kick();
  }
  BR.burst = burst;
  document.addEventListener('visibilitychange', () => { if (!document.hidden && parts.length) kick(); });

  function start() {
    const still = reduce();
    if (on.has('snow')) { if (!still) snow(); toast('snow', 'December', 'Falling stars until the new year. My old site had snow. This is the upgrade.'); }
    if (on.has('meteors')) {
      const s = shower || SHOWERS[4];
      const near = Math.abs(md - s.peak) <= 2;
      toast('meteors', `${s.id} meteor shower`, `Active now, peak on ${fmtPeak(s.peak)}. From Sri Lanka, look ${s.look}.${night || preview ? ' Watch this page for a while.' : ' Come back after dark.'}`);
      if ((night || preview) && !still) {
        const next = () => setTimeout(() => { meteor(); next(); }, (near ? 2500 : 6000) + Math.random() * (near ? 4000 : 9000));
        setTimeout(meteor, 1500); next();
      }
    }
    if (on.has('poya') || on.has('vesak')) {
      const g = document.createElement('div'); g.className = 'm-moonglow'; g.setAttribute('aria-hidden', 'true'); document.body.prepend(g);
    }
    if (on.has('poya')) toast('poya', 'Poya', 'Full moon over Sri Lanka today. A good night to look up.');
    if (on.has('vesak')) {
      const L = document.createElement('div'); L.className = 'lanterns'; L.setAttribute('aria-hidden', 'true');
      const lantern = (len, s) => `<svg class="lantern" width="${46 * s}" height="${(len + 92) * s}" viewBox="0 0 46 ${len + 92}"><line x1="23" y1="0" x2="23" y2="${len}" stroke="var(--ink-3)" stroke-width="1"/>
        <g transform="translate(0 ${len})" fill="none" stroke="var(--accent)" stroke-width="1.4"><path d="M23 2 L42 22 L42 50 L23 70 L4 50 L4 22 Z" fill="color-mix(in srgb, var(--accent) 14%, transparent)"/><path d="M4 22 H42 M4 50 H42 M23 2 V70"/>
        <path d="M14 70 L12 90 M23 70 V92 M32 70 L34 90" stroke="var(--ink-3)"/></g></svg>`;
      L.innerHTML = lantern(40, 1) + lantern(90, 0.85) + lantern(20, 0.75);
      document.body.appendChild(L);
      toast('vesak', 'Vesak', 'Suba Vesak. Lanterns are up in my sky tonight.');
    }
    if (on.has('avurudu')) toast('avurudu', 'Aluth Avurudu', 'Suba Aluth Avurudu. Happy Sinhala and Tamil New Year. The drum machine on Off-hours has a raban rhythm today.');
    if (on.has('nye')) {
      BR.clockSuffix = () => { const now = new Date(), t = Date.UTC(C.y + 1, 0, 1, -5, -30) - now; if (t <= 0) return ''; const h = Math.floor(t / 36e5), m = Math.floor(t / 6e4) % 60; return ` · ${C.y + 1} in ${h}h ${m}m`; };
      toast('nye', 'Countdown', `${C.y + 1} is almost here. The clock up top is counting down.`);
    }
    if (on.has('newyear')) { if (!still) setTimeout(() => burst(), 900); toast('newyear', 'Happy New Year', 'A new orbit begins. Thanks for stopping by.'); }
    if (on.has('birthday')) { if (!still) setTimeout(() => burst(innerWidth / 2, innerHeight / 3, 140), 900); toast('birthday', 'Today', 'It’s my birthday. One more trip around the Sun.'); }
    if (on.has('coffee')) { document.querySelectorAll('.brand .star').forEach(s => s.classList.add('steam')); BR.clockSuffix = BR.clockSuffix || ' · brewing ☕'; }
    if (on.has('latenight')) BR.clockSuffix = BR.clockSuffix || ' · probably stargazing';
    if (on.has('spaceweek')) toast('spaceweek', 'World Space Week', 'It runs 4 to 10 October. Fitting, for a site that turns into a night sky.');
    if (on.has('xtreme')) toast('xtreme', 'On this day, 2024', 'IEEEXtreme 18.0: #418 in the world, #22 in Sri Lanka, in 24 hours straight.');
    if (on.has('wso2')) toast('wso2', 'On this day, 2026', 'I started at WSO2 on the OpenChoreo team.');
    setTimeout(flush, 1600);
    window.dispatchEvent(new CustomEvent('br-moments', { detail: [...on] }));
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', start) : start();
})();
