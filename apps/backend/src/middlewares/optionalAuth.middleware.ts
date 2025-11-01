import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

export const optionalAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return next();
  }

  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET) as {
      userId: string;
      email: string;
    };
    req.user = decoded;

    next();
  } catch (error) {
    if (
      error instanceof jwt.TokenExpiredError ||
      error instanceof jwt.JsonWebTokenError
    ) {
      return next();
    }

    next(error);
  }
};
