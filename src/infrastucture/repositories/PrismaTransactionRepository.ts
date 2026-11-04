import { Deposit, Transaction } from "../../domain/entities/Transactions";
import { TransactionRepository } from "../../domain/repositories/Repositories";
import { PrismaClient } from "../../generated/prisma/client";
import { TransactionMapper } from "../mappers/TransactionMapper";

export class PrismaTransactionRepository implements TransactionRepository{
    
    constructor(private readonly prisma: PrismaClient){}

    async findById(id: string): Promise<Transaction | null> {
        const prismaTransaction = await this.prisma.transaction.findUnique({
            where: {id}
        });

        if (!prismaTransaction) return null;
        
        return TransactionMapper.toDomain(prismaTransaction);
    }

    async findByAccountId(accountId: string): Promise<Transaction[]> {
        const prismaTransactions = await this.prisma.transaction.findMany({
            where: {
                OR: [
                    {destinationAccountId: accountId},
                    {sourceAccountId: accountId}
                ]
            }
        });

        return prismaTransactions.map(TransactionMapper.toDomain);
    }

    async save(transaction: Transaction): Promise<Transaction> {
        const data = TransactionMapper.toPersistence(transaction);
        const prismaTransaction = await this.prisma.transaction.create({data});
        return TransactionMapper.toDomain(prismaTransaction);
    }

}