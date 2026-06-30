import { z } from "zod";

export const noteSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters"),

  content: z
    .string()
    .min(10, "Content must be at least 10 characters"),

  category: z
    .string()
    .min(1, "Category is required"),

  status: z.enum(["Active", "Archived"]),

  isPinned: z.boolean(),

  tags: z.array(z.string()).default([]),
});