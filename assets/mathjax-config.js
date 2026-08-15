window.MathJax = {
  tex: {
    inlineMath: [['\\(', '\\)']],
    displayMath: [['\\[', '\\]']]
  },
  svg: {
    fontCache: 'global'
  },
  options: {
    enableMenu: false
  }
};

(() => {
  const MAX_SCALE = 2.4;
  const MIN_SCALE = 1.35;

  const closeZoom = () => {
    document.querySelector('.math-zoom-overlay')?.remove();
    document.body.classList.remove('math-zoom-open');
  };

  const openZoom = container => {
    closeZoom();

    const overlay = document.createElement('div');
    overlay.className = 'math-zoom-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Enlarged mathematical expression');

    const panel = document.createElement('div');
    panel.className = 'math-zoom-panel';

    const clone = container.cloneNode(true);
    clone.classList.add('math-zoom-expression');
    clone.removeAttribute('tabindex');

    const rect = container.getBoundingClientRect();
    const widthScale = rect.width > 0 ? (window.innerWidth * 0.82) / rect.width : MAX_SCALE;
    const heightScale = rect.height > 0 ? (window.innerHeight * 0.55) / rect.height : MAX_SCALE;
    const scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, widthScale, heightScale));
    clone.style.fontSize = `${scale}em`;

    panel.appendChild(clone);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    document.body.classList.add('math-zoom-open');
    overlay.focus({preventScroll:true});
  };

  document.addEventListener('click', event => {
    const overlay = event.target.closest('.math-zoom-overlay');
    if (overlay) {
      if (!event.target.closest('.math-zoom-panel') || event.target.closest('.math-zoom-expression')) closeZoom();
      return;
    }

    const math = event.target.closest('mjx-container');
    if (!math) return;
    event.preventDefault();
    openZoom(math);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeZoom();
      return;
    }
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('mjx-container')) {
      event.preventDefault();
      openZoom(event.target);
    }
  });

  const makeMathFocusable = root => {
    root.querySelectorAll?.('mjx-container').forEach(math => {
      if (!math.hasAttribute('tabindex')) math.setAttribute('tabindex', '0');
      math.setAttribute('title', 'Click to enlarge');
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    makeMathFocusable(document);
    new MutationObserver(records => {
      records.forEach(record => record.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        if (node.matches?.('mjx-container')) makeMathFocusable(node.parentElement || document);
        else makeMathFocusable(node);
      }));
    }).observe(document.body, {childList:true, subtree:true});
  });
})();
