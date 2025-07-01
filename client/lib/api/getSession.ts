"use server";

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { TokenData } from "./type";
import { User } from "@/services/types/user.type";

export async function getSession() {
  const awaitedCookies = await cookies();
  const refreshToken = awaitedCookies.get("refresh_token")?.value || "";
  const token = awaitedCookies.get("token")?.value || "";
  let isRefreshTokenExpired = false;
  let isTokenExpired = false;
  if (!refreshToken) return {};

  let refreshTokenData: TokenData = {} as TokenData;
  let tokenData: TokenData = {} as TokenData;
  let user: User | null = null;

  try {
    refreshTokenData = jwtDecode(refreshToken);
    isRefreshTokenExpired =
      !refreshToken || verifyExpiration(refreshTokenData.exp);
  } catch {
    user = null;
    isTokenExpired = true;
    isRefreshTokenExpired = true;
  }
  try {
    tokenData = jwtDecode(token);
    user = tokenData.user;
    isTokenExpired = !token || verifyExpiration(tokenData.exp);
  } catch {
    isTokenExpired = true;
  }

  return {
    user,
    isRefreshTokenExpired,
    isTokenExpired,
  };
}

function verifyExpiration(expiredAt: number | undefined) {
  if (!expiredAt) return false;

  const now = Math.floor(Date.now() / 1000);
  const isExpired = (expiredAt as number) < now;
  return isExpired;
}
