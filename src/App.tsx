import { useToken } from "./pages/Auth/useToken";
import RoutesWeb from "./routes/RoutesWeb";
import useAuthStore from "./store/useAuthStore";
import { useEffect, useCallback } from "react";

const App = () => {
  const { isTokenExpired, isRefreshTokenExpired, clearAuth } = useAuthStore();
  const { mutate } = useToken();

  // Memoizar la función mutate con useCallback
  const handleMutate = useCallback(() => {
    mutate();
  }, [mutate]);  // Si mutate cambia, se volverá a memorizar

  useEffect(() => {
    const tokenExp = isTokenExpired();
    const refreshExp = isRefreshTokenExpired();

    console.log("¿Token expirado?", tokenExp);
    console.log("¿Refresh token expirado?", refreshExp);

    if (tokenExp && refreshExp) {
      console.log("Ambos tokens expirados, limpiando autenticación...");
      clearAuth();
    } else if (tokenExp && !refreshExp) {
      console.log("Solo el token expirado, pero el refresh token sigue activo.");
      handleMutate();  // Usar handleMutate en lugar de mutate directamente
    } else {
      console.log("Ningún token ha expirado.");
    }
  }, [isTokenExpired, isRefreshTokenExpired, clearAuth, handleMutate]);  // Cambiar mutate por handleMutate

  return (
    <div className="min-h-screen w-full">
      <RoutesWeb />
    </div>
  );
};

export default App;
