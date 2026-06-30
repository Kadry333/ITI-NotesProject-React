import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";

import SidebarLayout from "../components/SidebarLayout";
import NoteForm from "../components/NoteForm";
import { noteSchema } from "../validations/noteSchema";
import { getNote, updateNote } from "../services/notesService";

function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      tags: [],
      status: "Active",
      isPinned: false,
    },
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => getNote(id),
  });

  useEffect(() => {
    if (data?.data) {
      reset({
        title: data.data.title,
        content: data.data.content,
        category: data.data.category,
        status: data.data.status,
        isPinned: data.data.isPinned,
        tags: data.data.tags || [],
      });
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      toast.success("Note updated successfully");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note", id] });
      queryClient.invalidateQueries({ queryKey: ["all-notes-stats"] });
      navigate("/notes");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Something went wrong"),
  });

  const onSubmit = (formData) => mutation.mutate({ id, note: formData });

  if (isLoading) {
    return (
      <SidebarLayout>
        <div className="space-y-6">
          <div className="h-6 w-24 animate-shimmer"></div>
          <div className="space-y-6 border-2 border-(--color-border-default) bg-(--color-neutral-primary-soft) p-8">
            <div className="h-10 w-2/3 animate-shimmer"></div>
            <hr className="border-(--color-border-default)" />
            <div className="space-y-3">
              <div className="h-4 w-full animate-shimmer"></div>
              <div className="h-4 w-5/6 animate-shimmer"></div>
            </div>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (isError) {
    return (
      <SidebarLayout>
        <div className="flex h-[75vh] flex-col items-center justify-center border-2 border-(--color-border-default) px-4 py-16 text-center">
          <h2 className="text-lg font-bold text-(--color-heading)">Failed to Load Note</h2>
          <p className="mt-1.5 text-sm text-(--color-body)">{error.message}</p>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl text-(--color-heading) md:text-3xl">Edit Note</h1>
          <p className="mt-1 text-sm text-(--color-body)">Modify the content and metadata of your note.</p>
        </div>

        <div className="border-2 border-(--color-border-default) bg-(--color-neutral-primary-soft) p-6 shadow-(--shadow-md) md:p-8">
          <NoteForm
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            errors={errors}
            isSubmitting={isSubmitting || mutation.isPending}
            buttonText={mutation.isPending ? "Updating..." : "Update Note"}
            setValue={setValue}
            watch={watch}
          />
        </div>
      </div>
    </SidebarLayout>
  );
}

export default EditNote;