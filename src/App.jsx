import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import CreateNote from "./pages/CreateNote";
import EditNote from "./pages/EditNote";
import NoteDetails from "./pages/NoteDetails";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import { getMe } from "./services/authService";
import { setCredentials, logout } from "./redux/authSlice";

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const initSession = async () => {
      if (token) {
        try {
          const response = await getMe();
          dispatch(setCredentials({ user: response.user, token }));
        } catch (err) {
          console.error("Token verification failed, logging out:", err);
          dispatch(logout());
        }
      }
      setIsInitializing(false);
    };

    initSession();
  }, [token, dispatch]);

  if (isInitializing && token) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-(--color-neutral-secondary-soft)">
        <div className="h-16 w-16 border-2 border-(--color-border-default) bg-(--color-brand) shadow-(--shadow-md)"></div>
        <h2 className="mt-6 text-xl text-(--color-heading)">Smart Notes Workspace</h2>
        <p className="mt-2 text-sm text-(--color-body)">Syncing secure workspace session...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notes"
        element={
          <ProtectedRoute>
            <Notes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notes/new"
        element={
          <ProtectedRoute>
            <CreateNote />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notes/:id"
        element={
          <ProtectedRoute>
            <NoteDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notes/:id/edit"
        element={
          <ProtectedRoute>
            <EditNote />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;