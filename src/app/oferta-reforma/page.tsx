'use client';

import React from 'react';
import Image from 'next/image';

const hoje = new Date();
const fechaHoy = hoje.toLocaleDateString('es-CO', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

export default function OfertaReforma() {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [videoModalOpen, setVideoModalOpen] = React.useState(false);

  const servicios = [
    {
      id: 1,
      titulo: "Desmontar e Instalar Sanitarios",
      descripcion: "Desmontar cuatro sanitarios e instalar unos nuevos con doble descarga para líquidos y sólidos. Incluye suministro de mano de obra y materiales (copa 4x3, cemento blanco, sikaflex, teflón).",
      costo: 780000,
      imagenes: ["/reformas/image copy 3.png"],
      detalles: "Se retirarán todos los sanitarios existentes, se realizará adecuación de tuberías y se instalarán equipos nuevos de alta eficiencia."
    },
    {
      id: 2,
      titulo: "Desmonte y Disposición de Cocina",
      descripcion: "Desmontar toda la cocina retirando mármol y muebles. Disposición adecuada de escombros y residuos con transporte incluido.",
      costo: 650000,
      imagenes: ["/reformas/image copy 4.png"],
      detalles: "Retiro completo de cocina, mármol y muebles. Limpieza profunda del espacio y disposición de residuos en lugar autorizado."
    },
    {
      id: 3,
      titulo: "Reformar Tomas Eléctricas",
      descripcion: "Reformar dos tomas de luz a 110V para campana extractora y horno microondas. Incluye todos los materiales y mano de obra.",
      costo: 195000,
      imagenes: ["/reformas/image copy 9.png"],
      detalles: "Instalación de tomas eléctricas con estándares de seguridad. Cableado interno con protección y distribución adecuada."
    },
    {
      id: 4,
      titulo: "Nivelar Rebanco de Cocina",
      descripcion: "Nivelar y resanar el rebanco de cocina, retirar imperfecciones y esmaltar para que quede higiénico y bien nivelado.",
      costo: 585000,
      imagenes: ["/reformas/image copy 4.png"],
      detalles: "Preparación de superficie, resane de imperfecciones y acabado higiénico para recibir mobiliario nuevo."
    },
    {
      id: 5,
      titulo: "Instalar Luces LED Lineales",
      descripcion: "Montar dos luces lineales incrustadas en cielo falso. Incluye ruteado, conexión interna, chasis en aluminio blanco y luces LED blancas.",
      costo: 715000,
      imagenes: ["/reformas/image copy 7.png"],
      detalles: "Instalación de iluminación moderna con tecnología LED. Bajo consumo energético y acabado profesional en aluminio."
    },
    {
      id: 6,
      titulo: "Condenar Luz Antigua",
      descripcion: "Condenar luz actual en cocina, retirar lámpara, resanar hueco y dar acabado profesional.",
      costo: 195000,
      imagenes: [],
      detalles: "Retiro de luminaria antigua, cierre de ductos eléctricos y resane profesional sin dejar marcas visibles."
    },
    {
      id: 7,
      titulo: "Instalar Tomas y Switches",
      descripcion: "Instalar tomas, switches y accesorios eléctricos en toda la casa. Retirar los antiguos y poner en funcionamiento adecuado.",
      costo: 590000,
      imagenes: ["/reformas/image copy 9.png"],
      detalles: "Retiro de accesorios antiguos e instalación de nuevos con distribución funcional. Solo mano de obra (materiales suministrados por cliente)."
    },
    {
      id: 8,
      titulo: "Pelar y Resanar Cielos Falsos",
      descripcion: "Pelar y resanar cielos falsos de dos baños que presentaban humedad. Dar acabado profesional a la vista.",
      costo: 390000,
      imagenes: ["/reformas/image copy 2.png"],
      detalles: "Reparación de daños por humedad, resane profesional y pintura de acabado en cielos falsos."
    },
    {
      id: 9,
      titulo: "Pintura Completa del Apartamento",
      descripcion: "Pintar todo el apartamento (3 alcobas, 4 baños, sala, comedor, pasillo, cocina, área de ropas). Trabajo sectorizado, desplazar y reposicionar enseres.",
      costo: 4500000,
      imagenes: ["/reformas/image copy 8.png"],
      detalles: "Pintura integral con protección de muebles. Trabajo por sectores para minimizar molestias. Acabado profesional de alta durabilidad."
    }
  ];

  const totalCosto = servicios.reduce((sum, s) => sum + s.costo, 0);

  return (
    <div className="bg-white p-0 m-0 w-full">
      <div className="w-full">
        {/* Contenido para PDF */}
        <div ref={contentRef} className="w-full">
          {/* PÁGINA 1: PORTADA */}
          <div className="pdf-page bg-gradient-to-br from-blue-900 to-blue-600 text-white h-screen flex flex-col justify-center items-center p-0 text-center w-full">
            <div className="mb-8">
              <h1 className="text-5xl font-bold mb-2">PROPUESTA COMERCIAL</h1>
              <h2 className="text-3xl font-semibold mb-4 text-blue-100">PARA REFORMAS</h2>
              <div className="w-24 h-1 bg-blue-200 mx-auto mb-8"></div>
            </div>

            <div className="space-y-6 text-lg">
              <div>
                <p className="text-blue-200 mb-1 text-sm">PROPUESTA DIRIGIDA A</p>
                <p className="text-2xl font-bold">Juan Fernando Gómez</p>
                <p className="text-base text-blue-100 mt-1">Edificio Entrepinos - Apto 502</p>
              </div>

              <div>
                <p className="text-blue-200 mb-1 text-sm">PREPARADO POR</p>
                <p className="text-3xl font-bold">León Jaime Velásquez</p>
                <p className="text-base text-blue-100 mt-2">📱 315 5003157</p>
              </div>

              <div className="text-base">
                <p className="text-blue-200 mb-1 text-sm">Fecha</p>
                <p className="text-xl font-semibold capitalize">{fechaHoy}</p>
              </div>

              <div className="text-blue-200 text-xs mt-8 pt-6 border-t border-blue-400">
                <p>Medellín, Colombia</p>
                <p className="mt-1">Reforma Integral de Apartamento</p>
              </div>
            </div>
          </div>

          {/* PÁGINA 2: INTRODUCCIÓN */}
          <div className="pdf-page bg-white h-screen p-8 flex flex-col justify-between w-full">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-8 border-b-4 border-gray-300 pb-4">
                Introducción
              </h1>

              <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                <p>
                  Es un honor presentar esta propuesta integral de remodelación. León Jaime Velásquez,
                  con amplia experiencia en el sector de reformas y construcción, le presenta un proyecto
                  diseñado para transformar su espacio en un ambiente moderno, funcional y de alta calidad.
                </p>

                <p>
                  Esta propuesta comprende un plan detallado de renovación que incluye:
                </p>

                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Cambio completo de sanitarios con tecnología de doble descarga</li>
                  <li>Reforma integral de cocina</li>
                  <li>Modernización de instalaciones eléctricas</li>
                  <li>Acabados y pulimentos profesionales</li>
                  <li>Pintura completa del apartamento</li>
                </ul>

                <p>
                  Nuestro equipo garantiza calidad en cada detalle, utilizando materiales de primera línea
                  y profesionales especializados en cada área de trabajo. Cada labor será ejecutada con
                  precisión, respeto por su espacio y cumplimiento de los más altos estándares de calidad.
                </p>

              </div>
            </div>

            <div className="text-center text-gray-500 text-sm mt-12">
              <p>Página 2</p>
            </div>
          </div>

          {/* PÁGINAS 3+: UN SERVICIO POR PÁGINA */}
          {servicios.map((servicio, idx) => (
            <div key={servicio.id} className="pdf-page bg-white h-screen p-8 flex flex-col justify-center w-full" id={servicio.id === 9 ? 'video-pintura' : undefined}>
              <div className="w-full max-w-3xl mx-auto">
                <div className="mb-8 border-b-4 border-blue-600 pb-4 text-center">
                  <p className="text-blue-600 font-semibold text-sm">SERVICIO {idx + 1} DE {servicios.length}</p>
                  <h1 className="text-3xl font-bold text-gray-900 mt-2">{servicio.titulo}</h1>
                </div>

                {/* Video para Pintura Completa, Imágenes para otros servicios */}
                {servicio.id === 9 ? (
                  <div className="my-8 flex flex-col items-center justify-center gap-4">
                    <div className="w-72 flex justify-center">
                      <div className="w-full rounded-lg overflow-hidden border-3 border-gray-300 shadow-md bg-gray-50">
                        <video
                          width="280"
                          height="220"
                          controls
                          controlsList="nodownload"
                          className="w-full h-auto bg-black"
                          style={{ objectFit: 'contain' }}
                          preload="metadata"
                        >
                          <source src="/reformas/video-pintada-apartamento.mp4" type="video/mp4" />
                          Tu navegador no soporta videos HTML5
                        </video>
                      </div>
                    </div>
                    <a
                      href="https://homeux-green.vercel.app/oferta-reforma#video-pintura"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm cursor-pointer inline-block"
                    >
                      📺 Ver Video Completo
                    </a>
                    <p className="text-gray-600 text-xs mt-3">
                      <a
                        href="https://homeux-green.vercel.app/oferta-reforma#video-pintura"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 underline"
                      >
                        homeux-green.vercel.app/oferta-reforma
                      </a>
                    </p>
                  </div>
                ) : servicio.imagenes && servicio.imagenes.length > 0 && (
                  <div className="my-8 flex flex-col items-center justify-center">
                    {servicio.imagenes.map((img, imgIdx) => (
                      <div key={imgIdx} className="w-72 flex justify-center">
                        <div className="w-full rounded-lg overflow-hidden border-3 border-gray-300 shadow-md bg-gray-50 flex items-center justify-center p-4">
                          <Image
                            src={img}
                            alt={`${servicio.titulo} - imagen ${imgIdx + 1}`}
                            width={280}
                            height={220}
                            className="object-contain max-w-full h-auto"
                            priority
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Descripción */}
                <div className="mt-8 space-y-5 text-center">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Descripción</h3>
                    <p className="text-gray-700 leading-relaxed text-base">
                      {servicio.descripcion}
                    </p>
                  </div>

                  {servicio.detalles && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Detalles del Trabajo</h3>
                      <p className="text-gray-700 leading-relaxed text-base">
                        {servicio.detalles}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* PÁGINA FINAL: RESPONSABILIDADES, PRECAUCIONES Y CONDICIONES */}
          <div className="pdf-page bg-white min-h-screen p-12 flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold text-blue-900 mb-8 border-b-4 border-blue-600 pb-4">
                Términos y Condiciones
              </h1>

              <div className="space-y-8">
                {/* Responsabilidades */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Responsabilidades en el Trabajo</h2>
                  <div className="bg-blue-50 p-6 rounded-lg space-y-2">
                    <p className="text-gray-700"><strong>Nuestro equipo se compromete a:</strong></p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
                      <li>Ejecutar los trabajos con calidad profesional y criterio técnico</li>
                      <li>Utilizar materiales de primera calidad según especificaciones</li>
                      <li>Cumplir con los tiempos y cronograma establecido</li>
                      <li>Mantener el espacio limpio y organizado durante la obra</li>
                      <li>Proporcionar garantía sobre los trabajos realizados</li>
                      <li>Respetar los horarios y proteger los enseres del cliente</li>
                      <li>Dar respuesta oportuna a requerimientos y consultas</li>
                    </ul>
                  </div>
                </div>

                {/* Precauciones */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">⚠️ Precauciones a Tener en Cuenta</h2>
                  <div className="bg-yellow-50 p-6 rounded-lg space-y-2">
                    <p className="text-gray-700"><strong>Durante la ejecución del proyecto:</strong></p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
                      <li>El apartamento estará ocupado, por lo que se trabajará de forma sectorizada</li>
                      <li>Se debe proteger mobiliario y enseres personales</li>
                      <li>El cliente debe verificar suministros antes de iniciar trabajos</li>
                      <li>Se realizará limpieza diaria de escombros y residuos</li>
                      <li>Habrá ruido y polvo durante ciertos trabajos (se dará aviso previo)</li>
                      <li>Es recomendable desalojar temporalmente áreas durante pintura y acabados</li>
                      <li>Se debe garantizar acceso seguro a áreas de trabajo</li>
                    </ul>
                  </div>
                </div>

                {/* Condiciones de Pago */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">💳 Condiciones de Pago</h2>
                  <div className="bg-green-50 p-4 rounded-lg space-y-2">
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-2">
                      <li><strong>60% Anticipo</strong> para materiales</li>
                      <li><strong>40% a la entrega</strong> a satisfacción</li>
                    </ul>
                    <p className="text-gray-600 text-xs mt-2"><em>*Condiciones sujetas a negociación.</em></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-gray-500 text-sm mt-12 border-t pt-4">
              <p>Página {servicios.length + 3}</p>
            </div>
          </div>

          {/* PÁGINA RESUMEN FINANCIERO DETALLADO */}
          <div className="pdf-page bg-white min-h-screen p-12 flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white bg-blue-900 p-6 rounded-lg mb-8 text-center">
                Resumen Detallado de Servicios
              </h1>

              <div className="space-y-2 mb-6">
                {servicios.map((servicio, idx) => (
                  <div key={servicio.id} className="p-3 bg-white rounded-lg border border-blue-200">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-bold text-gray-900 text-sm">
                        {idx + 1}. {servicio.titulo}
                      </span>
                      <span className="text-base font-bold text-blue-600 whitespace-nowrap">
                        ${servicio.costo.toLocaleString('es-CO')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-900 to-blue-600 text-white p-8 rounded-lg text-center mb-6">
                <p className="text-lg font-semibold mb-2">TOTAL GENERAL DE LA PROPUESTA</p>
                <p className="text-5xl font-bold">${totalCosto.toLocaleString('es-CO')}</p>
                <p className="text-blue-100 text-sm mt-2">Pesos Colombianos (COP)</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-200">
                  <p className="text-gray-900 font-bold mb-2 text-sm">📅 Validez de Oferta</p>
                  <p className="text-gray-700 font-bold text-lg">15 días hábiles</p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border-2 border-red-300">
                  <p className="text-red-700 font-bold mb-2 text-sm">⚠️ OBSERVACIONES</p>
                  <p className="text-gray-700 text-xs leading-tight">El mueble que se hará en zona de ropas será cotizado posteriormente.</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                <p className="text-gray-700 text-xs font-semibold mb-2">ℹ️ Información Importante:</p>
                <ul className="text-gray-700 space-y-1 list-disc list-inside text-xs">
                  <li>Precios sujetos a disponibilidad de materiales</li>
                  <li>No incluye cambios sin cotización adicional</li>
                  <li>Garantía de 1 año en trabajos de acabado</li>
                </ul>
              </div>
            </div>

            <div className="text-center text-gray-500 text-sm mt-12 border-t pt-4">
              <p>Página {servicios.length + 4}</p>
            </div>
          </div>

          {/* PÁGINA 14: INFORMACIÓN DE CONTACTO */}
          <div className="pdf-page bg-black text-white h-screen flex flex-col justify-center items-center text-center p-8 w-full">
            <div className="space-y-8">
              <div>
                <p className="text-2xl font-semibold mb-2">CONTACTO</p>
                <div className="w-32 h-1 bg-white mx-auto mb-6"></div>
              </div>

              <div className="space-y-6 text-lg">
                <div>
                  <p className="text-4xl font-bold">León Jaime Velásquez</p>
                </div>

                <div>
                  <p className="text-2xl font-semibold">📱 314 500 3157</p>
                </div>

                <div>
                  <p className="text-2xl font-semibold">📍 Medellín, Colombia</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* MODAL PARA VER VIDEO COMPLETO - FUERA DEL PDF */}
      {videoModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setVideoModalOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-300 z-10 bg-black rounded-full w-10 h-10 flex items-center justify-center"
            >
              ✕
            </button>

            <video
              width="100%"
              height="600"
              controls
              autoPlay
              className="w-full rounded-lg"
              style={{ maxHeight: '80vh' }}
            >
              <source src="/reformas/video-pintada-apartamento.mp4" type="video/mp4" />
              Tu navegador no soporta videos HTML5
            </video>

            <p className="text-white text-center mt-4 text-sm">
              Haz clic en la X o fuera del video para cerrar
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
