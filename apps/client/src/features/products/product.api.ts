import type { NewProductInput, Product, ProductUpdateInput } from "./product.types"

const BASE_URL = "/api/products";

export async function getProducts(): Promise<Product[]> {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
        throw new Error("Error al obtener los productos");
    }
    return response.json();
}

export async function createProduct(input: NewProductInput): Promise<Product> {
    const response = await fetch(`${BASE_URL}/`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error ?? "Error al crear el producto");
    }

    return response.json();
}

export async function updateProduct(id: string, input: ProductUpdateInput): Promise<Product> {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error ?? "Error al actualizar el Producto");
    }
    return response.json();
}

export async function deleteProduct(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error ?? "Error al eliminar el producto");
    }
}