(() => {
  const shell = document.querySelector('[data-site-nav]');
  if (!shell) return;
  const script = document.currentScript || [...document.scripts].find(s => /site-nav\.js(?:\?|$)/.test(s.src));
  const root = script ? new URL('../', script.src) : new URL('./', location.href);
  const url = path => new URL(path, root).href;
  const activeArea = shell.dataset.area || '';

  const areas = [
    ['unifying','Unifying','index.html#unifying'],
    ['number','Number','index.html#number'],
    ['algebra','Algebra','algebra/'],
    ['functions','Functions','index.html#functions'],
    ['geometry','Geometry','geometry/'],
    ['trigonometry','Trigonometry','index.html#trigonometry'],
    ['statistics','Statistics','index.html#statistics'],
    ['probability','Probability','index.html#probability']
  ];

  shell.innerHTML = `
    <div class="site-shell-inner">
      <a class="site-brand" href="${url('index.html')}" aria-label="JC Maths home">
        <span class="site-logo" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span>JC Maths</span>
      </a>
      <button class="mobile-nav-toggle" type="button" aria-controls="mainMathsNav" aria-expanded="false" aria-label="Open main navigation"><span class="mobile-nav-icon" aria-hidden="true"></span></button>
      <nav class="site-nav" id="mainMathsNav" aria-label="Main mathematics navigation">
        ${areas.map(([key,label,href]) => `<div class="site-navitem${activeArea===key?' active':''}" data-area="${key}" data-menu-source="${url(href.split('#')[0] || 'index.html')}"><a class="site-navlink" href="${url(href)}"><span>${label}</span></a><button class="site-navtoggle" type="button" data-nav-toggle aria-expanded="false" aria-label="Open ${label} menu"></button><div class="site-dropdown" aria-label="${label} topics"></div></div>`).join('')}
        <div class="site-navitem reference${activeArea==='specification'?' active':''}" data-area="specification" data-menu-source="${url('specification/')}"><a class="site-navlink" href="${url('specification/')}"><span>Specification</span></a><button class="site-navtoggle" type="button" data-nav-toggle aria-expanded="false" aria-label="Open Specification menu"></button><div class="site-dropdown" aria-label="Specification topics"></div></div>
      </nav>
    </div>`;

  const closeMenus = (except = null) => {
    shell.querySelectorAll('.site-navitem.is-open').forEach(item => {
      if (item === except) return;
      item.classList.remove('is-open');
      item.querySelector('[data-nav-toggle]')?.setAttribute('aria-expanded','false');
    });
  };
  const mobileToggle = shell.querySelector('.mobile-nav-toggle');
  const closeMobile = () => {
    shell.classList.remove('nav-open');
    mobileToggle?.setAttribute('aria-expanded','false');
    mobileToggle?.setAttribute('aria-label','Open main navigation');
    closeMenus();
  };
  mobileToggle?.addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    const open = !shell.classList.contains('nav-open');
    shell.classList.toggle('nav-open', open);
    mobileToggle.setAttribute('aria-expanded', String(open));
    mobileToggle.setAttribute('aria-label', open ? 'Close main navigation' : 'Open main navigation');
    if (!open) closeMenus();
  });

  const slug = text => text.toLowerCase().trim().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const buildMenu = async item => {
    const dropdown = item.querySelector('.site-dropdown');
    const source = item.dataset.menuSource;
    if (!dropdown || !source) return;
    try {
      let doc;
      const sourceUrl = new URL(source);
      const currentComparable = location.href.split('#')[0].replace(/index\.html$/,'');
      const sourceComparable = sourceUrl.href.split('#')[0].replace(/index\.html$/,'');
      if (currentComparable === sourceComparable) doc = document;
      else {
        const response = await fetch(sourceUrl.href, {cache:'no-store'});
        if (!response.ok) throw new Error('menu source unavailable');
        doc = new DOMParser().parseFromString(await response.text(), 'text/html');
      }
      const headings = [...doc.querySelectorAll('main h2')];
      dropdown.innerHTML = '';
      headings.forEach(h => {
        const id = h.id || slug(h.textContent);
        if (!id) return;
        if (doc === document && !h.id) h.id = id;
        const a = document.createElement('a');
        a.href = `${sourceUrl.href.split('#')[0]}#${id}`;
        a.textContent = h.textContent.trim();
        dropdown.appendChild(a);
      });
      if (!dropdown.children.length) item.classList.add('no-menu');
    } catch (_) {
      item.classList.add('no-menu');
    }
  };

  shell.querySelectorAll('.site-navitem').forEach(item => buildMenu(item));
  shell.querySelectorAll('[data-nav-toggle]').forEach(button => {
    button.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      const item = button.closest('.site-navitem');
      if (!item || item.classList.contains('no-menu')) return;
      const open = !item.classList.contains('is-open');
      closeMenus(item);
      item.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', e => { if (!shell.contains(e.target)) closeMobile(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobile(); });
  window.addEventListener('resize', () => { if (innerWidth > 1280) closeMobile(); });
})();
