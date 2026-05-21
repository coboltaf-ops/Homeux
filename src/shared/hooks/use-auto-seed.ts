'use client'

import { useEffect, useState } from 'react'
import { useClientesStore } from '@/features/clientes/store/clientes-store'
import { useProductosStore } from '@/features/productos/store/productos-store'
import { useSolicitudesStore } from '@/features/solicitudes/store/solicitudes-store'
import { usePersonalStore } from '@/features/personal/store/personal-store'
import { useCotizacionesStore } from '@/features/cotizaciones/store/cotizaciones-store'
import { useAuthStore } from '@/features/auth/store/auth-store'

const seedClientes = [
  {
    id: "cli-001", codigo: "C-0001",
    nombre: "Carlos", apellido: "Mendoza Rivera",
    correo: "carlos.mendoza@gmail.com", movil: "+51 987 654 321", telefono: "01 435 2210",
    tipo_vivienda: "Casa", estado_civil: "Casado",
    direccion: "Av. Javier Prado Este 1520",
    ciudad: "San Isidro", pais: "Peru", urbanizacion: "Los Alamos", situacion: "Activo"
  },
  {
    id: "cli-002", codigo: "C-0002",
    nombre: "Maria Elena", apellido: "Gutierrez Flores",
    correo: "megutierrez@hotmail.com", movil: "+51 912 345 678", telefono: "01 267 8834",
    tipo_vivienda: "Apartamento", estado_civil: "Soltero",
    direccion: "Jr. de la Union 482, Dpto 802",
    ciudad: "Lima", pais: "Peru", urbanizacion: "Centro Historico", situacion: "Activo"
  },
  {
    id: "cli-003", codigo: "C-0003",
    nombre: "Roberto", apellido: "Quispe Huaman",
    correo: "rquispe.h@gmail.com", movil: "+51 945 123 789", telefono: "",
    tipo_vivienda: "Casa", estado_civil: "Casado",
    direccion: "Calle Los Pinos 340",
    ciudad: "Miraflores", pais: "Peru", urbanizacion: "Aurora", situacion: "Activo"
  },
  {
    id: "cli-004", codigo: "C-0004",
    nombre: "Ana Lucia", apellido: "Vargas Castillo",
    correo: "avargas@outlook.com", movil: "+51 976 432 100", telefono: "01 512 7743",
    tipo_vivienda: "Townhouse", estado_civil: "Divorciado",
    direccion: "Av. La Encalada 1090",
    ciudad: "Lima", pais: "Peru", urbanizacion: "Monterrico", situacion: "Activo"
  },
  {
    id: "cli-005", codigo: "C-0005",
    nombre: "Fernando", apellido: "Torres Pachas",
    correo: "ftorres.pachas@gmail.com", movil: "+51 933 876 543", telefono: "",
    tipo_vivienda: "Apartamento", estado_civil: "Soltero",
    direccion: "Av. Arequipa 2850, Dpto 401",
    ciudad: "Lima", pais: "Peru", urbanizacion: "San Antonio", situacion: "Prospecto"
  },
  {
    id: "cli-006", codigo: "C-0006",
    nombre: "Lucia", apellido: "Paredes Salazar",
    correo: "luciaps@gmail.com", movil: "+51 961 222 333", telefono: "01 345 9912",
    tipo_vivienda: "Casa", estado_civil: "Casado",
    direccion: "Calle Monte Rosa 270",
    ciudad: "San Isidro", pais: "Peru", urbanizacion: "Chacarilla", situacion: "Activo"
  },
  {
    id: "cli-007", codigo: "C-0007",
    nombre: "Miguel Angel", apellido: "Ramirez Ochoa",
    correo: "mramirez.ochoa@yahoo.com", movil: "+51 998 111 444", telefono: "",
    tipo_vivienda: "Local Comercial", estado_civil: "Union Libre",
    direccion: "Av. Petit Thouars 1895",
    ciudad: "Lima", pais: "Peru", urbanizacion: "Lince", situacion: "Activo"
  },
  {
    id: "cli-008", codigo: "C-0008",
    nombre: "Patricia", apellido: "Herrera Montalvo",
    correo: "pherrera.m@gmail.com", movil: "+51 955 777 888", telefono: "01 478 3301",
    tipo_vivienda: "Casa", estado_civil: "Viudo",
    direccion: "Jr. Huallaga 1156",
    ciudad: "Lima", pais: "Peru", urbanizacion: "Barrios Altos", situacion: "Inactivo"
  }
]

