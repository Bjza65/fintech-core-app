"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalUseCase = void 0;
const FinancialErrors_1 = require("../domain/exceptions/FinancialErrors");
const decimal_js_1 = require("decimal.js");
const Transactions_1 = require("../domain/entities/Transactions");
class WithdrawalUseCase {
    accountRepository;
    constructor(accountRepository) {
        this.accountRepository = accountRepository;
    }
    async execute(input, userId) {
        const { accountId, amount } = input;
        if (amount <= 0) {
            throw new FinancialErrors_1.InvalidAmountError("El monto a retirar debe ser positivo.");
        }
        const account = await this.accountRepository.findById(accountId);
        if (!account || account.userid !== userId) {
            throw new FinancialErrors_1.AccountNotFoundError(accountId);
        }
        if (account.accountStatus === "FROZEN") {
            throw new FinancialErrors_1.AccountFrozenError(accountId);
        }
        const withdrawalAmount = new decimal_js_1.Decimal(amount);
        if (account.balanceAcc.lessThan(withdrawalAmount)) {
            throw new FinancialErrors_1.InsufficientBalanceError(accountId);
        }
        const withdrawalTransaction = Transactions_1.Withdrawal.create({
            amount: withdrawalAmount,
            status: "PENDING",
            description: `Retiro de cuenta ${account.accountNumber}`,
            createdAt: new Date(),
            sourceAccountId: accountId
        });
        const savedTransaction = await this.accountRepository.executeTransaction(withdrawalTransaction);
        const updatedAccount = await this.accountRepository.findById(accountId);
        if (!updatedAccount) {
            throw new FinancialErrors_1.AccountNotFoundError(accountId);
        }
        if (!updatedAccount.id) {
            throw new Error("La cuenta no tiene un identificador válido");
        }
        return {
            accountId: updatedAccount.id,
            newBalance: updatedAccount.balanceAcc.toNumber(),
            withdrawnAt: savedTransaction.createdAt
        };
    }
}
exports.WithdrawalUseCase = WithdrawalUseCase;
