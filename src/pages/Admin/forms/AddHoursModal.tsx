import { useState } from 'react';
import { Clock, User, Calendar, Loader2 } from 'lucide-react';
import { QueryFunctionContext, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiSijac from '@/api/sijac';
import useAuthStore from '@/store/useAuthStore';

interface AddHoursModalProps {
  roomPlanId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

interface Appointment {
  id: string;
  date_get: string;
  start_time: string;
  state: string;
  group_id: string;
}

interface RoomPlanDetails {
  id: string;
  first_name: string;
  last_name: string;
  tuition: string;
  available_hours: number;
  appointments: Appointment[];
}

const fetchDetails = async (ctx: QueryFunctionContext) => {
  const token = useAuthStore.getState().token;
  const [_, roomPlanId] = ctx.queryKey;
  void _;
  const { data } = await apiSijac.get(`/room_plan/get/${roomPlanId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

const addHours = async ({ roomPlanId, hours }: { roomPlanId: string; hours: number }) => {
  const token = useAuthStore.getState().token;
  const { data } = await apiSijac.put(
    `/room_plan/add_hours/${roomPlanId}`,
    { hours },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};


export const AddHoursModal = ({ roomPlanId, onClose, onSuccess }: AddHoursModalProps) => {
  const [hours, setHours] = useState<number>(1);
  
  const { data: details, isLoading } = useQuery<RoomPlanDetails>({
    queryKey: ['roomPlanDetails', roomPlanId],
    queryFn: fetchDetails,
    staleTime: Infinity,
  });

  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: addHours,
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ['roomPlanDetails', roomPlanId] });
      onClose();
    },
  });

  const handleConfirm = () => {
    mutate({ roomPlanId, hours });
  };

  if (isSuccess) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5" /> Agregar horas
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isPending}
          >
            ✕
          </button>
        </div>

        {/* Sección compacta de información */}
        <div className="mb-4 space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : details && (
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span>{details.first_name} {details.last_name}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Matrícula:</span>
                <span>{details.tuition}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>
                  {details.available_hours} hrs disp.
                  {hours > 0 && (
                    <span className="text-green-600 ml-1">+{hours}</span>
                  )}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{details.appointments.length} citas</span>
              </div>
            </div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1">
            Agregar Horas
          </label>
          <input
            type="number"
            id="hours"
            min="1"
            max="24"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            disabled={isPending}
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded border border-gray-300"
            disabled={isPending}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
            disabled={isPending || isLoading}
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};