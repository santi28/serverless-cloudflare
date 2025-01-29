import { Hono } from "hono";
import { storageApp } from "./modules/storage";
import { authApp } from "./modules/auth";
import type { Bindings } from "./types/bindings";
import { jwt } from "hono/jwt";

const app = new Hono<{ Bindings: Bindings }>().basePath("api");

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

app.route("storage", storageApp);
app.route("auth", authApp);

app.get(
	"/health",
	async (ctx, next) => {
		const jwtMiddleware = jwt({ secret: ctx.env.JWT_SECRET });

		return jwtMiddleware(ctx, next);
	},
	(c) => {
		return c.text("OK");
	},
);

export default app;
