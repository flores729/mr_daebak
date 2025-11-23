// src/app/customer/orders/[orderId]/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";
import {
  getOrderById,
  type Order,
} from "@/lib/storage/orderStorage";
import { getMenuDetail } from "@/lib/data/menuRepository";
import type { MenuOptionStyle } from "@/lib/data/menuSchema";

export default function OrderDetailPage({
  params,
}: {
  params: { orderId: string };
}) {
  const router = useRouter();
  const user = useUserStore((s) => s.user);

  // 주문 불러오기
  const order: Order | undefined = getOrderById(params.orderId);

  // 주문 없음
  if (!order) {
    return (
      <Fallback
        text="해당 주문을 찾을 수 없습니다."
        onClick={() => router.push("/customer/orders")}
      />
    );
  }

  // 로그인 체크
  if (!user) {
    return (
      <Fallback
        text="주문을 보려면 먼저 로그인 또는 비회원 정보를 입력해주세요."
        onClick={() => router.push("/customer/login")}
      />
    );
  }

  // 본인 주문인지 체크
  const ownerKey = user.isGuest ? user.guestId : user.email;
  const ownerType = user.isGuest ? "guest" : "member";

  if (!ownerKey || order.ownerKey !== ownerKey || order.ownerType !== ownerType) {
    return (
      <Fallback
        text="본인 주문만 조회할 수 있습니다."
        onClick={() => router.push("/customer/orders")}
      />
    );
  }

  // 메뉴 정보
  const item = order.items[0];
  const detail = getMenuDetail(item.dinnerId);
  const menuName = detail?.menu.name ?? item.dinnerId;

  const statusLabel = translateStatus(order.status);

  // 🔥 타입 안전하게 style 강제 변환
  const styleKey = item.style as MenuOptionStyle;

  return (
    <main className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">주문 상세</h1>

      {/* 상태 영역 */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-1">
          주문번호: <span className="font-mono">{order.orderId}</span>
        </p>
        <span className="inline-block px-3 py-1 bg-gray-800 text-white text-xs rounded-full">
          {statusLabel}
        </span>
      </div>

      {/* 메뉴 정보 */}
      <section className="mb-6">
        <h2 className="font-semibold mb-2">주문한 디너</h2>
        <p className="font-medium">{menuName}</p>
        <p className="text-xs text-gray-500 mb-1">{detail?.menu.eng}</p>
        <p className="text-sm">스타일: {item.style.toUpperCase()}</p>
        <p className="text-sm mt-1">
          바게트 {item.baguetteCount}개, 와인/샴페인 {item.champagneCount}병
        </p>

        {detail && (
          <div className="mt-3 text-xs text-gray-600">
            <p className="font-semibold mb-1">코스 구성</p>
            <ul className="list-disc list-inside space-y-1">
              {detail.coursesByStyle[styleKey].map((c: string) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* 주문자 / 배송 정보 */}
      <section className="mb-6">
        <h2 className="font-semibold mb-2">주문자 / 배송 정보</h2>
        <div className="text-sm text-gray-700 space-y-1">
          <p>이름: {order.customerName}</p>
          <p>전화번호: {order.phone}</p>
          <p>주소: {order.address}</p>
          <p>배송 일시: {order.deliveryDate}</p>
        </div>
      </section>

      {/* 금액 */}
      <section className="mb-6">
        <h2 className="font-semibold mb-2">결제 금액</h2>
        <p className="text-xl font-bold">
          {order.totalPrice.toLocaleString()}원
        </p>
      </section>

      {/* 수정 버튼 — REQUESTED일 때만 */}
      {order.status === "REQUESTED" && (
        <button
          onClick={() =>
            router.push(`/customer/orders/${order.orderId}/edit`)
          }
          className="w-full bg-black text-white py-2 rounded-full text-sm font-semibold"
        >
          주문 정보 수정하기
        </button>
      )}
    </main>
  );
}

// ===========================
// 공용 컴포넌트
// ===========================

function Fallback({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) {
  return (
    <main className="w-full min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="mb-3 text-sm text-gray-700">{text}</p>
      <button
        onClick={onClick}
        className="px-4 py-2 rounded-full bg-black text-white text-sm font-semibold"
      >
        돌아가기
      </button>
    </main>
  );
}

function translateStatus(status: Order["status"]) {
  switch (status) {
    case "REQUESTED":
      return "주문요청";
    case "CONFIRMED":
      return "접수완료";
    case "COOKING":
      return "조리중";
    case "DELIVERED":
      return "배달완료";
    case "CANCELLED":
      return "취소됨";
    default:
      return status;
  }
}
