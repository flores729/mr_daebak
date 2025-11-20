// src/lib/data/menuData.ts

import {
  MenuRow,
  MenuOptionRow,
  MenuStyleRow,
  MenuCourseRow,
  MenuExtraPriceRow,
} from "./menuSchema";

// 1) Menus (메뉴 마스터)
export const MENUS: MenuRow[] = [
  {
    id: "valentine",
    name: "발렌타인 디너",
    eng: "Valentine Dinner",
    image: "/menu/valentine.jpg",
    basePrice: 79000,
    description:
      "로맨틱한 분위기를 위한 발렌타인 데이 전용 프리미엄 디너 메뉴입니다.",
  },
  {
    id: "french",
    name: "프렌치 디너",
    eng: "French Dinner",
    image: "/menu/french.webp",
    basePrice: 89000,
    description:
      "정통 프렌치 감성을 담은 고급 디너 구성입니다. 깊은 풍미의 스테이크와 와인을 함께 제공합니다.",
  },
  {
    id: "english",
    name: "잉글리시 디너",
    eng: "English Dinner",
    image: "/menu/english.jpg",
    basePrice: 85000,
    description:
      "영국 전통의 디너 스타일로 구성된 세트입니다. 클래식한 Meat & Bread 조합.",
  },
  {
    id: "champagne",
    name: "샴페인 축제 디너",
    eng: "Champagne Festival Dinner",
    image: "/menu/champagne.png",
    basePrice: 129000,
    description:
      "스페셜 이벤트와 기념일을 위한 최상급 샴페인 디너 코스.",
  },
];

// 2) 기본 옵션
export const MENU_OPTIONS: MenuOptionRow[] = [
  {
    menuId: "valentine",
    defaultBread: 1,
    defaultWine: 1,
    defaultStyle: "simple",
  },
  {
    menuId: "french",
    defaultBread: 2,
    defaultWine: 1,
    defaultStyle: "simple",
  },
  {
    menuId: "english",
    defaultBread: 2,
    defaultWine: 0,
    defaultStyle: "simple",
  },
  {
    menuId: "champagne",
    defaultBread: 2,
    defaultWine: 1,
    defaultStyle: "grand",
  },
];

// 3) 스타일 정보
export const MENU_STYLES: MenuStyleRow[] = [
  // valentine
  {
    menuId: "valentine",
    style: "simple",
    label: "SIMPLE",
    description: "기본 디너 구성",
  },
  {
    menuId: "valentine",
    style: "grand",
    label: "GRAND",
    description: "테이블 데코+와인 업그레이드 구성",
  },
  {
    menuId: "valentine",
    style: "deluxe",
    label: "DELUXE",
    description: "풀 세팅 + 프리미엄 와인 구성",
  },

  // french
  {
    menuId: "french",
    style: "simple",
    label: "SIMPLE",
    description: "기본 프렌치 디너 구성",
  },
  {
    menuId: "french",
    style: "grand",
    label: "GRAND",
    description: "프리미엄 스프 추가 + 와인 한 단계 업그레이드",
  },
  {
    menuId: "french",
    style: "deluxe",
    label: "DELUXE",
    description: "전체 코스 업그레이드 + 디저트 추가 구성",
  },

  // english
  {
    menuId: "english",
    style: "simple",
    label: "SIMPLE",
    description: "잉글리시 클래식 기본 구성",
  },
  {
    menuId: "english",
    style: "grand",
    label: "GRAND",
    description: "디저트 & 음료 업그레이드 구성",
  },
  {
    menuId: "english",
    style: "deluxe",
    label: "DELUXE",
    description: "풀코스 업그레이드 + 프리미엄 티 세트 포함",
  },

  // champagne
  {
    menuId: "champagne",
    style: "simple",
    label: "SIMPLE",
    description: "기본 구성 (샴페인 1병 포함)",
  },
  {
    menuId: "champagne",
    style: "grand",
    label: "GRAND",
    description: "샴페인 + 스테이크 업그레이드 구성",
  },
  {
    menuId: "champagne",
    style: "deluxe",
    label: "DELUXE",
    description: "전체 구성이 최상급으로 업그레이드된 VIP 디너",
  },
];

