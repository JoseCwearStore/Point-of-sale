import type { Category } from "../domain/category.entity";
import { ConflictError, NotFoundError } from "../../../shared/errors";
import { CategoryRepositoryPort } from "../ports/category-repository.port";
import { ProductRepositoryPort } from "../../products/ports/product-repository.port";

export class DeleteCategoryUseCase {
    constructor(
        private readonly categories: CategoryRepositoryPort,
        private readonly product: ProductRepositoryPort
    ) { }

    async execute(id: string): Promise<Category> {
        const have = await this.product.existsByCategoryId(id);
        if (have) throw new ConflictError(`La categoria ${id} no se puede eliminar: Tiene productos relacionados`);
        const existing = await this.categories.findById(id);
        if (!existing) throw new NotFoundError("Categoria", id);
        return this.categories.delete(id);
    }

}