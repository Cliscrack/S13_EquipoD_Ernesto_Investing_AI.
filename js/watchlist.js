const reglas = {
  precio_sobre: ['Precio igual o superior a', 'ultimo', (valor, umbral) => valor >= umbral, fmt.usd],
  precio_bajo: ['Precio igual o inferior a', 'ultimo', (valor, umbral) => valor <= umbral, fmt.usd],
  var_1d_menor_a_pct: ['Variación diaria igual o inferior a', 'var_1d_pct', (valor, umbral) => valor <= umbral, fmt.pct],
  var_1d_mayor_a_pct: ['Variación diaria igual o superior a', 'var_1d_pct', (valor, umbral) => valor >= umbral, fmt.pct]
};

window.init = async () => {
  const [mercado, demo, historia] = await Promise.all([
    loadJSON('10_dashboard_mercado.json'),
    loadJSON('11_watchlist_alertas_portafolio_demo.json'),
    loadJSON('02_precios_sinteticos_504d.json')
  ]);
  const precios = new Map(mercado.map(dato => [dato.ticker, dato]));
  let seguidos = store('eia_watch') ?? demo.watchlist_inicial;
  const preferencias = store('eia_alertas') ?? {};
  const alertas = demo.alertas.map(alerta => {
    const id = alerta.ticker + ':' + alerta.tipo;
    const [nombre, campo, comparar, formato] = reglas[alerta.tipo];
    return { id, ticker: alerta.ticker, texto: nombre + ' ' + formato(alerta.umbral),
      coincide: comparar(precios.get(alerta.ticker)[campo], alerta.umbral),
      activa: preferencias[id] ?? alerta.activa };
  });
  const disparada = a => a.activa && a.coincide;
  const estado = a => !a.activa ? 'Inactiva' : a.coincide ? 'Disparada' : 'Sin disparar';
  const selector = $('#add');
  selector.innerHTML = mercado.map(d => `<option>${d.ticker}</option>`).join('');
  const actualizar = mensaje => { $('#estado-watch').textContent = mensaje; };
  const render = () => {
    const monitoreadas = alertas.filter(a => seguidos.includes(a.ticker));
    const disparadas = monitoreadas.filter(disparada);
    $('#resumen-watch').innerHTML = [
      ['Activos seguidos', seguidos.length],
      ['Alertas activas de activos seguidos', monitoreadas.filter(a => a.activa).length],
      ['Alertas disparadas', disparadas.length]
    ].map(([nombre, valor]) => `<div class="card kpi"><div class="mut">${nombre}</div><div class="v">${valor}</div></div>`).join('');
    const visibles = $('#ver-watch').value ? seguidos.filter(t => disparadas.some(a => a.ticker === t)) : seguidos;
    $('#tb').innerHTML = visibles.map(t => {
      const dato = precios.get(t);
      const reglasActivo = monitoreadas.filter(a => a.ticker === t);
      return `<tr><th scope="row">${t}</th><td>${fmt.n(dato.ultimo)}</td><td class="${fmt.cls(dato.var_1d_pct)}">${fmt.pct(dato.var_1d_pct)}</td><td class="l">${miniGrafico(t, historia)}</td><td>${reglasActivo.map(a => `<span class="tag">${estado(a)}</span>`).join(' ') || 'Sin alertas'}</td><td><button type="button" data-quitar="${t}">Quitar ${t}</button></td></tr>`;
    }).join('') || '<tr><td colspan="6">No hay activos para mostrar con este filtro.</td></tr>';
    document.querySelectorAll('[data-quitar]').forEach(boton => boton.onclick = () => {
      const ticker = boton.dataset.quitar;
      const indice = visibles.indexOf(ticker);
      seguidos = seguidos.filter(t => t !== ticker);
      store('eia_watch', seguidos);
      render();
      const botones = document.querySelectorAll('[data-quitar]');
      (botones[Math.min(indice, botones.length - 1)] ?? selector).focus();
      actualizar(ticker + ' retirado.');
    });
    $('#al').innerHTML = alertas.map(a => `<li><label><input type="checkbox" data-alerta="${a.id}" ${a.activa ? 'checked' : ''}> ${a.ticker} · ${a.texto}</label><span class="tag">${seguidos.includes(a.ticker) ? estado(a) : 'Activo fuera de la watchlist'}</span></li>`).join('');
    document.querySelectorAll('[data-alerta]').forEach(casilla => casilla.onchange = () => {
      const alerta = alertas.find(a => a.id === casilla.dataset.alerta);
      preferencias[alerta.id] = alerta.activa = casilla.checked;
      store('eia_alertas', preferencias);
      render();
      document.querySelector(`[data-alerta="${alerta.id}"]`).focus();
      actualizar('Alerta de ' + alerta.ticker + (alerta.activa ? ' activada.' : ' desactivada.'));
    });
  };
  $('#bt').onclick = () => {
    const ticker = selector.value;
    if (seguidos.includes(ticker)) return actualizar(ticker + ' ya está en la lista.');
    seguidos = [...seguidos, ticker];
    store('eia_watch', seguidos);
    $('#ver-watch').value = '';
    render();
    actualizar(ticker + ' agregado.');
  };
  $('#ver-watch').onchange = render;
  render();
};

function miniGrafico(ticker, historia) {
  const cierres = historia.cierres[ticker].slice(-60);
  const fechas = historia.fechas.slice(-60);
  const min = Math.min(...cierres), max = Math.max(...cierres);
  const puntos = cierres.map((valor, i) => `${i * 3},${28 - 26 * (valor - min) / (max - min || 1)}`).join(' ');
  return `<svg width="180" height="30" viewBox="0 0 180 30" role="img" aria-label="Últimas 60 sesiones de ${ticker}"><polyline fill="none" stroke="currentColor" stroke-width="1.6" points="${puntos}"/></svg>
    <details><summary>Ver cierres de ${ticker}</summary><table><thead><tr><th scope="col">Fecha</th><th scope="col">Cierre</th></tr></thead><tbody>${cierres.map((v, i) => `<tr><th scope="row">${fechas[i]}</th><td>${fmt.usd(v)}</td></tr>`).join('')}</tbody></table></details>`;
}
