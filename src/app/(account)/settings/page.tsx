import { AccountDeletionForm } from "~/app/(account)/settings/account-deletion-form";
import { ChangeEmailForm } from "~/app/(account)/settings/change-email-form";
import { ChangePasswordForm } from "~/app/(account)/settings/change-password-form";
import { Heading } from "~/components/simple/Heading";
import { createStatefulAction } from "~/lib/actions";
import { db } from "~/lib/db";
import { serializable } from "~/lib/serializable";
import { ensureActiveSession } from "~/lib/session";
import { parse, schemas } from "~/lib/validation";
import { SessionManagement } from "./session-management";

export default async function Page() {
  const session = await ensureActiveSession(true);

  const sessions = await db.session.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  const invalidateSession = createStatefulAction(
    async (payload: { id: number }) => {
      "use server";

      const session = await ensureActiveSession(true);

      await db.session.invalidate({
        where: {
          id: payload.id,
          user: { id: session.userId },
        },
      });

      return { message: "Session invalidated." };
    }
  );

  const changeEmail = createStatefulAction(async (payload: FormData) => {
    "use server";

    const session = await ensureActiveSession(true);

    const data = parse(payload, {
      email: schemas.email,
    });

    await db.user.update({
      where: { id: session.userId },
      data: { email: data.email },
    });

    return { message: "Email changed successfully." };
  });

  const changePassword = createStatefulAction(async (payload: FormData) => {
    "use server";

    const session = await ensureActiveSession(true);

    const data = parse(payload, {
      password: schemas.password,
    });

    await db.user.update({
      where: { id: session.userId },
      data: { password: data.password },
    });

    return { message: "Password changed successfully." };
  });

  const deleteAccount = createStatefulAction(async () => {
    "use server";

    const session = await ensureActiveSession(true);

    await db.user.delete({
      where: { id: session.userId },
    });

    return { message: "Account deleted successfully." };
  });

  return (
    <main className="flex flex-col gap-12">
      <header>
        <Heading>Settings</Heading>
      </header>

      <div className="flex flex-col gap-18">
        <SessionManagement
          sessions={serializable(sessions)}
          action={invalidateSession}
        />
        <ChangeEmailForm action={changeEmail} />
        <ChangePasswordForm action={changePassword} />
        <AccountDeletionForm action={deleteAccount} />
      </div>
    </main>
  );
}
