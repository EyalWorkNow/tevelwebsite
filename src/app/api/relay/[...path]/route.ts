import { handleRelay } from "@/lib/relay/handlers";

// The CRM's side of the cloud mailbox (HMAC-signed, see src/lib/relay/handlers.ts).
type Context = { params: Promise<{ path: string[] }> };
const forward = async (req: Request, ctx: Context) => handleRelay(req, (await ctx.params).path ?? []);

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const DELETE = forward;
