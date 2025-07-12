import { v4 as uuidv4 } from 'uuid'

export const generateRefreshToken = (expiresInDays: number): { refreshToken: string, refreshTokenExpiresAt: Date } => {
    const refreshToken = uuidv4();
    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + expiresInDays);

    return { refreshToken, refreshTokenExpiresAt }
}