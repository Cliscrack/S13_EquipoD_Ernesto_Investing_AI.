# Prompts usados

## Figma Make — prototipo inicial

Diseña un prototipo navegable de Ernesto Investing AI, sistema bursátil educativo con datos sintéticos. Una sola navegación coherente conecta nueve módulos: Dashboard, Watchlist y alertas, Trading simulado, Leaderboard, Clasificación, Regresión a 30 sesiones, Optimizador, Portafolios y Backtesting. Diseña las nueve pantallas, con especial detalle en los cinco módulos nuevos. Usa paleta azul #0B4F9C, verde #0A7D3C y rojo #B3261E, tarjetas claras, tipografía legible y versiones de tema claro y oscuro. Incluye una versión móvil de 390 px.

Clasificación: mapa de calor de activos por 18 modelos con probabilidad y etiquetas SUBE o BAJA, filtros ML/DL y grupo, panel de consenso y métricas. No existe tercera clase. Regresión: historia y 30 sesiones proyectadas, líneas por modelo, mediana, banda p10–p90 y cono de incertidumbre, filtros y métricas. Optimizador: gráfico de riesgo-retorno con Markowitz, NSGA-II y NSGA-III, panel seleccionable con pesos y métricas. Portafolios: compara Conservador, Moderado y Agresivo con métricas, gráficos de composición y razones de inclusión. Backtesting: curvas de capital y drawdown, referencias de mercado, tabla de métricas y rebalanceos. Las cuatro pantallas heredadas deben incorporar dashboard, watchlist, trading simulado y ranking.

Incluye navegación funcional entre pantallas, controles accesibles, foco visible, etiquetas y alternativas textuales; usa color acompañado por texto y símbolo, contraste mínimo 4,5:1 y diseño sin desbordamiento en móvil. Muestra en todas las pantallas el aviso: «Datos sintéticos · resultados simulados · no es asesoría de inversión». Los valores de ejemplo son únicamente marcadores visuales, no resultados reales. No entrenes modelos ni presentes salidas simuladas como resultados reales. El diseño se usará como referencia para implementar el sitio HTML/CSS/JavaScript y debe ser coherente y presentable como prototipo académico.

## Figma Make — corrección del prototipo

Corrige el prototipo para ajustarlo al enunciado: la clasificación solo predice a 30 sesiones; elimina los horizontes de próxima sesión y 5 sesiones. La probabilidad mostrada siempre es P(SUBE): SUBE si es ≥ 50 %, BAJA si es < 50 %. No inventes métricas elevadas ni resultados como 74 % de exactitud: usa marcadores «—» hasta conectar los JSON y explica que la exactitud simulada ronda 52–58 %. Muestra los 26 activos y los nombres correctos de los 18 modelos: regresión logística, SVC RBF, k-vecinos, Naive Bayes, árbol de decisión, Random Forest, Extra Trees, AdaBoost, Gradient Boosting, XGBoost, LightGBM, MLP, RNN simple, LSTM, GRU, BiLSTM, CNN 1D y Transformer. Usa como grupos Magníficas 7, mineras con operaciones en Perú, ETF sectoriales y ETF globales y Perú. En toda la aplicación, reemplaza cifras inventadas que parezcan datos reales por «—» o etiquetas inequívocas de maqueta y mantén la navegación y el aviso permanente. La implementación final leerá los datos suministrados por el curso.

## Figma Make — revisión con especificaciones adjuntas

Lee el documento de especificaciones adjunto y úsalo como fuente principal para revisar y mejorar el prototipo existente, sin crear otro proyecto. Primero contrasta las nueve pantallas y sus flujos con los capítulos 4 y 5 y el anexo C; después realiza las correcciones de diseño necesarias. Si no puedes leer el documento adjunto, detente e indícalo: no supongas su contenido.

Corrige en todo el prototipo el universo exacto de 26 activos, sin agregar ni omitir tickers: Magníficas 7: AAPL, MSFT, GOOGL, AMZN, NVDA, META, TSLA; mineras: BVN, FSM, SCCO, BHP, B; ETF sectoriales: XLK, XLF, XLE, XLV, XLY, XLP, XLI, XLU, XLB, XLRE, XLC; ETF globales y Perú: SPY, QQQ, EPU. Elimina NEM, FCX, VT y EEM. No afirmes detalles actuales de operaciones mineras que no estén verificados.

En Clasificación muestra la estructura de los 18 modelos del documento, P(SUBE) a 30 sesiones, consenso, votos y métricas; solo existen SUBE y BAJA. En Regresión incluye historia, las 30 sesiones proyectadas, mediana, banda p10–p90, cono de volatilidad, filtros de modelos y tabla alternativa. En Optimizador diferencia Markowitz, NSGA-II y NSGA-III, permite seleccionar puntos con teclado y presenta composición y métricas. En Portafolios compara Conservador, Moderado y Agresivo, pesos, métricas y razones de cada activo, con acceso a Trading. En Backtesting presenta capital base 100, drawdown, referencias, métricas y rebalanceos; no sugieras que las carteras ganaron cuando el documento indica lo contrario. Completa los cuatro módulos heredados y la navegación cruzada entre Clasificación, Regresión y Optimizador.

Mantén la identidad visual existente, tema claro y oscuro y vista móvil de 390 px. En cada gráfico ofrece alternativa textual o tabular, controles con etiquetas, foco visible y color acompañado de texto o símbolo. Explica la incertidumbre, el alcance y las limitaciones; conserva el aviso visible de datos sintéticos y simulación. El documento es una guía de diseño: no inventes resultados o cifras que no estén disponibles. Cuando falten los JSON usa marcadores claros «pendiente de datos»; no modifiques ni simules datos como si fueran los originales.

Al terminar, enumera las modificaciones realizadas, los requisitos aún pendientes y cualquier parte del documento o archivo que no hayas podido leer. No declares que se verificó accesibilidad, que se conectaron los JSON ni que todos los módulos funcionan si no lo comprobaste.

## Indicaciones del usuario a Codex

> reemplacemos lo que dice claude por codex, asi no nos hacemos bolas y trabajamos de una vez

> ok, comencemos a hacer este trabajo

> ok, hace lo que tengas que hacer
