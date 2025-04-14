import apiSijac from "@/api/sijac";
import useAuthStore from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";

interface RefreshToken {
  token: string;
  refresh_token: string;
}

const postRefreshToken = async () => {
  const token = useAuthStore.getState().token;
  const refresh_token = useAuthStore.getState().refreshToken;

  if (!refresh_token) {
    throw new Error("El refresh_token no está disponible.");
  }

  const formData = new URLSearchParams();
  formData.append("refresh_token", refresh_token);

  const { data } = await apiSijac.post<RefreshToken>("/users/refresh_token", formData, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return { data };
};

export function useToken() {
  const { setRefreshToken, setToken } = useAuthStore();
  
  const { mutate } = useMutation({
    mutationFn: postRefreshToken,
    onSuccess: (res) => {
      setToken(res.data.token); // Actualiza el token
      setRefreshToken(res.data.refresh_token); // Actualiza el refresh_token
    },
    onError: (error) => {
      console.error("Error al actualizar los tokens:", error);
    },
  });

  return { mutate };
}
