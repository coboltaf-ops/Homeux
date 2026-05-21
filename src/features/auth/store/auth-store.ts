import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AuthUser = { usuario: string; nombre: string; rol: string }

interface AuthState {
  user: AuthUser | null
  users: { usuario: string; clave: string; nombre: string; rol: string }[]
  setUser: (u: AuthUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      users: [{ usuario: 'admin', clave: 'admin', nombre: 'Administrador', rol: 'Admin' }],
      setUser: (u) => set({ user: u }),
      logout: () => set({ user: null }),
    }),
    { name: 'homeux-auth-storage' }
  )
)
