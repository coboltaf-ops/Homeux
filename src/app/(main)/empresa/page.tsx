'use client'

import { useState, useEffect } from 'react'
import { useEmpresaStore, type Empresa } from '@/features/empresa/store/empresa-store'
import { useConfigStore } from '@/features/configuracion/store/configuracion-store'

const inputSt: React.CSSProperties = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }
const selectSt: React.CSSProperties = { background: 'rgba(41,15,5,0.9)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }

const sectionStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
}

export default function EmpresaPage() {
  const { empresa, setEmpresa } = useEmpresaStore()
  const paises = useConfigStore(s => s.paises)
  const ciudades = useConfigStore(s => s.ciudades)
  const tiposId = useConfigStore(s => s.tiposIdentificacion)

  const [form, setForm] = useState<Empresa>(empresa)
  const [savedMsg, setSavedMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => { setForm(empresa) }, [empresa])

  const upd = <K extends keyof Empresa>(key: K, value: Empresa[K]) =>
    setForm(f => ({ ...f, [key]: value }))

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(''); setSavedMsg('')
    if (!form.razon_social.trim()) { setErrorMsg('La razon social es obligatoria.'); return }
    setEmpresa(form)
    setSavedMsg('Datos guardados correctamente.')
    setTimeout(() => setSavedMsg(''), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Mi Empresa</h1>
      </div>

      {savedMsg && (
        <div className="px-4 py-3 rounded-xl text-sm font-semibold" style={{ background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.4)', color: '#4ade80' }}>
          {savedMsg}
        </div>
      )}
      {errorMsg && (
        <div className="px-4 py-3 rounded-xl text-sm font-semibold" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5' }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">

        {/* ===== DATOS GENERALES ===== */}
        <div className="rounded-2xl p-6" style={sectionStyle}>
          <h2 className="text-lg font-bold text-white mb-5">Datos Generales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Razon Social *</label>
              <input value={form.razon_social} onChange={e => upd('razon_social', e.target.value)} required className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputSt} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Tipo ID</label>
              <select value={form.tipo_identificacion} onChange={e => upd('tipo_identificacion', e.target.value)} className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={selectSt}>
                <option value="">Seleccionar...</option>
                {tiposId.map(t => <option key={t.id} value={t.nombre}>{t.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Nro Documento</label>
              <input value={form.nro_documento} onChange={e => upd('nro_documento', e.target.value)} className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputSt} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Persona Contacto</label>
              <input value={form.persona_contacto} onChange={e => upd('persona_contacto', e.target.value)} className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputSt} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Correo</label>
              <input type="email" value={form.correo} onChange={e => upd('correo', e.target.value)} className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputSt} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Telefono Empresa</label>
              <input value={form.telefono_empresa} onChange={e => upd('telefono_empresa', e.target.value)} className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputSt} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Nro Movil Empresa</label>
              <input value={form.movil_empresa} onChange={e => upd('movil_empresa', e.target.value)} className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputSt} />
            </div>
          </div>
        </div>

        {/* ===== DATOS DEL SERVICIO DE CORREOS ===== */}
        <div className="rounded-2xl p-6" style={sectionStyle}>
          <h2 className="text-lg font-bold text-white mb-5">Datos del Servicio de Correos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Servidor SMTP</label>
              <input value={form.smtp_host} onChange={e => upd('smtp_host', e.target.value)} placeholder="smtp.gmail.com" className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputSt} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Puerto SMTP</label>
              <input value={form.smtp_puerto} onChange={e => upd('smtp_puerto', e.target.value)} placeholder="587" className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputSt} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Usuario SMTP</label>
              <input value={form.smtp_usuario} onChange={e => upd('smtp_usuario', e.target.value)} placeholder="usuario@empresa.com" className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputSt} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Clave SMTP</label>
              <input type="password" value={form.smtp_clave} onChange={e => upd('smtp_clave', e.target.value)} className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputSt} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Nombre Remitente</label>
              <input value={form.smtp_remitente} onChange={e => upd('smtp_remitente', e.target.value)} placeholder="HomeUX - Servicios del Hogar" className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputSt} />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
                <input type="checkbox" checked={form.smtp_ssl} onChange={e => upd('smtp_ssl', e.target.checked)} className="w-4 h-4 cursor-pointer" />
                Usar SSL / TLS
              </label>
            </div>
          </div>
        </div>

        {/* ===== UBICACION ===== */}
        <div className="rounded-2xl p-6" style={sectionStyle}>
          <h2 className="text-lg font-bold text-white mb-5">Ubicacion</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Direccion</label>
              <input value={form.direccion} onChange={e => upd('direccion', e.target.value)} className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputSt} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Ciudad</label>
              <select value={form.ciudad} onChange={e => upd('ciudad', e.target.value)} className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={selectSt}>
                <option value="">Seleccionar...</option>
                {ciudades.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Pais</label>
              <select value={form.pais} onChange={e => upd('pais', e.target.value)} className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={selectSt}>
                <option value="">Seleccionar...</option>
                {paises.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Situacion</label>
              <select value={form.situacion} onChange={e => upd('situacion', e.target.value)} className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={selectSt}>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => setForm(empresa)} className="px-4 py-2 rounded-lg text-sm" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }}>Cancelar</button>
          <button type="submit" className="px-6 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, rgba(30,64,175,0.8), rgba(59,130,246,0.6))', border: '1px solid rgba(30,64,175,0.5)' }}>Guardar Cambios</button>
        </div>
      </form>
    </div>
  )
}
