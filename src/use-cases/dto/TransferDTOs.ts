export interface TransferMoneyInput {
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
}

export interface TransferMoneyOutput {
  transactionId: string;
  sourceAccountId: string;
  destinationAccountId: string;
  amount: number;
  executedAt: Date;
}