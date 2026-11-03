import Decimal from "decimal.js";
import { InvalidAmountError } from "../domain/exceptions/FinancialErrors";
import { AccountRepository } from "../domain/repositories/Repositories";
import { AccountOutputDTO, CreateAccountInputDTO } from "./dto/AccountDTOs";
import { Account } from "../domain/entities/Account";

export class CreateAccountUseCase {
    constructor(private readonly accountRepository: AccountRepository){}

    async execute(input: CreateAccountInputDTO): Promise<AccountOutputDTO> {
        const initialAmount = input.initialBalance?.toNumber() ?? 0;

        if (initialAmount < 0){
            throw new InvalidAmountError("El monto de la operación debe ser un valor estricto mayor a cero.");
        }

        const accountNumber = `ACC-${Math.floor(100000000 + Math.random() * 900000000)}`;

        const newAccount = Account.create({
            id: crypto.randomUUID(),
            accountNumber,
            balanceAcc: new Decimal(initialAmount),
            userId: input.userId,
            accountStatus: "ACTIVE",
            createdAt: new Date()
        });

        const savedAccount = await this.accountRepository.save(newAccount);

        return{
            id: savedAccount.id,
            accountNumber: savedAccount.accountNumber,
            balance: new Decimal(savedAccount.balanceAcc),
            status: savedAccount.accountStatus,
            userId: savedAccount.userid,
            createdAt: savedAccount.createdAt,
        }
    }
}