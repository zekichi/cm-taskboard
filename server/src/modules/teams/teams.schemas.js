import { z } from "zod";

import { ROLES, SPECIALTIES } from "../../lib/access-control.js";

export const createTeamSchema = z.object({
  name: z.string().trim().min(2).max(120),
  organizationId: z.coerce.number().int().positive(),
});

export const teamMemberSchema = z.object({
  userId: z.coerce.number().int().positive(),
  role: z.enum(ROLES).default("MEMBER"),
  specialty: z.enum(SPECIALTIES).optional().nullable(),
});

export const updateTeamMemberSchema = z
  .object({
    role: z.enum(ROLES).optional(),
    specialty: z.enum(SPECIALTIES).optional().nullable(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "Debes enviar al menos un campo para actualizar",
  });
