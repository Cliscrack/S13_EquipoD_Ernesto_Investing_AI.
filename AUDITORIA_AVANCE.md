# Auditoría de avance — Ernesto Investing AI

Fecha: 20 de noviembre de 2026. Estado: parcial; no equivale a certificación WCAG ni a aprobación final.

## Comprobaciones realizadas

- Las nueve páginas cargaron sus datos en un servidor local. Para el ensayo móvil se esperó a que aparecieran filas de datos en cada módulo; a un ancho de ventana de 390 px no se observó desbordamiento del documento. Las tablas anchas conservan desplazamiento interno.
- El Dashboard ofrece alternativa tabular de 120 velas; se verificó que aparecen 120 filas y el gráfico se dibuja.
- Clasificación presentó 26 activos y 468 celdas. El filtro DL mostró 182 celdas y siete modelos. Al elegir NVDA y abrir Regresión, esta conservó el activo y presentó 30 filas.
- Se agregó TSLA a la watchlist de prueba y el filtro de Clasificación lo mostró tras navegar entre páginas. Esta prueba utilizó el almacenamiento de la sesión de navegador de prueba.
- Trading rechazó una cantidad decimal y una compra con efectivo insuficiente. Se probó que la cartera elegida aparece como composición objetivo, sin ejecutar órdenes automáticamente.
- En Optimizador se seleccionó NSGA-III, se visualizaron 60 puntos en tabla y se consultó el primero con sus métricas y pesos.
- En Backtesting la tabla ordenó los resultados por retorno de forma ascendente y descendente; las tres carteras tienen retorno inferior a SPY según el JSON.
- El tema se mantuvo al pasar del Dashboard a Regresión. Se corrigió la legibilidad del texto activo en tema oscuro y la inicialización de aria-pressed.
- Se calcularon contrastes de combinaciones principales de texto/fondo claro y oscuro; todas las combinaciones medidas superaron 4,5:1. No se ha comprobado cada combinación, estado ni gráfico.
- La consola del Optimizador consultada durante la prueba no mostró errores. Esto no sustituye una revisión completa de consola en cada interacción.

## Correcciones de esta revisión

Se añadió alternativa tabular para las velas; filtro de watchlist en Dashboard y Clasificación; conservación del activo seleccionado al llegar al Optimizador y Trading; ordenación de la tabla de métricas de Backtesting; mejoras de tema, foco semántico de la cantidad y navegación móvil.

## Incidencias de datos que se conservan

- En cinco activos la relación entre el retorno proyectado redondeado y el último precio de la mediana difiere en más de un centavo: MSFT, AMZN, META, TSLA y SPY. Los valores se muestran sin alterar.
- El JSON etiqueta como Agresivo un portafolio con retorno esperado de 16,07 % y volatilidad de 17,52 %, inferiores a los valores del Moderado (16,49 % y 17,92 %). La interfaz lo indica sin corregir los datos.

## Pendiente antes de entregar

- Verificar exhaustivamente con teclado todas las interacciones, el contraste de todos los estados y las alternativas de gráficos; realizar auditoría con herramienta de accesibilidad.
- Probar órdenes válidas, ventas, reinicio, alertas, almacenamiento y ranking con distintos estados; verificar consola de las nueve páginas en interacciones completas.
- Revisar coherencia integral de la watchlist en todos los módulos y las limitaciones de importar una cartera objetivo: actualmente no rebalancea automáticamente las posiciones.
- Verificar los gráficos y la navegación publicados en un teléfono real; los gráficos dependen de ECharts en jsDelivr.
- Completar informe con capturas verificadas, integrantes y letra del equipo; crear repositorio, configurar GitHub Pages y registrar enlaces de entrega.

## Adaptación visual del prototipo

Se incorporó navegación lateral común, cabecera, aviso de simulación y paneles para el Dashboard, Clasificación, Regresión y Optimizador siguiendo la estructura visual de la exportación de Figma Make. En ventanas móviles la navegación se abre mediante un botón y se puede cerrar con el botón o Escape. Las nueve páginas cargaron sus datos en una prueba a 390 px sin desbordamiento del documento; se verificó el menú móvil, 468 celdas de Clasificación, navegación del activo NVDA a Regresión y Optimizador, persistencia del tema y presencia del gráfico de Regresión. La consola de esa interacción no mostró errores.

