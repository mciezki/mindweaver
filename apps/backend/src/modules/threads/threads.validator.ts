import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../locales';

export const validateCreateThread = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { content } = req.body;

  if (!content || content.trim().length < 1) {
    res
      .status(400)
      .json({ message: getMessage('threads.validation.content.required') });
    return;
  }

  if (content.length > 1000) {
    res
      .status(400)
      .json({ message: getMessage('threads.validation.content.max') });
    return;
  }

  next();
};

export const validateUpdateThread = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { content } = req.body;

  if (content !== undefined) {
    if (content.trim().length < 1) {
      res
        .status(400)
        .json({ message: getMessage('threads.validation.content.required') });
      return;
    }

    if (content.length > 1000) {
      res
        .status(400)
        .json({ message: getMessage('threads.validation.content.max') });
      return;
    }
  }

  next();
};
