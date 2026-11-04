"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferMoneyUseCase = void 0;
const decimal_js_1 = __importDefault(require("decimal.js"));
const DomainError_1 = require("../domain/exceptions/DomainError");
const FinancialErrors_1 = require("../domain/exceptions/FinancialErrors");
const Transactions_1 = require("../domain/entities/Transactions");
class TransferMoneyUseCase {
    accountRepository;
    constructor(accountRepository) {
        this.accountRepository = accountRepository;
    }
    async execute(input, userId) {
        const { sourceAccountId, destinationAccountId, amount } = input;
        if (amount <= 0) {
            throw new FinancialErrors_1.InvalidAmountError("El monto de la transferencia debe ser estrictamente mayor a cero.");
        }
        if (sourceAccountId === destinationAccountId) {
            throw new DomainError_1.InvalidPropValueError("La cuenta de origen y destino no pueden ser idénticas.");
        }
        const transferAmount = new decimal_js_1.default(amount);
        const sourceAccount = await this.accountRepository.findById(sourceAccountId);
        if (!sourceAccount || sourceAccount.userid !== userId) {
            throw new FinancialErrors_1.AccountNotFoundError(sourceAccountId);
        }
        if (sourceAccount.accountStatus === "FROZEN") {
            throw new FinancialErrors_1.AccountFrozenError(sourceAccountId);
        }
        if (sourceAccount.balanceAcc.lessThan(transferAmount)) {
            throw new FinancialErrors_1.InsufficientBalanceError("La cuenta de origen no tiene saldo suficiente para realizar la transferencia.");
        }
        const destinationAccount = await this.accountRepository.findById(destinationAccountId);
        if (!destinationAccount) {
            throw new FinancialErrors_1.AccountNotFoundError(destinationAccountId);
        }
        sourceAccount.withdraw(transferAmount);
        destinationAccount.deposit(transferAmount);
        const transactionEntity = Transactions_1.Transfer.create({
            amount: transferAmount,
            status: "PENDING",
            sourceAccountId,
            destinationAccountId,
            createdAt: new Date(),
            description: `Transferencia de ${transferAmount.toNumber()} desde la cuenta ${sourceAccountId} a la cuenta ${destinationAccountId}.`
        });
        const savedTransaction = await this.accountRepository.executeTransaction(transactionEntity);
        return {
            transactionId: savedTransaction.id,
            sourceAccountId,
            destinationAccountId,
            amount: savedTransaction.amount.toNumber(),
            executedAt: savedTransaction.createdAt
        };
    }
}
exports.TransferMoneyUseCase = TransferMoneyUseCase;
