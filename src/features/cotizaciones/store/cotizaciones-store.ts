import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CotizacionItem = {
  producto_id: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

export type Cotizacion = {
  id: string
  nro_cotizacion: string
  fecha: string
  solicitud_id: string
  cliente_id: string
  items: CotizacionItem[]
  total: number
  observaciones: string
  situacion: string
  imagen?: string
}

interface CotizacionesState {
  cotizaciones: Cotizacion[]
  addCotizacion: (c: Cotizacion) => void
  updateCotizacion: (id: string, c: Partial<Cotizacion>) => void
  deleteCotizacion: (id: string) => void
}

export const useCotizacionesStore = create<CotizacionesState>()(
  persist(
    (set) => ({
      cotizaciones: [],
      addCotizacion: (c) => set((s) => ({ cotizaciones: [...s.cotizaciones, c] })),
      updateCotizacion: (id, c) => set((s) => ({ cotizaciones: s.cotizaciones.map((r) => r.id === id ? { ...r, ...c } : r) })),
      deleteCotizacion: (id) => set((s) => ({ cotizaciones: s.cotizaciones.filter((r) => r.id !== id) })),
    }),
    { name: 'homeux-cotizaciones-storage' }
  )
)
