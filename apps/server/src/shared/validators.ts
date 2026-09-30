// shared/validators.ts — reglas de validación genéricas, reusables por cualquier
// módulo del dominio (Category, Unit, Branch, Product, etc). No dependen de Express
// ni de Prisma: son reglas de negocio puras, igual que domain/*.rules.ts de cada módulo.

import { ValidationError } from "./errors";

// Letras (con acentos y ñ), números, espacios y guion. Nada de "/", ",", "." etc.
const NAME_PATTERN = /^[\p{L}\p{N}\s-]+$/u;
const NAME_MAX_LENGTH = 60;

export function assertValidName(value: string, label: string): void {
    const trimmed = value.trim();

    if (trimmed.length === 0) {
        throw new ValidationError(`El campo '${label}' no puede estar vacío.`);
    }

    if (trimmed.length > NAME_MAX_LENGTH) {
        throw new ValidationError(`El campo '${label}' no puede tener más de ${NAME_MAX_LENGTH} caracteres.`);
    }

    if (!NAME_PATTERN.test(trimmed)) {
        throw new ValidationError(`El campo '${label}' solo puede contener letras, números, espacios y guiones.`);
    }
}

export function assertValidPrice(value: number): void {
    if (isNaN(value)) {
        throw new ValidationError("El precio debe ser un número válido.");
    }
    if (value <= 0) {
        throw new ValidationError("El precio debe ser mayor a 0.");
    }
}
