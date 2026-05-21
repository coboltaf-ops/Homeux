'use client'

import { useState } from 'react'
import { useSolicitudesStore, type Solicitud } from '@/features/solicitudes/store/solicitudes-store'
import { useConfigStore } from '@/features/configuracion/store/configuracion-store'
import { todayFormatted } from '@/shared/lib/format-date'
import { exportToExcel, exportToPDF, printTable } from '@/shared/lib/export-helpers'
import { compressImage } from '@/shared/lib/compress-image'

const inputSt: React.CSSProperties = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }
const selectSt: React.CSSProperties = { background: 'rgba(41,15,5,0.9)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }

const initForm = (): Solicitud => ({
  id: '', nro_solicitud: '', fecha: '', nombre: '', apellido: '', correo: '', movil: '',
  tipo_trabajo: '', fecha_estimada_inicio: '', descripcion: '', tipo_vivienda: '',
  urbanizacion: '', nro_casa_apto: '', ciudad: '', pais: '', situacion: 'Nueva', imagen: '',
})

export default function SolicitudesPage() {
  const { solicitudes, addSolicitud, updateSolicitud, deleteSolicitud } = useSolicitudesStore()
  const config = useConfigStore()
  const [form, setForm] = useState<Solicitud>(initForm())
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [viewRecord, setViewRecord] = useState<Solicitud | null>(null)
  const [search, setSearch] = useState('')
  const [formError, setFormError] = useState('')

  const nextCode = () => {
    const nums = solicitudes.map(s => parseInt(s.nro_solicitud.replace('SOL-', '')) || 0)
    const max = nums.length > 0 ? Math.max(...nums) : 0
    return `SOL-${String(max + 1).padStart(5, '0')}`
  }

  const filtered = solicitudes.filter(s =>
    s.nro_solicitud.toLowerCase().includes(search.toLowerCase()) ||
    s.nombre.toLowerCase().includes(search.toLowerCase()) ||
    s.apellido.toLowerCase().includes(search.toLowerCase()) ||
    s.tipo_trabajo.toLowerCase().includes(search.toLowerCase()) ||
    s.situacion.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault(); setFormError('')
    if (!form.nombre.trim()) { setFormError('El nombre es obligatorio.'); return }
    if (!form.tipo_trabajo) { setFormError('El tipo de trabajo es obligatorio.'); return }
    if (form.id) { updateSolicitud(form.id, form) }
    else { addSolicitud({ ...form, id: crypto.randomUUID(), nro_solicitud: nextCode(), fecha: todayFormatted() }) }
    setIsFormOpen(false); setForm(initForm())
  }

  const handleEdit = (s: Solicitud) => { setForm({ ...s }); setIsFormOpen(true) }
  const handleDelete = (id: string) => { if (confirm('¿Eliminar esta solicitud?')) deleteSolicitud(id) }

  const statusBadge = (s: string) => (
    <span data-situacion={s} className="px-3 py-1 rounded-lg text-xs font-bold">{s}</span>
  )

  const headers = ['Nro', 'Fecha', 'Nombre', 'Tipo Trabajo', 'Urbanizacion', 'Ciudad', 'Situacion']
  const rows = filtered.map(s => [s.nro_solicitud, s.fecha, `${s.nombre} ${s.apellido}`, s.tipo_trabajo, s.urbanizacion, s.ciudad, s.situacion])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Solicitudes</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => exportToPDF('Solicitudes', headers, rows)} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(220,38,38,0.85)', border: '1px solid rgba(220,38,38,1)', color: '#fff' }}>PDF</button>
          <button onClick={() => exportToExcel(filtered.map(s => ({ Nro: s.nro_solicitud, Fecha: s.fecha, Nombre: s.nombre, Apellido: s.apellido, Tipo: s.tipo_trabajo, Urbanizacion: s.urbanizacion, Ciudad: s.ciudad, Situacion: s.situacion })), 'Solicitudes')} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(22,163,74,0.85)', border: '1px solid rgba(22,163,74,1)', color: '#fff' }}>Excel</button>
          <button onClick={() => printTable('Solicitudes', headers, rows)} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(202,138,4,0.9)', border: '1px solid rgba(202,138,4,1)', color: '#fff' }}>Imprimir</button>
          <button onClick={() => { setForm(initForm()); setIsFormOpen(true) }} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, rgba(30,64,175,0.8), rgba(59,130,246,0.6))', border: '1px solid rgba(30,64,175,0.5)' }}>+ Nueva Solicitud</button>
        </div>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar solicitudes..." className="w-full rounded-lg px-4 py-2 text-sm outline-none" style={inputSt} />

      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {['Nro', 'Fecha', 'Nombre', 'Tipo Trabajo', 'Urbanizacion', 'Ciudad', 'Situacion', 'Acciones'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-white/5 transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td className="px-4 py-3 font-mono text-xs text-white/60">{s.nro_solicitud}</td>
                  <td className="px-4 py-3 text-white/70">{s.fecha}</td>
                  <td className="px-4 py-3 text-white">{s.nombre} {s.apellido}</td>
                  <td className="px-4 py-3 text-white/70">{s.tipo_trabajo}</td>
                  <td className="px-4 py-3 text-white/70">{s.urbanizacion}</td>
                  <td className="px-4 py-3 text-white/70">{s.ciudad}</td>
                  <td className="px-4 py-3">{statusBadge(s.situacion)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewRecord(s)} className="px-2 py-1 rounded-lg text-xs font-medium hover:opacity-90" style={{ background: 'rgba(4,120,87,0.9)', border: '1px solid rgba(4,120,87,1)', color: '#fff' }}>Ver</button>
                      <button onClick={() => handleEdit(s)} className="p-1.5 rounded-lg hover:bg-white/10" title="Editar"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                      <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg hover:bg-white/10" title="Eliminar"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-white/30">No hay solicitudes registradas</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewRecord && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-6" style={{ background: 'rgba(15,23,42,0.98)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">{viewRecord.nro_solicitud} - Solicitud</h2>
              <button onClick={() => setViewRecord(null)} className="text-white/60 hover:text-white text-xl">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Nro Solicitud', value: viewRecord.nro_solicitud },
                { label: 'Fecha', value: viewRecord.fecha },
                { label: 'Nombre', value: `${viewRecord.nombre} ${viewRecord.apellido}` },
                { label: 'Correo', value: viewRecord.correo },
                { label: 'Movil', value: viewRecord.movil },
                { label: 'Tipo Trabajo', value: viewRecord.tipo_trabajo },
                { label: 'Fecha Estimada Inicio', value: viewRecord.fecha_estimada_inicio },
                { label: 'Tipo Vivienda', value: viewRecord.tipo_vivienda },
                { label: 'Urbanizacion', value: viewRecord.urbanizacion },
                { label: 'Nro Casa/Apto', value: viewRecord.nro_casa_apto },
                { label: 'Ciudad', value: viewRecord.ciudad },
                { label: 'Pais', value: viewRecord.pais },
                { label: 'Situacion', value: viewRecord.situacion },
              ].map(f => (
                <div key={f.label}><p className="text-xs text-white/40">{f.label}</p><p className="text-sm text-white">{f.value || '-'}</p></div>
              ))}
            </div>
            {viewRecord.descripcion && <div className="mt-3"><p className="text-xs text-white/40">Descripcion Detallada</p><p className="text-sm text-white">{viewRecord.descripcion}</p></div>}
            {viewRecord.imagen && <div className="mt-3"><p className="text-xs text-white/40 mb-1">Imagen</p><img src={viewRecord.imagen} alt="" className="h-40 rounded-xl object-cover" style={{ border: '1px solid rgba(255,255,255,0.15)' }} /></div>}
          </div>
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-6" style={{ background: 'rgba(15,23,42,0.98)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">{form.id ? 'Editar Solicitud' : 'Nueva Solicitud'}</h2>
              <button onClick={() => setIsFormOpen(false)} className="text-white/60 hover:text-white text-xl">✕</button>
            </div>
            {formError && <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>{formError}</div>}
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Nro Solicitud</label><input value={form.id ? form.nro_solicitud : nextCode()} readOnly className="w-full rounded-lg px-3 py-2 text-sm outline-none cursor-not-allowed opacity-70" style={inputSt} /></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Nombre *</label><input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputSt} /></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Apellido</label><input value={form.apellido} onChange={e => setForm(f => ({ ...f, apellido: e.target.value }))} className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputSt} /></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Correo</label><input type="email" value={form.correo} onChange={e => setForm(f => ({ ...f, correo: e.target.value }))} className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputSt} /></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Movil</label><input value={form.movil} onChange={e => setForm(f => ({ ...f, movil: e.target.value }))} className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputSt} /></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Tipo Trabajo *</label><select value={form.tipo_trabajo} onChange={e => setForm(f => ({ ...f, tipo_trabajo: e.target.value }))} className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={selectSt}><option value="">Seleccionar...</option>{config.tiposTrabajo.map(t => <option key={t.id} value={t.nombre}>{t.nombre}</option>)}</select></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Fecha Estimada Inicio</label><input type="date" value={form.fecha_estimada_inicio} onChange={e => setForm(f => ({ ...f, fecha_estimada_inicio: e.target.value }))} className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputSt} /></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Tipo Vivienda</label><select value={form.tipo_vivienda} onChange={e => setForm(f => ({ ...f, tipo_vivienda: e.target.value }))} className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={selectSt}><option value="">Seleccionar...</option>{config.tiposVivienda.map(t => <option key={t.id} value={t.nombre}>{t.nombre}</option>)}</select></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Urbanizacion</label><input value={form.urbanizacion} onChange={e => setForm(f => ({ ...f, urbanizacion: e.target.value }))} className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputSt} /></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Nro Casa/Apto</label><input value={form.nro_casa_apto} onChange={e => setForm(f => ({ ...f, nro_casa_apto: e.target.value }))} className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputSt} /></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Ciudad</label><select value={form.ciudad} onChange={e => setForm(f => ({ ...f, ciudad: e.target.value }))} className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={selectSt}><option value="">Seleccionar...</option>{config.ciudades.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}</select></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Pais</label><select value={form.pais} onChange={e => setForm(f => ({ ...f, pais: e.target.value }))} className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={selectSt}><option value="">Seleccionar...</option>{config.paises.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}</select></div>
                <div><label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Situacion</label><select value={form.situacion} onChange={e => setForm(f => ({ ...f, situacion: e.target.value }))} className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={selectSt}>{config.situacionesSolicitud.map(s => <option key={s.id} value={s.nombre}>{s.nombre}</option>)}</select></div>
              </div>
              <div><label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Descripcion Detallada del Trabajo</label><textarea value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} rows={3} className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none" style={inputSt} /></div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Foto / Imagen</label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer px-4 py-2 rounded-lg text-xs font-bold text-white" style={{ background: 'rgba(30,64,175,0.4)', border: '1px solid rgba(30,64,175,0.5)' }}>
                    Cargar Imagen
                    <input type="file" accept="image/*" className="hidden" onChange={async e => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      try { const compressed = await compressImage(file); setForm(f => ({ ...f, imagen: compressed })) } catch { setFormError('Error al procesar imagen.') }
                    }} />
                  </label>
                  {form.imagen && (
                    <div className="relative">
                      <img src={form.imagen} alt="" className="h-16 w-16 object-cover rounded-lg" style={{ border: '1px solid rgba(255,255,255,0.2)' }} />
                      <button type="button" onClick={() => setForm(f => ({ ...f, imagen: '' }))} className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white" style={{ background: 'rgba(239,68,68,0.8)' }}>✕</button>
                    </div>
                  )}
                </div>
              </div>
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
