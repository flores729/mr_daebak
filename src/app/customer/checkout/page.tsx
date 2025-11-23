// src/app/customer/checkout/page.tsx
"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";
import { useOrderDraft } from "@/lib/store/useOrderDraft";
import { addOrder } from "@/lib/storage/orderStorage";
import { getMenuDetail } from "@/lib/data/menuRepository";
import type { MenuDetail } from "@/lib/data/menuRepository";
import type { MenuOptionStyle, MenuId } from "@/lib/data/menuSchema";

export default function CheckoutPage() {
  const router = useRouter();

  // --------- 전역 상태(훅은 최상단) ----------
  const user = useUserStore((s) => s.user);
  const draft = useOrderDraft((s) => s.draft);
  const resetDraft = useOrderDraft((s) => s.resetDraft);

  // --------- 메뉴 상세 조회 ----------
  let detail: MenuDetail | null = null;
  if (draft.dinnerType) {
    detail = getMenuDetail(draft.dinnerType as MenuId);
  }

  // --------- 주문자 정보 입력값 (초기값 1회 set) ----------
  const [name, setName] = useState<string>(
    (draft.customerName || user?.name || "").trim(),
  );
  const [phone, setPhone] = useState<string>(
    (user?.phone || "").trim(),
  );
  const [address, setAddress] = useState<string>(
    (user?.address || "").trim(),
  );

  // --------- 표시용 값 계산 (detail 없어도 안전하게) ----------
  const menuName = detail?.menu.name ?? "선택된 디너가 없습니다";
  const menuEng = detail?.menu.eng ?? "";

  const styleLabel = draft.style.toUpperCase();

  const defaultsBread = detail?.defaults.bread ?? draft.baguetteCount;
  const defaultsWine = detail?.defaults.wine ?? draft.champagneCount;
  const basePrice = detail?.menu.basePrice ?? 0;

  const extraBreadCount = detail
    ? Math.max(draft.baguetteCount - detail.defaults.bread, 0)
    : 0;
  const extraWineCount = detail
    ? Math.max(draft.champagneCount - detail.defaults.wine, 0)
    : 0;

  const extraBreadPrice = detail
    ? extraBreadCount * detail.extraPrices.extraBreadPrice
    : 0;
  const extraWinePrice = detail
    ? extraWineCount * detail.extraPrices.extraWinePrice
    : 0;

  const extraPrice = extraBreadPrice + extraWinePrice;
  const totalPrice = basePrice + extraPrice;

  const styleKey: MenuOptionStyle = draft.style;
  const selectedCourses: string[] =
    detail?.coursesByStyle[styleKey] ?? [];

  // --------- 결제 처리 ----------
  const handlePay = () => {
    // 1) 로그인/비회원 정보 확인
    if (!user) {
      alert("로그인 또는 비회원 정보를 먼저 입력해주세요.");
      router.push("/customer/login");
      return;
    }

    // 2) 메뉴 정보 확인
    if (!draft.dinnerType || !detail) {
      alert("선택된 디너 정보가 없습니다. 디너를 먼저 선택해주세요.");
      router.push("/customer/home");
      return;
    }

    // 3) 배송 일시 확인
    if (!draft.deliveryDate) {
      alert("배송 날짜와 시간을 선택해주세요.");
      router.push(`/customer/home/${detail.menu.id}`);
      return;
    }

    // 4) 주문자 정보 확인
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert("주문자 이름, 전화번호, 주소를 모두 입력해주세요.");
      return;
    }

    // 5) ownerKey / ownerType 결정
    const ownerType = user.isGuest ? "guest" : "member";
    const ownerKey = user.isGuest ? user.guestId : user.email;

    if (!ownerKey) {
      alert("계정 정보가 올바르지 않습니다. 다시 로그인해주세요.");
      router.push("/customer/login");
      return;
    }

    // 6) 주문 생성
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

    // 7) 드래프트 초기화 후 완료 페이지로
    resetDraft();
    router.push("/customer/complete");
  };

  // --------- 화면 렌더 ----------
  return (
    <main className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">주문 확인</h1>

      {/* 디너 정보 */}
      <Section title="디너 정보">
        <p className="font-semibold">{menuName}</p>
        {menuEng && (
          <p className="text-xs text-gray-500">{menuEng}</p>
        )}
        <p className="text-sm mt-1">
          스타일: {styleLabel}
        </p>

        {selectedCourses.length > 0 && (
          <div className="mt-3 text-xs">
            <p className="font-semibold mb-1">코스 구성</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {selectedCourses.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      {/* 옵션 정보 */}
      <Section title="옵션">
        <p className="text-sm">
          바게트: {draft.baguetteCount}개 (기본 {defaultsBread}개)
        </p>
        <p className="text-sm">
          와인/샴페인: {draft.champagneCount}병 (기본 {defaultsWine}병)
        </p>
        <p className="text-sm">
          배송 일시: {draft.deliveryDate || "아직 선택되지 않았습니다"}
        </p>
      </Section>

      {/* 주문자 정보 */}
      <Section title="주문자 / 배송 정보">
        <Input
          label="이름"
          value={name}
          onChange={setName}
        />
        <Input
          label="전화번호"
          value={phone}
          onChange={setPhone}
          placeholder="010-1234-5678"
        />
        <Input
          label="주소"
          value={address}
          onChange={setAddress}
          placeholder="예) 서울시 강남구 ..."
        />
      </Section>

      {/* 금액 정보 */}
      <Section title="결제 금액">
        <div className="text-sm text-gray-700 mb-2 space-y-1">
          <div>기본 가격: {basePrice.toLocaleString()}원</div>
          <div>
            추가 바게트: {extraBreadCount}개 (
            {extraBreadPrice.toLocaleString()}원)
          </div>
          <div>
            추가 와인/샴페인: {extraWineCount}병 (
            {extraWinePrice.toLocaleString()}원)
          </div>
        </div>
        <p className="text-xl font-bold">
          최종 결제 금액: {totalPrice.toLocaleString()}원
        </p>
      </Section>

      {/* 버튼 영역 */}
      <div className="flex gap-3 mt-6">
        <button
          className="flex-1 border border-gray-800 text-gray-800 py-2 rounded-full text-sm font-medium hover:bg-gray-800 hover:text-white transition"
          onClick={() => {
            if (detail) {
              router.push(`/customer/home/${detail.menu.id}`);
            } else {
              router.push("/customer/home");
            }
          }}
        >
          옵션 수정하기
        </button>

        {/* 🔥 색 있는 네모 결제 버튼 (주문 수정하기 버튼 느낌 맞춤) */}
        <button
          className="flex-1 bg-black text-white py-2 rounded-full text-sm font-semibold shadow-md hover:bg-gray-900 transition"
          onClick={handlePay}
        >
          결제하기
        </button>
      </div>

      {/* 🔥 비회원 주문조회 안내 문구 */}
      <p className="mt-4 text-[11px] text-gray-500 leading-relaxed">
        비회원으로 주문하신 경우, 결제 후{" "}
        <span className="font-semibold">전화번호 뒤 8자리</span>가
        비회원 주문조회 번호로 사용됩니다. 로그인 페이지 또는 주문조회
        페이지에서 해당 번호로 언제든지 주문 내역을 확인하실 수 있습니다.
      </p>
    </main>
  );
}

// -------------------------
// 공용 UI 컴포넌트
// -------------------------

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
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
