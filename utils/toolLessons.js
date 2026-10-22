export const doseLesson = {
  title:'Entender el cálculo de dosis',
  concept:'La dosis por peso indica cuánto principio activo corresponde al animal. La concentración indica cuánto principio activo contiene cada mL o cada gramo de producto. Primero obtienes los miligramos necesarios y después calculas qué cantidad de producto los contiene.',
  terms:[
    {name:'Peso',meaning:'Masa del animal. Debe estar en la misma base que la dosis: kg con mg/kg, o lb con mg/lb.'},
    {name:'Dosis por peso',meaning:'Miligramos de principio activo por cada kg o lb del animal. Es un dato indicado por el profesional o la etiqueta; la fórmula no decide qué dosis es adecuada.'},
    {name:'Concentración',meaning:'Miligramos por mL para un líquido, o miligramos por gramo para un producto expresado en mg/g.'},
  ],
  formulas:[
    'Principio activo (mg) = peso (kg) × dosis (mg/kg)',
    'Producto (mL) = principio activo (mg) ÷ concentración (mg/mL)',
    'Si la concentración es mg/g, el resultado es g.',
  ],
  example:'Ejemplo de aritmética con valores hipotéticos: peso de 20 kg, dosis de 5 mg/kg y concentración de 50 mg/mL.',
  steps:[
    {title:'Pon las unidades en la misma base',text:'Usamos kg y mg/kg. Si el peso estuviera en libras: kg = lb × 0.45359237. Si la dosis estuviera en mg/lb: mg/kg = mg/lb ÷ 0.45359237.'},
    {title:'Calcula el principio activo',text:'20 kg × 5 mg/kg = 100 mg. Los kg se cancelan y quedan miligramos.'},
    {title:'Calcula la cantidad de producto',text:'100 mg ÷ 50 mg/mL = 2 mL. Los mg se cancelan y quedan mililitros.'},
    {title:'Interpreta la concentración de la etiqueta',text:'Si la etiqueta dice 250 mg en 5 mL, primero divide: 250 ÷ 5 = 50 mg/mL. No introduzcas 250 como si fueran mg por cada mL.'},
  ],
  check:'2 mL × 50 mg/mL = 100 mg. Luego, 100 mg ÷ 20 kg = 5 mg/kg: recuperas el dato de partida.',
  mistakes:[
    'Multiplicar un peso en lb por una dosis en mg/kg sin convertir las unidades.',
    'Confundir la dosis por peso (mg/kg) con la concentración del producto (mg/mL o mg/g).',
    'Redondear durante los pasos intermedios. Conserva la precisión y redondea solo el resultado final.',
  ],
  practice:{question:'Con valores hipotéticos: un animal de 10 kg, una dosis de 4 mg/kg y un producto de 20 mg/mL. ¿Cuántos mL resultan?',answer:'10 × 4 = 40 mg. Luego 40 ÷ 20 = 2 mL. Comprobación: 2 × 20 = 40 mg y 40 ÷ 10 = 4 mg/kg.'},
  note:'Los ejemplos enseñan operaciones y unidades; no son indicaciones de tratamiento. La dosis, la vía, la frecuencia y la presentación deben confirmarse con el profesional y la etiqueta. Los registros anteriores conservan las unidades con las que fueron creados.',
  sources:[
    {name:'Massachusetts Division of Fisheries and Wildlife: guía de estudio, cálculo por peso',url:'https://www.mass.gov/doc/wildlife-rehabilitation-exam-study-guide/download'},
    {name:'OpenStax: análisis dimensional y cálculo de dosis',url:'https://openstax.org/books/pharmacology/pages/2-4-dosage-calculations'},
  ],
};

