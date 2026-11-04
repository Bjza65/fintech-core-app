"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtTokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtTokenService {
    secretKey;
    expiresIn;
    constructor() {
        this.secretKey = process.env.JWT_SECRET || 'default_secret';
        this.expiresIn = process.env.JWT_EXPIRES_IN || '1h';
    }
    generateToken(payload) {
        const options = {
            expiresIn: this.expiresIn,
            algorithm: 'HS256'
        };
        return jsonwebtoken_1.default.sign(payload, this.secretKey, options);
    }
    verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.secretKey);
            return {
                userId: decoded.userId,
                email: decoded.email,
            };
        }
        catch (error) {
            throw new Error('Token de autenticación inválido o expirado.');
        }
    }
}
exports.JwtTokenService = JwtTokenService;
