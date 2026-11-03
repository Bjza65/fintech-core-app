import { InvalidPropValueError } from "../domain/exceptions/DomainError";
import { AccountNotFoundError } from "../domain/exceptions/FinancialErrors";
import { AccountRepository } from "../domain/repositories/Repositories";

export class UnfreezeAccountUseCase {
  constructor(private readonly accountRepository: AccountRepository) { }

  async execute(accountId: string): Promise<void> {
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new AccountNotFoundError(accountId);
    }

    if (account.accountStatus === "ACTIVE") {
      throw new InvalidPropValueError(`La cuenta con ID '${accountId}' ya está activa y no requiere ser descongelada.`);
    }

    account.unfreeze();

    await this.accountRepository.unfreeze(account);
  }
}