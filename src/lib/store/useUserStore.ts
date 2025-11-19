import { create } from "zustand";

type User = {
  name: string;
  email?: string;
  guestId?: string;
  phone?: string;
  address?: string;
  isGuest: boolean;
};

type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  logout: () => set({ user: null }),
}));
