// shared/errors.ts — errores propios de la aplicación. El controlador los usa
// para decidir qué código HTTP responder, en vez de adivinar con un Error genérico.

export class NotFoundError extends Error {

    constructor(entity: string, id: string) {
        super(`${entity} con id ${id} no encontrado`);
        this.name = "NotFoundError"
    }
}

export class ConflictError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ConflictError"
    }
}