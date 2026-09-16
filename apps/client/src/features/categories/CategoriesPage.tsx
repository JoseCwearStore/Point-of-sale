import { useState } from "react";

import {
  useCategoriesQuery,
  useCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "./categories.queries";

export function CategoriesPage() {
  const { data: categories, isLoading, error } = useCategoriesQuery();
  const createMutation = useCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  const deleteMutation = useDeleteCategoryMutation();

  const [name, setName] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    createMutation.mutate(
      { name },
      {
        onSuccess: () => setName(""),
      },
    );
  }

  function handleDelete(id: string) {
    deleteMutation.mutate({ id });
  }

  function startEdit(category: { id: string; name: string }) {
    setEditingId(category.id);
    setEditName(category.name);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
  }

  function handleUpdate(id: string) {
    if (!editName.trim()) return;

    updateMutation.mutate(
      { id, input: { name: editName } },
      {
        onSuccess: () => setEditingId(null),
      },
    );
  }

  if (isLoading) return <p>Cargando categorias...</p>;
  if (error) return <p>Error al cargar las categorias.</p>;

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-4 text-2xl font-bold text-slate-800">Categorias</h1>
      <form onSubmit={handleCreate} className="mb-6 flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre de la categoria"
          className="flex-1 rounded border border-slate-300 px-3 py-2"
        />
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded bg-purple-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Agregar
        </button>
      </form>

      <ul className="space-y-2">
        {categories?.map((category) =>
          editingId === category.id ? (
            <li
              key={category.id}
              className="flex items-center gap-2 rounded border border-slate-200 px-3 py-2"
            >
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="flex-1 rounded border border-slate-300 px-2 py-1"
              />
              <button
                onClick={() => handleUpdate(category.id)}
                disabled={updateMutation.isPending}
                className="text-green-600 disabled:opacity-50"
              >
                Guardar
              </button>
              <button onClick={cancelEdit} className="text-slate-500">
                Cancelar
              </button>
            </li>
          ) : (
            <li
              key={category.id}
              className="flex items-center justify-between rounded border border-slate-200 px-3 py-2"
            >
              <span>{category.name}</span>
              <div className="flex gap-3">
                <button
                  onClick={() => startEdit(category)}
                  className="text-blue-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  disabled={deleteMutation.isPending}
                  className="text-red-600 disabled:opacity-50"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
