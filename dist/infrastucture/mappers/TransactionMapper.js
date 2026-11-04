"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionMapper = void 0;
const Transactions_1 = require("../../domain/entities/Transactions");
const client_1 = require("../../generated/prisma/client");
class TransactionMapper {
    static toDomain(prismaTransaction) {
        switch (prismaTransaction.type) {
            case client_1.TransactionType.DEPOSIT:
                if (!prismaTransaction.destinationAccountId) {
                    throw new Error("Inconsistencia en la base de datos, deposito necesita destinationAccountId");
                }
                return Transactions_1.Deposit.create({
                    id: prismaTransaction.id,
                    amount: prismaTransaction.amount,
                    description: prismaTransaction.description ?? "",
                    createdAt: prismaTransaction.createdAt,
                    status: prismaTransaction.status,
                    destinationAccountId: prismaTransaction.destinationAccountId
                });
            case client_1.TransactionType.WITHDRAWAL:
                if (!prismaTransaction.sourceAccountId) {
                    throw new Error("Inconsistencia en la base de datos, retiro necesita sourceAccountId");
                }
                return Transactions_1.Withdrawal.create({
                    id: prismaTransaction.id,
                    amount: prismaTransaction.amount,
                    description: prismaTransaction.description ?? "",
                    createdAt: prismaTransaction.createdAt,
                    status: prismaTransaction.status,
                    sourceAccountId: prismaTransaction.sourceAccountId
                });
            case client_1.TransactionType.TRANSFER:
                if (!prismaTransaction.destinationAccountId || !prismaTransaction.sourceAccountId) {
                    throw new Error("Inconsistencia en la base de datos, transferencia necesita destinationAccountId y sourceAccountId");
                }
                return Transactions_1.Transfer.create({
                    id: prismaTransaction.id,
                    amount: prismaTransaction.amount,
                    description: prismaTransaction.description ?? "",
                    createdAt: prismaTransaction.createdAt,
                    status: prismaTransaction.status,
                    sourceAccountId: prismaTransaction.sourceAccountId,
                    destinationAccountId: prismaTransaction.destinationAccountId
                });
            default:
                throw new Error(`Tipo de transaccion desconicido o corrupto en DB: ${prismaTransaction.type}`);
        }
    }
    static toPersistence(transaction) {
        let type;
        let sourceAccountId = null;
        let destinationAccountId = null;
        if (transaction instanceof Transactions_1.Deposit) {
            type = client_1.TransactionType.DEPOSIT;
            destinationAccountId = transaction.destinationAccount;
        }
        else if (transaction instanceof Transactions_1.Withdrawal) {
            type = client_1.TransactionType.WITHDRAWAL;
            sourceAccountId = transaction.sourceAccount;
        }
        else if (transaction instanceof Transactions_1.Transfer) {
            type = client_1.TransactionType.TRANSFER;
            sourceAccountId = transaction.sourceAccount;
            destinationAccountId = transaction.destinationAccount;
        }
        else {
            throw new Error("Instancia de transaccion invalida");
        }
        return {
            ...(transaction.id ? { id: transaction.id } : {}),
            amount: transaction.amount,
            description: transaction.description,
            type,
            status: transaction.status,
            createdAt: transaction.createdAt,
            sourceAccountId,
            destinationAccountId
        };
    }
}
exports.TransactionMapper = TransactionMapper;
