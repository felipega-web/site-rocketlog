import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { AuthConfig } from '@/configs/auth';
import { AppError } from '@/utils/AppError';

interface TokenPayload {
    role: string;
    sub: string;
}

function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
)  {
    try {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            throw new AppError('JWT token is missing', 401);
        }

        const [, token] = authHeader.split(' ');
        const { role, sub: user_id } = verify(
            token,
            AuthConfig.jwt.secret) as TokenPayload;
        
        request.user = { id: user_id, role };
        
        return next();
        
    } catch (error) {
        throw new AppError('JWT token is missing or invalid', 401);
    }
}

export { ensureAuthenticated };