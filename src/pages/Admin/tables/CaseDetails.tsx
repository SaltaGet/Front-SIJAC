import { Case } from "@/hooks/admin/useCase/useCaseAll";
import { useCaseDetails } from "@/hooks/admin/useCaseDetails";
import { useUser } from "@/hooks/client/useUser";
import useAuthStore from "@/store/useAuthStore";
import { useEffect } from "react";

interface CaseDetailsProps {
  caseItem: Case;
  isOpen: boolean;
  onClose: () => void;
}

export const CaseDetails = ({ caseItem, isOpen, onClose }: CaseDetailsProps) => {
  const { caseDetails, isLoading, error, refetchCaseDetails } = useCaseDetails(
    caseItem.id
  );

  const { userId } = useAuthStore();
  const { usersData } = useUser(); // Obtener todos los usuarios

  // Refetch data when modal opens
  useEffect(() => {
    if (isOpen) {
      refetchCaseDetails();
    }
  }, [isOpen, refetchCaseDetails]);

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

  // Función para verificar si un usuario está asignado al caso
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

              <div className="col-span-2">
                <h3 className="font-medium text-gray-700">Compartir:</h3>
                <div className="mt-2 space-y-2">
                  {usersData?.filter(user => user.id !== userId).map((user) => (
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
                      <span className="text-lg font-bold">
                        {isUserAssigned(user.id) ? (
                          <span className="text-green-500">✓</span>
                        ) : (
                          <span className="text-red-500">✗</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};