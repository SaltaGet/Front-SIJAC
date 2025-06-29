import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen((prev) => !prev);

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
    setIsOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to={"/"}
          className="text-2xl font-bold text-prim-500 tracking-wide"
        >
          SIJAC
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6 text-gray-800 font-medium">
          <span
            onClick={() => handleNavigation("nosotros")}
            className="cursor-pointer hover:text-prim-500 transition"
          >
            Nosotros
          </span>
          <span
            onClick={() => handleNavigation("profesionales")}
            className="cursor-pointer hover:text-prim-500 transition"
          >
            Profesionales
          </span>
          <span
            onClick={() => handleNavigation("mediaciones")}
            className="cursor-pointer hover:text-prim-500 transition"
          >
            Mediaciones
          </span>
          <Link to="/blogs" className="hover:text-prim-500 transition">
            Noticias
          </Link>
          {/* Nueva opción */}
          <Link 
            to="/coworking" 
            className="hover:text-prim-500 transition"
          >
            Oficinas Compartidas
          </Link>
        </nav>

        {/* Turno button (desktop) */}
        <Link
          to={"/turnos?mediador=false"}
          className="hidden md:inline-block bg-prim-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-prim-600 transition"
        >
          Pedir Turno
        </Link>

        {/* Mobile menu button */}
        <button onClick={toggleMenu} className="md:hidden text-prim-500">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4 space-y-4 text-gray-800 font-medium">
          <span
            onClick={() => handleNavigation("nosotros")}
            className="block cursor-pointer hover:text-prim-500 transition"
          >
            Nosotros
          </span>
          <span
            onClick={() => handleNavigation("profesionales")}
            className="block cursor-pointer hover:text-prim-500 transition"
          >
            Profesionales
          </span>
          <span
            onClick={() => handleNavigation("mediaciones")}
            className="block cursor-pointer hover:text-prim-500 transition"
          >
            Mediaciones
          </span>
          <Link
            to="/blogs"
            className="block hover:text-prim-500 transition"
            onClick={() => setIsOpen(false)}
          >
            Noticias
          </Link>
          {/* Nueva opción (mobile) */}
          <Link
            to="/coworking"
            className="block hover:text-prim-500 transition"
            onClick={() => setIsOpen(false)}
          >
            Oficinas Compartidas
          </Link>
          <Link
            to={"turnos"}
            className="block bg-prim-500 text-white text-center px-4 py-2 rounded-full font-semibold hover:bg-prim-600 transition"
            onClick={() => setIsOpen(false)}
          >
            Pedir Turno
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;