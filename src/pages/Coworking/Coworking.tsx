// import SelectRoom from "./SelectRoom";
// import PlanCard from "./PlanCard";
// import BenefitCard from "./BenefitCard";

// const Coworking = () => {
//   const benefits = [
//     {
//       icon: (
//         <svg className="w-6 h-6 text-prim-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//         </svg>
//       ),
//       title: "Oficinas Profesionales",
//       description: "Despachos privados o espacios compartidos, totalmente equipados para tu práctica legal."
//     },
//     {
//       icon: (
//         <svg className="w-6 h-6 text-prim-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//         </svg>
//       ),
//       title: "Flexibilidad",
//       description: "Contratos por horas, días o meses. Sin ataduras ni costos fijos elevados."
//     },
//     {
//       icon: (
//         <svg className="w-6 h-6 text-prim-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
//         </svg>
//       ),
//       title: "Servicios Incluidos",
//       description: "Internet de alta velocidad, salas de reuniones, recepción de clientes y más."
//     }
//   ];

//   const plans = [
//   {
//     title: "Plan Básico",
//     subtitle: "Ideal para consultas esporádicas",
//     price: "25.000",
//     period: "10 horas",
//     features: [
//       "1 hora de sala de reuniones",
//       "Acceso a biblioteca jurídica",
//       "Internet de alta velocidad",
//       "Uso de impresora (50 páginas)"
//     ],
//     buttonColor: "prim-500",
//     hoverColor: "prim-600",
//     buttonText: "Consultar",
//     link: "https://google.com" // Agregado
//   },
//   {
//     title: "Plan Profesional",
//     subtitle: "Perfecto para casos mensuales",
//     price: "70.000",
//     period: "30 horas",
//     features: [
//       "3 horas de sala de reuniones",
//       "Acceso prioritario a salas",
//       "Internet dedicado",
//       "Uso de impresora (200 páginas)",
//       "Lockers para documentos"
//     ],
//     buttonColor: "prim-600",
//     hoverColor: "prim-700",
//     buttonText: "Consultar",
//     link: "https://google.com" // Agregado
//   },
//   {
//     title: "Plan Premium",
//     subtitle: "Para bufetes en crecimiento",
//     price: "120.000",
//     period: "50 horas",
//     features: [
//       "5 horas de sala de reuniones",
//       "Oficina privada 1 día/mes",
//       "Internet dedicado premium",
//       "Uso de impresora (500 páginas)",
//       "Lockers premium con llave",
//       "Asistente recepcionista 2h/semana"
//     ],
//     buttonColor: "prim-700",
//     hoverColor: "prim-800",
//     buttonText: "Consultar",
//     link: "https://google.com" // Agregado
//   }
// ];

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Minihero */}
//       <section className="bg-gradient-to-r from-prim-500 to-prim-600 text-white py-16 md:py-24">
//         <div className="max-w-7xl mx-auto px-6 text-center">
//           <h1 className="text-4xl md:text-5xl font-bold mb-6">
//             Espacio Compartido para Abogados
//           </h1>
//           <p className="text-xl md:text-2xl max-w-3xl mx-auto">
//             Oficinas profesionales, flexibles y con todo lo que necesitas para ejercer con comodidad y prestigio.
//           </p>
//         </div>
//       </section>

//       {/* Beneficios */}
//       <section className="max-w-7xl mx-auto px-6 py-16">
//         <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
//           ¿Qué ofrecemos?
//         </h2>

//         <div className="grid md:grid-cols-3 gap-8">
//           {benefits.map((benefit, index) => (
//             <BenefitCard
//               key={index}
//               icon={benefit.icon}
//               title={benefit.title}
//               description={benefit.description}
//             />
//           ))}
//         </div>
//       </section>

//       {/* Planes para abogados */}
//       <section className="max-w-7xl mx-auto px-6 py-16">
//         <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
//           Nuestros Planes Flexibles
//         </h2>

//         <div className="grid md:grid-cols-3 gap-8">
//           {plans.map((plan, index) => (
//             <PlanCard
//               key={index}
//               title={plan.title}
//               subtitle={plan.subtitle}
//               price={plan.price}
//               period={plan.period}
//               features={plan.features}
//               buttonText={plan.buttonText}
//               buttonColor={plan.buttonColor}
//               hoverColor={plan.hoverColor}
//               link={plan.link}
//             />
//           ))}
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="bg-gray-50 py-12">
//         <div className="max-w-4xl mx-auto px-6 text-center">
//           <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
//             ¿Listo para trabajar en un espacio profesional?
//           </h2>
//           <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
//             Reserva tu espacio ahora y enfócate en lo que realmente importa: tu práctica legal.
//           </p>
//           <SelectRoom />
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Coworking;






// import SelectRoom from "./SelectRoom";
// import PlanCard from "./PlanCard";
// import BenefitCard from "./BenefitCard";
// import portada from "@/assets/fotos/portada.png";

