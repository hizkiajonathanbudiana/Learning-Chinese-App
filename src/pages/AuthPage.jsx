import { useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function AuthPage() {
  const { session } = useAuth();
  const [view, setView] = useState("sign_in"); // 'sign_in' atau 'sign_up'

  // State untuk form pendaftaran kustom
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupCode, setSignupCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (session) {
    return <Navigate to="/cms" replace />;
  }

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validasi kode pendaftaran di sisi klien
    if (signupCode !== import.meta.env.VITE_SIGNUP_CODE) {
      setMessage("Invalid signup code.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage(
        "Registration successful! Please check your email to verify your account."
      );
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center py-20">
      <div className="w-full max-w-md p-8 bg-card-bg rounded-lg border border-border shadow-md">
        <h2 className="text-2xl font-bold text-center text-accent-dark mb-6">
          {view === "sign_in" ? "CMS Login" : "Admin Registration"}
        </h2>

        {view === "sign_in" ? (
          <div>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={[]}
            />
            <p className="text-center text-sm text-text-secondary mt-4">
              Need to register?{" "}
              <button
                onClick={() => setView("sign_up")}
                className="font-semibold text-accent-medium hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="field-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="field-input"
              />
            </div>
            <div>
              <label className="field-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="field-input"
              />
            </div>
            <div>
              <label className="field-label">Signup Code</label>
              <input
                type="text"
                value={signupCode}
                onChange={(e) => setSignupCode(e.target.value)}
                required
                className="field-input"
                placeholder="Enter the secret code"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-2.5"
            >
              {loading ? "Registering..." : "Sign Up"}
            </button>
            {message && (
              <p className="text-sm text-center text-accent-dark mt-2">
                {message}
              </p>
            )}
            <p className="text-center text-sm text-text-secondary mt-4">
              Already have an account?{" "}
              <button
                onClick={() => setView("sign_in")}
                className="font-semibold text-accent-medium hover:underline"
              >
                Sign In
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
