import { error } from "node:console";
import { Deposit, Transaction, Withdrawal, Transfer } from "../../domain/entities/Transactions";
import { Transaction as PrismaTransaction, Prisma, TransactionType} from "../../generated/prisma/client";

export class TransactionMapper {
    public static toDomain(prismaTransaction: PrismaTransaction): Transaction {
        switch(prismaTransaction.type){
            case TransactionType.DEPOSIT:
                if(!prismaTransaction.destinationAccountId) {
                    throw new Error("Inconsistencia en la base de datos, deposito necesita destinationAccountId");
                }
                return Deposit.create({
                    id: prismaTransaction.id,
                    amount: prismaTransaction.amount,
                    description: prismaTransaction.description ?? "",
                    createdAt: prismaTransaction.createdAt,
                    status: prismaTransaction.status,
                    destinationAccountId: prismaTransaction.destinationAccountId!
                });

            case TransactionType.WITHDRAWAL:
                if(!prismaTransaction.sourceAccountId) {
                    throw new Error("Inconsistencia en la base de datos, retiro necesita sourceAccountId");
                }
                return Withdrawal.create({
                    id: prismaTransaction.id,
                    amount: prismaTransaction.amount,
                    description: prismaTransaction.description ?? "",
                    createdAt: prismaTransaction.createdAt,
                    status: prismaTransaction.status,
                    sourceAccountId: prismaTransaction.sourceAccountId! 
                });

            case TransactionType.TRANSFER:
                if(!prismaTransaction.destinationAccountId || !prismaTransaction.sourceAccountId) {
                    throw new Error("Inconsistencia en la base de datos, transferencia necesita destinationAccountId y sourceAccountId");
                }
                return Transfer.create({
                    id: prismaTransaction.id,
                    amount: prismaTransaction.amount,
                    description: prismaTransaction.description ?? "",
                    createdAt: prismaTransaction.createdAt,
                    status: prismaTransaction.status,
                    sourceAccountId: prismaTransaction.sourceAccountId!,
                    destinationAccountId: prismaTransaction.destinationAccountId!
                });
            default:
                throw new Error(`Tipo de transaccion desconicido o corrupto en DB: ${prismaTransaction.type}`);
        }
    }

    public static toPersistence(transaction: Transaction): Prisma.TransactionUncheckedCreateInput {
        let type: TransactionType;
        let sourceAccountId: string | null = null;
        let destinationAccountId: string | null = null;

        if (transaction instanceof Deposit){
            type = TransactionType.DEPOSIT;
            destinationAccountId = transaction.destinationAccount;
        } else if (transaction instanceof Withdrawal){
            type = TransactionType.WITHDRAWAL;
            sourceAccountId = transaction.sourceAccount;
        } else if (transaction instanceof Transfer){
            type = TransactionType.TRANSFER;
            sourceAccountId = transaction.sourceAccount;
            destinationAccountId = transaction.destinationAccount;
        } else {
            throw new Error("Instancia de transaccion invalida");
        }
        
        return {
            id: transaction.id,
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