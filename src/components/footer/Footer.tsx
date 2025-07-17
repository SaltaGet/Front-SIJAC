import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Code2 } from "lucide-react"; // Using Code2 icon for development

const Footer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="bg-gray-100 text-gray-700 py-10 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Logo y descripción */}
        <div>
          <h3 className="text-2xl font-bold text-prim-500 mb-2">SIJAC</h3>
          <p className="text-sm leading-relaxed">
            En SIJAC Brindamos Servicio Jurídico Integral con un enfoque global, visión local y
perspectiva Humana.
          </p>
        </div>

        {/* Navegación */}
        <div>
          <h4 className="font-semibold mb-2">Navegación</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <span
                onClick={() => handleNavigation("nosotros")}
                className="cursor-pointer hover:text-prim-500 transition"
              >
                Nosotros
              </span>
            </li>
            <li>
              <span
                onClick={() => handleNavigation("profesionales")}
                className="cursor-pointer hover:text-prim-500 transition"
              >
                Profesionales
              </span>
            </li>
            <li>
              <span
                onClick={() => handleNavigation("mediaciones")}
                className="cursor-pointer hover:text-prim-500 transition"
              >
                Mediaciones
              </span>
            </li>
            <li>
              <Link
                to={"blogs"}
                className="cursor-pointer hover:text-prim-500 transition"
              >
                Noticias
              </Link>
            </li>
            <li>
              <Link
                to={"turnos"}
                className="cursor-pointer hover:text-prim-500 transition"
              >
                Pedir Turno
              </Link>
            </li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h4 className="font-semibold mb-2">Contacto</h4>
          <p className="text-sm mb-1">
            Email: coworkingsijac@gmail.com
          </p>
          <p className="text-sm">
            Dirección:{" "}
            <a
              href="https://maps.app.goo.gl/4KhMCJwxjJm2m3ro9"
              target="_blank"
              rel="noopener noreferrer"
              className="text-prim-500 hover:underline"
            >
              Calle 25 de Mayo 429, Salta Capital
            </a>
          </p>
        </div>
      </div>

      <div className="mt-10 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} SIJAC Consultora. Todos los derechos reservados.
        <div className="mt-2 flex items-center justify-center gap-1">
          <Code2 className="w-4 h-4" />
          <span>Desarrollado por </span>
          <a 
            href="https://saltaget.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-prim-500 hover:underline"
          >
            SaltaGet
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;