// const Coworking = () => {
//   const benefits = [
//     {
//       icon: (
//         <svg className="w-6 h-6 text-prim-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//         </svg>
//       ),
//       title: "Oficinas Profesionales",
//       description: "Despachos privados o espacios compartidos, totalmente equipados para tu práctica legal."
//     },
//     {
//       icon: (
//         <svg className="w-6 h-6 text-prim-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//         </svg>
//       ),
//       title: "Flexibilidad",
//       description: "Contratos por horas, días o meses. Sin ataduras ni costos fijos elevados."
//     },
//     {
//       icon: (
//         <svg className="w-6 h-6 text-prim-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
//         </svg>
//       ),
//       title: "Servicios Incluidos",
//       description: "Internet de alta velocidad, salas de reuniones, recepción de clientes y más."
//     }
//   ];

//   const plans = [
//     {
//       title: "Plan Base",
//       subtitle: "$45.000/mes",
//       price: "10 horas mensuales",
//       features: [
//         "1 hora bonificada extra",
//         "Recepcionista",
//         "Limpieza",
//         "kitchenette",
//         "Comunidad jurídica"
//       ],
//       buttonColor: "prim-500",
//       hoverColor: "prim-600",
//       buttonText: "Consultar",
//       link: "https://google.com"
//     },
//     {
//       title: "Plan Intermedio",
//       subtitle: "$70.000/mes",
//       price: "20 horas mensuales",
//       features: [
//         "3 horas de sala de reuniones bonificadas (con turno previo)",
//         "15 impresiones al mes (no acumulables)",
//         "Recepcionista",
//         "Limpieza",
//         "Kitchenette",
//         "Comunidad jurídica"
//       ],
//       buttonColor: "prim-600",
//       hoverColor: "prim-700",
//       buttonText: "Consultar",
//       link: "https://google.com"
//     },
//     {
//       title: "Plan Premium",
//       subtitle: "$90.000/mes",
//       price: "30 horas mensuales",
//       features: [
//         "4 horas de sala de reuniones bonificadas (con turno previo)",
//         "50 impresiones",
//         "Recepcionista",
//         "Limpieza",
//         "Kitchenette",
//         "Comunidad jurídica"
//       ],
//       buttonColor: "prim-600",
//       hoverColor: "prim-700",
//       buttonText: "Consultar",
//       link: "https://google.com"
//     },
//     {
//       title: "Plan Flex Diario",
//       subtitle: "$8.000/día",
//       price: "Acceso por 2 horas",
//       features: [
//         "Sala de reuniones (previo turno)",
//         "Internet",
//         "Recepcionista",
//         "Limpieza",
//         "Kitchenette",
//         "Comunidad jurídica"
//       ],
//       buttonColor: "prim-600",
//       hoverColor: "prim-700",
//       buttonText: "Consultar",
//       link: "https://google.com"
//     },
//     {
//       title: "Plan Virtual",
//       subtitle: "$25.000/mes",
//       price: "Domicilio legal",
//       features: [
//         "Recepción de correspondencia",
//         "Derivación de mails y llamadas",
//         "Recepcionista",
//         "Acceso a comunidad jurídica"
//       ],
//       buttonColor: "prim-600",
//       hoverColor: "prim-700",
//       buttonText: "Consultar",
//       link: "https://google.com"
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Minihero */}
//       <section className="text-white py-16 md:py-24 relative">
//     <div 
//       className="absolute inset-0 bg-cover bg-center z-0"
//       style={{ backgroundImage: `url(${portada})` }}
//     ></div>
//     <div className="absolute inset-0 bg-black/50 z-10"></div>
//     <div className="max-w-7xl mx-auto px-6 text-center relative z-20">
//       <h1 className="text-4xl md:text-5xl font-bold mb-6">
//         Un Espacio Pansado Para Abogados
//       </h1>
//       <p className="text-xl md:text-2xl max-w-3xl mx-auto">
//         Oficinas profesionales, flexibles y con todo lo que necesitas para ejercer con comodidad y prestigio.
//       </p>
//     </div>
//   </section>

//       {/* Beneficios */}
//       <section className="max-w-7xl mx-auto px-6 py-16">
//         <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
//           ¿Qué ofrecemos?
//         </h2>

//         <div className="grid md:grid-cols-3 gap-8">
//           {benefits.map((benefit, index) => (
//             <BenefitCard
//               key={index}
//               icon={benefit.icon}
//               title={benefit.title}
//               description={benefit.description}
//             />
//           ))}
//         </div>
//       </section>

//       {/* Planes para abogados */}
//       <section className="max-w-7xl mx-auto px-6 py-16">
//         <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
//           Nuestros Planes Flexibles
//         </h2>

//         <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
//           {plans.map((plan, index) => (
//             <PlanCard
//               key={index}
//               title={plan.title}
//               subtitle={plan.subtitle}
//               price={plan.price}
//               features={plan.features}
//               buttonText={plan.buttonText}
//               buttonColor={plan.buttonColor}
//               hoverColor={plan.hoverColor}
//               link={plan.link}
//             />
//           ))}
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="bg-gray-50 py-12">
//         <div className="max-w-4xl mx-auto px-6 text-center">
//           <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
//             ¿Listo para trabajar en un espacio profesional?
//           </h2>
//           <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
//             Reserva tu espacio ahora y enfócate en lo que realmente importa: tu práctica legal.
//           </p>
//           <SelectRoom />
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Coworking;










