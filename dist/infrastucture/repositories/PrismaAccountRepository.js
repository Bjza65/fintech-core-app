"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaAccountRepository = void 0;
const Transactions_1 = require("../../domain/entities/Transactions");
const AccountMapper_1 = require("../mappers/AccountMapper");
const TransactionMapper_1 = require("../mappers/TransactionMapper");
class PrismaAccountRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async save(account) {
        const data = AccountMapper_1.AccountMapper.toPersistence(account);
        const prismaAccount = await this.prisma.account.upsert({
            where: { id: data.id },
            update: {
                balanceAcc: data.balanceAcc,
                accountStatus: data.accountStatus
            },
            create: data
        });
        return AccountMapper_1.AccountMapper.toDomain(prismaAccount);
    }
    async findById(id) {
        const prismaAccount = await this.prisma.account.findUnique({
            where: { id }
        });
        if (!prismaAccount)
            return null;
        return AccountMapper_1.AccountMapper.toDomain(prismaAccount);
    }
    async findByAccountNumber(accountNumber) {
        const prismaAccount = await this.prisma.account.findUnique({
            where: { accountNumber }
        });
        if (!prismaAccount)
            return null;
        return AccountMapper_1.AccountMapper.toDomain(prismaAccount);
    }
    async findByUserId(userId) {
        const prismaAccounts = await this.prisma.account.findMany({
            where: { userId }
        });
        return prismaAccounts.map(AccountMapper_1.AccountMapper.toDomain);
    }
    async executeTransaction(transaction) {
        return await this.prisma.$transaction(async (tx) => {
            if ((transaction instanceof Transactions_1.Transfer || transaction instanceof Transactions_1.Withdrawal)
                && transaction.sourceAccount) {
                await tx.account.update({
                    where: { id: transaction.sourceAccount },
                    data: { balanceAcc: { decrement: transaction.amount.toString() } },
                });
            }
            if ((transaction instanceof Transactions_1.Transfer || transaction instanceof Transactions_1.Deposit)
                && transaction.destinationAccount) {
                await tx.account.update({
                    where: { id: transaction.destinationAccount },
                    data: { balanceAcc: { increment: transaction.amount.toString() } },
                });
            }
            transaction.markAsCompleted();
            const transactionRecord = await tx.transaction.create({
                data: TransactionMapper_1.TransactionMapper.toPersistence(transaction),
            });
            return TransactionMapper_1.TransactionMapper.toDomain(transactionRecord);
        });
    }
    async freeze(account) {
        await this.prisma.account.update({
            where: { id: account.id },
            data: { accountStatus: 'FROZEN' },
        });
    }
    async unfreeze(account) {
        await this.prisma.account.update({
            where: { id: account.id },
            data: { accountStatus: 'ACTIVE' },
        });
    }
}
exports.PrismaAccountRepository = PrismaAccountRepository;
