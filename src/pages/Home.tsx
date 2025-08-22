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
        <motion.h1 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold mb-2">SIJAC</motion.h1>
        <motion.p initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}
          className="text-xl font-semibold tracking-wide mb-6">SERVICIOS INTEGRALES JURIDICOS ADMINISTRATIVOS Y COMERCIALES</motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}
          className="max-w-xl text-base mx-auto mb-8">
          En SIJAC Brindamos Servicio Jurídico Integral con un enfoque global, visión local y
perspectiva Humana.
        </motion.p>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }}
          className="flex justify-center gap-4 flex-wrap">
          <button className="bg-white text-prim-500 font-semibold px-6 py-3 rounded-full hover:bg-prim-50 shadow transition">
            Contacto
          </button>
          <Link to="/turnos" className="bg-prim-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-prim-600 shadow transition">
            Pedir Turno
          </Link>
        </motion.div>
      </section>

      {/* Nosotros */}
      <motion.section id="nosotros" className="py-16 px-6 bg-white text-center"
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8 }}>
        <h2 className="text-3xl font-bold mb-6 text-prim-500">Nosotros</h2>
              </motion.section>
      {/* Cards de Valores y Objetivos */}
<motion.section className="py-16 px-6 bg-gray-100 text-center"
  initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.8 }}>
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 cursor-pointer transition-all duration-300">
      <h3 className="text-xl font-bold text-prim-500 mb-3">¿Quienes Somos?</h3>
      <p className="text-gray-700 text-base">
        Somos un Equipo de profesionales especialistas en cada área del Derecho y Disciplinas afines, pasantes y personal Administrativo, que complementa nuestra tarea íntegra y sostenible, que nos permite brindar asesoramiento integral de primer nivel, reconocido por su calidad profesional y su perfil humano.
      </p>
    </motion.div>

    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 cursor-pointer transition-all duration-300">
      <h3 className="text-xl font-bold text-prim-500 mb-3">Objetivo</h3>
      <p className="text-gray-700 text-base">
        Ofrecer a nuestros Clientes un Asesoramiento legal de excelencia, Acompañamiento y seguimiento para ayudar a conseguir Resultados adecuados y soluciones estratégicas, a la medida de cada caso.
      </p>
    </motion.div>

    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 cursor-pointer transition-all duration-300">
      <h3 className="text-xl font-bold text-prim-500 mb-3">Mision</h3>
      <p className="text-gray-700 text-base">
        Continuar creciendo en el Asesoramiento a particulares, Instituciones y Empresas, conforme a nuevos paradigmas corporativos y Derecho Moderno, que nos motiva a estar a la Vanguardia, en una práctica original e innovadora.
      </p>
    </motion.div>

    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 cursor-pointer transition-all duration-300">
      <h3 className="text-xl font-bold text-prim-500 mb-3">Vision</h3>
      <p className="text-gray-700 text-base">
        Colaborar a la formación y crecimiento profesional, ofreciendo excelentes oportunidades para formar parte de nuestra Consultora, Apostando a la construcción de una comunidad más justa y consciente.
      </p>
    </motion.div>

  </div>
</motion.section>

      <CarruselNosotros/>

            {/* Nuestro Equipo */}
<motion.section
  id="profesionales"
  ref={equipoRef}
  className="py-16 px-6 bg-gray-50 text-center"
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.8 }}
>
  <h2 className="text-3xl font-bold mb-10 text-prim-500">Nuestro Equipo</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
    {usersData?.map((user, idx) => (
      <motion.div
        key={user.id}
        className="relative w-full h-100 [perspective:1000px] group"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: idx * 0.1 }}
      >
        <div
          className="absolute w-full h-full rounded-xl shadow-md border border-gray-200 transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
        >
          {/* Frente */}
          <div
            style={{ backfaceVisibility: "hidden" }}
            className="absolute w-full h-full bg-white rounded-xl overflow-hidden"
          >
            <motion.img
              src={user.url_image}
              alt={`${user.first_name} ${user.last_name}`}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Reverso */}
          <div
            style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
            className="absolute w-full h-full bg-prim-500 text-white rounded-xl p-6 flex flex-col items-center justify-center"
          >
            <h3 className="font-bold text-xl mb-2 text-center">
  {user.first_name.toUpperCase()} {user.last_name.toUpperCase()} - ABOGADA
  {user.specialty.toLowerCase().includes("mediador") && " & MEDIADORA"}
</h3>
            <ul className="text-white/90 font-semibold space-y-1 text-center">
              {user.specialty.split('-').map((item, index) =>
                item.trim() && <li key={index}>• {item.trim()}</li>
              )}
            </ul>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
</motion.section>


      {/* Mediaciones */}
<motion.section id="mediaciones" className="py-16 px-6 bg-white text-center"
  initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8 }}>
  <h2 className="text-3xl font-bold mb-6 text-prim-500">Centro Privado de Mediación</h2>
  <h2 className="text-3xl font-bold mb-6 text-prim-500">"PODEMOS HABLAR"</h2>
</motion.section>

{/* Cards de Mediación */}
<motion.section className="py-16 px-6 bg-gray-100"
  initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.8 }}>
  <div className="max-w-6xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 cursor-pointer transition-all duration-300 h-full">
        <h3 className="text-xl font-bold text-prim-500 mb-3 text-center">Nuestro Enfoque</h3>
        <p className="text-gray-700 text-base text-center">
          Ofrecemos un Espacio de Diálogo, Respeto y Confidencialidad para la Solución de Conflictos,
          donde desde la imparcialidad de cada Mediadora prima la Autonomía de la Voluntad de las
          partes, en su rol de protagonistas del proceso de Mediación, para arribar a una solución
          equitativa, sostenida y comprometida.
        </p>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 cursor-pointer transition-all duration-300 h-full">
        <h3 className="text-xl font-bold text-prim-500 mb-3 text-center">Nuestra Misión</h3>
        <p className="text-gray-700 text-base text-center">
          Propiciamos la participación social activa en la gestión de los conflictos, que
          permita la construcción de una convivencia pacífica, con firme propósito de contribuir a través de
          procesos de consenso y diálogo al acceso a la justicia de todos los componentes sociales.
        </p>
      </motion.div>
    </div>

    <div className="text-center">
      <Link to="/turnos?mediador=true" className="bg-prim-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-prim-600 shadow transition inline-block">
        Pedir Turno para Mediadores
      </Link>
    </div>
  </div>
</motion.section>
    </motion.div>
  );
};

export default Home;
