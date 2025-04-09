// src/pages/Callback.tsx
import apiSijac from '@/api/sijac';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const postConfirmTurno = async (token: string) => {
  const { data } = await apiSijac.post(`appointment/confirm?token=${token}`);
  return data;
};

const CallbackTurno = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');

  const { mutate } = useMutation({
    mutationFn: postConfirmTurno,
    onSuccess: () => {
      setStatus('success');
      setTimeout(() => navigate('/'), 5000);
    },
    onError: () => {
      setStatus('error');
      setTimeout(() => navigate('/'), 5000);
    },
  });

  useEffect(() => {
    if (token) mutate(token);
  }, [token]);

  const renderContent = () => {
    switch (status) {
      case 'pending':
        return (
          <>
            <div className="h-4 w-4 mx-auto mb-4 animate-spin rounded-full border-4 border-prim-500 border-t-transparent"></div>
            <h1 className="text-2xl font-bold text-prim-700">Confirmando turno...</h1>
            <p className="mt-2 text-prim-500">Espere un momento</p>
          </>
        );
      case 'success':
        return (
          <>
            <h1 className="text-2xl font-bold text-prim-700">¡Turno confirmado!</h1>
            <p className="mt-2 text-prim-500">Será redirigido en unos segundos.</p>
          </>
        );
      case 'error':
        return (
          <>
            <h1 className="text-2xl font-bold text-red-600">Error al confirmar</h1>
            <p className="mt-2 text-gray-600">Intente más tarde. Será redirigido en unos segundos.</p>
          </>
        );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-prim-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center border border-prim-300">
        {renderContent()}
      </div>
    </div>
  );
};

export default CallbackTurno;
