import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getClientId } from "~/lib/client-id";
import { getSession } from "~/lib/session";

export async function GET() {
  const session = await getSession();

  if (session) {
    redirect("/account/characters");
  }

  const clientId = await getClientId(await cookies());

  if (clientId) {
    redirect("/login");
  }

  redirect("/registration");
}
