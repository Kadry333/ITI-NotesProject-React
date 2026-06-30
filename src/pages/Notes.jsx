import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import toast from "react-hot-toast";
import SidebarLayout from "../components/SidebarLayout";
import { getAllNotes, updateNote, deleteNote } from "../services/notesService";
import {
  FiArchive,
  FiTrash2,
  FiEdit3,
  FiEye,
  FiSearch,
  FiX,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiFileText,
} from "react-icons/fi";
import { BsPinAngle, BsPinAngleFill } from "react-icons/bs";

function Notes() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("-createdAt");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [targetDeleteNote, setTargetDeleteNote] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [category, status, sort, limit]);

  const { data: statsData } = useQuery({
    queryKey: ["all-notes-stats"],
    queryFn: () => getAllNotes({ limit: 1000 }),
  });

  const categories = [
    "All",
    ...new Set(
      (statsData?.data || [])
        .map((n) => n.category || "General")
        .filter((cat) => cat && cat.trim() !== "")
    ),
  ];

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", { search: debouncedSearch, category, status, sort, page, limit }],
    queryFn: () =>
      getAllNotes({
        search: debouncedSearch || undefined,
        category: category !== "All" ? category : undefined,
        status: status !== "All" ? status : undefined,
        sort,
        page,
        limit,
      }),
  });

  const toggleUpdateMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["all-notes-stats"] });
      toast.success(res.message || "Note updated");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Something went wrong"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["all-notes-stats"] });
      toast.success("Note deleted successfully");
      setTargetDeleteNote(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to delete note"),
  });

  const handleTogglePin = (note) =>
    toggleUpdateMutation.mutate({ id: note._id, note: { isPinned: !note.isPinned } });

  const handleToggleArchive = (note) =>
    toggleUpdateMutation.mutate({
      id: note._id,
      note: { status: note.status === "Active" ? "Archived" : "Active" },
    });

  const confirmDelete = () => {
    if (targetDeleteNote) deleteMutation.mutate(targetDeleteNote._id);
  };

  const formatTimestamp = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const currentNotes = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const pinnedList = currentNotes.filter((n) => n.isPinned);
  const unpinnedList = currentNotes.filter((n) => !n.isPinned);

  const NoteCard = ({ note }) => (
    <div className="flex flex-col justify-between border-2 border-(--color-border-default) bg-(--color-neutral-primary-soft) p-5 shadow-(--shadow-md) transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-(--shadow-lg)">
      <div>
        <div className="flex items-center justify-between gap-4">
          <span className="border-2 border-(--color-border-default) bg-(--color-brand-softer) px-2.5 py-0.5 text-xs font-semibold text-(--color-fg-brand-strong)">
            {note.category || "General"}
          </span>
          <button
            onClick={() => handleTogglePin(note)}
            className={`border-2 border-(--color-border-default) p-1.5 transition-colors ${
              note.isPinned ? "bg-(--color-warning-soft) text-(--color-fg-warning)" : "bg-(--color-neutral-secondary-soft) text-(--color-body) hover:bg-(--color-neutral-tertiary-soft)"
            }`}
            title={note.isPinned ? "Unpin Note" : "Pin Note"}
          >
            {note.isPinned ? <BsPinAngleFill className="h-4 w-4" /> : <BsPinAngle className="h-4 w-4" />}
          </button>
        </div>

        <Link to={`/notes/${note._id}`} className="mt-4 block">
          <h3 className="line-clamp-1 text-base font-bold text-(--color-heading)">{note.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-(--color-body)">{note.content}</p>
        </Link>

        {note.tags && note.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {note.tags.map((tag) => (
              <span key={tag} className="border-2 border-(--color-border-default) bg-(--color-neutral-secondary-soft) px-2 py-0.5 text-[10px] font-medium text-(--color-body)">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between border-t-2 border-(--color-border-default) pt-3.5">
        <span className="text-[11px] font-medium text-(--color-body)">{formatTimestamp(note.updatedAt)}</span>
        <div className="flex items-center gap-1">
          <Link to={`/notes/${note._id}`} className="border-2 border-transparent p-1.5 text-(--color-body) hover:border-(--color-border-default) hover:bg-(--color-neutral-secondary-soft)" title="View Details">
            <FiEye className="h-4 w-4" />
          </Link>
          <Link to={`/notes/${note._id}/edit`} className="border-2 border-transparent p-1.5 text-(--color-body) hover:border-(--color-border-default) hover:bg-(--color-neutral-secondary-soft)" title="Edit Note">
            <FiEdit3 className="h-4 w-4" />
          </Link>
          <button
            onClick={() => handleToggleArchive(note)}
            className={`border-2 border-transparent p-1.5 transition-colors ${
              note.status === "Archived" ? "bg-(--color-success-soft) text-(--color-fg-success-strong)" : "text-(--color-body) hover:border-(--color-border-default) hover:bg-(--color-neutral-secondary-soft)"
            }`}
            title={note.status === "Archived" ? "Restore Note" : "Archive Note"}
          >
            <FiArchive className="h-4 w-4" />
          </button>
          <button
            onClick={() => setTargetDeleteNote(note)}
            className="border-2 border-transparent p-1.5 text-(--color-fg-danger) hover:border-(--color-border-default) hover:bg-(--color-danger-soft)"
            title="Delete Note"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <SidebarLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl text-(--color-heading) md:text-3xl">My Notes</h1>
            <p className="mt-1 text-sm text-(--color-body)">Create, read, and manage your notes space.</p>
          </div>
          <Link
            to="/notes/new"
            className="inline-flex items-center justify-center gap-2 border-2 border-(--color-border-default) bg-(--color-brand) px-4 py-2.5 text-sm font-semibold text-black shadow-(--shadow-sm) transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-(--shadow-md)"
          >
            <FiPlus className="h-4 w-4" /> Create Note
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 border-2 border-(--color-border-default) bg-(--color-neutral-primary-soft) p-5 shadow-(--shadow-md)">
          <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
            <div className="relative w-full lg:max-w-md">
              <FiSearch className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-(--color-body)" />
              <input
                type="text"
                placeholder="Search note titles or content..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border-2 border-(--color-border-default) bg-(--color-neutral-secondary-soft) py-2.5 pr-10 pl-10 text-sm outline-none transition-all focus:border-(--color-border-brand)"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute top-1/2 right-3 -translate-y-1/2 text-(--color-body) hover:text-(--color-heading)">
                  <FiX className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex w-full items-center gap-1 border-2 border-(--color-border-default) p-1 lg:w-auto">
              {["All", "Active", "Archived"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`flex-1 px-3.5 py-1.5 text-xs font-semibold transition-all lg:flex-none ${
                    status === s ? "bg-(--color-brand) text-black" : "text-(--color-body) hover:bg-(--color-neutral-secondary-soft)"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t-2 border-(--color-border-default) pt-4 md:flex-row md:items-center">
            <span className="flex shrink-0 items-center gap-1.5 text-xs font-bold tracking-wide text-(--color-body) uppercase">
              <FiFilter className="h-3.5 w-3.5" /> Categories:
            </span>
            <div className="flex flex-1 items-center gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`border-2 border-(--color-border-default) px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                    category === cat ? "bg-(--color-brand) text-black" : "bg-(--color-neutral-secondary-soft) text-(--color-body) hover:bg-(--color-neutral-tertiary-soft)"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-(--color-border-default) pt-4 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="text-(--color-body)">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="cursor-pointer border-2 border-(--color-border-default) bg-(--color-neutral-secondary-soft) px-3 py-1.5 outline-none focus:border-(--color-border-brand)"
              >
                <option value="-createdAt">Newest First</option>
                <option value="createdAt">Oldest First</option>
                <option value="title">Title (A-Z)</option>
                <option value="-title">Title (Z-A)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-(--color-body)">Results per page:</span>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="cursor-pointer border-2 border-(--color-border-default) bg-(--color-neutral-secondary-soft) px-3 py-1.5 outline-none focus:border-(--color-border-brand)"
              >
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={18}>18</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notes */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-56 animate-shimmer border-2 border-(--color-border-default) p-5"></div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center border-2 border-(--color-border-danger-subtle) bg-(--color-danger-soft) px-4 py-16 text-center">
            <h2 className="text-lg font-bold text-(--color-fg-danger-strong)">Error Loading Notes</h2>
            <p className="mt-1.5 text-sm text-(--color-body)">{error.message}</p>
          </div>
        ) : currentNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-(--color-border-default) px-4 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center border-2 border-(--color-border-default) bg-(--color-neutral-secondary-soft) text-(--color-body)">
              <FiFileText className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-(--color-heading)">No notes here</h3>
            <p className="mt-2 max-w-sm text-sm text-(--color-body)">
              We couldn't find any notes matching your selection. Try adjusting your filter tags, search text, or click below to create a new one.
            </p>
            <Link
              to="/notes/new"
              className="mt-6 inline-flex items-center gap-1.5 border-2 border-(--color-border-default) bg-(--color-brand) px-4 py-2.5 text-sm font-semibold text-black shadow-(--shadow-sm)"
            >
              <FiPlus className="h-4 w-4" /> Create first note
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {pinnedList.length > 0 && (
              <div className="space-y-4">
                <h2 className="flex items-center gap-2 text-xs font-bold tracking-wider text-(--color-fg-warning) uppercase">
                  <BsPinAngleFill className="h-3.5 w-3.5" /> Pinned Notes
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {pinnedList.map((note) => (
                    <NoteCard key={note._id} note={note} />
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {pinnedList.length > 0 && unpinnedList.length > 0 && (
                <h2 className="text-xs font-bold tracking-wider text-(--color-body) uppercase">Recent Notes</h2>
              )}
              {unpinnedList.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {unpinnedList.map((note) => (
                    <NoteCard key={note._id} note={note} />
                  ))}
                </div>
              ) : (
                pinnedList.length === 0 && <p className="text-sm text-(--color-body)">No other notes found.</p>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t-2 border-(--color-border-default) pt-6">
                <span className="text-xs font-semibold text-(--color-body)">
                  Page {page} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="flex h-10 w-10 items-center justify-center border-2 border-(--color-border-default) bg-(--color-neutral-primary-soft) text-(--color-heading) shadow-(--shadow-xs) transition-all hover:bg-(--color-neutral-secondary-soft) disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FiChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="flex h-10 w-10 items-center justify-center border-2 border-(--color-border-default) bg-(--color-neutral-primary-soft) text-(--color-heading) shadow-(--shadow-xs) transition-all hover:bg-(--color-neutral-secondary-soft) disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FiChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {targetDeleteNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog">
          <div className="w-full max-w-md border-2 border-(--color-border-default) bg-(--color-neutral-primary-soft) p-6 shadow-(--shadow-xl)">
            <h3 className="text-lg text-(--color-heading)">Delete Note?</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-(--color-body)">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-(--color-heading)">"{targetDeleteNote.title}"</span>? This action is permanent and cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setTargetDeleteNote(null)}
                className="border-2 border-(--color-border-default) bg-(--color-neutral-primary-soft) px-4.5 py-2.5 text-sm font-semibold text-(--color-heading) shadow-(--shadow-xs) hover:bg-(--color-neutral-secondary-soft)"
              >
                Cancel
              </button>
              <button
                disabled={deleteMutation.isPending}
                onClick={confirmDelete}
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

export default Notes;