import { Account } from "../../domain/entities/Account";
import { Deposit, Transaction, Transfer, Withdrawal } from "../../domain/entities/Transactions";
import { AccountRepository } from "../../domain/repositories/Repositories";
import { PrismaClient } from "../../generated/prisma/client";
import { AccountMapper } from "../mappers/AccountMapper";
import { TransactionMapper } from "../mappers/TransactionMapper";

export class PrismaAccountRepository implements AccountRepository {
    
    constructor(private readonly prisma: PrismaClient) {}
    
    async save(account: Account): Promise<Account> {
        const data = AccountMapper.toPersistence(account);

        const prismaAccount = await this.prisma.account.upsert({
            where: {id: data.id},
            update: {
                balanceAcc: data.balanceAcc,
                accountStatus: data.accountStatus
            },
            create: data
        });

        return AccountMapper.toDomain(prismaAccount);
    }
    
    async findById(id: string): Promise<Account | null> {
        const prismaAccount = await this.prisma.account.findUnique({
            where: {id}
        });

        if(!prismaAccount) return null;

        return AccountMapper.toDomain(prismaAccount);
    }
    
    async findByAccountNumber(accountNumber: string): Promise<Account | null> {
        const prismaAccount = await this.prisma.account.findUnique({
            where: {accountNumber}
        });

        if(!prismaAccount) return null;

        return AccountMapper.toDomain(prismaAccount);
    }
    
    async findByUserId(userId: string): Promise<Account[]> {
        const prismaAccounts = await this.prisma.account.findMany({
            where: {userId}
        });

        return prismaAccounts.map(AccountMapper.toDomain);
    }

    async executeTransaction(transaction: Transaction): Promise<Transaction> {

        return await this.prisma.$transaction(async (tx) => {
            if ((transaction instanceof Transfer || transaction instanceof Withdrawal)
                && transaction.sourceAccount) {
                await tx.account.update({
                where: { id: transaction.sourceAccount },
                data: { balanceAcc: {decrement: transaction.amount.toString() } },
                });
            }

            if ((transaction instanceof Transfer || transaction instanceof Deposit)
                && transaction.destinationAccount) {
                await tx.account.update({
                where: { id: transaction.destinationAccount },
                data: { balanceAcc: {increment: transaction.amount.toString() } },
                });
            }

            transaction.markAsCompleted();
        
            const transactionRecord = await tx.transaction.create({
                data: TransactionMapper.toPersistence(transaction),
            });

            return TransactionMapper.toDomain(transactionRecord);
        });
    }

    async freeze(account: Account): Promise<void> {
        await this.prisma.account.update({
        where: { id: account.id },
        data: { accountStatus: 'FROZEN' },
        });
    }

    async unfreeze(account: Account): Promise<void> {
        await this.prisma.account.update({
        where: { id: account.id },
        data: { accountStatus: 'ACTIVE' },
        });
    }
} 