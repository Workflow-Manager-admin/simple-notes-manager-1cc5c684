import type { Note } from "~/types";

interface NoteViewProps {
  note: Note | undefined;
}

export function NoteView({ note }: NoteViewProps) {
  if (!note) {
    return (
      <div className="text-gray-400 text-center py-8">Select a note to view details.</div>
    );
  }
  return (
    <article className="flex flex-col h-full px-6 py-4">
      <h2 className="text-2xl font-bold text-[#1e40af] mb-2">{note.title}</h2>
      <div className="text-xs text-gray-400 mb-4">{note.category}</div>
      <div className="whitespace-pre-wrap text-gray-700">{note.content}</div>
    </article>
  );
}
