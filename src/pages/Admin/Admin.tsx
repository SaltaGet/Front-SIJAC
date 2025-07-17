import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CalendarApointment from "@/components/time-calendar/CalendarApointment";
import CalendarSelector from "@/components/time-calendar/CalendarSelector";
import useAuthStore from "@/store/useAuthStore";
import FormCreatePost from "./FormCreatePost";
import AdimEditPost from "./AdminEditBlog";
import AdminClients from "./AdminClients";
import AdminCases from "./AdminCases";
import AdminAssigTurn from "./AdminAssigTurn";
import AdminCoworking from "./coworking/AdminCoworking";

// Define all possible sections
const ALL_SECTIONS = [
  { id: "selector", label: "Turnos" },
  { id: "appointment", label: "Calendario" },
  { id: "coworking", label: "Coworking" },
  { id: "createPost", label: "Posts" },
  { id: "editPost", label: "Editar Posts" },
  { id: "clients", label: "Clientes" },
  { id: "cases", label: "Casos" },
  { id: "assig-turn", label: "Asignaciones" },
] as const;

type Section = typeof ALL_SECTIONS[number]['id'];

const Admin = () => {
  const [activeSection, setActiveSection] = useState<Section>("selector");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { token, clearAuth, role } = useAuthStore();
  const navigate = useNavigate();

  // Filter sections based on role
  const SECTIONS = ALL_SECTIONS.filter(section => {
    if (role === "admin") return true; // Admin puede ver todo
    if (role === "secretary") return section.id === "coworking"; // Secretary solo ve coworking
    return section.id !== "coworking"; // Otros roles no ven coworking
  });

  useEffect(() => {
    if (!token) navigate("/login");
    // Si es secretary y está intentando acceder a una sección no permitida, redirigir a coworking
    if (role === "secretary" && activeSection !== "coworking") {
      setActiveSection("coworking");
    }
  }, [token, navigate, role, activeSection]);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-prim-50">
      {/* Mobile Header */}
      <header className="md:hidden flex justify-between items-center p-4 bg-prim-100 border-b border-prim-200">
        <h2 className="text-lg font-semibold text-prim-700">Panel Admin</h2>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="text-prim-700 focus:outline-none"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-56 bg-prim-100 border-r border-prim-200`}>
        <div className="p-4 border-b border-prim-200">
          <h2 className="text-lg font-semibold text-prim-700 hidden md:block">
            {role === "secretary" ? "Secretaría" : "Administración"}
          </h2>
        </div>
        
        <nav className="p-2 space-y-1">
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleSectionChange(id)}
              className={`w-full p-2 rounded text-sm transition-colors flex items-center ${
                activeSection === id 
                  ? 'bg-prim-600 text-white' 
                  : 'text-prim-800 hover:bg-prim-200'
              }`}
            >
              {label}
            </button>
          ))}
          
          <button
            onClick={handleLogout}
            className="w-full mt-4 p-2 rounded text-sm bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
          >
            Cerrar Sesión
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto bg-white rounded-lg shadow-sm">
        {activeSection === "selector" && <CalendarSelector />}
        {activeSection === "appointment" && <CalendarApointment />}
        {activeSection === "createPost" && <FormCreatePost />}
        {activeSection === "editPost" && <AdimEditPost />}
        {activeSection === "clients" && <AdminClients />}
        {activeSection === "cases" && <AdminCases />}
        {activeSection === "assig-turn" && <AdminAssigTurn />}
        {activeSection === "coworking" && <AdminCoworking />}
      </main>
    </div>
  );
};

export default Admin;