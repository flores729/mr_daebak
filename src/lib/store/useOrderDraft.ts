import { create } from "zustand";

export type OrderDraft = {
  customerName: string;
  dinnerType?: string;
  style?: string;
  baguetteCount?: number;
  champagneCount?: number;
  deliveryDate?: string;
};

type DraftStore = {
  draft: Partial<OrderDraft>;
  updateDraft: (data: Partial<OrderDraft>) => void;
  clearDraft: () => void;
};

export const useOrderDraft = create<DraftStore>((set) => ({
  draft: {},

  updateDraft: (data) =>
    set((state) => ({
      draft: { ...state.draft, ...data },
    })),

  clearDraft: () => set({ draft: {} }),
}));
