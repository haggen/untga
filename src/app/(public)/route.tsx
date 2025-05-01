import { redirect } from "next/navigation";
import { getClientId, setClientId } from "~/lib/clientId";

export async function GET() {
  const clientId = await getClientId();

  if (clientId) {
    setClientId(clientId);
    redirect("/login");
  }

  setClientId();
  redirect("/registration");
}
