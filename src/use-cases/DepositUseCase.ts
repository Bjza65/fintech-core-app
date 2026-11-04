
import { AccountRepository } from "../domain/repositories/Repositories";
import {InvalidAmountError,AccountNotFoundError,AccountFrozenError} from "../domain/exceptions/FinancialErrors";
import { DepositInputDTO, DepositOutputDTO } from "./dto/DepositDTOs";
import { Decimal } from "decimal.js";
import { Deposit } from "../domain/entities/Transactions";

export class DepositUseCase {

    constructor(private readonly accountRepository: AccountRepository) {}

    async execute(input: DepositInputDTO, userId: string): Promise<DepositOutputDTO> {

        const { accountId, amount } = input;

        if (amount <= 0) {
            throw new InvalidAmountError("El monto a depositar debe ser positivo.");
        }

        const account = await this.accountRepository.findById(accountId);

        if (!account || account.userid !== userId) {
            throw new AccountNotFoundError(accountId);
        }

        if (account.accountStatus === "FROZEN") {
            throw new AccountFrozenError(accountId);
        }

        const depositTransaction = Deposit.create({
            amount: new Decimal(amount),
            status: "PENDING",
            description: `Depósito en cuenta ${account.accountNumber}`,
            createdAt: new Date(),
            destinationAccountId: accountId
        });

        const savedTransaction = await this.accountRepository.executeTransaction(
            depositTransaction
        );

        const updatedAccount = await this.accountRepository.findById(accountId);

        if (!updatedAccount) {
            throw new AccountNotFoundError(accountId);
        }

        if (!updatedAccount.id) {
          throw new Error("La cuenta no tiene un identificador válido");
          }

        return {
            accountId: updatedAccount.id,
            newBalance: updatedAccount.balanceAcc.toNumber(),
            depositedAt: savedTransaction.createdAt
};
}
}
