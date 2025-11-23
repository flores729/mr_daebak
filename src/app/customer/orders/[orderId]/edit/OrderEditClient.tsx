"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";
import {
  getOrderById,
  updateOrder,
  type Order,
} from "@/lib/storage/orderStorage";
import { getMenuDetail } from "@/lib/data/menuRepository";

type Props = {
  orderId: string;
};

export default function OrderEditClient({ orderId }: Props) {
  const router = useRouter();
  const user = useUserStore((s) => s.user);

  // 주문 불러오기
  const order: Order | undefined = getOrderById(orderId);

  // 필드 훅
  const [customerName, setCustomerName] = useState(order?.customerName ?? "");
  const [address, setAddress] = useState(order?.address ?? "");
  const [phone, setPhone] = useState(order?.phone ?? "");
  const [deliveryDate, setDeliveryDate] = useState(order?.deliveryDate ?? "");

  const firstItem = order?.items[0];
  const detail = firstItem ? getMenuDetail(firstItem.dinnerId) : null;

  // ============================
  // Guard 1 — 주문 없음
  // ============================
  if (!order) {
    return (
      <Fallback
        text="해당 주문을 찾을 수 없습니다."
        onClick={() => router.push("/customer/orders")}
      />
    );
  }

  // ============================
  // Guard 2 — 로그인 안됨
  // ============================
  if (!user) {
    return (
      <Fallback
        text="주문을 수정하려면 먼저 로그인 또는 비회원 정보를 입력해주세요."
        onClick={() => router.push("/customer/login")}
      />
    );
  }

  // ============================
  // Guard 3 — 본인 주문인지 체크
  // ============================
  const ownerKey = user.isGuest ? user.guestId : user.email;
  const ownerType = user.isGuest ? "guest" : "member";

  if (!ownerKey || order.ownerKey !== ownerKey || order.ownerType !== ownerType) {
    return (
      <Fallback
        text="본인 주문만 수정할 수 있습니다."
        onClick={() => router.push("/customer/orders")}
      />
    );
  }

  // ============================
  // Guard 4 — 상태가 REQUESTED가 아니면 수정 불가
  // ============================
  if (order.status !== "REQUESTED") {
    return (
      <main className="max-w-xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">주문 수정</h1>
        <p className="text-sm text-gray-700 mb-4">
          현재 주문 상태 (<b>{translateStatus(order.status)}</b>)에서는 고객이 직접 주문을 수정할 수 없습니다.
        </p>
        <button
          onClick={() => router.push("/customer/orders")}
          className="px-4 py-2 rounded-full bg-black text-white text-sm font-semibold"
        >
          주문 목록으로 돌아가기
        </button>
      </main>
    );
  }

  // ============================
  // 저장 처리
  // ============================
  const handleSave = () => {
    if (!customerName.trim() || !address.trim() || !phone.trim()) {
      alert("주문자 이름, 주소, 전화번호를 모두 입력해주세요.");
      return;
    }
    if (!deliveryDate.trim()) {
      alert("배송 일시를 입력해주세요.");
      return;
    }

    const updated = updateOrder(order.orderId, {
      customerName: customerName.trim(),
      address: address.trim(),
      phone: phone.trim(),
      deliveryDate: deliveryDate.trim(),
    });

    if (!updated) {
      alert("주문 수정에 실패했습니다. 다시 시도해주세요.");
      return;
    }

    alert("주문 정보가 수정되었습니다.");
    router.push("/customer/orders");
  };

  const menuName = detail?.menu.name ?? firstItem?.dinnerId ?? "디너 메뉴";

  return (
    <main className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">주문 수정</h1>

      {/* 주문 요약 */}
      <section className="mb-6">
        <h2 className="font-semibold mb-2">주문 정보</h2>
        <p className="text-sm text-gray-600 mb-1">
          주문번호: <span className="font-mono">{order.orderId}</span>
        </p>
        <p className="font-medium">{menuName}</p>
        {firstItem && (
          <>
            <p className="text-xs text-gray-500">
              스타일: {String(firstItem.style).toUpperCase()}
            </p>
            <p className="text-sm mt-1">
              바게트 {firstItem.baguetteCount}개, 와인/샴페인 {firstItem.champagneCount}병
            </p>
          </>
        )}
        <p className="text-sm mt-2">현재 배송 일시: {order.deliveryDate}</p>
        <p className="text-sm mt-1">
          현재 결제 금액: {order.totalPrice.toLocaleString()}원
        </p>
      </section>

      {/* 수정 가능한 폼 */}
      <section className="mb-6">
        <h2 className="font-semibold mb-2">수정할 정보</h2>

        <Field label="주문자 이름" value={customerName} onChange={setCustomerName} />
        <Field label="전화번호" value={phone} onChange={setPhone} placeholder="010-1234-5678" />
        <Field label="주소" value={address} onChange={setAddress} placeholder="서울시 ..." />
        <Field label="배송 일시" value={deliveryDate} onChange={setDeliveryDate} placeholder="2025-12-02 18:00" />
      </section>

      {/* 버튼 */}
      <div className="flex gap-3">
        <button
          onClick={() => router.push("/customer/orders")}
          className="flex-1 border py-2 rounded-full text-sm"
        >
          취소
        </button>

        <button
          onClick={handleSave}
          className="flex-1 bg-black text-white py-2 rounded-full text-sm font-semibold"
        >
          저장하기
        </button>
      </div>
    </main>
  );
}

// ============================
// 재사용 필드
// ============================

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="mb-3">
      <label className="block text-xs mb-1">{label}</label>
      <input
        className="w-full border rounded px-3 py-2 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function Fallback({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <main className="w-full min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="mb-3 text-sm text-gray-700">{text}</p>
      <button onClick={onClick} className="px-4 py-2 rounded-full bg-black text-white text-sm font-semibold">
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
