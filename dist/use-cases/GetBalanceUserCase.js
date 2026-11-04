"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBalanceUseCase = void 0;
const FinancialErrors_1 = require("../domain/exceptions/FinancialErrors");
class GetBalanceUseCase {
    accountRepository;
    constructor(accountRepository) {
        this.accountRepository = accountRepository;
    }
    async execute(input) {
        const account = await this.accountRepository.findById(input.accountId);
        if (!account) {
            throw new FinancialErrors_1.AccountNotFoundError(input.accountId);
        }
        return {
            id: account.id,
            accountNumber: account.accountNumber,
            balance: account.balanceAcc,
            userId: account.userid,
            status: account.accountStatus,
            createdAt: account.createdAt,
        };
    }
}
exports.GetBalanceUseCase = GetBalanceUseCase;
