// src/app/customer/orders/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";
import {
  getOrdersByEmail,
  getOrdersByGuestId,
  Order,
} from "@/lib/storage/orderStorage";

type Mode = "member" | "guest";

export default function OrdersPage() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);

  const [mode, setMode] = useState<Mode>("member");

  // 회원 주문은 useEffect + setState 대신, 필요할 때 계산
  const memberOrders: Order[] = useMemo(() => {
    if (mode !== "member") return [];
    if (!user || user.isGuest || !user.email) return [];
    return getOrdersByEmail(user.email);
  }, [mode, user]);

  const [guestId, setGuestId] = useState("");
  const [guestOrders, setGuestOrders] = useState<Order[] | null>(null);
  const [guestSearched, setGuestSearched] = useState(false);

  const handleChangeMode = (next: Mode) => {
    setMode(next);
    // guest 조회 결과 초기화
    setGuestId("");
    setGuestOrders(null);
    setGuestSearched(false);
  };

  const handleGuestSearch = () => {
    if (!guestId.trim()) {
      alert("비회원 주문번호(guestId)를 입력해주세요.");
      return;
    }
    const result = getOrdersByGuestId(guestId.trim());
    setGuestOrders(result);
    setGuestSearched(true);
  };

  const goLogin = () => {
    router.push("/customer/login");
  };

  const renderOrderCard = (order: Order) => {
    return (
      <div
        key={order.orderId}
        className="border rounded-lg p-4 mb-3 bg-white/70"
      >
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-gray-600">
            주문번호: <span className="font-mono">{order.orderId}</span>
          </div>
          <div className="text-xs px-2 py-1 rounded-full bg-gray-800 text-white">
            {order.status === "PAID" ? "결제완료" : order.status}
          </div>
        </div>

        <div className="text-sm text-gray-700 mb-1">
          주문자: {order.customerName} / {order.phone}
        </div>
        <div className="text-xs text-gray-500 mb-1">
          배송일: {order.deliveryDate}
        </div>

        <div className="text-xs text-gray-500 mb-2">
          주문일시: {new Date(order.createdAt).toLocaleString()}
        </div>

        <div className="text-sm mb-1">
          {order.items.map((item) => (
            <div key={item.dinnerId}>
              • {item.dinnerId} ({item.style}) x1
            </div>
          ))}
        </div>

        <div className="text-right font-bold">
          {order.totalPrice.toLocaleString()}원
        </div>
      </div>
    );
  };

  return (
    <main className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">주문 조회</h1>

      {/* 모드 전환 버튼 */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => handleChangeMode("member")}
          className={`flex-1 py-2 rounded-full text-sm font-semibold border ${
            mode === "member"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
        >
          회원 주문조회
        </button>
        <button
          onClick={() => handleChangeMode("guest")}
          className={`flex-1 py-2 rounded-full text-sm font-semibold border ${
            mode === "guest"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
        >
          비회원 주문조회
        </button>
      </div>

      {/* 회원 주문조회 */}
      {mode === "member" && (
        <section>
          {!user || user.isGuest || !user.email ? (
            <div className="text-sm text-gray-700">
              회원 주문조회를 이용하려면{" "}
              <button
                className="underline font-semibold"
                onClick={goLogin}
              >
                로그인
              </button>
              이 필요합니다.
            </div>
          ) : memberOrders.length === 0 ? (
            <div className="text-sm text-gray-600">
              {user.name}님의 주문 내역이 없습니다.
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-3">
                {user.name}님의 최근 주문내역입니다.
              </p>
              {memberOrders
                .slice()
                .reverse()
                .map((order) => renderOrderCard(order))}
            </div>
          )}
        </section>
      )}

      {/* 비회원 주문조회 */}
      {mode === "guest" && (
        <section>
          <div className="mb-4">
            <label className="block text-xs mb-1">
              비회원 주문번호(guestId)
            </label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="예: guest-837461273"
              value={guestId}
              onChange={(e) => setGuestId(e.target.value)}
            />
          </div>

          <button
            onClick={handleGuestSearch}
            className="w-full bg-black text-white py-2 rounded-full text-sm font-semibold mb-4"
          >
            조회하기
          </button>

          {guestSearched && (
            <>
              {guestOrders && guestOrders.length > 0 ? (
                <div>
                  <p className="text-sm text-gray-600 mb-3">
                    조회된 주문 내역입니다.
                  </p>
                  {guestOrders
                    .slice()
                    .reverse()
                    .map((order) => renderOrderCard(order))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  해당 주문번호로 조회된 주문이 없습니다.
                </p>
              )}
            </>
          )}
        </section>
      )}
    </main>
  );
}
