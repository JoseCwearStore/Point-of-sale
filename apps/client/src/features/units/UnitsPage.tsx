import { useUnits } from "./useUnits";

export function UnitsPage() {
  const {
    isLoading,
    error,
    units,
    editingId,
    createMutation,
    deleteMutation,
    updateMutation,
    name,
    abbreviation,
    editName,
    editAbbreviation,
    setName,
    setEditName,
    setAbbreviation,
    setEditAbbreviation,
    handleCreate,
    handleDelete,
    handleUpdate,
    cancelEdit,
    startEdit,
  } = useUnits();

  if (isLoading) return <p>Cargando unidades...</p>;
  if (error) return <p>Error al cargar las unidades.</p>;

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-4 text-2xl font-bold text-slate-800">Unidades</h1>
      <form onSubmit={handleCreate} className="mb-6 flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre de la unidad"
          className="flex-1 rounded border border-slate-300 px-3 py-2"
        />
        <input
          type="text"
          value={abbreviation}
          onChange={(e) => setAbbreviation(e.target.value)}
          placeholder="Abreviacion de la unidad"
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
        {units?.map((unit) =>
          editingId === unit.id ? (
            <li
              key={unit.id}
              className="flex items-center gap-2 rounded border border-slate-200 px-3 py-2"
            >
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="flex-1 rounded border border-slate-300 px-2 py-1"
              />
              <input
                type="text"
                value={editAbbreviation}
                onChange={(e) => setEditAbbreviation(e.target.value)}
                className="flex-1 rounded border border-slate-300 px-2 py-1"
              />
              <button
                onClick={() => handleUpdate(unit.id)}
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
              key={unit.id}
              className="flex items-center justify-between rounded border border-slate-200 px-3 py-2"
            >
              <div className="flex gap-3">
                <span>{unit.name}</span>
                <span className="text-slate-400">{unit.abbreviation}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => startEdit(unit)}
                  className="text-blue-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(unit.id)}
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
