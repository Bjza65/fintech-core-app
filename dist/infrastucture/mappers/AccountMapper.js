"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountMapper = void 0;
const Account_1 = require("../../domain/entities/Account");
class AccountMapper {
    static toDomain(prismaAccount) {
        return Account_1.Account.create({
            id: prismaAccount.id,
            accountNumber: prismaAccount.accountNumber,
            balanceAcc: prismaAccount.balanceAcc,
            userId: prismaAccount.userId,
            accountStatus: prismaAccount.accountStatus,
            createdAt: prismaAccount.createdAt
        });
    }
    static toPersistence(domainAccount) {
        return {
            id: domainAccount.id,
            accountNumber: domainAccount.accountNumber,
            balanceAcc: domainAccount.balanceAcc,
            userId: domainAccount.userid,
            accountStatus: domainAccount.accountStatus,
            createdAt: domainAccount.createdAt
        };
    }
}
exports.AccountMapper = AccountMapper;
