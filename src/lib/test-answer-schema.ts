import { z } from "zod";
// Answer references are checked against the actual paper by gradePaper and the SQL RPC.
// A fixed 1000-answer quota would make larger authored papers impossible to submit.
export const testAnswersSchema = z.record(z.string().max(300), z.number().int().min(0).max(5));
