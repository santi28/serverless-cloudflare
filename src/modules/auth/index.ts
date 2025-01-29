import { Hono } from "hono";
import type { Bindings } from "../../types/bindings";
import { getSupabase, supabaseMiddleware } from "../../middleware/supabase";
import { findUserByEmail, registerUser } from "./services";
import {
	type zCreateUserInterface,
	zCreateUserValidator,
	type zLoginUserInterface,
	zLoginUserValidator,
} from "./validators";

import { sign } from "hono/jwt";

import Bun from "bun";
import { hashPassword, verifyPassword } from "../../utils/passwords";

export const authApp = new Hono<{ Bindings: Bindings }>();

authApp.use(supabaseMiddleware);

authApp.post("/register", zCreateUserValidator, async (ctx) => {
	const supabase = getSupabase(ctx);

	const body = await ctx.req.parseBody<zCreateUserInterface>();
	body.password = await hashPassword(body.password);

	const data = await registerUser(supabase, body);

	return ctx.json(data);
});

authApp.post("/login", zLoginUserValidator, async (ctx) => {
	try {
		const supabase = getSupabase(ctx);
		const body = await ctx.req.parseBody<zLoginUserInterface>();

		console.log(body);

		// Obtenemos el usuario desde la base de datos
		const user = await findUserByEmail(supabase, body.email);

		// Verificamos si el usuario existe
		if (!user) {
			throw new Error("User or password not found");
		}

		// Verificamos si la contraseña es correcta
		const isPasswordCorrect = await verifyPassword(
			body.password,
			user.password,
		);

		if (!isPasswordCorrect) {
			throw new Error("User or password not found");
		}

		const token = await sign({ userId: user.email }, ctx.env.JWT_SECRET);

		return ctx.json(token);
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		console.log(error);
		return ctx.json({ error: error.message }, 401);
	}
});
