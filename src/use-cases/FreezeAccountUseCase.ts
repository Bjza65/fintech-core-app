import { AccountFrozenError, AccountNotFoundError } from "../domain/exceptions/FinancialErrors";
import { AccountRepository } from "../domain/repositories/Repositories";

export class FreezeAccountUseCase {
  constructor(private readonly accountRepository: AccountRepository) { }

  async execute(accountId: string): Promise<void> {
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new AccountNotFoundError(accountId);
    }

    if (account.accountStatus === "FROZEN") {
      throw new AccountFrozenError(accountId);
    }

    account.freeze();

    await this.accountRepository.freeze(account);
  }
}