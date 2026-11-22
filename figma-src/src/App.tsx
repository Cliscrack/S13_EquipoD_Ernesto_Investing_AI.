import { useEffect, useState } from 'react';

type Page =
  | 'dashboard'
  | 'watchlist'
  | 'trading'
  | 'leaderboard'
  | 'classification'
  | 'regression'
  | 'optimizer'
  | 'portfolios'
  | 'backtesting';

const NAV: { id: Page; label: string; short: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', short: 'Inicio', icon: 'grid' },
  { id: 'watchlist', label: 'Watchlist y alertas', short: 'Watchlist', icon: 'eye' },
  { id: 'trading', label: 'Trading simulado', short: 'Trading', icon: 'swap' },
  { id: 'leaderboard', label: 'Leaderboard', short: 'Ranking', icon: 'trophy' },
  { id: 'classification', label: 'Clasificación', short: 'Clasif.', icon: 'heat' },
  { id: 'regression', label: 'Regresión · 30 sesiones', short: 'Regresión', icon: 'chart' },
  { id: 'optimizer', label: 'Optimizador', short: 'Optimiza', icon: 'target' },
  { id: 'portfolios', label: 'Portafolios', short: 'Portafolios', icon: 'pie' },
  { id: 'backtesting', label: 'Backtesting', short: 'Backtest', icon: 'history' },
];

const PALETTE = ['#0B4F9C', '#0A7D3C', '#8B5CF6', '#E68A00', '#B3261E'];

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></>,
    swap: <><path d="m7 7-4 4 4 4M3 11h12M17 17l4-4-4-4M21 13H9"/></>,
    trophy: <><path d="M8 4h8v5a4 4 0 0 1-8 0V4ZM10 17h4M12 13v4M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4M7 20h10"/></>,
    heat: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16M15 4v16"/><path d="M10.5 7h3M16.5 13h3M4.5 17h3"/></>,
    chart: <><path d="M3 20V4M3 20h18"/><path d="m6 16 4-5 3 2 6-7"/></>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/><path d="m15 9 6-6M17 3h4v4"/></>,
    pie: <><path d="M11 3a9 9 0 1 0 9 10h-9V3Z"/><path d="M15 3.9A9 9 0 0 1 20.1 9H15V3.9Z"/></>,
    history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></>,
    moon: <path d="M20 15.2A8.5 8.5 0 0 1 8.8 4a8.5 8.5 0 1 0 11.2 11.2Z"/>,
    sun: <><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function Badge({ tone = 'neutral', children }: { tone?: 'up' | 'down' | 'neutral' | 'blue'; children: React.ReactNode }) {
  return <span className={`badge ${tone}`}>{tone === 'up' ? '▲ ' : tone === 'down' ? '▼ ' : ''}{children}</span>;
}

function Card({ title, aside, children, className = '' }: { title?: string; aside?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return <section className={`card ${className}`}>{title && <div className="card-head"><h2>{title}</h2>{aside}</div>}{children}</section>;
}

function Metric({ label, value, delta, tone = 'neutral' }: { label: string; value: string; delta?: string; tone?: 'up' | 'down' | 'neutral' }) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong>{delta && <small className={tone}>{tone === 'up' ? '▲' : tone === 'down' ? '▼' : '•'} {delta}</small>}</div>;
}

function LineChart({ variant = 'single', height = 220, axisLabels = ['Inicio','Tramo medio','Fin'] }: { variant?: 'single' | 'multi' | 'capital' | 'drawdown'; height?: number; axisLabels?:string[] }) {
  const isMulti = variant === 'multi';
  return (
    <div className="chart-wrap" role="img" aria-label={variant === 'drawdown' ? 'Gráfico de drawdown sintético' : 'Gráfico de líneas con datos sintéticos'}>
      <svg viewBox="0 0 700 230" style={{ height }} preserveAspectRatio="none">
        {[35, 80, 125, 170, 215].map(y => <line key={y} x1="42" x2="690" y1={y} y2={y} className="grid-line"/>)}
        {[42, 170, 300, 430, 560, 690].map(x => <line key={x} x1={x} x2={x} y1="20" y2="215" className="grid-line vertical"/>)}
        {variant === 'multi' && <path d="M400 101 C460 76 530 55 690 35 L690 177 C550 154 470 126 400 101Z" fill="rgba(11,79,156,.10)"/>}
        {variant === 'drawdown' ? <>
          <path d="M42 36 L100 52 L145 41 L200 82 L250 59 L300 133 L345 91 L400 72 L450 153 L510 112 L560 168 L620 89 L690 72 L690 36Z" fill="rgba(179,38,30,.16)"/>
          <path d="M42 36 L100 52 L145 41 L200 82 L250 59 L300 133 L345 91 L400 72 L450 153 L510 112 L560 168 L620 89 L690 72" className="line red"/>
        </> : <>
          <path d="M42 185 C100 177 115 160 170 168 S245 130 300 140 S365 98 420 110 S500 78 550 90 S620 51 690 58" className="line blue"/>
          {variant === 'capital' && <path d="M42 190 C100 180 150 182 200 163 S285 154 330 130 S415 138 460 109 S560 100 610 80 S660 78 690 70" className="line muted-line"/>}
          {isMulti && <>
            <path d="M42 190 C120 170 180 174 250 140 S360 120 420 101 S540 63 690 76" className="line green"/>
            <path d="M42 181 C110 188 170 151 235 157 S350 110 410 120 S530 93 690 42" className="line purple"/>
            <path d="M400 105 C500 91 570 81 690 68" className="line median" strokeDasharray="7 5"/>
          </>}
        </>}
      </svg>
      <div className="axis-labels">{axisLabels.map(label=><span key={label}>{label}</span>)}</div>
    </div>
  );
}

