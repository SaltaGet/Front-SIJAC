import apiSijac from "@/api/sijac";
import { useCaseAll } from "@/hooks/admin/useCase/useCaseAll";
import useAuthStore from "@/store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  FiEdit2,
  FiCheck,
  FiX,
  FiSearch,
  FiTrash2,
  FiShare2,
} from "react-icons/fi";

interface Case {
  id: string;
  detail: string;
  state: string;
  client: {
    id: string;
    first_name: string;
    last_name: string;
  };
  created_at: string;
  updated_at: string;
}

interface EditableCaseFields {
  detail: string;
  state: string;
  id: string;
}

const updateCase = async (form: EditableCaseFields) => {
  const token = useAuthStore.getState().token;
  const { id, ...bodyData } = form;

  const { data } = await apiSijac.put(`/case/update/${id}`, bodyData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return data;
};

const deleteCase = async (id: string) => {
  const token = useAuthStore.getState().token;
  await apiSijac.delete(`/case/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const TableCases = () => {
  const { data: cases } = useCaseAll();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<EditableCaseFields>({
    detail: "",
    state: "",
    id: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const queryClient = useQueryClient();

  // Ajustar altura del textarea según contenido
  useEffect(() => {
    if (textareaRef.current && editingId) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [editingId, formData.detail]);

  const updateMutation = useMutation({
    mutationFn: updateCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases-all-admin"] });
      alert("Caso actualizado con éxito");
    },
    onError: () => {
      alert("Error al actualizar el caso");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases-all-admin"] });
      alert("Caso eliminado con éxito");
    },
    onError: () => {
      alert("Error al eliminar el caso");
    },
  });

  const filteredCases = cases?.filter((caseItem) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();

    return (
      caseItem.detail.toLowerCase().includes(term) ||
      caseItem.state.toLowerCase().includes(term) ||
      caseItem.client.first_name.toLowerCase().includes(term) ||
      caseItem.client.last_name.toLowerCase().includes(term)
    );
  });

  const handleEditClick = (caseItem: Case) => {
    setEditingId(caseItem.id);
    setFormData({
      detail: caseItem.detail,
      state: caseItem.state,
      id: caseItem.id,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleSave = () => {
    updateMutation.mutate(formData);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este caso?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleShare = (id: string) => {
    alert(`Función no implementada todavía: ${id}`);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Barra de búsqueda */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Buscar por detalle, estado o cliente"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Detalle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Creación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Última Actualización
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCases?.length ? (
              filteredCases.map((caseItem) => (
                <tr
                  key={caseItem.id}
                  className={`hover:bg-gray-50 ${
                    editingId === caseItem.id ? "bg-gray-50" : ""
                  }`}
                >
                  {editingId === caseItem.id ? (
                    <>
                      <td className="px-6 py-4">
                        <textarea
                          ref={textareaRef}
                          name="detail"
                          value={formData.detail}
                          onChange={handleChange}
                          className="text-sm border rounded px-2 py-1 w-full max-w-lg"
                          rows={1}
                          style={{ minHeight: "44px", resize: "none" }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="text-sm border rounded px-2 py-1 w-full"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="cancelado">Cancelado</option>
                          <option value="iniciado">Iniciado</option>
                          <option value="tramitado">Tramitado</option>
                          <option value="finalizado">Finalizado</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {caseItem.client.first_name} {caseItem.client.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(caseItem.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(caseItem.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleSave()}
                            className="text-green-600 hover:text-green-800"
                            title="Guardar"
                          >
                            <FiCheck className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-red-600 hover:text-red-800"
                            title="Cancelar"
                          >
                            <FiX className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 max-w-lg whitespace-pre-wrap">
                          {caseItem.detail}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            caseItem.state === "pendiente"
                              ? "bg-yellow-100 text-yellow-800"
                              : caseItem.state === "tramitado"
                              ? "bg-blue-100 text-blue-800"
                              : caseItem.state === "resuelto"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {caseItem.state}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {caseItem.client.first_name} {caseItem.client.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(caseItem.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(caseItem.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditClick(caseItem)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Editar"
                          >
                            <FiEdit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleShare(caseItem.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Compartir"
                          >
                            <FiShare2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(caseItem.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  {searchTerm
                    ? "No se encontraron casos que coincidan con la búsqueda"
                    : "No hay casos disponibles"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
