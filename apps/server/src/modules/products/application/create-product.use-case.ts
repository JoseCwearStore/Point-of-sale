import { NewProduct, ProductWithComputedFields } from "../domain/product.entity";
import { ProductRepositoryPort } from "../ports/product-repository.port";
import { assertValidName, assertValidPrice } from "../../../shared/validators";
import { withComputedPrice } from "../domain/product.rules";

export class CreateProductUseCase {
    constructor(private readonly product: ProductRepositoryPort) { }

    async execute(input: NewProduct): Promise<ProductWithComputedFields> {
        // name y priceWithoutTax son obligatorios en NewProduct, se validan siempre.
        assertValidName(input.name, "nombre del producto");
        assertValidPrice(input.priceWithoutTax);

        const product = await this.product.create(input);
        return withComputedPrice(product);
    }
}
