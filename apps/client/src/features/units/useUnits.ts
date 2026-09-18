import { useState } from "react";
import { useDeleteUnitMutation, useUnitMutation, useUnitsQuery, useUpdateUnitMutation } from "./units.queries"

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

    function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim() || !abbreviation.trim()) return;

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
    }

    function handleUpdate(id: string) {
        if (!editName.trim() || !editAbbreviation.trim()) return;

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