import { Hono } from "hono";
import { getSupabase, supabaseMiddleware } from "../../middleware/supabase";

export type Bindings = {
	SUPABASE_URL: string;
	SUPABASE_ANON_KEY: string;
};

export const storageApp = new Hono<{ Bindings: Bindings }>();

storageApp.post("/upload", supabaseMiddleware, async (ctx) => {
	const supabase = getSupabase(ctx);

	const body = await ctx.req.parseBody();
	const avatar = body.avatar as File;

	const name = `${avatar.name}-${Date.now()}.${avatar.type.split("/")[1]}`;

	const { data, error } = await supabase.storage
		.from("hono-bucket")
		.upload(name, avatar);

	return ctx.json({ data, error });
});
