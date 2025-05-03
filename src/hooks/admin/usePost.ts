import apiSijac from "@/api/sijac";
import useAuthStore from "@/store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

// Interfaz para la creación de un post
interface FormData {
  title: string;
  body: string;
  categories: string;
  image: FileList; // En la creación, la imagen siempre se espera
}

// Interfaz para la actualización de un post (imagen opcional)
interface UpdateFormData {
  title: string;
  body: string;
  categories: string;
  image?: FileList; // La imagen es opcional para la actualización
}



const postData = async (formData: FormData) => {
  const token = useAuthStore.getState().token;
  const dataToSend = new FormData();

  dataToSend.append("title", formData.title);
  dataToSend.append("body", formData.body);
  dataToSend.append("categories", formData.categories);
  dataToSend.append("image", formData.image[0]);

  const response = await apiSijac.post("/blog/create", dataToSend, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const updateData = async ({
  blog_id,
  formData,
}: {
  blog_id: string;
  formData: UpdateFormData;
}) => {
  const token = useAuthStore.getState().token;
  const dataToSend = new FormData();

  // Añadir los datos del formulario
  dataToSend.append("title", formData.title);
  dataToSend.append("body", formData.body);
  dataToSend.append("categories", formData.categories);

  // Solo añadir la imagen si existe
  if (formData.image && formData.image.length > 0) {
    dataToSend.append("image", formData.image[0]);
  }

  // Hacer la solicitud PATCH
  const response = await apiSijac.put(`/blog/update/${blog_id}`, dataToSend, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const deletePost = async (blog_id: string) => {
  const token = useAuthStore.getState().token;
  const response = await apiSijac.delete(`/blog/delete/${blog_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export function usePost() {
  const [createStatus, setCreateStatus] = useState<"idle" | "success" | "error">("idle");
  const [editStatus, setEditStatus] = useState<"idle" | "success" | "error">("idle");
  const [deleteStatus, setDeleteStatus] = useState<"idle" | "success" | "error">("idle");

  const queryClient = useQueryClient();
  const refetchPost = () => {
    queryClient.invalidateQueries({ queryKey: ["blogs"] });
  };

  const { mutate: createPost, isPending: isPosting } = useMutation({
    mutationFn: postData,
    onSuccess: () => setCreateStatus("success"),
    onError: () => setCreateStatus("error"),
  });

  const { mutate: editPost, isPending: isEditing } = useMutation({
    mutationFn: updateData,
    onSuccess: () => {
      refetchPost();
      alert("Post Editado con Exito");
      setEditStatus("success");
    },
    onError: () => {
      alert("Ocurrió un error contacte al administrador");
      setEditStatus("error");
    },
  });

  const { mutate: removePost, isPending: isDeleting } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      refetchPost();
      setDeleteStatus("success");
      alert("Post Borrado con Exito");
    },
    onError: () => {
      setDeleteStatus("error");
      alert("Ocurrió un error contacte al administrador");
    },
  });

  // Función para resetear los estados
  const resetStatuses = () => {
    setCreateStatus("idle");
    setEditStatus("idle");
    setDeleteStatus("idle");
  };

  return {
    createPost,
    editPost,
    removePost,
    createStatus,
    editStatus,
    deleteStatus,
    isPosting,
    isEditing,
    isDeleting,
    resetStatuses, // Exportar la función para resetear los estados
  };
}
