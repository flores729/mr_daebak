// src/app/customer/checkout/page.tsx
"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";
import { useOrderDraft } from "@/lib/store/useOrderDraft";
import { addOrder } from "@/lib/storage/orderStorage";
import { getMenuDetail } from "@/lib/data/menuRepository";
import type { MenuDetail } from "@/lib/data/menuRepository";
import type { MenuOptionStyle, MenuId } from "@/lib/data/menuSchema";

export default function CheckoutPage() {
  const router = useRouter();

  // Zustand는 선택자(selector) 방식만 사용 (불변!)
  const user = useUserStore((s) => s.user);
  const draft = useOrderDraft((s) => s.draft);
  const resetDraft = useOrderDraft((s) => s.resetDraft);

  // 초기에 한 번만 초기값 세팅 (useEffect 없이 안전)
  const [name, setName] = useState((draft.customerName || user?.name || "").trim());
  const [phone, setPhone] = useState((user?.phone || "").trim());
  const [address, setAddress] = useState((user?.address || "").trim());

  // 메뉴 상세
  const detail: MenuDetail | null =
    draft.dinnerType ? getMenuDetail(draft.dinnerType as MenuId) : null;

  const menuName = detail?.menu.name ?? "선택된 디너가 없습니다";
  const menuEng = detail?.menu.eng ?? "";

  const defaultsBread = detail?.defaults.bread ?? draft.baguetteCount;
  const defaultsWine = detail?.defaults.wine ?? draft.champagneCount;

  const basePrice = detail?.menu.basePrice ?? 0;

  const extraBreadCount = detail ? Math.max(draft.baguetteCount - detail.defaults.bread, 0) : 0;
  const extraWineCount = detail ? Math.max(draft.champagneCount - detail.defaults.wine, 0) : 0;

  const extraBreadPrice = detail ? extraBreadCount * detail.extraPrices.extraBreadPrice : 0;
  const extraWinePrice = detail ? extraWineCount * detail.extraPrices.extraWinePrice : 0;

  const extraPrice = extraBreadPrice + extraWinePrice;
  const totalPrice = basePrice + extraPrice;

  // --- 스타일 안전 처리 ---
  const styleKey: MenuOptionStyle = draft.style ?? "simple";
  const styleLabel = styleKey.toUpperCase();  

  // --- 코스 리스트도 안전 ---
  const selectedCourses = detail?.coursesByStyle[styleKey] ?? [];


  // -------------------------
  // 결제 처리 — 버튼 눌렀을 때만 검사
  // -------------------------
  const handlePay = () => {
    if (!user) {
      alert("로그인 또는 비회원 정보를 먼저 입력해주세요.");
      router.push("/customer/login");
      return;
    }

    if (!draft.dinnerType || !detail) {
      alert("디너 정보가 없습니다.");
      router.push("/customer/home");
      return;
    }

    if (!draft.deliveryDate) {
      alert("배송 날짜를 선택해주세요.");
      router.push(`/customer/home/${detail.menu.id}`);
      return;
    }

    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert("주문자 정보를 모두 입력해주세요.");
      return;
    }

    const ownerType = user.isGuest ? "guest" : "member";
    const ownerKey = user.isGuest ? user.guestId : user.email;

    if (!ownerKey) {
      alert("계정 정보가 올바르지 않습니다.");
      router.push("/customer/login");
      return;
    }

    addOrder({
      ownerKey,
      ownerType,
      customerName: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      deliveryDate: draft.deliveryDate,
      items: [
        {
          dinnerId: detail.menu.id,
          style: draft.style,
          baguetteCount: draft.baguetteCount,
          champagneCount: draft.champagneCount,
          basePrice,
          extraPrice,
          totalItemPrice: totalPrice,
        },
      ],
      totalPrice,
      status: "REQUESTED",
    });

    resetDraft();
    router.push("/customer/complete");
  };

  return (
    <main className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">주문 확인</h1>

      <Section title="디너 정보">
        <p className="font-semibold">{menuName}</p>
        {menuEng && <p className="text-xs text-gray-500">{menuEng}</p>}
        <p className="text-sm mt-1">스타일: {styleLabel}</p>

        {selectedCourses.length > 0 && (
          <div className="mt-3 text-xs">
            <p className="font-semibold mb-1">코스 구성</p>
            <ul className="list-disc list-inside space-y-1">
              {selectedCourses.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      <Section title="옵션">
        <p className="text-sm">바게트: {draft.baguetteCount}개 (기본 {defaultsBread})</p>
        <p className="text-sm">와인/샴페인: {draft.champagneCount}병 (기본 {defaultsWine})</p>
        <p className="text-sm">
          배송 일시: {draft.deliveryDate || "아직 선택되지 않았습니다"}
        </p>
      </Section>

      <Section title="주문자 / 배송 정보">
        <Input label="이름" value={name} onChange={setName} />
        <Input label="전화번호" value={phone} onChange={setPhone} />
        <Input label="주소" value={address} onChange={setAddress} />
      </Section>

      <Section title="결제 금액">
        <p className="text-xl font-bold">{totalPrice.toLocaleString()}원</p>
      </Section>

      <div className="flex gap-3 mt-6">
        <button
          className="flex-1 border py-2 rounded"
          onClick={() =>
            detail ? router.push(`/customer/home/${detail.menu.id}`) : router.push("/customer/home")
          }
        >
          옵션 수정하기
        </button>

        <button className="flex-1 bg-black text-white py-2 rounded" onClick={handlePay}>
          결제하기
        </button>
      </div>
    </main>
  );
}

// -------------------------
// UI
// -------------------------
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="font-semibold mb-2">{title}</h2>
      {children}
    </section>
  );
}

function Input({
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
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
