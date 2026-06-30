import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import SidebarLayout from "../components/SidebarLayout";
import NoteForm from "../components/NoteForm";
import { noteSchema } from "../validations/noteSchema";
import { createNote } from "../services/notesService";

function CreateNote() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "General",
      status: "Active",
      isPinned: false,
      tags: [],
    },
  });

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      toast.success("Note created successfully");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["all-notes-stats"] });
      navigate("/notes");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Something went wrong"),
  });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl text-(--color-heading) md:text-3xl">Create Note</h1>
          <p className="mt-1 text-sm text-(--color-body)">Add a new note to your smart notes workspace.</p>
        </div>

        <div className="border-2 border-(--color-border-default) bg-(--color-neutral-primary-soft) p-6 shadow-(--shadow-md) md:p-8">
          <NoteForm
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            errors={errors}
            isSubmitting={isSubmitting || mutation.isPending}
            buttonText={mutation.isPending ? "Creating..." : "Create Note"}
            setValue={setValue}
            watch={watch}
          />
        </div>
      </div>
    </SidebarLayout>
  );
}

export default CreateNote;