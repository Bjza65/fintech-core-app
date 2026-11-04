"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepositUseCase = void 0;
const FinancialErrors_1 = require("../domain/exceptions/FinancialErrors");
const decimal_js_1 = require("decimal.js");
const Transactions_1 = require("../domain/entities/Transactions");
class DepositUseCase {
    accountRepository;
    constructor(accountRepository) {
        this.accountRepository = accountRepository;
    }
    async execute(input, userId) {
        const { accountId, amount } = input;
        if (amount <= 0) {
            throw new FinancialErrors_1.InvalidAmountError("El monto a depositar debe ser positivo.");
        }
        const account = await this.accountRepository.findById(accountId);
        if (!account || account.userid !== userId) {
            throw new FinancialErrors_1.AccountNotFoundError(accountId);
        }
        if (account.accountStatus === "FROZEN") {
            throw new FinancialErrors_1.AccountFrozenError(accountId);
        }
        const depositTransaction = Transactions_1.Deposit.create({
            amount: new decimal_js_1.Decimal(amount),
            status: "PENDING",
            description: `Depósito en cuenta ${account.accountNumber}`,
            createdAt: new Date(),
            destinationAccountId: accountId
        });
        const savedTransaction = await this.accountRepository.executeTransaction(depositTransaction);
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
            depositedAt: savedTransaction.createdAt
        };
    }
}
exports.DepositUseCase = DepositUseCase;
