// Inicie el sitio con python -m http.server 8000.
// Ejecute con Node y Playwright disponibles. Use EIA_CHROME para indicar el navegador.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.EIA_URL || 'http://127.0.0.1:8000/';
const output = process.env.EIA_CAPTURAS;
const pages = [
  ['index', '#velas tr', 120, 1], ['watchlist', '#al input', 4, 0],
  ['trading', '#t option', 26, 0], ['leaderboard', '.mi-puesto', 1, 0],
  ['clasificacion', '#mapa td', 468, 0], ['regresion', '#precios tr', 30, 1],
  ['optimizador', '#puntos tr', 35, 1], ['portafolios', '[data-nivel]', 3, 0],
  ['backtesting', '#metricas tr', 7, 2]
];

async function run() {
  const browser = await chromium.launch({
    executablePath: process.env.EIA_CHROME || undefined
  });
  const errors = [];
  try {
    const page = await browser.newPage();
    if (output) fs.mkdirSync(output, {recursive:true});
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    const goto = name => page.goto(new URL(name + '.html', base).href);
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const [name, selector, count, charts] of pages) {
        await goto(name);
        await page.locator(selector).first().waitFor({state:'attached'});
        const actual = await page.locator(selector).count();
        assert.equal(actual, count, name);
        assert.equal(await page.locator('nav a').count(), 9, name);
        assert.equal(await page.locator('main .err[role="alert"]').count(), 0, name);
        assert.equal(await page.locator('canvas').count(), charts, name);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), name);
        if (output) await page.screenshot({path:path.join(output, `${width}-${name}.png`)});
        console.log(width, name, actual);
      }
    }
    await goto('watchlist');
    const alerta = page.locator('[data-alerta]').first();
    const inicial = await alerta.isChecked();
    await alerta.focus();
    await page.keyboard.press('Space');
    assert.equal(await alerta.isChecked(), !inicial);
    assert.ok(await alerta.evaluate(el => document.activeElement === el));
    await page.reload();
    assert.equal(await alerta.isChecked(), !inicial);
    await alerta.setChecked(inicial);
    await page.locator('#add').selectOption('AAPL');
    await page.locator('#bt').click();
    await page.getByRole('button',{name:'Quitar AAPL'}).waitFor();
    await page.getByText('Ver cierres de AAPL',{exact:true}).click();
    assert.equal(await page.locator('#tb tr').filter({has:page.getByRole('rowheader',{name:'AAPL',exact:true})}).first().locator('details tbody tr').count(),60);
    await goto('regresion');
    await page.locator('#solo-watch').check();
    await page.locator('#activo').selectOption('AAPL');
    await goto('optimizador');
    assert.match(await page.locator('#activo-compartido').textContent(),/AAPL/);
    await page.locator('#serie').selectOption('nsga3_elegibles');
    assert.equal(await page.locator('#puntos tr').count(),60);
    await page.locator('[data-punto]').first().focus();
    await page.keyboard.press('Enter');
    assert.match(await page.locator('#detalle').textContent(), /CVaR/);
    await goto('portafolios');
    await page.locator('[data-nivel="Moderado"]').click();
    await page.locator('#seleccionado').getByText('Cartera elegida: Moderado').waitFor();
    await page.locator('#solo-watch').check();
    await page.locator('#t').selectOption('AAPL');
    const saldo = await page.locator('#cash').textContent();
    await page.locator('#q').fill('1.5');
    await page.getByRole('button',{name:'Enviar orden'}).click();
    assert.match(await page.locator('#msg').textContent(), /cantidad entera/);
    await page.locator('#q').fill('1e2');
    await page.getByRole('button',{name:'Enviar orden'}).click();
    assert.match(await page.locator('#msg').textContent(), /Efectivo insuficiente/);
    await page.locator('#q').fill('1');
    await page.getByRole('button',{name:'Enviar orden'}).click();
    assert.match(await page.locator('#msg').textContent(), /compra de 1 AAPL/);
    await page.locator('#s').selectOption('V');
    await page.getByRole('button',{name:'Enviar orden'}).click();
    assert.equal(await page.locator('#cash').textContent(), saldo);
    await goto('leaderboard');
    assert.match(await page.locator('#nivel-elegido').textContent(), /Moderado/);
    await goto('backtesting');
    assert.equal(await page.locator('#nivel').inputValue(), 'Moderado');
    await page.locator('#menu-open').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#menu-open').getAttribute('aria-expanded'), 'true');
    await page.locator('#tema').click();
    const theme = await page.locator('html').getAttribute('data-theme');
    await page.keyboard.press('Escape');
    assert.ok(await page.locator('#menu-open').evaluate(el => document.activeElement === el));
    await goto('regresion');
    assert.equal(await page.locator('html').getAttribute('data-theme'), theme);
    assert.deepEqual(errors, []);
    console.log('Flujos, carga, consola y ancho verificados.');
  } finally {
    await browser.close();
  }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
