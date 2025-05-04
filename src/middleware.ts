import { NextResponse, type NextRequest } from "next/server";
import { getClientId, setClientId } from "~/lib/clientId";

export async function middleware(req: NextRequest) {
  const clientId = await getClientId(req.cookies);

  const response = NextResponse.next();

  if (!clientId) {
    setClientId(response.cookies);
  }

  return response;
}
