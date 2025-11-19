export type LocalUser = {
  name: string;
  email: string;
  password: string;
};

const KEY = "mrdaebak_users";

export function getAllUsers(): LocalUser[] {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveUser(user: LocalUser) {
  const users = getAllUsers();
  users.push(user);
  localStorage.setItem(KEY, JSON.stringify(users));
}

export function findUser(email: string, password: string) {
  const users = getAllUsers();
  return users.find(u => u.email === email && u.password === password) || null;
}
