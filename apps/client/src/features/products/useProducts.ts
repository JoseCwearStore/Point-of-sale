import { useState } from "react";
import {
    useProductsQuery,
    useProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} from "./product.queries";
import { useCategoriesQuery } from "../categories/categories.queries";
import { useUnitsQuery } from "../units/units.queries";
import { getNameError } from "../../shared/validators";

// Regla propia de Product: el precio debe ser un número válido mayor a 0.
// Es específica de este módulo, por eso vive aquí y no en shared/validators.ts.
function getPriceError(value: string): string | null {
    const trimmed = value.trim();
    const parsed = Number(trimmed);

    if (trimmed.length === 0 || isNaN(parsed)) {
        return "El precio debe ser un número válido.";
    }
    if (parsed <= 0) {
        return "El precio debe ser mayor a 0.";
    }

    return null;
}

// Un solo estado por formulario (en vez de un useState por campo), como
// hablamos: priceWithoutTax se guarda como texto mientras el usuario escribe,
// y se convierte a number justo al mandar la petición.
interface ProductFormState {
    name: string;
    categoryId: string;
    unitId: string;
    hasTax: boolean;
    priceWithoutTax: string;
    imageUrl: string;
}

const EMPTY_FORM: ProductFormState = {
    name: "",
    categoryId: "",
    unitId: "",
    hasTax: true,
    priceWithoutTax: "",
    imageUrl: "",
};

export function useProducts() {
    const { data: products, isLoading, error } = useProductsQuery();
    // Para pintar los <select> de categoría y unidad con opciones reales.
    const { data: categories } = useCategoriesQuery();
    const { data: units } = useUnitsQuery();

    const createMutation = useProductMutation();
    const updateMutation = useUpdateProductMutation();
    const deleteMutation = useDeleteProductMutation();

    const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<ProductFormState>(EMPTY_FORM);
    const [formError, setFormError] = useState<string | null>(null);

    // Actualizador genérico: reemplaza un solo campo del formulario sin
    // tocar los demás. Para checkboxes (hasTax) se le pasa e.target.checked;
    // para el resto, e.target.value.
    function updateField<K extends keyof ProductFormState>(field: K, value: ProductFormState[K]) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    function updateEditField<K extends keyof ProductFormState>(field: K, value: ProductFormState[K]) {
        setEditForm((prev) => ({ ...prev, [field]: value }));
    }

    // Misma validación para create y update, para no repetirla dos veces.
    function validate(data: ProductFormState): string | null {
        if (!data.categoryId) return "Debes seleccionar una categoría.";
        if (!data.unitId) return "Debes seleccionar una unidad.";
        return getNameError(data.name) ?? getPriceError(data.priceWithoutTax);
    }

    function handleCreate(e: React.FormEvent) {
        e.preventDefault();

        const error = validate(form);
        if (error) {
            setFormError(error);
            return;
        }
        setFormError(null);

        createMutation.mutate(
            {
                name: form.name,
                categoryId: form.categoryId,
                unitId: form.unitId,
                hasTax: form.hasTax,
                priceWithoutTax: Number(form.priceWithoutTax),
                imageUrl: form.imageUrl.trim() || undefined,
            },
            {
                onSuccess: () => setForm(EMPTY_FORM),
                onError: (error) => setFormError(error.message),
            },
        );
    }

    function handleDelete(id: string) {
        deleteMutation.mutate({ id });
    }

    function startEdit(product: {
        id: string;
        name: string;
        categoryId: string;
        unitId: string;
        hasTax: boolean;
        priceWithoutTax: number;
        imageUrl: string | null;
    }) {
        setEditingId(product.id);
        setEditForm({
            name: product.name,
            categoryId: product.categoryId,
            unitId: product.unitId,
            hasTax: product.hasTax,
            priceWithoutTax: String(product.priceWithoutTax),
            imageUrl: product.imageUrl ?? "",
        });
    }

    function cancelEdit() {
        setEditingId(null);
        setEditForm(EMPTY_FORM);
        setFormError(null);
    }

    function handleUpdate(id: string) {
        const error = validate(editForm);
        if (error) {
            setFormError(error);
            return;
        }
        setFormError(null);

        updateMutation.mutate(
            {
                id,
                input: {
                    name: editForm.name,
                    categoryId: editForm.categoryId,
                    unitId: editForm.unitId,
                    hasTax: editForm.hasTax,
                    priceWithoutTax: Number(editForm.priceWithoutTax),
                    imageUrl: editForm.imageUrl.trim() || undefined,
                },
            },
            {
                onSuccess: () => setEditingId(null),
                onError: (error) => setFormError(error.message),
            },
        );
    }

    return {
        products,
        categories,
        units,
        isLoading,
        error,
        editingId,
        formError,
        createMutation,
        updateMutation,
        deleteMutation,
        form,
        editForm,
        updateField,
        updateEditField,
        handleCreate,
        handleDelete,
        handleUpdate,
        startEdit,
        cancelEdit,
    };
}
