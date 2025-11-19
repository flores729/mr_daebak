"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";
import { saveUser, findUser } from "@/lib/storage/userStorage";
import { generateGuestId } from "@/lib/utils/hash";

type Mode = "initial" | "login" | "guest" | "signup";

// 정규식 --------------------------------------------------
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

  const setUser = useUserStore((s) => s.setUser);
  const router = useRouter();

  // 🔥 비어있는 입력값 있는지 체크
  const checkEmpty = (fields: Record<string, string>) => {
    for (const key in fields) {
      if (!fields[key].trim()) {
        alert(`${key} 항목을 입력해주세요.`);
        return false;
      }
    }
    return true;
  };

  // 로그인 처리 -------------------------------------------
  const handleLogin = () => {
    if (!checkEmpty({ 이메일: email, 비밀번호: password })) return;

    if (!emailRegex.test(email)) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }

    const user = findUser(email, password);
    if (!user) {
      alert("이메일 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    setUser({
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
      isGuest: false,
    });

    router.push("/customer/home");
  };

  // 비회원 시작 --------------------------------------------
  const handleGuest = () => {
    if (!checkEmpty({ 이름: name, 주소: address, 전화번호: phone })) return;

    if (!phoneRegex.test(phone)) {
      alert("전화번호 형식이 잘못되었습니다. 예: 010-1234-5678");
      return;
    }
    if (!addressRegex.test(address)) {
      alert("주소는 최소 8자 이상, 한글/숫자 조합으로 입력해주세요.");
      return;
    }

    const guestId = generateGuestId();

    setUser({
      name,
      guestId,
      address,
      phone,
      isGuest: true,
    });

    router.push("/customer/home");
  };

  // 회원가입 처리 ------------------------------------------
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

    if (!emailRegex.test(email)) {
      alert("올바른 이메일 형식이 아닙니다.");
      return;
    }
    if (password.length < 6) {
      alert("비밀번호는 최소 6자리 이상이어야 합니다.");
      return;
    }
    if (!addressRegex.test(address)) {
      alert("주소는 최소 8자 이상, 한글/숫자 조합으로 입력해주세요.");
      return;
    }
    if (!phoneRegex.test(phone)) {
      alert("전화번호 형식이 잘못되었습니다. 예: 010-1234-5678");
      return;
    }

    const newUser = {
      name,
      email,
      password,
      address,
      phone,
    };

    saveUser(newUser);

    setUser({
      name: newUser.name,
      email: newUser.email,
      address: newUser.address,
      phone: newUser.phone,
      isGuest: false,
    });

    router.push("/customer/home");
  };

  const changeMode = (next: Mode) => {
    setMode(next);
    setName("");
    setEmail("");
    setPassword("");
    setAddress("");
    setPhone("");
  };

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

      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-10 py-6 text-white">
        <div className="text-2xl font-extrabold">Mr.Daebak</div>
        <button className="text-sm underline-offset-4 hover:underline">
          우아하개
        </button>
      </header>

      <main className="relative z-10 flex min-h-screen w-full items-center justify-center px-4">
        <div className="grid w-full max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">
          {/* LEFT COPY */}
          <div className="flex flex-col justify-center text-white">
            <h1 className="mb-6 text-4xl font-extrabold leading-tight">
              여유롭게
              <br />
              그리고 완벽하게
            </h1>

            <p className="mb-8 text-xl font-semibold">
              특별한 날의 디너를
              <br />
              Mr.Daebak 이 준비합니다.
            </p>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => changeMode("login")}
                className={`flex-1 rounded-full px-5 py-3 text-sm font-semibold ${
                  mode === "login"
                    ? "bg-emerald-400 text-black"
                    : "bg-white/20 text-white border border-white/40"
                }`}
              >
                로그인
              </button>
              <button
                onClick={() => changeMode("guest")}
                className={`flex-1 rounded-full px-5 py-3 text-sm font-semibold ${
                  mode === "guest"
                    ? "bg-emerald-400 text-black"
                    : "bg-white/20 text-white border border-white/40"
                }`}
              >
                비회원 주문
              </button>
              <button
                onClick={() => changeMode("signup")}
                className={`flex-1 rounded-full px-5 py-3 text-sm font-semibold ${
                  mode === "signup"
                    ? "bg-emerald-400 text-black"
                    : "bg-white/20 text-white border border-white/40"
                }`}
              >
                회원가입
              </button>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md rounded-2xl bg-black/60 p-6 text-white backdrop-blur-md">
              {/* 초기 모드 */}
              {mode === "initial" && (
                <div className="space-y-3 text-sm text-zinc-200">
                  <p>로그인 방식을 선택해주세요.</p>
                  <p>
                    • <b>로그인</b> : 기존 계정으로 접속  
                    <br />• <b>비회원 주문</b> : 간단 정보 입력 후 주문  
                    <br />• <b>회원가입</b> : 모든 정보 입력 후 계정 생성
                  </p>
                </div>
              )}

              {/* 로그인 */}
              {mode === "login" && (
                <>
                  <h2 className="text-lg font-semibold mb-4">로그인</h2>

                  <div className="mb-3">
                    <label className="text-xs">이메일</label>
                    <input
                      className="w-full p-2 rounded bg-black/30 border border-white/40"
                      placeholder="example@mrdaebak.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="text-xs">비밀번호</label>
                    <input
                      type="password"
                      className="w-full p-2 rounded bg-black/30 border border-white/40"
                      placeholder="비밀번호"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={handleLogin}
                    className="w-full bg-emerald-400 text-black py-2 rounded-full font-semibold"
                  >
                    로그인하기
                  </button>
                </>
              )}

              {/* 비회원 */}
              {mode === "guest" && (
                <>
                  <h2 className="text-lg font-semibold mb-4">비회원 주문</h2>

                  <div className="mb-3">
                    <label className="text-xs">이름</label>
                    <input
                      className="w-full p-2 rounded bg-black/30 border border-white/40"
                      placeholder="예) 홍길동"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="text-xs">주소</label>
                    <input
                      className="w-full p-2 rounded bg-black/30 border border-white/40"
                      placeholder="예) 서울시 강남구 테헤란로 12"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="text-xs">전화번호</label>
                    <input
                      className="w-full p-2 rounded bg-black/30 border border-white/40"
                      placeholder="010-1234-5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={handleGuest}
                    className="w-full bg-emerald-400 text-black py-2 rounded-full font-semibold"
                  >
                    비회원으로 주문하기
                  </button>
                </>
              )}

              {/* 회원가입 */}
              {mode === "signup" && (
                <>
                  <h2 className="text-lg font-semibold mb-4">회원가입</h2>

                  {/* 이름 */}
                  <div className="mb-3">
                    <label className="text-xs">이름</label>
                    <input
                      className="w-full p-2 rounded bg-black/30 border border-white/40"
                      placeholder="예) 홍길동"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  {/* 이메일 */}
                  <div className="mb-3">
                    <label className="text-xs">이메일</label>
                    <input
                      className="w-full p-2 rounded bg-black/30 border border-white/40"
                      placeholder="example@mrdaebak.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {/* 비밀번호 */}
                  <div className="mb-3">
                    <label className="text-xs">비밀번호</label>
                    <input
                      type="password"
                      className="w-full p-2 rounded bg-black/30 border border-white/40"
                      placeholder="비밀번호 (6자리 이상)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  {/* 주소 */}
                  <div className="mb-3">
                    <label className="text-xs">주소</label>
                    <input
                      className="w-full p-2 rounded bg-black/30 border border-white/40"
                      placeholder="예) 서울시 강남구 역삼동 123"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  {/* 전화번호 */}
                  <div className="mb-4">
                    <label className="text-xs">전화번호</label>
                    <input
                      className="w-full p-2 rounded bg-black/30 border border-white/40"
                      placeholder="010-1234-5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={handleSignup}
                    className="w-full bg-emerald-400 text-black py-2 rounded-full font-semibold"
                  >
                    회원가입 완료
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
