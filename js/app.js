(() => {
  const data = window.CARMEN || {};
  const text = (selector, value) => { if (typeof value === 'string') document.querySelectorAll(selector).forEach(el => { el.textContent = value; }); };
  const make = (tag, cls, value) => { const el = document.createElement(tag); if (cls) el.className = cls; if (value) el.textContent = value; return el; };
  const mediaPath = src => typeof src === 'string' && /^assets\/[^<>]+$/i.test(src) && !src.includes('..');
  const iconNames = new Set(['i-box','i-cycle','i-spark','i-check','i-link','i-heart','i-team','i-leaf','i-rise','i-diagonal']);
  const icon = (name, cls = '') => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', `icon ${cls}`.trim()); svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', `#${iconNames.has(name) ? name : 'i-box'}`); svg.append(use); return svg;
  };
  text('#year', String(new Date().getFullYear()));
  text('[data-introduccion]', data.introduccion);
  const purpose = data.proposito || {};
  text('[data-mision]', purpose.mision); text('[data-mision-compromiso]', purpose.misionCompromiso);
  text('[data-vision]', purpose.vision); text('[data-vision-futuro]', purpose.visionFuturo);
  if (mediaPath(data.identidad?.logo)) document.querySelectorAll('.brand-logo,.closing-logo').forEach(img => { img.src = data.identidad.logo; });
  if (mediaPath(data.identidad?.logoCuadrado)) document.querySelector('.hero-emblem').src = data.identidad.logoCuadrado;
  if (Array.isArray(data.servicios) && data.servicios.length) {
    document.querySelector('#servicios-lista').replaceChildren(...data.servicios.map(item => {
      const row = make('article', 'service-row reveal');
      const link = make('a'); link.href = '#contacto'; link.setAttribute('aria-label', `Consultar sobre ${item.titulo}`); link.append(icon('i-diagonal'));
      row.append(icon(item.icono, 'service-icon'), make('h3', '', item.titulo), make('p', '', item.descripcion), link); return row;
    }));
  }
  if (Array.isArray(data.valores) && data.valores.length) {
    document.querySelector('#valores-lista').replaceChildren(...data.valores.map(item => {
      const article = make('article', 'value reveal'); article.append(icon(item.icono), make('h3', '', item.titulo), make('p', '', item.descripcion)); return article;
    }));
  }
  const contact = data.contacto || {};
  if (/^\d{10,15}$/.test(contact.whatsapp)) {
    const url = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(contact.mensaje || 'Hola, quiero información sobre empaques de cartón.')}`;
    document.querySelectorAll('[data-whatsapp]').forEach(link => { link.href = url; });
  }
  text('[data-telefono]', contact.telefonoVisible);
  text('[data-direccion]', contact.direccion);
  if (contact.direccion) document.querySelector('[data-mapa]').href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.direccion)}`;
  const projects = (data.proyectos || []).filter(item => mediaPath(item.imagen));
  if (projects.length) {
    document.querySelector('#proyectos-lista').replaceChildren(...projects.map(item => {
      const article = make('article', 'project-item reveal'); const img = make('img');
      img.src = item.imagen; img.alt = item.titulo || 'Empaque de cartón'; img.loading = 'lazy'; img.width = 800; img.height = 600;
      article.append(img, make('h3', '', item.titulo), make('p', '', item.detalle)); return article;
    }));
    document.querySelector('#proyectos').hidden = false;
  }
  if (mediaPath(data.video?.src)) {
    const video = make('video'); video.controls = true; video.playsInline = true; video.preload = 'none'; video.src = data.video.src;
    if (mediaPath(data.video.poster)) video.poster = data.video.poster;
    video.setAttribute('aria-label', data.video.titulo || 'Impresos el Carmen');
    document.querySelector('#film-cover').replaceChildren(video);
    text('[data-video-titulo]', data.video.titulo); text('[data-video-descripcion]', data.video.descripcion);
    document.querySelector('#video-bloque').hidden = false;
  }
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.header');
  const toggle = document.querySelector('.menu-toggle'); const nav = document.querySelector('#navegacion');
  const navLinks = [...nav.querySelectorAll('a')];
  const menuLabel = toggle.querySelector('.menu-label');
  const closeMenu = () => { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); menuLabel.textContent = 'Explorar'; };
  toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); menuLabel.textContent = open ? 'Cerrar' : 'Explorar'; });
  navLinks.forEach((link, i) => {
    link.style.setProperty('--menu-delay', `${i * 45}ms`);
    link.addEventListener('click', () => {
      closeMenu();
      const section = document.querySelector(link.getAttribute('href'));
      section.setAttribute('tabindex', '-1'); section.focus({ preventScroll: true });
    });
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); toggle.focus(); } });
  document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
  window.matchMedia('(min-width:1001px)').addEventListener('change', closeMenu);
  document.querySelectorAll('.footer-top,.footer-bottom').forEach(el => el.classList.add('reveal'));
  const staggerValues = () => document.querySelectorAll('.value').forEach((el, i) => { el.style.setProperty('--reveal-delay', `${(i % (innerWidth > 1100 ? 4 : 2)) * 75}ms`); });
  staggerValues();
  if (!motion.matches && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-motion');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .06 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    motion.addEventListener('change', () => { if (motion.matches) { document.documentElement.classList.remove('js-motion'); observer.disconnect(); } });
  }
  const sections = ['inicio','esencia','servicios','valores','contacto'].map(id => document.getElementById(id));
  const headerContact = document.querySelector('.header-contact');
  const material = document.querySelector('.material-image');
  let activeId = '', scheduled = false;
  const updateTab = () => {
    const selected = navLinks.find(link => link.getAttribute('href') === `#${activeId}`);
    navLinks.forEach(link => { if (link === selected) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
    if (activeId === 'contacto') headerContact.setAttribute('aria-current', 'location'); else headerContact.removeAttribute('aria-current');
    nav.style.setProperty('--tab-opacity', selected?.offsetWidth && innerWidth > 1000 ? '1' : '0');
    if (selected?.offsetWidth) { nav.style.setProperty('--tab-left', `${selected.offsetLeft}px`); nav.style.setProperty('--tab-width', `${selected.offsetWidth}px`); }
  };
  const updateProgress = () => {
    const available = document.documentElement.scrollHeight - innerHeight;
    document.querySelector('.reading-progress').style.transform = `scaleX(${available > 0 ? Math.min(1, scrollY / available) : 0})`;
    header.classList.toggle('is-scrolled', scrollY > 20);
    let current = 'inicio';
    sections.forEach(section => { if (section.getBoundingClientRect().top <= header.offsetHeight + innerHeight * .23) current = section.id; });
    if (scrollY >= available - 8) current = 'contacto';
    if (current !== activeId) { activeId = current; updateTab(); }
    if (!motion.matches && innerWidth > 760) {
      const rect = material.getBoundingClientRect();
      if (rect.top < innerHeight && rect.bottom > 0) material.style.setProperty('--material-offset', `${Math.max(-14, Math.min(14, (rect.top - innerHeight * .3) * -.025))}px`);
    }
    scheduled = false;
  };
  const scheduleUpdate = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateProgress); } };
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', () => { staggerValues(); updateTab(); scheduleUpdate(); }, { passive: true });
  window.addEventListener('hashchange', scheduleUpdate);
  document.fonts.ready.then(() => { updateTab(); scheduleUpdate(); });
  window.addEventListener('load', scheduleUpdate);
  updateProgress();
  document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('pointermove', event => {
      if (motion.matches || event.pointerType !== 'mouse' || innerWidth < 1001) return;
      const rect = button.getBoundingClientRect();
      button.style.setProperty('--mag-x', `${((event.clientX - rect.left) / rect.width - .5) * 6}px`);
      button.style.setProperty('--mag-y', `${((event.clientY - rect.top) / rect.height - .5) * 5}px`);
    });
    button.addEventListener('pointerleave', () => { button.style.removeProperty('--mag-x'); button.style.removeProperty('--mag-y'); });
    button.addEventListener('blur', () => { button.style.removeProperty('--mag-x'); button.style.removeProperty('--mag-y'); });
  });
  const scene = document.querySelector('.product-scene'); const visual = document.querySelector('.hero-visual');
  visual.addEventListener('pointermove', event => {
    if (motion.matches || event.pointerType !== 'mouse') return;
    const rect = visual.getBoundingClientRect(); const x = (event.clientX - rect.left) / rect.width - .5; const y = (event.clientY - rect.top) / rect.height - .5;
    scene.style.setProperty('--px', `${x * 7}px`); scene.style.setProperty('--py', `${y * 7}px`); scene.style.setProperty('--rotate', `${x * .7}deg`);
  });
  visual.addEventListener('pointerleave', () => { ['--px','--py','--rotate'].forEach(key => scene.style.removeProperty(key)); });
})();
