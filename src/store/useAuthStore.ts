import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

type DecodedToken = {
  user_id: string;
  expire: string;
  role: string;  // Añadimos el role al tipo DecodedToken
};

type AuthStore = {
  token: string | null;
  refreshToken: string | null;
  userId: string | null;
  expire: string | null;
  refreshExpire: string | null;
  role: string | null;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  clearAuth: () => void;
  isTokenExpired: () => boolean;
  isRefreshTokenExpired: () => boolean;
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      userId: null,
      expire: null,
      refreshExpire: null,
      role: null,  // Inicializamos role como null

      setToken: (token) => {
        try {
          const decoded = jwtDecode<DecodedToken>(token);
          set({
            token,
            userId: decoded.user_id,
            expire: decoded.expire,
            role: decoded.role,  // Establecemos el role desde el token
          });
        } catch (err) {
          console.error('error decoding token:', err);
          set({ token, userId: null, expire: null, role: null });
        }
      },

      setRefreshToken: (refreshToken) => {
        try {
          const decoded = jwtDecode<DecodedToken>(refreshToken);
          set({
            refreshToken,
            refreshExpire: decoded.expire,
            // Nota: Normalmente el refresh token no debería contener el role,
            // pero si lo incluye, puedes decidir si actualizarlo aquí también
          });
        } catch (err) {
          console.error('error decoding refresh token:', err);
          set({ refreshToken, refreshExpire: null });
        }
      },

      clearAuth: () =>
        set({
          token: null,
          refreshToken: null,
          userId: null,
          expire: null,
          refreshExpire: null,
          role: null,  // También limpiamos el role al hacer logout
        }),

      isTokenExpired: () => {
        const expire = get().expire;
        if (!expire) {
          console.log('token: no hay fecha de expiracion');
          return true;
        }
        const isExpired = new Date(expire).getTime() <= Date.now();
        console.log(`token expira en: ${expire} | expirado: ${isExpired}`);
        return isExpired;
      },
      
      isRefreshTokenExpired: () => {
        const refreshExpire = get().refreshExpire;
        if (!refreshExpire) {
          console.log('refresh token: no hay fecha de expiracion');
          return true;
        }
        const isExpired = new Date(refreshExpire).getTime() <= Date.now();
        console.log(`refresh token expira en: ${refreshExpire} | expirado: ${isExpired}`);
        return isExpired;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;