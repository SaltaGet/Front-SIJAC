import { useUser } from "@/hooks/client/useUser";
// import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
// import { motion, useInView } from "framer-motion";
import CarruselNosotros from "@/components/carrusel/CarruselNosotros";
import portada from "@/assets/fotos/portada.png";
import { motion } from "framer-motion";
import React, { useRef } from "react";

const Home: React.FC = () => {
  const { usersData } = useUser();
  // const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const equipoRef = useRef(null);
  // const isInView = useInView(equipoRef, { once: true });

  // const handleCardClick = (userId: string) => {
  //   setFlippedCards(prev => ({
  //     ...prev,
  //     [userId]: !prev[userId]
  //   }));
  // };

  // useEffect(() => {
  //   if (isInView && usersData) {
  //     const reset: Record<string, boolean> = {};
  //     usersData.forEach(u => reset[u.id] = true);
  //     setFlippedCards(reset);

  //     const timeout = setTimeout(() => setFlippedCards({}), 2000);
  //     return () => clearTimeout(timeout);
  //   }
  // }, [isInView, usersData]);

  return (
    <motion.div
      className="flex flex-col text-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Hero */}
      <section
        className="bg-cover bg-center text-white py-24 px-6 text-center bg-black/60 bg-blend-multiply"
        style={{ backgroundImage: `url(${portada})` }}
      >
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold mb-2"
        >
          SIJAC
        </motion.h1>
        <motion.p
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-xl font-semibold tracking-wide mb-6"
        >
          SERVICIOS INTEGRALES JURIDICOS ADMINISTRATIVOS Y COMERCIALES
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="max-w-xl text-base mx-auto mb-8"
        >
          En SIJAC Brindamos Servicio Jurídico Integral con un enfoque global,
          visión local y perspectiva Humana.
        </motion.p>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex justify-center gap-4 flex-wrap"
        >
          <button className="bg-white text-prim-500 font-semibold px-6 py-3 rounded-full hover:bg-prim-50 shadow transition">
            Contacto
          </button>
          <Link
            to="/turnos"
            className="bg-prim-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-prim-600 shadow transition"
          >
            Pedir Turno
          </Link>
        </motion.div>
      </section>

      {/* Nosotros */}
      <motion.section
        id="nosotros"
        className="py-16 px-6 bg-white text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-prim-500">Nosotros</h2>
      </motion.section>
      {/* Cards de Valores y Objetivos */}
      <motion.section
        className="py-16 px-6 bg-gray-100 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 cursor-pointer transition-all duration-300"
          >
            <h3 className="text-xl font-bold text-prim-500 mb-3">
              ¿Quienes Somos?
            </h3>
            <p className="text-gray-700 text-base">
              Somos un Equipo de profesionales especialistas en cada área del
              Derecho y Disciplinas afines, pasantes y personal Administrativo,
              que complementa nuestra tarea íntegra y sostenible, que nos
              permite brindar asesoramiento integral de primer nivel, reconocido
              por su calidad profesional y su perfil humano.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 cursor-pointer transition-all duration-300"
          >
            <h3 className="text-xl font-bold text-prim-500 mb-3">Objetivo</h3>
            <p className="text-gray-700 text-base">
              Ofrecer a nuestros Clientes un Asesoramiento legal de excelencia,
              Acompañamiento y seguimiento para ayudar a conseguir Resultados
              adecuados y soluciones estratégicas, a la medida de cada caso.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 cursor-pointer transition-all duration-300"
          >
            <h3 className="text-xl font-bold text-prim-500 mb-3">Mision</h3>
            <p className="text-gray-700 text-base">
              Continuar creciendo en el Asesoramiento a particulares,
              Instituciones y Empresas, conforme a nuevos paradigmas
              corporativos y Derecho Moderno, que nos motiva a estar a la
              Vanguardia, en una práctica original e innovadora.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 cursor-pointer transition-all duration-300"
          >
            <h3 className="text-xl font-bold text-prim-500 mb-3">Vision</h3>
            <p className="text-gray-700 text-base">
              Colaborar a la formación y crecimiento profesional, ofreciendo
              excelentes oportunidades para formar parte de nuestra Consultora,
              Apostando a la construcción de una comunidad más justa y
              consciente.
            </p>
          </motion.div>
        </div>
      </motion.section>

      <CarruselNosotros />

     {/* Nuestro Equipo - Versión corregida para móvil */}
      <motion.section
        id="profesionales"
        ref={equipoRef}
        className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-50 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-prim-500">
          Nuestro Equipo
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {usersData?.map((user, idx) => (
            <motion.div
              key={user.id}
              className="w-full mx-auto max-w-xs"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              {/* Versión Desktop - Card con flip */}
              <div className="relative h-80 sm:h-96 [perspective:1000px] group hidden sm:block">
                <div className="absolute inset-0 w-full h-full rounded-xl shadow-md border border-gray-200 transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* Frente Desktop */}
                  <div
                    style={{ backfaceVisibility: "hidden" }}
                    className="absolute inset-0 w-full h-full bg-white rounded-xl overflow-hidden"
                  >
                    <motion.img
                      src={user.url_image}
                      alt={`${user.first_name} ${user.last_name}`}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      loading="lazy"
                    />
                  </div>

                  {/* Reverso Desktop */}
                  <div
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                    }}
                    className="absolute inset-0 w-full h-full bg-prim-500 text-white rounded-xl p-6 flex flex-col justify-center overflow-y-auto"
                  >
                    <div className="text-center mb-6">
                      <h3 className="font-bold text-xl lg:text-2xl mb-3 leading-tight text-slate-100">
                        {user.first_name.toUpperCase()}{" "}
                        {user.last_name.toUpperCase()}
                      </h3>
                      {user.specialty
                        .toLowerCase()
                        .includes("mediaciones extrajudiciales") && (
                        <span className="inline-block bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-semibold tracking-wide">
                          MEDIACIONES EXTRAJUDICIALES
                        </span>
                      )}
                    </div>
                    <div className="flex-1 flex items-start justify-center">
                      <ul className="text-white/90 font-medium space-y-2 text-left max-w-xs">
                        {user.specialty
                          .split("-")
                          .filter(item => 
                            item.trim() && 
                            !item.trim().toLowerCase().includes("mediaciones extrajudiciales")
                          )
                          .map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="w-1 h-1 bg-white/70 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                              <span className="text-sm leading-relaxed">
                                {item.trim()}
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Versión Mobile - Layout vertical */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden sm:hidden">
                {/* Foto */}
                <div className="relative h-64">
                  <motion.img
                    src={user.url_image}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                
                {/* Información */}
                <div className="p-4">
                  {/* Nombre */}
                  <div className="text-center mb-3">
                    <h3 className="font-bold text-lg text-prim-600 mb-2">
                      {user.first_name.toUpperCase()}{" "}
                      {user.last_name.toUpperCase()}
                    </h3>
                    {user.specialty
                      .toLowerCase()
                      .includes("mediaciones extrajudiciales") && (
                      <span className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-3">
                        MEDIACIONES EXTRAJUDICIALES
                      </span>
                    )}
                  </div>
                  
                  {/* Especialidades */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-700 text-center mb-3">Especialidades:</h4>
                    <div className="space-y-1">
                      {user.specialty
                        .split("-")
                        .filter(item => 
                          item.trim() && 
                          !item.trim().toLowerCase().includes("mediaciones extrajudiciales")
                        )
                        .map((item, index) => (
                          <div key={index} className="flex items-start bg-gray-50 rounded-lg p-2">
                            <span className="w-2 h-2 bg-prim-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                            <span className="text-xs text-gray-700 leading-relaxed">
                              {item.trim()}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Fallback si no hay datos */}
        {!usersData && (
          <div className="text-center py-8">
            <p className="text-gray-500">Cargando equipo...</p>
          </div>
        )}
        
        {usersData && usersData.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay profesionales disponibles</p>
          </div>
        )}
      </motion.section>

      {/* Mediaciones */}
      <motion.section
        id="mediaciones"
        className="py-16 px-6 bg-white text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-prim-500">
          Centro Privado de Mediación
        </h2>
        <h2 className="text-3xl font-bold mb-6 text-prim-500">
          "PODEMOS HABLAR"
        </h2>
      </motion.section>

      {/* Cards de Mediación */}
      <motion.section
        className="py-16 px-6 bg-gray-100"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 cursor-pointer transition-all duration-300 h-full"
            >
              <h3 className="text-xl font-bold text-prim-500 mb-3 text-center">
                Nuestro Enfoque
              </h3>
              <p className="text-gray-700 text-base text-center">
                Ofrecemos un Espacio de Diálogo, Respeto y Confidencialidad para
                la Solución de Conflictos, donde desde la imparcialidad de cada
                Mediadora prima la Autonomía de la Voluntad de las partes, en su
                rol de protagonistas del proceso de Mediación, para arribar a
                una solución equitativa, sostenida y comprometida.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 cursor-pointer transition-all duration-300 h-full"
            >
              <h3 className="text-xl font-bold text-prim-500 mb-3 text-center">
                Nuestra Misión
              </h3>
              <p className="text-gray-700 text-base text-center">
                Propiciamos la participación social activa en la gestión de los
                conflictos, que permita la construcción de una convivencia
                pacífica, con firme propósito de contribuir a través de procesos
                de consenso y diálogo al acceso a la justicia de todos los
                componentes sociales.
              </p>
            </motion.div>
          </div>

          <div className="text-center">
            <Link
              to="/turnos?mediador=true"
              className="bg-prim-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-prim-600 shadow transition inline-block"
            >
              Pedir Turno para Mediadores
            </Link>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Home;
