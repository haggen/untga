import { z } from "zod";

/**
 * Parse form fields using a schema.
 */
export function parse<T extends z.ZodObject<z.ZodRawShape>>(
  form: FormData,
  schema: T
) {
  const fields = schema.safeParse(
    Object.fromEntries(
      Object.keys(schema.shape).map((key) => [key, form.get(key)])
    )
  );

  if (fields.error) {
    return {
      error: fields.error,
    };
  }

  return { data: fields.data as z.infer<T> };
}
