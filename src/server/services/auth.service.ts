import { db } from '../../db/index.js';
import { users } from '../../db/schema/index.js';
import { signToken, verifyRefreshToken, signRefreshToken } from '../utils/jwt.utils.js';
import { verifyPassword } from '../utils/hash.utils.js';
import { eq } from 'drizzle-orm';
import { AppError } from '../middleware/error.middleware.js';

export const login = async (email: string, password: string) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) throw new AppError('Invalid credentials', 401);
  if (!user.passwordHash) throw new AppError('Account has no password set', 401);
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) throw new AppError('Invalid credentials', 401);
  const token = signToken({ id: user.id, email: user.email, role: user.role });
  const refreshToken = signRefreshToken({ id: user.id, email: user.email, role: user.role });
  const { passwordHash, ...safe } = user;
  return { user: safe, token, refreshToken };
};

export const getProfile = async (userId: string) => {
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) throw new AppError('User not found', 404);
  const { passwordHash, ...safe } = user;
  return safe;
};

export const refresh = (refreshToken: string) => {
  const decoded = verifyRefreshToken(refreshToken);
  return { token: signToken({ id: decoded.id, email: decoded.email, role: decoded.role }) };
};
