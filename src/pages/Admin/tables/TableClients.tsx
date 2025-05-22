import apiSijac from "@/api/sijac";
import { useClientAll } from "@/hooks/admin/useClient/useClientAll";
import useAuthStore from "@/store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FiEdit2, FiCheck, FiX, FiSearch } from "react-icons/fi";

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  dni: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

interface EditableClientFields {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  id: string;
}

const editClient = async (form: EditableClientFields) => {
  const token = useAuthStore.getState().token;

  // Crear nuevo objeto sin el id para el body
  const { id, ...bodyData } = form;

  const { data } = await apiSijac.put(`/client/update/${id}`, bodyData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return data;
};

export const TableClients = () => {
  const { data: clients } = useClientAll();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<EditableClientFields>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    id: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: editClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients-all-admin"] });
      alert("Cliente actualizado con éxito");
    },
    onError: () => {
      alert("Error al actualizar el cliente");
    },
  });

  // Función para filtrar clientes
  const filteredClients = clients?.filter((client) => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    
    // Si el término es numérico, buscar por DNI
    if (/^\d+$/.test(term)) {
      return client.dni.includes(term);
    }
    
    // Si no es numérico, buscar en nombre y apellido
    return (
      client.first_name.toLowerCase().includes(term) ||
      client.last_name.toLowerCase().includes(term)
    );
  });

  const handleEditClick = (client: Client) => {
    setEditingId(client.id);
    setFormData({
      first_name: client.first_name,
      last_name: client.last_name,
      email: client.email,
      phone: client.phone,
      id: client.id,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleSave = (id: string) => {
    console.log("Guardando cambios para:", id, formData);
    mutate(formData);
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            placeholder="Buscar por nombre, apellido o DNI"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nombre
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Apellido
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                DNI
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Teléfono
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Fecha Registro
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClients?.length ? (
              filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  {editingId === client.id ? (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          className="text-sm border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          className="text-sm border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.dni}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="text-sm border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="text-sm border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(client.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleSave(client.id)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <FiCheck className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FiX className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {client.first_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.dni}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(client.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditClick(client)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  {searchTerm ? "No se encontraron clientes que coincidan con la búsqueda" : "No hay clientes disponibles"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};