La comparación visual exhaustiva de cada pantalla con Figma, el contraste de cada estado y las pruebas completas con teclado siguen pendientes. Los archivos originales de `data/` y la exportación de `figma-src/` no se modificaron.

## Revisión visual e interacciones — 21 de noviembre de 2026

Se capturaron las nueve pantallas en escritorio y dos vistas móviles en `evidencias_auditoria/`. En la matriz de clasificación se detectaron encabezados comprimidos letra por letra; se corrigió asignando espacio suficiente a las columnas y desplazamiento horizontal dentro del panel. La captura 12 muestra el resultado. A 390 px se comprobó que la página no desborda y que la tabla conserva su desplazamiento interno.

Se comprobó agregar y quitar AAPL de la watchlist, y comprar y vender una unidad AAPL en la sesión de pruebas; el efectivo volvió a US$ 25 000,00 y el valor a US$ 57 524,40. Se corrigió la pérdida de foco al ordenar las métricas de Clasificación y Backtesting, y se verificó que el foco permanece en el encabezado activado. Se abrió el menú móvil.

La revisión no cubre todos los casos con teclado ni cada estado de alerta, contraste y gráfico. Las capturas son del sitio implementado; aún no se ha completado una comparación visual pantalla por pantalla con el prototipo Figma. La prueba de compraventa se realizó en una sesión local y no verifica la versión publicada.

## Ajustes según la especificación y la exportación de Figma

| Pantalla | Comparación y ajuste |
| --- | --- |
| Dashboard | La exportación propone indicadores, un gráfico de velas, accesos y un universo filtrable. La implementación conserva SPY, QQQ y EPU como indicadores de mercado y añade accesos a Trading, Clasificación y Portafolios. |
| Watchlist | Se incorporaron indicadores, filtro de alertas disparadas, activación persistente de las reglas y tabla con los 60 cierres por activo. Las alertas se evalúan sobre el último cierre sintético. |
| Trading | Se añadieron el filtro de watchlist, la cotización y el total estimado. El sitio admite las órdenes a mercado solicitadas por el documento. La cantidad se interpreta como entero, incluida la representación exponencial válida del campo numérico. |
| Leaderboard | Se incorporó el podio previsto en Figma. El ranking y la fila del usuario se calculan desde las posiciones registradas. |
| Clasificación | Se conservan filtros, matriz y consenso de la maqueta. Se muestra un mensaje cuando no hay coincidencias con los filtros. |
| Regresión | Se incorporó el filtro de watchlist y se mantuvieron visibles la banda y el cono al desactivar la selección en la leyenda. Los modelos individuales siguen seleccionables por teclado. |
| Optimizador | Se identifican los elegibles de la watchlist. Las fronteras precalculadas conservan su universo original. |
| Portafolios | Se mantienen tres tarjetas comparables, métricas alineadas y barras de composición con valores numéricos. El documento permite usar barras o donas. |
| Backtesting | El selector de rebalanceos recupera la cartera elegida en Portafolios. Las curvas y comparaciones conservan las series originales. |

Playwright verificó los nueve módulos a 1280 y 390 px, los gráficos esperados, la ausencia de desbordamiento horizontal de página y la consola sin errores. La prueba también comprobó el control de alertas con teclado y su persistencia, la alternativa tabular de mini gráficos, el filtro de watchlist, la selección de un punto NSGA-III, la transferencia de la cartera Moderado, una compra y venta, la validación de cantidades y efectivo, y la navegación móvil con Escape y persistencia del tema. Las capturas actualizadas están en `evidencias_auditoria/sitio_revisado/`.

Esta comparación usa la exportación local de Figma Make. Quedan pendientes las capturas del archivo Figma en línea, la comprobación integral de contraste y teclado, y la verificación de GitHub Pages desde un teléfono.
