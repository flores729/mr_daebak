"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";
import { saveUser, findUser } from "@/lib/storage/userStorage";
import { makeGuestIdFromPhone } from "@/lib/utils/hash";

type Mode = "initial" | "login" | "signup" | "guest";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^01[0-9]-?\d{3,4}-?\d{4}$/;
const addressRegex = /^[가-힣0-9\s.,-]{8,}$/;

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("initial");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [guestLookup, setGuestLookup] = useState("");

  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);

  const resetInputs = () => {
    setName("");
    setEmail("");
    setPassword("");
    setAddress("");
    setPhone("");
    setGuestLookup("");
  };

  const changeMode = (m: Mode) => {
    setMode(m);
    resetInputs();
  };

  const checkEmpty = (fields: Record<string, string>) => {
    for (const k in fields) {
      if (!fields[k].trim()) {
        alert(`${k} 항목을 입력해주세요.`);
        return false;
      }
    }
    return true;
  };

  // 로그인
  const handleLogin = () => {
    if (!checkEmpty({ 이메일: email, 비밀번호: password })) return;
    if (!emailRegex.test(email)) return alert("이메일 형식 오류");

    const user = findUser(email, password);
    if (!user) return alert("이메일 또는 비밀번호가 올바르지 않습니다.");

    setUser({
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
      isGuest: false,
    });

    router.push("/customer/home");
  };

  // 회원가입
  const handleSignup = () => {
    if (
      !checkEmpty({
        이름: name,
        이메일: email,
        비밀번호: password,
        주소: address,
        전화번호: phone,
      })
    )
      return;

    if (!emailRegex.test(email)) return alert("이메일 형식 오류");
    if (password.length < 8) return alert("비밀번호는 8자 이상이어야 합니다.");
    if (!addressRegex.test(address)) return alert("주소 형식 오류");
    if (!phoneRegex.test(phone)) return alert("전화번호 형식 오류");

    const newUser = { name, email, password, address, phone };
    saveUser(newUser);

    setUser({
      name,
      email,
      address,
      phone,
      isGuest: false,
    });

    router.push("/customer/home");
  };

  // 비회원 주문
  const handleGuest = () => {
    if (!checkEmpty({ 이름: name, 주소: address, 전화번호: phone })) return;

    if (!addressRegex.test(address)) return alert("주소 형식 오류");
    if (!phoneRegex.test(phone)) return alert("전화번호 형식 오류");

    const guestId = makeGuestIdFromPhone(phone);

    setUser({
      name,
      guestId,
      address,
      phone,
      isGuest: true,
    });

    router.push("/customer/home");
  };

  // 비회원 주문조회
  const handleGuestLookup = () => {
    if (!guestLookup.trim())
      return alert("조회번호 또는 전화번호 뒤 8자리를 입력해주세요.");

    router.push(`/customer/orders?guest=${guestLookup}`);
  };

  const enterKey = (e: React.KeyboardEvent<HTMLInputElement>, fn: () => void) => {
    if (e.key === "Enter") fn();
  };

  // ============================
  // 오른쪽 설명 + 폼 렌더링
  // ============================
  const renderRightPanel = () => {
    // ---------------------------------
    // 🔥 초기 설명 화면
    // ---------------------------------
    if (mode === "initial")
      return (
        <div className="text-zinc-200 space-y-4">
          <h2 className="text-xl font-bold mb-2">간편하게 주문을 시작해보세요</h2>
          <p className="text-sm">
            아래 3가지 방식 중 원하는 방법을 선택해 주문을 진행할 수 있습니다.
          </p>
          <ul className="text-sm list-disc list-inside space-y-1">
            <li>• 로그인 : 회원 정보로 빠르게 주문</li>
            <li>• 회원가입 : 계정 생성 후 주문 및 주문내역 관리</li>
            <li>• 비회원 주문 : 회원가입 없이 빠르게 주문</li>
          </ul>
        </div>
      );

    // ---------------------------------
    // 🔥 로그인 설명 + 폼
    // ---------------------------------
    if (mode === "login")
      return (
        <>
          <p className="text-sm text-zinc-300 mb-4">
            이메일과 비밀번호를 입력해 로그인하세요.
          </p>

          <label className="text-xs">이메일</label>
          <input
            className="w-full p-2 mb-3 rounded bg-black/30 border"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => enterKey(e, handleLogin)}
          />

          <label className="text-xs">비밀번호</label>
          <input
            type="password"
            className="w-full p-2 mb-4 rounded bg-black/30 border"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => enterKey(e, handleLogin)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-emerald-400 text-black py-2 rounded-full font-semibold"
          >
            로그인하기
          </button>
        </>
      );

    // ---------------------------------
    // 🔥 회원가입 설명 + 폼
    // ---------------------------------
    if (mode === "signup")
      return (
        <>
          <p className="text-sm text-zinc-300 mb-4">
            기본 정보를 입력해 계정을 생성할 수 있습니다.
          </p>

          <label className="text-xs">이름</label>
          <input
            className="w-full p-2 mb-3 rounded bg-black/30 border"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="text-xs">이메일</label>
          <input
            className="w-full p-2 mb-3 rounded bg-black/30 border"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="text-xs">비밀번호</label>
          <input
            type="password"
            className="w-full p-2 mb-3 rounded bg-black/30 border"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="text-xs">주소</label>
          <input
            className="w-full p-2 mb-3 rounded bg-black/30 border"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <label className="text-xs">전화번호</label>
          <input
            className="w-full p-2 mb-4 rounded bg-black/30 border"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button
            onClick={handleSignup}
            className="w-full bg-emerald-400 text-black py-2 rounded-full font-semibold"
          >
            회원가입 완료
          </button>
        </>
      );

    // ---------------------------------
    // 🔥 비회원 주문 설명 + 폼 + (하단 주문조회)
    // ---------------------------------
    if (mode === "guest")
      return (
        <>
          <p className="text-sm text-zinc-300 mb-4">
            회원가입 없이 주문할 수 있으며, 전화번호를 기준으로 조회번호가 발급됩니다.
          </p>

          <label className="text-xs">이름</label>
          <input
            className="w-full p-2 mb-3 rounded bg-black/30 border"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="text-xs">주소</label>
          <input
            className="w-full p-2 mb-3 rounded bg-black/30 border"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <label className="text-xs">전화번호</label>
          <input
            className="w-full p-2 mb-4 rounded bg-black/30 border"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button
            onClick={handleGuest}
            className="w-full bg-emerald-400 text-black py-2 rounded-full font-semibold"
          >
            비회원으로 주문하기
          </button>

          {/* 비회원 전용 주문조회 */}
          <div className="border-t border-white/20 mt-6 pt-4">
            <h3 className="text-sm font-semibold mb-2">비회원 주문조회</h3>

            <input
              className="w-full p-2 mb-3 rounded bg-black/30 border"
              placeholder="전화번호 뒤 8자리 또는 조회번호"
              value={guestLookup}
              onChange={(e) => setGuestLookup(e.target.value)}
              onKeyDown={(e) => enterKey(e, handleGuestLookup)}
            />

            <button
              onClick={handleGuestLookup}
              className="w-full bg-white text-black py-2 rounded-full font-semibold"
            >
              주문조회
            </button>
          </div>
        </>
      );
  };

  // ================================
  // 렌더링
  // ================================
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Image
        src="/loginpage.webp"
        alt="Mr.Daebak dinner"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* 좌측 버튼 영역 */}
          <div className="flex flex-col justify-center text-white">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              여유롭게
              <br />
              그리고 완벽하게
            </h1>

            <p className="text-xl font-semibold mb-8">
              특별한 날의 디너를
              <br />
              Mr.Daebak이 준비합니다.
            </p>

            {/* 3개 버튼 */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => changeMode("login")}
                className={`flex-1 rounded-full px-5 py-3 text-sm font-semibold ${
                  mode === "login"
                    ? "bg-emerald-400 text-black"
                    : "bg-white/20 border border-white/40"
                }`}
              >
                로그인
              </button>

              <button
                onClick={() => changeMode("signup")}
                className={`flex-1 rounded-full px-5 py-3 text-sm font-semibold ${
                  mode === "signup"
                    ? "bg-emerald-400 text-black"
                    : "bg-white/20 border border-white/40"
                }`}
              >
                회원가입
              </button>

              <button
                onClick={() => changeMode("guest")}
                className={`flex-1 rounded-full px-5 py-3 text-sm font-semibold ${
                  mode === "guest"
                    ? "bg-emerald-400 text-black"
                    : "bg-white/20 border border-white/40"
                }`}
              >
                비회원 주문
              </button>
            </div>
          </div>

          {/* 우측: 설명 + 폼 */}
          <div className="flex justify-center">
            <div className="w-full max-w-md rounded-2xl bg-black/60 p-6 text-white backdrop-blur-md">
              {renderRightPanel()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
