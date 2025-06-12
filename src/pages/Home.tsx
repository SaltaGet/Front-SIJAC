import { useUser } from "@/hooks/client/useUser";
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import CarruselNosotros from "@/components/carrusel/CarruselNosotros";

const Home: React.FC = () => {
  const { usersData } = useUser();
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const equipoRef = useRef(null);
  const isInView = useInView(equipoRef, { once: true });

  const handleCardClick = (userId: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  useEffect(() => {
    if (isInView && usersData) {
      // Flip automático
      const reset: Record<string, boolean> = {};
      usersData.forEach(u => reset[u.id] = true);
      setFlippedCards(reset);

      // Después de 2s, vuelven a normal
      const timeout = setTimeout(() => setFlippedCards({}), 2000);
      return () => clearTimeout(timeout);
    }
  }, [isInView, usersData]);

  return (
    <motion.div
      className="flex flex-col text-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Hero */}
      <section className="bg-[url('/hero-bg.jpg')] bg-cover bg-center text-white py-24 px-6 text-center bg-black/60 bg-blend-multiply">
        <motion.h1 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold mb-2">SIJAC</motion.h1>
        <motion.p initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}
          className="text-xl tracking-wide mb-6">CONSULTORA</motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}
          className="max-w-xl mx-auto mb-8">
          En SIJAC brindamos soluciones jurídicas integrales...
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
        <p className="max-w-3xl mx-auto text-lg leading-relaxed">
          En SIJAC Consultora, somos un equipo apasionado...
        </p>
      </motion.section>

      <CarruselNosotros/>

      {/* Nuestro Equipo */}
      <motion.section id="profesionales" ref={equipoRef} className="py-16 px-6 bg-gray-50 text-center"
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8 }}>
        <h2 className="text-3xl font-bold mb-10 text-prim-500">Nuestro Equipo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {usersData?.map((user, idx) => {
            const isFlipped = flippedCards[user.id] || false;
            return (
              <motion.div key={user.id} 
                className="relative w-full h-64 [perspective:1000px] cursor-pointer"
                onClick={() => handleCardClick(user.id)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}>
                <div className="absolute w-full h-full rounded-xl shadow-md border border-gray-200 transition-transform duration-700"
                  style={{ transformStyle: "preserve-3d", transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
                  {/* Frente */}
                  <div style={{ backfaceVisibility: "hidden" }}
                    className="absolute w-full h-full bg-white rounded-xl p-6 flex flex-col items-center justify-center">
                    <motion.img src={user.url_image} alt={`${user.first_name} ${user.last_name}`}
                      className="w-47 h-47 rounded-full mb-4 object-cover border shadow"
                      whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} />
                    <h3 className="font-semibold text-lg">{user.first_name} {user.last_name}</h3>
                  </div>
                  {/* Reverso */}
                  <div style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
                    className="absolute w-full h-full bg-prim-500 text-white rounded-xl p-6 flex flex-col items-center justify-center">
                    <h3 className="font-bold text-xl mb-2">{user.first_name} {user.last_name}</h3>
                    <p className="text-center text-white/90 font-semibold">{user.specialty}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      {/* Mediaciones */}
      <motion.section id="mediaciones" className="py-16 px-6 bg-white text-center"
        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.8 }}>
        <h2 className="text-3xl font-bold mb-6 text-prim-500">Mediaciones</h2>
        <p className="max-w-3xl mx-auto mb-8 text-lg leading-relaxed text-gray-700">
          En SIJAC Consultora, ofrecemos servicios de mediación...
        </p>
        <Link to="/turnos?mediador=true" className="bg-prim-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-prim-600 shadow transition">
          Pedir Turno para Mediadores
        </Link>
      </motion.section>
    </motion.div>
  );
};

export default Home;
