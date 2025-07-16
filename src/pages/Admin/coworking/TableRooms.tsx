import { useState } from 'react';
import { Edit2, Trash2, Calendar } from 'lucide-react';
import { Room, useGetAllRooms } from '@/hooks/room/useGetAllRooms';
import CreateAvailabilityRoom from './CreateAvailabilityRoom';
import useAuthStore from '@/store/useAuthStore';
import apiSijac from '@/api/sijac';
import { useMutation } from '@tanstack/react-query';
import { FormEditRoom } from '../forms/edit/FormEditRoom';

const deleteRoom = async (id: string) => {
  const token = useAuthStore.getState().token;
  await apiSijac.delete(`/room/delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const TableRooms = () => {
  const { rooms, isLoading, error, refetch } = useGetAllRooms();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const { mutate } = useMutation({
    mutationFn: deleteRoom,
    onMutate: (id) => {
      setDeletingIds(prev => new Set(prev).add(id));
    },
    onSuccess: () => {
      alert("Oficina eliminada con éxito");
      refetch();
    },
    onError: () => {
      alert("Error al eliminar la habitación");
    },
    // onSettled: (data, error, id) => {
    //   setDeletingIds(prev => {
    //     const newSet = new Set(prev);
    //     newSet.delete(id);
    //     return newSet;
    //   });
    // },
  });

  const handleEdit = (room: Room) => {
    setSelectedRoom(room);
    setShowEditModal(true);
  };

  const handleAssign = (room: Room) => {
    setSelectedRoom(room);
    setShowAssignModal(true);
  };

  const handleDelete = (room: Room) => {
    if (confirm(`¿Estás seguro de eliminar la habitación "${room.name}"?`)) {
      mutate(room.id);
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
          <p className="text-red-700">Error al cargar las habitaciones</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && rooms.length === 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p className="text-blue-700">No hay habitaciones registradas</p>
        </div>
      )}

      {/* Table with data */}
      {!isLoading && !error && rooms.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imágenes</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rooms.map((room) => {
                const isDeleting = deletingIds.has(room.id);
                return (
                  <tr 
                    key={room.id} 
                    className={`hover:bg-gray-50 ${isDeleting ? 'opacity-50' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{room.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        {room.type_room}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2 max-w-xs">
                        {room.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        ${room.price.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-1">
                        {room.url_image.slice(0, 3).map((image, index) => (
                          <div key={index} className="w-10 h-10 rounded overflow-hidden">
                            <img 
                              src={image} 
                              alt={`Imagen ${index + 1}`} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {room.url_image.length > 3 && (
                          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                            <span className="text-xs text-gray-500">+{room.url_image.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(room)}
                          className={`text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title="Editar habitación"
                          disabled={isDeleting}
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleAssign(room)}
                          className={`text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title="Asignar turnos"
                          disabled={isDeleting}
                        >
                          <Calendar className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => !isDeleting && handleDelete(room)}
                          className={`text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 flex items-center justify-center ${isDeleting ? 'cursor-not-allowed' : ''}`}
                          title="Eliminar habitación"
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-600" />
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

      {/* Modal de edición */}
      {showEditModal && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <FormEditRoom roomData={selectedRoom} roomId={selectedRoom.id} onClose={() => setShowEditModal(false)} />
          </div>
        </div>
      )}

      {/* Modal de asignación de turnos */}
      {showAssignModal && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <CreateAvailabilityRoom onCloseModal={() => setShowAssignModal(false)} roomId={selectedRoom.id} roomName={selectedRoom.name}/>
          </div>
        </div>
      )}
    </div>
  );
};