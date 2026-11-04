"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserAccountsUseCase = void 0;
class GetUserAccountsUseCase {
    accountRepository;
    constructor(accountRepository) {
        this.accountRepository = accountRepository;
    }
    async execute(input) {
        const accounts = await this.accountRepository.findByUserId(input.userId);
        return accounts.map((account) => ({
            id: account.id,
            accountNumber: account.accountNumber,
            balance: account.balanceAcc,
            status: account.accountStatus,
            userId: account.userid,
            createdAt: account.createdAt,
        }));
    }
}
exports.GetUserAccountsUseCase = GetUserAccountsUseCase;