function CandlestickChart() {
  return <div className="chart-wrap" role="img" aria-label="Estructura del gráfico de velas de 120 sesiones; precios pendientes de datos"><svg viewBox="0 0 700 230" style={{height:220}} preserveAspectRatio="none">{[35,80,125,170,215].map(y=><line key={y} x1="42" x2="690" y1={y} y2={y} className="grid-line"/>)}{Array.from({length:18},(_,index)=>{const x=62+index*34,up=index%3!==0,y=55+(index%6)*22,h=34+(index%4)*7;return <g key={index} opacity=".45"><line x1={x} x2={x} y1={y-12} y2={y+h+12} stroke={up?'var(--green)':'var(--red)'} strokeWidth="2"/><rect x={x-7} y={y} width="14" height={h} rx="2" fill={up?'var(--green)':'var(--red)'}/></g>})}</svg></div>;
}

const assetGroups = {
  'Magníficas 7': ['AAPL','MSFT','GOOGL','AMZN','NVDA','META','TSLA'],
  'Mineras': ['BVN','FSM','SCCO','BHP','B'],
  'ETF sectoriales': ['XLK','XLF','XLE','XLV','XLY','XLP','XLI','XLU','XLB','XLRE','XLC'],
  'ETF globales y Perú': ['SPY','QQQ','EPU'],
};
const allAssets = Object.values(assetGroups).flat();

function Dashboard({ go, selectedAsset, setSelectedAsset }: { go: (p: Page) => void; selectedAsset:string; setSelectedAsset:(asset:string)=>void }) {
  const [group,setGroup]=useState('Todos los grupos');
  const shownAssets=group==='Todos los grupos'?allAssets:assetGroups[group as keyof typeof assetGroups];
  return <>
    <PageTitle eyebrow="Resumen académico" title="Buenos días, Ernesto" description="Panorama de tu laboratorio de inversión con valores demostrativos." action={<button className="primary" onClick={() => go('trading')}>Nueva orden simulada</button>}/>
    <div className="metrics-grid"><Metric label="Capital virtual" value="—" delta="Pendiente de datos del curso"/><Metric label="Rendimiento sintético" value="—" delta="Pendiente de datos del curso"/><Metric label="Riesgo estimado" value="—" delta="Pendiente de datos del curso"/><Metric label="Alertas activas" value="—" delta="Pendiente de configuración"/></div>
    <div className="two-one-grid">
      <Card title={`Velas de 120 sesiones · ${selectedAsset}`} aside={<div className="inline-controls"><select aria-label="Filtrar activos por grupo" value={group} onChange={event=>setGroup(event.target.value)}><option>Todos los grupos</option>{Object.keys(assetGroups).map(name=><option key={name}>{name}</option>)}</select><select aria-label="Seleccionar activo del dashboard" value={selectedAsset} onChange={event=>setSelectedAsset(event.target.value)}>{shownAssets.map(asset=><option key={asset}>{asset}</option>)}</select></div>}><CandlestickChart/><ChartAlternative title="Alternativa tabular de las velas" headers={['Sesión','Apertura','Máximo','Mínimo','Cierre']} rows={[['Pendiente de datos','—','—','—','—']]}/></Card>
      <Card title="Señales destacadas · 30 sesiones" aside={<button className="text-button" onClick={() => go('classification')}>Ver todas <Icon name="chevron" size={14}/></button>}>
        <div className="signal-list">{[['NVDA','—'],['MSFT','—'],['TSLA','—'],['AMZN','—']].map(x=><div className="signal" key={x[0]}><span className="ticker">{x[0]}</span><Badge>{x[1]}</Badge><strong>Sin JSON</strong></div>)}</div>
      </Card>
    </div>
    <div className="three-grid">
      <Card title="Composición actual"><Donut/><div className="mini-legend"><span><i style={{background:PALETTE[0]}}/>Tecnología —</span><span><i style={{background:PALETTE[1]}}/>Índices —</span><span><i style={{background:PALETTE[3]}}/>Bonos —</span></div></Card>
      <Card title="Accesos de análisis"><div className="quick-grid">{NAV.slice(4).map(n=><button key={n.id} onClick={()=>go(n.id)}><Icon name={n.icon}/><span>{n.short}</span><Icon name="chevron" size={14}/></button>)}</div></Card>
      <Card title="Actividad reciente"><Timeline/></Card>
    </div>
    <Card title="Universo de 26 activos" aside={<Badge tone="blue">{shownAssets.length} visibles</Badge>} className="universe-card"><DataTable headers={['Ticker','Grupo','Último precio','Variación','Volatilidad','Beta']} rows={shownAssets.map(asset=>[<button className="asset-link" onClick={()=>setSelectedAsset(asset)}>{asset}</button>,Object.entries(assetGroups).find(([,items])=>items.includes(asset))?.[0]??'—','Pendiente de datos','—','—','—'])}/></Card>
  </>;
}

