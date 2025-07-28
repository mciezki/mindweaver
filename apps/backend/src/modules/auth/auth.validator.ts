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

// ______________________________________

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

// ______________________________________

export const validateRequestResetPassword = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { email } = req.body;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res
      .status(400)
      .json({ message: getMessage('auth.error.invalidEmailFormat') });
    return;
  }

  next();
};

// ______________________________________

export const validateResetPassword = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    res.status(400).json({ message: getMessage('auth.error.tokenRequired') });
    return;
  }

  if (newPassword.length < 8) {
    res
      .status(400)
      .json({ message: getMessage('auth.error.passwordTooShort') });
    return;
  }

  const hasDigit = /[0-9]/.test(newPassword);
  if (!hasDigit) {
    res.status(400).json({ message: getMessage('auth.error.passwordNoDigit') });
    return;
  }

  const hasUpper = /[A-Z]/.test(newPassword);
  if (!hasUpper) {
    res.status(400).json({ message: getMessage('auth.error.passwordNoUpper') });
    return;
  }
  const hasSpecialChar = /[^\s\w]/.test(newPassword);
  if (!hasSpecialChar) {
    res
      .status(400)
      .json({ message: getMessage('auth.error.passwordNoSpecialChar') });
    return;
  }

  next();
};

// ______________________________________

export const validateProfileUpdate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const profileName = req.body.profileName ?? undefined;
  const slug = req.body.slug ?? undefined;
  const description = req.body.description ?? undefined;
  const name = req.body.name ?? undefined;
  const surname = req.body.surname ?? undefined;
  const birthday = req.body.birthday ?? undefined;
  const sex = req.body.sex ?? undefined;
  const password = req.body.password ?? undefined;
  const type = req.body.type ?? undefined;
  const active = req.body.active ?? undefined;

  if (type !== undefined) {
    res
      .status(400)
      .json({ message: getMessage('auth.error.cannotUpdateType') });
    return;
  }
  if (active !== undefined) {
    res
      .status(400)
      .json({ message: getMessage('auth.error.cannotUpdateActiveStatus') });
    return;
  }
  if (password !== undefined) {
    if (password.length < 8) {
      res
        .status(400)
        .json({ message: getMessage('auth.error.passwordTooShort') });
      return;
    }
    const hasDigit = /[0-9]/.test(password);
    if (!hasDigit) {
      res
        .status(400)
        .json({ message: getMessage('auth.error.passwordNoDigit') });
      return;
    }
    const hasUpper = /[A-Z]/.test(password);
    if (!hasUpper) {
      res
        .status(400)
        .json({ message: getMessage('auth.error.passwordNoUpper') });
      return;
    }
    const hasSpecialChar = /[^\s\w]/.test(password);
    if (!hasSpecialChar) {
      res
        .status(400)
        .json({ message: getMessage('auth.error.passwordNoSpecialChar') });
      return;
    }
  }

  if (profileName !== undefined && typeof profileName !== 'string') {
    res
      .status(400)
      .json({ message: getMessage('profile.validation.profileName.invalid') });
    return;
  }
  if (profileName !== undefined && profileName.length > 100) {
    res
      .status(400)
      .json({ message: getMessage('profile.validation.profileName.max') });
    return;
  }

  if (slug !== undefined) {
    if (typeof slug !== 'string') {
      res
        .status(400)
        .json({ message: getMessage('profile.validation.slug.invalid') });
      return;
    }
    if (slug.length < 3 || slug.length > 50) {
      res
        .status(400)
        .json({ message: getMessage('profile.validation.slug.length') });
      return;
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      res
        .status(400)
        .json({ message: getMessage('profile.validation.slug.format') });
      return;
    }
  }

  if (description !== undefined && typeof description !== 'string') {
    res
      .status(400)
      .json({ message: getMessage('profile.validation.description.invalid') });
    return;
  }
  if (description !== undefined && description.length > 1000) {
    res
      .status(400)
      .json({ message: getMessage('profile.validation.description.max') });
    return;
  }

  if (name !== undefined && typeof name !== 'string') {
    res
      .status(400)
      .json({ message: getMessage('profile.validation.name.invalid') });
    return;
  }
  if (name !== undefined && (name.length < 2 || name.length > 50)) {
    res
      .status(400)
      .json({ message: getMessage('profile.validation.name.length') });
    return;
  }

  if (surname !== undefined && typeof surname !== 'string') {
    res
      .status(400)
      .json({ message: getMessage('profile.validation.surname.invalid') });
    return;
  }
  if (surname !== undefined && (surname.length < 2 || surname.length > 50)) {
    res
      .status(400)
      .json({ message: getMessage('profile.validation.surname.length') });
    return;
  }

  if (sex !== undefined && typeof sex !== 'string') {
    res
      .status(400)
      .json({ message: getMessage('profile.validation.sex.invalid') });
    return;
  }

  if (birthday !== undefined) {
    const date = new Date(birthday);
    if (isNaN(date.getTime())) {
      res
        .status(400)
        .json({ message: getMessage('profile.validation.birthday.invalid') });
      return;
    }
  }

  next();
};
