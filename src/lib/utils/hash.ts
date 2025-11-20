export async function makeGuestId(phone: string): Promise<string> {
  const digits = phone.replace(/\D/g, "");
  const last8 = digits.slice(-8);

  const encoder = new TextEncoder();
  const data = encoder.encode(last8);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  const hashArray = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 12);

  return `g-${hashArray}`;
}

// 로그인 페이지 호환을 위해 추가 export
export const makeGuestIdFromPhone = makeGuestId;
