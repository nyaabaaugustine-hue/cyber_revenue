import { useState } from "react";
import { IcnShield as Shield, IcnMail as Mail, IcnLock as Lock, IcnEye as Eye, IcnEyeOff as EyeOff, IcnCheckCircle as CheckCircle } from "@/components/ui/Icons";
import { useAuth } from "../utils/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { roleLabels } from "../utils/permissions";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickSelect, setShowQuickSelect] = useState(false);
  const { login, availableUsers } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    await login(email, password);
    setIsLoading(false);
  };

  const quickLogin = async (u: typeof availableUsers[0]) => {
    setEmail(u.email);
    setPassword("password123");
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    await login(u.email, "password123");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(ellipse 100% 80% at 50% -30%, rgba(99, 102, 241, 0.2), transparent),
              radial-gradient(ellipse 80% 60% at 80% 100%, rgba(16, 185, 129, 0.15), transparent)
            `
          }}
        />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/25 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">CyberRevenue</h1>
          <p className="text-slate-400 text-sm">Command System - Ghana District Assemblies</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-1">Welcome back</h2>
            <p className="text-slate-400 text-sm">Sign in to access the command center</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type="email"
                  placeholder="admin@kma.gov.gh"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full h-11 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-medium shadow-lg shadow-indigo-500/25 disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800">
            <button
              onClick={() => setShowQuickSelect(!showQuickSelect)}
              className="w-full text-xs text-slate-400 hover:text-slate-300 text-center flex items-center justify-center gap-1"
            >
              Quick-select a demo account
            </button>

            {showQuickSelect && (
              <div className="mt-4 space-y-2">
                {availableUsers.map(u => (
                  <button
                    key={u.id}
                    onClick={() => quickLogin(u)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600 transition-all text-left"
                  >
                    <img
                      src={u.avatarUrl}
                      alt={u.fullName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{u.fullName}</p>
                      <p className="text-xs text-slate-400">{roleLabels[u.role] || u.role} · {u.email}</p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          © 2024 CyberRevenue Command System. Built for Ghana.
        </p>
      </div>
    </div>
  );
}