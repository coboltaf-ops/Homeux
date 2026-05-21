'use client'

import { useState } from 'react'
import { useProductosStore, type Producto } from '@/features/productos/store/productos-store'
import { fmtNum } from '@/shared/lib/format-date'
import { exportToExcel, exportToPDF, printTable } from '@/shared/lib/export-helpers'

const inputSt: React.CSSProperties = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }
const selectSt: React.CSSProperties = { background: 'rgba(41,15,5,0.9)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }

const unidadesMedida = ['Unidad', 'Metro', 'm²', 'Litro', 'Galon', 'Kg', 'Bolsa', 'Rollo', 'Caja', 'Servicio']
const situaciones = ['Activo', 'Inactivo']

const initForm = (): Producto => ({
  id: '', codigo: '', nombre: '', precio: 0, unidad_medida: '', descripcion: '', situacion: 'Activo',
})

export default function ProductosPage() {
  const { productos, addProducto, updateProducto, deleteProducto } = useProductosStore()
  const [form, setForm] = useState<Producto>(initForm())
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [viewRecord, setViewRecord] = useState<Producto | null>(null)
  const [search, setSearch] = useState('')
  const [formError, setFormError] = useState('')

  const nextCode = () => {
    const nums = productos.map(p => parseInt(p.codigo.replace('PROD-', '')) || 0)
    const max = nums.length > 0 ? Math.max(...nums) : 0
    return `PROD-${String(max + 1).padStart(5, '0')}`
  }

  const filtered = productos.filter(p =>
    p.codigo.toLowerCase().includes(search.toLowerCase()) ||
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.unidad_medida.toLowerCase().includes(search.toLowerCase()) ||
    p.situacion.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault(); setFormError('')
    if (!form.nombre.trim()) { setFormError('El nombre es obligatorio.'); return }
    if (!form.unidad_medida) { setFormError('La unidad de medida es obligatoria.'); return }
    if (form.precio < 0) { setFormError('El precio no puede ser negativo.'); return }
    if (form.id) { updateProducto(form.id, form) }
    else { addProducto({ ...form, id: crypto.randomUUID(), codigo: nextCode() }) }
    setIsFormOpen(false); setForm(initForm())
  }

  const handleEdit = (p: Producto) => { setForm({ ...p }); setIsFormOpen(true) }
  const handleDelete = (id: string) => { if (confirm('¿Eliminar este producto?')) deleteProducto(id) }

  const statusBadge = (s: string) => (
    <span data-situacion={s} className="px-3 py-1 rounded-lg text-xs font-bold">{s}</span>
  )

  const headers = ['Codigo', 'Nombre', 'Precio', 'Uni.Medida', 'Situacion']
  const rows = filtered.map(p => [p.codigo, p.nombre, fmtNum(p.precio, 2), p.unidad_medida, p.situacion])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Productos</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => exportToPDF('Productos', headers, rows)} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(220,38,38,0.85)', border: '1px solid rgba(220,38,38,1)', color: '#fff' }}>PDF</button>
          <button onClick={() => exportToExcel(filtered.map(p => ({ Codigo: p.codigo, Nombre: p.nombre, Precio: fmtNum(p.precio, 2), UnidadMedida: p.unidad_medida, Situacion: p.situacion })), 'Productos')} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(22,163,74,0.85)', border: '1px solid rgba(22,163,74,1)', color: '#fff' }}>Excel</button>
          <button onClick={() => printTable('Productos', headers, rows)} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(202,138,4,0.9)', border: '1px solid rgba(202,138,4,1)', color: '#fff' }}>Imprimir</button>
          <button onClick={() => { setForm(initForm()); setIsFormOpen(true) }} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, rgba(30,64,175,0.8), rgba(59,130,246,0.6))', border: '1px solid rgba(30,64,175,0.5)' }}>+ Nuevo Producto</button>
        </div>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar productos..." className="w-full rounded-lg px-4 py-2 text-sm outline-none" style={inputSt} />

      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {['Codigo', 'Nombre', 'Precio', 'Uni.Medida', 'Situacion', 'Acciones'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td className="px-4 py-3 font-mono text-xs text-white/60">{p.codigo}</td>
                  <td className="px-4 py-3 text-white">{p.nombre}</td>
                  <td className="px-4 py-3 text-white/70 text-right">{fmtNum(p.precio, 2)}</td>
                  <td className="px-4 py-3 text-white/70">{p.unidad_medida}</td>
                  <td className="px-4 py-3">{statusBadge(p.situacion)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewRecord(p)} className="px-2 py-1 rounded-lg text-xs font-medium hover:opacity-90" style={{ background: 'rgba(4,120,87,0.9)', border: '1px solid rgba(4,120,87,1)', color: '#fff' }}>Ver</button>
                      <button onClick={() => handleEdit(p)} className="p-1.5 rounded-lg hover:bg-white/10" title="Editar"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-white/10" title="Eliminar"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-white/30">No hay productos registrados</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewRecord && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6" style={{ background: 'rgba(15,23,42,0.98)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">{viewRecord.codigo} - Producto</h2>
              <button onClick={() => setViewRecord(null)} className="text-white/60 hover:text-white text-xl">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Codigo', value: viewRecord.codigo },
                { label: 'Nombre', value: viewRecord.nombre },
                { label: 'Precio', value: fmtNum(viewRecord.precio, 2) },
                { label: 'Unidad de Medida', value: viewRecord.unidad_medida },
                { label: 'Situacion', value: viewRecord.situacion },
              ].map(f => (
                <div key={f.label}><p className="text-xs text-white/40">{f.label}</p><p className="text-sm text-white">{f.value || '-'}</p></div>
              ))}
            </div>
            {viewRecord.descripcion && <div className="mt-3"><p className="text-xs text-white/40">Descripcion</p><p className="text-sm text-white">{viewRecord.descripcion}</p></div>}
          </div>
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6" style={{ background: 'rgba(15,23,42,0.98)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">{form.id ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button onClick={() => setIsFormOpen(false)} className="text-white/60 hover:text-white text-xl">✕</button>
            </div>
            {formError && <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>{formError}</div>}
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Codigo</label><input value={form.id ? form.codigo : nextCode()} readOnly className="w-full rounded-lg px-3 py-2 text-sm outline-none cursor-not-allowed opacity-70" style={inputSt} /></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Nombre *</label><input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputSt} /></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Precio</label><input type="number" step="0.01" min="0" value={form.precio} onChange={e => setForm(f => ({ ...f, precio: parseFloat(e.target.value) || 0 }))} className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputSt} /></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Unidad de Medida *</label><select value={form.unidad_medida} onChange={e => setForm(f => ({ ...f, unidad_medida: e.target.value }))} className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={selectSt}><option value="">Seleccionar...</option>{unidadesMedida.map(u => <option key={u} value={u}>{u}</option>)}</select></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Situacion</label><select value={form.situacion} onChange={e => setForm(f => ({ ...f, situacion: e.target.value }))} className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={selectSt}>{situaciones.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              </div>
              <div><label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Descripcion</label><textarea value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} rows={3} className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none" style={inputSt} /></div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 rounded-lg text-sm" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }}>Cancelar</button>
                <button type="submit" className="px-6 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, rgba(30,64,175,0.8), rgba(59,130,246,0.6))', border: '1px solid rgba(30,64,175,0.5)' }}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
