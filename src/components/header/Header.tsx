import React, { useState } from "react";
import { Menu, X } from "lucide-react"; // usa lucide para los íconos
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to={"/"} className="text-2xl font-bold text-prim-500 tracking-wide">
          SIJAC
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6 text-gray-800 font-medium">
          <a href="#nosotros" className="hover:text-prim-500 transition">
            Nosotros
          </a>
          <a href="#profesionales" className="hover:text-prim-500 transition">
            Profesionales
          </a>
          <a href="#mediaciones" className="hover:text-prim-500 transition">
            Mediaciones
          </a>
          <Link to="/blogs" className="hover:text-prim-500 transition">
            Noticias
          </Link>
        </nav>

        {/* Turno button (desktop) */}
        <Link
          to={"/turnos"}
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
          <a href="#nosotros" className="block hover:text-prim-500 transition" onClick={toggleMenu}>
            Nosotros
          </a>
          <a href="#profesionales" className="block hover:text-prim-500 transition" onClick={toggleMenu}>
            Profesionales
          </a>
          <a href="#mediaciones" className="block hover:text-prim-500 transition" onClick={toggleMenu}>
            Mediaciones
          </a>
          <a href="#noticias" className="block hover:text-prim-500 transition" onClick={toggleMenu}>
            Noticias
          </a>
          <a
            href="#turnos"
            className="block bg-prim-500 text-white text-center px-4 py-2 rounded-full font-semibold hover:bg-prim-600 transition"
            onClick={toggleMenu}
          >
            Pedir Turno
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
