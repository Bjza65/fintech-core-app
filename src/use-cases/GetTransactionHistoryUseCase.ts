import { GetTransactionHistoryInputDTO, GetTransactionHistoryOutputDTO } from "./dto/TransactionHistoryDTOs";
import { Deposit, Withdrawal, Transaction, Transfer } from "../domain/entities/Transactions";
import { AccountNotFoundError } from "../domain/exceptions/FinancialErrors";
import {AccountRepository,TransactionRepository} from "../domain/repositories/Repositories";

export class GetTransactionHistoryUseCase {
  constructor(private readonly transactionRepository: TransactionRepository, private readonly accountRepository: AccountRepository) { }

  async execute(input: GetTransactionHistoryInputDTO, userId: string): Promise<GetTransactionHistoryOutputDTO> {
    const transactions = await this.transactionRepository.findByAccountId(input.accountId);
    const account = await this.accountRepository.findById(input.accountId);

    if (!account || account.userid !== userId) {throw new AccountNotFoundError(input.accountId);}

    return {
      accountId: input.accountId,
      transactions: transactions.map((transaction: Transaction) => {

        if (!transaction.id) {
          throw new Error("La transacción no tiene un identificador válido");
        }
        const type = transaction instanceof Deposit
          ? 'DEPOSIT'
          : transaction instanceof Withdrawal
            ? 'WITHDRAWAL'
            : 'TRANSFER';
            
        const sourceAccountId=transaction instanceof Withdrawal || transaction instanceof Transfer
            ? transaction.sourceAccount
            : undefined;

        const destinationAccountId=transaction instanceof Deposit || transaction instanceof Transfer
            ? transaction.destinationAccount
            : undefined;

        return {
          id: transaction.id,
          type,
          amount: transaction.amount.toNumber(),
          status: transaction.status,
          description: transaction.description,
          createdAt: transaction.createdAt,
          sourceAccountId,
          destinationAccountId
        };
      }),
    };
  }
}