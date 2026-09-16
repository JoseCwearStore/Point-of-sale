import type { Category, CategoryUpdateInput, NewCategoryInput } from "./categories.types";

const BASE_URL = "/api/categories";

export async function getCategories(): Promise<Category[]> {
    const response = await fetch(BASE_URL);

    if (!response.ok) {
        throw new Error("Error al obtener las categorias");
    }

    return response.json();
}

export async function createCategory(input: NewCategoryInput): Promise<Category> {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message ?? "Error al crear la categoria");
    }

    return response.json();
}

export async function updateCategory(id: string, input: CategoryUpdateInput): Promise<Category> {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message ?? "Error al actualizar la categoria");
    }

    return response.json();
}

export async function deleteCategory(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message ?? "Error al eliminar la categoria");
    }
}