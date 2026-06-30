import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { getAllNotes } from "../services/notesService";
import SidebarLayout from "../components/SidebarLayout";
import { FiFileText, FiArchive, FiArrowRight, FiPlus } from "react-icons/fi";
import { BsPinAngleFill } from "react-icons/bs";

function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["all-notes-stats"],
    queryFn: () => getAllNotes({ limit: 200 }),
  });

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good morning";
    if (hr < 18) return "Good afternoon";
    return "Good evening";
  };

  const notes = data?.data || [];
  const totalNotes = notes.length;
  const pinnedNotes = notes.filter((n) => n.isPinned).length;
  const archivedNotes = notes.filter((n) => n.status === "Archived").length;
  const activeNotes = notes.filter((n) => n.status === "Active").length;

  const categoryCounts = {};
  notes.forEach((note) => {
    const cat = note.category || "General";
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const categoriesList = Object.entries(categoryCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalNotes > 0 ? Math.round((count / totalNotes) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const recentNotes = [...notes]
    .filter((n) => n.status === "Active")
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3);

  const stats = [
    { title: "Total Notes", value: isLoading ? "..." : totalNotes, icon: FiFileText },
    { title: "Pinned Notes", value: isLoading ? "..." : pinnedNotes, icon: BsPinAngleFill },
    { title: "Archived Notes", value: isLoading ? "..." : archivedNotes, icon: FiArchive },
  ];

  if (isError) {
    return (
      <SidebarLayout>
        <div className="flex h-[70vh] flex-col items-center justify-center border-2 border-(--color-border-danger-subtle) bg-(--color-danger-soft) p-6 text-center">
          <h2 className="text-xl font-bold text-(--color-fg-danger-strong)">Failed to load statistics</h2>
          <p className="mt-2 text-sm text-(--color-fg-danger)">{error.message || "An error occurred."}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 border-2 border-(--color-border-default) bg-(--color-danger) px-4 py-2 text-sm font-semibold text-white shadow-(--shadow-xs) hover:bg-(--color-danger-strong)"
          >
            Retry
          </button>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="border-2 border-(--color-border-default) bg-(--color-brand-softer) px-8 py-10 shadow-(--shadow-md)">
          <span className="inline-block border-2 border-(--color-border-default) bg-(--color-brand) px-3 py-1 text-xs font-semibold text-black">
            Live Workspace Active
          </span>
          <h1 className="mt-4 text-3xl text-(--color-heading) md:text-4xl">
            {getGreeting()}, {user?.name}!
          </h1>
          <p className="mt-2 max-w-xl text-sm text-(--color-body) md:text-base">
            Welcome back to your Smart Notes Workspace. You have{" "}
            <span className="font-semibold text-(--color-fg-brand-strong)">
              {isLoading ? "..." : activeNotes} active
            </span>{" "}
            notes waiting for you.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="flex items-center justify-between border-2 border-(--color-border-default) bg-(--color-neutral-primary-soft) p-6 shadow-(--shadow-md)"
              >
                <div>
                  <p className="text-xs font-semibold tracking-wide text-(--color-body) uppercase">{stat.title}</p>
                  {isLoading ? (
                    <div className="mt-2 h-9 w-16 animate-shimmer border-2 border-(--color-border-default)"></div>
                  ) : (
                    <h3 className="mt-2 text-3xl text-(--color-heading)">{stat.value}</h3>
                  )}
                </div>
                <div className="flex h-12 w-12 items-center justify-center border-2 border-(--color-border-default) bg-(--color-brand) text-black">
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Split */}
        <div className="grid gap-6 md:grid-cols-5">
          {/* Recent Notes */}
          <div className="border-2 border-(--color-border-default) bg-(--color-neutral-primary-soft) p-6 shadow-(--shadow-md) md:col-span-3">
            <div className="flex items-center justify-between border-b-2 border-(--color-border-default) pb-4">
              <h2 className="text-lg text-(--color-heading)">Recent Notes</h2>
              <Link
                to="/notes"
                className="flex items-center gap-1 text-xs font-semibold text-(--color-fg-brand) hover:underline"
              >
                View all <FiArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {isLoading ? (
              <div className="mt-6 space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-20 animate-shimmer border-2 border-(--color-border-default)"></div>
                ))}
              </div>
            ) : recentNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center border-2 border-(--color-border-default) bg-(--color-neutral-secondary-soft) text-(--color-body)">
                  <FiFileText className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-(--color-heading)">No notes found</h3>
                <p className="mt-1 text-xs text-(--color-body)">Create a note to fill up your dashboard!</p>
                <Link
                  to="/notes/new"
                  className="mt-4 inline-flex items-center gap-1.5 border-2 border-(--color-border-default) bg-(--color-brand) px-3.5 py-1.5 text-xs font-semibold text-black shadow-(--shadow-xs)"
                >
                  <FiPlus className="h-3.5 w-3.5" /> Create Note
                </Link>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {recentNotes.map((note) => (
                  <Link
                    key={note._id}
                    to={`/notes/${note._id}`}
                    className="block border-2 border-(--color-border-default) bg-(--color-neutral-secondary-soft) p-4 transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-(--shadow-sm)"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-(--color-heading)">{note.title}</h3>
                          {note.isPinned && <BsPinAngleFill className="h-3 w-3 shrink-0 text-(--color-fg-warning)" />}
                        </div>
                        <p className="mt-1.5 line-clamp-1 text-xs text-(--color-body)">{note.content}</p>
                      </div>
                      <span className="shrink-0 border-2 border-(--color-border-default) bg-(--color-brand-softer) px-2 py-0.5 text-[10px] font-semibold text-(--color-fg-brand-strong)">
                        {note.category || "General"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Category Distribution */}
          <div className="border-2 border-(--color-border-default) bg-(--color-neutral-primary-soft) p-6 shadow-(--shadow-md) md:col-span-2">
            <h2 className="border-b-2 border-(--color-border-default) pb-4 text-lg text-(--color-heading)">
              Category Distribution
            </h2>

            {isLoading ? (
              <div className="mt-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 w-1/3 animate-shimmer"></div>
                    <div className="h-2 w-full animate-shimmer"></div>
                  </div>
                ))}
              </div>
            ) : categoriesList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="text-xs text-(--color-body)">
                  Categories will display once you start sorting notes.
                </span>
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                {categoriesList.map((cat) => (
                  <div key={cat.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-(--color-heading)">{cat.name}</span>
                      <span className="text-(--color-body)">
                        {cat.count} {cat.count === 1 ? "note" : "notes"} ({cat.percentage}%)
                      </span>
                    </div>
                    <div className="h-3 w-full border-2 border-(--color-border-default) bg-(--color-neutral-secondary-soft)">
                      <div
                        className="h-full bg-(--color-brand) transition-all duration-500"
                        style={{ width: `${cat.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}

export default Dashboard;