import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../locales';

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: getMessage('auth.emailRequired') });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: getMessage('auth.error.passwordTooShort') });
  }

  const hasDigit = /[0-9]/.test(password);
  if (!hasDigit) {
    return res
      .status(400)
      .json({ message: getMessage('auth.error.passwordNoDigit') });
  }

  const hasUpper = /[A-Z]/.test(password);
  if (!hasUpper) {
    return res
      .status(400)
      .json({ message: getMessage('auth.error.passwordNoUpper') });
  }
  const hasSpecialChar = /[^\s\w]/.test(password);
  if (!hasSpecialChar) {
    return res
      .status(400)
      .json({ message: getMessage('auth.error.passwordNoSpecialChar') });
  }

  // Walidacja formatu emaila
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res
      .status(400)
      .json({ message: getMessage('auth.error.invalidEmailFormat') });
  }

  next();
};
