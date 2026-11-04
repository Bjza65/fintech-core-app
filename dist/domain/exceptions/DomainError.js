"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidPropValueError = exports.DomainError = void 0;
/**
 * Clase abstracta que representa un error de dominio.
 */
class DomainError extends Error {
    constructor(message) {
        super(message);
        this.name = (this.constructor.name);
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.DomainError = DomainError;
/**
 * Clase que se usará para la validacion de campos de las entidades, cuandoe l valor de un campo no sea valido.
 */
class InvalidPropValueError extends DomainError {
}
exports.InvalidPropValueError = InvalidPropValueError;