const seedProductos = [
  {
    id: "prod-001", codigo: "SRV-PLO",
    nombre: "Servicio de Plomeria General",
    precio: 150, unidad_medida: "Servicio",
    descripcion: "Reparacion y mantenimiento de tuberias, grifos, inodoros, lavaderos y sistemas de agua. Incluye diagnostico inicial.",
    situacion: "Activo"
  },
  {
    id: "prod-002", codigo: "SRV-ELE",
    nombre: "Servicio de Electricidad Residencial",
    precio: 180, unidad_medida: "Servicio",
    descripcion: "Instalacion y reparacion de circuitos electricos, tomacorrientes, interruptores, tableros y cableado general.",
    situacion: "Activo"
  },
  {
    id: "prod-003", codigo: "SRV-PIN",
    nombre: "Pintura de Interiores",
    precio: 25, unidad_medida: "m2",
    descripcion: "Preparacion de superficie, empastado, lijado y aplicacion de 2 manos de pintura latex lavable. Incluye materiales.",
    situacion: "Activo"
  },
  {
    id: "prod-004", codigo: "SRV-LIM",
    nombre: "Limpieza Profunda de Hogar",
    precio: 200, unidad_medida: "Servicio",
    descripcion: "Limpieza exhaustiva de todos los ambientes: cocina, banos, salas, dormitorios. Incluye desinfeccion y aromatizacion.",
    situacion: "Activo"
  },
  {
    id: "prod-005", codigo: "SRV-JAR",
    nombre: "Mantenimiento de Jardines",
    precio: 120, unidad_medida: "Servicio",
    descripcion: "Poda de arboles y arbustos, corte de cesped, fumigacion, abono y riego. Para jardines de hasta 100 m2.",
    situacion: "Activo"
  },
  {
    id: "prod-006", codigo: "SRV-CER",
    nombre: "Servicio de Cerrajeria",
    precio: 80, unidad_medida: "Servicio",
    descripcion: "Apertura de puertas, cambio de chapas, instalacion de cerraduras de seguridad, copias de llaves.",
    situacion: "Activo"
  },
  {
    id: "prod-007", codigo: "SRV-CAR",
    nombre: "Carpinteria y Muebles",
    precio: 220, unidad_medida: "Servicio",
    descripcion: "Reparacion de muebles, instalacion de closets, repisas, puertas de madera. Incluye materiales basicos.",
    situacion: "Activo"
  },
  {
    id: "prod-008", codigo: "SRV-INS",
    nombre: "Instalacion de Accesorios",
    precio: 90, unidad_medida: "Servicio",
    descripcion: "Instalacion de cortinas, espejos, cuadros, repisas flotantes, soportes de TV y accesorios de bano.",
    situacion: "Activo"
  },
  {
    id: "prod-009", codigo: "SRV-PIS",
    nombre: "Instalacion de Pisos",
    precio: 45, unidad_medida: "m2",
    descripcion: "Instalacion de pisos laminados, vinilicos o ceramicos. Incluye preparacion de base y zocalos.",
    situacion: "Activo"
  },
  {
    id: "prod-010", codigo: "SRV-REM",
    nombre: "Remodelacion de Banos",
    precio: 2500, unidad_medida: "Servicio",
    descripcion: "Remodelacion completa de bano: cambio de sanitarios, mayolicas, griferia, accesorios e iluminacion. Incluye mano de obra y materiales.",
    situacion: "Activo"
  }
]

