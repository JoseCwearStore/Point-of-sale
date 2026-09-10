// ports/ — el "contrato" que application/ necesita para guardar y consultar
// categorías, sin saber si por debajo hay Prisma, otro ORM, o memoria para tests.

import type { Category, CategoryToPersist, CategoryUpdate } from "../domain/category.entity";

export interface CategoryRepositoryPort {
    create(data: CategoryToPersist): Promise<Category>;
    update(id: string, data: CategoryUpdate): Promise<Category>;
    findBySlug(slug: string): Promise<Category | null>;
    findById(id: string): Promise<Category | null>;
    list(): Promise<Category[]>;
}

