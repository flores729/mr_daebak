// src/lib/data/menuSchema.ts

export type MenuId = string; // 현재는 "valentine" | "french" | ... 를 쓰지만, 나중 DB 확장 고려해서 string

export type MenuOptionStyle = "simple" | "grand" | "deluxe";

// 1) 메뉴 마스터 (Menus)
export interface MenuRow {
  id: MenuId;
  name: string;
  eng: string;
  image: string;
  basePrice: number;
  description: string;
}

// 2) 메뉴 기본 옵션 (default bread/wine/style)
export interface MenuOptionRow {
  menuId: MenuId;
  defaultBread: number;
  defaultWine: number;
  defaultStyle: MenuOptionStyle;
}

// 3) 스타일 정보 (스타일 이름/설명)
export interface MenuStyleRow {
  menuId: MenuId;
  style: MenuOptionStyle;
  label: string;        // 버튼에 찍힐 라벨 (예: SIMPLE, GRAND)
  description: string;  // 스타일 설명
}

// 4) 코스 구성 (스타일별 코스 단계)
export interface MenuCourseRow {
  menuId: MenuId;
  style: MenuOptionStyle;
  order: number;        // 1,2,3...
  text: string;         // "에피타이저: ~"
}

// 5) 추가 옵션 가격 (메뉴별 추가 금액 정책)
export interface MenuExtraPriceRow {
  menuId: MenuId;
  extraBreadPrice: number; // 바게트 1개 당 추가금
  extraWinePrice: number;  // 와인/샴페인 1병 당 추가금
}
