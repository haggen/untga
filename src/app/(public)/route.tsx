import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getClientId } from "~/lib/clientId";

export async function GET() {
  const clientId = await getClientId(await cookies());

  if (clientId) {
    redirect("/login");
  }
  redirect("/registration");
}
