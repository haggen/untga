import { z } from "zod";

/**
 * Common validation schema.
 */
export const schemas = {
  id: z.coerce.number().positive(),
  name: z.string().trim(),
  email: z.string().trim().email(),
  password: z.string().trim().min(12),
};

/**
 * Parse payload using a schema.
 */
export function parse<Shape extends z.ZodRawShape>(
  payload: FormData | URLSearchParams | Record<string, unknown>,
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
            : payload[key],
        ])
      )
    );
}
