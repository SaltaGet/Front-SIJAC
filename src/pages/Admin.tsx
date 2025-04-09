import { useState } from "react";
import CalendarApointment from "@/components/time-calendar/CalendarApointment";
import CalendarSelector from "@/components/time-calendar/CalendarSelector";

const Admin = () => {
  const [activeSection, setActiveSection] = useState<"selector" | "appointment">("selector");

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
        </nav>
      </aside>

      {/* Contenido */}
      <main className="flex-1 p-4">
        {activeSection === "selector" && <CalendarSelector />}
        {activeSection === "appointment" && <CalendarApointment />}
      </main>
    </div>
  );
};

export default Admin;