// 4) 코스 구성
export const MENU_COURSES: MenuCourseRow[] = [
  // valentine - simple
  {
    menuId: "valentine",
    style: "simple",
    order: 1,
    text: "에피타이저: 시그니처 샐러드",
  },
  {
    menuId: "valentine",
    style: "simple",
    order: 2,
    text: "메인: 스테이크 & 바게트",
  },
  {
    menuId: "valentine",
    style: "simple",
    order: 3,
    text: "디저트: 미니 케이크",
  },

  // valentine - grand
  {
    menuId: "valentine",
    style: "grand",
    order: 1,
    text: "웰컴 드링크: 스파클링 와인",
  },
  {
    menuId: "valentine",
    style: "grand",
    order: 2,
    text: "에피타이저: 연어 카르파치오",
  },
  {
    menuId: "valentine",
    style: "grand",
    order: 3,
    text: "메인: 스테이크 & 트러플 매쉬 포테이토",
  },
  {
    menuId: "valentine",
    style: "grand",
    order: 4,
    text: "디저트: 하트 모양 케이크",
  },

  // valentine - deluxe
  {
    menuId: "valentine",
    style: "deluxe",
    order: 1,
    text: "샴페인 1잔 + 핑거푸드",
  },
  {
    menuId: "valentine",
    style: "deluxe",
    order: 2,
    text: "에피타이저: 푸아그라 & 샐러드",
  },
  {
    menuId: "valentine",
    style: "deluxe",
    order: 3,
    text: "메인: 프리미엄 스테이크 풀코스",
  },
  {
    menuId: "valentine",
    style: "deluxe",
    order: 4,
    text: "디저트: 셰프 특선 디저트 플레이트",
  },

  // french - simple
  {
    menuId: "french",
    style: "simple",
    order: 1,
    text: "에피타이저: 프렌치 어니언 스프",
  },
  {
    menuId: "french",
    style: "simple",
    order: 2,
    text: "메인: 프렌치 스테이크 & 바게트",
  },
  {
    menuId: "french",
    style: "simple",
    order: 3,
    text: "디저트: 크렘 브륄레",
  },

  // french - grand
  {
    menuId: "french",
    style: "grand",
    order: 1,
    text: "웰컴 와인 서비스",
  },
  {
    menuId: "french",
    style: "grand",
    order: 2,
    text: "에피타이저: 프렌치 어니언 스프 + 치즈 플레이트",
  },
  {
    menuId: "french",
    style: "grand",
    order: 3,
    text: "메인: 프리미엄 스테이크 & 바게트",
  },
  {
    menuId: "french",
    style: "grand",
    order: 4,
    text: "디저트: 마카롱 세트",
  },

  // french - deluxe
  {
    menuId: "french",
    style: "deluxe",
    order: 1,
    text: "샴페인 혹은 프리미엄 와인 선택",
  },
  {
    menuId: "french",
    style: "deluxe",
    order: 2,
    text: "에피타이저: 카나페 & 스프",
  },
  {
    menuId: "french",
    style: "deluxe",
    order: 3,
    text: "메인: 풀코스 프렌치 디너",
  },
  {
    menuId: "french",
    style: "deluxe",
    order: 4,
    text: "디저트: 디저트 2종 플래터",
  },

  // english - simple
  {
    menuId: "english",
    style: "simple",
    order: 1,
    text: "메인: 영국식 스테이크",
  },
  {
    menuId: "english",
    style: "simple",
    order: 2,
    text: "사이드: 로스트 포테이토",
  },
  {
    menuId: "english",
    style: "simple",
    order: 3,
    text: "디저트: 홍차 디저트",
  },

  // english - grand
  {
    menuId: "english",
    style: "grand",
    order: 1,
    text: "에피타이저: 토마토 수프",
  },
  {
    menuId: "english",
    style: "grand",
    order: 2,
    text: "메인: 영국식 스테이크 & 로스트 포테이토",
  },
  {
    menuId: "english",
    style: "grand",
    order: 3,
    text: "디저트: 스콘 & 홍차 세트",
  },

  // english - deluxe
  {
    menuId: "english",
    style: "deluxe",
    order: 1,
    text: "에피타이저: 치즈 플래터 & 수프",
  },
  {
    menuId: "english",
    style: "deluxe",
    order: 2,
    text: "메인: 프리미엄 영국식 풀코스",
  },
  {
    menuId: "english",
    style: "deluxe",
    order: 3,
    text: "디저트: 디저트 & 티 세트",
  },

  // champagne - simple
  {
    menuId: "champagne",
    style: "simple",
    order: 1,
    text: "샴페인 1병",
  },
  {
    menuId: "champagne",
    style: "simple",
    order: 2,
    text: "메인: 스테이크 & 바게트",
  },
  {
    menuId: "champagne",
    style: "simple",
    order: 3,
    text: "디저트: 트러플 디저트",
  },

  // champagne - grand
  {
    menuId: "champagne",
    style: "grand",
    order: 1,
    text: "샴페인 1병 (업그레이드)",
  },
  {
    menuId: "champagne",
    style: "grand",
    order: 2,
    text: "에피타이저: 시그니처 전채 요리",
  },
  {
    menuId: "champagne",
    style: "grand",
    order: 3,
    text: "메인: 프리미엄 스테이크 & 바게트",
  },
  {
    menuId: "champagne",
    style: "grand",
    order: 4,
    text: "디저트: 트러플 디저트 플레이트",
  },

  // champagne - deluxe
  {
    menuId: "champagne",
    style: "deluxe",
    order: 1,
    text: "샴페인 2병 또는 동급 와인 선택",
  },
  {
    menuId: "champagne",
    style: "deluxe",
    order: 2,
    text: "에피타이저: 셰프 스페셜 2종",
  },
  {
    menuId: "champagne",
    style: "deluxe",
    order: 3,
    text: "메인: 최상급 스테이크 풀코스",
  },
  {
    menuId: "champagne",
    style: "deluxe",
    order: 4,
    text: "디저트: 프리미엄 디저트 2종 구성",
  },
];

// 5) 추가 가격
export const MENU_EXTRA_PRICES: MenuExtraPriceRow[] = [
  {
    menuId: "valentine",
    extraBreadPrice: 3000,
    extraWinePrice: 35000,
  },
  {
    menuId: "french",
    extraBreadPrice: 3000,
    extraWinePrice: 35000,
  },
  {
    menuId: "english",
    extraBreadPrice: 3000,
    extraWinePrice: 35000,
  },
  {
    menuId: "champagne",
    extraBreadPrice: 3000,
    extraWinePrice: 35000,
  },
];
