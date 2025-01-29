import { Hono } from "hono";
import { zUserValidator } from "./validator";
import { getSupabase, supabaseMiddleware } from "../../middleware/supabase";

const usersApp = new Hono();

usersApp.use(supabaseMiddleware);

usersApp.get("/", async (ctx) => {
	const supabase = getSupabase(ctx);
	const { data, error } = await supabase.from("users").select("*");

	return ctx.json({ data, error });
});

usersApp.post("/", zUserValidator, async (ctx) => {
	const body = await ctx.req.parseBody();

	const supabase = getSupabase(ctx);
	const { data, error } = await supabase.from("users").insert(body).select();

	return ctx.json({ data, error });
});

export { usersApp };
