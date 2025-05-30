import { NextResponse } from "next/server";
import {
  createHandlerPipeline,
  withAuthorization,
  withErrorHandling,
} from "~/lib/api";
import { db } from "~/lib/db";
import { getActionType, tag } from "~/lib/tags";

export const PATCH = createHandlerPipeline(
  withErrorHandling(),
  withAuthorization(),
  async ({ state }) => {
    if (state.session.userId !== 1) {
      throw new Error("Endpoint requires privileged user.");
    }

    const actions = await db.action.findMany({
      where: { status: "pending", completesAt: { lte: new Date() } },
      orderBy: { startedAt: "asc" },
    });

    for (const action of actions) {
      switch (getActionType(action)) {
        case tag.Travel: {
          await db.character.travel.complete({ action });
          break;
        }
        case tag.Rest: {
          await db.character.rest.complete({ action });
          break;
        }
        default:
          throw new Error(`Unknown action type (${action.id}).`);
      }
    }

    return NextResponse.json(actions);
  }
);
