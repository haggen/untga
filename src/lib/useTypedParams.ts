import { useParams } from "next/navigation";
import z, { ZodRawShape } from "zod";

export function useTypedParams<T extends ZodRawShape>(shape: T) {
  const params = useParams();
  return z.object(shape).parse(params);
}
