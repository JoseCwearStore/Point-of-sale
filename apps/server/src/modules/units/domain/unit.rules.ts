// domain/ — reglas de negocio propias de una unidad de medida.

import { ValidationError } from "../../../shared/errors";

// Solo letras y números, sin símbolos ni espacios (ej: "kg", "pza", "lt").
const ABBREVIATION_PATTERN = /^[\p{L}\p{N}]+$/u;
const ABBREVIATION_MAX_LENGTH = 4;

export function assertValidAbbreviation(value: string): void {
    const trimmed = value.trim();

    if (trimmed.length === 0) {
        throw new ValidationError("El campo 'abreviacion' no puede estar vacío.");
    }

    if (trimmed.length > ABBREVIATION_MAX_LENGTH) {
        throw new ValidationError(`El campo 'abreviacion' no puede tener más de ${ABBREVIATION_MAX_LENGTH} caracteres.`);
    }

    if (!ABBREVIATION_PATTERN.test(trimmed)) {
        throw new ValidationError("El campo 'abreviacion' solo puede contener letras y números, sin símbolos.");
    }
}
