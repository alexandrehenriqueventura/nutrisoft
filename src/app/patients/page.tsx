"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  Users,
  Search,
  Plus,
  Filter,
  Phone,
  Mail,
  Calendar,
  FileSpreadsheet,
  ChevronRight,
  UserCheck,
} from "lucide-react";

export interface PatientRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: "male" | "female";
  weightKg: number;
  heightCm: number;
  status: "Ativo" | "Inativo" | "Pendente";
  createdAt: string;
}

const INITIAL_PATIENTS: PatientRecord[] = [
  {
    id: "p1",
    name: "Carlos Eduardo Oliveira",
    email: "carlos.eduardo@email.com",
    phone: "(11) 98765-4321",
    birthDate: "1990-05-14",
    gender: "male",
    weightKg: 82.5,
    heightCm: 178,
    status: "Ativo",
    createdAt: "2026-09-10",
  },
  {
    id: "p2",
    name: "Mariana Souza Santos",
    email: "mariana.souza@email.com",
    phone: "(11) 97654-3210",
    birthDate: "1995-11-22",
    gender: "female",
    weightKg: 61.2,
    heightCm: 165,
    status: "Ativo",
    createdAt: "2026-09-15",
  },
  {
    id: "p3",
    name: "Roberto Mendes Silva",
    email: "roberto.mendes@email.com",
    phone: "(21) 99887-1122",
    birthDate: "1981-03-08",
    gender: "male",
    weightKg: 94.0,
    heightCm: 180,
    status: "Ativo",
    createdAt: "2026-09-28",
  },
];

export default function PatientsPage() {
  const [patients, setPatients] = useState<PatientRecord[]>(INITIAL_PATIENTS);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [weightKg, setWeightKg] = useState(70);
  const [heightCm, setHeightCm] = useState(170);

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
  );

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newPatient: PatientRecord = {
      id: `p-${Date.now()}`,
      name,
      email: email || "paciente@email.com",
      phone: phone || "(11) 99999-0000",
      birthDate: birthDate || "1995-01-01",
      gender,
      weightKg,
      heightCm,
      status: "Ativo",
      createdAt: new Date().toISOString().split("T")[0]!,
    };

    setPatients([newPatient, ...patients]);
    setShowModal(false);
    // Reset
    setName("");
    setEmail("");
    setPhone("");
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 bg-zinc-50/30 dark:bg-zinc-950 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Users className="h-6 w-6 text-emerald-600" />
              Gestão de Pacientes
            </h1>
            <p className="text-sm text-zinc-500">
              Gerencie cadastros, fichas clínicas e históricos antropométricos.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/patients/import-legacy"
              className="inline-flex items-center gap-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-sm font-medium px-4 py-2.5 rounded-lg transition"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Importar Legado (FineShape/WebDiet)</span>
            </Link>

            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Paciente</span>
            </button>
          </div>
        </div>

        {/* Busca & Filtros */}
        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <Search className="h-5 w-5 text-zinc-400 ml-1" />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400"
          />
        </div>

        {/* Listagem de Pacientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-base">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base leading-snug">
                        {patient.name}
                      </h3>
                      <span className="inline-block mt-0.5 text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        {patient.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{patient.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Nasc: {patient.birthDate}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-lg text-xs">
                  <div>
                    <span className="text-zinc-500 block">Peso Atual</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{patient.weightKg} kg</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Altura</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{patient.heightCm} cm</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/patients/${patient.id}`}
                className="w-full mt-2 inline-flex items-center justify-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-zinc-800 dark:text-zinc-200 text-xs font-semibold py-2 rounded-lg transition"
              >
                <span>Acessar Ficha & Avaliação</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Modal de Cadastro de Paciente */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 max-w-md w-full space-y-4 shadow-xl">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-emerald-600" />
                Cadastrar Novo Paciente
              </h2>

              <form onSubmit={handleCreatePatient} className="space-y-3 text-xs sm:text-sm">
                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: João da Silva"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">E-mail</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="paciente@email.com"
                      className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">Telefone / WhatsApp</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 99999-8888"
                      className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">Nascimento</label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full px-2 py-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">Peso (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                      className="w-full px-2 py-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">Altura (cm)</label>
                    <input
                      type="number"
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value))}
                      className="w-full px-2 py-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                  >
                    Salvar Paciente
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
