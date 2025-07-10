import type { Note } from "~/types";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { clsx } from "clsx";

interface NoteListProps {
  notes: Note[];
  selectedNoteId?: string;
  onSelect: (noteId: string) => void;
  onEdit: (noteId: string) => void;
  onDelete: (noteId: string) => void;
  searchTerm?: string;
}

export function NoteList({
  notes,
  selectedNoteId,
  onSelect,
  onEdit,
  onDelete,
  searchTerm,
}: NoteListProps) {
  const visibleNotes = searchTerm
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : notes;
  return (
    <div className="flex flex-col divide-y bg-white rounded-lg shadow border">
      {visibleNotes.length === 0 && (
        <div className="p-6 text-gray-400 text-center">No notes found.</div>
      )}
      {visibleNotes.map((note) => (
        <div
          key={note.id}
          className={clsx(
            "group flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors hover:bg-[#f59e42]/10",
            note.id === selectedNoteId && "bg-[#f59e42]/20"
          )}
          role="button"
          tabIndex={0}
          onClick={() => onSelect(note.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onSelect(note.id);
            }
          }}
        >
          <div className="flex-1 min-w-0 truncate">
            <div className="font-semibold text-[#1e40af] truncate">{note.title}</div>
            <div className="text-xs text-gray-500 truncate">{note.category}</div>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100">
            <button
              className="p-1 hover:bg-gray-200 rounded"
              title="Edit"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(note.id);
              }}
            >
              <PencilSquareIcon className="w-5 h-5 text-[#1e40af]" />
            </button>
            <button
              className="p-1 hover:bg-gray-200 rounded"
              title="Delete"
              onClick={(e) => {
                e.stopPropagation();
                if (
                  window.confirm("Are you sure you want to delete this note?")
                ) {
                  onDelete(note.id);
                }
              }}
            >
              <TrashIcon className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
