import { ProductWithComputedFields } from "../domain/product.entity";
import { ProductRepositoryPort } from "../ports/product-repository.port";
import { withComputedPrice } from "../domain/product.rules";

export class ListProductsUseCase {
    constructor(private readonly product: ProductRepositoryPort) { }

    async execute(): Promise<ProductWithComputedFields[]> {
        const products = await this.product.list();
        return products.map(withComputedPrice);
    }
}
