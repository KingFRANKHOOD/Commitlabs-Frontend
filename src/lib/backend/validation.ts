// src/lib/backend/validation.ts
// TODO: Replace with zod for better validation library support

import { StrKey } from '@stellar/stellar-sdk';

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}

// Validate Stellar address
export function validateAddress(address: string): string {
  if (!address || typeof address !== 'string') {
    throw new ValidationError('Address is required and must be a string', 'address');
  }
  if (!StrKey.isValidEd25519PublicKey(address)) {
    throw new ValidationError('Invalid Stellar address format', 'address');
  }
  return address;
}

// Validate amount (positive number, can be string or number)
export function validateAmount(amount: string | number): number {
  let numAmount: number;
  if (typeof amount === 'string') {
    numAmount = parseFloat(amount);
  } else if (typeof amount === 'number') {
    numAmount = amount;
  } else {
    throw new ValidationError('Amount must be a number or numeric string', 'amount');
  }
  if (isNaN(numAmount) || numAmount <= 0) {
    throw new ValidationError('Amount must be a positive number', 'amount');
  }
  return numAmount;
}

// Validate pagination parameters
export function validatePagination(page?: string | number, limit?: string | number): PaginationParams {
  let pageNum = 1;
  let limitNum = 10;

  if (page !== undefined) {
    if (typeof page === 'string') {
      pageNum = parseInt(page, 10);
    } else if (typeof page === 'number') {
      pageNum = page;
    } else {
      throw new ValidationError('Page must be a number', 'page');
    }
    if (isNaN(pageNum) || pageNum < 1) {
      throw new ValidationError('Page must be a positive integer', 'page');
    }
  }

  if (limit !== undefined) {
    if (typeof limit === 'string') {
      limitNum = parseInt(limit, 10);
    } else if (typeof limit === 'number') {
      limitNum = limit;
    } else {
      throw new ValidationError('Limit must be a number', 'limit');
    }
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      throw new ValidationError('Limit must be between 1 and 100', 'limit');
    }
  }

  return { page: pageNum, limit: limitNum };
}

// Validate filters (generic, for now just check types)
export function validateFilters(filters: Record<string, any>): FilterParams {
  const validated: FilterParams = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null) continue;
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      validated[key] = value;
    } else {
      throw new ValidationError(`Filter ${key} must be a string, number, or boolean`, key);
    }
  }
  return validated;
}

// Helper to handle validation in API routes
export function handleValidationError(error: unknown) {
  if (error instanceof ValidationError) {
    return Response.json({ error: error.message, field: error.field }, { status: 400 });
  }
  throw error; // Re-throw if not validation error
}