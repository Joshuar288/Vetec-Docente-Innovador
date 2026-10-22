import { calculateDose } from './doseCalculation';

// These are display-only examples. They never become a form or record payload.
export function getTourPreview(kind, practice) {
  const exercise = !!practice;
  const hideAnswer = practice === 'question';
  if (kind === 'dose') {
    const weight = exercise ? 10 : 20;
    const rate = exercise ? 4 : 5;
    const concentration = exercise ? 20 : 50;
    const result = calculateDose({ weight, rate, concentration });
    return { peso:String(weight), dosisPeso:String(rate), concentracion:String(concentration), unidadPeso:'kg', unidadDosis:'mg/kg', unidadConcentracion:'mg/mL', unidadResultado:'mL', calculoFinal:hideAnswer ? null : result.amount.toFixed(2), formularioCompleto:true, guideTarget:null };
  }
  if (kind === 'pearson') {
    const a = exercise ? 30 : 40, b = 10, desired = exercise ? 18 : 16;
    const partA = desired - b, partB = a - desired;
    const quantityA = partA / (partA + partB) * 100;
    const quantityB = 100 - quantityA;
    const ingredientA = { id:-1, label:`Fuente A de ejemplo (${a}%)`, value:a };
    const ingredientB = { id:-2, label:`Fuente B de ejemplo (${b}%)`, value:b };
    const show = value => hideAnswer ? '—' : value.toFixed(2);
    return {
      proteico:a, nutreico:b, valDeseado:String(desired), idProteico:-1, idNutreico:-2,
      ingredientesProteicos:[ingredientA], ingredientesNutreicos:[ingredientB],
      ingredienteProteico:ingredientA.label, ingredienteNutreico:ingredientB.label,
      parteProteico:show(partA), parteNutreico:show(partB),
      proporcionProteico:show(quantityA), proporcionNutreico:show(quantityB),
      librasProteico:show(quantityA*a/100), librasNutreico:show(quantityB*b/100),
      hideAnswer, guideTarget:null,
    };
  }
  if (!['promedio','peps','ueps'].includes(kind)) return null;
  const first = exercise ? 5 : 10, second = exercise ? 7 : 20;
  const average = (first + second) / 2;
  const exitValue = kind === 'promedio' ? 12*average : kind === 'peps' ? 10*first+2*second : 10*second+2*first;
  const total = 10*first+10*second;
  const remainingCost = kind === 'ueps' ? first : second;
  const definitions = [
    { tipo:'entrada', cantidad:10, costo:first, valor:10*first, qty:10, total:10*first, avg:first, detalle:'Inventario inicial' },
    { tipo:'entrada', cantidad:10, costo:second, valor:10*second, qty:20, total, avg:average, detalle:'Compra' },
    { tipo:'salida', cantidad:12, costo:exitValue/12, valor:exitValue, qty:8, total:total-exitValue, avg:average, detalle:'Salida de 12 unidades' },
  ];
  // The practice question shows the two purchases; the next step reveals the sale.
  const rows = hideAnswer ? definitions.slice(0,2) : definitions;
  const movimientos = rows.map((row,i) => ({
    id:`demo-${i}`, fecha:`2026-01-0${i+1}`, detalle:row.detalle, isInitial:i===0,
    tipo:row.tipo, cantidad:row.cantidad, costoUnitario:row.costo, valorMovimiento:row.valor,
    saldo:{ cantidad:row.qty, costoPromedio:row.avg, valor:row.total }, saldoCantidad:row.qty, saldoValor:row.total,
  }));
  const capas = hideAnswer
    ? [{ id:'demo-1', fecha:'2026-01-01', cantidad:10, costo:first }, { id:'demo-2', fecha:'2026-01-02', cantidad:10, costo:second }]
    : [{ id:'demo-final', fecha:kind==='ueps'?'2026-01-01':'2026-01-02', cantidad:8, costo:remainingCost }];
  return {
    producto:'Producto de ejemplo', codigo:'DEMO', unidad:'unidades', fecha:'2026-01-03',
    tipo:'salida', detalle:'Salida de 12 unidades', cantidad:'12', costo:'', costoUnitario:'',
    movimientos, capas, saldo:movimientos.at(-1).saldo, hasInitialInventory:true, initialized:true,
  };
}
