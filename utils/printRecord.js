import { Platform } from 'react-native';
import * as Print from 'expo-print';

const escapeHtml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

export async function printRecord({ title, subtitle, rows, results, table }) {
  const date = new Intl.DateTimeFormat('es-NI', { dateStyle: 'long', timeStyle: 'short' }).format(new Date());
  const renderRows = (items) => items.map(({ label, value }) => `
    <tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>
  `).join('');
  const renderTable = table ? `
    <h2>${escapeHtml(table.title)}</h2>
    <table class="movement-table">
      <thead><tr>${table.headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead>
      <tbody>${table.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
    </table>
  ` : '';
  const html = `<!DOCTYPE html>
    <html lang="es"><head><meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${escapeHtml(title)}</title>
      <style>
        @page { margin: 28px; }
        body { font-family: Arial, sans-serif; color: #172033; margin: 0; }
        header { padding: 20px; color: white; background: #166534; border-radius: 12px; }
        h1 { margin: 0 0 5px; font-size: 24px; } p { margin: 0; }
        .date { margin-top: 8px; font-size: 12px; opacity: .9; }
        h2 { margin-top: 24px; color: #14532D; font-size: 16px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 10px; border-bottom: 1px solid #D1D5DB; text-align: left; }
        th { width: 44%; color: #475569; font-size: 13px; }
        td { font-weight: 700; }
        .movement-table { margin-top: 8px; font-size: 10px; }
        .movement-table th { width: auto; color: #FFFFFF; background: #94154E; }
        .movement-table td { font-weight: 500; }
        .results { margin-top: 18px; padding: 14px; border: 2px solid #86EFAC; border-radius: 10px; background: #F0FDF4; }
        footer { margin-top: 24px; color: #64748B; font-size: 11px; text-align: center; }
      </style></head><body>
      <header><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p><p class="date">${escapeHtml(date)}</p></header>
      <h2>Datos ingresados</h2><table>${renderRows(rows)}</table>
      ${renderTable}
      <section class="results"><h2>Resultados</h2><table>${renderRows(results)}</table></section>
      <footer>Registro generado por AulaMix · Documento de apoyo educativo</footer>
    </body></html>`;

  if (Platform.OS === 'web') {
    const printWindow = window.open('', '_blank');
    if (!printWindow) throw new Error('No se pudo abrir la ventana de impresión. Permite las ventanas emergentes.');
    printWindow.opener = null;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    return;
  }

  await Print.printAsync({ html });
}
