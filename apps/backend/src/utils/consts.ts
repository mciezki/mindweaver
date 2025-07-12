import { CookieOptions } from "express";

export const JWT_EXPIRES_IN = '15m';
export const JWT_REFRESH_EXPIRES_IN = 7

export const COOKIES_BASIC_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
}