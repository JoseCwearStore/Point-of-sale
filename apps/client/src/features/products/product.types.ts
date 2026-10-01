export interface Product {
    id: string,
    name: string,
    categoryId: string,
    unitId: string,
    hasTax: boolean,
    priceWithoutTax: number,
    priceWithTax: number,
    imageUrl: string | null,
    createdAt: string
}

export type NewProductInput = Pick<Product, "name" | "categoryId" | "unitId" | "hasTax" | "priceWithoutTax"> &
    Partial<Pick<Product, "imageUrl">>;
export type ProductUpdateInput = Partial<Pick<Product, "name" | "categoryId" | "unitId" | "hasTax" | "priceWithoutTax" | "imageUrl">>;