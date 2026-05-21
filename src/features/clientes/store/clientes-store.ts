import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Cliente = {
  id: string
  codigo: string
  nombre: string
  apellido: string
  correo: string
  movil: string
  telefono: string
  tipo_vivienda: string
  estado_civil: string
  direccion: string
  ciudad: string
  pais: string
  urbanizacion: string
  situacion: string
  imagen?: string
}

interface ClientesState {
  clientes: Cliente[]
  addCliente: (c: Cliente) => void
  updateCliente: (id: string, c: Partial<Cliente>) => void
  deleteCliente: (id: string) => void
}

export const useClientesStore = create<ClientesState>()(
  persist(
    (set) => ({
      clientes: [],
      addCliente: (c) => set((s) => ({ clientes: [...s.clientes, c] })),
      updateCliente: (id, c) => set((s) => ({ clientes: s.clientes.map((r) => r.id === id ? { ...r, ...c } : r) })),
      deleteCliente: (id) => set((s) => ({ clientes: s.clientes.filter((r) => r.id !== id) })),
    }),
    { name: 'homeux-clientes-storage' }
  )
)
