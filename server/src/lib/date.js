export function parseDateOnlyInput(value) {
  if (!value) {
    return null;
  }

  // Forzamos UTC para que "YYYY-MM-DD" no cambie por timezone del servidor.
  return new Date(`${value}T00:00:00.000Z`);
}

export function toDateOnlyString(value) {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  // El frontend necesita formato exacto de input date.
  return date.toISOString().slice(0, 10);
}
