import { create } from "zustand";
import { OrderDraft } from "./useOrderDraft";

export type Order = OrderDraft & {
  id: string;
  status: "PENDING" | "PREPARING" | "DELIVERING" | "COMPLETED";
  createdAt: string;
};

type OrderStore = {
  orders: Order[];
  createOrder: (draft: OrderDraft) => Order;
  updateStatus: (id: string, status: Order["status"]) => void;
  getOrdersByCustomer: (name: string) => Order[];
};

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],

  createOrder: (draft) => {
    const newOrder: Order = {
      ...draft,
      id: `ORD-${Date.now()}`,   // 간단한 고유 ID
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      orders: [...state.orders, newOrder],
    }));

    return newOrder;
  },

  updateStatus: (id, status) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, status } : o
      ),
    }));
  },

  getOrdersByCustomer: (name) => {
    return get().orders.filter((o) => o.customerName === name);
  }
}));
