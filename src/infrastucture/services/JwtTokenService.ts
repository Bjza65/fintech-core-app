import jwt from 'jsonwebtoken';
import { TokenService, TokenPayload } from '../../domain/Services/TokenService';

export class JwtTokenService implements TokenService {
  private readonly secretKey: string;
  private readonly expiresIn: string;

  constructor() {
    this.secretKey = process.env.JWT_SECRET || 'default_secret';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '1h';
  }

  generateToken(payload: TokenPayload): string {
    const options: jwt.SignOptions = {
      expiresIn: this.expiresIn as jwt.SignOptions['expiresIn'],
      algorithm: 'HS256'
    };

    return jwt.sign(payload, this.secretKey, options);
  }

  verifyToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.secretKey) as jwt.JwtPayload & TokenPayload;
      return {
        userId: decoded.userId,
        email: decoded.email,
      };
    } catch (error) {
      throw new Error('Token de autenticación inválido o expirado.');
    }
  }
}