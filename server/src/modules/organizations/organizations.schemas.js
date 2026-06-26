import { z } from "zod";

import { ROLES, SPECIALTIES } from "../../lib/access-control.js";

export const organizationSchema = z.object({
  name: z.string().trim().min(2).max(120),
});

export const organizationMemberSchema = z.object({
  email: z.string().email().max(160),
  name: z.string().trim().min(2).max(120).optional(),
  role: z.enum(ROLES).default("MEMBER"),
  specialty: z.enum(SPECIALTIES).optional().nullable(),
});

export const updateOrganizationMemberSchema = z
  .object({
    role: z.enum(ROLES).optional(),
    specialty: z.enum(SPECIALTIES).optional().nullable(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "Debes enviar al menos un campo para actualizar",
  });
