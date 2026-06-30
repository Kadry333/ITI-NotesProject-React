import { useState } from "react";
import { Link } from "react-router";
import { FiX, FiTag, FiFolder, FiCheck } from "react-icons/fi";

const suggestedCategories = ["Work", "Personal", "Ideas", "Shopping", "Finance", "Study"];

function NoteForm({ register, handleSubmit, onSubmit, errors, isSubmitting, buttonText, setValue, watch }) {
  const currentTags = watch("tags") || [];
  const [tagInput, setTagInput] = useState("");
  const currentCategory = watch("category");
  const contentVal = watch("content") || "";

  const handleAddTag = (e) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      const cleaned = tagInput.trim().replace(/,/g, "");
      if (cleaned && !currentTags.includes(cleaned)) {
        setValue("tags", [...currentTags, cleaned]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setValue("tags", currentTags.filter((t) => t !== tagToRemove));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-3">
      {/* Left: Title and Content */}
      <div className="space-y-6 md:col-span-2">
        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-semibold text-(--color-heading)">
            Note Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Give your note a title..."
            {...register("title")}
            className="w-full border-2 border-(--color-border-default) bg-(--color-neutral-primary-soft) px-4 py-3 text-lg font-bold text-(--color-heading) shadow-(--shadow-xs) outline-none transition-all placeholder:text-(--color-body) focus:border-(--color-border-brand) focus:shadow-(--shadow-sm)"
          />
          {errors.title && (
            <p className="mt-1.5 text-xs font-semibold text-(--color-fg-danger-strong)">{errors.title.message}</p>
          )}
        </div>

        <div className="relative">
          <label htmlFor="content" className="mb-2 block text-sm font-semibold text-(--color-heading)">
            Note Content (Markdown supported)
          </label>
          <textarea
            id="content"
            placeholder="Write your note content here. You can use markdown: # Header, **bold**, *italic*, - list, etc..."
            {...register("content")}
            className="h-80 w-full resize-none border-2 border-(--color-border-default) bg-(--color-neutral-primary-soft) px-4 py-3.5 text-sm leading-relaxed text-(--color-heading) shadow-(--shadow-xs) outline-none transition-all placeholder:text-(--color-body) focus:border-(--color-border-brand) focus:shadow-(--shadow-sm)"
          />
          <div className="absolute right-3.5 bottom-3.5 text-[11px] font-semibold text-(--color-body)">
            {contentVal.length} / Min. 10 chars
          </div>
          {errors.content && (
            <p className="mt-1.5 text-xs font-semibold text-(--color-fg-danger-strong)">{errors.content.message}</p>
          )}
        </div>
      </div>

      {/* Right: Parameters */}
      <div className="space-y-6">
        <div className="space-y-5 border-2 border-(--color-border-default) bg-(--color-neutral-primary-soft) p-5 shadow-(--shadow-md)">
          {/* Category */}
          <div>
            <label htmlFor="category" className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-(--color-heading)">
              <FiFolder className="h-4 w-4" />
              Category
            </label>
            <input
              id="category"
              type="text"
              placeholder="e.g. General, Personal..."
              {...register("category")}
              className="w-full border-2 border-(--color-border-default) bg-(--color-neutral-secondary-soft) px-3.5 py-2.5 text-sm outline-none transition-all focus:border-(--color-border-brand)"
            />
            {errors.category && (
              <p className="mt-1.5 text-xs font-semibold text-(--color-fg-danger-strong)">{errors.category.message}</p>
            )}

            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {suggestedCategories.map((cat) => {
                const isSelected = currentCategory === cat;
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setValue("category", cat)}
                    className={`inline-flex items-center gap-1 border-2 px-2 py-0.5 text-[11px] font-semibold transition-all ${
                      isSelected
                        ? "border-(--color-border-default) bg-(--color-brand) text-black"
                        : "border-(--color-border-default) bg-(--color-neutral-secondary-soft) text-(--color-body) hover:bg-(--color-neutral-tertiary-soft)"
                    }`}
                  >
                    {isSelected && <FiCheck className="h-3 w-3" />}
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tagInput" className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-(--color-heading)">
              <FiTag className="h-4 w-4" />
              Tags
            </label>
            <input
              id="tagInput"
              type="text"
              placeholder="Type tag & press enter/space..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full border-2 border-(--color-border-default) bg-(--color-neutral-secondary-soft) px-3.5 py-2.5 text-sm outline-none transition-all focus:border-(--color-border-brand)"
            />

            {currentTags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {currentTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 border-2 border-(--color-border-default) bg-(--color-brand-softer) px-2 py-0.5 text-[11px] font-semibold text-(--color-fg-brand-strong)"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:opacity-60"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="mb-2 block text-sm font-semibold text-(--color-heading)">
              Status
            </label>
            <select
              id="status"
              {...register("status")}
              className="w-full cursor-pointer border-2 border-(--color-border-default) bg-(--color-neutral-secondary-soft) px-3.5 py-2.5 text-sm outline-none transition-all focus:border-(--color-border-brand)"
            >
              <option value="Active">Active</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          {/* Pin Toggle */}
          <div className="flex items-center justify-between py-1">
            <span htmlFor="isPinned" className="text-sm font-semibold text-(--color-heading)">
              Pin to Top
            </span>
            <label className="relative inline-flex cursor-pointer items-center">
              <input id="isPinned" type="checkbox" {...register("isPinned")} className="peer sr-only" />
              <div className="h-6 w-11 rounded-full border-2 border-(--color-border-default) bg-(--color-neutral-quaternary) transition-all after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:border-2 after:border-(--color-border-default) after:bg-white after:transition-all after:content-[''] peer-checked:bg-(--color-brand) peer-checked:after:translate-x-5"></div>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/notes"
            className="flex-1 border-2 border-(--color-border-default) bg-(--color-neutral-primary-soft) py-3 text-center text-sm font-semibold text-(--color-heading) shadow-(--shadow-xs) transition-all hover:bg-(--color-neutral-secondary-medium)"
          >
            Cancel
          </Link>
          <button
            disabled={isSubmitting}
            className="flex flex-1 items-center justify-center gap-2 border-2 border-(--color-border-default) bg-(--color-brand) py-3 text-sm font-semibold text-black shadow-(--shadow-sm) transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-(--shadow-md) active:translate-x-0.5 active:translate-y-0.5 active:shadow-(--shadow-2xs) disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-black/20 border-t-black"></div>
            ) : (
              buttonText
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

export default NoteForm;