/* Ernesto Investing AI - base S13 (adaptada del sistema del Equipo A, Semana 4). Material educativo; datos SINTETICOS. */
const PAGES=[
 ["index.html","Dashboard","dashboard"],["watchlist.html","Watchlist y alertas","watchlist"],["trading.html","Trading simulado","trading"],["leaderboard.html","Leaderboard","leaderboard"],
 ["clasificacion.html","Clasificación","clasificacion",1],["regresion.html","Regresión 30 días","regresion",1],["optimizador.html","Optimizador","optimizador",1],["portafolios.html","Portafolios","portafolios",1],["backtesting.html","Backtesting","backtesting",1]];
const $=(s,r=document)=>r.querySelector(s);
const fmt={n:(x,d=2)=>Number(x).toLocaleString("es-PE",{minimumFractionDigits:d,maximumFractionDigits:d}),
  pct:(x,d=2)=>(x>=0?"+":"")+Number(x).toLocaleString("es-PE",{minimumFractionDigits:d,maximumFractionDigits:d})+" %",
  usd:x=>"US$ "+Number(x).toLocaleString("es-PE",{minimumFractionDigits:2,maximumFractionDigits:2}),
  cls:x=>x>0?"up":(x<0?"dn":"mut")};
const cache={};
async function loadJSON(name){ if(cache[name]) return cache[name];
  const r=await fetch("data/"+name); if(!r.ok) throw new Error("No se pudo leer data/"+name+" ("+r.status+")"); return cache[name]=await r.json(); }
