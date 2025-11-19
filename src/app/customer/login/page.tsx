"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";

// 한 페이지 안에서 보여줄 모드들
type Mode = "initial" | "login" | "guest" | "signup";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("initial");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useUserStore((s) => s.setUser);
  const router = useRouter();

  // 공통: 이름 비어 있으면 기본값
  const safeName = (fallback = "Guest") =>
    (name || email.split("@")[0] || fallback).trim() || fallback;

  // 로그인 완료 처리
  const handleLogin = () => {
    // 실제 인증은 없고, 그냥 로그인된 상태로만 처리
    setUser({ name: safeName("Member"), isGuest: false });
    router.push("/customer/home");
  };

  // 비회원 시작
  const handleGuest = () => {
    setUser({ name: safeName("Guest"), isGuest: true });
    router.push("/customer/home");
  };

  // 회원가입 완료 처리
  const handleSignup = () => {
    // 가입 처리도 실제 서버는 없으니, 가입했다고 치고 로그인 상태로 진입
    setUser({ name: safeName("Member"), isGuest: false });
    router.push("/customer/home");
  };

  // 모드 변경 시 입력값 초기화
  const changeMode = (next: Mode) => {
    setMode(next);
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* 배경 이미지 */}
      <Image
        src="/loginpage.webp" 
        alt="Mr.Daebak dinner"
        fill
        priority
        className="object-cover"
      />

      {/* 어두운 오버레이 */}
      <div className="absolute inset-0 bg-black/45" />

      {/* 상단 바 */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-10 py-6 text-white">
        <div className="text-2xl font-extrabold tracking-tight">
          Mr.Daebak
        </div>
        <button className="text-sm font-medium underline-offset-4 hover:underline">
          우아하개
        </button>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="relative z-10 flex min-h-screen w-full items-center justify-center px-4">
        <div className="grid w-full max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">
          {/* 왼쪽: 카피 */}
          <div className="flex flex-col justify-center text-white">
            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              여유롭게
              <br />
              그리고 완벽하게
            </h1>

            <p className="mb-8 text-xl font-semibold md:text-2xl">
              특별한 날의 디너를
              <br />
              Mr.Daebak 이 준비합니다.
            </p>

            {/* 버튼 3개: 로그인 / 비회원 / 회원으로 시작하기 */}
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => changeMode("login")}
                className={`flex-1 rounded-full px-5 py-3 text-sm font-semibold transition ${
                  mode === "login"
                    ? "bg-emerald-400 text-zinc-900 shadow-lg shadow-emerald-500/40"
                    : "bg-white/15 text-white border border-white/40 hover:bg-white/25"
                }`}
              >
                로그인
              </button>
              <button
                onClick={() => changeMode("guest")}
                className={`flex-1 rounded-full px-5 py-3 text-sm font-semibold transition ${
                  mode === "guest"
                    ? "bg-emerald-400 text-zinc-900 shadow-lg shadow-emerald-500/40"
                    : "bg-white/15 text-white border border-white/40 hover:bg-white/25"
                }`}
              >
                비회원
              </button>
              <button
                onClick={() => changeMode("signup")}
                className={`flex-1 rounded-full px-5 py-3 text-sm font-semibold transition ${
                  mode === "signup"
                    ? "bg-emerald-400 text-zinc-900 shadow-lg shadow-emerald-500/40"
                    : "bg-white/15 text-white border border-white/40 hover:bg-white/25"
                }`}
              >
                회원으로 시작하기
              </button>
            </div>
          </div>

          {/* 오른쪽: 선택된 모드에 따라 폼 변경 */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md rounded-2xl bg-black/65 p-6 text-white shadow-xl backdrop-blur-md">
              {mode === "initial" && (
                <div className="space-y-3 text-sm text-zinc-200">
                  <p>로그인 방식 하나를 선택해주세요.</p>
                  <p>
                    • <span className="font-semibold">로그인</span> : 기존 회원
                    정보로 접속
                    <br />
                    • <span className="font-semibold">비회원</span> : 이름만
                    입력하고 빠르게 주문
                    <br />
                    •{" "}
                    <span className="font-semibold">회원으로 시작하기</span> :
                    간단한 정보로 계정 생성
                  </p>
                </div>
              )}

              {mode === "login" && (
                <>
                  <h2 className="mb-4 text-lg font-semibold">로그인</h2>
                  <div className="mb-3">
                    <label className="mb-1 block text-xs text-zinc-300">
                      이메일 또는 아이디
                    </label>
                    <input
                      className="w-full rounded-md border border-white/40 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-emerald-300"
                      placeholder="example@mrdaebak.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="mb-1 block text-xs text-zinc-300">
                      비밀번호
                    </label>
                    <input
                      type="password"
                      className="w-full rounded-md border border-white/40 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-emerald-300"
                      placeholder="비밀번호"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleLogin}
                    className="w-full rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow shadow-emerald-500/40 transition hover:bg-emerald-300"
                  >
                    로그인하기
                  </button>
                  <button
                    onClick={() => changeMode("signup")}
                    className="mt-3 w-full text-center text-xs text-zinc-300 underline-offset-2 hover:underline"
                  >
                    아직 회원이 아니신가요? 회원으로 시작하기
                  </button>
                </>
              )}

              {mode === "guest" && (
                <>
                  <h2 className="mb-4 text-lg font-semibold">비회원 주문</h2>
                  <div className="mb-4">
                    <label className="mb-1 block text-xs text-zinc-300">
                      이름
                    </label>
                    <input
                      className="w-full rounded-md border border-white/40 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-emerald-300"
                      placeholder="예) 홍길동"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleGuest}
                    className="w-full rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow shadow-emerald-500/40 transition hover:bg-emerald-300"
                  >
                    비회원으로 시작하기
                  </button>
                </>
              )}

              {mode === "signup" && (
                <>
                  <h2 className="mb-4 text-lg font-semibold">
                    회원으로 시작하기
                  </h2>
                  <div className="mb-3">
                    <label className="mb-1 block text-xs text-zinc-300">
                      이름
                    </label>
                    <input
                      className="w-full rounded-md border border-white/40 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-emerald-300"
                      placeholder="예) 홍길동"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="mb-1 block text-xs text-zinc-300">
                      이메일
                    </label>
                    <input
                      className="w-full rounded-md border border-white/40 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-emerald-300"
                      placeholder="example@mrdaebak.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="mb-1 block text-xs text-zinc-300">
                      비밀번호
                    </label>
                    <input
                      type="password"
                      className="w-full rounded-md border border-white/40 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-emerald-300"
                      placeholder="비밀번호"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleSignup}
                    className="w-full rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow shadow-emerald-500/40 transition hover:bg-emerald-300"
                  >
                    회원으로 시작하기
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
