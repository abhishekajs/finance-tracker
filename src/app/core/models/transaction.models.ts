import { Account } from './account.models';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: TransactionType;
  accountId: string;
  categoryId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  account: Account;
  category?: Category;
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface CreateTransactionRequest {
  amount: number;
  description: string;
  type: TransactionType;
  accountId: string;
  categoryId?: string;
  date?: string;
}

export interface UpdateTransactionRequest {
  amount?: number;
  description?: string;
  type?: string;
  accountId?: string;
  categoryId?: string;
  date?: string;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  category?: string;
}
