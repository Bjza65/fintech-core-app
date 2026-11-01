import { Account } from "../../domain/entities/Account";
import { AccountRepository } from "../../domain/repositories/Repositories";
import { PrismaClient } from "../../generated/prisma/client";
import { AccountMapper } from "../mappers/AccountMapper";

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

} //pending tasks: 1. create UserMapper 2. create Prisma transaction repository and user repository //?