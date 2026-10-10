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
  function pour() {
    let n = (+store.get('br-cups') || 0) + 1; store.set('br-cups', String(n));
    document.querySelectorAll('.refill').forEach(x => x.remove());
    const el = document.createElement('div'); el.className = 'refill'; el.setAttribute('role', 'status');
    el.innerHTML = `<span class="cup" aria-hidden="true">☕<i></i><i></i><i></i></span><span class="label">Refilled. ${n === 1 ? 'Your first cup here.' : `Cup number ${n}.`}</span>`;
    document.body.appendChild(el); BR.blip('tone', true);
    setTimeout(() => el.classList.add('out'), 2200); setTimeout(() => el.remove(), 2900);
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
  const start = () => { focusWatch(); offhoursSpot(); tabTitle(); coffee(); hello(); };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', start) : start();
})();
