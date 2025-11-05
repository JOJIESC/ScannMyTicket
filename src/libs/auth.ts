import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export type SessionUser = {
  id: number;
  role?: string | null;
  email_address?: string | null;
  [k: string]: any;
};

/**
 * Lee el JWT de la cookie "ScannToken" y devuelve el usuario tipado.
 * Acepta payloads donde el usuario venga en payload.user o plano en el payload.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const token = cookies().get("ScannToken")?.value;
    const secret = process.env.JWT_SECRET;
    if (!token || !secret) return null;

    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));

    // algunos JWTs llevan el usuario en payload.user, otros en el propio payload
    const raw: any = (payload as any)?.user ?? payload;

    if (!raw || (typeof raw !== "object")) return null;

    const idNum =
      typeof raw.id === "string" ? parseInt(raw.id, 10) :
      typeof raw.id === "number" ? raw.id : NaN;

    if (!Number.isFinite(idNum)) return null;

    const session: SessionUser = {
      id: idNum,
      role: raw.role ?? null,
      email_address: raw.email_address ?? null,
      ...raw,
    };
    return session;
  } catch {
    return null;
  }
}
