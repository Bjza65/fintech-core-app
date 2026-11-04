"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
class AuthMiddleware {
    tokenService;
    constructor(tokenService) {
        this.tokenService = tokenService;
    }
    handle = (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                status: 'fail',
                code: 'UNAUTHORIZED',
                message: 'Acceso denegado. Se requiere un Bearer Token válido en la cabecera Authorization.',
            });
            return;
        }
        const token = authHeader.split(' ')[1];
        try {
            const payload = this.tokenService.verifyToken(token);
            req.user = payload;
            next();
        }
        catch (error) {
            res.status(401).json({
                status: 'fail',
                code: 'INVALID_TOKEN',
                message: 'El token de autenticación provisto es inválido o ha expirado.',
            });
            return;
        }
    };
}
exports.AuthMiddleware = AuthMiddleware;