function store(k,v){ try{ if(v===undefined){const s=localStorage.getItem(k);return s?JSON.parse(s):null} localStorage.setItem(k,JSON.stringify(v)) }catch(e){ return null } }
function applyTheme(t){ if(t) document.documentElement.setAttribute("data-theme",t); }
async function listaPersonal() {
  return store('eia_watch') ?? (await loadJSON('11_watchlist_alertas_portafolio_demo.json')).watchlist_inicial;
}
function conectarFiltroActivos(selector, filtro, activos, watch, cambio) {
  function actualizar() {
    const anterior = selector.value || store('eia_activo');
    const visibles = filtro.checked ? activos.filter(t => watch.includes(t)) : activos;
    selector.replaceChildren(...visibles.map(t => new Option(t, t)));
    if (visibles.includes(anterior)) selector.value = anterior;
    cambio();
  }
  if (!watch.length) {
    filtro.disabled = true;
    filtro.closest('label').append(' (lista vacía)');
  }
  filtro.addEventListener('change', actualizar);
  selector.addEventListener('change', cambio);
  actualizar();
}
function buildShell(){
  applyTheme(store("eia_theme"));
  const page=document.body.dataset.page, current=PAGES.find(p=>p[2]===page), currentLabel=current?current[1]:"Inicio";
  const iconPaths={dashboard:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',watchlist:'<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/>',trading:'<path d="m7 7-4 4 4 4M3 11h12M17 17l4-4-4-4M21 13H9"/>',leaderboard:'<path d="M8 4h8v5a4 4 0 0 1-8 0V4ZM10 17h4M12 13v4M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4M7 20h10"/>',clasificacion:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16M15 4v16"/>',regresion:'<path d="M3 20V4M3 20h18M6 16l4-5 3 2 6-7"/>',optimizador:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/><path d="m15 9 6-6M17 3h4v4"/>',portafolios:'<path d="M11 3a9 9 0 1 0 9 10h-9V3ZM15 3.9A9 9 0 0 1 20.1 9H15V3.9Z"/>',backtesting:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2"/>'};
  const svg=id=>`<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${iconPaths[id]||''}</svg>`;
  const nav=PAGES.map(p=>`<li><a href="${p[0]}" ${p[2]===page?'aria-current="page"':''}>${svg(p[2])}<span>${p[1]}</span></a></li>`).join("");
  document.body.insertAdjacentHTML("afterbegin",`<a class="skip" href="#contenido">Saltar al contenido</a><header class="top"><div class="bar"><a class="brand" href="index.html"><span class="brand-mark">E</span><span class="brand-name"><strong>Ernesto</strong><small>INVESTING AI</small></span></a><button class="menu-close" id="menu-close" type="button" aria-label="Cerrar menú">✕</button><nav id="navegacion" aria-label="Módulos del sistema"><ul>${nav}</ul></nav><div class="sidebar-foot"><div class="academic"><strong>ⓘ &nbsp; Modo académico</strong><small>Entorno de aprendizaje</small></div><button id="tema" type="button" aria-pressed="false" title="Cambiar tema claro/oscuro">◐ &nbsp; Cambiar tema <span aria-hidden="true">◉</span></button></div></div></header><button class="nav-scrim" id="nav-scrim" type="button" aria-label="Cerrar menú" hidden></button><div class="topbar"><button class="menu-open" id="menu-open" aria-label="Abrir menú" aria-controls="navegacion" aria-expanded="false" type="button">☰</button><span class="mobile-brand"><b>E</b> Ernesto AI</span><span class="breadcrumb">Plataforma <span aria-hidden="true">›</span> <strong>${currentLabel}</strong></span><span class="topbar-context">Sistema educativo</span></div><div class="site-disclaimer"><span><strong>Datos sintéticos</strong> · Simulación</span></div>`);
  const sidebar=$('header.top'), open=$('#menu-open'),close=$('#menu-close'),scrim=$('#nav-scrim');
  const mobile=matchMedia('(max-width:800px)');
  const background=[$('main'),$('.topbar'),$('.site-disclaimer'),$('.skip')];
  function toggleMenu(show, restore=true){
    sidebar.classList.toggle('is-open',show);
    scrim.hidden=!show;
    open.setAttribute('aria-expanded',String(show));
    background.forEach(el=>{ if(el) el.inert=show; });
    if(show) close.focus(); else if(restore) open.focus();
  }
  open.addEventListener('click',()=>toggleMenu(true));close.addEventListener('click',()=>toggleMenu(false));scrim.addEventListener('click',()=>toggleMenu(false));
  scrim.tabIndex=-1;
  mobile.addEventListener('change',()=>{if(!mobile.matches&&sidebar.classList.contains('is-open')) toggleMenu(false,false)});
  document.addEventListener('keydown',e=>{
    if(!sidebar.classList.contains('is-open')) return;
    if(e.key==='Escape') toggleMenu(false);
    if(e.key==='Tab'){
      const items=[...sidebar.querySelectorAll('a,button')];
      const edge=e.shiftKey?items[0]:items.at(-1);
      if(document.activeElement===edge){
        e.preventDefault();
        (e.shiftKey?items.at(-1):items[0]).focus();
      }
    }
  });
  $("#tema").setAttribute("aria-pressed",String((document.documentElement.getAttribute("data-theme")||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"))==="dark"));
  $("#tema").addEventListener("click",()=>{const cur=document.documentElement.getAttribute("data-theme")||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light");const n=cur==="dark"?"light":"dark";applyTheme(n);store("eia_theme",n);$("#tema").setAttribute("aria-pressed",n==="dark");if(window.onTheme)window.onTheme(n)});
  const m=$("main");if(m){m.id="contenido";m.setAttribute("tabindex","-1");m.insertAdjacentHTML("beforeend",`<footer class="site-footer"><span>Ernesto Investing AI · Prototipo académico</span><span>Precios anclados al cierre del 11 nov. 2026 · Sin asesoría de inversión</span></footer>`)}
}
function showError(e){ const m=$("main"); m.insertAdjacentHTML("afterbegin",`<p class="err" role="alert">${e.message}. Abra el sitio desde un servidor (GitHub Pages o <code>python -m http.server</code>), no con doble clic.</p>`)}
document.addEventListener("DOMContentLoaded",()=>{
  buildShell();
  document.querySelectorAll('.tw').forEach(region=>{
    region.tabIndex=0;
    region.setAttribute('role','region');
    if(!region.hasAttribute('aria-label')) region.setAttribute('aria-label','Tabla desplazable');
  });
  if(window.init) Promise.resolve(window.init()).catch(showError);
});
