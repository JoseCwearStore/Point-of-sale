// application/ — casos de uso.
import type { Category } from "../domain/category.entity"
import type { CategoryRepositoryPort } from "../ports/category-repository.port"

export class ListCategoriesUseCase {
    constructor(private readonly categories: CategoryRepositoryPort) { }

    async execute(): Promise<Category[]> {
        return this.categories.list();
    }
}