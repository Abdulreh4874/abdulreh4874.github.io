/* Extras: the study playlist (focus-triggered), tab-away titles, the "coffee" refill, and a console hello. */
(function () {
  const BR = window.BR; if (!BR) return;
  const store = BR.store;
  const PL = {
    id: '3ZJYO4jvwt2nrtc5BlEziB',
    title: 'Study 💻',
    url: 'https://open.spotify.com/playlist/3ZJYO4jvwt2nrtc5BlEziB',
    cover: 'https://mosaic.scdn.co/300/ab67616d00001e022aabcf79e0240e36f95877b5ab67616d00001e023df8ebdc06d3318abf5c5a46ab67616d00001e0274eeaf65012abab69a69eec2ab67616d00001e02fb97e773be6149c9c935880c',
  };
  const embed = h => `<iframe title="Spotify playlist: Study" src="https://open.spotify.com/embed/playlist/${PL.id}?utm_source=generator&theme=0" width="100%" height="${h}" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" style="border-radius:12px;display:block"></iframe>`;
  const record = (size = 64) => `<span class="rec" style="--s:${size}px" aria-hidden="true"><img src="${PL.cover}" alt="" width="${size}" height="${size}" loading="lazy"></span>`;
  const onOffhours = /offhours/.test(location.pathname);

  /* ---------- 1. focus-triggered playlist card ---------- */
  function focusWatch() {
    if (onOffhours) return;
    let snooze = 0; try { snooze = +store.get('br-vinyl-snooze') || 0; } catch (e) {}
    let shown = null; try { shown = sessionStorage.getItem('br-vinyl'); } catch (e) {}
    if (shown || Date.now() < snooze) return;
    const goal = 35000 + Math.random() * 25000;
    let active = 0, lastAct = performance.now(), lastFast = 0, lastY = scrollY, lastT = performance.now();
    const act = () => { lastAct = performance.now(); };
    ['pointermove', 'keydown', 'touchstart'].forEach(t => addEventListener(t, act, { passive: true }));
    addEventListener('scroll', () => {
      const now = performance.now(), v = Math.abs(scrollY - lastY) / Math.max(1, now - lastT) * 1000;
      if (v > 2600) lastFast = now; lastY = scrollY; lastT = now; act();
    }, { passive: true });
    const iv = setInterval(() => {
      const now = performance.now();
      const reading = !document.hidden && now - lastAct < 15000 && now - lastFast > 5000;
      if (reading) active += 1000;
      const busy = document.querySelector('.m-toast, .intro, .wa.live') || document.body.classList.contains('menu-open');
      if (active >= goal && !busy) { clearInterval(iv); show(Math.round(active / 1000)); }
    }, 1000);
  }
  function show(secs) {
    try { sessionStorage.setItem('br-vinyl', '1'); } catch (e) {}
    const el = document.createElement('section'); el.className = 'vinyl'; el.setAttribute('aria-label', 'Study playlist');
    el.innerHTML = `${record(64)}
      <div class="v-txt"><span class="k">Deep focus detected</span>
        <p>You've read for ${secs} s without skimming. This is what I study to: <b>${PL.title}</b>.</p>
        <div class="v-btns"><button class="btn" type="button" data-play>Play here</button><a class="btn ghost" href="${PL.url}" target="_blank" rel="noopener">Open in Spotify ↗</a></div>
      </div>
      <button class="v-x" type="button" aria-label="Close">✕</button>
      <div class="v-embed"></div>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')));
    BR.blip('tick');
    let played = false;
    el.querySelector('[data-play]').addEventListener('click', e => {
      played = true; el.classList.add('playing'); el.querySelector('.v-embed').innerHTML = embed(152); e.currentTarget.remove();
    });
    el.querySelector('.v-x').addEventListener('click', () => {
      if (!played) store.set('br-vinyl-snooze', String(Date.now() + 7 * 864e5)); // closed without playing: ask again in a week
      el.classList.remove('in'); setTimeout(() => el.remove(), 600);
    });
  }

  /* ---------- 2. permanent spot on Off-hours ---------- */
  function offhoursSpot() {
    const host = document.getElementById('studyMix'); if (!host) return;
    host.innerHTML = `<div class="mix">${record(84)}<div><span class="label">On repeat while I work</span><b class="mix-t">${PL.title}</b>
      <div class="v-btns"><button class="btn" type="button" data-play>Play here</button><a class="btn ghost" href="${PL.url}" target="_blank" rel="noopener">Open in Spotify ↗</a></div></div></div><div class="v-embed"></div>`;
    host.querySelector('[data-play]').addEventListener('click', e => {
      host.classList.add('playing'); host.querySelector('.v-embed').innerHTML = embed(352); e.currentTarget.remove();
    });
  }

  /* ---------- 3. tab-away title ---------- */
  function tabTitle() {
    const original = document.title;
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        const h = +new Intl.DateTimeFormat('en-GB', { hour: '2-digit', hourCycle: 'h23', timeZone: 'Asia/Colombo' }).format(new Date());
        document.title = h >= 19 || h < 5 ? '✦ The stars are still here' : '☕ Your coffee’s getting cold';
      } else document.title = original;
    });
  }

  /* ---------- 4. type "coffee" for a refill ---------- */
  // what the barista says, by cup number
  const CUPS = {
    1: 'Refilled. Your first cup here.',
    2: 'Cup 2. Now we’re talking.',
    3: 'Cup 3. My usual before standup.',
    4: 'Cup 4. Your code just compiled faster.',
    5: 'Cup 5. You can hear colours now.',
    6: 'Cup 6. Same as me in exam week at Ruhuna.',
    7: 'Cup 7. Heart rate: 96 BPM. In sync with the site.',
    8: 'Cup 8. The RoboEyes look worried about you.',
    9: 'Cup 9. AdaptiFocus says: take a break.',
    10: 'Cup 10. Achievement unlocked: Night Shift.',
    12: 'Cup 12. A dozen. Barista mode on.',
    13: 'Cup 13. Unlucky? Not at this caffeine level.',
    15: 'Cup 15. Sleep is now a deprecated feature.',
    20: 'Cup 20. Your heartbeat is in 4/4 time.',
    24: 'Cup 24. One for every hour of IEEEXtreme.',
    42: 'Cup 42. The answer to everything, apparently.',
    50: 'Cup 50. You are officially part of the circuit.',
    96: 'Cup 96. Locked to the beat. 96 BPM.',
    100: 'Cup 100. Okay, message me. Next one is on me.',
    256: 'Cup 256. 8-bit overflow. Counter wrapped to 0… just kidding.',
  };
  const MORE = [
    n => `Cup ${n}. Still not decaf.`,
    n => `Cup ${n}. git commit -m "more coffee"`,
    n => `Cup ${n}. Error 404: sleep not found.`,
    n => `Cup ${n}. Kubernetes autoscaled your mug.`,
    n => `Cup ${n}. Your blood type is now espresso.`,
    n => `Cup ${n}. Rolling out caffeine to 100% of traffic.`,
    n => `Cup ${n}. The Moon called. It wants its sleep back.`,
    n => `Cup ${n}. Ceylon tea is getting jealous.`,
  ];
  const MILESTONES = new Set([10, 24, 42, 50, 96, 100, 256]);
  function pour() {
    let n = (+store.get('br-cups') || 0) + 1; store.set('br-cups', String(n));
    document.querySelectorAll('.refill').forEach(x => x.remove());
    const msg = CUPS[n] || MORE[(n * 7) % MORE.length](n);
    const el = document.createElement('div'); el.className = 'refill' + (n >= 6 ? ' jitter' : '') + (n >= 10 ? ' strong' : ''); el.setAttribute('role', 'status');
    el.innerHTML = `<span class="cup" aria-hidden="true">☕<i></i><i></i><i></i></span><span class="label">${msg}</span>`;
    document.body.appendChild(el); BR.blip('tone', true);
    if (MILESTONES.has(n) && BR.burst && !BR.reduce()) { const r = el.querySelector('.cup').getBoundingClientRect(); BR.burst(r.left + r.width / 2, r.top + r.height / 2, 70); }
    const stay = 2200 + msg.length * 25;
    setTimeout(() => el.classList.add('out'), stay); setTimeout(() => el.remove(), stay + 700);
  }
  function coffee() {
    let buf = '';
    addEventListener('keydown', e => {
      const t = e.target; if ((t && t.closest && t.closest('input, textarea, [contenteditable]')) || e.metaKey || e.ctrlKey || e.key.length !== 1) return;
      buf = (buf + e.key.toLowerCase()).slice(-6);
      if (buf === 'coffee') { buf = ''; pour(); }
    });
    // the word "Coffee" in the home headline pours too (phones can't type it)
    document.querySelectorAll('.cof').forEach(w => {
      w.addEventListener('click', pour);
      w.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pour(); } });
    });
  }

  /* ---------- 5. hello, developer ---------- */
  function hello() {
    console.log('%c☕ Coffee runs through my circuits.', 'font: 600 16px system-ui; color: #FF4A3D');
    console.log('%cHand-built with plain HTML, CSS and JS. Source: https://github.com/PrageethBanuka/PrageethBanuka.github.io\nThere is more hidden here than code. Look closer.', 'font: 12px ui-monospace, monospace; color: #8A93A0');
  }

  BR.studyCard = show; // handy for testing: BR.studyCard(52)
  /* ---------- marker highlights: sweep in once, when seen ---------- */
  function highlights() {
    const marks = document.querySelectorAll('mark.hl'); if (!marks.length) return;
    if (BR.reduce() || !('IntersectionObserver' in window)) { marks.forEach(m => m.classList.add('on')); return; }
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return; io.unobserve(e.target);
      const go = () => setTimeout(() => e.target.classList.add('on'), 450);
      const wait = () => document.querySelector('.intro') ? setTimeout(wait, 200) : go(); // never behind the intro
      wait();
    }), { threshold: 1, rootMargin: '0px 0px -12% 0px' });
    marks.forEach(m => io.observe(m));
  }

  const start = () => { highlights(); focusWatch(); offhoursSpot(); tabTitle(); coffee(); hello(); };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', start) : start();
})();
