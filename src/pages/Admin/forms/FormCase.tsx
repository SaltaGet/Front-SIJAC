import apiSijac from "@/api/sijac";
import useAuthStore from "@/store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Client, useClientAll } from "@/hooks/admin/useClient/useClientAll";

type FormData = {
  detail: string;
  state: "cancelado";
  client_id: string;
};

const postCase = async (form: FormData) => {
  const token = useAuthStore.getState().token;
  const { data } = await apiSijac.post("/case/create", form, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return data;
};

export default function FormCase() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Usamos el hook proporcionado para obtener todos los clientes
  const { data: allClients } = useClientAll();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: postCase,
    onSuccess: (res) => {
      console.log(res);
      reset();
      setSelectedClient(null);
      setSearchTerm("");
      queryClient.invalidateQueries({ queryKey: ["cases-all-admin"] });
      alert("Caso registrado con éxito");
    },
    onError: () => {
      alert("Error al registrar el caso");
    },
  });

  const onSubmit = (data: FormData) => mutate(data);

  // Filtramos clientes basados en el término de búsqueda
  const filteredClients = allClients?.filter(client => 
    client.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.dni.includes(searchTerm)
  ) || [];

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setValue("client_id", client.id);
    setShowDropdown(false);
    setSearchTerm(`${client.first_name} ${client.last_name} (${client.dni})`);
  };

  useEffect(() => {
    if (searchTerm.length === 0) {
      setSelectedClient(null);
      setValue("client_id", "");
    }
  }, [searchTerm, setValue]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Registrar Caso</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Campo de búsqueda de cliente */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-600 mb-1">Cliente*</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value.length > 0) setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder="Buscar por nombre, apellido o DNI"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {!selectedClient && errors.client_id && (
            <p className="mt-1 text-xs text-red-500">Debe seleccionar un cliente</p>
          )}
          
          {showDropdown && filteredClients.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                  onClick={() => handleClientSelect(client)}
                >
                  <div className="font-medium">{client.first_name} {client.last_name}</div>
                  <div className="text-sm text-gray-600">DNI: {client.dni}</div>
                </div>
              ))}
            </div>
          )}
          
          {showDropdown && filteredClients.length === 0 && searchTerm.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
              <div className="p-2 text-center text-gray-500">No se encontraron clientes</div>
            </div>
          )}
          
          <input
            type="hidden"
            {...register("client_id", { required: true })}
          />
        </div>

        {/* Campo de estado */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Estado*</label>
          <select
            {...register("state", { required: "Requerido" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="pendiente">Pendiente</option>
            <option value="cancelado">Cancelado</option>
            <option value="iniciado">Iniciado</option>
            <option value="tramitado">Tramitado</option>
            <option value="finalizado">Finalizado</option>

          </select>
          {errors.state && (
            <p className="mt-1 text-xs text-red-500">{errors.state.message}</p>
          )}
        </div>

        {/* Campo de detalle */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Detalle*</label>
          <textarea
            {...register("detail", { required: "Requerido" })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.detail && (
            <p className="mt-1 text-xs text-red-500">{errors.detail.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending || !selectedClient}
          className="w-full mt-6 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? "Registrando..." : "Registrar Caso"}
        </button>
      </form>
    </div>
  );
}