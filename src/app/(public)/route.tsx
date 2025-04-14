import { redirect } from "next/navigation";
import { withErrorHandling, withPipeline } from "~/lib/api";
import { getClientId, setClientId } from "~/lib/clientId";

export const GET = withPipeline(withErrorHandling(), async () => {
  const clientId = await getClientId();

  if (clientId) {
    setClientId(clientId);
    redirect("/login");
  }

  setClientId();
  redirect("/register");
});
