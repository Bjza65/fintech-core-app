"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
const DomainError_1 = require("../exceptions/DomainError");
const FinancialErrors_1 = require("../exceptions/FinancialErrors");
class Account {
    props;
    constructor(props) {
        this.props = props;
    }
    static create(props) {
        if (props.balanceAcc.isNegative()) {
            throw new DomainError_1.InvalidPropValueError(`Una cuenta no puede ser inicializada con saldo negativo`);
        }
        if (props.createdAt === undefined) {
            props.createdAt = new Date();
        }
        return new Account(props);
    }
    get id() { return this.props.id; }
    get accountNumber() { return this.props.accountNumber; }
    get balanceAcc() { return this.props.balanceAcc; }
    get accountStatus() { return this.props.accountStatus; }
    get createdAt() { return this.props.createdAt; }
    get userid() { return this.props.userId; }
    //Comportamiento de clase
    deposit(amount) {
        if (amount.lte(0)) {
            throw new FinancialErrors_1.InvalidAmountError(`El monto del depósito debe ser estrictamente mayor a cero.`);
        }
        this.props.balanceAcc = this.props.balanceAcc.plus(amount);
    }
    withdraw(amount) {
        if (amount.lte(0)) {
            throw new FinancialErrors_1.InvalidAmountError(`El monto del retiro debe ser estrictamente mayor a cero.`);
        }
        if (this.props.balanceAcc.lessThan(amount)) {
            throw new FinancialErrors_1.InsufficientBalanceError(this.id);
        }
        if (this.props.accountStatus === "FROZEN") {
            throw new FinancialErrors_1.AccountFrozenError(this.id);
        }
        this.props.balanceAcc = this.props.balanceAcc.minus(amount);
    }
    freeze() {
        if (this.props.accountStatus === "FROZEN") {
            throw new DomainError_1.InvalidPropValueError("La cuenta ya se encuentra congelada.");
        }
        this.props.accountStatus = "FROZEN";
    }
    unfreeze() {
        if (this.props.accountStatus === "ACTIVE") {
            throw new DomainError_1.InvalidPropValueError("La cuenta ya se encuentra activa.");
        }
        this.props.accountStatus = "ACTIVE";
    }
}
exports.Account = Account;
