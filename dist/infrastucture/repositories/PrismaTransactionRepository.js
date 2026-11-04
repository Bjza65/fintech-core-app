"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaTransactionRepository = void 0;
const TransactionMapper_1 = require("../mappers/TransactionMapper");
class PrismaTransactionRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const prismaTransaction = await this.prisma.transaction.findUnique({
            where: { id }
        });
        if (!prismaTransaction)
            return null;
        return TransactionMapper_1.TransactionMapper.toDomain(prismaTransaction);
    }
    async findByAccountId(accountId) {
        const prismaTransactions = await this.prisma.transaction.findMany({
            where: {
                OR: [
                    { destinationAccountId: accountId },
                    { sourceAccountId: accountId }
                ]
            }
        });
        return prismaTransactions.map(TransactionMapper_1.TransactionMapper.toDomain);
    }
    async save(transaction) {
        const data = TransactionMapper_1.TransactionMapper.toPersistence(transaction);
        const prismaTransaction = await this.prisma.transaction.create({ data });
        return TransactionMapper_1.TransactionMapper.toDomain(prismaTransaction);
    }
}
exports.PrismaTransactionRepository = PrismaTransactionRepository;
