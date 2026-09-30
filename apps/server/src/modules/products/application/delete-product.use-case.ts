import { NotFoundError } from "../../../shared/errors";
import { Product } from "../domain/product.entity";
import { ProductRepositoryPort } from "../ports/product-repository.port";


export class DeleteProductUseCase {
    constructor(private readonly product: ProductRepositoryPort) { }

    async execute(id: string): Promise<Product> {
        const existing = await this.product.findById(id);
        if (!existing) throw new NotFoundError("Producto", id);
        return this.product.delete(id);
    }
}