import { z } from "zod/v4";
import { isIndexable } from "~/lib/is-indexable";

function squish(value: string) {
  return value.replaceAll(/\s+/g, " ").trim();
}

/**
 * Common validation schemas.
 */
export const schemas = {
  id: z.coerce.number().positive(),
  name: z.string().max(24).transform(squish),
  email: z.email(),
  password: z.string().min(12).transform(squish),
  description: z.string().max(256).transform(squish),
};

/**
 * Parse some payload using a given schema.
 */
export function parse<Shape extends z.ZodRawShape>(
  payload: unknown,
  shape: Shape
) {
  return z
    .object(shape)
    .parse(
      Object.fromEntries(
        Object.keys(shape).map((key) => [
          key,
          payload instanceof FormData
            ? payload.get(key) ?? undefined
            : payload instanceof URLSearchParams
            ? payload.get(key) ?? undefined
            : isIndexable(payload, key)
            ? payload[key]
            : undefined,
        ])
      )
    );
}