import { motion } from 'framer-motion';
import SelectRoom from "./SelectRoom";
import PlanCard from "./PlanCard";
import BenefitCard from "./BenefitCard";
import portada from "@/assets/fotos/portada.png";
import { useInView } from 'react-intersection-observer';

// Componente contenedor con animación
const AnimatedSection = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

// Variantes para animaciones escalonadas
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const Coworking = () => {
  const benefits = [
    {
      icon: (
        <svg className="w-6 h-6 text-prim-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: "Oficinas Profesionales",
      description: "Despachos privados o espacios compartidos, totalmente equipados para tu práctica legal."
    },
    {
      icon: (
        <svg className="w-6 h-6 text-prim-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "Flexibilidad",
      description: "Contratos por horas, días o meses. Sin ataduras ni costos fijos elevados."
    },
    {
      icon: (
        <svg className="w-6 h-6 text-prim-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      title: "Servicios Incluidos",
      description: "Internet de alta velocidad, salas de reuniones, recepción de clientes y más."
    }
  ];

  const plans = [
    {
      title: "Plan Base",
      subtitle: "$45.000/mes",
      price: "10 horas mensuales",
      features: [
        "1 hora bonificada extra",
        "Recepcionista",
        "Limpieza",
        "kitchenette",
        "Comunidad jurídica"
      ],
      buttonColor: "prim-500",
      hoverColor: "prim-600",
      buttonText: "Consultar",
      link: "https://google.com"
    },
    {
      title: "Plan Intermedio",
      subtitle: "$70.000/mes",
      price: "20 horas mensuales",
      features: [
        "3 horas de sala de reuniones bonificadas (con turno previo)",
        "15 impresiones al mes (no acumulables)",
        "Recepcionista",
        "Limpieza",
        "Kitchenette",
        "Comunidad jurídica"
      ],
      buttonColor: "prim-600",
      hoverColor: "prim-700",
      buttonText: "Consultar",
      link: "https://google.com"
    },
    {
      title: "Plan Premium",
      subtitle: "$90.000/mes",
      price: "30 horas mensuales",
      features: [
        "4 horas de sala de reuniones bonificadas (con turno previo)",
        "50 impresiones",
        "Recepcionista",
        "Limpieza",
        "Kitchenette",
        "Comunidad jurídica"
      ],
      buttonColor: "prim-600",
      hoverColor: "prim-700",
      buttonText: "Consultar",
      link: "https://google.com"
    },
    {
      title: "Plan Flex Diario",
      subtitle: "$8.000/día",
      price: "Acceso por 2 horas",
      features: [
        "Sala de reuniones (previo turno)",
        "Internet",
        "Recepcionista",
        "Limpieza",
        "Kitchenette",
        "Comunidad jurídica"
      ],
      buttonColor: "prim-600",
      hoverColor: "prim-700",
      buttonText: "Consultar",
      link: "https://google.com"
    },
    {
      title: "Plan Virtual",
      subtitle: "$25.000/mes",
      price: "Domicilio legal",
      features: [
        "Recepción de correspondencia",
        "Derivación de mails y llamadas",
        "Recepcionista",
        "Acceso a comunidad jurídica"
      ],
      buttonColor: "prim-600",
      hoverColor: "prim-700",
      buttonText: "Consultar",
      link: "https://google.com"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Minihero con efecto de parallax */}
      <motion.section 
        className="text-white py-16 md:py-24 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${portada})` }}
        ></div>
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <motion.div 
          className="max-w-7xl mx-auto px-6 text-center relative z-20"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Un Espacio Pensado Para Abogados
          </h1>
          <motion.p 
            className="text-xl md:text-2xl max-w-3xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Oficinas profesionales, flexibles y con todo lo que necesitas para ejercer con comodidad y prestigio.
          </motion.p>
        </motion.div>
      </motion.section>

      {/* Beneficios con animación escalonada */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <AnimatedSection>
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            ¿Qué ofrecemos?
          </h2>
        </AnimatedSection>

        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, threshold: 0.1 }}
        >
          {benefits.map((benefit, index) => (
            <motion.div key={index} variants={itemVariants}>
              <BenefitCard
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Planes para abogados con animación escalonada */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <AnimatedSection>
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Nuestros Planes Flexibles
          </h2>
        </AnimatedSection>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, threshold: 0.1 }}
        >
          {plans.map((plan, index) => (
            <motion.div key={index} variants={itemVariants}>
              <PlanCard
                title={plan.title}
                subtitle={plan.subtitle}
                price={plan.price}
                features={plan.features}
                buttonText={plan.buttonText}
                buttonColor={plan.buttonColor}
                hoverColor={plan.hoverColor}
                link={plan.link}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA con efecto de escala */}
      <motion.section 
        className="bg-gray-50 py-12"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold text-gray-800 mb-6"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            ¿Listo para trabajar en un espacio profesional?
          </motion.h2>
          <motion.p 
            className="text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Reserva tu espacio ahora y enfócate en lo que realmente importa: tu práctica legal.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <SelectRoom />
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Coworking;