"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountNotFoundError = exports.InvalidAmountError = exports.AccountFrozenError = exports.InsufficientBalanceError = void 0;
const DomainError_1 = require("./DomainError");
class InsufficientBalanceError extends DomainError_1.DomainError {
    constructor(accountId) {
        super(`Operacion denegada: Saldo insuficiente en la cuenta con ID: ${accountId}`);
    }
}
exports.InsufficientBalanceError = InsufficientBalanceError;
class AccountFrozenError extends DomainError_1.DomainError {
    constructor(accountId) {
        super(`Alerta de seguridad: La cuenta [${accountId}] se encuentra congelada.`);
    }
}
exports.AccountFrozenError = AccountFrozenError;
class InvalidAmountError extends DomainError_1.DomainError {
    constructor(message) {
        super(`Validacion monetaria fallida: ${message}`);
    }
}
exports.InvalidAmountError = InvalidAmountError;
class AccountNotFoundError extends DomainError_1.DomainError {
    constructor(accountId) {
        super(`La cuenta con ID '${accountId}' no fue encontrada o no existe.`);
    }
}
exports.AccountNotFoundError = AccountNotFoundError;
