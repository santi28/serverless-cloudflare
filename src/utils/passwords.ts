import { hash, compare } from "bcryptjs";

export async function hashPassword(password: string) {
	return await hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
	return await compare(password, hash);
}
