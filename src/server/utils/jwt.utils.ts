import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'cyber-revenue-dev-secret-key-2024';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const REFRESH_SECRET = SECRET + '-refresh';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

export const signToken = (payload: object, expiresIn = EXPIRES_IN): string =>
  jwt.sign(payload, SECRET, { expiresIn } as jwt.SignOptions);

export const verifyToken = (token: string): jwt.JwtPayload & { id: string; email: string; role: string } =>
  jwt.verify(token, SECRET) as any;

export const signRefreshToken = (payload: object): string =>
  jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN } as jwt.SignOptions);

export const verifyRefreshToken = (token: string): jwt.JwtPayload & { id: string; email: string; role: string } =>
  jwt.verify(token, REFRESH_SECRET) as any;
