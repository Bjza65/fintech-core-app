import Decimal from "decimal.js";
import { InvalidPropValueError } from "../domain/exceptions/DomainError";
import { AccountFrozenError, AccountNotFoundError, InsufficientBalanceError, InvalidAmountError } from "../domain/exceptions/FinancialErrors";
import { AccountRepository } from "../domain/repositories/Repositories";
import { TransferMoneyInput, TransferMoneyOutput } from "./dto/TransferDTOs";
import { Transfer } from "../domain/entities/Transactions";

export class TransferMoneyUseCase {
    constructor(private readonly accountRepository: AccountRepository){}

    async execute(input: TransferMoneyInput, userId: string): Promise<TransferMoneyOutput> {
        const { sourceAccountId, destinationAccountId, amount } = input;

        if (amount <= 0) {
            throw new InvalidAmountError("El monto de la transferencia debe ser estrictamente mayor a cero.");
        }

        if (sourceAccountId === destinationAccountId) {
            throw new InvalidPropValueError("La cuenta de origen y destino no pueden ser idénticas.");
        }

        const transferAmount = new Decimal(amount);

        const sourceAccount = await this.accountRepository.findById(sourceAccountId);
        if (!sourceAccount || sourceAccount.userid !== userId) {
            throw new AccountNotFoundError(sourceAccountId);
        }

        if (sourceAccount.accountStatus === "FROZEN") {
            throw new AccountFrozenError(sourceAccountId);
        }

        if (sourceAccount.balanceAcc.lessThan(transferAmount)){
            throw new InsufficientBalanceError("La cuenta de origen no tiene saldo suficiente para realizar la transferencia.");
        }

        const destinationAccount = await this.accountRepository.findById(destinationAccountId);
        if (!destinationAccount) {
            throw new AccountNotFoundError(destinationAccountId);
        }

        sourceAccount.withdraw(transferAmount);
        destinationAccount.deposit(transferAmount);

        const transactionEntity = Transfer.create({
            amount: transferAmount,
            status: "PENDING",
            sourceAccountId,
            destinationAccountId,
            createdAt: new Date(),
            description: `Transferencia de ${transferAmount.toNumber()} desde la cuenta ${sourceAccountId} a la cuenta ${destinationAccountId}.`
        });

        const savedTransaction = await this.accountRepository.executeTransaction(transactionEntity);

        return{
            transactionId: savedTransaction.id!,
            sourceAccountId,
            destinationAccountId,
            amount: savedTransaction.amount.toNumber(),
            executedAt: savedTransaction.createdAt
        }
    }
}