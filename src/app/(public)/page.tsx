import { getActiveSession } from "@/lib/session";

export default async function Page() {
  const session = await getActiveSession();

  return (
    <main>
      <p>Hi, {session?.user.email ?? "guest"}!</p>
    </main>
  );
}
