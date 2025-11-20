// src/app/customer/complete/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function CompletePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 text-white px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">주문이 완료되었습니다 🎉</h1>
        <p className="text-sm text-zinc-300 mb-6">
          고객님이 선택하신 디너를 요청하신 일시에 맞추어 준비하겠습니다.
          <br />
          주문 내역은 &quot;주문 조회&quot; 메뉴에서 다시 확인하실 수 있습니다.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            className="px-4 py-2 rounded-full bg-white text-black text-sm font-semibold"
            onClick={() => router.push("/customer/home")}
          >
            다른 디너 보러가기
          </button>
          <button
            className="px-4 py-2 rounded-full border border-zinc-500 text-sm"
            onClick={() => router.push("/customer/orders")}
          >
            주문 조회하기
          </button>
        </div>
      </div>
    </main>
  );
}