function Watchlist() {
  const [items,setItems]=useState<string[]>(()=>{try{const saved=JSON.parse(localStorage.getItem('ernesto-watchlist')||'null');return Array.isArray(saved)?saved.filter(item=>allAssets.includes(item)):['NVDA','MSFT','TSLA','SPY']}catch{return ['NVDA','MSFT','TSLA','SPY']}});
  const [candidate,setCandidate]=useState('AAPL');
  useEffect(()=>localStorage.setItem('ernesto-watchlist',JSON.stringify(items)),[items]);
  const add=()=>setItems(current=>current.includes(candidate)?current:[...current,candidate]);
  return <>
    <PageTitle eyebrow="Seguimiento persistente" title="Watchlist y alertas" description="La selección se conserva en este navegador. Precios y alertas quedan pendientes hasta cargar los JSON." action={<div className="add-asset"><label>Activo<select value={candidate} onChange={event=>setCandidate(event.target.value)}>{allAssets.map(asset=><option key={asset}>{asset}</option>)}</select></label><button className="primary" onClick={add}>+ Añadir</button></div>}/>
    <div className="metrics-grid compact"><Metric label="Activos seguidos" value={String(items.length)}/><Metric label="Alertas disparadas" value="Pendiente"/><Metric label="Alertas activas" value="—"/><Metric label="Datos de mercado" value="Sin JSON"/></div>
    <Card><div className="toolbar"><div className="search"><Icon name="search"/><input aria-label="Buscar activo en la watchlist" placeholder="Buscar símbolo…"/></div><div className="filter-row"><button className="chip active">Todos</button><button className="chip">Alertas disparadas</button></div></div><DataTable headers={['Activo','Mini-gráfico 60 sesiones','Precio','Cambio','Alerta','Acciones']} rows={items.map(asset=>[<strong>{asset}</strong>,'Pendiente de datos','—','—',<Badge>Pendiente</Badge>,<div className="row-actions"><button className="icon-action" aria-label={`Configurar alerta para ${asset}`}><Icon name="bell"/></button><button className="remove-button" onClick={()=>setItems(current=>current.filter(item=>item!==asset))} aria-label={`Quitar ${asset} de la watchlist`}>Quitar</button></div>])}/></Card>
  </>;
}

function Trading({ chosenPortfolio }: { chosenPortfolio:string|null }) {
  const [side,setSide]=useState<'Comprar'|'Vender'>('Comprar');
  const [quantity,setQuantity]=useState('');
  const [message,setMessage]=useState('');
  const submit=()=>setMessage(!quantity||Number(quantity)<=0?'Ingresa una cantidad mayor que cero.':'No se puede valorar la orden hasta cargar los JSON de precios y efectivo.');
  return <>
    <PageTitle eyebrow="Laboratorio de órdenes" title="Trading simulado" description="Practica decisiones sin dinero real ni conexión a mercados." action={chosenPortfolio?<Badge tone="blue">Portafolio: {chosenPortfolio}</Badge>:<Badge>Pendiente de portafolio</Badge>}/>
    <div className="trading-grid">
      <Card title="NVDA · NVIDIA" aside={<Badge>Maqueta sin cotización</Badge>}><div className="quote"><strong>—</strong><span>Sin datos del curso</span></div><LineChart height={280}/><ChartAlternative title="Alternativa tabular del gráfico" headers={['Sesión','Precio']} rows={[['Pendiente de datos','—']]}/><div className="orderbook"><span>Apertura <strong>—</strong></span><span>Máximo <strong>—</strong></span><span>Mínimo <strong>—</strong></span><span>Volumen <strong>—</strong></span></div></Card>
      <Card title="Crear orden virtual"><div className="segmented"><button className={side==='Comprar'?'active':''} onClick={()=>setSide('Comprar')}>Comprar</button><button className={side==='Vender'?'active sell':''} onClick={()=>setSide('Vender')}>Vender</button></div><label className="field">Activo<select>{allAssets.map(asset=><option key={asset}>{asset}</option>)}</select></label><label className="field">Tipo de orden<select><option>Mercado simulado</option><option>Límite</option></select></label><div className="field-pair"><label className="field">Cantidad<input type="number" min="1" value={quantity} onChange={event=>{setQuantity(event.target.value);setMessage('')}} aria-describedby="order-message"/></label><label className="field">Precio<input value="—" readOnly/></label></div><div className="order-summary"><span>Total estimado <strong>—</strong></span><span>Capital disponible <strong>—</strong></span></div><button className={`primary full ${side==='Vender'?'danger':''}`} onClick={submit}>{side} en simulador</button><p id="order-message" className={message?'form-message':'microcopy'} aria-live="polite">{message||'Esta acción no ejecuta operaciones reales.'}</p></Card>
    </div>
  </>;
}

