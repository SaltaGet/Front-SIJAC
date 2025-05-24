import apiSijac from "@/api/sijac";
import { Case } from "@/hooks/admin/useCase/useCaseAll";
import { useCaseDetails } from "@/hooks/admin/useCaseDetails";
import { useUser } from "@/hooks/client/useUser";
import useAuthStore from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

interface CaseDetailsProps {
  caseItem: Case;
  isOpen: boolean;
  onClose: () => void;
}

const shareCase = async ({idCase, idUserShare}: {idCase: string, idUserShare: string}) => {
  const token = useAuthStore.getState().token;
  const {data} = await apiSijac.put(`/case/share_case/${idCase}?user_shared=${idUserShare}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
}

const unshareCase = async ({idCase, idUserShare}: {idCase: string, idUserShare: string}) => {
  const token = useAuthStore.getState().token;
  const {data} = await apiSijac.put(`/case/unshare_case/${idCase}?user_unshared=${idUserShare}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
}

export const CaseDetails = ({ caseItem, isOpen, onClose }: CaseDetailsProps) => {
  const { caseDetails, isLoading, error, refetchCaseDetails } = useCaseDetails(
    caseItem.id
  );

  const { userId } = useAuthStore();
  const { usersData } = useUser();

  const {mutate: shareMutate} = useMutation({
    mutationFn: shareCase,
    onSuccess: () => {
      refetchCaseDetails();
    },
    onError: () => {
      alert("Error al compartir el caso");
    }
  });

  const {mutate: unshareMutate} = useMutation({
    mutationFn: unshareCase,
    onSuccess: () => {
      refetchCaseDetails();
    },
    onError: () => {
      alert("Error al descompartir el caso");
    }
  });

useEffect(() => {
    console.log("entrando al effect con caseItem.id:", caseItem.id);
  if (isOpen) {
    refetchCaseDetails();
  }
}, [isOpen, caseItem.id, refetchCaseDetails]); // Añade caseItem.id como dependencia

  const handleShareToggle = (userId: string, isCurrentlyShared: boolean) => {
    if (isCurrentlyShared) {
      unshareMutate({idCase: caseItem.id, idUserShare: userId});
    } else {
      shareMutate({idCase: caseItem.id, idUserShare: userId});
    }
  };

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
          <p>Cargando detalles del caso...</p>
        </div>
      </div>
    );
  }

  if (error || !caseDetails) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        
        <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
          <p>Error al cargar los detalles del caso</p>
          <button
            onClick={() => refetchCaseDetails()}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const isUserAssigned = (userId: string) => {
    return caseDetails.users?.some(user => user.id === userId) || false;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Detalles del Caso
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Cerrar modal"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700">Detalle:</h3>
              <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                {caseDetails.detail}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-700">Estado:</h3>
                <span
                  className={`mt-1 inline-flex px-2 text-xs leading-5 font-semibold rounded-full 
                  ${
                    caseDetails.state === "pendiente"
                      ? "bg-yellow-100 text-yellow-800"
                      : caseDetails.state === "tramitado"
                      ? "bg-blue-100 text-blue-800"
                      : caseDetails.state === "resuelto"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {caseDetails.state}
                </span>
              </div>

              <div>
                <h3 className="font-medium text-gray-700">Cliente:</h3>
                <p className="mt-1 text-gray-900">
                  {caseDetails.client.first_name} {caseDetails.client.last_name}
                </p>
                <p className="text-sm text-gray-600">
                  {caseDetails.client.email}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-700">Fecha Creación:</h3>
                <p className="mt-1 text-gray-900">
                  {new Date(caseDetails.created_at).toLocaleDateString()}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-700">
                  Última Actualización:
                </h3>
                <p className="mt-1 text-gray-900">
                  {new Date(caseDetails.updated_at).toLocaleDateString()}
                </p>
              </div>

              {caseDetails.owner &&<div className="col-span-2">
                <h3 className="font-medium text-gray-700">Compartir:</h3>
                <div className="mt-2 space-y-2">
                  {usersData?.filter(user => user.id !== userId).map((user) => {
                    const isShared = isUserAssigned(user.id);
                    return (
                      <div
                        key={user.id}
                        className="flex items-center justify-between space-x-3 p-2 bg-gray-50 rounded"
                      >
                        <div className="flex items-center space-x-3">
                          <div>
                            <p className="font-medium">
                              {user.first_name} {user.last_name}
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isShared}
                            onChange={() => handleShareToggle(user.id, isShared)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};