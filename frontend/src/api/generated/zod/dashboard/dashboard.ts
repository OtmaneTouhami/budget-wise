/**
 * Generated by orval v7.10.0 🍺
 * Do not edit manually.
 * OpenAPI definition
 * OpenAPI spec version: v0
 */
import { z as zod } from "zod";

export const getDashboardStatsQueryParams = zod.object({
  startDate: zod.string().date().optional(),
  endDate: zod.string().date().optional(),
});
