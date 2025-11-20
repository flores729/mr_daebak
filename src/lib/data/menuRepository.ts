// src/lib/data/menuRepository.ts

import {
  MenuId,
  MenuOptionStyle,
  MenuRow,
} from "./menuSchema";
import {
  MENUS,
  MENU_OPTIONS,
  MENU_STYLES,
  MENU_COURSES,
  MENU_EXTRA_PRICES,
} from "./menuData";

export interface MenuDetail {
  menu: MenuRow;
  defaults: {
    bread: number;
    wine: number;
    style: MenuOptionStyle;
  };
  styles: {
    style: MenuOptionStyle;
    label: string;
    description: string;
  }[];
  coursesByStyle: Record<MenuOptionStyle, string[]>;
  extraPrices: {
    extraBreadPrice: number;
    extraWinePrice: number;
  };
}

// 메뉴 상세 정보 조회 (인메모리 "DB" 역할)
export function getMenuDetail(menuId: MenuId): MenuDetail | null {
  const menu = MENUS.find((m) => m.id === menuId);
  if (!menu) return null;

  const opt = MENU_OPTIONS.find((o) => o.menuId === menuId);
  const styles = MENU_STYLES.filter((s) => s.menuId === menuId);
  const courses = MENU_COURSES.filter((c) => c.menuId === menuId);
  const extra = MENU_EXTRA_PRICES.find((p) => p.menuId === menuId);

  const coursesByStyle: Record<MenuOptionStyle, string[]> = {
    simple: [],
    grand: [],
    deluxe: [],
  };

  courses
    .sort((a, b) => a.order - b.order)
    .forEach((c) => {
      coursesByStyle[c.style].push(c.text);
    });

  return {
    menu,
    defaults: {
      bread: opt?.defaultBread ?? 1,
      wine: opt?.defaultWine ?? 0,
      style: opt?.defaultStyle ?? "simple",
    },
    styles: styles.map((s) => ({
      style: s.style,
      label: s.label,
      description: s.description,
    })),
    coursesByStyle,
    extraPrices: {
      extraBreadPrice: extra?.extraBreadPrice ?? 0,
      extraWinePrice: extra?.extraWinePrice ?? 0,
    },
  };
}

// 메뉴 리스트(카드 뿌릴 때)용 간단 조회
export function getAllMenus(): MenuRow[] {
  return MENUS;
}
