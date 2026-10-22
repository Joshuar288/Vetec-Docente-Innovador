const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const context=vm.createContext({});
vm.runInContext(fs.readFileSync('utils/doseCalculation.js','utf8').replace(/export /g,'')+'\n'+fs.readFileSync('utils/tourPreview.js','utf8').replace(/^import .*;$/gm,'').replace(/export /g,'')+'\nthis.preview=getTourPreview;',context);
const preview=context.preview;
test('Pearson demonstration and exercise agree with the manual lesson',()=>{
 const example=preview('pearson');assert.equal(example.proteico,40);assert.equal(example.nutreico,10);assert.equal(example.valDeseado,'16');assert.equal(example.parteProteico,'6.00');assert.equal(example.parteNutreico,'24.00');assert.equal(example.proporcionProteico,'20.00');assert.equal(example.proporcionNutreico,'80.00');
 const question=preview('pearson','question');assert.equal(question.valDeseado,'18');assert.equal(question.proporcionProteico,'—');
 const answer=preview('pearson','answer');assert.equal(answer.proporcionProteico,'40.00');assert.equal(answer.proporcionNutreico,'60.00');
});
test('dose preview uses consistent units and hides the exercise answer until requested',()=>{
 const demo=preview('dose');assert.equal(demo.peso,'20');assert.equal(demo.unidadPeso,'kg');assert.equal(demo.calculoFinal,'2.00');
 assert.equal(preview('dose','question').calculoFinal,null);assert.equal(preview('dose','answer').calculoFinal,'2.00');
});
test('Kardex previews conserve quantity and value using the selected costing method',()=>{
 for(const [kind,out,balance,practiceOut,practiceBalance] of [['promedio',180,120,72,48],['peps',140,160,64,56],['ueps',220,80,80,40]]){
  const demo=preview(kind);assert.equal(demo.movimientos.at(-1).valorMovimiento,out);assert.equal(demo.saldo.valor,balance);assert.equal(demo.saldo.cantidad,8);assert.equal(out+balance,300);
  const question=preview(kind,'question');assert.equal(question.movimientos.length,2);assert.equal(question.saldo.cantidad,20);
  const answer=preview(kind,'answer');assert.equal(answer.movimientos.at(-1).valorMovimiento,practiceOut);assert.equal(answer.saldo.valor,practiceBalance);
 }
});
test('each preview is independent and carries no saveable record payload',()=>{
 const demo=preview('pearson');demo.proteico=99;assert.equal(preview('pearson').proteico,40);
 for(const kind of ['dose','pearson','promedio','peps','ueps'])assert.equal(Object.hasOwn(preview(kind),'record'),false);
 assert.equal(preview('unknown'),null);
});
