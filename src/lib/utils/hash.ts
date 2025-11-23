// src/lib/utils/hash.ts

// 간단한 해시 (SHA-256 같은 무거운거 필요 없음)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash.toString(16).slice(0, 8); // 8자리만 사용
}

// 🔥 전화번호 기반 guestId 생성
export function makeGuestIdFromPhone(phone: string): string {
  // 010-1234-5678 → 숫자만 남기기
  const digits = phone.replace(/[^0-9]/g, "");

  // 뒤 8자리 키값 (주 조회용)
  const last8 = digits.slice(-8);

  // 해시값 생성
  const hashed = simpleHash(digits);

  // 최종 guestId
  return `guest-${hashed}-${last8}`;
}
