import api from './axios';
import { BadResponse, CallApiError, CallApiResponse, GoodResponse } from './type';

type CallApiHandlerType = [
  method: 'GET' | 'POST' | 'PATCH' | 'PUT',
  url: string,
  payload?: Payload,
];

type Payload = {
  body?: Record<string, unknown>;
  params?: Record<string, string | number>;
};

/**
 * rough call api used for action need to catch error
 */
export async function callApi<T = unknown>(
  method: 'GET' | 'POST' | 'PATCH' | 'PUT',
  url: string,
  payload: Payload = {},
): Promise<CallApiResponse<T>> {
  try {
    const response = await api.request<T, CallApiResponse<T>>({
      method,
      url,
      data: payload.body,
      params: payload.params,
    });
    return new GoodResponse(response);
  } catch (err) {
    throw new BadResponse(err as CallApiError);
  }
}

/**
 * this prevent error to wonderful response
 */
export async function callApiHandler<T = unknown>(...props: CallApiHandlerType) {
  try {
    const res = await callApi<T>(...props);
    return res;
  } catch (err) {
    return err as CallApiError;
  }
}
