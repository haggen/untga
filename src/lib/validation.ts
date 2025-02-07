import { z } from "zod";

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
