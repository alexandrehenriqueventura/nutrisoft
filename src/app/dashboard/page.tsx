"use client";

import React from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/context/AuthContext";
import {
  Users,
  UtensilsCrossed,
  Activity,
  FileSpreadsheet,
  Plus,
  ArrowUpRight,
  Calculator,
  BrainCircuit,
  Search,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 bg-zinc-50/30 dark:bg-zinc-950 space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Painel Clínico
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Bem-vindo(a), <span className="font-semibold text-emerald-600 dark:text-emerald-400">{user?.name}</span>. Acompanhe seus atendimentos do dia.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/patients"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Paciente</span>
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Pacientes Ativos</span>
              <Users className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">42</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" /> +12% este mês
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Planos Ativos</span>
              <UtensilsCrossed className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">38</div>
            <p className="text-xs text-zinc-500">Atualizados na semana</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Avaliações no Mês</span>
              <Activity className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">19</div>
            <p className="text-xs text-purple-600 font-medium">Pollock 3 e 7 dobras</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Base Alimentos</span>
              <BrainCircuit className="h-5 w-5 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">TACO 4ª Ed.</div>
            <p className="text-xs text-amber-600 font-medium">Busca autocompletável por tokens</p>
          </div>
        </div>

        {/* Quick Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/patients"
            className="p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/40 dark:to-emerald-900/20 border border-emerald-200 dark:border-emerald-800/60 rounded-xl hover:shadow-md transition space-y-2"
          >
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-emerald-600" />
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Gerenciar Pacientes</h3>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Cadastre novos pacientes, visualize fichas e histórico antropométrico.
            </p>
          </Link>

          <Link
            href="/calculator"
            className="p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800/60 rounded-xl hover:shadow-md transition space-y-2"
          >
            <div className="flex items-center gap-3">
              <Calculator className="h-6 w-6 text-blue-600" />
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Calculadora Nutricional</h3>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Simulação instantânea de TMB (Mifflin/Harris), GET e Pollock 3/7 dobras.
            </p>
          </Link>

          <Link
            href="/patients/import-legacy"
            className="p-5 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/40 dark:to-amber-900/20 border border-amber-200 dark:border-amber-800/60 rounded-xl hover:shadow-md transition space-y-2"
          >
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-6 w-6 text-amber-600" />
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Importador de Legados</h3>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Importação de planilhas FineShape, WebDiet e Dietbox em CSV/Excel.
            </p>
          </Link>
        </div>

        {/* Lista de Atendimentos Recentes */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Pacientes Recentes</h2>
            <Link href="/patients" className="text-xs font-semibold text-emerald-600 hover:underline">
              Ver todos ({">"})
            </Link>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {[
              { id: "1", name: "Carlos Eduardo Oliveira", age: 34, weight: "82.5 kg", fat: "18.4%", status: "Ativo" },
              { id: "2", name: "Mariana Souza Santos", age: 29, weight: "61.2 kg", fat: "22.1%", status: "Ativo" },
              { id: "3", name: "Roberto Mendes", age: 45, weight: "94.0 kg", fat: "26.8%", status: "Retorno Perto" },
            ].map((patient) => (
              <div key={patient.id} className="py-3.5 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 px-2 rounded-lg transition">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-sm">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-zinc-900 dark:text-zinc-100">{patient.name}</h4>
                    <p className="text-xs text-zinc-500">{patient.age} anos • Peso: {patient.weight} • %Gordura: {patient.fat}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                    {patient.status}
                  </span>
                  <Link
                    href={`/patients/${patient.id}`}
                    className="text-xs bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-md text-zinc-700 dark:text-zinc-200 transition font-medium"
                  >
                    Ver Ficha
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
