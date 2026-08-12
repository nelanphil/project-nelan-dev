import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { NODE_ENV } from '../config/env';

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('Missing JWT_SECRET environment variable.');
}

const JWT_SECRET: Secret = jwtSecret;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || (NODE_ENV === 'production' ? '1d' : '7d');
const TOKEN_OPTIONS: SignOptions = {
  expiresIn: JWT_EXPIRES_IN as SignOptions['expiresIn'],
};

// Kept intentionally minimal — role/permissions are always read fresh from
// the database on every request (see middleware/auth.ts) so that revoking a
// permission or reassigning a role takes effect immediately, without
// requiring the user to log in again.
export interface JwtPayload {
  userId: string;
  email: string;
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export function comparePassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export function generateToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, TOKEN_OPTIONS);
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, JWT_SECRET);

  if (!decoded || typeof decoded === 'string') {
    throw new Error('Invalid token payload');
  }

  return decoded as JwtPayload;
}
