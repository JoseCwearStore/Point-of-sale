import type { Product, ProductWithComputedFields } from "./product.entity";

const TAX_RATE = 0.16;

export function computePriceWithTax(priceWithoutTax: number, hasTax: boolean): number {
    return hasTax ? priceWithoutTax * (1 + TAX_RATE) : priceWithoutTax;
}

// Helper para no repetir el mismo spread en cada use-case: toma un producto
// ya persistido y le agrega el precio con IVA calculado, sin tocar la base.
export function withComputedPrice(product: Product): ProductWithComputedFields {
    return {
        ...product,
        priceWithTax: computePriceWithTax(product.priceWithoutTax, product.hasTax),
    };
}
