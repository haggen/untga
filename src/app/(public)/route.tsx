import { withErrorHandling, withMiddleware } from "@/lib/api";
import { getClientId, setClientId } from "@/lib/clientId";
import { redirect } from "next/navigation";

export const GET = withMiddleware(withErrorHandling(), async () => {
  const clientId = await getClientId();

  if (clientId) {
    setClientId(clientId);
    redirect("/login");
  }

  setClientId();
  redirect("/register");
});
