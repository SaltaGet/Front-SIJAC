import { useEffect, useState } from "react";
import CalendarApointment from "@/components/time-calendar/CalendarApointment";
import CalendarSelector from "@/components/time-calendar/CalendarSelector";
import FormCreatePost from "./FormCreatePost";
import AdimEditPost from "./AdminEditBlog";
import useAuthStore from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

const Admin = () => {
  const [activeSection, setActiveSection] = useState<
    "selector" | "appointment" | "createPost" | "editPost"
  >("selector");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { token, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Botón Hamburguesa */}
      <div className="flex justify-between items-center md:hidden p-4 bg-prim-100 border-b">
        <h2 className="text-lg font-semibold text-prim-700">Admin Panel</h2>
        <button onClick={() => setIsMenuOpen((prev) => !prev)}>
          <Menu className="text-prim-700 w-6 h-6" />
        </button>
      </div>

      {/* Barra lateral */}
      <aside
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-prim-100 border-b md:border-b-0 md:border-r p-4`}
      >
        <h2 className="text-lg font-semibold text-prim-700 mb-4 hidden md:block">
          Admin Panel
        </h2>

        {/* nav en fila para mobile, columna para desktop */}
        <nav className="flex flex-col gap-2 h-full">
          <button
            onClick={() => {
              setActiveSection("selector");
              setIsMenuOpen(false);
            }}
            className={`p-2 rounded ${
              activeSection === "selector"
                ? "bg-prim-500 text-white"
                : "hover:bg-prim-200 text-prim-800"
            }`}
          >
            Crear Turnos
          </button>
          <button
            onClick={() => {
              setActiveSection("appointment");
              setIsMenuOpen(false);
            }}
            className={`p-2 rounded ${
              activeSection === "appointment"
                ? "bg-prim-500 text-white"
                : "hover:bg-prim-200 text-prim-800"
            }`}
          >
            Turnos
          </button>
          <button
            onClick={() => {
              setActiveSection("createPost");
              setIsMenuOpen(false);
            }}
            className={`p-2 rounded ${
              activeSection === "createPost"
                ? "bg-prim-500 text-white"
                : "hover:bg-prim-200 text-prim-800"
            }`}
          >
            Crear Post
          </button>
          <button
            onClick={() => {
              setActiveSection("editPost");
              setIsMenuOpen(false);
            }}
            className={`p-2 rounded ${
              activeSection === "editPost"
                ? "bg-prim-500 text-white"
                : "hover:bg-prim-200 text-prim-800"
            }`}
          >
            Tus Posteos
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded bg-red-500 text-white font-semibold mt-8 "
          >
            Cerrar Sesión
          </button>
        </nav>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-4">
        {activeSection === "selector" && <CalendarSelector />}
        {activeSection === "appointment" && <CalendarApointment />}
        {activeSection === "createPost" && <FormCreatePost />}
        {activeSection === "editPost" && <AdimEditPost />}
      </main>
    </div>
  );
};

export default Admin;
