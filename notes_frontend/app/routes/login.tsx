import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { signIn, signUp } from "~/utils/auth";
import { Button } from "~/components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [signupMode, setSignupMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let res;
      if (signupMode) {
        res = await signUp(email, pw);
      } else {
        res = await signIn(email, pw);
      }
      if (res.error) {
        setError(res.error.message || "Failed to sign in.");
      } else {
        navigate("/notes");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen flex flex-col items-center justify-center bg-[#f8fafc] px-4">
      <div className="max-w-md w-full mx-auto p-8 rounded-lg shadow bg-white border flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-[#1e40af] mb-2">
          {signupMode ? "Sign Up" : "Sign In"}
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label>
            <span className="font-medium">Email</span>
            <input
              required
              type="email"
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
              value={email}
              autoComplete="username"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            <span className="font-medium">Password</span>
            <input
              required
              type="password"
              className="mt-1 block w-full rounded border-gray-300 shadow-sm"
              value={pw}
              autoComplete={signupMode ? "new-password" : "current-password"}
              onChange={(e) => setPw(e.target.value)}
            />
          </label>
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <Button type="submit" disabled={loading}>
            {loading
              ? signupMode
                ? "Signing up..."
                : "Signing in..."
              : signupMode
                ? "Sign Up"
                : "Sign In"}
          </Button>
        </form>
        <div className="text-sm text-center">
          {signupMode
            ? (
              <>
                Already have an account?{" "}
                <button
                  className="text-[#f59e42] underline"
                  onClick={() => setSignupMode(false)}
                  type="button"
                >
                  Sign in
                </button>
              </>
            )
            : (
              <>
                New here?{" "}
                <button
                  className="text-[#f59e42] underline"
                  onClick={() => setSignupMode(true)}
                  type="button"
                >
                  Sign up
                </button>
              </>
            )}
        </div>
      </div>
    </main>
  );
}
