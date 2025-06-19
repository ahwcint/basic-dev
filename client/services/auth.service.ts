import { callApiHandler } from "@/lib/api/callApi";
import { User, UserRole } from "@/lib/api/type";

export const loginService = async (username: string) => {
  return await callApiHandler("POST", "/auth/login", { body: { username } });
};

export const logoutService = async () => {
  return await callApiHandler("GET", "/auth/logout");
};

export const createUserService = async (username: string) => {
  return await callApiHandler("POST", "/user", {
    body: { username },
  });
};

export const changeRoleUser = async (userId: string, role: UserRole) => {
  return await callApiHandler<User>("PATCH", "/user/change-role", {
    body: { role, userId },
  });
};

export const listUserService = async () => {
  return await callApiHandler("GET", "/user");
};

export const refreshTokenService = async () => {
  return await callApiHandler("GET", "/auth/refresh-token");
};
