// domain/ — reglas de negocio propias de una sucursal.

import { ValidationError } from "../../../shared/errors";

// "+" opcional al inicio, seguido de exactamente 10 dígitos. Nada de espacios,
// guiones ni paréntesis.
const PHONE_PATTERN = /^\+?\d{10}$/;

export function assertValidPhone(value: string): void {
    const trimmed = value.trim();

    if (!PHONE_PATTERN.test(trimmed)) {
        throw new ValidationError("El campo 'phone' debe tener 10 dígitos, con un '+' opcional al inicio.");
    }
}