function Leaderboard() {
  const people=[['—','Participante A','Cartera indexada','—','—'],['—','Participante B','Momentum prudente','—','—'],['—','Participante C','Valor diversificado','—','—'],['—','Ernesto','Balance adaptativo','—','—'],['—','Participante D','Tecnología global','—','—'],['—','Participante E','Dividendos','—','—']];
  return <>
    <PageTitle eyebrow="Comunidad académica" title="Leaderboard" description="Liga de traders ficticios; la posición del usuario se calculará desde su portafolio de Trading." action={<select aria-label="Periodo de clasificación"><option>Periodo pendiente de datos</option></select>}/>
    <div className="podium">{people.slice(0,3).map((p,i)=><Card key={p[1]} className={`podium-card p${i+1}`}><span className="rank">#{p[0]}</span><div className="avatar">{p[1].split(' ').map(s=>s[0]).join('')}</div><h3>{p[1]}</h3><p>{p[2]}</p><strong>{p[3]}</strong><small>rendimiento sintético</small></Card>)}</div>
    <Card title="Clasificación general" aside={<Badge tone="blue">Pendiente de datos</Badge>}><DataTable headers={['Posición','Participante','Estrategia','Rendimiento','Riesgo']} rows={people.map((p,i)=>[<strong className={i===3?'you':''}>{p[0]}{i===3?' · Tú':''}</strong>,p[1],p[2],p[3],p[4]])}/></Card>
  </>;
}

const models = [
  { name:'Regresión logística', type:'ML' }, { name:'SVC con kernel RBF', type:'ML' },
  { name:'k-vecinos', type:'ML' }, { name:'Naive Bayes', type:'ML' },
  { name:'Árbol de decisión', type:'ML' }, { name:'Random Forest', type:'ML' },
  { name:'Extra Trees', type:'ML' }, { name:'AdaBoost', type:'ML' },
  { name:'Gradient Boosting', type:'ML' }, { name:'XGBoost', type:'ML' },
  { name:'LightGBM', type:'ML' }, { name:'MLP', type:'DL' },
  { name:'RNN simple', type:'DL' }, { name:'LSTM', type:'DL' },
  { name:'GRU', type:'DL' }, { name:'BiLSTM', type:'DL' },
  { name:'CNN 1D', type:'DL' }, { name:'Transformer', type:'DL' },
];
function Classification({ selectedAsset, setSelectedAsset, go }: { selectedAsset:string; setSelectedAsset:(asset:string)=>void; go:(page:Page)=>void }) {
  const [type,setType]=useState('Todos');
  const [group,setGroup]=useState('Todos los grupos');
  const visibleModels=type==='Todos'?models:models.filter(model=>model.type===type);
  const visibleAssets=group==='Todos los grupos'?Object.values(assetGroups).flat():assetGroups[group as keyof typeof assetGroups];
  return <>
    <PageTitle eyebrow="Modelos direccionales · horizonte único de 30 sesiones" title="Clasificación binaria" description="Cada celda mostrará P(SUBE): la etiqueta será SUBE si P(SUBE) ≥ 50 % y BAJA si P(SUBE) < 50 %. No existe una tercera clase." action={<button className="primary" onClick={()=>go('regression')}>Ver regresión de {selectedAsset} <Icon name="chevron" size={14}/></button>}/>
    <FilterBar><Segment options={['Todos','ML','DL']} value={type} setValue={setType}/><label>Grupo<select value={group} onChange={event=>setGroup(event.target.value)}><option>Todos los grupos</option>{Object.keys(assetGroups).map(name=><option key={name}>{name}</option>)}</select></label><label>Horizonte<input className="readonly-filter" value="30 sesiones" readOnly aria-label="Horizonte fijo de clasificación"/></label></FilterBar>
    <div className="classification-grid">
      <Card title={`P(SUBE) a 30 sesiones · ${visibleModels.length} modelos · ${visibleAssets.length} activos`} aside={<div className="heat-legend"><span>▼ BAJA &lt; 50 %</span><i/><span>▲ SUBE ≥ 50 %</span></div>} className="heat-card">
        <div className="heat-scroll" tabIndex={0} aria-label="Mapa de calor desplazable de P(SUBE) a 30 sesiones por activo y modelo"><div className="heatmap" style={{gridTemplateColumns:`150px repeat(${visibleAssets.length}, minmax(78px,1fr))`}}><span className="heat-corner">Modelo</span>{visibleAssets.map(a=><strong key={a} className="heat-asset">{a}</strong>)}{visibleModels.map(model=><div key={model.name} className="contents"><span className="model-name">{model.name}</span>{visibleAssets.map(asset=><button key={asset} className={`heat-cell pending ${selectedAsset===asset?'selected':''}`} onClick={()=>setSelectedAsset(asset)} aria-label={`${model.name}, ${asset}: P(SUBE) pendiente de datos. Seleccionar activo.`}><b>—</b><small>P(SUBE)</small></button>)}</div>)}</div></div>
      </Card>
      <div className="side-stack">
        <Card title={`Consenso · ${selectedAsset}`}><div className="consensus"><div className="ring pending-ring"><strong>—</strong><span>P(SUBE)</span></div><h3>Pendiente de datos</h3><p>Confianza: —</p></div><div className="bar-row"><span>SUBE ▲</span><div/><strong>— votos</strong></div><div className="bar-row down"><span>BAJA ▼</span><div/><strong>— votos</strong></div></Card>
        <Card title="Cómo interpretar"><p className="validation-note"><Icon name="info" size={15}/><span>Los clasificadores sintéticos aciertan apenas un poco más que una moneda: el documento sitúa la exactitud alrededor de <strong>52–58 %</strong>. Una señal no es una recomendación y puede ignorarse.</span></p><button className="secondary full" onClick={()=>setSelectedAsset('SPY')}>Ignorar y volver a SPY</button></Card>
      </div>
    </div>
    <div className="two-one-grid lower-grid">
      <Card title="Métricas por modelo" aside={<Badge>Pendiente de datos</Badge>}><DataTable headers={['Modelo','Familia','Exactitud','Precisión','Recall','F1','AUC','Matriz de confusión']} rows={visibleModels.map(model=>[model.name,model.type,'—','—','—','—','—','Pendiente de datos'])}/></Card>
      <Card title={`Alternativa textual · ${selectedAsset}`}><DataTable headers={['Modelo','P(SUBE)','Señal']} rows={visibleModels.map(model=>[model.name,'Pendiente de datos','—'])}/></Card>
    </div>
  </>;
}

const regressors = [
  {name:'Lineal',type:'ML'},{name:'Ridge',type:'ML'},{name:'Lasso',type:'ML'},{name:'Elastic Net',type:'ML'},
  {name:'SVR',type:'ML'},{name:'k-vecinos',type:'ML'},{name:'Árbol',type:'ML'},{name:'Random Forest',type:'ML'},
  {name:'Gradient Boosting',type:'ML'},{name:'XGBoost',type:'ML'},{name:'LightGBM',type:'ML'},
  {name:'MLP',type:'DL'},{name:'RNN simple',type:'DL'},{name:'LSTM',type:'DL'},{name:'GRU',type:'DL'},
  {name:'BiLSTM',type:'DL'},{name:'CNN 1D',type:'DL'},{name:'Transformer',type:'DL'},
];
function Regression({ selectedAsset, setSelectedAsset, go }: { selectedAsset:string; setSelectedAsset:(asset:string)=>void; go:(page:Page)=>void }) {
  const [modelsOn,setModelsOn]=useState(true);
  const [family,setFamily]=useState('Todos');
  const visibleRegressors=family==='Todos'?regressors:regressors.filter(model=>model.type===family);
  return <>
    <PageTitle eyebrow={`Proyección experimental · ${selectedAsset}`} title="Regresión a 30 sesiones" description="Historia reciente, 30 sesiones proyectadas, mediana, banda p10–p90 y cono de volatilidad. La amplitud creciente expresa incertidumbre, no un rango garantizado." action={<button className="primary" onClick={()=>go('optimizer')}>Continuar al Optimizador <Icon name="chevron" size={14}/></button>}/>
    <FilterBar><label>Activo<select value={selectedAsset} onChange={event=>setSelectedAsset(event.target.value)}>{allAssets.map(asset=><option key={asset}>{asset}</option>)}</select></label><div><span className="control-label">Familia de modelos</span><Segment options={['Todos','ML','DL']} value={family} setValue={setFamily}/></div><label>Escala<select><option>Precio</option><option>Retorno</option></select></label><button className={`chip ${modelsOn?'active':''}`} onClick={()=>setModelsOn(!modelsOn)} aria-pressed={modelsOn}>✓ Modelos visibles</button><button className="chip active" aria-pressed="true">✓ p10–p90 + cono</button></FilterBar>
    <div className="metrics-grid compact"><Metric label="Mediana sesión 30" value="—"/><Metric label="Rango p10–p90" value="—"/><Metric label="MAE" value="—"/><Metric label="Incertidumbre" value="—"/></div>
    <Card title="Historia + horizonte proyectado" aside={<Badge tone="neutral">{visibleRegressors.length} modelos visibles</Badge>}><div className="forecast-wrap"><svg viewBox="0 0 900 340" role="img" aria-label="Estructura de historia sintética, proyección a 30 sesiones, mediana, banda p10 a p90 y cono de volatilidad; valores pendientes de datos" preserveAspectRatio="none"><defs><linearGradient id="cone"><stop stopColor="#0B4F9C" stopOpacity=".26"/><stop offset="1" stopColor="#0B4F9C" stopOpacity=".05"/></linearGradient></defs>{[55,120,185,250,315].map(y=><line key={y} x1="45" x2="880" y1={y} y2={y} className="grid-line"/>)}<line x1="525" x2="525" y1="25" y2="315" stroke="var(--border-strong)" strokeDasharray="5 5"/><text x="535" y="45" className="svg-label">CORTE</text><path d="M45 255 C100 245 130 215 180 229 S270 182 320 196 S400 139 455 159 S495 125 525 137" className="line blue"/><path d="M525 137 C610 80 730 52 880 40 L880 282 C740 242 620 195 525 137Z" fill="url(#cone)"/><path d="M525 137 C630 112 740 103 880 95" className="line median" strokeDasharray="8 5"/>{modelsOn&&<><path d="M525 137 C620 128 760 60 880 72" className="line green"/><path d="M525 137 C650 158 740 121 880 145" className="line purple"/><path d="M525 137 C640 105 740 180 880 173" className="line orange"/></>}</svg><div className="forecast-labels"><span>Historia</span><span>120 sesiones recientes</span><span>30 sesiones proyectadas</span><span>+30</span></div></div><div className="legend wrap"><span><i className="dot blue"/>Historia</span><span><i className="dot dashed"/>Mediana</span><span><i className="swatch"/>Banda p10–p90</span><span><i className="swatch cone-swatch"/>Cono de volatilidad</span></div></Card>
    <div className="two-one-grid lower-grid"><Card title="Métricas por regresor"><DataTable headers={['Modelo','Familia','MAPE','MAE','RMSE','R² retornos','Mejora vs. persistencia']} rows={visibleRegressors.map(model=>[model.name,model.type,'—','—','—','—','Pendiente de datos'])}/></Card><Card title="Tabla alternativa · mediana"><DataTable headers={['Sesión','Fecha','Precio mediano']} rows={Array.from({length:30},(_,index)=>[`Sesión ${index+1}`,'Pendiente','Pendiente de datos'])}/></Card></div>
  </>;
}

function Optimizer({ selectedAsset }: { selectedAsset:string }) {
  const [method,setMethod]=useState('NSGA-II');
  const [scope,setScope]=useState('Elegibles');
  const [selectedPoint,setSelectedPoint]=useState('Pendiente de datos');
  const [visibleMethods,setVisibleMethods]=useState<Record<string,boolean>>({'Markowitz':true,'NSGA-II':true,'NSGA-III':true});
  const toggleMethod=(name:string)=>setVisibleMethods(current=>({...current,[name]:!current[name]}));
  return <>
    <PageTitle eyebrow={`Frontera eficiente · activo de contexto: ${selectedAsset}`} title="Optimizador multiobjetivo" description="Visualiza las fronteras suministradas; no recalcula ni ejecuta algoritmos en el navegador. Son elegibles los activos con consenso SUBE y mediana de regresión positiva."/>
    <FilterBar><div><span className="control-label">Método destacado</span><Segment options={['Markowitz','NSGA-II','NSGA-III']} value={method} setValue={setMethod}/></div><div><span className="control-label">Universo</span><Segment options={['Elegibles','Completo']} value={scope} setValue={setScope}/></div>{Object.keys(visibleMethods).map(name=><label key={name}><input type="checkbox" checked={visibleMethods[name]} onChange={()=>toggleMethod(name)}/> Mostrar {name}</label>)}</FilterBar>
    <div className="optimizer-grid">
      <Card title={`Riesgo vs. retorno · ${scope}`} aside={<span className="micro-label">Tab y Enter seleccionan un punto de maqueta</span>}><Scatter method={method} visibleMethods={visibleMethods} onSelect={name=>{setMethod(name);setSelectedPoint(`Punto ${name} · pendiente de datos`)}}/><div className="legend"><span><i className="dot blue"/>Markowitz · curva</span><span><i className="dot green"/>NSGA-II · retorno/volatilidad</span><span><i className="dot purple"/>NSGA-III · añade CVaR 95 %</span></div><ChartAlternative title="Tabla alternativa de puntos" headers={['Método','ID','Riesgo','Retorno','CVaR 95 %','Acción']} rows={['Markowitz','NSGA-II','NSGA-III'].map(name=>[name,'Pendiente','—','—',name==='NSGA-III'?'—':'No aplica',<button className="text-button" onClick={()=>{setMethod(name);setSelectedPoint(`Punto ${name} · pendiente de datos`)}}>Seleccionar</button>])}/></Card>
      <Card title="Portafolio seleccionado" aside={<Badge tone="blue">{method}</Badge>}><div className="selected-name"><span>{selectedPoint}</span><strong>Sin JSON</strong></div><div className="weights"><div><span>Activos</span><div/><strong>—</strong></div></div><div className="metric-list boxed"><span>Retorno esperado <strong>—</strong></span><span>Volatilidad <strong>—</strong></span><span>Ratio de Sharpe <strong>—</strong></span><span>CVaR 95 % <strong>—</strong></span></div><div className="reason"><strong>Elegibilidad</strong><p>Consenso binario SUBE y proyección mediana positiva a 30 sesiones. Lista pendiente de datos.</p></div></Card>
    </div>
    <div className="method-notes"><Card title="Markowitz"><p>Traza la curva eficiente para el universo completo y los activos elegibles.</p></Card><Card title="NSGA-II"><p>Simula dos objetivos: retorno y volatilidad. Puede quedar ligeramente por debajo de Markowitz.</p></Card><Card title="NSGA-III"><p>Simula tres objetivos: retorno, volatilidad y CVaR 95 %.</p></Card></div>
    <p className="module-warning"><Icon name="info" size={16}/><strong>NSGA-II y NSGA-III simulados:</strong> no se ejecutó ningún algoritmo evolutivo. La especificación fija tope de 25 % por activo y tasa libre de riesgo de 4 %; los valores mostrados se leerán del JSON.</p>
  </>;
}

function Portfolios({ go, choosePortfolio }: { go:(page:Page)=>void; choosePortfolio:(name:string)=>void }) {
  const profiles=[{name:'Conservador',sub:'Preservar capital',reason:'La razón de inclusión se completará con los datos suministrados por el curso.'},{name:'Moderado',sub:'Equilibrio',reason:'La razón de inclusión se completará con los datos suministrados por el curso.'},{name:'Agresivo',sub:'Crecimiento',reason:'La razón de inclusión se completará con los datos suministrados por el curso.'}];
  return <>
    <PageTitle eyebrow="Perfiles educativos · origen NSGA-II" title="Comparador de portafolios" description="Conservador minimiza volatilidad, Moderado busca máximo Sharpe y Agresivo prioriza retorno proyectado. Pesos y métricas dependen del JSON."/>
    <div className="profile-grid">{profiles.map((p,i)=><Card key={p.name} className={i===1?'featured':''}><div className="profile-title">{i===1&&<Badge tone="blue">Máximo Sharpe</Badge>}<span>0{i+1}</span><h2>{p.name}</h2><p>{p.sub}</p></div><Donut/><div className="profile-metrics"><Metric label="Retorno esperado" value="—"/><Metric label="Volatilidad" value="—"/><Metric label="Sharpe" value="—"/><Metric label="CVaR 95 %" value="—"/></div><div className="reason"><strong>Composición y razones</strong><p>{p.reason}</p></div><DataTable headers={['Activo','Peso','Razón: votos + regresión']} rows={[['Pendiente de datos','—','Pendiente de datos']]}/><button className={i===1?'primary full':'secondary full'} onClick={()=>{choosePortfolio(p.name);go('trading')}}>Llevar a Trading</button></Card>)}</div>
    <Card title="Comparación normalizada" aside={<span className="micro-label">Pendiente de datos del curso</span>}><div className="empty-comparison"><strong>—</strong><span>La comparación se generará al conectar los JSON.</span></div></Card>
  </>;
}

function Backtesting() {
  const [tab,setTab]=useState('Capital base 100');
  return <>
    <PageTitle eyebrow="Evaluación walk-forward sobre historia sintética" title="Backtesting de portafolios" description="Capital base 100 durante 252 sesiones, con drawdown, rebalanceo mensual y referencias. El desempeño pasado simulado no garantiza resultados futuros."/>
    <FilterBar><label>Portafolio<select><option>Los tres niveles</option><option>Conservador</option><option>Moderado</option><option>Agresivo</option></select></label><label>Referencia<select><option>Todas: SPY, QQQ, EPU y 1/N</option><option>SPY</option><option>QQQ</option><option>EPU</option><option>Igual ponderado (1/N)</option></select></label><label>Base<input className="readonly-filter" value="100" readOnly/></label></FilterBar>
    <div className="metrics-grid compact"><Metric label="Retorno acumulado" value="—" delta="Pendiente de simulación"/><Metric label="CAGR" value="—"/><Metric label="Máx. drawdown" value="—"/><Metric label="Ratio de Sharpe" value="—"/></div>
    <Card><div className="chart-tabs"><Segment options={['Capital base 100','Drawdown']} value={tab} setValue={setTab}/><div className="legend wrap"><span><i className="dot blue"/>Conservador</span><span><i className="dot green"/>Moderado</span><span><i className="dot purple"/>Agresivo</span><span><i className="dot gray"/>SPY / QQQ / EPU / 1/N</span></div></div><LineChart variant={tab==='Capital base 100'?'capital':'drawdown'} height={260} axisLabels={['Base 100','Sesión 126','Sesión 252']}/><ChartAlternative title={`Tabla alternativa · ${tab}`} headers={['Sesión','Conservador','Moderado','Agresivo','SPY','QQQ','EPU','1/N']} rows={tab==='Capital base 100'?[['Base','100','100','100','100','100','100','100'],['Sesiones siguientes','Pendiente','Pendiente','Pendiente','Pendiente','Pendiente','Pendiente','Pendiente']]:[['Sesiones','Pendiente','Pendiente','Pendiente','Pendiente','Pendiente','Pendiente','Pendiente']]}/></Card>
    <div className="backtest-grid"><Card title="Métricas de evaluación"><DataTable headers={['Métrica','Conservador','Moderado','Agresivo','SPY','QQQ','EPU','1/N']} rows={['Retorno total','CAGR','Volatilidad','Sharpe','Máximo drawdown','Calmar','Meses positivos'].map(metric=>[metric,'—','—','—','—','—','—','—'])}/></Card><Card title="Rebalanceos mensuales" aside={<Badge tone="neutral">Pendientes</Badge>}><Timeline detailed/></Card></div>
    <Card title="Interpretación honesta" className="interpretation"><p>El documento especifica que, en este conjunto sintético, <strong>Conservador, Moderado y Agresivo no superan al mercado</strong>. La explicación cuantitativa y la comparación contra cada referencia quedan pendientes de leer las métricas del JSON; no se ajustarán parámetros para hacer que las carteras “ganen”.</p></Card>
  </>;
}

function PageTitle({eyebrow,title,description,action}:{eyebrow:string;title:string;description:string;action?:React.ReactNode}) {
  return <header className="page-title"><div><span>{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action&&<div className="page-action">{action}</div>}</header>;
}
function FilterBar({children}:{children:React.ReactNode}) { return <div className="filter-bar">{children}</div>; }
function Segment({options,value,setValue}:{options:string[];value:string;setValue:(v:string)=>void}) { return <div className="segmented small">{options.map(o=><button key={o} className={value===o?'active':''} onClick={()=>setValue(o)} aria-pressed={value===o}>{o}</button>)}</div>; }
function DataTable({headers,rows}:{headers:string[];rows:React.ReactNode[][]}) { return <div className="table-scroll" tabIndex={0}><table><thead><tr>{headers.map(h=><th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{r.map((c,j)=>j===0?<th scope="row" key={j}>{c}</th>:<td key={j}>{c}</td>)}</tr>)}</tbody></table></div>; }
function ChartAlternative({title,headers,rows}:{title:string;headers:string[];rows:React.ReactNode[][]}) {return <details className="chart-alternative"><summary>{title}</summary><DataTable headers={headers} rows={rows}/></details>;}
function Donut() { return <svg className="donut" viewBox="0 0 42 42" role="img" aria-label="Composición pendiente de los datos del curso"><circle cx="21" cy="21" r="15.9" fill="none" stroke="var(--surface-3)" strokeWidth="7"/><text x="21" y="20" textAnchor="middle">—</text><text x="21" y="25" textAnchor="middle" className="small-text">sin JSON</text></svg>;}
function Timeline({detailed=false}:{detailed?:boolean}) {const rows=detailed?[['—','Rebalanceo pendiente','Sin datos'],['—','Rebalanceo pendiente','Sin datos'],['—','Rebalanceo pendiente','Sin datos']]:[['—','Alerta pendiente','Sin datos'],['—','Orden virtual pendiente','Sin datos'],['—','Rebalanceo pendiente','Sin datos']];return <div className="timeline">{rows.map((r,i)=><div key={i}><i/><span>{r[0]}</span><p><strong>{r[1]}</strong><small>{r[2]}</small></p></div>)}</div>;}
function Scatter({method,visibleMethods,onSelect}:{method:string;visibleMethods:Record<string,boolean>;onSelect:(method:string)=>void}) {const points=[{name:'Markowitz',x:235,y:150,color:'#0B4F9C'},{name:'NSGA-II',x:355,y:112,color:'#0A7D3C'},{name:'NSGA-III',x:460,y:88,color:'#8B5CF6'}];return <div className="scatter"><svg viewBox="0 0 650 350" role="img" aria-label={`Estructura de frontera eficiente; ${method} destacado. Puntos sin métricas hasta cargar datos.`}>{[60,120,180,240,300].map(y=><line key={y} x1="55" x2="625" y1={y} y2={y} className="grid-line"/>)}{visibleMethods.Markowitz&&<path d="M75 285 Q210 88 600 55" fill="none" stroke="var(--blue)" strokeWidth="2" strokeDasharray="6 5"/>}{points.filter(point=>visibleMethods[point.name]).map(point=><g key={point.name} role="button" tabIndex={0} aria-label={`Seleccionar punto de maqueta ${point.name}; métricas pendientes de datos`} onClick={()=>onSelect(point.name)} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();onSelect(point.name)}}} className="svg-point"><circle cx={point.x} cy={point.y} r={method===point.name?10:7} fill={point.color} stroke={method===point.name?'var(--text)':'var(--surface)'} strokeWidth="3"/><text x={point.x+13} y={point.y+4}>{point.name}</text></g>)}<text x="15" y="185" transform="rotate(-90 15 185)" className="svg-label">RETORNO ESPERADO →</text><text x="305" y="345" className="svg-label">RIESGO / VOLATILIDAD →</text></svg></div>;}

