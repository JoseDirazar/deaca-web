import type { User } from "@/types/user/user.interface";
import { create } from "zustand";

interface UserStore {
  user: User | null;
  isUserLoaded: boolean;
  setUser: (user: User | null) => void;
  setIsUserLoaded: (loaded: boolean) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isUserLoaded: false,
  setUser: (user) => set({ user }),
  setIsUserLoaded: (loaded) => set({ isUserLoaded: loaded }),
  clearUser: () => set({ user: null }),
}));