const seedSolicitudes = [
  {
    id: "sol-001", nro_solicitud: "SOL-2026-001", fecha: "2026-03-15",
    nombre: "Carlos", apellido: "Mendoza Rivera",
    correo: "carlos.mendoza@gmail.com", movil: "+51 987 654 321",
    tipo_trabajo: "Plomeria", fecha_estimada_inicio: "2026-03-20",
    descripcion: "Fuga de agua en la tuberia del segundo piso. El lavadero de la cocina tambien presenta filtracion. Requiere revision urgente del sistema de agua caliente.",
    tipo_vivienda: "Casa", urbanizacion: "Los Alamos", nro_casa_apto: "Lote 15",
    ciudad: "San Isidro", pais: "Peru", situacion: "En Proceso"
  },
  {
    id: "sol-002", nro_solicitud: "SOL-2026-002", fecha: "2026-03-18",
    nombre: "Maria Elena", apellido: "Gutierrez Flores",
    correo: "megutierrez@hotmail.com", movil: "+51 912 345 678",
    tipo_trabajo: "Electricidad", fecha_estimada_inicio: "2026-03-25",
    descripcion: "Los tomacorrientes de la sala y el dormitorio principal no funcionan. Tambien necesito instalar un punto de luz adicional en el estudio.",
    tipo_vivienda: "Apartamento", urbanizacion: "Centro Historico", nro_casa_apto: "Dpto 802",
    ciudad: "Lima", pais: "Peru", situacion: "Nueva"
  },
  {
    id: "sol-003", nro_solicitud: "SOL-2026-003", fecha: "2026-03-20",
    nombre: "Roberto", apellido: "Quispe Huaman",
    correo: "rquispe.h@gmail.com", movil: "+51 945 123 789",
    tipo_trabajo: "Pintura", fecha_estimada_inicio: "2026-04-01",
    descripcion: "Pintar toda la fachada de la casa (aprox 120 m2) y retocar la pintura interior de la sala y comedor. Color exterior: blanco humo. Interior: beige claro.",
    tipo_vivienda: "Casa", urbanizacion: "Aurora", nro_casa_apto: "340",
    ciudad: "Miraflores", pais: "Peru", situacion: "Nueva"
  },
  {
    id: "sol-004", nro_solicitud: "SOL-2026-004", fecha: "2026-03-10",
    nombre: "Ana Lucia", apellido: "Vargas Castillo",
    correo: "avargas@outlook.com", movil: "+51 976 432 100",
    tipo_trabajo: "Limpieza Profunda", fecha_estimada_inicio: "2026-03-12",
    descripcion: "Limpieza profunda de todo el townhouse de 3 pisos despues de remodelacion. Incluye limpieza de ventanas, pisos y banos.",
    tipo_vivienda: "Townhouse", urbanizacion: "Monterrico", nro_casa_apto: "TH-12",
    ciudad: "Lima", pais: "Peru", situacion: "Completada"
  },
  {
    id: "sol-005", nro_solicitud: "SOL-2026-005", fecha: "2026-03-22",
    nombre: "Lucia", apellido: "Paredes Salazar",
    correo: "luciaps@gmail.com", movil: "+51 961 222 333",
    tipo_trabajo: "Jardineria", fecha_estimada_inicio: "2026-03-28",
    descripcion: "Mantenimiento completo del jardin: podar los arboles frutales, cortar el cesped, fumigar contra plagas y sembrar flores de temporada.",
    tipo_vivienda: "Casa", urbanizacion: "Chacarilla", nro_casa_apto: "270",
    ciudad: "San Isidro", pais: "Peru", situacion: "Nueva"
  },
  {
    id: "sol-006", nro_solicitud: "SOL-2026-006", fecha: "2026-03-25",
    nombre: "Miguel Angel", apellido: "Ramirez Ochoa",
    correo: "mramirez.ochoa@yahoo.com", movil: "+51 998 111 444",
    tipo_trabajo: "Carpinteria", fecha_estimada_inicio: "2026-04-05",
    descripcion: "Necesito instalar un closet empotrado en el dormitorio y reparar la puerta principal del local que esta descuadrada.",
    tipo_vivienda: "Local Comercial", urbanizacion: "Lince", nro_casa_apto: "1895-A",
    ciudad: "Lima", pais: "Peru", situacion: "En Proceso"
  }
]

const seedPersonal = [
  {
    id: "per-001", codigo: "TEC-001", tipo: "Persona",
    tipo_identificacion: "DNI", nro_documento: "45678912",
    nombre: "Jorge Luis", apellido: "Huamani Quispe",
    correo: "jhuamani@gmail.com", telefono: "01 345 6789", movil: "+51 923 456 789",
    estado_civil: "Casado", fecha_nacimiento: "1988-05-14",
    formacion: "Tecnico",
    habilidades: ["Plomeria Residencial", "Instalacion de Pisos", "Albaileria"],
    ha_trabajado_con_nosotros: true, fecha_ingreso_plantilla: "2024-02-01",
    referencias: "Trabajo 5 anos en Constructora Los Andes. Certificado SENCICO en plomeria e instalaciones sanitarias.",
    situacion: "Activo"
  },
  {
    id: "per-002", codigo: "TEC-002", tipo: "Persona",
    tipo_identificacion: "DNI", nro_documento: "72345678",
    nombre: "Edwin", apellido: "Condori Mamani",
    correo: "econdori.m@hotmail.com", telefono: "", movil: "+51 945 678 123",
    estado_civil: "Soltero", fecha_nacimiento: "1995-11-22",
    formacion: "Tecnico",
    habilidades: ["Electricidad Residencial", "Instalacion de Pisos"],
    ha_trabajado_con_nosotros: true, fecha_ingreso_plantilla: "2024-06-15",
    referencias: "Egresado de SENATI en electricidad industrial. 3 anos de experiencia en mantenimiento de edificios.",
    situacion: "Activo"
  },
  {
    id: "per-003", codigo: "TEC-003", tipo: "Persona",
    tipo_identificacion: "DNI", nro_documento: "41234567",
    nombre: "Rosa", apellido: "Flores Choque",
    correo: "rflores.ch@gmail.com", telefono: "01 567 8901", movil: "+51 967 890 123",
    estado_civil: "Union Libre", fecha_nacimiento: "1990-08-03",
    formacion: "Secundaria",
    habilidades: ["Pintura Interior", "Pintura Exterior", "Limpieza Profunda"],
    ha_trabajado_con_nosotros: true, fecha_ingreso_plantilla: "2023-09-10",
    referencias: "10 anos de experiencia en pintura decorativa y acabados. Trabajo en proyectos residenciales en Miraflores y San Isidro.",
    situacion: "Activo"
  },
  {
    id: "per-004", codigo: "TEC-004", tipo: "Persona",
    tipo_identificacion: "DNI", nro_documento: "48765432",
    nombre: "Pedro", apellido: "Sullca Ramos",
    correo: "psullca@gmail.com", telefono: "", movil: "+51 911 234 567",
    estado_civil: "Casado", fecha_nacimiento: "1985-02-17",
    formacion: "Autodidacta",
    habilidades: ["Carpinteria", "Cerrajeria", "Jardineria"],
    ha_trabajado_con_nosotros: false, fecha_ingreso_plantilla: "",
    referencias: "Maestro carpintero independiente con 15 anos de experiencia. Especialista en muebles a medida y closets empotrados.",
    situacion: "En Evaluacion"
  }
]

