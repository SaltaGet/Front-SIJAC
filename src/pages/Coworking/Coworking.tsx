import SelectRoom from "./SelectRoom";

const Coworking = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Minihero */}
      <section className="bg-gradient-to-r from-prim-500 to-prim-600 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Espacio Compartido para Abogados
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Oficinas profesionales, flexibles y con todo lo que necesitas para ejercer con comodidad y prestigio.
          </p>
        </div>
      </section>

      {/* Beneficios */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
          ¿Qué ofrecemos?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Tarjeta 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-prim-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-prim-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Oficinas Profesionales</h3>
            <p className="text-gray-600">
              Despachos privados o espacios compartidos, totalmente equipados para tu práctica legal.
            </p>
          </div>

          {/* Tarjeta 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-prim-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-prim-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Flexibilidad</h3>
            <p className="text-gray-600">
              Contratos por horas, días o meses. Sin ataduras ni costos fijos elevados.
            </p>
          </div>

          {/* Tarjeta 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition">
            <div className="w-12 h-12 bg-prim-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-prim-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Servicios Incluidos</h3>
            <p className="text-gray-600">
              Internet de alta velocidad, salas de reuniones, recepción de clientes y más.
            </p>
          </div>
        </div>
      </section>

      {/* CTA (opcional, lo puedes reemplazar luego por la sección de turnos) */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            ¿Listo para trabajar en un espacio profesional?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Reserva tu espacio ahora y enfócate en lo que realmente importa: tu práctica legal.
          </p>
          <SelectRoom />
        </div>
      </section>
    </div>
  );
};

export default Coworking;