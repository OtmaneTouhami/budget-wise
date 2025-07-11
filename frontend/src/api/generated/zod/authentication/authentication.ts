/**
 * Generated by orval v7.10.0 🍺
 * Do not edit manually.
 * OpenAPI definition
 * OpenAPI spec version: v0
 */
import { z as zod } from "zod";

export const verifyAccountBody = zod.object({
  identifier: zod.string(),
  token: zod.string(),
});

export const resendVerificationBody = zod.object({
  identifier: zod.string(),
});

export const registerBodyPasswordMin = 8;

export const registerBodyPasswordMax = 2147483647;

export const registerBody = zod.object({
  username: zod.string(),
  email: zod.string(),
  password: zod
    .string()
    .min(registerBodyPasswordMin)
    .max(registerBodyPasswordMax),
  firstName: zod.string(),
  lastName: zod.string(),
  phoneNumber: zod.string(),
  countryId: zod.number(),
});

export const loginBodyPasswordMin = 8;

export const loginBodyPasswordMax = 2147483647;

export const loginBody = zod.object({
  loginIdentifier: zod.string(),
  password: zod.string().min(loginBodyPasswordMin).max(loginBodyPasswordMax),
});
