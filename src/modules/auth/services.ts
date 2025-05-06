import type { SupabaseClient } from "@supabase/supabase-js";

export interface User {
	username: string;
	email: string;
	password: string;
}

export async function registerUser(subapase: SupabaseClient, user: User) {
	console.log("registerUser", user);
	const { data, error } = await subapase.from("users").insert(user).select();

	if (error) {
		throw new Error(error.message);
	}

	return data;
}

export async function findUserByEmail(subapase: SupabaseClient, email: string) {
	console.log("Trying to find user by email", email);

	const { data, error } = await subapase
		.from("users")
		.select()
		.eq("email", email)
		.single();

	console.log({ data, error });

	if (error) {
		throw new Error(error.message);
	}

	return data as unknown as User;
}
