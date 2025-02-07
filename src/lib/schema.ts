import { z } from "zod";

export const id = z.coerce.number().positive();

export const name = z.string().trim();

export const email = z.string().trim().email();

export const password = z.string().trim().min(12);
