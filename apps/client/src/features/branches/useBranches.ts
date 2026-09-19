import { useState } from "react";
import {
    useBranchMutation,
    useBranchesQuery,
    useDeleteBranchMutation,
    useUpdateBranchMutation,
} from "./branches.queries";

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

    function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim() || !address.trim() || !phone.trim()) return;

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
    }

    function handleUpdate(id: string) {
        if (!editName.trim() || !editAddress.trim() || !editPhone.trim()) return;

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
