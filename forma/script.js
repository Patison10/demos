(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rub = v => Math.round(v).toLocaleString('ru-RU') + ' ₽';
  const num = (v, d = 2) => v.toLocaleString('ru-RU', { minimumFractionDigits: d, maximumFractionDigits: d });

  /* ---------- data ---------- */
  const CATS = { porcelain: 'Керамогранит', marble: 'Камень и мрамор', mosaic: 'Мозаика', wall: 'Настенная', decor: 'Декор и цемент' };
  const P = [
    { id: 1, name: 'Terrazzo Bianco', cat: 'porcelain', w: 600, h: 600, price: 3490, pack: 1.44, tag: 'Хит', img: 'p1' },
    { id: 2, name: 'Marmo Statuario', cat: 'marble', w: 600, h: 1200, price: 5290, pack: 1.44, tag: 'Новинка', img: 'p2' },
    { id: 3, name: 'Travertino Beige', cat: 'marble', w: 600, h: 600, price: 3890, pack: 1.44, img: 'p3' },
    { id: 4, name: 'Cemento Grafite', cat: 'decor', w: 200, h: 200, price: 4190, pack: 1.0, img: 'p4' },
    { id: 5, name: 'Sicilia Decor', cat: 'decor', w: 200, h: 200, price: 4790, pack: 1.0, tag: 'Хит', img: 'p5' },
    { id: 6, name: 'Flora Verde', cat: 'decor', w: 200, h: 200, price: 4590, pack: 1.0, img: 'p6' },
    { id: 7, name: 'Bianco Matt', cat: 'wall', w: 100, h: 300, price: 1990, pack: 0.9, img: 'p7' },
    { id: 8, name: 'Mosaico Menta', cat: 'mosaic', w: 300, h: 300, price: 5990, pack: 0.81, img: 'p8' },
    { id: 9, name: 'Geometrico Grigio', cat: 'porcelain', w: 200, h: 200, price: 3290, pack: 1.0, img: 'p9' },
    { id: 10, name: 'Rombo Mosaico', cat: 'mosaic', w: 300, h: 300, price: 6490, pack: 0.81, tag: 'Новинка', img: 'p10' },
    { id: 11, name: 'Marmo Mix', cat: 'marble', w: 600, h: 600, price: 4590, pack: 1.44, img: 'p11' },
    { id: 12, name: 'Esagono Bianco', cat: 'wall', w: 200, h: 230, price: 2790, pack: 0.9, img: 'p12' }
  ];
  const byId = id => P.find(p => p.id === +id);
  const size = p => `${p.w}×${p.h} мм`;

  /* ---------- toast ---------- */
  const toastEl = $('#toast'); let tt = 0;
  const toast = msg => { toastEl.textContent = msg; toastEl.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove('on'), 2400); };

  /* ---------- cart ---------- */
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('forma-cart') || '[]').filter(i => byId(i.id)); } catch (e) { cart = []; }
  const save = () => { try { localStorage.setItem('forma-cart', JSON.stringify(cart)); } catch (e) { /* storage unavailable */ } };
  const drawer = $('#drawer'), overlay = $('#overlay'), body = $('#drawerBody');
  const cartBtn = $('#cartBtn');
  const itemSum = i => { const p = byId(i.id); return i.qty * p.pack * p.price; };

  const renderCart = () => {
    const count = cart.reduce((a, i) => a + i.qty, 0);
    $('#cartCount').textContent = count;
    $('#cartSum').textContent = rub(cart.reduce((a, i) => a + itemSum(i), 0));
    if (!cart.length) { body.innerHTML = '<p class="drawer__empty">Корзина пуста. Добавьте позиции из каталога.</p>'; return; }
    body.innerHTML = cart.map(i => {
      const p = byId(i.id);
      return `<div class="ci" data-id="${p.id}">
        <img src="img/${p.img}.jpg" alt="" width="76" height="76">
        <div>
          <div class="ci__n">${p.name}</div>
          <div class="ci__s">${size(p)} · упаковка ${num(p.pack)} м² · ${rub(p.price)}/м²</div>
          <div class="ci__row">
            <div class="qty"><button data-a="minus" aria-label="Меньше">−</button><span>${i.qty}</span><button data-a="plus" aria-label="Больше">+</button></div>
            <b class="ci__p">${rub(itemSum(i))}</b>
          </div>
          <button class="ci__x" data-a="del">Удалить</button>
        </div></div>`;
    }).join('');
  };
  const add = (id, qty = 1) => {
    const f = cart.find(i => i.id === +id);
    if (f) f.qty += qty; else cart.push({ id: +id, qty });
    save(); renderCart();
    cartBtn.classList.remove('bump'); void cartBtn.offsetWidth; cartBtn.classList.add('bump');
  };
  body.addEventListener('click', e => {
    const b = e.target.closest('[data-a]'); if (!b) return;
    const row = b.closest('.ci'); const it = cart.find(i => i.id === +row.dataset.id);
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
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeCart(); closeMenu(); } });
  $('#checkout').addEventListener('click', () => {
    const n = $('#checkoutNote');
    n.textContent = cart.length ? 'Это демо-версия: оформление и оплата не подключены.' : 'Добавьте в корзину хотя бы одну позицию.';
  });
  renderCart();

  /* ---------- catalog ---------- */
  const grid = $('#grid'), filtersEl = $('#filters');
  let cat = 'all', query = '', sortBy = 'pop';
  filtersEl.innerHTML = ['all', ...Object.keys(CATS)].map(k => `<button class="chip" type="button" data-k="${k}" aria-pressed="${k === 'all'}">${k === 'all' ? 'Все' : CATS[k]}</button>`).join('');
  const plus = '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>';
  const renderGrid = () => {
    const q = query.trim().toLowerCase();
    let list = P.filter(p => (cat === 'all' || p.cat === cat) && (!q || `${p.name} ${CATS[p.cat]} ${size(p)} ${p.w}x${p.h}`.toLowerCase().replace(/×/g, 'x').includes(q.replace(/×/g, 'x'))));
    if (sortBy === 'asc') list.sort((a, b) => a.price - b.price);
    if (sortBy === 'desc') list.sort((a, b) => b.price - a.price);
    if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    grid.innerHTML = list.map(p => `
      <article class="prod">
        <div class="prod__img"><img src="img/${p.img}.jpg" alt="Плитка ${p.name}" loading="lazy" width="700" height="700">${p.tag ? `<span class="prod__tag">${p.tag}</span>` : ''}</div>
        <div class="prod__body">
          <span class="prod__cat">${CATS[p.cat]}</span>
          <h3 class="prod__name">${p.name}</h3>
          <span class="prod__spec">${size(p)} · ${num(p.pack)} м² в упаковке</span>
          <span class="prod__stock">В наличии</span>
          <div class="prod__buy">
            <div class="prod__price"><b>${rub(p.price)}</b><small>за м²</small></div>
            <button class="prod__add" data-add="${p.id}" aria-label="Добавить ${p.name} в корзину">${plus}</button>
          </div>
        </div>
      </article>`).join('');
    $('#empty').hidden = list.length > 0;
    $('#resCount').textContent = `Найдено позиций: ${list.length}`;
  };
  filtersEl.addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    setCat(b.dataset.k);
  });
  const setCat = k => {
    cat = k;
    $$('.chip', filtersEl).forEach(c => c.setAttribute('aria-pressed', c.dataset.k === k));
    renderGrid();
  };
  $('#sort').addEventListener('change', e => { sortBy = e.target.value; renderGrid(); });
  const sInput = $('#searchInput');
  sInput.addEventListener('input', () => { query = sInput.value; renderGrid(); });
  $('#searchForm').addEventListener('submit', e => { e.preventDefault(); $('#catalog').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); });
  grid.addEventListener('click', e => {
    const b = e.target.closest('[data-add]'); if (!b) return;
    add(b.dataset.add); toast(`«${byId(b.dataset.add).name}» добавлена в корзину`);
    b.classList.add('done'); b.innerHTML = '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
    setTimeout(() => { b.classList.remove('done'); b.innerHTML = plus; }, 1400);
  });
  document.addEventListener('click', e => {
    const c = e.target.closest('[data-cat]');
    if (c) { setCat(c.dataset.cat); sInput.value = ''; query = ''; renderGrid(); }
    const s = e.target.closest('[data-search]');
    if (s) { setCat('all'); sInput.value = s.dataset.search; query = s.dataset.search; renderGrid(); }
  });
  renderGrid();

  /* ---------- calculator ---------- */
  const cW = $('#cW'), cL = $('#cL'), cRes = $('#cRes'), cProd = $('#cProd'), svg = $('#planSvg');
  cProd.innerHTML = P.map(p => `<option value="${p.id}">${p.name} — ${size(p)}, ${rub(p.price)}/м²</option>`).join('');
  cProd.value = 1;
  let calcBoxes = 0;
  const animNum = (el, to, fmt) => {
    if (reduced) { el.textContent = fmt(to); return; }
    const from = +el.dataset.v || 0; el.dataset.v = to;
    const t0 = performance.now();
    const step = t => { const k = Math.min(1, (t - t0) / 450), e = 1 - Math.pow(1 - k, 3); el.textContent = fmt(from + (to - from) * e); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  const drawPlan = (W, L, p) => {
    const VW = 400, VH = 300, m = 34;
    const s = Math.min((VW - 2 * m) / W, (VH - 2 * m) / L);
    const rw = W * s, rl = L * s, x0 = (VW - rw) / 2, y0 = (VH - rl) / 2;
    const tw = p.w / 1000, th = p.h / 1000;
    let lines = '';
    const nx = Math.floor(W / tw), ny = Math.floor(L / th);
    if (nx < 70 && ny < 70) {
      for (let i = 1; i <= nx; i++) { const x = x0 + i * tw * s; if (x < x0 + rw - .5) lines += `<line class="gl ${reduced ? '' : 'gl--in'}" style="--len:${rl};animation-delay:${i * 25}ms" x1="${x}" y1="${y0}" x2="${x}" y2="${y0 + rl}"/>`; }
      for (let j = 1; j <= ny; j++) { const y = y0 + j * th * s; if (y < y0 + rl - .5) lines += `<line class="gl ${reduced ? '' : 'gl--in'}" style="--len:${rw};animation-delay:${j * 25 + 120}ms" x1="${x0}" y1="${y}" x2="${x0 + rw}" y2="${y}"/>`; }
    }
    svg.innerHTML = `<rect class="room" x="${x0}" y="${y0}" width="${rw}" height="${rl}"/>${lines}
      <text x="${VW / 2}" y="${y0 - 10}" text-anchor="middle">${num(W, 1)} м</text>
      <text x="${x0 - 10}" y="${VH / 2}" text-anchor="middle" transform="rotate(-90 ${x0 - 10} ${VH / 2})">${num(L, 1)} м</text>`;
    $('#planCap').textContent = `Плитка ${size(p)}, раскладка по прямой`;
  };
  const calc = () => {
    const W = Math.max(.5, Math.min(30, parseFloat(cW.value) || 0)), L = Math.max(.5, Math.min(30, parseFloat(cL.value) || 0));
    const res = +cRes.value; $('#cResOut').textContent = res + '%';
    const p = byId(cProd.value);
    const area = W * L, withRes = area * (1 + res / 100);
    const up = x => Math.ceil(+x.toFixed(6));
    const pcs = up(withRes / (p.w * p.h / 1e6)), boxes = up(withRes / p.pack), sum = boxes * p.pack * p.price;
    calcBoxes = boxes;
    animNum($('#rArea'), area, v => num(v) + ' м²');
    animNum($('#rAreaRes'), withRes, v => num(v) + ' м²');
    animNum($('#rPcs'), pcs, v => Math.round(v).toLocaleString('ru-RU'));
    animNum($('#rBox'), boxes, v => Math.round(v).toLocaleString('ru-RU'));
    animNum($('#rSum'), sum, v => rub(v));
    drawPlan(W, L, p);
  };
  [cW, cL, cRes, cProd].forEach(el => el.addEventListener('input', calc));
  $('#cAdd').addEventListener('click', () => { add(cProd.value, calcBoxes); toast(`Добавлено упаковок: ${calcBoxes}`); });
  calc();

  /* ---------- header / menu ---------- */
  const burger = $('#burger'), nav = $('#nav');
  function closeMenu() { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  burger.addEventListener('click', () => { const o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
  nav.addEventListener('click', e => e.target.closest('a') && closeMenu());

  /* ---------- form ---------- */
  const form = $('#form'), phone = form.elements.phone;
  phone.addEventListener('input', () => {
    let d = phone.value.replace(/\D/g, '');
    if (d[0] === '8') d = '7' + d.slice(1);
    if (d && d[0] !== '7') d = '7' + d;
    d = d.slice(0, 11);
    phone.value = d ? ['+7', d.slice(1, 4) && ' (' + d.slice(1, 4), d.length > 4 ? ') ' + d.slice(4, 7) : '', d.length > 7 ? '-' + d.slice(7, 9) : '', d.length > 9 ? '-' + d.slice(9, 11) : ''].join('') : '';
  });
  form.addEventListener('submit', e => {
    e.preventDefault(); let ok = true;
    [form.elements.name, phone].forEach(f => {
      const bad = f === phone ? phone.value.replace(/\D/g, '').length < 11 : !f.value.trim();
      f.classList.toggle('err', bad); if (bad && ok) f.focus(); if (bad) ok = false;
    });
    if (!ok) return;
    $('#formOk').hidden = false; form.reset();
  });
  form.addEventListener('input', e => e.target.classList.remove('err'));

  /* ---------- reveal + counters ---------- */
  $$('.reveal').forEach((el, i) => el.style.setProperty('--d', (i % 4) * 0.07 + 's'));
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
