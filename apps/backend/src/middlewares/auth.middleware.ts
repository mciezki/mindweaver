import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { getMessage } from '../locales';

const JWT_SECRET = process.env.JWT_SECRET || '';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    res.status(401).json({ message: getMessage('auth.error.noToken') });
    return;
  }

  try {
    const decoded = jwt.verify(accessToken, JWT_SECRET) as {
      userId: string;
      email: string;
    };
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: getMessage('auth.error.tokenExpired') });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: getMessage('auth.error.invalidToken') });
      return;
    }
    next(error);
  }
};
