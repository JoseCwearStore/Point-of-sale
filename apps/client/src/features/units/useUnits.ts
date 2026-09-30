import { useState } from "react";
import { useDeleteUnitMutation, useUnitMutation, useUnitsQuery, useUpdateUnitMutation } from "./units.queries"
import { getNameError } from "../../shared/validators";

// Regla propia de Unit: solo letras y números, sin símbolos, máximo 4 caracteres
// (ej: "kg", "pza", "lt"). Es específica de este módulo, por eso vive aquí y no
// en shared/validators.ts.
function getAbbreviationError(value: string): string | null {
    const trimmed = value.trim();

    if (trimmed.length === 0) {
        return "La abreviación no puede estar vacía.";
    }
    if (trimmed.length > 4) {
        return "La abreviación no puede tener más de 4 caracteres.";
    }
    if (!/^[\p{L}\p{N}]+$/u.test(trimmed)) {
        return "La abreviación solo puede contener letras y números, sin símbolos.";
    }

    return null;
}

export const useUnits = () => {
    const { data: units, isLoading, error } = useUnitsQuery();
    const createMutation = useUnitMutation();
    const updateMutation = useUpdateUnitMutation();
    const deleteMutation = useDeleteUnitMutation();

    const [name, setName] = useState<string>("");
    const [abbreviation, setAbbreviation] = useState<string>("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState<string>("");
    const [editAbbreviation, setEditAbbreviation] = useState<string>("");
    const [formError, setFormError] = useState<string | null>(null);

    function handleCreate(e: React.FormEvent) {
        e.preventDefault();

        const error = getNameError(name) ?? getAbbreviationError(abbreviation);
        if (error) {
            setFormError(error);
            return;
        }
        setFormError(null);

        createMutation.mutate(
            { name, abbreviation },
            {
                onSuccess: () => {
                    setName("")
                    setAbbreviation("")
                },
            },
        );
    }

    function handleDelete(id: string) {
        deleteMutation.mutate({ id });
    }

    function startEdit(unit: { id: string; name: string, abbreviation: string }) {
        setEditingId(unit.id);
        setEditName(unit.name);
        setEditAbbreviation(unit.abbreviation);
    }

    function cancelEdit() {
        setEditingId(null);
        setEditName("");
        setEditAbbreviation("");
        setFormError(null);
    }

    function handleUpdate(id: string) {
        const error = getNameError(editName) ?? getAbbreviationError(editAbbreviation);
        if (error) {
            setFormError(error);
            return;
        }
        setFormError(null);

        updateMutation.mutate(
            { id, input: { name: editName, abbreviation: editAbbreviation } },
            {
                onSuccess: () => setEditingId(null),
            },
        );
    }

    return {
        units,
        isLoading,
        error,
        editingId,
        formError,
        createMutation,
        updateMutation,
        deleteMutation,
        name,
        abbreviation,
        editName,
        editAbbreviation,
        setEditName,
        setEditAbbreviation,
        setName,
        setAbbreviation,
        handleCreate,
        handleDelete,
        handleUpdate,
        startEdit,
        cancelEdit
    }
}
