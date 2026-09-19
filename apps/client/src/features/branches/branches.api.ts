import type { Branch, NewBranchInput, BranchUpdateInput } from "./branches.types";

const BASE_URL = "/api/branches";

export async function getBranches(): Promise<Branch[]> {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
        throw new Error("Error al obtener las sucursales");
    }
    return response.json();
}

export async function createBranch(input: NewBranchInput): Promise<Branch> {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message ?? "Error al crear la sucursal");
    }
    return response.json();
}

export async function updateBranch(id: string, input: BranchUpdateInput): Promise<Branch> {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message ?? "Error al actualizar la sucursal");
    }
    return response.json();
}

export async function deleteBranch(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message ?? "Error al eliminar la sucursal");
    }
}
