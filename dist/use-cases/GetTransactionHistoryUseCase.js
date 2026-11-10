"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTransactionHistoryUseCase = void 0;
const Transactions_1 = require("../domain/entities/Transactions");
const FinancialErrors_1 = require("../domain/exceptions/FinancialErrors");
class GetTransactionHistoryUseCase {
    transactionRepository;
    accountRepository;
    constructor(transactionRepository, accountRepository) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
    }
    async execute(input, userId) {
        const account = await this.accountRepository.findById(input.accountId);
        if (!account || account.userid !== userId) {
            throw new FinancialErrors_1.AccountNotFoundError(input.accountId);
        }
        const transactions = await this.transactionRepository.findByAccountId(input.accountId);
        return {
            accountId: input.accountId,
            transactions: transactions.map((transaction) => {
                if (!transaction.id) {
                    throw new Error("La transacción no tiene un identificador válido");
                }
                const type = transaction instanceof Transactions_1.Deposit
                    ? 'DEPOSIT'
                    : transaction instanceof Transactions_1.Withdrawal
                        ? 'WITHDRAWAL'
                        : 'TRANSFER';
                const sourceAccountId = transaction instanceof Transactions_1.Withdrawal || transaction instanceof Transactions_1.Transfer
                    ? transaction.sourceAccount
                    : undefined;
                const destinationAccountId = transaction instanceof Transactions_1.Deposit || transaction instanceof Transactions_1.Transfer
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
exports.GetTransactionHistoryUseCase = GetTransactionHistoryUseCase;
