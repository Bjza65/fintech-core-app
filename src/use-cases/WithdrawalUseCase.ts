
import { AccountRepository } from "../domain/repositories/Repositories";
import {InvalidAmountError,AccountNotFoundError,AccountFrozenError,InsufficientBalanceError} from "../domain/exceptions/FinancialErrors";
import {WithdrawalInputDTO,WithdrawalOutputDTO} from "./dto/WithdrawalDTOs";
import { Decimal } from "decimal.js";
import { Withdrawal } from "../domain/entities/Transactions";

export class WithdrawalUseCase {

    constructor(private readonly accountRepository: AccountRepository) {}

    async execute(input: WithdrawalInputDTO, userId: string): Promise<WithdrawalOutputDTO> {

        const { accountId, amount } = input;

        if (amount <= 0) {
            throw new InvalidAmountError("El monto a retirar debe ser positivo.");
        }

        const account = await this.accountRepository.findById(accountId);

        if (!account || account.userid !== userId) {
            throw new AccountNotFoundError(accountId);
        }

        if (account.accountStatus === "FROZEN") {
            throw new AccountFrozenError(accountId);
        }

        const withdrawalAmount = new Decimal(amount);

        if (account.balanceAcc.lessThan(withdrawalAmount)) {
            throw new InsufficientBalanceError(accountId);
        }

        const withdrawalTransaction = Withdrawal.create({
            amount: withdrawalAmount,
            status: "PENDING",
            description: `Retiro de cuenta ${account.accountNumber}`,
            createdAt: new Date(),
            sourceAccountId: accountId
        });

        const savedTransaction = await this.accountRepository.executeTransaction(
            withdrawalTransaction
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
            withdrawnAt: savedTransaction.createdAt
    }
}}