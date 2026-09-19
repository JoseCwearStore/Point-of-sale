import { useBranches } from "./useBranches";

export function BranchesPage() {
  const {
    isLoading,
    error,
    branches,
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
  } = useBranches();

  if (isLoading) return <p>Cargando sucursales...</p>;
  if (error) return <p>Error al cargar las sucursales.</p>;

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-4 text-2xl font-bold text-slate-800">Sucursales</h1>

      <form onSubmit={handleCreate} className="mb-6 flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre de la sucursal"
          className="flex-1 rounded border border-slate-300 px-3 py-2"
        />
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Dirección"
          className="flex-1 rounded border border-slate-300 px-3 py-2"
        />
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Teléfono"
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
        {branches?.map((branch) =>
          editingId === branch.id ? (
            <li
              key={branch.id}
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
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                className="flex-1 rounded border border-slate-300 px-2 py-1"
              />
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="flex-1 rounded border border-slate-300 px-2 py-1"
              />
              <button
                onClick={() => handleUpdate(branch.id)}
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
              key={branch.id}
              className="flex items-center justify-between rounded border border-slate-200 px-3 py-2"
            >
              <div className="flex gap-3">
                <span>{branch.name}</span>
                <span className="text-slate-400">{branch.address}</span>
                <span className="text-slate-400">{branch.phone}</span>
              </div>
              <div className="flex gap-3">
                <button onClick={() => startEdit(branch)} className="text-blue-600">
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(branch.id)}
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
