(() => {
  const host = document.getElementById('appendixGeometrySource');
  const appsHost = document.getElementById('geometryApps');
  if (!host) return;

  const slug = text => text.toLowerCase().trim().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

  if (appsHost && window.renderGeometryAppLinks) {
    window.renderGeometryAppLinks(appsHost);
  }

  fetch('../specification/appendix-b.html', { cache:'no-store' })
    .then(r => { if (!r.ok) throw new Error('Appendix B unavailable'); return r.text(); })
    .then(html => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const papers = [...doc.querySelectorAll('main .spec-paper')];
      host.innerHTML = '';
      papers.forEach((paper, index) => {
        const clone = paper.cloneNode(true);
        clone.classList.add('geometry-source-paper');
        clone.querySelectorAll('h2').forEach(h => { if (!h.id) h.id = slug(h.textContent); });
        if (index === 0) {
          const note = document.createElement('p');
          note.className = 'geometry-source-note';
          note.textContent = 'Formal geometry content below is rendered directly from Appendix B. Edit Appendix B once; Geometry updates from the same source.';
          clone.insertBefore(note, clone.firstChild?.nextSibling || clone.firstChild);
        }
        host.appendChild(clone);
      });
      if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([host]);
    })
    .catch(() => {
      host.innerHTML = '<article class="doc-paper"><h2>Appendix B</h2><p>The canonical Appendix B content could not be loaded on this visit.</p><p><a href="../specification/appendix-b.html">Open Appendix B directly →</a></p></article>';
    });
})();
