// application/ — casos de uso.

import type { Category, CategoryUpdate } from "../domain/category.entity";
import type { CategoryRepositoryPort } from "../ports/category-repository.port";
import { slugify } from "../domain/category.rules";
import { NotFoundError, ConflictError } from "../../../shared/errors";
import { assertValidName } from "../../../shared/validators";

export class UpdateCategoryUseCase {
    constructor(private readonly categories: CategoryRepositoryPort) { }

    async execute(id: string, input: CategoryUpdate): Promise<Category> {
        const existing = await this.categories.findById(id);
        if (!existing) {
            throw new NotFoundError("Categoría", id);
        }

        if (input.name !== undefined) {
            assertValidName(input.name, "nombre de categoria");
        }

        const data: CategoryUpdate = { ...input };

        if (data.slug) {
            const slug = slugify(data.slug);
            const conflict = await this.categories.findBySlug(slug);
            if (conflict && conflict.id !== id) {
                throw new ConflictError(`Ya existe una categoria con el slug "${slug}".`);
            }
            data.slug = slug;
        }

        return this.categories.update(id, data);
    }
}
