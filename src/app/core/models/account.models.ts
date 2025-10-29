export enum AccountType {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  CREDIT = 'CREDIT',
  INVESTMENT = 'INVESTMENT',
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAccountRequest {
  name: string;
  type: AccountType;
  balance: number;
}

export interface UpdateAccountRequest {
  name?: string;
  type?: AccountType;
  balance?: number;
}

export interface TotalBalanceResponse {
  totalBalance: number;
}
