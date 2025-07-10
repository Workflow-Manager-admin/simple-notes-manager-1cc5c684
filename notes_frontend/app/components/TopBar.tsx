import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";

interface TopBarProps {
  userEmail?: string;
  onSignOut?: () => void;
}

export function TopBar({ userEmail, onSignOut }: TopBarProps) {
  return (
    <header className="h-14 px-4 flex items-center justify-between shadow-sm border-b bg-white">
      <Link to="/" className="flex gap-2 items-center text-[#1e40af] font-bold text-lg tracking-wide">
        <span>📝</span> Notes
      </Link>
      <div className="flex items-center gap-4">
        {userEmail ? (
          <div className="flex gap-3 items-center text-sm">
            <span className="flex items-center gap-1">
              <UserCircleIcon className="w-5 h-5 text-[#1e40af]" />
              {userEmail}
            </span>
            <button
              className="text-[#f59e42] underline font-medium ml-1"
              onClick={onSignOut}
              type="button"
            >
              Sign out
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-[#1e40af] hover:bg-[#f59e42] px-4 py-2 rounded text-white transition-colors font-medium"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
