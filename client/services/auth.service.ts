import { callApi } from "@/lib/api/callApi";

export const loginService = async (username: string) => {
  try {
    const res = await callApi("POST", "/auth/login", { body: { username } });
    return res;
  } catch (err) {
    return err;
  }
};

export const createUserService = async (username: string) => {
  try {
    const res = await callApi("POST", "/user", { body: { username } });
    return res;
  } catch (err) {
    return err;
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
