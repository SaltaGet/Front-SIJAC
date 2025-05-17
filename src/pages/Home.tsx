import { useUser } from "@/hooks/client/useUser";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home: React.FC = () => {
  const { usersData } = useUser();
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const handleCardClick = (userId: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  return (
    <div className="flex flex-col text-gray-900">
      {/* Hero (se mantiene igual) */}
      <section className="bg-[url('/hero-bg.jpg')] bg-cover bg-center text-white py-24 px-6 text-center bg-black/60 bg-blend-multiply">
        <h1 className="text-4xl md:text-6xl font-bold mb-2">SIJAC</h1>
        <p className="text-xl tracking-wide mb-6">CONSULTORA</p>
        <p className="max-w-xl mx-auto mb-8">
          En SIJAC brindamos soluciones jurídicas integrales con un enfoque
          profesional y personalizado. Confiá en nuestro equipo para proteger
          tus intereses y acompañarte en cada paso del proceso legal.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button className="bg-white text-prim-500 font-semibold px-6 py-3 rounded-full hover:bg-prim-50 shadow transition">
            Contacto
          </button>
          <Link
            to={"/turnos"}
            className="bg-prim-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-prim-600 shadow transition"
          >
            Pedir Turno
          </Link>
        </div>
      </section>

      {/* Nosotros (se mantiene igual) */}
      <section id="nosotros" className="py-16 px-6 bg-white text-center">
        <h2 className="text-3xl font-bold mb-6 text-prim-500">Nosotros</h2>
        <p className="max-w-3xl mx-auto text-lg leading-relaxed">
          En SIJAC Consultora, somos un equipo apasionado por brindar soluciones
          legales innovadoras y de calidad. Con más de una década de
          experiencia, nos hemos consolidado como una consultora confiable en
          Salta, ofreciendo asesoría integral en diversas áreas del derecho.
        </p>
      </section>

      {/* Nuestro Equipo con efecto 3D */}
      <section id="profesionales" className="py-16 px-6 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-10 text-prim-500">
          Nuestro Equipo
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {usersData?.map((user) => (
            <div 
              key={user.id} 
              className="cursor-pointer perspective-1000"
              onClick={() => handleCardClick(user.id)}
            >
              <motion.div
                className="relative w-full h-64"
                animate={{
                  rotateY: flippedCards[user.id] ? 180 : 0
                }}
                transition={{ duration: 0.6 }}
                style={{
                  transformStyle: "preserve-3d"
                }}
              >
                {/* Frente de la tarjeta */}
                <motion.div
                  className="absolute w-full h-full bg-white rounded-xl p-6 shadow-sm border border-gray-200 backface-hidden flex flex-col items-center justify-center"
                  style={{
                    backfaceVisibility: "hidden"
                  }}
                  initial={false}
                  animate={{
                    opacity: flippedCards[user.id] ? 0 : 1,
                    display: flippedCards[user.id] ? "none" : "flex"
                  }}
                >
                  <img 
                    src={user.url_image} 
                    className="w-24 h-24 mx-auto rounded-full mb-4" 
                    alt={`${user.first_name} ${user.last_name}`}
                  />
                  <h3 className="font-semibold text-lg">{user.first_name} {user.last_name}</h3>
                </motion.div>

                {/* Reverso de la tarjeta */}
                <motion.div
                  className="absolute w-full h-full bg-prim-500 text-white rounded-xl p-6 shadow-sm backface-hidden flex flex-col items-center justify-center"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)"
                  }}
                  initial={false}
                  animate={{
                    opacity: flippedCards[user.id] ? 1 : 0,
                    display: flippedCards[user.id] ? "flex" : "none"
                  }}
                >
                  <h3 className="font-bold text-xl mb-2">{user.first_name} {user.last_name}</h3>
                  <p className="text-center text-white/90 font-semibold">{user.specialty}</p>
                </motion.div>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* Mediaciones (se mantiene igual) */}
      <section id="mediaciones" className="py-16 px-6 bg-white text-center">
        <h2 className="text-3xl font-bold mb-6 text-prim-500">Mediaciones</h2>
        <p className="max-w-3xl mx-auto mb-8 text-lg leading-relaxed text-gray-700">
          En SIJAC Consultora, ofrecemos servicios de mediación para resolver
          conflictos de manera rápida y eficiente.
        </p>
        <Link
          to={"/turnos?mediador=true"}
          className="bg-prim-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-prim-600 shadow transition"
        >
          Pedir Turno para Mediadores
        </Link>
      </section>
    </div>
  );
};

export default Home;