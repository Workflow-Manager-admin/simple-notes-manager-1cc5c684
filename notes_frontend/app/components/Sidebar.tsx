import type { Category } from "~/types";
import { clsx } from "clsx";

interface SidebarProps {
  categories: Category[];
  selected?: string;
  onSelect: (category: string) => void;
}

export function Sidebar({ categories, selected, onSelect }: SidebarProps) {
  return (
    <aside className="min-w-[180px] border-r border-gray-100 bg-gray-50 p-4">
      <div className="font-semibold text-[#1e40af] mb-6">Categories</div>
      <ul className="flex flex-col gap-2">
        <li>
          <button
            className={clsx(
              "w-full text-left px-3 py-2 rounded transition-colors hover:bg-[#f59e42]/10",
              !selected && "font-bold bg-[#f59e42]/20"
            )}
            onClick={() => onSelect("")}
          >
            All notes
          </button>
        </li>
        {categories.map((cat) => (
          <li key={cat.name}>
            <button
              className={clsx(
                "w-full text-left px-3 py-2 rounded transition-colors hover:bg-[#f59e42]/10",
                selected === cat.name && "font-bold bg-[#f59e42]/20"
              )}
              onClick={() => onSelect(cat.name)}
            >
              {cat.displayName}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