export const pearsonLesson = {
  title:'Entender el cuadrado de Pearson',
  concept:'El cuadrado de Pearson calcula las proporciones de dos ingredientes para lograr una concentración de un nutriente. La mezcla es un promedio ponderado: una fuente aporta más y la otra menos, según la cantidad que uses.',
  terms:[
    {name:'A: ingrediente con mayor concentración',meaning:'En el ejemplo contiene 40% de proteína bruta.'},
    {name:'B: ingrediente con menor concentración',meaning:'En el ejemplo contiene 10% de proteína bruta.'},
    {name:'D: concentración deseada',meaning:'El objetivo es 16%. Debe estar entre las concentraciones de A y B. Compara datos expresados sobre la misma base, por ejemplo todos en materia seca o todos tal como se ofrecen.'},
  ],
  formulas:[
    'Partes de A = D − B',
    'Partes de B = A − D',
    'Fracción de cada fuente = sus partes ÷ suma de partes',
    'Cantidad de ingrediente = fracción × cantidad total de mezcla',
  ],
  example:'Mezcla de 100 lb: fuente A al 40%, fuente B al 10% y objetivo de 16%. Dibuja A y B a la izquierda, D al centro y resta en diagonal.',
  steps:[
    {title:'Resta en diagonal',text:'Partes de A: 16 − 10 = 6. Partes de B: 40 − 16 = 24. La diferencia con B determina cuánto A necesitas y viceversa.'},
    {title:'Suma las partes',text:'6 + 24 = 30 partes en total. Una parte es una proporción; todavía no es una libra ni un porcentaje.'},
    {title:'Convierte las partes en proporciones',text:'A: 6 ÷ 30 = 0.20 = 20%. B: 24 ÷ 30 = 0.80 = 80%.'},
    {title:'Calcula las cantidades',text:'Para 100 lb: A = 0.20 × 100 = 20 lb; B = 0.80 × 100 = 80 lb. Para preparar 60 lb, usa 12 lb de A y 48 lb de B.'},
  ],
  check:'20 lb × 0.40 = 8 lb de proteína. 80 lb × 0.10 = 8 lb. Total: 16 lb de proteína en 100 lb de mezcla = 16%. También: 0.20 × 40 + 0.80 × 10 = 16.',
  mistakes:[
    'Pedir un objetivo fuera del intervalo de los ingredientes: mezclarlos no puede dar un promedio fuera de sus valores.',
    'Asignar a cada fuente la resta equivocada o usar las partes directamente como porcentajes sin dividir por el total.',
    'Confundir cantidad de ingrediente con cantidad de proteína. El aporte de cada fuente es solo una parte de la proteína total.',
  ],
  practice:{question:'A contiene 30% de proteína y B 10%. Quieres 100 lb al 18%. ¿Cuánto usarías de cada ingrediente?',answer:'Partes de A: 18 − 10 = 8. Partes de B: 30 − 18 = 12. Total: 20. A = 8/20 × 100 = 40 lb; B = 12/20 × 100 = 60 lb. Verifica: 40 × 0.30 + 60 × 0.10 = 18 lb de proteína, es decir 18%.'},
  note:'Este método equilibra un nutriente con dos fuentes. Por sí solo no garantiza una dieta completa: no verifica energía, minerales, vitaminas ni límites de inclusión. Si ambas fuentes tienen el mismo porcentaje, no existe una proporción única que calcular con el cuadrado.',
  sources:[
    {name:'FAO: formulación de alimentos y método del cuadrado',url:'https://www.fao.org/4/x5738e/x5738e0g.htm'},
    {name:'University of Florida IFAS: formulación de mezclas mediante Pearson',url:'https://extadmin.ifas.ufl.edu/media/extadminifasufledu/cflag/image/docs/pdfs/small-farm-pasture-management-series/2018/Rivera.pdf'},
  ],
};

const inventoryTerms = [
  {name:'Entrada',meaning:'Aumenta las unidades y el valor del inventario. Valor de entrada = cantidad × costo unitario.'},
  {name:'Salida',meaning:'Reduce las unidades y su valor. Se valora al costo del inventario, no al precio de venta.'},
  {name:'Saldo',meaning:'Unidades y valor que permanecen después de cada movimiento.'},
];
const inventorySources = [{name:'IFRS Foundation: IAS 2, fórmulas de costo de inventarios',url:'https://www.ifrs.org/issued-standards/list-of-standards/ias-2-inventories/'}];
const inventoryMistakes = ['Usar el precio de venta para valorar la salida: esta tarjeta trabaja con costos.', 'Retirar más unidades de las que existen o mezclar unidades de medida diferentes.', 'Redondear demasiado pronto o confundir el orden de los costos con el movimiento físico del producto.'];
const inventoryExample = 'Inventario inicial: 10 unidades a C$10 = C$100. Después compras 10 unidades a C$20 = C$200. Tienes 20 unidades con valor total de C$300. Ahora salen 12 unidades.';
const inventoryNote = 'Comparación didáctica: con estos mismos movimientos, promedio deja C$120, PEPS C$160 y UEPS C$80. Las unidades finales siempre son 8. IAS 2 contempla PEPS o promedio para inventarios intercambiables; UEPS se incluye aquí para estudiar y comparar el método.';

