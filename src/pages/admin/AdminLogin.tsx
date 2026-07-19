import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock, Pen, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    setIsSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Unable to sign in. Check your credentials and try again.");
      setIsSubmitting(false);
      return;
    }

    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-950 via-amber-950/20 to-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-500/30">
            <Pen className="w-10 h-10 text-slate-950" />
          </div>

          <h1
            className="text-3xl font-bold text-amber-400 mb-2"
            style={{ fontFamily: "Noto Nastaliq Urdu, serif" }}
          >
            انتظامی پنل
          </h1>

          <p className="text-amber-200/60">Admin Panel Login</p>
        </div>

        <div className="p-8 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-amber-500/20 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-amber-200/80 text-sm mb-2">
                Email
              </label>

              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-amber-500/20 text-white placeholder-amber-200/40 focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="admin@abdulwahed.com"
              />
            </div>

            <div>
              <label className="block text-amber-200/80 text-sm mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-800/50 border border-amber-500/20 text-white placeholder-amber-200/40 focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400/60 hover:text-amber-400"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30"
            >
              <Lock className="w-5 h-5" />
              {isSubmitting ? 'Signing in…' : 'Login'}
            </motion.button>
          </form>

          <p className="text-center text-amber-200/40 text-sm mt-6">
            Supabase Admin Login
          </p>
        </div>
      </motion.div>
    </div>
  );
}
