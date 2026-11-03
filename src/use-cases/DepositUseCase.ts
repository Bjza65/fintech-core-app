import { AccountRepository } from "../domain/repositories/Repositories";
import { InvalidAmountError, AccountNotFoundError, AccountFrozenError } from "../domain/exceptions/FinancialErrors";
import { DepositInputDTO, DepositOutputDTO } from "./dto/DepositDTOs";
import { Decimal } from "decimal.js";

export class DepositUseCase {
  constructor(private readonly accountRepository: AccountRepository) { }

  async execute(input: DepositInputDTO): Promise<DepositOutputDTO> {
    const { accountId, amount } = input;

    if (amount <= 0) {
      throw new InvalidAmountError("El monto a depositar debe ser un valor positivo.");
    }

    const depositAmount = new Decimal(amount);

    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new AccountNotFoundError(accountId);
    }

    if (account.accountStatus === "FROZEN") {
      throw new AccountFrozenError(accountId);
    }

    account.deposit(depositAmount);

    const updatedAccount = await this.accountRepository.save(account);

    return {
      accountId: updatedAccount.id!,
      newBalance: updatedAccount.balanceAcc.toNumber(),
      depositedAt: new Date(),
    };
  }
}