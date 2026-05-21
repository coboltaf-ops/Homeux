import { jsPDF } from 'jspdf'
import type { Cotizacion } from '@/features/cotizaciones/store/cotizaciones-store'
import type { Cliente } from '@/features/clientes/store/clientes-store'
import type { Producto } from '@/features/productos/store/productos-store'
import type { Solicitud } from '@/features/solicitudes/store/solicitudes-store'
import { fmtNum } from '@/shared/lib/format-date'

type Args = {
  cotizacion: Cotizacion
  cliente?: Cliente
  solicitud?: Solicitud
  productos: Producto[]
}

const COLOR_PRIMARY: [number, number, number] = [30, 64, 175]
const COLOR_TEXT: [number, number, number] = [30, 41, 59]
const COLOR_MUTED: [number, number, number] = [100, 116, 139]
const COLOR_BORDER: [number, number, number] = [226, 232, 240]
const COLOR_ROW_ALT: [number, number, number] = [248, 250, 252]

const PAGE_W = 210
const PAGE_H = 297
const MARGIN = 15

export function buildCotizacionPDF({ cotizacion, cliente, solicitud, productos }: Args): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })

  // ---------- HEADER ----------
  doc.setFillColor(...COLOR_PRIMARY)
  doc.rect(0, 0, PAGE_W, 32, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(255, 255, 255)
  doc.text('HomeUX', MARGIN, 15)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text('Servicios del Hogar', MARGIN, 21)
  doc.setFontSize(8)
  doc.text('contacto@homeux.com  |  +51 999 999 999', MARGIN, 26)

  // Right-side: COTIZACION title + nro + fecha
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('COTIZACION', PAGE_W - MARGIN, 13, { align: 'right' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(cotizacion.nro_cotizacion || '-', PAGE_W - MARGIN, 20, { align: 'right' })
  doc.setFontSize(8)
  doc.text(`Fecha: ${cotizacion.fecha || '-'}`, PAGE_W - MARGIN, 25, { align: 'right' })
  if (solicitud?.nro_solicitud) {
    doc.text(`Solicitud: ${solicitud.nro_solicitud}`, PAGE_W - MARGIN, 29, { align: 'right' })
  }

  // ---------- CLIENT BLOCK ----------
  let y = 44
  doc.setTextColor(...COLOR_MUTED)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('CLIENTE', MARGIN, y)

  doc.setDrawColor(...COLOR_BORDER)
  doc.setLineWidth(0.3)
  doc.line(MARGIN, y + 1.5, PAGE_W - MARGIN, y + 1.5)

  y += 7
  doc.setTextColor(...COLOR_TEXT)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text(cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Cliente no especificado', MARGIN, y)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...COLOR_MUTED)
  if (cliente) {
    y += 5
    if (cliente.direccion) doc.text(cliente.direccion, MARGIN, y)
    const ubic = [cliente.urbanizacion, cliente.ciudad, cliente.pais].filter(Boolean).join(' - ')
    if (ubic) { y += 4; doc.text(ubic, MARGIN, y) }
    const contacto = [cliente.movil, cliente.telefono, cliente.correo].filter(Boolean).join('  |  ')
    if (contacto) { y += 4; doc.text(contacto, MARGIN, y) }
  }

  // ---------- ITEMS TABLE ----------
  y += 10
  const tableTop = y
  const colsX = [MARGIN, MARGIN + 95, MARGIN + 120, MARGIN + 145, PAGE_W - MARGIN]
  // Producto | Cant | P.Unit | Subtotal (right edge at PAGE_W-MARGIN)

  // header
  doc.setFillColor(...COLOR_PRIMARY)
  doc.rect(MARGIN, tableTop, PAGE_W - 2 * MARGIN, 8, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('Producto / Servicio', colsX[0] + 2, tableTop + 5.5)
  doc.text('Cant.', colsX[2] - 2, tableTop + 5.5, { align: 'right' })
  doc.text('P. Unit.', colsX[3] - 2, tableTop + 5.5, { align: 'right' })
  doc.text('Subtotal', colsX[4] - 2, tableTop + 5.5, { align: 'right' })

  y = tableTop + 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...COLOR_TEXT)

  cotizacion.items.forEach((item, idx) => {
    const prod = productos.find(p => p.id === item.producto_id)
    const name = prod?.nombre || '(sin producto)'
    const desc = prod?.descripcion || ''
    const nameLines = doc.splitTextToSize(name, 92) as string[]
    const descLines = desc ? (doc.splitTextToSize(desc, 92) as string[]).slice(0, 2) : []
    const rowH = Math.max(8, 5 + nameLines.length * 4 + descLines.length * 3.5)

    if (y + rowH > PAGE_H - 50) {
      doc.addPage()
      y = MARGIN
    }

    if (idx % 2 === 0) {
      doc.setFillColor(...COLOR_ROW_ALT)
      doc.rect(MARGIN, y, PAGE_W - 2 * MARGIN, rowH, 'F')
    }

    let textY = y + 5
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...COLOR_TEXT)
    nameLines.forEach(line => { doc.text(line, colsX[0] + 2, textY); textY += 4 })
    if (descLines.length) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.setTextColor(...COLOR_MUTED)
      descLines.forEach(line => { doc.text(line, colsX[0] + 2, textY); textY += 3.5 })
      doc.setFontSize(9)
    }

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...COLOR_TEXT)
    doc.text(String(item.cantidad), colsX[2] - 2, y + 5, { align: 'right' })
    doc.text(`$ ${fmtNum(item.precio_unitario, 2)}`, colsX[3] - 2, y + 5, { align: 'right' })
    doc.setFont('helvetica', 'bold')
    doc.text(`$ ${fmtNum(item.subtotal, 2)}`, colsX[4] - 2, y + 5, { align: 'right' })

    y += rowH
    doc.setDrawColor(...COLOR_BORDER)
    doc.line(MARGIN, y, PAGE_W - MARGIN, y)
  })

  // ---------- TOTAL ----------
  y += 6
  if (y > PAGE_H - 40) { doc.addPage(); y = MARGIN }

  const totalBoxW = 70
  const totalX = PAGE_W - MARGIN - totalBoxW
  doc.setFillColor(...COLOR_PRIMARY)
  doc.rect(totalX, y, totalBoxW, 12, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('TOTAL', totalX + 4, y + 7.5)
  doc.setFontSize(13)
  doc.text(`$ ${fmtNum(cotizacion.total, 2)}`, PAGE_W - MARGIN - 3, y + 8, { align: 'right' })
  y += 18

  // ---------- OBSERVACIONES ----------
  if (cotizacion.observaciones) {
    if (y > PAGE_H - 50) { doc.addPage(); y = MARGIN }
    doc.setTextColor(...COLOR_MUTED)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text('OBSERVACIONES', MARGIN, y)
    doc.setDrawColor(...COLOR_BORDER)
    doc.line(MARGIN, y + 1.5, PAGE_W - MARGIN, y + 1.5)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...COLOR_TEXT)
    doc.setFontSize(9)
    const obsLines = doc.splitTextToSize(cotizacion.observaciones, PAGE_W - 2 * MARGIN) as string[]
    obsLines.forEach(line => {
      if (y > PAGE_H - 25) { doc.addPage(); y = MARGIN }
      doc.text(line, MARGIN, y); y += 4.5
    })
    y += 4
  }

  // ---------- FOOTER on all pages ----------
  const pageCount = doc.getNumberOfPages()
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p)
    doc.setDrawColor(...COLOR_BORDER)
    doc.line(MARGIN, PAGE_H - 15, PAGE_W - MARGIN, PAGE_H - 15)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...COLOR_MUTED)
    doc.text('Cotizacion generada por HomeUX - Servicios del Hogar', MARGIN, PAGE_H - 10)
    doc.text(`Pagina ${p} de ${pageCount}`, PAGE_W - MARGIN, PAGE_H - 10, { align: 'right' })
    doc.setFontSize(7)
    doc.text(
      'Esta cotizacion tiene una validez de 15 dias calendario desde la fecha de emision.',
      MARGIN, PAGE_H - 6
    )
  }

  return doc
}

export function cotizacionFilename(c: Cotizacion): string {
  const nro = c.nro_cotizacion?.replace(/[^\w-]/g, '_') || 'cotizacion'
  return `${nro}.pdf`
}
