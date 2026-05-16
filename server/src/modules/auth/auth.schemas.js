import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido").max(120),
  password: z.string().min(6, "Password inválido").max(128),
});
