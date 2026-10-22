import { saveRecord } from './records';
import { printRecord } from './printRecord';

export async function saveAndPrintRecord(payload, { print = false, expectedUserId } = {}) {
  const result = await saveRecord(payload, { expectedUserId });
  if (print) {
    try { await printRecord(payload); }
    catch (error) { throw new Error(`${result.saved ? 'El registro quedó guardado. ' : ''}No se pudo imprimir: ${error.message}`); }
  }
}
