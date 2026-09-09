// ports/ — el "contrato" que application/ necesita para guardar y consultar
// categorías, sin saber si por debajo hay Prisma, otro ORM, o memoria para tests.

import type { Category, CategoryToPersist } from "../domain/category.entity";

export interface CategoryRepositoryPort {
    create(data: CategoryToPersist): Promise<Category>;
    findBySlug(slug:string): Promise<Category | null>;
    list():Promise<Category[]>;
}

