/**
 * Clase abstracta que representa un error de dominio.
 */
export abstract class DomainError extends Error {
    constructor(message: string){
        super(message);
        this.name = (this.constructor.name);
        Error.captureStackTrace(this, this.constructor)
    }
}

/**
 * Clase que se usará para la validacion de campos de las entidades, cuandoe l valor de un campo no sea valido.
 */

export class InvalidPropValueError extends DomainError {}