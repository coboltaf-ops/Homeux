import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type RefItem = { id: string; nombre: string }

interface ConfigState {
  paises: RefItem[]
  ciudades: RefItem[]
  tiposTrabajo: RefItem[]
  situacionesSolicitud: RefItem[]
  tiposVivienda: RefItem[]
  situacionesCliente: RefItem[]
  tiposIdentificacion: RefItem[]
  estadosCiviles: RefItem[]
  formaciones: RefItem[]
  habilidades: RefItem[]
  situacionesPersonal: RefItem[]
  addItem: (table: string, item: RefItem) => void
  updateItem: (table: string, id: string, item: Partial<RefItem>) => void
  deleteItem: (table: string, id: string) => void
}

const getTable = (state: ConfigState, table: string): RefItem[] => {
  switch (table) {
    case 'paises': return state.paises
    case 'ciudades': return state.ciudades
    case 'tiposTrabajo': return state.tiposTrabajo
    case 'situacionesSolicitud': return state.situacionesSolicitud
    case 'tiposVivienda': return state.tiposVivienda
    case 'situacionesCliente': return state.situacionesCliente
    case 'tiposIdentificacion': return state.tiposIdentificacion
    case 'estadosCiviles': return state.estadosCiviles
    case 'formaciones': return state.formaciones
    case 'habilidades': return state.habilidades
    case 'situacionesPersonal': return state.situacionesPersonal
    default: return []
  }
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      paises: [{ id: '1', nombre: 'Venezuela' }, { id: '2', nombre: 'Colombia' }, { id: '3', nombre: 'Estados Unidos' }],
      ciudades: [{ id: '1', nombre: 'Caracas' }, { id: '2', nombre: 'Valencia' }, { id: '3', nombre: 'Maracaibo' }, { id: '4', nombre: 'Barquisimeto' }],
      tiposTrabajo: [{ id: '1', nombre: 'Pintura' }, { id: '2', nombre: 'Electricidad' }, { id: '3', nombre: 'Remodelacion' }, { id: '4', nombre: 'Ajuste de Techos' }, { id: '5', nombre: 'Cambio de Pisos' }, { id: '6', nombre: 'Lavado de Autos' }, { id: '7', nombre: 'Plomeria' }, { id: '8', nombre: 'Jardineria' }],
      situacionesSolicitud: [{ id: '1', nombre: 'Nueva' }, { id: '2', nombre: 'En Proceso' }, { id: '3', nombre: 'Completada' }, { id: '4', nombre: 'Cancelada' }],
      tiposVivienda: [{ id: '1', nombre: 'Casa' }, { id: '2', nombre: 'Apartamento' }, { id: '3', nombre: 'Townhouse' }, { id: '4', nombre: 'Local Comercial' }],
      situacionesCliente: [{ id: '1', nombre: 'Activo' }, { id: '2', nombre: 'Inactivo' }, { id: '3', nombre: 'Prospecto' }],
      tiposIdentificacion: [{ id: '1', nombre: 'Cedula' }, { id: '2', nombre: 'RIF' }, { id: '3', nombre: 'Pasaporte' }, { id: '4', nombre: 'NIT' }],
      estadosCiviles: [{ id: '1', nombre: 'Soltero' }, { id: '2', nombre: 'Casado' }, { id: '3', nombre: 'Divorciado' }, { id: '4', nombre: 'Viudo' }, { id: '5', nombre: 'Union Libre' }],
      formaciones: [{ id: '1', nombre: 'Primaria' }, { id: '2', nombre: 'Secundaria' }, { id: '3', nombre: 'Tecnico' }, { id: '4', nombre: 'Universitario' }, { id: '5', nombre: 'Postgrado' }, { id: '6', nombre: 'Autodidacta' }],
      habilidades: [{ id: '1', nombre: 'Pintura Interior' }, { id: '2', nombre: 'Pintura Exterior' }, { id: '3', nombre: 'Electricidad Residencial' }, { id: '4', nombre: 'Plomeria' }, { id: '5', nombre: 'Albañileria' }, { id: '6', nombre: 'Carpinteria' }, { id: '7', nombre: 'Jardineria' }, { id: '8', nombre: 'Limpieza Profunda' }],
      situacionesPersonal: [{ id: '1', nombre: 'Activo' }, { id: '2', nombre: 'Inactivo' }, { id: '3', nombre: 'En Evaluacion' }],
      addItem: (table, item) => set((s) => ({ [table]: [...getTable(s, table), item] } as unknown as Partial<ConfigState>)),
      updateItem: (table, id, item) => set((s) => ({ [table]: getTable(s, table).map((r) => r.id === id ? { ...r, ...item } : r) } as unknown as Partial<ConfigState>)),
      deleteItem: (table, id) => set((s) => ({ [table]: getTable(s, table).filter((r) => r.id !== id) } as unknown as Partial<ConfigState>)),
    }),
    { name: 'homeux-config-storage' }
  )
)
