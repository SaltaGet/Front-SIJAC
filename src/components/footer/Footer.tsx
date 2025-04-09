import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-10 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Logo y descripción */}
        <div>
          <h3 className="text-2xl font-bold text-prim-500 mb-2">SIJAC</h3>
          <p className="text-sm leading-relaxed">
            Consultora jurídica comprometida con brindar asesoría profesional, personalizada y eficiente.
          </p>
        </div>

        {/* Navegación */}
        <div>
          <h4 className="font-semibold mb-2">Navegación</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="#nosotros" className="hover:text-prim-500 transition">Nosotros</a></li>
            <li><a href="#profesionales" className="hover:text-prim-500 transition">Profesionales</a></li>
            <li><a href="#mediaciones" className="hover:text-prim-500 transition">Mediaciones</a></li>
            <li><a href="#noticias" className="hover:text-prim-500 transition">Noticias</a></li>
            <li><a href="#turnos" className="hover:text-prim-500 transition">Pedir Turno</a></li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h4 className="font-semibold mb-2">Contacto</h4>
          <p className="text-sm mb-1">
            Tel: (0387) 123-4567 <br />
            Email: contacto@sijac.com
          </p>
          <p className="text-sm">
            Dirección:{" "}
            <a
              href="https://www.google.com/maps/place/Salta,+Argentina"
              target="_blank"
              rel="noopener noreferrer"
              className="text-prim-500 hover:underline"
            >
              Av. Siempreviva 742, Salta
            </a>
          </p>
        </div>
      </div>

      <div className="mt-10 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} SIJAC Consultora. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
