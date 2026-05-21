import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Producto = {
  id: string
  codigo: string
  nombre: string
  precio: number
  unidad_medida: string
  descripcion: string
  situacion: string
}

interface ProductosState {
  productos: Producto[]
  addProducto: (p: Producto) => void
  updateProducto: (id: string, p: Partial<Producto>) => void
  deleteProducto: (id: string) => void
}

export const useProductosStore = create<ProductosState>()(
  persist(
    (set) => ({
      productos: [],
      addProducto: (p) => set((s) => ({ productos: [...s.productos, p] })),
      updateProducto: (id, p) => set((s) => ({ productos: s.productos.map((r) => r.id === id ? { ...r, ...p } : r) })),
      deleteProducto: (id) => set((s) => ({ productos: s.productos.filter((r) => r.id !== id) })),
    }),
    { name: 'homeux-productos-storage' }
  )
)
