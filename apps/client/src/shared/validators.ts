// shared/validators.ts — validaciones genéricas de formulario, para dar feedback
// inmediato en el navegador. El backend vuelve a validar todo esto (nunca hay que
// confiar solo en el frontend), pero esto evita un viaje de red para errores obvios.

const NAME_PATTERN = /^[\p{L}\p{N}\s-]+$/u;
const NAME_MAX_LENGTH = 60;

export function getNameError(value: string): string | null {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return "El nombre no puede estar vacío.";
  }
  if (trimmed.length > NAME_MAX_LENGTH) {
    return `El nombre no puede tener más de ${NAME_MAX_LENGTH} caracteres.`;
  }
  if (!NAME_PATTERN.test(trimmed)) {
    return "El nombre solo puede contener letras, números, espacios y guiones.";
  }

  return null;
}
