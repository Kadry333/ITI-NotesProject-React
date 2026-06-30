# Smart Notes Frontend

React client for the Smart Notes Workspace project, built with Vite, Redux Toolkit, TanStack Query, and Tailwind CSS v4.


## Installation

Clone the repository:

```bash
git clone ITI-NotesProject-React
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

> Make sure the backend server is running first. Update the port if needed.

Start the development server:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build locally
```

---

## Project Structure

```
src
├── components
│   ├── NoteForm.jsx
│   ├── SidebarLayout.jsx
│   ├── ProtectedRoute.jsx
│   └── PublicRoute.jsx
├── pages
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Notes.jsx
│   ├── CreateNote.jsx
│   ├── EditNote.jsx
│   └── NoteDetails.jsx
├── redux
│   ├── store.js
│   ├── authSlice.js
│   └── themeSlice.js
├── services
│   ├── authService.js
│   ├── notesService.js
│   └── axios.js

├── validations
│   ├── loginSchema.js
│   ├── registerSchema.js
│   └── noteSchema.js
├── App.jsx
├── main.jsx
└── index.css
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |

