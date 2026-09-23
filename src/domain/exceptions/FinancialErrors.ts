import { DomainError } from "./DomainError";

export class InsufficientBalanceError extends DomainError {
    constructor(accountId: string){
        super(`Operacion denegada: Saldo insuficiente en la cuenta con ID: ${accountId}`);
    }
}

export class AccountFrozenError extends DomainError {
    constructor(accountId: string){
        super(`Alerta de seguridad: La cuenta [${accountId}] se encuentra congelada.`);
    }
}

export class InvalidAmountError extends DomainError{
    constructor(message: string){
        super(`Validacion monetaria fallida: ${message}`);
    }
}