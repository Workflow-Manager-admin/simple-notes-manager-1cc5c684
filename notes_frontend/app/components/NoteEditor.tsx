import { useState } from "react";
import { Button } from "./ui/Button";
import type { Note } from "~/types";

interface NoteEditorProps {
  initialData?: Partial<Note>;
  onSave: (data: { title: string; content: string; category: string }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function NoteEditor({ initialData, onSave, onCancel, loading }: NoteEditorProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [category, setCategory] = useState(initialData?.category || "");
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ title, content, category });
      }}
    >
      <label>
        <span className="font-medium text-gray-700">Title</span>
        <input
          type="text"
          className="mt-1 block w-full rounded border-gray-300 shadow-sm"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label>
        <span className="font-medium text-gray-700">Category</span>
        <input
          type="text"
          className="mt-1 block w-full rounded border-gray-300 shadow-sm"
          value={category}
          placeholder="General"
          onChange={(e) => setCategory(e.target.value)}
        />
      </label>
      <label>
        <span className="font-medium text-gray-700">Content</span>
        <textarea
          className="mt-1 block w-full min-h-[120px] rounded border-gray-300 shadow-sm"
          value={content}
          required
          onChange={(e) => setContent(e.target.value)}
        />
      </label>
      <div className="flex gap-2 mt-2 justify-end">
        <Button type="button" className="bg-gray-200 text-gray-800 hover:bg-gray-300" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
