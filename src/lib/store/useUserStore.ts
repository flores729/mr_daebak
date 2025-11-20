// src/lib/store/useUserStore.ts
"use client";

import { create } from "zustand";

export type AppUser = {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  guestId?: string;
  isGuest: boolean;
};

type UserStore = {
  user: AppUser | null;
  setUser: (user: AppUser) => void;
  updateUser: (partial: Partial<AppUser>) => void;
  logout: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateUser: (partial) =>
    set((state) =>
      state.user ? { user: { ...state.user, ...partial } } : state,
    ),
  logout: () => set({ user: null }),
}));
