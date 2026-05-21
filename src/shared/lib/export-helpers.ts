import * as XLSX from 'xlsx'

export function exportToExcel(data: Record<string, unknown>[], filename: string) {
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, filename)
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

export function exportToPDF(title: string, headers: string[], rows: string[][]) {
  const w = window.open('', '_blank')
  if (!w) return
  w.document.write(`<html><head><title>${title}</title><style>body{font-family:Arial;padding:20px}table{width:100%;border-collapse:collapse;margin-top:10px}th,td{border:1px solid #ccc;padding:6px 8px;text-align:left;font-size:11px}th{background:#1e40af;color:#fff}</style></head><body><h2>${title}</h2><table><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></body></html>`)
  w.document.close()
  w.print()
}

export function printTable(title: string, headers: string[], rows: string[][]) {
  exportToPDF(title, headers, rows)
}
