import type { Unit, NewUnitInput, UnitUpdateInput } from "./units.types"

const BASE_URL = "/api/units";

export async function getUnits(): Promise<Unit[]> {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
        throw new Error("Error al obtener las unidades");
    }
    return response.json();
}

export async function createUnit(input: NewUnitInput): Promise<Unit> {
    const response = await fetch(`${BASE_URL}/`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message ?? "Error al crear la unidad");
    }

    return response.json();
}

export async function updateUnit(id: string, input: UnitUpdateInput): Promise<Unit> {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message ?? "Error al actualizar la unidad");
    }
    return response.json();
}

export async function deleteUnit(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message ?? "Error al eliminar la unidad");
    }
}