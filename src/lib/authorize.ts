import { Operation } from "@prisma/client/runtime/library";
import { db, Prisma, Session, WithUser } from "~/lib/db";

type SupportedOperations = Operation | "$allOperations";

type OperationCheckerArguments<T, O> = O extends Operation
  ? { model: string; operation: O; args: Prisma.Args<T, O> }
  : O extends "$allOperations"
  ? {
      [O in Operation]: {
        model: string;
        operation: O;
        args: Prisma.Args<T, O>;
      };
    }[Operation]
  : never;

type OperationChecker<T, O> = (
  _: OperationCheckerArguments<T, O>
) => Promise<boolean>;

type Policy<T> = {
  [O in SupportedOperations]?: OperationChecker<T, O>;
};

export function user({ session }: { session: Session<WithUser> | null }) {
  return {
    async $allOperations({ operation, args }) {
      if (session) {
        switch (operation) {
          case "update":
          case "delete":
          case "updateMany":
          case "deleteMany":
          case "updateManyAndReturn":
          case "upsert":
            args.where = { ...args.where, id: session.userId };
            break;
        }
      }
      return false;
    },
  } satisfies Policy<typeof db.user>;
}

export function authorize({ session }: { session: Session<WithUser> | null }) {
  return db.$extends({
    query: {
      user: user({ session }),
    },
  });
}
