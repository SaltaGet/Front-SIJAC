import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

type DecodedToken = {
  user_id: string;
  expire: string;
};

type AuthStore = {
  token: string | null;
  refreshToken: string | null;
  userId: string | null;
  expire: string | null;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  clearAuth: () => void;
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      userId: null,
      expire: null,
      setToken: (token) => {
        try {
          const decoded = jwtDecode<DecodedToken>(token);
          set({
            token,
            userId: decoded.user_id,
            expire: decoded.expire,
          });
        } catch (err) {
          console.error('error decoding token:', err);
          set({ token, userId: null, expire: null });
        }
      },
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      clearAuth: () =>
        set({
          token: null,
          refreshToken: null,
          userId: null,
          expire: null,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
