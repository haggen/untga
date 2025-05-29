import { expect, test } from "vitest";
import z from "zod/v4";
import { parse } from "./validation";

test("parse(FormData)", () => {
  const formData = new FormData();
  formData.append("value", "24");
  const data = parse(formData, {
    value: z.coerce.number().positive(),
  });
  expect(data).toEqual({
    value: 24,
  });
});

test("parse(URLSearchParams)", () => {
  const searchParams = new URLSearchParams();
  searchParams.append("value", "24");
  const data = parse(searchParams, {
    value: z.coerce.number().positive(),
  });
  expect(data).toEqual({
    value: 24,
  });
});

test("parse(object)", () => {
  const data = parse({ value: "24" }, { value: z.coerce.number().positive() });
  expect(data).toEqual({
    value: 24,
  });
});
