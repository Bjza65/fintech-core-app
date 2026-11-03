import { AccountRepository } from "../domain/repositories/Repositories";
import { InvalidAmountError, AccountNotFoundError, AccountFrozenError, InsufficientBalanceError } from "../domain/exceptions/FinancialErrors";
import { WithdrawalInputDTO, WithdrawalOutputDTO } from "./dto/WithdrawalDTOs";
import { Decimal } from "decimal.js";

export class WithdrawalUseCase {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(input: WithdrawalInputDTO): Promise<WithdrawalOutputDTO> {
    const { accountId, amount } = input;

    if (amount <= 0) {
      throw new InvalidAmountError("El monto a retirar debe ser un valor positivo.");
    }

    const withdrawalAmount = new Decimal(amount);

    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new AccountNotFoundError(accountId);
    }

    if (account.accountStatus === "FROZEN") {
      throw new AccountFrozenError(accountId);
    }

    if (account.balanceAcc.lessThan(withdrawalAmount)) {
      throw new InsufficientBalanceError(account.id!);
    }

    account.withdraw(withdrawalAmount);

    const updatedAccount = await this.accountRepository.save(account);

    return {
      accountId: updatedAccount.id!,
      newBalance: updatedAccount.balanceAcc.toNumber(),
      withdrawnAt: new Date(),
    };
  }
}