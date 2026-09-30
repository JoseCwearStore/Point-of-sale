import { NotFoundError } from "../../../shared/errors";
import { ProductUpdate, ProductWithComputedFields } from "../domain/product.entity";
import { ProductRepositoryPort } from "../ports/product-repository.port";
import { assertValidName, assertValidPrice } from "../../../shared/validators";
import { withComputedPrice } from "../domain/product.rules";

export class UpdateProductUseCase {
    constructor(private readonly product: ProductRepositoryPort) { }

    async execute(id: string, input: ProductUpdate): Promise<ProductWithComputedFields> {
        const existing = await this.product.findById(id);
        if (!existing) throw new NotFoundError('Producto', id);

        // Update parcial: solo se valida lo que de verdad vino en el payload.
        if (input.name !== undefined) assertValidName(input.name, "nombre del producto");
        if (input.priceWithoutTax !== undefined) assertValidPrice(input.priceWithoutTax);

        // El precio con IVA se calcula del producto YA actualizado, no del
        // input parcial (que puede no traer priceWithoutTax/hasTax en este payload).
        const product = await this.product.update(id, input);
        return withComputedPrice(product);
    }
}
