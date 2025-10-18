import { Outlet } from "react-router-dom";
import { Shield, Lock, Layers, Zap, CheckCircle2 } from "lucide-react";

export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-12">
        {/* Animated decorative elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute right-0 top-0 h-96 w-96 translate-x-48 -translate-y-48 rounded-full bg-blue-400 blur-3xl animate-pulse" />
          <div
            className="absolute bottom-0 left-0 h-96 w-96 -translate-x-48 translate-y-48 rounded-full bg-purple-400 blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-3xl opacity-20 animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        <div className="relative z-10 flex flex-col justify-between text-white w-full">
          {/* Logo & Title */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/20 p-3 backdrop-blur-md shadow-lg">
                <img
                  src="/pass-in-closet.png"
                  alt="Pass-in-Closet"
                  className="h-10 w-auto"
                />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Pass-in-Closet
              </h1>
              <p className="mt-3 text-lg text-blue-100">
                Your secure credential vault in the cloud
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-8">
              <div className="space-y-1">
                <div className="text-3xl font-bold">256-bit</div>
                <div className="text-sm text-blue-200">Encryption</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold">100%</div>
                <div className="text-sm text-blue-200">Secure</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-blue-200">Available</div>
              </div>
            </div>
          </div>

          {/* Features - Center */}
          <div className="space-y-6 my-8">
            <h2 className="text-2xl font-semibold mb-8">
              Trusted by professionals worldwide
            </h2>
            <div className="space-y-5">
              <div className="group flex items-start gap-4 rounded-xl bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105 cursor-default">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <Lock size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    Military-Grade Encryption
                  </h3>
                  <p className="text-sm text-blue-100 leading-relaxed">
                    AES-256 encryption protects all your credentials with the
                    highest security standards
                  </p>
                </div>
                <CheckCircle2
                  size={20}
                  className="text-green-400 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>

              <div className="group flex items-start gap-4 rounded-xl bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105 cursor-default">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                  <Layers size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    Smart Organization
                  </h3>
                  <p className="text-sm text-blue-100 leading-relaxed">
                    Organize credentials by workspace, project, and team for
                    seamless access
                  </p>
                </div>
                <CheckCircle2
                  size={20}
                  className="text-green-400 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>

              <div className="group flex items-start gap-4 rounded-xl bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105 cursor-default">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                  <Zap size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    Lightning Fast Access
                  </h3>
                  <p className="text-sm text-blue-100 leading-relaxed">
                    Access your credentials instantly from anywhere, anytime, on
                    any device
                  </p>
                </div>
                <CheckCircle2
                  size={20}
                  className="text-green-400 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="space-y-4">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="flex items-center justify-between">
              <p className="text-sm text-blue-200">
                © 2025 Pass-in-Closet. All rights reserved.
              </p>
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-green-400" />
                <span className="text-xs text-blue-200">
                  Secured & Encrypted
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex w-full items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30 p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
