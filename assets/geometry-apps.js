(() => {
  const apps = [
    { key:'terms', title:'Terms', match:['the theory'], href:'geometry/player/?lesson=terms', copy:'Interactive geometry language and foundational terms.' },
    { key:'notation', title:'Points & Lines', match:['the theory','definition 1'], href:'geometry/player/?lesson=notation', copy:'Points, lines, notation and the plane as a set of points.' },
    { key:'axiom', title:'Two Points — Axiom 1', match:['axiom 1'], href:'geometry/player/?lesson=axiom', copy:'Explore the Two Points Axiom interactively.' },
    { key:'parts', title:'Parts of an Angle', match:['angle'], href:'geometry/player/?lesson=parts', copy:'Vertex, arms, inside and angle notation.' },
    { key:'angles', title:'Exploring Angles', match:['angle'], href:'geometry/player/?lesson=angles', copy:'Explore angle types and relationships visually.' },
    { key:'theorem', title:'Vertically Opposite Angles — Theorem 1', match:['theorem 1','vertically opposite'], href:'geometry/player/?lesson=theorem', copy:'Explore Theorem 1 through an interactive construction.' }
  ];

  window.JCGeometryApps = apps;

  const rootFromScript = () => {
    const script = [...document.scripts].find(s => /geometry-apps\.js(?:\?|$)/.test(s.src));
    return script ? new URL('../', script.src) : new URL('../', location.href);
  };

  window.renderGeometryAppLinks = (container = document, options = {}) => {
    const root = rootFromScript();
    const cards = document.createElement('section');
    cards.className = 'geometry-apps-panel';
    cards.innerHTML = '<h2 id="interactive-geometry-apps">Interactive Geometry Apps</h2><p class="geometry-apps-intro">These are the interactive teaching activities currently built. They enrich the Appendix B material; they do not duplicate or replace its formal text.</p><div class="geometry-app-grid"></div>';
    const grid = cards.querySelector('.geometry-app-grid');
    apps.forEach((app, i) => {
      const a = document.createElement('a');
      a.className = 'geometry-app-card';
      a.href = new URL(app.href, root).href;
      a.innerHTML = `<span class="geometry-app-step">${i+1}</span><span><strong>${app.title}</strong><small>${app.copy}</small></span><span class="geometry-app-open">Open →</span>`;
      grid.appendChild(a);
    });
    if (options.prepend) container.prepend(cards); else container.appendChild(cards);
    return cards;
  };

  if (/\/specification\/appendix-b\.html$/.test(location.pathname)) {
    const main = document.querySelector('main');
    if (main && !main.querySelector('.geometry-apps-panel')) {
      window.renderGeometryAppLinks(main, { prepend:false });
    }
  }
})();
