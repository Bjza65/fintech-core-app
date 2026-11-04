"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidCredentialsError = exports.UserAlreadyExistsError = void 0;
const DomainError_1 = require("./DomainError");
class UserAlreadyExistsError extends DomainError_1.DomainError {
    constructor(email) {
        super(`El usuario con el correo ${email} ya existe.`);
    }
}
exports.UserAlreadyExistsError = UserAlreadyExistsError;
class InvalidCredentialsError extends DomainError_1.DomainError {
    constructor(message = 'Credenciales inválidas.') {
        super(message);
    }
}
exports.InvalidCredentialsError = InvalidCredentialsError;
