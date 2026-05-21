'use client'

import { useSolicitudesStore } from '@/features/solicitudes/store/solicitudes-store'
import { useClientesStore } from '@/features/clientes/store/clientes-store'
import { useProductosStore } from '@/features/productos/store/productos-store'
import { useCotizacionesStore } from '@/features/cotizaciones/store/cotizaciones-store'
import { usePersonalStore } from '@/features/personal/store/personal-store'
import { fmtNum } from '@/shared/lib/format-date'

export default function DashboardPage() {
  const solicitudes = useSolicitudesStore(s => s.solicitudes)
  const clientes = useClientesStore(s => s.clientes)
  const productos = useProductosStore(s => s.productos)
  const cotizaciones = useCotizacionesStore(s => s.cotizaciones)
  const personal = usePersonalStore(s => s.personal)

  const cards = [
    { name: 'Solicitudes', value: solicitudes.length, color: '#3b82f6', sub: `${solicitudes.filter(s => s.situacion === 'Nueva').length} nuevas` },
    { name: 'Clientes', value: clientes.length, color: '#3b82f6', sub: `${clientes.filter(c => c.situacion === 'Activo').length} activos` },
    { name: 'Productos', value: productos.length, color: '#10b981', sub: `${productos.filter(p => p.situacion === 'Activo').length} activos` },
    { name: 'Cotizaciones', value: cotizaciones.length, color: '#8b5cf6', sub: `${cotizaciones.filter(c => c.situacion === 'Aprobada').length} aprobadas` },
    { name: 'Personal', value: personal.length, color: '#ec4899', sub: `${personal.filter(p => p.situacion === 'Activo').length} activos` },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map(c => (
          <div key={c.name} className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p className="text-xs font-medium text-white/50 mb-1">{c.name}</p>
            <p className="text-2xl font-bold text-white">{fmtNum(c.value)}</p>
            <p className="text-xs mt-1" style={{ color: c.color }}>{c.sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
