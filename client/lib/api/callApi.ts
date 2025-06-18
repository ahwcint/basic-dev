import { AxiosResponse } from "axios";
import api from "./axios";

type Payload = {
  body?: Record<string, unknown>;
  params?: Record<string, string | number>;
};

export async function callApi<T = unknown>(
  method: "GET" | "POST" | "PATCH" | "PUT",
  url: string,
  payload: Payload = {}
): Promise<AxiosResponse<T>> {
  try {
    const response = await api.request<T>({
      method,
      url,
      data: payload.body,
      params: payload.params,
    });

    return response;
  } catch (err) {
    throw err;
  }
}
