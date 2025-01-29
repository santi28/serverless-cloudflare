import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

export const createUserSchema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	password: z.string(),
});

export type zCreateUserInterface = z.infer<typeof createUserSchema>;
export const zCreateUserValidator = zValidator("form", createUserSchema);

export const loginUserSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

export type zLoginUserInterface = z.infer<typeof loginUserSchema>;
export const zLoginUserValidator = zValidator("form", loginUserSchema);
