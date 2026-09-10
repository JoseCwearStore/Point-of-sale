// application/ — casos de uso. Orquestan domain + ports, nunca hablan
// directamente con Express ni con Prisma.

import type { Category, NewCategory } from "../domain/category.entity"
import { slugify } from "../domain/category.rules"
import type { CategoryRepositoryPort } from "../ports/category-repository.port"
import { ConflictError } from "../../../shared/errors";

export class CreateCategoryUseCase {
    constructor(private readonly categories: CategoryRepositoryPort) { }

    async execute(input: NewCategory): Promise<Category> {

        const slug = input.slug?.trim() ? slugify(input.slug) : slugify(input.name);

        const existing = await this.categories.findBySlug(slug);
        if (existing) {
            throw new ConflictError(`Ya existe una categoria con el slug "${slug}".`);
        }

        return this.categories.create({ ...input, slug })
    }
}