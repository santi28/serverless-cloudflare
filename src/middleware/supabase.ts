import { createClient } from "@supabase/supabase-js";
import type { Context, MiddlewareHandler } from "hono";

export const supabaseContextId = "supabase-ctx";

export const supabaseMiddleware: MiddlewareHandler = async (ctx, next) => {
	try {
		if (!ctx.env.SUPABASE_URL) {
			throw new Error("SUPABASE_URL is not set");
		}

		if (!ctx.env.SUPABASE_ANON_KEY) {
			throw new Error("SUPABASE_ANON_KEY is not set");
		}

		if (getSupabase(ctx)) return next();

		const supabase = createClient(
			ctx.env.SUPABASE_URL,
			ctx.env.SUPABASE_ANON_KEY,
		);

		ctx.set(supabaseContextId, supabase);

		await next();
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		ctx.status(500);
		return ctx.json({ error: error.message });
	}
};

export function getSupabase(ctx: Context) {
	return ctx.get(supabaseContextId);
}
