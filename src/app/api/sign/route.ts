import { handleSign } from "@/lib/relay/handlers";

// The customer's actions on /sign/<token>: view, sign, decline, download.
export const POST = (req: Request) => handleSign(req);
