import Decimal from "decimal.js";

export interface GetBalanceInputDTO{
    accountId: string
}

export interface AccountOutputDTO {
  id?: string;
  accountNumber: string;
  balance: Decimal;
  userId: string;
  status: string;
  createdAt?: Date;
}

export interface CreateAccountInputDTO {
  userId: string;
  initialBalance?: Decimal;
}

export interface GetUserAccountsInputDTO {
  userId: string;
}