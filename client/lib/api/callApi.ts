import api from "./axios";

type CallApiHandlerType = [
  method: "GET" | "POST" | "PATCH" | "PUT",
  url: string,
  payload?: Payload
];

type Payload = {
  body?: Record<string, unknown>;
  params?: Record<string, string | number>;
};

type CallApiResponse<T> = {
  data: T;
  message: string;
  method: string;
  path: string;
  statusCode: number;
  success: true;
  timestamp: string;
};

export type CallApiError = {
  errors: null | unknown;
  message: string;
  method: string;
  path: string;
  statusCode: number;
  success: false;
  timestamp: string;
};

export async function callApi<T = unknown>(
  method: "GET" | "POST" | "PATCH" | "PUT",
  url: string,
  payload: Payload = {}
): Promise<CallApiResponse<T>> {
  try {
    const response = await api.request<T, CallApiResponse<T>>({
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

export async function callApiHandler<T = unknown>(
  ...props: CallApiHandlerType
) {
  try {
    const res = await callApi<T>(...props);
    return res;
  } catch (err) {
    return err as CallApiError;
  }
}
