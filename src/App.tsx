import { useToken } from "./pages/Auth/useToken";
import RoutesWeb from "./routes/RoutesWeb";
import useAuthStore from "./store/useAuthStore"; // ajustá si la ruta es distinta
import { useEffect } from "react";

const App = () => {


  const {isTokenExpired, isRefreshTokenExpired, clearAuth} = useAuthStore()
  const {mutate} = useToken()

  useEffect(() => {
    const tokenExp = isTokenExpired();
    const refreshExp = isRefreshTokenExpired();

    console.log("¿Token expirado?", tokenExp);
    console.log("¿Refresh token expirado?", refreshExp);

    if (tokenExp && refreshExp) {
      // Si ambos han expirado, limpiar la autenticación
      console.log("Ambos tokens expirados, limpiando autenticación...");
      clearAuth();
    } else if (tokenExp && !refreshExp) {
      // Si solo el token ha expirado, hacer algo (puedes agregar lógica aquí)
      console.log("Solo el token expirado, pero el refresh token sigue activo.");
      // Aquí podrías redirigir al usuario a la página de login, por ejemplo
      mutate()
    } else {
      // Si ninguno ha expirado, no hacer nada
      console.log("Ningún token ha expirado.");
    }
  }, [isTokenExpired, isRefreshTokenExpired, clearAuth]);

  return (
    <div className="min-h-screen w-full">
      <RoutesWeb />
    </div>
  );
};

export default App;
