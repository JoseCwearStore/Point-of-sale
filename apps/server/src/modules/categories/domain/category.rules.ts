// domain/ - reglas de negocio propias de una categoria, sin dependencia externas 

export function slugify (text:string): string {
    return text
    .trim()
    .toLowerCase()
    .normalize("NFD") //separa las letras de sus acentos (á -> a + ´)
    .replace(/[\u0300-\u036f]/g, "") // elimina esos acentos ya separados
    .replace(/[^a-z0-9]+/g, "-") // cualquier cosa que no sea letra o número -> guion
    .replace(/^-+|-+$/g, ""); // quita guiones sobrantes al inicio o al final
}