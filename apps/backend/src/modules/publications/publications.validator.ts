import { NextFunction, Request, Response } from "express";
import { getMessage } from "../../locales";

export const validateCreateCategory = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const { name, description, slug } = req.body

    if (!description || description.trim().length === 0) {
        res.status(400).json({ message: getMessage('publications.categories.validation.required') })
        return
    }

    if (description !== undefined && description.length > 1000) {
        res
            .status(400)
            .json({ message: getMessage('publications.categories.validation.max') });
        return;
    }

    if (!name || name.trim().length === 0) {
        res.status(400).json({ message: getMessage('publications.categories.validation.required') })
        return
    }

    if (name !== undefined && name.length > 50) {
        res
            .status(400)
            .json({ message: getMessage('publications.categories.validation.title') });
        return;
    }

    if (slug !== undefined) {

        if (slug.length > 50) {
            res
                .status(400)
                .json({ message: getMessage('publications.categories.validation.title') });
            return;
        }

        const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        if (!slugRegex.test(slug)) {
            res.status(400).json({ message: getMessage('publications.categories.validation.format') });
            return;
        }
    }

    next();
}

export const validateUpdateCategory = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const { name, description, slug } = req.body

    if (description !== undefined) {

        if (description.trim().length === 0) {
            res.status(400).json({ message: getMessage('publications.categories.validation.required') })
            return
        }

        if (description.length > 1000) {
            res
                .status(400)
                .json({ message: getMessage('publications.categories.validation.max') });
            return;
        }
    }

    if (name !== undefined) {

        if (name.length < 1) {
            res.status(400).json({ message: getMessage('publications.categories.validation.required') })
            return
        }

        if (name.length > 50) {
            res
                .status(400)
                .json({ message: getMessage('publications.categories.validation.title') });
            return;
        }
    }

    if (slug !== undefined) {
        if (slug.length > 50) {
            res
                .status(400)
                .json({ message: getMessage('publications.categories.validation.title') });
            return;
        }

        const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        if (slug.trim().length > 0 && !slugRegex.test(slug)) {
            res.status(400).json({ message: getMessage('publications.categories.validation.format') });
            return;
        }
    }

    next();
}