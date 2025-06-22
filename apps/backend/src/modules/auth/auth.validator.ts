import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../locales';

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { email, password, name, surname, sex, birthday } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: getMessage('auth.error.emailRequired') });
    return;
  }

  if (!name || !surname || !sex || !birthday) {
    res.status(400).json({ message: getMessage('auth.error.dataRequired') });
    return;
  }

  if (password.length < 8) {
    res
      .status(400)
      .json({ message: getMessage('auth.error.passwordTooShort') });
    return;
  }

  const hasDigit = /[0-9]/.test(password);
  if (!hasDigit) {
    res.status(400).json({ message: getMessage('auth.error.passwordNoDigit') });
    return;
  }

  const hasUpper = /[A-Z]/.test(password);
  if (!hasUpper) {
    res.status(400).json({ message: getMessage('auth.error.passwordNoUpper') });
    return;
  }
  const hasSpecialChar = /[^\s\w]/.test(password);
  if (!hasSpecialChar) {
    res
      .status(400)
      .json({ message: getMessage('auth.error.passwordNoSpecialChar') });
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res
      .status(400)
      .json({ message: getMessage('auth.error.invalidEmailFormat') });
    return;
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: getMessage('auth.error.emailRequired') });
    return;
  }

  next();
};
