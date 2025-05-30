import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getClientId } from "~/lib/client-id";
import { getActiveSession } from "~/lib/session";

export async function GET() {
  const session = await getActiveSession();

  if (session) {
    redirect("/account/characters");
  }

  const clientId = await getClientId(await cookies());

  if (clientId) {
    redirect("/login");
  }

  redirect("/registration");
}
