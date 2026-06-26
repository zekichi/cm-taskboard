import { z } from "zod";

const statusValues = ["pendiente", "en diseño", "aprobado", "publicado"];
const priorityValues = ["baja", "media", "alta"];
const platformValues = [
  "Instagram",
  "TikTok",
  "Facebook",
  "Twitter/X",
  "LinkedIn",
  "YouTube",
  "Pinterest",
  "Otra",
];

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(180),
  description: z.string().trim().max(1500).optional().nullable(),
  platform: z.enum(platformValues),
  status: z.enum(statusValues),
  due_date: z
    .string()
    .regex(dateRegex, "Formato de fecha invalido (YYYY-MM-DD)")
    .optional()
    .nullable(),
  priority: z.enum(priorityValues),
  organizationId: z.coerce.number().int().positive(),
  teamId: z.coerce.number().int().positive().optional().nullable(),
  assignedToId: z.coerce.number().int().positive().optional().nullable(),
});

export const updateTaskSchema = createTaskSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Debes enviar al menos un campo para actualizar",
  });
