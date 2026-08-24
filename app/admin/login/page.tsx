"use client";

import { FormEvent, useState } from "react";
import { Loader2, LockKeyhole, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid username or password.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--navy)] px-5 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg">
            <LockKeyhole
              size={30}
              className="text-[var(--blue)]"
            />
          </div>

          <h1 className="mt-6 text-3xl font-extrabold text-white">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-white/60">
            Sign in to manage TrackLink Express shipments.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-bold text-[var(--navy)]"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                placeholder="Enter your username"
                autoComplete="username"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-bold text-[var(--navy)]"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--blue)] px-5 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            TrackLink Express Administration
          </p>
        </div>
      </div>
    </main>
  );
}