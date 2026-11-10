"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreezeAccountUseCase = void 0;
const FinancialErrors_1 = require("../domain/exceptions/FinancialErrors");
class FreezeAccountUseCase {
    accountRepository;
    constructor(accountRepository) {
        this.accountRepository = accountRepository;
    }
    async execute(accountId, userId) {
        const account = await this.accountRepository.findById(accountId);
        if (!account || account.userid !== userId) {
            throw new FinancialErrors_1.AccountNotFoundError(accountId);
        }
        if (account.accountStatus === "FROZEN") {
            throw new FinancialErrors_1.AccountFrozenError(accountId);
        }
        account.freeze();
        await this.accountRepository.freeze(account);
    }
}
exports.FreezeAccountUseCase = FreezeAccountUseCase;
