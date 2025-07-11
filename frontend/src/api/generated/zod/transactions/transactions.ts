/**
 * Generated by orval v7.10.0 🍺
 * Do not edit manually.
 * OpenAPI definition
 * OpenAPI spec version: v0
 */
import { z as zod } from "zod";

export const getTransactionByIdParams = zod.object({
  id: zod.string().uuid(),
});

export const updateTransactionParams = zod.object({
  id: zod.string().uuid(),
});

export const updateTransactionBodyAmountMin = 0.01;

export const updateTransactionBody = zod.object({
  amount: zod.number().min(updateTransactionBodyAmountMin),
  description: zod.string().optional(),
  transactionDate: zod.string().datetime({}),
  categoryId: zod.string().uuid(),
});

export const deleteTransactionParams = zod.object({
  id: zod.string().uuid(),
});

export const getTransactionsQueryParams = zod.object({
  startDate: zod.string().date().optional(),
  endDate: zod.string().date().optional(),
});

export const createTransactionBodyAmountMin = 0.01;

export const createTransactionBody = zod.object({
  amount: zod.number().min(createTransactionBodyAmountMin),
  description: zod.string().optional(),
  transactionDate: zod.string().datetime({}),
  categoryId: zod.string().uuid(),
});

export const createTransactionFromTemplateParams = zod.object({
  templateId: zod.string().uuid(),
});

export const createTransactionFromTemplateBodyAmountMin = 0.01;

export const createTransactionFromTemplateBody = zod.object({
  amount: zod
    .number()
    .min(createTransactionFromTemplateBodyAmountMin)
    .optional(),
});

export const exportTransactionsToCsvQueryParams = zod.object({
  startDate: zod.string().date().optional(),
  endDate: zod.string().date().optional(),
});
