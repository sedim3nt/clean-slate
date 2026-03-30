"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export function NavAuth() {
  const { user, signOut, setShowAuthModal } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-4 text-sm">
        <Link href="/profile" className="text-diluted hover:text-sumi transition-colors">
          Profile
        </Link>
        <button onClick={() => signOut()} className="text-diluted hover:text-sumi transition-colors">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowAuthModal(true)}
      className="text-sm text-diluted hover:text-sumi transition-colors font-medium"
    >
      Sign in
    </button>
  );
}

export function AuthModalTrigger() {
  const { showAuthModal, setShowAuthModal } = useAuth();
  
  if (!showAuthModal) return null;

  // Dynamically import to avoid SSR issues
  const AuthModal = require("./AuthModal").default;
  return <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />;
}
