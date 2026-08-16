(() => {
  const apps = [
    { key:'terms', group:'Foundations', title:'Terms', href:'geometry/player/?lesson=terms', copy:'Interactive geometry language and foundational terms.' },
    { key:'notation', group:'Foundations', title:'Points & Lines', href:'geometry/player/?lesson=notation', copy:'Points, lines, notation and the plane as a set of points.' },
    { key:'axiom', group:'Foundations', title:'Two Points — Axiom 1', href:'geometry/player/?lesson=axiom', copy:'Explore the Two Points Axiom interactively.' },
    { key:'parts', group:'Angles', title:'Parts of an Angle', href:'geometry/player/?lesson=parts', copy:'Vertex, arms, inside and angle notation.' },
    { key:'angles', group:'Angles', title:'Exploring Angles', href:'geometry/player/?lesson=angles', copy:'Discover and classify angle types visually.' },
    { key:'theorem', group:'Angles', title:'Vertically Opposite Angles — Theorem 1', href:'geometry/player/?lesson=theorem', copy:'Explore Theorem 1 through an interactive construction.' }
  ];

  window.JCGeometryApps = apps;

  const rootFromScript = () => {
    const script = [...document.scripts].find(s => /geometry-apps\.js(?:\?|$)/.test(s.src));
    return script ? new URL('../', script.src) : new URL('../', location.href);
  };

  const makeCard = (app, index, root) => {
    const a = document.createElement('a');
    a.className = 'geometry-app-card';
    a.href = new URL(app.href, root).href;
    a.innerHTML = `<span class="geometry-app-step">${index + 1}</span><span><strong>${app.title}</strong><small>${app.copy}</small></span><span class="geometry-app-open">Open →</span>`;
    return a;
  };

  window.renderGeometryAppLinks = (container = document, options = {}) => {
    const root = rootFromScript();
    const panel = document.createElement('section');
    panel.className = 'geometry-apps-panel';
    panel.id = 'interactive-geometry-apps';
    panel.innerHTML = '<h2>Interactive Geometry Apps</h2><p class="geometry-apps-intro">Use these alongside Appendix B. Each activity opens in the shared student player and can be taken genuinely full screen.</p>';

    if (options.dropdowns) {
      const style = document.createElement('style');
      style.textContent = '.geometry-app-groups{display:grid;gap:10px}.geometry-app-group{border:1px solid #d7dde5;border-radius:10px;background:#fff;overflow:hidden}.geometry-app-group summary{cursor:pointer;padding:13px 15px;font-weight:850;font-size:1.05rem;background:#f7f9fc}.geometry-app-group[open] summary{border-bottom:1px solid #e2e6ec}.geometry-app-group .geometry-app-grid{padding:12px}';
      panel.appendChild(style);
      const groups = document.createElement('div');
      groups.className = 'geometry-app-groups';
      [...new Set(apps.map(a => a.group))].forEach(groupName => {
        const details = document.createElement('details');
        details.className = 'geometry-app-group';
        if (groupName === 'Angles') details.open = true;
        details.innerHTML = `<summary>${groupName}</summary><div class="geometry-app-grid"></div>`;
        const grid = details.querySelector('.geometry-app-grid');
        apps.filter(a => a.group === groupName).forEach(app => grid.appendChild(makeCard(app, apps.indexOf(app), root)));
        groups.appendChild(details);
      });
      panel.appendChild(groups);
    } else {
      const grid = document.createElement('div');
      grid.className = 'geometry-app-grid';
      apps.forEach((app, i) => grid.appendChild(makeCard(app, i, root)));
      panel.appendChild(grid);
    }

    if (options.prepend) container.prepend(panel); else container.appendChild(panel);
    return panel;
  };

  if (/\/specification\/appendix-b\.html$/.test(location.pathname)) {
    const main = document.querySelector('main');
    if (main && !main.querySelector('.geometry-apps-panel')) {
      const panel = window.renderGeometryAppLinks(main, { dropdowns:true });
      const openingOverview = main.querySelector('.spec-paper');
      if (openingOverview) openingOverview.after(panel);
    }
  }
})();
