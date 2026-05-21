import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Personal = {
  id: string
  codigo: string
  tipo: string // Persona | Empresa
  tipo_identificacion: string
  nro_documento: string
  nombre: string
  apellido: string
  correo: string
  telefono: string
  movil: string
  estado_civil: string
  fecha_nacimiento: string
  formacion: string
  habilidades: string[]
  ha_trabajado_con_nosotros: boolean
  fecha_ingreso_plantilla: string
  referencias: string
  situacion: string
  imagen?: string
}

interface PersonalState {
  personal: Personal[]
  addPersonal: (p: Personal) => void
  updatePersonal: (id: string, p: Partial<Personal>) => void
  deletePersonal: (id: string) => void
}

export const usePersonalStore = create<PersonalState>()(
  persist(
    (set) => ({
      personal: [],
      addPersonal: (p) => set((s) => ({ personal: [...s.personal, p] })),
      updatePersonal: (id, p) => set((s) => ({ personal: s.personal.map((r) => r.id === id ? { ...r, ...p } : r) })),
      deletePersonal: (id) => set((s) => ({ personal: s.personal.filter((r) => r.id !== id) })),
    }),
    { name: 'homeux-personal-storage' }
  )
)