const seedCotizaciones = [
  {
    id: "cot-001", nro_cotizacion: "COT-2026-001", fecha: "2026-03-16",
    solicitud_id: "sol-001", cliente_id: "cli-001",
    items: [
      { producto_id: "prod-001", cantidad: 1, precio_unitario: 150, subtotal: 150 },
      { producto_id: "prod-008", cantidad: 2, precio_unitario: 90, subtotal: 180 }
    ],
    total: 330,
    observaciones: "Incluye revision completa del sistema de agua del segundo piso y reinstalacion de 2 accesorios de bano. Garantia de 30 dias en mano de obra.",
    situacion: "En Proceso"
  },
  {
    id: "cot-002", nro_cotizacion: "COT-2026-002", fecha: "2026-03-21",
    solicitud_id: "sol-003", cliente_id: "cli-003",
    items: [
      { producto_id: "prod-003", cantidad: 120, precio_unitario: 25, subtotal: 3000 },
      { producto_id: "prod-003", cantidad: 40, precio_unitario: 25, subtotal: 1000 }
    ],
    total: 4000,
    observaciones: "Fachada exterior 120 m2 en blanco humo. Interior sala y comedor 40 m2 en beige claro. Incluye empastado, sellador y 2 manos de pintura. Tiempo estimado: 5 dias habiles.",
    situacion: "Nueva"
  },
  {
    id: "cot-003", nro_cotizacion: "COT-2026-003", fecha: "2026-03-11",
    solicitud_id: "sol-004", cliente_id: "cli-004",
    items: [
      { producto_id: "prod-004", cantidad: 3, precio_unitario: 200, subtotal: 600 }
    ],
    total: 600,
    observaciones: "Limpieza profunda de 3 pisos del townhouse post-remodelacion. Se requiere equipo de 3 personas por 1 dia completo. Incluye productos de limpieza y desinfeccion.",
    situacion: "Completada"
  }
]

const seedUsers = [
  { usuario: "admin", clave: "admin", nombre: "Administrador", rol: "Admin" },
  { usuario: "jpalomares", clave: "1234", nombre: "Jose Palomares", rol: "Admin" },
  { usuario: "mgarcia", clave: "1234", nombre: "Maria Garcia", rol: "Operador" }
]

export function useAutoSeed() {
  const [seeded, setSeeded] = useState(false)

  useEffect(() => {
    if (seeded) return

    // Esperar a que Zustand hidrate desde localStorage
    const unsub = useClientesStore.persist.onFinishHydration(() => {
      const { clientes } = useClientesStore.getState()
      if (clientes.length > 0) { setSeeded(true); return }

      useClientesStore.setState({ clientes: seedClientes })
      useProductosStore.setState({ productos: seedProductos })
      useSolicitudesStore.setState({ solicitudes: seedSolicitudes })
      usePersonalStore.setState({ personal: seedPersonal })
      useCotizacionesStore.setState({ cotizaciones: seedCotizaciones })
      useAuthStore.setState({ users: seedUsers })
      setSeeded(true)
    })

    // Si ya hidrato antes de montar
    if (useClientesStore.persist.hasHydrated()) {
      const { clientes } = useClientesStore.getState()
      if (clientes.length === 0) {
        useClientesStore.setState({ clientes: seedClientes })
        useProductosStore.setState({ productos: seedProductos })
        useSolicitudesStore.setState({ solicitudes: seedSolicitudes })
        usePersonalStore.setState({ personal: seedPersonal })
        useCotizacionesStore.setState({ cotizaciones: seedCotizaciones })
        useAuthStore.setState({ users: seedUsers })
      }
      setSeeded(true)
    }

    return unsub
  }, [seeded])
}
