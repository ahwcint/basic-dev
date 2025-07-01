import { User } from "@/services/types/user.type";

export type TokenData = {
  user: User;
  sub: string;
  exp: number;
  iat: number;
};

export type CallApiResponse<T> = {
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

export class GoodResponse<T> {
  data!: T;
  message!: string;
  method!: string;
  path!: string;
  statusCode!: number;
  success!: true;
  timestamp!: string;

  constructor(prop: CallApiResponse<T>) {
    Object.assign(this, prop);
  }
}

export class BadResponse {
  errors!: null | unknown;
  message!: string;
  method!: string;
  path!: string;
  statusCode!: number;
  success!: false;
  timestamp!: string;
  constructor(prop: CallApiError) {
    Object.assign(this, prop);
  }
}
