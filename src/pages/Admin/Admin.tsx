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

const SECTIONS = [
  { id: "selector", label: "Crear Turnos" },
  { id: "appointment", label: "Turnos" },
  { id: "createPost", label: "Crear Post" },
  { id: "editPost", label: "Tus Posteos" },
  { id: "clients", label: "Clientes" },
  { id: "cases", label: "Casos" },
] as const;

type Section = typeof SECTIONS[number]['id'];

const Admin = () => {
  const [activeSection, setActiveSection] = useState<Section>("selector");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { token, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

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
        <h2 className="text-lg font-semibold text-prim-700">Admin Panel</h2>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-prim-700">
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-prim-100 border-r border-prim-200 p-4`}>
        <h2 className="text-lg font-semibold text-prim-700 mb-4 hidden md:block">Admin Panel</h2>
        
        <nav className="flex flex-col space-y-2">
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleSectionChange(id)}
              className={`p-3 rounded-md text-left transition-colors ${
                activeSection === id 
                  ? 'bg-prim-500 text-white' 
                  : 'text-prim-800 hover:bg-prim-200'
              }`}
            >
              {label}
            </button>
          ))}
          
          <button
            onClick={handleLogout}
            className="mt-6 p-3 rounded-md bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
          >
            Cerrar Sesión
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        {activeSection === "selector" && <CalendarSelector />}
        {activeSection === "appointment" && <CalendarApointment />}
        {activeSection === "createPost" && <FormCreatePost />}
        {activeSection === "editPost" && <AdimEditPost />}
        {activeSection === "clients" && <AdminClients />}
        {activeSection === "cases" && <AdminCases />}
      </main>
    </div>
  );
};

export default Admin;