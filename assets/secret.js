/* A trail with three clues. The letter at the end is encrypted (PBKDF2 + AES-GCM).
   Reading this file does not reveal it: only the right answer decrypts it.
   To change the answer or the letter, open tools/seal.html locally and paste its output into SEALED below. */
(function () {
  const TRAIL = {
    clue1: 'Tune between design and experience. Hold it there.',
    clue2: 'Now find the star that never moves.',
    ask: 'This star has no name yet. What would you call it?',
    star: { alt: 54, az: 128 }, // where the uncatalogued star sits on the Off-hours sky
  };
  const SEALED = {"salt":"GLSwm8/L76YwmDmkuNb3JQ==","iv":"ghUjk7qpADuSwMWl","data":"Et3NFd+mXvgWDdK8xZqms1qaKhVop0sGN5bOD2N985ce45Mhcirwxp+Wt6cdk60dJqusu2EgSgXUS2r/T54Gai/43YObcHXMNwXoePw51FqknOa8yBLTHI7mkeeOX2lzPZvnd9FHeMbtN9WnIHgFePbyLCf8o8+B19rF0iUKVNKICbGVcSQJAwg/Qxcpr38emubZCilcllqCnPrSMcLxmkyN0N/cV02gXbTLZVE6XhTy43eSTFcsE+0Ut4axW/l8FnG8X+VlJE4zP/9RWuEZ5iHLKXaci5DNIbgqh5+PnOshTRB6fiwI63hFozJZ75Vv5ugVNuRnLMrlGyLO11bmjVG83sr/UwDuUTmNCM02znKrAfat8sej1VClg1wTVHFs1yBYmIM1Yx1ADuvUt4/qOvTaPvKR//DCWo0NWj/WEtcXYFnD/K4LIpVifcQbrm2/18aQ93d/YeNqNdGnr5D6kVKVURkpzKwPgn0I/u9SBzoVRVE3mIhXQwrTJPM4lOtE5jYppk1mvnrR4wyl4G5CxlD7nmWL3U2wIlGzWGBBNv3RGVxGepANb+swFKTxMABN7EwXg9Aft0upyoM/8Rn+XWaiOpj5GtEooN0YQ7MKm0VFkigA3bV1tErLqjghIGo02URUOPdh1WP+KAYD8N5qZ4zpGUe8PdxGRKSCm9x2zgcB/ibee5Ut7lFeiIlae1U+nlNZsZvqZRhpzc9aKFbEL7hGHVSMjv2Y8H91XAY7vIcOWrOlhKr2hdf54L+H3F2F2Qa1yGU1nlmF8odJbp5ZEm0v79ZqEIIGMPZXo9/dqBQjqeAuH4eoHbea1VXqOmw8c4sDSRdL5GsGde+Eps5mk0agU4yYDY2ofQVwvqFHUcQkgI8+xE1Pu6jD9BCbMif4Bi5W/D5y2Ht21Bh547BGNoUFGpMcUAaeqEqv1+hl5jSP2bJivMRw1OwSYvf/2B36r0KIAP7vr13p2/+DwHqEO2W0dw7Ir9BBP6Gv1oRsHDdh8KdazuwqdkIfRSpotS0D5x+m4W/STd7f/HOCO/DOsCxYUwd51LYFDMXZe7nAVCTdX0JYPxpTgl8MXnINmYcSrm0BjdekhDWoZxx8JzGoNfySVKnO7DOUJkOPAtVTIaEnXg+3WUeCxSV0UMHPr7gbp/lO6pRxyPB2Xk1hQJArm2h2CFxADWt5g+CFnWsx4ymSlGlyTyjMT0+qk1qY8w=="};

  const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  async function unseal(answer) {
    const pass = String(answer).trim().toLowerCase().normalize('NFKC');
    const enc = new TextEncoder();
    const base = await crypto.subtle.importKey('raw', enc.encode(pass), 'PBKDF2', false, ['deriveKey']);
    const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: b64(SEALED.salt), iterations: 250000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(SEALED.iv) }, key, b64(SEALED.data));
    return JSON.parse(new TextDecoder().decode(pt));
  }

  const css = document.createElement('style');
  css.textContent = `
  .clue { display: block; margin-top: 10px; font-family: var(--f-mono); font-size: .7rem; letter-spacing: .06em; color: var(--accent); opacity: 0; transform: translateY(4px); transition: opacity var(--beat) var(--ease-out), transform var(--beat) var(--ease-out); }
  .clue.in { opacity: 1; transform: none; }
  .name-star { position: absolute; z-index: 5; left: 50%; bottom: 12px; transform: translateX(-50%); width: min(340px, calc(100% - 24px)); display: grid; gap: 8px; padding: 14px; border-radius: 16px;
    background: color-mix(in srgb, var(--bg) 82%, transparent); border: 1px solid var(--line); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }
  .name-star p { margin: 0; font-size: .9rem; padding-right: 34px; }
  .name-star .close { position: absolute; top: 6px; right: 6px; width: 36px; height: 36px; border-radius: 50%; border: 0; background: none; color: var(--ink-3); font: inherit; cursor: pointer; padding: 0; }
  .name-star .close:hover { color: var(--ink); background: var(--line); }
  .name-star form { display: flex; gap: 6px; }
  .name-star input { flex: 1; min-width: 0; font: inherit; padding: 9px 12px; border-radius: 999px; border: 1px solid var(--line); background: transparent; color: var(--ink); }
  .name-star button { font: inherit; padding: 9px 14px; border-radius: 999px; border: 0; background: var(--accent); color: var(--bg); cursor: pointer; }
  .name-star .no { font-family: var(--f-mono); font-size: .7rem; color: var(--ink-3); min-height: 1.2em; }
  .name-star.shake { animation: shake 360ms; }
  @keyframes shake { 20%, 60% { transform: translateX(calc(-50% - 6px)); } 40%, 80% { transform: translateX(calc(-50% + 6px)); } }
  .letter { position: fixed; inset: 0; z-index: 90; background: #0A0606; color: #FF5A4C; overflow-y: auto; opacity: 0; transition: opacity 1.2s ease; }
  .letter.in { opacity: 1; }
  .letter .in-wrap { max-width: 640px; margin: 0 auto; padding: max(48px, 8vh) 22px 64px; display: grid; gap: 22px; }
  .letter canvas { width: min(280px, 70vw); aspect-ratio: 1; justify-self: center; }
  .letter .to { font-family: var(--f-mono); font-size: .72rem; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,90,76,.6); }
  .letter .body p { margin: 0 0 1em; font-size: clamp(1.05rem, 2.4vw, 1.3rem); line-height: 1.6; color: rgba(255,90,76,.9); white-space: pre-wrap; }
  .letter .sig { background: #FF5A4C; width: 150px; view-transition-name: none; }
  .letter .x { position: fixed; top: calc(env(safe-area-inset-top, 0px) + 14px); right: 14px; width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(255,90,76,.3); background: none; color: #FF5A4C; font: inherit; cursor: pointer; }
  `;
  document.head.appendChild(css);

  function heartCanvas(cv) {
    const c = cv.getContext('2d'), S = 280, d = Math.min(2, devicePixelRatio || 1);
    cv.width = S * d; cv.height = S * d; c.setTransform(d, 0, 0, d, 0, 0);
    const pts = [];
    for (let i = 0; i < 14; i++) {
      const t = i / 14 * Math.PI * 2;
      const x = 16 * Math.sin(t) ** 3, y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      pts.push([S / 2 + x * 7.4 + (Math.random() - .5) * 6, S / 2 - y * 7.4 + 10 + (Math.random() - .5) * 6]);
    }
    const bg = Array.from({ length: 60 }, () => [Math.random() * S, Math.random() * S, Math.random() * .9 + .3]);
    let k = 0; const still = window.BR && BR.reduce();
    (function frame() {
      c.clearRect(0, 0, S, S);
      bg.forEach(([x, y, r]) => { c.fillStyle = 'rgba(255,90,76,.35)'; c.beginPath(); c.arc(x, y, r, 0, 6.283); c.fill(); });
      const n = still ? pts.length : Math.min(pts.length, k / 12);
      c.strokeStyle = 'rgba(255,90,76,.75)'; c.lineWidth = 1; c.beginPath();
      for (let i = 0; i <= Math.floor(n) && i < pts.length; i++) { const [x, y] = pts[i % pts.length]; i ? c.lineTo(x, y) : c.moveTo(x, y); }
      if (n >= pts.length) c.closePath();
      c.stroke();
      pts.forEach(([x, y], i) => { if (i <= n) { c.fillStyle = '#FF5A4C'; c.beginPath(); c.arc(x, y, i % 4 === 0 ? 3 : 2, 0, 6.283); c.fill(); } });
      k++; if (!still && n < pts.length) requestAnimationFrame(frame);
    })();
  }

  function showLetter(msg) {
    const el = document.createElement('div'); el.className = 'letter'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'A letter');
    const paras = String(msg.letter || '').split(/\n\s*\n/).map(p => { const e = document.createElement('p'); e.textContent = p; return e.outerHTML; }).join('');
    const to = document.createElement('div'); to.textContent = 'For ' + (msg.to || 'you');
    el.innerHTML = `<button class="x" type="button" aria-label="Close">✕</button><div class="in-wrap"><canvas aria-hidden="true"></canvas><div class="to">${to.innerHTML}</div><div class="body">${paras}</div><span class="sig" role="img" aria-label="Prageeth"></span></div>`;
    document.body.appendChild(el); document.body.style.overflow = 'hidden';
    heartCanvas(el.querySelector('canvas'));
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')));
    const close = () => { el.classList.remove('in'); document.body.style.overflow = ''; setTimeout(() => el.remove(), 1200); };
    el.querySelector('.x').addEventListener('click', close);
    addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { close(); removeEventListener('keydown', esc); } });
    el.querySelector('.x').focus();
    if (window.BR) BR.blip('tone', true);
  }

  function prompt(host) {
    if (host.querySelector('.name-star')) return host.querySelector('input').focus();
    const box = document.createElement('div'); box.className = 'name-star';
    box.innerHTML = `<button class="close" type="button" aria-label="Close">✕</button><p>${TRAIL.ask}</p><form><label for="starName" hidden>Star name</label><input id="starName" autocomplete="off" spellcheck="false"><button type="submit">Name it</button></form><span class="no" aria-live="polite"></span>`;
    host.appendChild(box); const inp = box.querySelector('input'), no = box.querySelector('.no'); inp.focus();
    const shut = () => box.remove();
    box.querySelector('.close').addEventListener('click', shut);
    box.addEventListener('keydown', e => { if (e.key === 'Escape') shut(); });
    box.querySelector('form').addEventListener('submit', async e => {
      e.preventDefault(); no.textContent = 'Checking the sky…';
      try { const msg = await unseal(inp.value); box.remove(); showLetter(msg); }
      catch (err) { no.textContent = 'That isn’t its name.'; box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake'); }
    });
  }

  // clue 1: the three little dots under the footer signature
  function wireSignature() {
    document.querySelectorAll('.sig-xl').forEach(sig => {
      sig.addEventListener('click', e => {
        const r = sig.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        if (x < 0.7 || y < 0.7) return;
        let c = sig.parentNode.querySelector('.clue');
        if (!c) { c = document.createElement('span'); c.className = 'clue'; c.textContent = TRAIL.clue1; sig.after(c); }
        requestAnimationFrame(() => c.classList.add('in'));
        if (window.BR) BR.blip('tick', true);
      });
    });
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', wireSignature) : wireSignature();

  window.BRSecret = { TRAIL, prompt };
  window.dispatchEvent(new Event('br-secret-ready'));
})();
