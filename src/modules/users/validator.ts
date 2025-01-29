import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

export const userSchema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
});

export const zUserValidator = zValidator("form", userSchema);
