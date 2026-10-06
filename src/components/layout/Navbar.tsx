"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User as UserIcon, Shield, Activity } from "lucide-react";

export function Navbar() {
  const { user, logout, setDemoUser } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur dark:bg-zinc-900/95 border-zinc-200 dark:border-zinc-800">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-emerald-600 dark:text-emerald-400">
            <Activity className="h-6 w-6" />
            <span>NutriSoft</span>
          </Link>
          <span className="hidden sm:inline-block rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            SaaS Clínico
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Seletor Rápido de Perfil / Demo RBAC */}
          <div className="flex items-center gap-1.5 text-xs border border-zinc-200 dark:border-zinc-700 rounded-lg p-1 bg-zinc-50 dark:bg-zinc-800">
            <span className="text-zinc-500 dark:text-zinc-400 px-1 hidden md:inline">Papel:</span>
            <button
              onClick={() => setDemoUser("nutri")}
              className={`px-2 py-1 rounded transition ${user?.role === "nutri" ? "bg-emerald-600 text-white font-medium" : "text-zinc-600 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-700"}`}
            >
              Nutri
            </button>
            <button
              onClick={() => setDemoUser("secretaria")}
              className={`px-2 py-1 rounded transition ${user?.role === "secretaria" ? "bg-blue-600 text-white font-medium" : "text-zinc-600 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-700"}`}
            >
              Secretária
            </button>
            <button
              onClick={() => setDemoUser("paciente")}
              className={`px-2 py-1 rounded transition ${user?.role === "paciente" ? "bg-purple-600 text-white font-medium" : "text-zinc-600 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-700"}`}
            >
              Paciente
            </button>
          </div>

          {user && (
            <div className="flex items-center gap-3 border-l border-zinc-200 dark:border-zinc-700 pl-3 sm:pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-none">{user.name}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 capitalize mt-0.5">{user.role}</p>
              </div>
              <button
                onClick={() => logout()}
                className="p-2 text-zinc-500 hover:text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition"
                title="Sair da Sessão"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
