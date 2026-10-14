(() => {
  const header = document.querySelector('[data-site-nav]');
  if (!header) return;
  const script = [...document.scripts].find(s => /site-nav\.js(?:\?|$)/.test(s.src));
  const root = script ? new URL('../', script.src) : new URL('./', location.href);
  const link = path => new URL(path,root).href;
  const strands = [
    ['unifying','Unifying','unifying/'],
    ['number','Number','number/'],
    ['geometry','Geometry and Trigonometry','geometry/'],
    ['algebra','Algebra and Functions','algebra/'],
    ['statistics','Statistics and Probability','statistics/']
  ];
  const active = header.dataset.area || strands.find(s => location.pathname.startsWith(new URL(s[2],root).pathname))?.[0] || '';
  header.innerHTML = '<div class="site-shell-inner">'+
    '<a class="site-brand" href="'+link('')+'"><span class="site-logo" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span>JC Maths</span></a>'+
    '<nav class="site-nav site-nav-simple" aria-label="Main navigation">'+
    '<a class="site-navlink'+(active?' active':'')+'" href="'+link('')+'">Strands</a>'+
    '<a class="site-navlink" href="'+link('specification/')+'">Specification</a></nav>'+
    '<button class="mobile-nav-toggle" type="button" aria-label="Show strands" aria-expanded="false">☰</button></div>';
  const stage=document.querySelector('main.page-stage');
  if (!stage) return;
  const aside=document.createElement('aside');
  aside.className='strand-sidebar';
  aside.id='strand-sidebar';
  aside.setAttribute('aria-label','Mathematics strands');
  aside.innerHTML='<div class="strand-sidebar-heading">Strands</div><nav aria-label="Choose a strand">'+
    strands.map(s=>'<a href="'+link(s[2])+'"'+(s[0]===active?' aria-current="page" class="selected"':'')+'>'+s[1]+'</a>').join('')+'</nav>'+
    (active==='geometry'?'<div class="strand-sidebar-heading">Interactive geometry</div><nav><a href="'+link('geometry/')+'#geometryApps">Geometry activities</a><a href="https://ronandownes.github.io/jcmathsspec/apps/">Original interactive apps ↗</a></nav>':'');
  stage.parentNode.insertBefore(aside,stage);
  document.body.classList.add('has-strand-sidebar');
  const mobile=header.querySelector('.mobile-nav-toggle');
  mobile.addEventListener('click',()=>{
    const open=document.body.classList.toggle('strands-open');
    mobile.setAttribute('aria-expanded',String(open));
    mobile.setAttribute('aria-label',open?'Hide strands':'Show strands');
  });
  aside.addEventListener('click',e=>{if(e.target.closest('a'))document.body.classList.remove('strands-open')});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')document.body.classList.remove('strands-open')});
  if (/\/specification\/appendix-b\.html$/.test(location.pathname)) {
    const s=document.createElement('script');s.src=link('assets/geometry-apps.js');s.defer=true;document.body.appendChild(s);
  }
})();
