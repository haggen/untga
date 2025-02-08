import { z } from "zod";

/**
 * Common validation schema.
 */
export const schema = {
  id: z.coerce.number().positive(),
  name: z.string().trim(),
  email: z.string().trim().email(),
  password: z.string().trim().min(12),
};

/**
 * Parse form fields using a schema.
 */
export function parse<Shape extends z.ZodRawShape>(
  payload: FormData,
  shape: Shape
) {
  return z
    .object(shape)
    .parse(
      Object.fromEntries(
        Object.keys(shape).map((key) => [key, payload.get(key)])
      )
    );
}
