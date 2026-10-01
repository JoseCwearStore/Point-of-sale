import { useProducts } from "./useProducts";

export function ProductsPage() {
  const {
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
  } = useProducts();

  if (isLoading) return <p>Cargando productos...</p>;
  if (error) return <p>Error al cargar los productos.</p>;

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-bold text-slate-800">Productos</h1>

      {formError && <p className="mb-2 text-sm text-red-600">{formError}</p>}

      <form onSubmit={handleCreate} className="mb-6 flex flex-wrap gap-2">
        <input
          type="text"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="Nombre del producto"
          className="flex-1 rounded border border-slate-300 px-3 py-2"
        />
        <select
          value={form.categoryId}
          onChange={(e) => updateField("categoryId", e.target.value)}
          className="rounded border border-slate-300 px-3 py-2"
        >
          <option value="">Categoría</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={form.unitId}
          onChange={(e) => updateField("unitId", e.target.value)}
          className="rounded border border-slate-300 px-3 py-2"
        >
          <option value="">Unidad</option>
          {units?.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={form.priceWithoutTax}
          onChange={(e) => updateField("priceWithoutTax", e.target.value)}
          placeholder="Precio sin IVA"
          className="w-32 rounded border border-slate-300 px-3 py-2"
        />
        <label className="flex items-center gap-2 px-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.hasTax}
            onChange={(e) => updateField("hasTax", e.target.checked)}
          />
          Aplica IVA
        </label>
        <input
          type="text"
          value={form.imageUrl}
          onChange={(e) => updateField("imageUrl", e.target.value)}
          placeholder="URL de la imagen (opcional)"
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
        {products?.map((product) =>
          editingId === product.id ? (
            <li
              key={product.id}
              className="flex flex-wrap items-center gap-2 rounded border border-slate-200 px-3 py-2"
            >
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => updateEditField("name", e.target.value)}
                className="flex-1 rounded border border-slate-300 px-2 py-1"
              />
              <select
                value={editForm.categoryId}
                onChange={(e) => updateEditField("categoryId", e.target.value)}
                className="rounded border border-slate-300 px-2 py-1"
              >
                <option value="">Categoría</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select
                value={editForm.unitId}
                onChange={(e) => updateEditField("unitId", e.target.value)}
                className="rounded border border-slate-300 px-2 py-1"
              >
                <option value="">Unidad</option>
                {units?.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={editForm.priceWithoutTax}
                onChange={(e) => updateEditField("priceWithoutTax", e.target.value)}
                className="w-28 rounded border border-slate-300 px-2 py-1"
              />
              <label className="flex items-center gap-2 px-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={editForm.hasTax}
                  onChange={(e) => updateEditField("hasTax", e.target.checked)}
                />
                IVA
              </label>
              <input
                type="text"
                value={editForm.imageUrl}
                onChange={(e) => updateEditField("imageUrl", e.target.value)}
                className="flex-1 rounded border border-slate-300 px-2 py-1"
              />
              <button
                onClick={() => handleUpdate(product.id)}
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
              key={product.id}
              className="flex items-center justify-between rounded border border-slate-200 px-3 py-2"
            >
              <div className="flex flex-wrap items-center gap-3">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-10 w-10 rounded object-cover"
                  />
                )}
                <span className="font-medium">{product.name}</span>
                <span className="text-slate-400">
                  {categories?.find((c) => c.id === product.categoryId)?.name ?? "—"}
                </span>
                <span className="text-slate-400">
                  {units?.find((u) => u.id === product.unitId)?.name ?? "—"}
                </span>
                <span className="text-slate-600">
                  ${product.priceWithTax.toFixed(2)}
                  {product.hasTax ? " (con IVA)" : ""}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => startEdit(product)}
                  className="text-blue-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
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
