(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- booking form ---------- */
  const OPTIONS = [
    ['diag', 'Компьютерная диагностика — от 1 200 ₽'],
    ['tires', 'Шиномонтаж — от 2 400 ₽'],
    ['oil', 'Замена масла — от 1 500 ₽'],
    ['brakes', 'Тормозная система — от 1 800 ₽'],
    ['susp', 'Подвеска и ходовая — от 2 000 ₽'],
    ['body', 'Защита и кузов — от 3 500 ₽'],
    ['other', 'Другое / не знаю']
  ];
  const sel = $('#formService');
  sel.innerHTML = OPTIONS.map(([v, t]) => `<option value="${v}">${t}</option>`).join('');
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-pick]');
    if (a) sel.value = a.dataset.pick;
  });

  const form = $('#form');
  const phone = form.elements.phone;
  phone.addEventListener('input', () => {
    let d = phone.value.replace(/\D/g, '');
    if (d[0] === '8') d = '7' + d.slice(1);
    if (d && d[0] !== '7') d = '7' + d;
    d = d.slice(0, 11);
    const p = ['+7', d.slice(1, 4) && ' (' + d.slice(1, 4), d.length > 4 ? ') ' + d.slice(4, 7) : '', d.length > 7 ? '-' + d.slice(7, 9) : '', d.length > 9 ? '-' + d.slice(9, 11) : ''];
    phone.value = d ? p.join('') : '';
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    [form.elements.name, phone].forEach(f => {
      const bad = f === phone ? phone.value.replace(/\D/g, '').length < 11 : !f.value.trim();
      f.classList.toggle('err', bad);
      if (bad && ok) f.focus();
      if (bad) ok = false;
    });
    if (!ok) return;
    $('#formOk').hidden = false;
    form.reset();
    burst(form);
  });
  form.addEventListener('input', e => e.target.classList.remove('err'));

  /* ---------- header, burger ---------- */
  const header = $('.header'), burger = $('#burger'), nav = $('#nav');
  const onScroll = () => header.classList.toggle('is-stuck', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const closeMenu = () => { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); };
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  nav.addEventListener('click', e => e.target.closest('a') && closeMenu());
  addEventListener('keydown', e => e.key === 'Escape' && closeMenu());

  /* ---------- reveal ---------- */
  $$('.reveal').forEach((el, i) => el.style.setProperty('--d', (i % 3) * 0.08 + 's'));
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- counters ---------- */
  const count = el => {
    const end = parseFloat(el.dataset.count), plus = 'plus' in el.dataset, suf = el.dataset.suffix || '';
    const fmt = v => Math.round(v).toLocaleString('ru-RU') + (plus ? '+' : '') + suf;
    if (reduced) { el.textContent = fmt(end); return; }
    const t0 = performance.now(), dur = 1600;
    const step = t => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(end * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const cio = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { $$('[data-count]', en.target).forEach(count); cio.unobserve(en.target); }
  }), { threshold: .4 });
  const stats = $('.stats'); if (stats) cio.observe(stats);

  /* ---------- hero: tilt + glare following the cursor, scroll progress ---------- */
  const hero = $('#hero'), tilt = $('.hero__tilt');
  if (tilt && !reduced && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - .5) * 2;
      ty = ((e.clientY - r.top) / r.height - .5) * 2;
      if (!raf) raf = requestAnimationFrame(tick);
    });
    hero.addEventListener('pointerleave', () => { tx = ty = 0; if (!raf) raf = requestAnimationFrame(tick); });
    const tick = () => {
      cx += (tx - cx) * .08; cy += (ty - cy) * .08;
      tilt.style.setProperty('--rx', (cx * 7).toFixed(2) + 'deg');
      tilt.style.setProperty('--ry', (-cy * 5).toFixed(2) + 'deg');
      tilt.style.setProperty('--gx', (50 + cx * 40).toFixed(1) + '%');
      tilt.style.setProperty('--gy', (35 + cy * 40).toFixed(1) + '%');
      raf = (Math.abs(tx - cx) + Math.abs(ty - cy) > .002) ? requestAnimationFrame(tick) : 0;
    };
  }
  const bar = $('#progress');
  const prog = () => { const m = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${m > 0 ? Math.min(1, scrollY / m) : 0})`; };
  addEventListener('scroll', prog, { passive: true }); prog();

  /* ---------- quick price estimate ---------- */
  const chipsEl = $('#calcChips');
  if (chipsEl) {
    const sum = $('#calcSum'), note = $('#calcNote'), btn = $('#calcBtn'), seg = $('#calcClass');
    let k = 1, shown = 0, anim = 0, nutTurn = 0; const nut = $('#calcNut');
    const fmt = v => Math.round(v).toLocaleString('ru-RU') + ' ₽';
    const update = () => {
      const on = $$('.chip-btn[aria-pressed="true"]', chipsEl);
      const total = on.reduce((a, b) => a + +b.dataset.price, 0) * k;
      cancelAnimationFrame(anim);
      const from = shown, t0 = performance.now(), dur = reduced ? 1 : 500;
      const step = t => {
        const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        shown = from + (total - from) * e; sum.textContent = (total ? 'от ' : '') + fmt(shown);
        if (p < 1) anim = requestAnimationFrame(step);
      };
      anim = requestAnimationFrame(step);
      note.textContent = on.length ? `Работ выбрано: ${on.length}. Точную смету дадим после осмотра.` : 'Выберите хотя бы одну работу';
      if (on.length) btn.dataset.pick = on[0].dataset.id; else delete btn.dataset.pick;
      btn.classList.toggle('is-off', !on.length);
      nutTurn += 60; nut.style.transform = `rotate(${nutTurn}deg)`;
    };
    chipsEl.addEventListener('click', e => {
      const b = e.target.closest('.chip-btn'); if (!b) return;
      b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); update();
    });
    seg.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      $$('button', seg).forEach(x => x.setAttribute('aria-checked', x === b)); k = +b.dataset.k; update();
    });
    update();
  }

  /* ---------- spotlight on dark service cards ---------- */
  $$('.section--dark .svc').forEach(c => c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));

  /* ---------- little burst of tools when the request is sent ---------- */
  function burst(host) {
    if (reduced) return;
    const ids = ['nut', 'bolt', 'wrench', 'gear', 'wheel'];
    const box = document.createElement('div');
    box.className = 'burst';
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2 + Math.random() * .4, d = 90 + Math.random() * 170;
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      el.setAttribute('class', 'burst__i');
      el.style.cssText = `--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d - 40}px;--r:${(Math.random() - .5) * 720}deg;--s:${22 + Math.random() * 18}px;--c:${i % 3 ? '#1f5fe0' : '#1fa968'};animation-delay:${i * 12}ms`;
      el.innerHTML = `<use href="#i-${ids[i % ids.length]}"/>`;
      box.appendChild(el);
    }
    host.appendChild(box);
    setTimeout(() => box.remove(), 2200);
  }
})();
