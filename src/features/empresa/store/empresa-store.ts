import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Empresa = {
  razon_social: string
  tipo_identificacion: string
  nro_documento: string
  correo: string
  telefono_empresa: string
  movil_empresa: string
  persona_contacto: string
  smtp_host: string
  smtp_puerto: string
  smtp_usuario: string
  smtp_clave: string
  smtp_remitente: string
  smtp_ssl: boolean
  direccion: string
  ciudad: string
  pais: string
  situacion: string
}

const empresaInicial: Empresa = {
  razon_social: '',
  tipo_identificacion: '',
  nro_documento: '',
  correo: '',
  telefono_empresa: '',
  movil_empresa: '',
  persona_contacto: '',
  smtp_host: '',
  smtp_puerto: '587',
  smtp_usuario: '',
  smtp_clave: '',
  smtp_remitente: '',
  smtp_ssl: true,
  direccion: '',
  ciudad: '',
  pais: '',
  situacion: 'Activo',
}

interface EmpresaState {
  empresa: Empresa
  setEmpresa: (e: Partial<Empresa>) => void
  resetEmpresa: () => void
}

export const useEmpresaStore = create<EmpresaState>()(
  persist(
    (set) => ({
      empresa: empresaInicial,
      setEmpresa: (e) => set((s) => ({ empresa: { ...s.empresa, ...e } })),
      resetEmpresa: () => set({ empresa: empresaInicial }),
    }),
    { name: 'homeux-empresa-storage' }
  )
)
