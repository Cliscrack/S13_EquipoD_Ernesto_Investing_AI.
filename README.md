# Ernesto Investing AI — Semana 13

Prototipo académico de Interacción Hombre-Computador que integra nueve módulos con los datos sintéticos proporcionados para el curso. Los resultados son simulados y no constituyen asesoría de inversión. Los modelos no se entrenan en el navegador.

## Ejecución local

Desde esta carpeta ejecuta `python -m http.server 8000` y abre `http://127.0.0.1:8000/`. Los gráficos usan ECharts 5.5.1 desde jsDelivr, por lo que requieren conexión. No abrir las páginas con doble clic porque el navegador bloquea la carga de JSON.

## Estructura

- `index.html`, `watchlist.html`, `trading.html`, `leaderboard.html`: módulos heredados de la base.
- `clasificacion.html`, `regresion.html`, `optimizador.html`, `portafolios.html`, `backtesting.html`: módulos de la semana 13 y sus scripts en `js/`.
- `data/`: archivos sintéticos originales, sin modificar.
- `figma-src/`: exportación sin modificar de Figma Make.
- `PROMPTS_USADOS.md`: registro de prompts efectivamente enviados a Figma Make.

## Estado y limitaciones

Es una versión de trabajo, aún no entregable. Se requiere completar la auditoría de accesibilidad y contraste, verificar todos los flujos y el estado compartido, comparar las pantallas con Figma y completar el informe, repositorio y publicación. Las tablas anchas tienen desplazamiento interno. La selección de cartera se muestra como composición objetivo en Trading; no ejecuta órdenes ni altera automáticamente las posiciones. El ranking se calcula a partir de las posiciones realmente registradas.

Los datos tienen diferencias de redondeo entre algunos retornos y precios de regresión; se muestran los valores originales. El portafolio denominado Agresivo presenta en el JSON un retorno esperado y una volatilidad inferiores a los del Moderado; no se alteraron los valores.

## Créditos

Sistema base y datos proporcionados por Ernesto D. Cancho-Rodríguez, licencia CC BY 4.0 (ver `LICENSE`). Diseño asistido por Figma Make y desarrollo asistido por Codex; las contribuciones deben ser revisadas y verificadas por el equipo.

Figma: https://www.figma.com/make/h6iTyexsgfwwWM83vycM0a . GitHub Pages: pendiente.

## Equipo D

- Reynoso Castillo, Jose Luis
- Aguirre Ircash, Leonardo Esteban
- Jaico Fernández, Fernando Jose
- Zelada Llaxa Junior Clisman
- Sinche Vega, Moises Pedro
- Espinoza Dioses, Enrique Israel
- Galvez Garro, Jorge Luis Junior

