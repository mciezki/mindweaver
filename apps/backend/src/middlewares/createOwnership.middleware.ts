import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import { getMessage } from '../locales';
import prisma from '../database/prisma';


type PrismaModelName = Exclude<
    keyof PrismaClient,
    | '$connect'
    | '$disconnect'
    | '$executeRaw'
    | '$executeRawUnsafe'
    | '$on'
    | '$queryRaw'
    | '$queryRawUnsafe'
    | '$transaction'
    | '$use'
    | '$extends'
>;

export const createOwnershipMiddleware = (modelName: PrismaModelName) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const loggedUserId = req.user?.userId;
            if (!loggedUserId) {
                res.status(401).json({ message: getMessage('auth.error.unauthorized') });
                return
            }

            const { id: resourceId } = req.params;
            if (!resourceId) {
                res.status(400).json({ message: getMessage('error.badRequest') });
                return
            }

            const resource = await (prisma[modelName] as any).findUnique({
                where: {
                    id: resourceId,
                },
                select: {
                    userId: true,
                },
            });

            if (!resource) {
                res.status(404).json({ message: getMessage('error.notFound') });
                return
            }

            if (resource.userId !== loggedUserId) {
                res.status(403).json({ message: getMessage('auth.error.forbidden') });
                return
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};