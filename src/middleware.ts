import type { NextRequest } from "next/server";
import { getClientId, setClientId } from "~/lib/clientId";

export async function middleware(req: NextRequest) {
  const clientId = await getClientId(req.cookies);

  if (!clientId) {
    setClientId(req.cookies);
  }
}