export const kardexLessons = {
  promedio:{
    title:'Entender Kardex: promedio ponderado',
    concept:'El promedio ponderado móvil combina el valor del inventario anterior y el de cada nueva compra. Se recalcula después de una entrada. Las salidas usan el promedio vigente y no lo recalculan mientras queden existencias.',
    terms:inventoryTerms,
    formulas:['Saldo de unidades = unidades anteriores + entradas − salidas','Nuevo promedio = (valor anterior + valor de entrada) ÷ unidades totales','Valor de salida = unidades de salida × promedio vigente','Saldo de valor = valor anterior + valor de entrada − valor de salida'],
    example:inventoryExample,
    steps:[
      {title:'Registra el inventario inicial',text:'10 × C$10 = C$100. Promedio inicial: C$100 ÷ 10 = C$10 por unidad.'},
      {title:'Integra la nueva compra',text:'10 × C$20 = C$200. Nuevo total: 10 + 10 = 20 unidades; C$100 + C$200 = C$300.'},
      {title:'Calcula el promedio ponderado',text:'C$300 ÷ 20 = C$15 por unidad. Cada unidad disponible tiene ese costo promedio.'},
      {title:'Valora la salida y el saldo',text:'Salen 12 × C$15 = C$180. Quedan 20 − 12 = 8 unidades. Valor restante: C$300 − C$180 = C$120. El promedio sigue siendo C$15.'},
    ],
    check:'12 unidades de salida + 8 finales = 20. C$180 de costo de salida + C$120 de saldo = C$300. También: 8 × C$15 = C$120.',
    mistakes:inventoryMistakes,
    practice:{question:'Tienes 10 unidades a C$5, compras 10 a C$7 y salen 12. ¿Cuál es el costo de salida y el valor de las 8 restantes?',answer:'Valor total = C$50 + C$70 = C$120. Promedio = 120 ÷ 20 = C$6. Salida = 12 × 6 = C$72. Saldo = 8 × 6 = C$48. Comprueba: 72 + 48 = 120.'},
    note:inventoryNote,sources:inventorySources,
  },
  peps:{
    title:'Entender Kardex: PEPS',
    concept:'PEPS significa primeras entradas, primeras salidas. Cada compra forma un lote con su costo. Para valorar una salida consumes primero los costos del lote más antiguo y después los de los siguientes, si hace falta.',
    terms:[...inventoryTerms,{name:'Lote o capa',meaning:'Un grupo de unidades que entró junto y conserva su propio costo unitario.'}],
    formulas:['Valor de un lote = unidades del lote × costo unitario','Costo de salida = suma de unidades tomadas de cada lote × su costo','Saldo de valor = suma de valores de los lotes que quedan'],
    example:inventoryExample,
    steps:[
      {title:'Dibuja los lotes por orden de entrada',text:'Lote 1: 10 unidades a C$10. Lote 2: 10 unidades a C$20. Conserva ambos costos por separado.'},
      {title:'Empieza por el lote más antiguo',text:'De las 12 unidades solicitadas, toma las 10 del lote 1: 10 × C$10 = C$100. Aún faltan 2 unidades.'},
      {title:'Completa con el siguiente lote',text:'Toma 2 del lote 2: 2 × C$20 = C$40. Costo total de salida: C$100 + C$40 = C$140.'},
      {title:'Calcula el inventario que permanece',text:'El lote 1 queda vacío. Del lote 2 quedan 8 unidades a C$20: saldo de C$160. Si una fila muestra un costo unitario aplicado a toda la salida, será 140 ÷ 12 ≈ C$11.67; el consumo real sigue siendo por lotes.'},
    ],
    check:'10 + 2 = 12 unidades de salida y quedan 8. C$140 de costo de salida + C$160 de saldo = C$300.',
    mistakes:inventoryMistakes,
    practice:{question:'Lote 1: 10 unidades a C$5. Lote 2: 10 a C$7. Salen 12 con PEPS. ¿Qué costo de salida y saldo obtienes?',answer:'Salen las 10 del lote 1 (C$50) y 2 del lote 2 (C$14): costo de salida C$64. Quedan 8 del lote 2: 8 × C$7 = C$56. Comprueba: 64 + 56 = 120.'},
    note:inventoryNote,sources:inventorySources,
  },
  ueps:{
    title:'Entender Kardex: UEPS',
    concept:'UEPS significa últimas entradas, primeras salidas. Conservas cada lote con su costo, pero empiezas a valorar las salidas con el lote más reciente y continúas hacia los anteriores.',
    terms:[...inventoryTerms,{name:'Lote o capa',meaning:'Un grupo de unidades con fecha de entrada y costo propio. El último que entró es el primero cuyo costo se utiliza.'}],
    formulas:['Valor de un lote = unidades del lote × costo unitario','Costo de salida = suma del costo de las unidades tomadas, desde el lote más reciente','Saldo de valor = suma de valores de los lotes que quedan'],
    example:inventoryExample,
    steps:[
      {title:'Conserva los dos lotes',text:'Lote 1: 10 unidades a C$10. Lote 2, más reciente: 10 unidades a C$20.'},
      {title:'Empieza por el lote más reciente',text:'Toma las 10 unidades del lote 2: 10 × C$20 = C$200. Para completar la salida faltan 2 unidades.'},
      {title:'Continúa con el lote anterior',text:'Toma 2 del lote 1: 2 × C$10 = C$20. Costo total de salida: C$200 + C$20 = C$220.'},
      {title:'Calcula lo que permanece',text:'El lote 2 queda vacío y quedan 8 unidades del lote 1 a C$10: saldo de C$80. No sustituyas los costos de los lotes por un promedio.'},
    ],
    check:'10 + 2 = 12 unidades de salida y quedan 8. C$220 de costo de salida + C$80 de saldo = C$300.',
    mistakes:inventoryMistakes,
    practice:{question:'Lote 1: 10 unidades a C$5. Lote 2: 10 a C$7. Salen 12 con UEPS. ¿Cuál es el costo de salida y el saldo?',answer:'Salen las 10 más recientes a C$7 (C$70) y 2 a C$5 (C$10): costo de salida C$80. Quedan 8 a C$5: saldo C$40. Comprueba: 80 + 40 = 120.'},
    note:inventoryNote,sources:inventorySources,
  },
};
