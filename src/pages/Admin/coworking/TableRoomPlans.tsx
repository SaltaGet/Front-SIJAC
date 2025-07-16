import { useState, useRef, useEffect } from 'react';
import { Clock, Trash2 } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';
import apiSijac from '@/api/sijac';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RoomPlan, useGetAllRoomPlans } from '@/hooks/roomPlan/useGetAllRoomPlans';
import { AddHoursModal } from '../forms/AddHoursModal';

const deleteRoomPlan = async (id: string) => {
  const token = useAuthStore.getState().token;
  await apiSijac.delete(`/room_plan/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const TableRoomPlans = () => {
  const { roomPlans, isLoading, error } = useGetAllRoomPlans();
  const [showAddHoursModal, setShowAddHoursModal] = useState(false);
  const [selectedRoomPlan, setSelectedRoomPlan] = useState<RoomPlan | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const modalRef = useRef<HTMLDivElement>(null);

  // Cerrar modales al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowAddHoursModal(false);
      }
    };

    if (showAddHoursModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAddHoursModal]);

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteRoomPlan,
    onMutate: (id) => {
      setDeletingIds(prev => new Set(prev).add(id));
    },
    onSuccess: () => {
      alert("Plan de habitación eliminado con éxito");
      queryClient.invalidateQueries({ queryKey: ["roomPlans"] });
    },
    onError: () => {
      alert("Error al eliminar el plan de habitación");
    },
  });

  const handleAddHours = (roomPlan: RoomPlan) => {
    setSelectedRoomPlan(roomPlan);
    setShowAddHoursModal(true);
  };

  const handleDelete = (roomPlan: RoomPlan) => {
    if (confirm(`¿Estás seguro de eliminar el plan de ${roomPlan.first_name} ${roomPlan.last_name}?`)) {
      mutate(roomPlan.id);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">Error al cargar los planes de habitación</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && roomPlans?.length === 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p className="text-blue-700">No hay planes de habitación registrados</p>
        </div>
      )}

      {/* Table with data */}
      {!isLoading && !error && roomPlans && roomPlans.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Horas Disponibles</th>
                
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roomPlans.map((roomPlan) => {
                const isDeleting = deletingIds.has(roomPlan.id);
                return (
                  <tr 
                    key={roomPlan.id} 
                    className={`hover:bg-gray-50 ${isDeleting ? 'opacity-50' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {roomPlan.first_name} {roomPlan.last_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{roomPlan.cellphone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 font-bold">{roomPlan.available_hours} Horas</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleAddHours(roomPlan)}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100"
                          title="Agregar horas"
                          disabled={isDeleting}
                        >
                          <Clock className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(roomPlan)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-gray-100"
                          title="Eliminar"
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-600" />
                          ) : (
                            <Trash2 className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de agregar horas */}
      {showAddHoursModal && selectedRoomPlan && (
        <AddHoursModal
          roomPlanId={selectedRoomPlan.id}
          onClose={() => setShowAddHoursModal(false)}
        />
      )}
    </div>
  );
};