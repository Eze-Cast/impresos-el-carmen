(() => {
  const data = window.CARMEN || {};
  if (data.titular?.length === 3) document.querySelectorAll('h1 .line>span').forEach((el, i) => { el.textContent = data.titular[i]; });
  if (data.introduccion) document.querySelector('[data-introduccion]').textContent = data.introduccion;
  document.querySelector('#year').textContent = new Date().getFullYear();
  const make = (tag, cls, text) => { const el = document.createElement(tag); if (cls) el.className = cls; if (text) el.textContent = text; return el; };
  // Keep supplied content as text and allow only project-relative paths for media.
  const mediaPath = src => typeof src === 'string' && /^(?:assets\/)[^<>]+$/i.test(src) && !src.includes('..');
  if (mediaPath(data.identidad?.logo)) document.querySelectorAll('.brand-logo').forEach(img => { img.src = data.identidad.logo; });
  if (mediaPath(data.identidad?.logoClaro)) document.querySelector('.closing-logo').src = data.identidad.logoClaro;
  if (Array.isArray(data.servicios) && data.servicios.length) {
    data.servicios.forEach((item, i) => {
      const row = make('article', 'service-row reveal');
      row.append(make('span', 'small-index', String(i + 1).padStart(2, '0')), make('h3', '', item.titulo), make('p', '', item.descripcion));
      document.querySelector('#servicios-lista').append(row);
    });
  }
  const projects = (data.proyectos || []).filter(item => mediaPath(item.imagen));
  if (projects.length) {
    document.querySelector('#imagen-material').hidden = true;
    projects.forEach(item => {
      const article = make('article', 'project-item reveal');
      const img = make('img'); img.src = item.imagen; img.alt = item.titulo; img.loading = 'lazy'; img.width = 800; img.height = 600;
      article.append(img, make('h3', '', item.titulo), make('p', '', item.detalle));
      document.querySelector('#proyectos-lista').append(article);
    });
  }
  if (data.video?.titulo) document.querySelector('[data-video-titulo]').textContent = data.video.titulo;
  if (data.video?.descripcion) document.querySelector('[data-video-descripcion]').textContent = data.video.descripcion;
  if (mediaPath(data.video?.src)) {
    const video = make('video'); video.controls = true; video.playsInline = true; video.preload = 'none'; video.src = data.video.src;
    if (mediaPath(data.video.poster)) video.poster = data.video.poster;
    video.setAttribute('aria-label', data.video.titulo || 'Video de Impresos el Carmen');
    document.querySelector('#film-cover').replaceChildren(video);
    document.querySelector('#video-bloque').hidden = false;
  }
  const contact = data.contacto || {};
  const links = make('div', 'contact-links');
  const addLink = (title, href) => { const link = make('a', '', title); link.href = href; links.append(link); };
  if (/^\d{10,15}$/.test(contact.whatsapp)) addLink('Cuéntanos tu proyecto por WhatsApp', `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent('Hola, quiero información sobre la fabricación de empaques de cartón.')}`);
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) addLink(contact.email, `mailto:${contact.email}`);
  if (contact.telefono && /^[+\d\s()-]+$/.test(contact.telefono)) addLink(contact.telefono, `tel:${contact.telefono.replace(/[^+\d]/g, '')}`);
  if (contact.direccion) links.append(make('p', '', contact.direccion));
  if (links.children.length) {
    document.querySelector('#contacto-enlaces').append(links);
    document.querySelector('#contacto').hidden = false;
    document.querySelector('[data-contact-nav]').hidden = false;
  }
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#navegacion');
  const closeMenu = () => { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); };
  toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeMenu(); toggle.focus(); } });
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!motion.matches && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-motion');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
  let scheduled = false;
  const updateProgress = () => {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    document.querySelector('.reading-progress').style.transform = `scaleX(${available > 0 ? Math.min(1, window.scrollY / available) : 0})`;
    scheduled = false;
  };
  window.addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateProgress); } }, { passive: true });
  updateProgress();
  const scene = document.querySelector('.product-scene');
  const visual = document.querySelector('.hero-visual');
  visual.addEventListener('pointermove', event => {
    if (motion.matches || event.pointerType !== 'mouse') return;
    const rect = visual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    scene.style.setProperty('--px', `${x * 12}px`); scene.style.setProperty('--py', `${y * 10}px`); scene.style.setProperty('--rotate', `${x * .9}deg`);
  });
  visual.addEventListener('pointerleave', () => { ['--px', '--py', '--rotate'].forEach(key => scene.style.removeProperty(key)); });
})();
