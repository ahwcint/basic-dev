import { callApi } from "@/lib/api/callApi";
import { User, UserRole } from "@/services/types/user.type";

export const loginService = async (payload: {
  username: string;
  password: string;
}) => {
  return await callApi<User>("POST", "/auth/login", { body: payload });
};

export const registerService = async (payload: {
  username: string;
  password: string;
}) => {
  return await callApi<User>("POST", "/auth/register", { body: payload });
};

export const logoutService = async () => {
  return await callApi("GET", "/auth/logout");
};

export const changeRoleUser = async (userId: string, role: UserRole) => {
  return await callApi<User>("PATCH", "/user/change-role", {
    body: { role, userId },
  });
};

export const listUserService = async () => {
  return await callApi<User>("GET", "/user");
};

export const refreshTokenService = async () => {
  return await callApi("GET", "/auth/refresh-token");
};
