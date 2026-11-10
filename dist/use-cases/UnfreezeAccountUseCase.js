"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnfreezeAccountUseCase = void 0;
const DomainError_1 = require("../domain/exceptions/DomainError");
const FinancialErrors_1 = require("../domain/exceptions/FinancialErrors");
class UnfreezeAccountUseCase {
    accountRepository;
    constructor(accountRepository) {
        this.accountRepository = accountRepository;
    }
    async execute(accountId, userId) {
        const account = await this.accountRepository.findById(accountId);
        if (!account || account.userid !== userId) {
            throw new FinancialErrors_1.AccountNotFoundError(accountId);
        }
        if (account.accountStatus === "ACTIVE") {
            throw new DomainError_1.InvalidPropValueError(`La cuenta con ID '${accountId}' ya está activa y no requiere ser descongelada.`);
        }
        account.unfreeze();
        await this.accountRepository.unfreeze(account);
    }
}
exports.UnfreezeAccountUseCase = UnfreezeAccountUseCase;
