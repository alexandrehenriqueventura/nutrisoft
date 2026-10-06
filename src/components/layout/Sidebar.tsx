"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  FileSpreadsheet,
  FileText,
  Smartphone,
  Settings,
  Calculator,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isNutriOrStaff = user?.role === "nutri" || user?.role === "secretaria" || user?.role === "admin";
  const isPatient = user?.role === "paciente";

  const staffNavItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Pacientes", href: "/patients", icon: Users },
    { label: "Calculadora TMB & %Gordura", href: "/calculator", icon: Calculator },
  ];

  const patientNavItems = [
    { label: "Meu Plano Alimentar", href: "/patient-portal", icon: UtensilsCrossed },
    { label: "Diário Alimentar", href: "/patient-portal/diary", icon: Smartphone },
  ];

  const items = isPatient ? patientNavItems : staffNavItems;

  return (
    <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          {isPatient ? "Área do Paciente" : "Gestão Clínica"}
        </div>
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-800"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-1">
        <div className="px-3 py-1 text-xs text-zinc-500 font-medium">
          Clínica Ativa: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{user?.clinicId || "NutriSoft Pro"}</span>
        </div>
      </div>
    </aside>
  );
}
