import { useEffect, useState } from "react";
import CalendarApointment from "@/components/time-calendar/CalendarApointment";
import CalendarSelector from "@/components/time-calendar/CalendarSelector";
import FormCreatePost from "./FormCreatePost";
import AdimEditPost from "./AdminEditBlog";
import useAuthStore from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [activeSection, setActiveSection] = useState<"selector" | "appointment" | "createPost" | "editPost">("selector");
  const {token} = useAuthStore()
  const navigate = useNavigate()
  const {clearAuth} = useAuthStore()
  useEffect(() => {
    if (!token) {
      navigate("/login")
    }

  },[navigate,token])

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Barra lateral */}
      <aside className="w-full md:w-64 bg-prim-100 border-b md:border-b-0 md:border-r p-4">
        <h2 className="text-lg font-semibold text-prim-700 mb-4">Admin Panel</h2>
        <nav className="flex md:flex-col gap-2">
          <button
            onClick={() => setActiveSection("selector")}
            className={`text-left p-2 rounded ${
              activeSection === "selector"
                ? "bg-prim-500 text-white"
                : "hover:bg-prim-200 text-prim-800"
            }`}
          >
            Crear Turnos
          </button>
          <button
            onClick={() => setActiveSection("appointment")}
            className={`text-left p-2 rounded ${
              activeSection === "appointment"
                ? "bg-prim-500 text-white"
                : "hover:bg-prim-200 text-prim-800"
            }`}
          >
            Turnos
          </button>
          <button
            onClick={() => setActiveSection("createPost")}
            className={`text-left p-2 rounded ${
              activeSection === "createPost"
                ? "bg-prim-500 text-white"
                : "hover:bg-prim-200 text-prim-800"
            }`}
          >
            Crear Post
          </button>
          <button
            onClick={() => setActiveSection("editPost")}
            className={`text-left p-2 rounded ${
              activeSection === "editPost"
                ? "bg-prim-500 text-white"
                : "hover:bg-prim-200 text-prim-800"
            }`}
          >
            Tus Posteos
          </button>
          <button
            onClick={()=> {
              clearAuth();
              navigate("login")

            }
            }
            className={`text-left p-2 rounded ${
              activeSection === "editPost"
                ? "bg-prim-500 text-white"
                : "hover:bg-prim-200 text-prim-800"
            }`}
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
