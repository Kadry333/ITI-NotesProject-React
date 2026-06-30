import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import SidebarLayout from "../components/SidebarLayout";
import { getNote, updateNote, deleteNote } from "../services/notesService";
import { FiArrowLeft, FiEdit3, FiTrash2, FiArchive, FiCalendar, FiTag } from "react-icons/fi";
import { BsPinAngle, BsPinAngleFill } from "react-icons/bs";

function parseMarkdown(text) {
  if (!text) return "";

  let escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  escaped = escaped.replace(/^### (.*?)$/gm, '<h4 class="text-sm font-bold text-(--color-heading) mt-4 mb-2">$1</h4>');
  escaped = escaped.replace(/^## (.*?)$/gm, '<h3 class="text-base font-bold text-(--color-heading) mt-5 mb-2">$1</h3>');
  escaped = escaped.replace(/^# (.*?)$/gm, '<h2 class="text-lg font-extrabold text-(--color-heading) mt-6 mb-3">$1</h2>');

  escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-(--color-heading)">$1</strong>');
  escaped = escaped.replace(/__(.*?)__/g, '<strong class="font-bold text-(--color-heading)">$1</strong>');

  escaped = escaped.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  escaped = escaped.replace(/_(.*?)_/g, '<em class="italic">$1</em>');

  escaped = escaped.replace(
    /^&gt; (.*?)$/gm,
    '<blockquote class="border-l-4 border-(--color-border-default) pl-4 py-1 italic my-4 text-(--color-body) bg-(--color-neutral-secondary-soft)">$1</blockquote>'
  );

  escaped = escaped.replace(
    /`(.*?)`/g,
    '<code class="bg-(--color-neutral-tertiary-soft) font-mono text-xs text-(--color-fg-brand-strong) px-1.5 py-0.5 border-2 border-(--color-border-default)">$1</code>'
  );

  escaped = escaped.replace(/^\s*[-*]\s+(.*?)$/gm, '<li class="list-disc ml-5 mb-1.5 text-(--color-body)">$1</li>');

  escaped = escaped.replace(
    /\[(.*?)\]\((.*?)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-(--color-fg-brand) font-semibold underline hover:no-underline">$1</a>'
  );

  const paragraphs = escaped.split(/\n\n+/);
  return paragraphs
    .map((p) => {
      const trimmed = p.trim();
      if (trimmed.startsWith("<h") || trimmed.startsWith("<li") || trimmed.startsWith("<blockquote")) {
        return p;
      }
      return `<p class="mb-4 leading-relaxed text-(--color-body) text-sm">${p.replace(/\n/g, "<br />")}</p>`;
    })
    .join("");
}

function formatTimestamp(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function NoteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => getNote(id),
  });

  const toggleUpdateMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["note", id] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success(res.message || "Note updated");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update note"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["all-notes-stats"] });
      toast.success("Note deleted successfully");
      navigate("/notes");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to delete note"),
  });

  const note = data?.data;

  const handleTogglePin = () => {
    if (!note) return;
    toggleUpdateMutation.mutate({ id: note._id, note: { isPinned: !note.isPinned } });
  };

  const handleToggleArchive = () => {
    if (!note) return;
    toggleUpdateMutation.mutate({
      id: note._id,
      note: { status: note.status === "Active" ? "Archived" : "Active" },
    });
  };

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

  if (isError || !note) {
    return (
      <SidebarLayout>
        <div className="flex h-[75vh] flex-col items-center justify-center border-2 border-(--color-border-default) px-4 py-16 text-center">
          <h2 className="text-lg font-bold text-(--color-heading)">Note Not Found</h2>
          <p className="mt-1.5 text-sm text-(--color-body)">{error?.message || "The requested note could not be retrieved."}</p>
          <Link
            to="/notes"
            className="mt-6 inline-flex items-center gap-1.5 border-2 border-(--color-border-default) bg-(--color-brand) px-4 py-2 text-sm font-semibold text-black shadow-(--shadow-sm)"
          >
            <FiArrowLeft className="h-4 w-4" /> Back to Notes
          </Link>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <Link to="/notes" className="inline-flex items-center gap-1.5 text-sm font-semibold text-(--color-body) hover:text-(--color-fg-brand)">
          <FiArrowLeft className="h-4 w-4" /> Back to Notes
        </Link>

        <article className="border-2 border-(--color-border-default) bg-(--color-neutral-primary-soft) p-6 shadow-(--shadow-md) md:p-8">
          <div className="flex flex-col gap-4 border-b-2 border-(--color-border-default) pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span className="border-2 border-(--color-border-default) bg-(--color-brand-softer) px-3.5 py-1 text-xs font-semibold text-(--color-fg-brand-strong)">
                {note.category || "General"}
              </span>
              <span
                className={`border-2 border-(--color-border-default) px-3 py-1 text-xs font-semibold ${
                  note.status === "Active"
                    ? "bg-(--color-success-soft) text-(--color-fg-success-strong)"
                    : "bg-(--color-neutral-secondary-soft) text-(--color-body)"
                }`}
              >
                {note.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleTogglePin}
                className={`border-2 border-(--color-border-default) p-2.5 transition-all ${
                  note.isPinned ? "bg-(--color-warning-soft) text-(--color-fg-warning)" : "text-(--color-body) hover:bg-(--color-neutral-secondary-soft)"
                }`}
                title={note.isPinned ? "Unpin Note" : "Pin Note"}
              >
                {note.isPinned ? <BsPinAngleFill className="h-4 w-4" /> : <BsPinAngle className="h-4 w-4" />}
              </button>

              <button
                onClick={handleToggleArchive}
                className={`border-2 border-(--color-border-default) p-2.5 transition-all ${
                  note.status === "Archived" ? "bg-(--color-success-soft) text-(--color-fg-success-strong)" : "text-(--color-body) hover:bg-(--color-neutral-secondary-soft)"
                }`}
                title={note.status === "Archived" ? "Unarchive Note" : "Archive Note"}
              >
                <FiArchive className="h-4 w-4" />
              </button>

              <Link
                to={`/notes/${note._id}/edit`}
                className="border-2 border-(--color-border-default) bg-(--color-neutral-primary-soft) p-2.5 text-(--color-heading) hover:bg-(--color-neutral-secondary-soft)"
                title="Edit Note"
              >
                <FiEdit3 className="h-4 w-4" />
              </Link>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="border-2 border-(--color-border-default) bg-(--color-danger-soft) p-2.5 text-(--color-fg-danger-strong) hover:bg-(--color-danger-medium)"
                title="Delete Note"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <h1 className="text-2xl text-(--color-heading) md:text-3xl">{note.title}</h1>

            <div className="flex flex-wrap items-center gap-4 pb-2 text-xs font-semibold text-(--color-body)">
              <span className="flex items-center gap-1.5">
                <FiCalendar className="h-3.5 w-3.5" /> Created: {formatTimestamp(note.createdAt)}
              </span>
              {note.createdAt !== note.updatedAt && (
                <span className="flex items-center gap-1.5 border-l-2 border-(--color-border-default) pl-4">
                  <FiCalendar className="h-3.5 w-3.5" /> Last modified: {formatTimestamp(note.updatedAt)}
                </span>
              )}
            </div>

            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 border-b-2 border-(--color-border-default) pb-4">
                <FiTag className="h-3.5 w-3.5 shrink-0 text-(--color-body)" />
                <div className="flex flex-wrap gap-1.5">
                  {note.tags.map((tag) => (
                    <span key={tag} className="border-2 border-(--color-border-default) bg-(--color-neutral-secondary-soft) px-2.5 py-0.5 text-xs font-semibold text-(--color-body)">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="max-w-none pt-4" dangerouslySetInnerHTML={{ __html: parseMarkdown(note.content) }} />
          </div>
        </article>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog">
          <div className="w-full max-w-md border-2 border-(--color-border-default) bg-(--color-neutral-primary-soft) p-6 shadow-(--shadow-xl)">
            <h3 className="text-lg text-(--color-heading)">Delete Note?</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-(--color-body)">
              Are you sure you want to delete <span className="font-semibold text-(--color-heading)">"{note.title}"</span>? This action is permanent and cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="border-2 border-(--color-border-default) bg-(--color-neutral-primary-soft) px-4.5 py-2.5 text-sm font-semibold text-(--color-heading) shadow-(--shadow-xs) hover:bg-(--color-neutral-secondary-soft)"
              >
                Cancel
              </button>
              <button
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(id)}
                className="flex items-center justify-center gap-1.5 border-2 border-(--color-border-default) bg-(--color-danger) px-4.5 py-2.5 text-sm font-semibold text-white shadow-(--shadow-xs) hover:bg-(--color-danger-strong)"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete Note"}
              </button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}

export default NoteDetails;