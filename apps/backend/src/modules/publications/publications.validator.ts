import { NextFunction, Request, Response } from 'express';

import { getMessage } from '../../locales';
import { ArticleRate } from '@mindweave/types';

export const validateCreateCategory = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { name, description, slug } = req.body;

  if (!description || description.trim().length === 0) {
    res.status(400).json({
      message: getMessage('publications.categories.validation.required'),
    });
    return;
  }

  if (description !== undefined && description.length > 1000) {
    res
      .status(400)
      .json({ message: getMessage('publications.categories.validation.max') });
    return;
  }

  if (!name || name.trim().length === 0) {
    res.status(400).json({
      message: getMessage('publications.categories.validation.required'),
    });
    return;
  }

  if (name !== undefined && name.length > 50) {
    res.status(400).json({
      message: getMessage('publications.categories.validation.title'),
    });
    return;
  }

  if (slug !== undefined) {
    if (slug.length > 50) {
      res.status(400).json({
        message: getMessage('publications.categories.validation.title'),
      });
      return;
    }

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug)) {
      res.status(400).json({
        message: getMessage('publications.categories.validation.format'),
      });
      return;
    }
  }

  next();
};

export const validateUpdateCategory = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { name, description, slug } = req.body;

  if (description !== undefined) {
    if (description.trim().length === 0) {
      res.status(400).json({
        message: getMessage('publications.categories.validation.required'),
      });
      return;
    }

    if (description.length > 1000) {
      res.status(400).json({
        message: getMessage('publications.categories.validation.max'),
      });
      return;
    }
  }

  if (name !== undefined) {
    if (name.length < 1) {
      res.status(400).json({
        message: getMessage('publications.categories.validation.required'),
      });
      return;
    }

    if (name.length > 50) {
      res.status(400).json({
        message: getMessage('publications.categories.validation.title'),
      });
      return;
    }
  }

  if (slug !== undefined) {
    if (slug.length > 50) {
      res.status(400).json({
        message: getMessage('publications.categories.validation.title'),
      });
      return;
    }

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (slug.trim().length > 0 && !slugRegex.test(slug)) {
      res.status(400).json({
        message: getMessage('publications.categories.validation.format'),
      });
      return;
    }
  }

  next();
};

export const validateCreateArticle = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { title, contentHtml, slug, categoryId } = req.body;

  if (!categoryId || typeof categoryId !== 'string') {
    res.status(400).json({
      message: getMessage('publications.articles.validation.required'),
    });
    return;
  }

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    res.status(400).json({
      message: getMessage('publications.articles.validation.required'),
    });
    return;
  }
  if (title.length > 150) {
    res
      .status(400)
      .json({ message: getMessage('publications.articles.validation.title') });
    return;
  }

  if (
    !contentHtml ||
    typeof contentHtml !== 'string' ||
    contentHtml.trim().length === 0
  ) {
    res.status(400).json({
      message: getMessage('publications.articles.validation.required'),
    });
    return;
  }

  if (slug !== undefined) {
    if (slug.length > 50) {
      res
        .status(400)
        .json({ message: getMessage('publications.articles.validation.max') });
      return;
    }
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (slug.trim().length > 0 && !slugRegex.test(slug)) {
      res.status(400).json({
        message: getMessage('publications.articles.validation.format'),
      });
      return;
    }
  }

  next();
};

export const validateChangeArticleStatus = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { status } = req.body;

  if (status !== 'DRAFT' && status !== 'PUBLISHED') {
    res.status(400).json({
      message: getMessage('publications.articles.validation.status'),
    });
    return;
  }

  next();
};

export const validateUpdateArticle = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { title, contentHtml, slug, categoryId } = req.body;

  if (categoryId !== undefined) {
    if (!categoryId || typeof categoryId !== 'string') {
      res.status(400).json({
        message: getMessage('publications.articles.validation.required'),
      });
      return;
    }
  }

  if (title !== undefined) {
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      res.status(400).json({
        message: getMessage('publications.articles.validation.required'),
      });
      return;
    }
    if (title.length > 150) {
      res.status(400).json({
        message: getMessage('publications.articles.validation.title'),
      });
      return;
    }
  }

  if (contentHtml !== undefined) {
    if (
      !contentHtml ||
      typeof contentHtml !== 'string' ||
      contentHtml.trim().length === 0
    ) {
      res.status(400).json({
        message: getMessage('publications.articles.validation.required'),
      });
      return;
    }
  }

  if (slug !== undefined) {
    if (slug.length > 50) {
      res
        .status(400)
        .json({ message: getMessage('publications.articles.validation.max') });
      return;
    }
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (slug.trim().length > 0 && !slugRegex.test(slug)) {
      res.status(400).json({
        message: getMessage('publications.articles.validation.format'),
      });
      return;
    }
  }

  next();
};

export const validateRateArticle = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { rate } = req.body;

  if (!rate || typeof rate !== 'string') {
    res.status(400).json();
    return;
  }

  const assertedRate = rate.toUpperCase() as ArticleRate;

  if (assertedRate !== 'LIKE' && assertedRate !== 'DISLIKE') {
    res.status(400).json();
    return;
  }

  next();
};