import { callApi, CallApiError, callApiHandler } from "@/lib/api/callApi";

export const loginService = async (username: string) => {
  try {
    const res = await callApi("POST", "/auth/login", { body: { username } });
    return res;
  } catch (err) {
    return err as CallApiError;
  }
};

export const logoutService = async () => {
  return await callApiHandler("GET", "/auth/logout");
};

export const createUserService = async (username: string) => {
  try {
    const res = await callApi("POST", "/user", {
      body: { username, redirect: true },
    });
    return res;
  } catch (err) {
    return err as CallApiError;
  }
};

export const listUserService = async () => {
  try {
    const res = await callApi("GET", "/user");
    return res;
  } catch (err) {
    return err;
  }
};
