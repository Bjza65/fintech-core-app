"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const client_1 = require("../../generated/prisma/client");
const DomainError_1 = require("../../domain/exceptions/DomainError");
const FinancialErrors_1 = require("../../domain/exceptions/FinancialErrors");
const UserError_1 = require("../../domain/exceptions/UserError");
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof FinancialErrors_1.InsufficientBalanceError) {
        res.status(400).json({ status: 'fail', code: 'INSUFFICIENT_FUNDS', message: err.message });
        return;
    }
    if (err instanceof UserError_1.UserAlreadyExistsError) {
        res.status(409).json({ status: 'fail', code: 'USER_ALREADY_EXISTS', message: err.message });
        return;
    }
    if (err instanceof UserError_1.InvalidCredentialsError) {
        res.status(401).json({ status: 'fail', code: 'INVALID_CREDENTIALS', message: err.message });
        return;
    }
    if (err instanceof FinancialErrors_1.AccountNotFoundError) {
        res.status(404).json({ status: 'fail', code: 'ACCOUNT_NOT_FOUND', message: err.message });
        return;
    }
    if (err instanceof DomainError_1.DomainError) {
        res.status(400).json({ status: 'fail', code: 'DOMAIN_VALIDATION_ERROR', message: err.message });
        return;
    }
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            res.status(409).json({
                status: 'fail',
                code: 'DUPLICATE_FIELD',
                message: 'Existe un conflicto con un dato único ya registrado en el sistema.',
            });
            return;
        }
        if (err.code === 'P2025') {
            res.status(404).json({
                status: 'fail',
                code: 'RESOURCE_NOT_FOUND',
                message: 'El recurso solicitado no fue encontrado en la base de datos.',
            });
            return;
        }
    }
    console.error('[UNHANDLED CRITICAL ERROR]:', err);
    res.status(500).json({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Ocurrió un error interno e inesperado en el servidor. Por favor intente más tarde.',
    });
};
exports.errorHandler = errorHandler;
