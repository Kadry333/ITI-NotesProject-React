import api from "./axios";

export const getAllNotes = async (params) => {
  const response = await api.get("/notes", { params });
  return response.data;
};

export const getNote = async (id) => {
  const response = await api.get(`/notes/${id}`);
  return response.data;
};

export const createNote = async (note) => {
  const response = await api.post("/notes", note);
  return response.data;
};

export const updateNote = async ({ id, note }) => {
  const response = await api.patch(`/notes/${id}`, note);
  return response.data;
};

export const deleteNote = async (id) => {
  const response = await api.delete(`/notes/${id}`);
  return response.data;
};