import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

class AuthService {
  generateToken(userId: string): string {
    return jwt.sign(
      { userId, iat: Date.now() },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
  }

  verifyToken(token: string): { userId: string } | null {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    } catch {
      return null;
    }
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
