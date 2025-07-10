import { clsx } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Button({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      className={clsx(
        "px-4 py-2 rounded font-medium transition-colors bg-[#1e40af] text-white hover:bg-[#f59e42] focus:outline-none focus:ring-2 focus:ring-[#f59e42] focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
