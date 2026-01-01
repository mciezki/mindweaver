import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

interface TokenPayload {
  userId: string;
  email: string;
}

export const socketAuthMiddleware = (
  socket: Socket,
  next: (err?: ExtendedError) => void,
) => {
  try {
    const rawCookies = socket.handshake.headers.cookie;

    if (!rawCookies) {
      return next(new Error('Authentication error: No cookies found'));
    }

    const parsedCookies = cookie.parse(rawCookies);
    const accessToken = parsedCookies.accessToken;

    if (!accessToken) {
      return next(new Error('Authentication error: Access token missing'));
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const decoded = jwt.verify(accessToken, secret) as TokenPayload;

    socket.data.user = decoded;

    next();
  } catch (error) {
    console.error('Socket authentication failed: ', error);
    next(new Error('Authentication error: Invalid token'));
  }
};
