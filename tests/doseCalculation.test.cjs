const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync('utils/doseCalculation.js','utf8').replace(/export /g,'') + '\nthis.api = {calculateDose, KG_PER_LB};',context);
const { calculateDose, KG_PER_LB } = context.api;
const base = { weight:20, rate:5, concentration:50 };
test('manual lesson: 20 kg at 5 mg/kg with 50 mg/mL yields 2 mL and 100 mg', () => {
  const result = calculateDose(base);
  assert.equal(result.amount,2); assert.equal(result.unit,'mL'); assert.equal(result.milligrams,100);
});
test('weight and rate conversions preserve the same prescribed quantity', () => {
  const result = calculateDose({...base,weight:20/KG_PER_LB,weightUnit:'lb',rate:5*KG_PER_LB,rateUnit:'mg/lb'});
  assert.ok(Math.abs(result.amount-2)<1e-10);
  const pounds = calculateDose({weight:100,weightUnit:'lb',rate:2,rateUnit:'mg/lb',concentration:50});
  assert.equal(pounds.amount,4);
});
test('mg/g produces grams and the exercise is dimensionally consistent', () => {
  const mass = calculateDose({...base,concentration:20,concentrationUnit:'mg/g'});
  assert.equal(mass.amount,5); assert.equal(mass.unit,'g');
  const practice = calculateDose({weight:10,rate:4,concentration:20});
  assert.equal(practice.amount,2); assert.equal(practice.unit,'mL');
});
test('rejects zero, non-finite inputs and concentration units based on animal weight', () => {
  for(const concentration of [0,-1,Infinity,NaN,'']) assert.throws(()=>calculateDose({...base,concentration}));
  assert.throws(()=>calculateDose({...base,concentrationUnit:'mg/kg'}));
});