export default function App() {
  const [page,setPage]=useState<Page>('dashboard');
  const [dark,setDark]=useState(false);
  const [menu,setMenu]=useState(false);
  const [selectedAsset,setSelectedAsset]=useState('SPY');
  const [chosenPortfolio,setChosenPortfolio]=useState<string|null>(null);
  const current=NAV.find(n=>n.id===page)!;
  const go=(p:Page)=>{setPage(p);setMenu(false);window.scrollTo({top:0,behavior:'smooth'});};
  const screens:Record<Page,React.ReactNode>={dashboard:<Dashboard go={go} selectedAsset={selectedAsset} setSelectedAsset={setSelectedAsset}/>,watchlist:<Watchlist/>,trading:<Trading chosenPortfolio={chosenPortfolio}/>,leaderboard:<Leaderboard/>,classification:<Classification selectedAsset={selectedAsset} setSelectedAsset={setSelectedAsset} go={go}/>,regression:<Regression selectedAsset={selectedAsset} setSelectedAsset={setSelectedAsset} go={go}/>,optimizer:<Optimizer selectedAsset={selectedAsset}/>,portfolios:<Portfolios go={go} choosePortfolio={setChosenPortfolio}/>,backtesting:<Backtesting/>};
  return <div className={`app ${dark?'dark':''}`}>
    <a className="skip-link" href="#main">Saltar al contenido</a>
    <aside className={`sidebar ${menu?'open':''}`} aria-label="Navegación principal">
      <div className="brand"><div className="brand-mark">E</div><div><strong>Ernesto</strong><span>INVESTING AI</span></div><button className="mobile-close" onClick={()=>setMenu(false)} aria-label="Cerrar menú"><Icon name="close"/></button></div>
      <nav>{NAV.map(n=><button key={n.id} className={page===n.id?'active':''} onClick={()=>go(n.id)} aria-current={page===n.id?'page':undefined}><Icon name={n.icon}/><span>{n.label}</span>{page===n.id&&<i/>}</button>)}</nav>
      <div className="sidebar-foot"><div className="edu"><Icon name="info"/><p><strong>Modo académico</strong><span>Entorno de aprendizaje</span></p></div><button className="theme-toggle" onClick={()=>setDark(!dark)} aria-label={`Activar tema ${dark?'claro':'oscuro'}`}><Icon name={dark?'sun':'moon'}/><span>Tema {dark?'claro':'oscuro'}</span><i><b/></i></button></div>
    </aside>
    {menu&&<button className="scrim" onClick={()=>setMenu(false)} aria-label="Cerrar menú"/>}
    <div className="shell">
      <header className="topbar"><button className="menu-button" onClick={()=>setMenu(true)} aria-label="Abrir menú"><Icon name="menu"/></button><div className="mobile-brand"><span>E</span><strong>Ernesto AI</strong></div><div className="breadcrumb"><span>Plataforma</span><Icon name="chevron" size={13}/><strong>{current.short}</strong></div><div className="top-actions"><button aria-label="Notificaciones" className="notification"><Icon name="bell"/><i/></button><button className="user"><span>EV</span><div><strong>Ernesto V.</strong><small>Estudiante</small></div></button></div></header>
      <div className="disclaimer"><Icon name="info" size={15}/><strong>Datos sintéticos</strong><span>· resultados simulados · no es asesoría de inversión</span></div>
      <main id="main" tabIndex={-1}>{screens[page]}</main>
      <footer><span>Ernesto Investing AI · Prototipo académico</span><span>Los valores son marcadores visuales, no resultados reales.</span></footer>
    </div>
  </div>;
}
