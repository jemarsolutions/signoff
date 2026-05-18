"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";

interface UserMenuProps {
  userName: string;
  userImage?: string | null;
}

function getAvatarColor(name: string) {
  const colors = [
    "bg-rose-500", "bg-pink-500", "bg-fuchsia-500", "bg-purple-500", 
    "bg-violet-500", "bg-indigo-500", "bg-blue-500", "bg-sky-500", 
    "bg-cyan-500", "bg-teal-500", "bg-emerald-500", "bg-amber-500", "bg-orange-500"
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function UserMenu({ userName, userImage }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the dropdown if the user clicks outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const avatarColor = getAvatarColor(userName);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-sm font-bold text-white hover:border-slate-500 hover:ring-2 ring-indigo-500/30 transition-all focus:outline-none overflow-hidden shadow-md"
        aria-label="User menu"
      >
        {userImage ? (
          <img src={userImage} alt={userName} className="h-full w-full object-cover" />
        ) : (
          <div className={`flex h-full w-full items-center justify-center ${avatarColor}`}>
            {userName.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-slate-800 bg-slate-900 py-1 shadow-lg shadow-black/50 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="px-4 py-3 border-b border-slate-800">
            <p className="text-xs text-slate-500">Signed in as</p>
            <p className="truncate text-sm font-bold text-white">{userName}</p>
          </div>
          
          <div className="p-1">
            <a
              href="/dashboard/settings"
              className="group flex w-full items-center rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left"
            >
              <svg className="mr-2 h-4 w-4 text-slate-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings & Branding
            </a>
            
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="group flex w-full items-center rounded-lg px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors text-left mt-1"
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
