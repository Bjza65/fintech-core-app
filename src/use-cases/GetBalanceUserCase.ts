import { AccountNotFoundError } from "../domain/exceptions/FinancialErrors";
import { AccountRepository } from "../domain/repositories/Repositories";
import { AccountOutputDTO, GetBalanceInputDTO } from "./dto/AccountDTOs";

export class GetBalanceUseCase{
    constructor(private readonly accountRepository: AccountRepository) {}

    async execute(input: GetBalanceInputDTO, userId: string): Promise<AccountOutputDTO>{
        const account = await this.accountRepository.findById(input.accountId);

        if(!account || account.userid !== userId){
            throw new AccountNotFoundError(input.accountId);
        }

        return{
            id: account.id,
            accountNumber: account.accountNumber,
            balance: account.balanceAcc,
            userId: account.userid,
            status: account.accountStatus,
            createdAt: account.createdAt,
        };
    }
}