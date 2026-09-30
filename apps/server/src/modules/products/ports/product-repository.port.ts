import type { NewProduct, Product, ProductUpdate } from '../domain/product.entity'

export interface ProductRepositoryPort {
    create(input: NewProduct): Promise<Product>;
    update(id: string, input: ProductUpdate): Promise<Product>;
    findById(id: string): Promise<Product | null>;
    list(): Promise<Product[]>
    delete(id: string): Promise<Product>;
    existsByCategoryId(id: string): Promise<Product | null>;
    existsByUnitId(id: string): Promise<Product | null>;
}
