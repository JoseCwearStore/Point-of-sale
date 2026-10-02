export interface Product {
    id: string;
    name: string;
    categoryId: string;
    unitId: string;
    hasTax: boolean;
    priceWithoutTax: number;
    imageUrl: string | null;
    stock: number;
    createdAt: Date;
}

// El precio con IVA nunca se guarda: se calcula al vuelo (ver product.rules.ts)
// y solo se agrega a lo que la API devuelve, igual que el slug de Category.
export type ProductWithComputedFields = Product & { priceWithTax: number };

export type NewProduct = Pick<Product, "name" | "categoryId" | "unitId" | "hasTax" | "priceWithoutTax" | "stock"> &
    Partial<Pick<Product, "imageUrl">>;

export type ProductUpdate = Partial<Pick<Product, "name" | "categoryId" | "unitId" | "hasTax" | "priceWithoutTax" | "imageUrl" | "stock">>;
