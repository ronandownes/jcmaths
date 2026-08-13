(() => {
  const shell = document.querySelector('[data-site-nav]');
  if (!shell) return;

  const script = document.currentScript || [...document.scripts].find(s => /site-nav\.js(?:\?|$)/.test(s.src));
  const root = script ? new URL('../', script.src) : new URL('./', location.href);
  const url = path => new URL(path, root).href;
  const spec = 'https://ronandownes.github.io/jcmathsspec/sections/';

  const area = shell.dataset.area || '';
  const active = name => area === name ? ' active' : '';

  shell.innerHTML = `
    <div class="site-shell-inner">
      <a class="site-brand" href="${url('index.html')}" aria-label="JC Maths home">
        <span class="site-logo" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        <span>JC Maths</span>
      </a>
      <div class="site-nav-wrap">
        <div class="site-nav-scroller">
          <nav class="site-nav" aria-label="Main mathematics navigation">
            <div class="site-navitem${active('unifying')}">
              <a class="site-navlink" href="${url('index.html#unifying')}"><span>Unifying</span></a>
            </div>
            <div class="site-navitem${active('number')}">
              <a class="site-navlink" href="${url('index.html#number')}"><span>Number</span></a>
            </div>
            <div class="site-navitem${active('algebra')}">
              <a class="site-navlink" href="${url('algebra/simplify-expressions/')}"><span>Algebra</span></a>
              <details class="site-navmenu">
                <summary aria-label="Open Algebra menu">▾</summary>
                <div class="site-dropdown">
                  <a href="${url('algebra/')}">Algebra overview</a>
                  <span class="drop-label">Sequence</span>
                  <a href="${url('algebra/simplify-expressions/')}">1 · Simplify Expressions</a>
                </div>
              </details>
            </div>
            <div class="site-navitem${active('functions')}">
              <a class="site-navlink" href="${url('index.html#functions')}"><span>Functions</span></a>
            </div>
            <div class="site-navitem${active('geometry')}">
              <a class="site-navlink" href="${url('geometry/player/?lesson=terms')}"><span>Geometry</span></a>
              <details class="site-navmenu">
                <summary aria-label="Open Geometry menu">▾</summary>
                <div class="site-dropdown">
                  <a href="${url('geometry/')}">Geometry overview</a>
                  <span class="drop-label">Sequence</span>
                  <a href="${url('geometry/player/?lesson=terms')}">1 · Terms</a>
                  <a href="${url('geometry/player/?lesson=notation')}">2 · Points &amp; Lines</a>
                  <a href="${url('geometry/player/?lesson=axiom')}">3 · Two Points</a>
                  <a href="${url('geometry/player/?lesson=parts')}">4 · Parts of an Angle</a>
                  <a href="${url('geometry/player/?lesson=angles')}">5 · Exploring Angles</a>
                  <a href="${url('geometry/player/?lesson=theorem')}">6 · Vertically Opposite</a>
                </div>
              </details>
            </div>
            <div class="site-navitem${active('trigonometry')}">
              <a class="site-navlink" href="${url('index.html#trigonometry')}"><span>Trigono-<br>metry</span></a>
            </div>
            <div class="site-navitem${active('statistics')}">
              <a class="site-navlink" href="${url('index.html#statistics')}"><span>Statistics</span></a>
            </div>
            <div class="site-navitem${active('probability')}">
              <a class="site-navlink" href="${url('index.html#probability')}"><span>Probability</span></a>
            </div>
            <div class="site-navitem reference${active('specification')}">
              <a class="site-navlink site-reference-link" href="${spec}overview.html"><span>Specifi-<br>cation</span></a>
              <details class="site-navmenu">
                <summary aria-label="Open specification menu">▾</summary>
                <div class="site-dropdown">
                  <span class="drop-label">Preamble</span>
                  <a href="${spec}overview.html#introduction-01">Introduction</a>
                  <a href="${spec}overview.html#rationale-01">Rationale</a>
                  <a href="${spec}overview.html#aim-01">Aim</a>
                  <a href="${spec}overview.html#proficiency-conceptual">Mathematical proficiency</a>
                  <a href="${spec}overview.html#course-structure">Course structure</a>
                  <span class="drop-label">Reference</span>
                  <a href="${spec}unifying.html#unifying-overview">Unifying learning outcomes</a>
                  <a href="${spec}assessment-reporting.html#assessment-overview">Assessment &amp; Reporting</a>
                </div>
              </details>
            </div>
          </nav>
        </div>
      </div>
    </div>`;

  const details = [...shell.querySelectorAll('details.site-navmenu')];
  details.forEach(item => item.addEventListener('toggle', () => {
    if (!item.open) return;
    details.forEach(other => { if (other !== item) other.open = false; });
  }));

  document.addEventListener('click', e => {
    if (!shell.contains(e.target)) details.forEach(item => item.open = false);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') details.forEach(item => item.open = false);
  });
})();
