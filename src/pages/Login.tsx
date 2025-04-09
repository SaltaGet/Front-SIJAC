import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import apiSijac from "@/api/sijac";
import useAuthStore from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {setRefreshToken,setToken} = useAuthStore()
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await apiSijac.post("/users/login", data); // cambiá la ruta cuando tengas la real
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Login exitoso:", data);
      setToken(data.token);
      setRefreshToken(data.refresh_token);
      navigate("/admin");
    },
    onError: (error) => {
      console.error("Error al iniciar sesión:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 p-8 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-center text-prim-500 mb-6">Acceso al personal</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-prim-500 text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-prim-500 text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-prim-500 text-white font-medium py-2 rounded-md hover:bg-prim-600 transition disabled:opacity-50"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Iniciando..." : "Iniciar sesión"}
          </button>

          {loginMutation.isError && (
            <p className="text-red-600 text-sm mt-2">Credenciales incorrectas o error del servidor.</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
