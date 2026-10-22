export const KG_PER_LB = 0.45359237;

export function calculateDose({ weight, weightUnit = 'kg', rate, rateUnit = 'mg/kg', concentration, concentrationUnit = 'mg/mL' }) {
  if (![weight, rate, concentration].every(value => Number.isFinite(Number(value)) && Number(value) > 0)) throw new Error('Los tres valores deben ser números mayores que cero.');
  if (!['kg', 'lb'].includes(weightUnit) || !['mg/kg', 'mg/lb'].includes(rateUnit) || !['mg/mL', 'mg/g'].includes(concentrationUnit)) throw new Error('Revisa las unidades del cálculo.');
  const kilograms = Number(weight) * (weightUnit === 'lb' ? KG_PER_LB : 1);
  const mgPerKg = Number(rate) / (rateUnit === 'mg/lb' ? KG_PER_LB : 1);
  const milligrams = kilograms * mgPerKg;
  return { amount: milligrams / Number(concentration), unit: concentrationUnit === 'mg/mL' ? 'mL' : 'g', milligrams };
}
