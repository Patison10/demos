(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const rub = v => Math.round(v).toLocaleString('ru-RU') + ' ₽';

  /* =========================================================
     CSS 3D device builders
     ========================================================= */
  const layers = (d, step = 1.5) => { let s = ''; for (let z = -d / 2 + 1; z < d / 2; z += step) s += `<i class="l" style="transform:translateZ(${z.toFixed(1)}px)"></i>`; return s; };
  const ui = (cls = '') => `<div class="ui ${cls}"><div class="ui__time">9:41</div><div class="ui__date">Пятница, 24 октября</div><div class="ui__apps">${'<i></i>'.repeat(8)}</div></div>`;
  const fx = (crack = true) => `
    ${crack ? `<div class="fx fx-screen"><svg viewBox="0 0 100 200" preserveAspectRatio="none"><path style="--l:260" d="M62 0L50 38L66 60L44 96L60 130L40 200"/><path style="--l:120" d="M50 38L22 52L8 84"/><path style="--l:100" d="M44 96L78 110L96 150"/><path style="--l:90" d="M66 60L90 54L100 40"/></svg></div>` : ''}
    <div class="fx fx-battery"><div class="bat"><i></i></div></div>
    <div class="fx fx-port"><svg viewBox="0 0 24 24"><path d="M9 3v5M15 3v5M7 8h10v4a5 5 0 01-10 0z"/><path d="M12 17v4"/><path class="spark" d="M19 3.5l-2 3h3l-2 3"/></svg></div>
    <div class="fx fx-water"><i></i><i></i><i></i><i></i><i></i><svg viewBox="0 0 24 24"><path d="M12 3s6 6.4 6 11a6 6 0 01-12 0c0-4.6 6-11 6-11z"/></svg></div>
    <div class="fx fx-power"><svg viewBox="0 0 24 24"><path d="M12 3v8"/><path d="M6.3 6.8a8 8 0 1011.4 0"/></svg></div>
    <div class="fx fx-soft"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg></div>`;
  const brand = '<svg class="logo-b" viewBox="0 0 32 32"><path d="M3 17h6l3-8 5 15 3-7h7"/></svg>';

  const phone = (w = 128, h = 262) => `
    <div class="d3" style="--w:${w}px;--h:${h}px;--d:14px;--r:26px;--bz:6px;--frame:#232c3d">
      ${layers(14)}
      <div class="front"><div class="scr">${ui()}${fx()}</div></div>
      <div class="back" style="--b1:#4d78a8;--b2:#1d3150"><div class="cam"><i></i><i></i><i></i></div>${brand}</div>
    </div>`;
  const tablet = () => `
    <div class="d3" style="--w:196px;--h:264px;--d:10px;--r:20px;--bz:8px;--frame:#2a3347">
      ${layers(10)}
      <div class="front"><div class="scr">${ui()}${fx()}</div></div>
      <div class="back" style="--b1:#8aa1c2;--b2:#4d6283"><div class="cam" style="width:34px;height:34px;grid-template-columns:1fr"><i></i></div>${brand}</div>
    </div>`;
  const watch = () => `
    <div class="d3" style="--w:104px;--h:124px;--d:16px;--r:30px;--bz:5px;--frame:#1d2536">
      <div class="strap strap--t"></div><div class="strap strap--b"></div>
      ${layers(16)}
      <i class="crown"></i>
      <div class="front"><div class="scr" style="background:linear-gradient(160deg,#0b1730,#12365e)">${ui('ui--w')}${fx()}</div></div>
      <div class="back" style="--b1:#3b4a66;--b2:#1d2536"></div>
    </div>`;
  const laptop = () => `
    <div class="d3" style="--w:300px;--h:250px">
      <div class="lp">
        <div class="lpb">${layers(8)}<div class="top"><div class="keys">${'<i></i>'.repeat(70)}</div><div class="tp"></div></div></div>
        <div class="lps">${layers(5, 1.2)}
          <div class="front"><div class="scr" style="inset:7px;border-radius:7px">${ui('ui--lap')}${fx()}</div></div>
          <div class="back">${brand}</div>
        </div>
      </div>
    </div>`;
  const console_ = () => `
    <div class="d3" style="--w:260px;--h:64px;--d:168px">
      <div class="cb">
        <div class="f f--front"><i class="slit"></i><i class="led"></i><div class="fxwrap">${fx(false)}</div></div>
        <div class="f f--back"></div><div class="f f--l"></div><div class="f f--r"></div>
        <div class="f f--t"><i class="slit"></i></div><div class="f f--bt"></div>
      </div>
    </div>`;

  /* =========================================================
     Data
     ========================================================= */
  const ic = {
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.4"/><path d="M11 18.5h2"/>',
    laptop: '<rect x="4" y="5" width="16" height="11" rx="1.6"/><path d="M2 19h20"/>',
    tablet: '<rect x="5" y="3" width="14" height="18" rx="2.4"/><path d="M11 18h2"/>',
    watch: '<rect x="7" y="7" width="10" height="10" rx="3"/><path d="M9 7l.7-4h4.6l.7 4M9 17l.7 4h4.6l.7-4"/>',
    console: '<rect x="3" y="8" width="18" height="8" rx="2.4"/><path d="M7 12h6"/><circle cx="17" cy="12" r="1"/>'
  };
  const DEV = [
    { id: 'phone', name: 'Смартфон', coef: 1, img: 'phone', brands: ['Apple iPhone', 'Samsung', 'Xiaomi', 'Huawei / Honor', 'Другая'], build: phone },
    { id: 'laptop', name: 'Ноутбук', coef: 1.5, img: 'laptop', brands: ['Apple MacBook', 'ASUS', 'Lenovo', 'HP', 'Другая'], build: laptop },
    { id: 'tablet', name: 'Планшет', coef: 1.15, img: 'tablet', brands: ['Apple iPad', 'Samsung', 'Lenovo', 'Другая'], build: tablet },
    { id: 'watch', name: 'Смарт-часы', coef: .9, img: 'watch', brands: ['Apple Watch', 'Samsung', 'Huawei / Honor', 'Garmin', 'Другая'], build: watch },
    { id: 'console', name: 'Консоль', coef: 1.4, img: 'board', brands: ['PlayStation', 'Xbox', 'Nintendo', 'Другая'], build: console_ }
  ];
  const PRO = [
    { id: 'screen', name: 'Разбит экран', price: 3500, time: '1–2 часа', list: ['Новый дисплей', 'Проверка сенсора', 'Гарантия 6 мес'], d: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M14 3l-3 6 4 3-3 5 1 4"/>' },
    { id: 'battery', name: 'Быстро разряжается', price: 1800, time: '40 минут', list: ['Новый аккумулятор', 'Калибровка', 'Гарантия 6 мес'], d: '<rect x="3" y="8" width="16" height="9" rx="2"/><path d="M21 11v3M7 12.5h4"/>' },
    { id: 'port', name: 'Не заряжается', price: 1500, time: '1–2 часа', list: ['Замена разъёма', 'Проверка зарядки', 'Гарантия 3 мес'], d: '<path d="M9 3v5M15 3v5M7 8h10v4a5 5 0 01-10 0z"/><path d="M12 17v4"/>' },
    { id: 'water', name: 'Попала вода', price: 2800, time: '1–3 дня', list: ['Ультразвуковая чистка', 'Диагностика платы', 'Гарантия 3 мес'], d: '<path d="M12 3s6 6.4 6 11a6 6 0 01-12 0c0-4.6 6-11 6-11z"/>' },
    { id: 'power', name: 'Не включается', price: 2200, time: '1 день', list: ['Диагностика платы', 'Ремонт питания', 'Гарантия 6 мес'], d: '<path d="M12 3v8"/><path d="M6.3 6.8a8 8 0 1011.4 0"/>' },
    { id: 'soft', name: 'Ошибки и зависания', price: 900, time: '1 час', list: ['Перепрошивка', 'Сохранение данных', 'Гарантия 1 мес'], d: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>' }
  ];
  const CATS = { charge: 'Зарядка и кабели', audio: 'Звук', parts: 'Комплектующие' };
  const PROD = [
    { id: 1, name: 'Зарядное устройство 65 Вт GaN', cat: 'charge', spec: 'USB-C, быстрая зарядка', price: 2490, img: 'a1' },
    { id: 2, name: 'Беспроводные наушники Pro', cat: 'audio', spec: 'Шумоподавление, 30 ч', price: 4990, img: 'a2', tag: 'Хит' },
    { id: 3, name: 'Кабель USB-C плетёный', cat: 'charge', spec: '1,5 м, до 100 Вт', price: 590, img: 'a3' },
    { id: 4, name: 'Аккумуляторные элементы Li-ion', cat: 'parts', spec: '2 шт, 3,7 В', price: 790, img: 'a4' },
    { id: 5, name: 'Портативная колонка', cat: 'audio', spec: 'Bluetooth 5.3, 12 ч', price: 3290, img: 'a5' },
    { id: 6, name: 'Кабели Lightning, 2 шт', cat: 'charge', spec: 'MFi, 1 м', price: 890, img: 'a6', tag: 'Выгодно' },
    { id: 7, name: 'Набор: чехол и наушники', cat: 'audio', spec: 'Для смартфона', price: 1990, img: 'a7' },
    { id: 8, name: 'Набор для замены батареи', cat: 'parts', spec: 'Инструменты и клей', price: 1290, img: 'a8' }
  ];
  const pdev = id => DEV.find(d => d.id === id);

  /* =========================================================
     Toast + cart
     ========================================================= */
  const toastEl = $('#toast'); let tt = 0;
  const toast = m => { toastEl.textContent = m; toastEl.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove('on'), 2400); };
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('puls-cart') || '[]'); } catch (e) { cart = []; }
  const save = () => { try { localStorage.setItem('puls-cart', JSON.stringify(cart)); } catch (e) { /* no storage */ } };
  const drawer = $('#drawer'), overlay = $('#overlay'), body = $('#drawerBody'), cartBtn = $('#cartBtn');
  const renderCart = () => {
    $('#cartCount').textContent = cart.reduce((a, i) => a + i.qty, 0);
    $('#cartSum').textContent = rub(cart.reduce((a, i) => a + i.price * i.qty, 0));
    if (!cart.length) { body.innerHTML = '<p class="drawer__empty">Заказ пуст. Рассчитайте ремонт или добавьте аксессуары.</p>'; return; }
    body.innerHTML = cart.map(i => `
      <div class="ci" data-key="${i.key}">
        <img src="img/${i.img}.jpg" alt="" width="72" height="72">
        <div>
          <div class="ci__n">${i.name}</div><div class="ci__s">${i.sub}</div>
          <div class="ci__row">${i.type === 'prod' ? `<div class="qty"><button data-a="minus" aria-label="Меньше">−</button><span>${i.qty}</span><button data-a="plus" aria-label="Больше">+</button></div>` : '<span class="ci__s">Ремонт</span>'}<b class="ci__p">${rub(i.price * i.qty)}</b></div>
          <button class="ci__x" data-a="del">Удалить</button>
        </div></div>`).join('');
  };
  const addItem = it => {
    const f = cart.find(i => i.key === it.key);
    if (f && it.type === 'prod') f.qty++; else if (!f) cart.push({ ...it, qty: 1 });
    save(); renderCart();
    cartBtn.classList.remove('bump'); void cartBtn.offsetWidth; cartBtn.classList.add('bump');
  };
  body.addEventListener('click', e => {
    const b = e.target.closest('[data-a]'); if (!b) return;
    const it = cart.find(i => i.key === b.closest('.ci').dataset.key); if (!it) return;
    if (b.dataset.a === 'plus') it.qty++;
    if (b.dataset.a === 'minus') it.qty = Math.max(1, it.qty - 1);
    if (b.dataset.a === 'del') cart = cart.filter(i => i !== it);
    save(); renderCart();
  });
  const openCart = () => { overlay.hidden = false; requestAnimationFrame(() => overlay.classList.add('on')); drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); };
  const closeCart = () => { overlay.classList.remove('on'); drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); setTimeout(() => { if (!drawer.classList.contains('open')) overlay.hidden = true; }, 320); };
  cartBtn.addEventListener('click', openCart);
  $('#drawerClose').addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);
  $('#checkout').addEventListener('click', () => { $('#checkoutNote').textContent = cart.length ? 'Это демо-версия: оформление и оплата не подключены.' : 'Добавьте в заказ хотя бы одну позицию.'; });
  renderCart();

  /* =========================================================
     Hero 3D phone
     ========================================================= */
  const heroDev = $('#heroDev');
  heroDev.innerHTML = `<div class="hero3"><div class="hero3__spin">${phone(168, 344)}</div></div>`;
  const hs = document.createElement('style');
  hs.textContent = `.hero3{position:absolute;left:50%;top:50%;width:0;height:0;transform-style:preserve-3d;transform:rotateZ(-6deg) scale(1.1)}
    .hero3__spin{position:absolute;left:0;top:0;transform-style:preserve-3d;animation:hspin 16s ease-in-out infinite}
    @keyframes hspin{0%,100%{transform:rotateY(-30deg)}50%{transform:rotateY(30deg)}}
    .ui--w .ui__time{font-size:22px;margin-top:6px}.ui--w .ui__apps{grid-template-columns:repeat(3,1fr);gap:4px}
    .ui--lap{padding:14px 20px}.ui--lap .ui__time{font-size:34px;margin-top:30px}.ui--lap .ui__apps{grid-template-columns:repeat(8,1fr);max-width:200px;margin-inline:auto}
    .fxwrap{position:absolute;inset:0}.cb .f--front .fx svg{width:auto;height:70%}.cb .f--front .fx-battery .bat{transform:scale(.55)}
    .cb .f--front .fx-water i{display:none}`;
  document.head.appendChild(hs);

  /* =========================================================
     Wizard
     ========================================================= */
  const ring = $('#ring'), scene = $('#scene');
  ring.innerHTML = DEV.map((d, n) => `<div class="slot" data-i="${n}" style="--n:${n}"><div class="tilt"><div class="sway">${d.build()}</div></div></div>`).join('');
  const slots = $$('.slot', ring);
  const state = { dev: 'phone', brand: null, prob: 'screen' };
  const tabs = $('#devTabs'), pills = $('#brandPills'), probs = $('#probs');
  tabs.innerHTML = DEV.map(d => `<button class="dtab" role="tab" data-id="${d.id}" aria-selected="false"><svg viewBox="0 0 24 24">${ic[d.id]}</svg>${d.name}</button>`).join('');
  probs.innerHTML = PRO.map(p => `<button class="prob" role="radio" data-id="${p.id}" aria-checked="false"><svg viewBox="0 0 24 24">${p.d}</svg>${p.name}</button>`).join('');
  let shown = 0, anim = 0;
  const animPrice = to => {
    cancelAnimationFrame(anim);
    const from = shown, t0 = performance.now(), dur = reduced ? 1 : 500, el = $('#resPrice');
    const step = t => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); shown = from + (to - from) * e; el.textContent = rub(shown); if (k < 1) anim = requestAnimationFrame(step); };
    anim = requestAnimationFrame(step);
  };
  const calcPrice = () => {
    const d = pdev(state.dev), p = PRO.find(x => x.id === state.prob);
    const bi = d.brands.indexOf(state.brand);
    const bc = bi === 0 ? 1.3 : (bi === d.brands.length - 1 ? 1 : 1.1);
    return Math.round(p.price * d.coef * bc / 100) * 100;
  };
  const update = () => {
    const d = pdev(state.dev), p = PRO.find(x => x.id === state.prob);
    $$('.dtab', tabs).forEach(b => b.setAttribute('aria-selected', b.dataset.id === state.dev));
    pills.innerHTML = d.brands.map(b => `<button class="pill" role="radio" data-b="${b}" aria-checked="${b === state.brand}">${b}</button>`).join('');
    $$('.prob', probs).forEach(b => b.setAttribute('aria-checked', b.dataset.id === state.prob));
    const idx = DEV.indexOf(d);
    ring.style.setProperty('--sel', idx);
    slots.forEach((s, i) => s.classList.toggle('is-sel', i === idx));
    scene.dataset.p = state.prob;
    $('#sceneLabel').innerHTML = `<b>${d.name}${state.brand && state.brand !== 'Другая' ? ' · ' + state.brand : ''}</b><span>${p.name}</span>`;
    animPrice(calcPrice());
    $('#resTime').textContent = p.time;
    $('#resList').innerHTML = p.list.map(x => `<li>${x}</li>`).join('');
  };
  const setDev = id => { state.dev = id; state.brand = pdev(id).brands[0]; update(); };
  tabs.addEventListener('click', e => { const b = e.target.closest('.dtab'); if (b) setDev(b.dataset.id); });
  pills.addEventListener('click', e => { const b = e.target.closest('.pill'); if (b) { state.brand = b.dataset.b; update(); } });
  probs.addEventListener('click', e => { const b = e.target.closest('.prob'); if (b) { state.prob = b.dataset.id; update(); } });
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-dev]');
    if (a) setDev(a.dataset.dev);
  });
  $('#resAdd').addEventListener('click', () => {
    const d = pdev(state.dev), p = PRO.find(x => x.id === state.prob);
    addItem({ key: `r|${d.id}|${state.brand}|${p.id}`, type: 'repair', name: `${d.name}: ${p.name.toLowerCase()}`, sub: `${state.brand} · срок ${p.time}`, price: calcPrice(), img: d.img });
    toast('Ремонт добавлен в заказ');
  });
  $('#resBook').addEventListener('click', () => {
    const d = pdev(state.dev), p = PRO.find(x => x.id === state.prob);
    $('#issueField').value = `${d.name} ${state.brand}, ${p.name.toLowerCase()}`;
  });
  setDev('phone');

  /* pointer tilt for the selected device + hero phone */
  const ptr = { x: 0, y: 0, sx: 0, sy: 0 };
  addEventListener('pointermove', e => { ptr.x = (e.clientX / innerWidth) * 2 - 1; ptr.y = (e.clientY / innerHeight) * 2 - 1; }, { passive: true });
  const chips = $$('.chip');
  const h3d = $('#heroDev');
  const loop = () => {
    requestAnimationFrame(loop);
    if (reduced || !fine) return;
    ptr.sx += (ptr.x - ptr.sx) * .07; ptr.sy += (ptr.y - ptr.sy) * .07;
    h3d.style.setProperty('--rx', (ptr.sx * 14).toFixed(2) + 'deg');
    h3d.style.setProperty('--ry', (-ptr.sy * 9).toFixed(2) + 'deg');
    chips.forEach(c => { const d = +c.dataset.d || 1; c.style.setProperty('--px', (ptr.sx * -12 * d).toFixed(1) + 'px'); c.style.setProperty('--py', (ptr.sy * -8 * d).toFixed(1) + 'px'); });
    const sel = slots.find(s => s.classList.contains('is-sel'));
    if (sel) { const t = $('.tilt', sel); t.style.setProperty('--rx', (ptr.sx * 16).toFixed(1) + 'deg'); t.style.setProperty('--ry', (-ptr.sy * 10).toFixed(1) + 'deg'); }
  };
  loop();

  /* =========================================================
     Shop
     ========================================================= */
  const grid = $('#grid'), filt = $('#filters'); let cat = 'all';
  filt.innerHTML = ['all', ...Object.keys(CATS)].map(k => `<button class="chipf" type="button" data-k="${k}" aria-pressed="${k === 'all'}">${k === 'all' ? 'Все' : CATS[k]}</button>`).join('');
  const plus = '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>';
  const renderGrid = () => {
    grid.innerHTML = PROD.filter(p => cat === 'all' || p.cat === cat).map(p => `
      <article class="prod"><div class="prod__img"><img src="img/${p.img}.jpg" alt="${p.name}" loading="lazy" width="700" height="700">${p.tag ? `<span class="prod__tag">${p.tag}</span>` : ''}</div>
        <div class="prod__body"><span class="prod__cat">${CATS[p.cat]}</span><h3 class="prod__name">${p.name}</h3><span class="prod__spec">${p.spec}</span>
          <div class="prod__buy"><b class="prod__price">${rub(p.price)}</b><button class="prod__add" data-add="${p.id}" aria-label="Добавить ${p.name}">${plus}</button></div></div></article>`).join('');
  };
  filt.addEventListener('click', e => { const b = e.target.closest('.chipf'); if (!b) return; cat = b.dataset.k; $$('.chipf', filt).forEach(c => c.setAttribute('aria-pressed', c === b)); renderGrid(); });
  grid.addEventListener('click', e => {
    const b = e.target.closest('[data-add]'); if (!b) return;
    const p = PROD.find(x => x.id === +b.dataset.add);
    addItem({ key: `p|${p.id}`, type: 'prod', name: p.name, sub: p.spec, price: p.price, img: p.img });
    toast(`«${p.name}» добавлен в заказ`);
    b.classList.add('done'); b.innerHTML = '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
    setTimeout(() => { b.classList.remove('done'); b.innerHTML = plus; }, 1300);
  });
  renderGrid();

  /* =========================================================
     Order status
     ========================================================= */
  const sf = $('#statusForm'), tlItems = $$('#tl li');
  const DNAMES = ['Смартфон Samsung', 'Ноутбук ASUS', 'Планшет iPad', 'Смарт-часы Apple Watch', 'Консоль PlayStation 5'];
  sf.addEventListener('submit', e => {
    e.preventDefault();
    const v = $('#orderNo').value.trim();
    const bad = !/^\d{5}$/.test(v);
    $('#orderErr').hidden = !bad; if (bad) return;
    const digits = [...v].reduce((a, c) => a + +c, 0);
    const step = 1 + (digits % 3);               // 1..3
    $('#tlNo').textContent = '№ ' + v;
    $('#tlDev').textContent = DNAMES[digits % DNAMES.length];
    tlItems.forEach(li => li.classList.remove('done', 'now'));
    tlItems.forEach((li, i) => setTimeout(() => { if (i < step) li.classList.add('done'); else if (i === step) li.classList.add('now'); }, reduced ? 0 : 260 * i));
  });
  // initial demo state
  $('#tlNo').textContent = '№ 48213'; $('#tlDev').textContent = DNAMES[0];
  tlItems.forEach((li, i) => { if (i < 2) li.classList.add('done'); else if (i === 2) li.classList.add('now'); });

  /* =========================================================
     Header, form, reveal, counters
     ========================================================= */
  const burger = $('#burger'), nav = $('#nav');
  const closeMenu = () => { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); };
  burger.addEventListener('click', () => { const o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
  nav.addEventListener('click', e => e.target.closest('a') && closeMenu());
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); closeCart(); } });

  const form = $('#form'), ph = form.elements.phone;
  ph.addEventListener('input', () => {
    let d = ph.value.replace(/\D/g, '');
    if (d[0] === '8') d = '7' + d.slice(1);
    if (d && d[0] !== '7') d = '7' + d;
    d = d.slice(0, 11);
    ph.value = d ? ['+7', d.slice(1, 4) && ' (' + d.slice(1, 4), d.length > 4 ? ') ' + d.slice(4, 7) : '', d.length > 7 ? '-' + d.slice(7, 9) : '', d.length > 9 ? '-' + d.slice(9, 11) : ''].join('') : '';
  });
  form.addEventListener('submit', e => {
    e.preventDefault(); let ok = true;
    [form.elements.name, ph].forEach(f => {
      const bad = f === ph ? ph.value.replace(/\D/g, '').length < 11 : !f.value.trim();
      f.classList.toggle('err', bad); if (bad && ok) f.focus(); if (bad) ok = false;
    });
    if (!ok) return;
    $('#formOk').hidden = false; form.reset();
  });
  form.addEventListener('input', e => e.target.classList.remove('err'));

  $$('.reveal').forEach((el, i) => el.style.setProperty('--d', (i % 3) * 0.08 + 's'));
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .1, rootMargin: '0px 0px -30px 0px' });
  $$('.reveal').forEach(el => io.observe(el));
  const count = el => {
    const end = parseFloat(el.dataset.count), pl = 'plus' in el.dataset, suf = el.dataset.suffix || '';
    const fmt = v => Math.round(v).toLocaleString('ru-RU') + (pl ? '+' : '') + suf;
    if (reduced) { el.textContent = fmt(end); return; }
    const t0 = performance.now();
    const step = t => { const k = Math.min(1, (t - t0) / 1600), e = 1 - Math.pow(1 - k, 3); el.textContent = fmt(end * e); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  setTimeout(() => $$('[data-count]').forEach(count), 400);
})();
