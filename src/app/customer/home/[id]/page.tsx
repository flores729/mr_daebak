// src/app/customer/home/[id]/page.tsx
"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { ORDER_CONFIG } from "@/lib/config/orderConfig";
import { getMenuDetail } from "@/lib/data/menuRepository";
import type { MenuId, MenuOptionStyle } from "@/lib/data/menuSchema";
import { useOrderDraft } from "@/lib/store/useOrderDraft";

export default function DinnerDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string | string[] }>();
  const { updateDraft } = useOrderDraft();

  // ------- id 추출 (Hook 아님) -------
  const rawId = params?.id;
  const id = (Array.isArray(rawId) ? rawId[0] : rawId) as MenuId;

  // ------- Hook들은 항상 최상단에서 호출 -------

  // 메뉴 상세 데이터 (인메모리 "DB" 조회)
  const detail = useMemo(() => getMenuDetail(id), [id]);

  // 오늘 날짜 문자열 (YYYY-MM-DD)
  const todayStr = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = `${d.getMonth() + 1}`.padStart(2, "0");
    const dd = `${d.getDate()}`.padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  // detail 기반 초기값 계산 (detail 없으면 대략적인 기본값)
  const initialStyle: MenuOptionStyle =
    (detail?.defaults.style as MenuOptionStyle) ?? "simple";
  const initialBread: number = detail?.defaults.bread ?? 1;
  const initialWine: number = detail?.defaults.wine ?? 0;

  // 상태값 – 초기값에 detail 반영
  const [style, setStyle] = useState<MenuOptionStyle>(initialStyle);
  const [baguetteCount, setBaguetteCount] =
    useState<number>(initialBread);
  const [wineCount, setWineCount] = useState<number>(initialWine);
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [deliveryTime, setDeliveryTime] = useState<string>("");

  const timeSlots = ORDER_CONFIG.delivery.timeSlots;

  // 수량 변경 핸들러
  const changeBread = (delta: number) => {
    setBaguetteCount((prev) => {
      const next = prev + delta;
      if (next < 0) return 0;
      if (next > ORDER_CONFIG.bread.maxCount)
        return ORDER_CONFIG.bread.maxCount;
      return next;
    });
  };

  const changeWine = (delta: number) => {
    setWineCount((prev) => {
      const next = prev + delta;
      if (next < 0) return 0;
      if (next > ORDER_CONFIG.wine.maxCount)
        return ORDER_CONFIG.wine.maxCount;
      return next;
    });
  };

  // 가격 계산 (detail 없을 때도 안전하게 처리)
  const {
    basePrice,
    extraBreadCount,
    extraWineCount,
    extraBreadPrice,
    extraWinePrice,
    totalPrice,
  } = useMemo(() => {
    if (!detail) {
      return {
        basePrice: 0,
        extraBreadCount: 0,
        extraWineCount: 0,
        extraBreadPrice: 0,
        extraWinePrice: 0,
        totalPrice: 0,
      };
    }

    const { menu, defaults, extraPrices } = detail;

    const basePrice = menu.basePrice;
    const extraBreadCount = Math.max(baguetteCount - defaults.bread, 0);
    const extraWineCount = Math.max(wineCount - defaults.wine, 0);

    const extraBreadPrice =
      extraBreadCount * extraPrices.extraBreadPrice;
    const extraWinePrice =
      extraWineCount * extraPrices.extraWinePrice;

    const totalPrice = basePrice + extraBreadPrice + extraWinePrice;

    return {
      basePrice,
      extraBreadCount,
      extraWineCount,
      extraBreadPrice,
      extraWinePrice,
      totalPrice,
    };
  }, [detail, baguetteCount, wineCount]);

  const handleNext = () => {
    if (!detail) {
      alert("해당 메뉴 정보를 찾을 수 없습니다.");
      router.push("/customer/home");
      return;
    }

    if (!deliveryDate || !deliveryTime) {
      alert("희망 배송 날짜와 시간을 모두 선택해주세요.");
      return;
    }

    const { menu } = detail;

    updateDraft({
      dinnerType: menu.id,
      style,
      baguetteCount,
      champagneCount: wineCount,
      deliveryDate: `${deliveryDate} ${deliveryTime}`, // 문자열로 합쳐서 저장
    });

    router.push("/customer/checkout");
  };

  // --------------------------------
  // 여기부터 JSX: detail 존재 여부에 따라 분기
  // (Hook는 이미 위에서 전부 호출 완료)
  // --------------------------------

  // detail 이 없는 경우: 404 느낌 UI
  if (!detail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">
            존재하지 않는 메뉴입니다.
          </p>
          <button
            onClick={() => router.push("/customer/home")}
            className="mt-2 px-4 py-2 rounded-full bg-white text-black text-sm font-medium"
          >
            메뉴 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // detail 이 있는 경우에만 여기까지 내려옴
  const { menu, defaults, styles, coursesByStyle, extraPrices } = detail;
  const styledCourses = coursesByStyle[style];

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-8">
      <button
        onClick={() => router.push("/customer/home")}
        className="mb-4 text-sm text-zinc-400 hover:text-white hover:underline"
      >
        ← 메뉴 목록으로
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* 이미지 */}
        <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden bg-zinc-900">
          <Image
            src={menu.image}
            alt={menu.name}
            fill
            className="object-cover"
          />
        </div>

        {/* 상세/옵션 */}
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {menu.name}
          </h1>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500 mt-1">
            {menu.eng}
          </p>

          <p className="mt-4 text-sm text-zinc-300 leading-relaxed">
            {menu.description}
          </p>

          {/* 코스 구성 */}
          <div className="mt-4">
            <h2 className="text-sm font-semibold text-zinc-200 mb-1">
              코스 구성 ({style.toUpperCase()})
            </h2>
            <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1">
              {styledCourses.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {/* 스타일 선택 */}
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-zinc-200 mb-2">
              서빙 스타일
            </h2>
            <div className="flex flex-wrap gap-2">
              {styles.map((s) => (
                <button
                  key={s.style}
                  onClick={() => setStyle(s.style)}
                  className={`px-4 py-2 rounded-full text-xs border transition ${
                    style === s.style
                      ? "bg-white text-black border-white"
                      : "bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-400"
                  }`}
                >
                  {s.label} · {s.description}
                </button>
              ))}
            </div>
          </div>

          {/* 바게트 수량 */}
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-zinc-200 mb-1">
              바게트빵 개수
            </h2>
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center border border-zinc-700 rounded-full overflow-hidden">
                <button
                  type="button"
                  onClick={() => changeBread(-1)}
                  className="px-3 py-1 text-sm bg-zinc-900"
                >
                  -
                </button>
                <span className="px-4 text-sm">{baguetteCount}</span>
                <button
                  type="button"
                  onClick={() => changeBread(1)}
                  className="px-3 py-1 text-sm bg-zinc-900"
                >
                  +
                </button>
              </div>
              <span className="text-[11px] text-zinc-500">
                기본 제공: {defaults.bread}개 (
                {extraPrices.extraBreadPrice.toLocaleString()}원/추가 1개)
              </span>
            </div>
          </div>

          {/* 와인/샴페인 수량 */}
          <div className="mt-4">
            <h2 className="text-sm font-semibold text-zinc-200 mb-1">
              와인 / 샴페인 병 수
            </h2>
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center border border-zinc-700 rounded-full overflow-hidden">
                <button
                  type="button"
                  onClick={() => changeWine(-1)}
                  className="px-3 py-1 text-sm bg-zinc-900"
                >
                  -
                </button>
                <span className="px-4 text-sm">{wineCount}</span>
                <button
                  type="button"
                  onClick={() => changeWine(1)}
                  className="px-3 py-1 text-sm bg-zinc-900"
                >
                  +
                </button>
              </div>
              <span className="text-[11px] text-zinc-500">
                기본 제공: {defaults.wine}병 (
                {extraPrices.extraWinePrice.toLocaleString()}원/추가 1병)
              </span>
            </div>
          </div>

          {/* 날짜 + 시간 */}
          <div className="mt-4">
            <h2 className="text-sm font-semibold text-zinc-200 mb-1">
              희망 배송일
            </h2>
            <input
              type="date"
              min={todayStr}
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="p-2 border border-zinc-700 rounded-md bg-zinc-900 text-sm"
            />
            <p className="mt-1 text-[11px] text-zinc-500">
              오늘({todayStr}) 이후 날짜만 선택 가능합니다.
            </p>
          </div>

          <div className="mt-3">
            <h2 className="text-sm font-semibold text-zinc-200 mb-1">
              희망 배송 시간
            </h2>
            <select
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              className="p-2 border border-zinc-700 rounded-md bg-zinc-900 text-sm"
            >
              <option value="">시간 선택</option>
              {timeSlots.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-zinc-500">
              18:00 ~ 23:00 사이, 1시간 단위로 예약 가능합니다.
            </p>
          </div>

          {/* 가격 + 버튼 */}
          <div className="mt-6 flex flex-col gap-2">
            <div className="text-sm text-zinc-300">
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
            <div className="text-lg font-semibold">
              예상 결제 금액: {totalPrice.toLocaleString()}원
            </div>
            <button
              onClick={handleNext}
              className="w-full rounded-xl bg-white text-black py-3 text-sm font-semibold"
            >
              주문 정보 확인하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
