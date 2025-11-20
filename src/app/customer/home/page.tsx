// src/app/customer/home/page.tsx
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { getAllMenus } from "@/lib/data/menuRepository";

export default function HomePage() {
  const router = useRouter();
  const menus = getAllMenus();

  const goDetail = (id: string) => {
    router.push(`/customer/home/${id}`);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-6 py-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Mr.Daebak Dinner</h1>
        <button
          className="text-sm text-zinc-300 hover:text-white underline-offset-4 hover:underline"
          onClick={() => router.push("/customer/orders")}
        >
          주문 조회
        </button>
      </header>

      <section className="max-w-5xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">
          오늘의 디너 메뉴
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {menus.map((m) => (
            <button
              key={m.id}
              onClick={() => goDetail(m.id)}
              className="group text-left rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-500 transition"
            >
              <div className="relative w-full h-44">
                <Image
                  src={m.image}
                  alt={m.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-base font-semibold">{m.name}</h3>
                  <span className="text-sm font-bold">
                    {m.basePrice.toLocaleString()}원
                  </span>
                </div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 mb-2">
                  {m.eng}
                </p>
                <p className="text-xs text-zinc-400 line-clamp-2">
                  {m.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
