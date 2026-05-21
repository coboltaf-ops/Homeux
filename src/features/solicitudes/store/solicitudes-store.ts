import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Solicitud = {
  id: string
  nro_solicitud: string
  fecha: string
  nombre: string
  apellido: string
  correo: string
  movil: string
  tipo_trabajo: string
  fecha_estimada_inicio: string
  descripcion: string
  tipo_vivienda: string
  urbanizacion: string
  nro_casa_apto: string
  ciudad: string
  pais: string
  situacion: string
  imagen?: string
}

interface SolicitudesState {
  solicitudes: Solicitud[]
  addSolicitud: (s: Solicitud) => void
  updateSolicitud: (id: string, s: Partial<Solicitud>) => void
  deleteSolicitud: (id: string) => void
}

export const useSolicitudesStore = create<SolicitudesState>()(
  persist(
    (set) => ({
      solicitudes: [],
      addSolicitud: (s) => set((st) => ({ solicitudes: [...st.solicitudes, s] })),
      updateSolicitud: (id, s) => set((st) => ({ solicitudes: st.solicitudes.map((r) => r.id === id ? { ...r, ...s } : r) })),
      deleteSolicitud: (id) => set((st) => ({ solicitudes: st.solicitudes.filter((r) => r.id !== id) })),
    }),
    { name: 'homeux-solicitudes-storage' }
  )
)
