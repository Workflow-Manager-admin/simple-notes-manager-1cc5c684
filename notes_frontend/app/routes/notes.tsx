import { useState, useEffect } from "react";
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { getSupabaseServerClient } from "~/supabase.server";
import { getSupabaseClient } from "~/supabase.client";
import { TopBar } from "~/components/TopBar";
import { Sidebar } from "~/components/Sidebar";
import { NoteList } from "~/components/NoteList";
import { NoteEditor } from "~/components/NoteEditor";
import { NoteView } from "~/components/NoteView";
import { Modal } from "~/components/ui/Modal";
import type { Note, Category } from "~/types";
import { signOut } from "~/utils/auth";

// PUBLIC_INTERFACE
export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  const supabase = getSupabaseServerClient({ request, response });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login");

  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  // Extract unique categories
  const categories: Category[] = notes
    ? Array.from(
        new Set(notes.map((n) => n.category).filter(Boolean))
      ).map((cat) => ({ name: cat, displayName: cat }))
    : [];

  return json(
    {
      notes: notes ?? [],
      categories,
      user: { id: user.id, email: user.email },
    },
    { headers: response.headers }
  );
};

export default function NotesRoute() {
  const loaderData = useLoaderData<typeof loader>();
  const [notes, setNotes] = useState<Note[]>(loaderData.notes);
  const [selectedNoteId, setSelectedNoteId] = useState<string | undefined>(undefined);
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Category filtering
  const filteredNotes = notes.filter((n) =>
    (!categoryFilter || n.category === categoryFilter)
  );

  // Handlers for CRUD
  const handleCreate = () => {
    setEditingNote(null);
    setShowEditor(true);
  };

  const handleEdit = (id: string) => {
    setEditingNote(notes.find((n) => n.id === id) || null);
    setShowEditor(true);
  };

  const handleDelete = async (id: string) => {
    const client = getSupabaseClient();
    await client.from("notes").delete().eq("id", id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedNoteId === id) setSelectedNoteId(undefined);
  };

  const handleSave = async (form: { title: string; category: string; content: string }) => {
    setLoading(true);
    const client = getSupabaseClient();
    let result;
    if (editingNote) {
      result = await client
        .from("notes")
        .update({ ...form, updated_at: new Date().toISOString() })
        .eq("id", editingNote.id)
        .select()
        .maybeSingle();
      if (result.data) {
        setNotes((prev) =>
          prev.map((n) => (n.id === editingNote.id ? result.data : n))
        );
        setSelectedNoteId(editingNote.id);
      }
    } else {
      result = await client
        .from("notes")
        .insert([
          {
            ...form,
            user_id: loaderData.user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .maybeSingle();
      if (result.data) {
        setNotes((prev) => [result.data, ...prev]);
        setSelectedNoteId(result.data.id);
      }
    }
    setShowEditor(false);
    setEditingNote(null);
    setLoading(false);
  };

  const selectedNote =
    notes.find((n) => n.id === selectedNoteId) || filteredNotes[0];

  // Sync selectedNoteId if list changes
  useEffect(() => {
    if (filteredNotes.length > 0 && !selectedNoteId) {
      setSelectedNoteId(filteredNotes[0].id);
    } else if (filteredNotes.length === 0) {
      setSelectedNoteId(undefined);
    }
    // Only update selectedNoteId when filteredNotes changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredNotes, selectedNoteId]);

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc]">
      <TopBar
        userEmail={loaderData.user.email}
        onSignOut={async () => {
          await signOut();
          navigate("/login");
        }}
      />
      <div className="flex flex-1 min-h-0">
        <Sidebar
          categories={loaderData.categories}
          selected={categoryFilter}
          onSelect={setCategoryFilter}
        />
        <main className="flex-1 flex flex-col min-w-0 max-w-4xl mx-auto py-8 px-4">
          <div className="mb-4 flex items-center gap-4">
            <input
              type="search"
              className="w-full px-3 py-2 rounded border border-gray-300 shadow-sm focus:ring-1 focus:ring-[#1e40af]"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="px-4 py-2 rounded bg-[#f59e42] hover:bg-[#1e40af] text-white font-semibold transition-colors"
              onClick={handleCreate}
            >
              + New Note
            </button>
          </div>
          <div className="flex flex-1 gap-6 min-h-0">
            <div className="w-80 min-w-[240px] max-h-full">
              <NoteList
                notes={filteredNotes}
                selectedNoteId={selectedNoteId}
                onSelect={setSelectedNoteId}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchTerm={searchTerm}
              />
            </div>
            <div className="flex-1 min-w-0 border rounded-lg bg-white shadow">
              <NoteView note={selectedNote} />
            </div>
          </div>
        </main>
      </div>
      <Modal
        open={showEditor}
        onClose={() => setShowEditor(false)}
        title={editingNote ? "Edit Note" : "New Note"}
      >
        <NoteEditor
          initialData={editingNote || undefined}
          onSave={handleSave}
          onCancel={() => setShowEditor(false)}
          loading={loading}
        />
      </Modal>
    </div>
  );
}
