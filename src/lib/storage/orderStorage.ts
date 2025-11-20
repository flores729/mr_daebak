// src/lib/storage/orderStorage.ts

import type { MenuOptionStyle } from "@/lib/data/menuSchema";

export type OrderStatus =
  | "REQUESTED"   // 고객이 주문 넣은 상태 (고객 수정 가능)
  | "CONFIRMED"   // 직원이 접수 확정
  | "COOKING"     // 조리 중
  | "DELIVERED"   // 배달 완료
  | "CANCELLED";  // 취소

export interface OrderItem {
  dinnerId: string;
  style: MenuOptionStyle;  // 🔥 string → MenuOptionStyle
  baguetteCount: number;
  champagneCount: number;
  basePrice: number;
  extraPrice: number;
  totalItemPrice: number;
}

export interface Order {
  orderId: string;
  ownerKey: string; // 회원: email, 비회원: guestId
  ownerType: "member" | "guest";
  customerName: string;
  address: string;
  phone: string;
  deliveryDate: string; // "YYYY-MM-DD HH:mm"
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
}

const STORAGE_KEY = "mrdaebak_orders";

function loadOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Order[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveOrders(orders: Order[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function generateOrderId(): string {
  const rand = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  return `ord-${Date.now()}-${rand}`;
}

export function addOrder(
  input: Omit<Order, "orderId" | "createdAt">,
): Order {
  const orders = loadOrders();
  const order: Order = {
    ...input,
    orderId: generateOrderId(),
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  saveOrders(orders);
  return order;
}

// 수정 가능한 필드만 Partial 처리
export function updateOrder(
  orderId: string,
  partial: Partial<
    Omit<Order, "orderId" | "ownerKey" | "ownerType" | "createdAt">
  >,
): Order | undefined {
  const orders = loadOrders();
  const idx = orders.findIndex((o) => o.orderId === orderId);
  if (idx === -1) return undefined;

  const updated: Order = {
    ...orders[idx],
    ...partial,
  };

  orders[idx] = updated;
  saveOrders(orders);
  return updated;
}

export function getOrderById(orderId: string): Order | undefined {
  const orders = loadOrders();
  return orders.find((o) => o.orderId === orderId);
}

export function getOrdersByEmail(email: string): Order[] {
  const orders = loadOrders();
  return orders.filter(
    (o) => o.ownerType === "member" && o.ownerKey === email,
  );
}

export function getOrdersByGuestToken(token: string): Order[] {
  const orders = loadOrders();
  const trimmed = token.trim();

  return orders.filter((o) => {
    if (o.ownerType !== "guest") return false;

    // 1) 전체 guestId 매칭
    if (o.ownerKey === trimmed) return true;

    // 2) 전화번호 8자리 매칭
    const last8 = o.ownerKey.split("-").pop(); // guest-aaaa-bbbbbbbb 중 뒤 8자리
    return last8 === trimmed;
  });
}

// 비회원 주문 목록
export function getOrdersByGuestId(guestId: string): Order[] {
  const orders = loadOrders();
  return orders.filter(
    (o) => o.ownerType === "guest" && o.ownerKey === guestId
  );
}


