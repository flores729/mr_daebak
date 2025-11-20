// src/app/customer/account/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/useUserStore";
import {
  updateUser as updateStoredUser,
  type StoredUser,
} from "@/lib/storage/userStorage";

export default function AccountPage() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const logout = useUserStore((s) => s.logout);

  // 🔹 훅은 조건 없이 최상단에서만 호출
  const [name, setName] = useState(user?.name ?? "");
  const [email] = useState(user?.email ?? ""); // read-only
  const [address, setAddress] = useState(user?.address ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");

  // ===============================
  // 1. 가드: 로그인 안 된 경우
  // ===============================
  if (!user) {
    return (
      <main className="w-full min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <p className="mb-3 text-sm text-gray-700">
          계정 정보를 보려면 먼저 로그인 또는 비회원 정보를 입력해주세요.
        </p>
        <button
          onClick={() => router.push("/customer/login")}
          className="px-4 py-2 rounded-full bg-black text-white text-sm font-semibold"
        >
          로그인 페이지로 이동
        </button>
      </main>
    );
  }

  // ===============================
  // 2. 비회원인 경우: 수정 불가
  // ===============================
  if (user.isGuest) {
    return (
      <main className="max-w-xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">계정 정보</h1>
        <p className="text-sm text-gray-700 mb-4">
          비회원 주문으로 이용 중입니다. 비회원은 별도의 계정 정보가 저장되지 않습니다.
        </p>
        <button
          onClick={() => router.push("/customer/login")}
          className="px-4 py-2 rounded-full bg-black text-white text-sm font-semibold"
        >
          이메일 계정으로 로그인하기
        </button>
      </main>
    );
  }

  // 여기까지 왔으면: 회원
  const currentEmail = user.email ?? "";

  // ===============================
  // 3. 저장 처리
  // ===============================
  const handleSave = () => {
    if (!currentEmail) {
      alert("이메일 정보가 없습니다. 다시 로그인해주세요.");
      router.push("/customer/login");
      return;
    }

    if (!name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    // StoredUser 타입에 맞게 구성
    const updatedUserInput: StoredUser = {
      name: name.trim(),
      email: currentEmail, // 이메일은 여기서는 변경하지 않음
      address: address.trim(),
      phone: phone.trim(),
      password: "", // 실제 비밀번호는 updateUser 내부에서 saved.password로 유지됨
    };

    const updatedStored = updateStoredUser(updatedUserInput);

    if (!updatedStored) {
      alert("저장에 실패했습니다. 다시 로그인 후 시도해주세요.");
      return;
    }

    // AppUser 형태로 Zustand 업데이트
    setUser({
      name: updatedStored.name,
      email: updatedStored.email,
      address: updatedStored.address,
      phone: updatedStored.phone,
      isGuest: false,
    });

    alert("계정 정보가 수정되었습니다.");
  };

  const handleLogout = () => {
    logout();
    router.push("/customer/login");
  };

  return (
    <main className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">계정 정보</h1>

      <section className="mb-6">
        <h2 className="font-semibold mb-2">회원 정보</h2>

        <Field
          label="이름"
          value={name}
          onChange={setName}
          placeholder="예) 홍길동"
        />

        {/* 이메일은 일단 읽기 전용으로 유지 */}
        <Field
          label="이메일"
          value={email}
          onChange={() => {}}
          placeholder=""
          readOnly
        />

        <Field
          label="주소"
          value={address}
          onChange={setAddress}
          placeholder="예) 서울시 강남구 ..."
        />
        <Field
          label="전화번호"
          value={phone}
          onChange={setPhone}
          placeholder="010-1234-5678"
        />
      </section>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex-1 bg-black text-white py-2 rounded-full text-sm font-semibold"
        >
          정보 저장
        </button>
        <button
          onClick={handleLogout}
          className="flex-1 border border-gray-400 text-gray-800 py-2 rounded-full text-sm font-semibold"
        >
          로그아웃
        </button>
      </div>
    </main>
  );
}

// ======================
// 공용 입력 필드 컴포넌트
// ======================
type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  readOnly?: boolean;
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  readOnly,
}: FieldProps) {
  return (
    <div className="mb-3">
      <label className="block text-xs mb-1">{label}</label>
      <input
        className="w-full border rounded px-3 py-2 text-sm"
        value={value}
        placeholder={placeholder}
        readOnly={readOnly}
        onChange={(e) => {
          if (readOnly) return;
          onChange(e.target.value);
        }}
      />
    </div>
  );
}
