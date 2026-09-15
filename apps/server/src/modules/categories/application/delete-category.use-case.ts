import type { Category } from "../domain/category.entity";
import { ConflictError, NotFoundError } from "../../../shared/errors";
import { CategoryRepositoryPort } from "../ports/category-repository.port";

export class DeleteCategoryUseCase {
    constructor(private readonly categories: CategoryRepositoryPort) { }

    async execute(id: string): Promise<Category> {
        const existing = await this.categories.findById(id);
        if (!existing) throw new NotFoundError("Categoria", id);
        return this.categories.delete(id);
    }

}