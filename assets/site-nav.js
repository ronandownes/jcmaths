(() => {
  const header=document.querySelector('[data-site-nav]');
  if(!header)return;
  const script=[...document.scripts].find(s=>/site-nav\.js(?:\?|$)/.test(s.src));
  const root=script?new URL('../',script.src):new URL('./',location.href);
  const link=path=>new URL(path,root).href;
  const strands=[
    ['unifying','Unifying strand','unifying/'],
    ['number','Number strand','number/'],
    ['geometry','Geometry and trigonometry strand','geometry/'],
    ['algebra','Algebra and functions strand','algebra/'],
    ['statistics','Statistics and probability strand','statistics/']
  ];
  const active=header.dataset.area||strands.find(s=>location.pathname.startsWith(new URL(s[2],root).pathname))?.[0]||'';
  header.innerHTML='<div class="site-shell-inner">'+
    '<a class="site-brand" href="'+link('')+'" aria-label="JC Maths home"><span class="site-logo" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span>JC Maths</span></a>'+
    '<nav class="site-nav site-nav-simple" aria-label="Main navigation"><button class="strands-menu-button" type="button" aria-controls="strand-sidebar" aria-expanded="false">Strands <span aria-hidden="true">☰</span></button></nav></div>';
  const stage=document.querySelector('main.page-stage');
  if(!stage)return;
  const aside=document.createElement('aside');
  aside.className='strand-sidebar';
  aside.id='strand-sidebar';
  aside.setAttribute('aria-label','Mathematics strands');
  aside.setAttribute('inert','');
  aside.innerHTML='<div class="strand-sidebar-heading">Strands</div><nav aria-label="Choose a strand">'+
    strands.map(s=>'<a href="'+link(s[2])+'"'+(s[0]===active?' aria-current="page" class="selected"':'')+'>'+s[1]+'</a>').join('')+'</nav>'+
    (active==='geometry'?'<div class="strand-sidebar-heading">Interactive geometry</div><nav><a href="'+link('geometry/')+'#geometryApps">Geometry activities</a><a href="https://ronandownes.github.io/jcmathsspec/apps/">Original interactive apps ↗</a></nav>':'');
  stage.parentNode.insertBefore(aside,stage);
  document.body.classList.add('has-strand-sidebar');
  const button=header.querySelector('.strands-menu-button');
  const setOpen=open=>{
    document.body.classList.toggle('strands-open',open);
    button.setAttribute('aria-expanded',String(open));
    if(open)aside.removeAttribute('inert');else aside.setAttribute('inert','');
  };
  button.addEventListener('click',()=>setOpen(!document.body.classList.contains('strands-open')));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false)});
  document.addEventListener('click',e=>{
    if(document.body.classList.contains('strands-open')&&!aside.contains(e.target)&&!button.contains(e.target))setOpen(false);
  });
  if(/\/specification\/appendix-b\.html$/.test(location.pathname)){
    const s=document.createElement('script');s.src=link('assets/geometry-apps.js');s.defer=true;document.body.appendChild(s);
  }
})();
