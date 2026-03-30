"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthModal() {
  const { showAuthModal, setShowAuthModal, signIn, signUp, signInWithGoogle } =
    useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  if (!showAuthModal) return null;

  function close() {
    setShowAuthModal(false);
    setEmail("");
    setPassword("");
    setError("");
    setConfirmationSent(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "login") {
      const result = await signIn(email, password);
      if (result.error) setError(result.error);
    } else {
      const result = await signUp(email, password);
      if (result.error) setError(result.error);
      if (result.needsConfirmation) setConfirmationSent(true);
    }

    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-sumi/40 backdrop-blur-sm"
        onClick={close}
      />
      <div className="relative bg-warm-white border border-paper/50 rounded-xl p-6 w-full max-w-sm mx-4 animate-fade-in">
        <button
          onClick={close}
          className="absolute top-3 right-4 text-diluted hover:text-sumi text-lg"
        >
          ✕
        </button>

        <h2 className="font-display text-xl font-bold mb-1">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h2>
        <p className="text-diluted text-xs mb-5">
          Your data stays private. We never share it.
        </p>

        {confirmationSent ? (
          <div className="text-center py-4">
            <p className="text-sumi font-semibold mb-2">Check your email</p>
            <p className="text-diluted text-sm">
              We sent a confirmation link to {email}. Click it to activate your
              account, then sign in.
            </p>
            <button
              onClick={() => {
                setConfirmationSent(false);
                setMode("login");
              }}
              className="mt-4 text-sm text-diluted underline hover:text-sumi"
            >
              Back to sign in
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-paper/50 rounded-md px-3 py-2 bg-warm-white text-sumi text-sm"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border border-paper/50 rounded-md px-3 py-2 bg-warm-white text-sumi text-sm"
              />
              {error && (
                <p className="text-vermillion text-xs">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sumi text-warm-white py-2.5 rounded-md font-display font-semibold text-sm hover:bg-sumi/90 transition-colors disabled:opacity-50"
              >
                {loading
                  ? "..."
                  : mode === "login"
                    ? "Sign in"
                    : "Create account"}
              </button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-paper/40" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-warm-white px-2 text-diluted">or</span>
              </div>
            </div>

            <button
              onClick={signInWithGoogle}
              className="w-full border border-paper/50 py-2.5 rounded-md text-sm font-medium text-sumi hover:bg-paper/10 transition-colors"
            >
              Continue with Google
            </button>

            <p className="text-center text-xs text-diluted mt-4">
              {mode === "login" ? (
                <>
                  No account?{" "}
                  <button
                    onClick={() => {
                      setMode("signup");
                      setError("");
                    }}
                    className="underline hover:text-sumi"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setMode("login");
                      setError("");
                    }}
                    className="underline hover:text-sumi"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
