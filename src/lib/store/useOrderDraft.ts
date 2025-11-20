// src/lib/store/useOrderDraft.ts
"use client";

import { create } from "zustand";

// 프로젝트 스타일 키 그대로 유지
export type MenuStyleKey = "simple" | "grand" | "deluxe";

export type OrderDraft = {
  dinnerType: string | null;       // 어떤 메뉴인지 (menu.id)
  style: MenuStyleKey;             // 스타일
  baguetteCount: number;
  champagneCount: number;
  deliveryDate: string;            // "YYYY-MM-DD HH:mm"
  customerName: string;
};

export const initialDraft: OrderDraft = {
  dinnerType: null,
  style: "simple",                 // 절대 undefined 되지 않도록 기본값
  baguetteCount: 1,
  champagneCount: 1,
  deliveryDate: "",
  customerName: "",
};

type DraftStore = {
  draft: OrderDraft;
  updateDraft: (partial: Partial<OrderDraft>) => void;
  resetDraft: () => void;
};

// ⭐ Zustand 완전 무결 버전
export const useOrderDraft = create<DraftStore>((set) => ({
  draft: { ...initialDraft },

  updateDraft: (partial) =>
    set((state) => ({
      draft: {
        ...state.draft,
        ...partial,
        // style이 잘못 들어오는 상황 방지
        style:
          partial.style ??
          state.draft.style ??
          "simple",
      },
    })),

  resetDraft: () =>
    set({
      draft: { ...initialDraft },
    }),
}));
