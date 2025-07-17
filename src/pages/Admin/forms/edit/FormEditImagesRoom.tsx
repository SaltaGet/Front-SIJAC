import apiSijac from '@/api/sijac';
import useAuthStore from '@/store/useAuthStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';

interface FormEditImagesRoomProps {
  roomId: string;
  initialImages: string[];
  onClose: () => void;
  onSuccess?: () => void;
}

const putImages = async ({ roomId, images }: { roomId: string; images: File[] }) => {
  const token = useAuthStore.getState().token;
  const formData = new FormData();
  
  images.forEach((file) => {
    formData.append(`images`, file);
  });

  const { data } = await apiSijac.put(`/room/update_images/${roomId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

const FormEditImagesRoom: React.FC<FormEditImagesRoomProps> = ({
  roomId,
  onClose,
  onSuccess,
}) => {
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: putImages,
    onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['roomsAll'] });
      alert("Imágenes actualizadas con éxito");
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ['roomsAll'] });
      onClose();
    },
    onError: () => {
      alert("Ocurrió un error al actualizar las imágenes");
    }
  });

  const handleAddImages = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setSelectedFiles(newFiles); // Reemplazamos completamente las imágenes seleccionadas

    // Crear nuevas previsualizaciones (sin incluir las iniciales)
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
  };

  const removeImage = (index: number) => {
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);

    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const handleSubmit = () => {
    if (selectedFiles.length === 0) {
      alert("Por favor, selecciona al menos una imagen");
      return;
    }
    
    mutate({ roomId, images: selectedFiles });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Reemplazar imágenes</h3>
      <p className="text-sm text-gray-600">Las nuevas imágenes reemplazarán todas las existentes</p>
      
      <div className="grid grid-cols-3 gap-2">
        {imagePreviews.map((imageUrl, index) => (
          <div key={index} className="relative group">
            <img 
              src={imageUrl} 
              alt={`Nueva imagen ${index + 1}`} 
              className="w-full h-24 object-cover rounded"
            />
            <button
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeImage(index)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleAddImages}
          disabled={isPending}
        >
          Seleccionar imágenes
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
          accept="image/*"
        />
      </div>

      <div className="flex justify-end pt-4 gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          disabled={isPending}
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={isPending || selectedFiles.length === 0}
        >
          {isPending ? 'Guardando...' : 'Reemplazar imágenes'}
        </button>
      </div>
    </div>
  );
};

export default FormEditImagesRoom;