// src/lib/storage/userStorage.ts

export type StoredUser = {
  name: string;
  email: string;
  password: string; // 비밀번호는 별도 화면에서만 변경한다고 가정
  address: string;
  phone: string;
};

const STORAGE_KEY = "mrdaebak_users";

// ----------------------
// Load & Save Helpers
// ----------------------
function loadUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed as StoredUser[];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

// ----------------------
// Public APIs
// ----------------------

// 회원가입
export function saveUser(user: StoredUser): void {
  const users = loadUsers();
  users.push(user);
  saveUsers(users);
}

// 로그인
export function findUser(email: string, password: string): StoredUser | undefined {
  const users = loadUsers();
  return users.find((u) => u.email === email && u.password === password);
}

// 계정 정보 수정 (정석 A 방식)
// updatedUser.email을 기준으로 업데이트
// src/lib/storage/userStorage.ts 의 updateUser
export function updateUser(updatedUser: StoredUser): StoredUser | undefined {
  const users = loadUsers();

  const idx = users.findIndex((u) => u.email === updatedUser.email);
  if (idx === -1) {
    return undefined;
  }

  const saved = users[idx];

  const merged: StoredUser = {
    ...saved,
    ...updatedUser,
    password: saved.password,
  };

  users[idx] = merged;
  saveUsers(users);
  return merged;
}
