import { useState } from "react";
import {
    useBranchMutation,
    useBranchesQuery,
    useDeleteBranchMutation,
    useUpdateBranchMutation,
} from "./branches.queries";
import { getNameError } from "../../shared/validators";

// Regla propia de Branch: "+" opcional al inicio, seguido de exactamente 10
// dígitos. Es específica de este módulo, por eso vive aquí y no en
// shared/validators.ts.
function getPhoneError(value: string): string | null {
    const trimmed = value.trim();

    if (!/^\+?\d{10}$/.test(trimmed)) {
        return "El teléfono debe tener 10 dígitos, con un '+' opcional al inicio.";
    }

    return null;
}

export function useBranches() {
    const { data: branches, isLoading, error } = useBranchesQuery();
    const createMutation = useBranchMutation();
    const updateMutation = useUpdateBranchMutation();
    const deleteMutation = useDeleteBranchMutation();

    const [name, setName] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [phone, setPhone] = useState<string>("");

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState<string>("");
    const [editAddress, setEditAddress] = useState<string>("");
    const [editPhone, setEditPhone] = useState<string>("");
    const [formError, setFormError] = useState<string | null>(null);

    function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!address.trim()) {
            setFormError("La dirección no puede estar vacía.");
            return;
        }

        const error = getNameError(name) ?? getPhoneError(phone);
        if (error) {
            setFormError(error);
            return;
        }
        setFormError(null);

        createMutation.mutate(
            { name, address, phone },
            {
                onSuccess: () => {
                    setName("");
                    setAddress("");
                    setPhone("");
                },
            },
        );
    }

    function handleDelete(id: string) {
        deleteMutation.mutate({ id });
    }

    function startEdit(branch: { id: string; name: string; address: string; phone: string }) {
        setEditingId(branch.id);
        setEditName(branch.name);
        setEditAddress(branch.address);
        setEditPhone(branch.phone);
    }

    function cancelEdit() {
        setEditingId(null);
        setEditName("");
        setEditAddress("");
        setEditPhone("");
        setFormError(null);
    }

    function handleUpdate(id: string) {
        if (!editAddress.trim()) {
            setFormError("La dirección no puede estar vacía.");
            return;
        }

        const error = getNameError(editName) ?? getPhoneError(editPhone);
        if (error) {
            setFormError(error);
            return;
        }
        setFormError(null);

        updateMutation.mutate(
            { id, input: { name: editName, address: editAddress, phone: editPhone } },
            {
                onSuccess: () => setEditingId(null),
            },
        );
    }

    return {
        branches,
        isLoading,
        error,
        editingId,
        formError,
        createMutation,
        updateMutation,
        deleteMutation,
        name,
        address,
        phone,
        editName,
        editAddress,
        editPhone,
        setName,
        setAddress,
        setPhone,
        setEditName,
        setEditAddress,
        setEditPhone,
        handleCreate,
        handleDelete,
        handleUpdate,
        startEdit,
        cancelEdit,
    };
}
