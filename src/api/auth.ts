import type { LoginRequest, LoginResponse } from "../features/auth/types";
import { ensureSeedUsers, findUserByEmail, toPublicUser } from "../features/auth/storage";

function makeToken() {
  return `T_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export const authApi = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    ensureSeedUsers();

    const email = data.email.trim().toLowerCase();
    const password = data.password;

    const rec = findUserByEmail(email);
    if (!rec || rec.password !== password) {
      throw { response: { data: { message: "Неверный логин или пароль" } } };
    }

    return { user: toPublicUser(rec), token: makeToken() };
  },

  async logout(): Promise<void> {
    return;
  },
};
