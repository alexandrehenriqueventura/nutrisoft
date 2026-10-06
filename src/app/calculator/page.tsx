"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  calculateHarrisBenedict1919,
  calculateHarrisBenedict1984,
  calculateMifflinStJeor,
  calculateCunningham,
  calculateFaoOms,
  Gender,
} from "@/lib/calculations/bmr";
import { calculateTdee, ActivityLevel, InjuryFactor, ACTIVITY_FACTORS, INJURY_FACTORS } from "@/lib/calculations/tdee";
import { calculatePollock3, calculatePollock7 } from "@/lib/calculations/bodyFat";
import { Calculator, Activity, Zap, Flame, Scale } from "lucide-react";

export default function CalculatorPage() {
  // Estado dos Inputs
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState<number>(30);
  const [weight, setWeight] = useState<number>(75);
  const [height, setHeight] = useState<number>(175);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");
  const [injuryFactor, setInjuryFactor] = useState<InjuryFactor>("none");

  // Dobras Pollock 3
  const [p3Fold1, setP3Fold1] = useState<number>(12); // Peitoral / Tríceps
  const [p3Fold2, setP3Fold2] = useState<number>(18); // Abdômen / Suprailíaca
  const [p3Fold3, setP3Fold3] = useState<number>(15); // Coxa

  // Dobras Pollock 7
  const [p7Triceps, setP7Triceps] = useState<number>(10);
  const [p7Subscapular, setP7Subscapular] = useState<number>(12);
  const [p7Chest, setP7Chest] = useState<number>(8);
  const [p7Midaxillary, setP7Midaxillary] = useState<number>(10);
  const [p7Suprailiac, setP7Suprailiac] = useState<number>(14);
  const [p7Abdomen, setP7Abdomen] = useState<number>(18);
  const [p7Thigh, setP7Thigh] = useState<number>(16);

  // Resultados em Tempo Real
  const bmrMifflin = calculateMifflinStJeor(gender, weight, height, age);
  const bmrHb1919 = calculateHarrisBenedict1919(gender, weight, height, age);
  const bmrHb1984 = calculateHarrisBenedict1984(gender, weight, height, age);
  const bmrFao = calculateFaoOms(gender, weight, age);

  const tdeeMifflin = calculateTdee(bmrMifflin, activityLevel, injuryFactor);

  // Pollock 3 & 7
  const pollock3Res = calculatePollock3(gender, age, weight, { fold1: p3Fold1, fold2: p3Fold2, fold3: p3Fold3 });
  const pollock7Res = calculatePollock7(gender, age, weight, {
    triceps: p7Triceps,
    subscapular: p7Subscapular,
    chest: p7Chest,
    midaxillary: p7Midaxillary,
    suprailiac: p7Suprailiac,
    abdomen: p7Abdomen,
    thigh: p7Thigh,
  });

  const bmrCunningham = calculateCunningham(pollock3Res.leanMassKg);

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 bg-zinc-50/30 dark:bg-zinc-950 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Calculator className="h-6 w-6 text-emerald-600" />
            Calculadora Nutricional & Antropométrica
          </h1>
          <p className="text-sm text-zinc-500">
            Simulação em tempo real de TMB, GET e % de Gordura Corporal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário de Parâmetros Básicos */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 border-b pb-2">
              1. Dados Biométricos
            </h2>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">Sexo Biológico</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGender("male")}
                    className={`py-2 rounded-lg font-medium transition border ${gender === "male" ? "bg-emerald-600 text-white border-emerald-600" : "bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"}`}
                  >
                    Masculino
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender("female")}
                    className={`py-2 rounded-lg font-medium transition border ${gender === "female" ? "bg-emerald-600 text-white border-emerald-600" : "bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"}`}
                  >
                    Feminino
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1">Idade (anos)</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1">Altura (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">Nível de Atividade Física</label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                >
                  {Object.entries(ACTIVITY_FACTORS).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.label} ({item.factor}x)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">Fator Injúria / Estresse</label>
                <select
                  value={injuryFactor}
                  onChange={(e) => setInjuryFactor(e.target.value as InjuryFactor)}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                >
                  {Object.entries(INJURY_FACTORS).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Resultados TMB & GET */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 border-b pb-2 flex items-center gap-2">
              <Flame className="h-5 w-5 text-amber-500" /> 2. Taxa Metabólica & Gasto Energético
            </h2>

            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase">GET Total (Mifflin + Atividade)</p>
                <p className="text-3xl font-extrabold text-emerald-800 dark:text-emerald-200 mt-1">
                  {Math.round(tdeeMifflin)} <span className="text-base font-normal">kcal/dia</span>
                </p>
              </div>

              <div className="space-y-2 text-xs divide-y divide-zinc-100 dark:divide-zinc-800">
                <div className="pt-2 flex justify-between">
                  <span className="text-zinc-600 font-medium">Mifflin-St Jeor (1990):</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{Math.round(bmrMifflin)} kcal</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-zinc-600 font-medium">Harris-Benedict (1984):</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{Math.round(bmrHb1984)} kcal</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-zinc-600 font-medium">Harris-Benedict (1919):</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{Math.round(bmrHb1919)} kcal</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-zinc-600 font-medium">FAO/OMS (1985):</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{Math.round(bmrFao)} kcal</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-zinc-600 font-medium">Cunningham (1980):</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{Math.round(bmrCunningham)} kcal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pollock 3 & 7 Dobras */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 border-b pb-2 flex items-center gap-2">
              <Scale className="h-5 w-5 text-blue-500" /> 3. Composição Corporal (Pollock 3 Dobras)
            </h2>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-zinc-600 mb-1">{gender === "male" ? "Peitoral (mm)" : "Tríceps (mm)"}</label>
                  <input
                    type="number"
                    value={p3Fold1}
                    onChange={(e) => setP3Fold1(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded bg-zinc-50 dark:bg-zinc-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 mb-1">{gender === "male" ? "Abdômen (mm)" : "Suprailíaca (mm)"}</label>
                  <input
                    type="number"
                    value={p3Fold2}
                    onChange={(e) => setP3Fold2(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded bg-zinc-50 dark:bg-zinc-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 mb-1">Coxa (mm)</label>
                  <input
                    type="number"
                    value={p3Fold3}
                    onChange={(e) => setP3Fold3(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded bg-zinc-50 dark:bg-zinc-800 font-bold"
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg space-y-1">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase">% Gordura Calculado (Siri)</p>
                <p className="text-3xl font-extrabold text-blue-800 dark:text-blue-200">
                  {pollock3Res.bodyFatPercent}%
                </p>
                <div className="flex justify-between text-xs text-blue-950 dark:text-blue-100 font-medium pt-1 border-t border-blue-200/60 dark:border-blue-800/60">
                  <span>Massa Magra: <strong>{pollock3Res.leanMassKg} kg</strong></span>
                  <span>Massa Gorda: <strong>{pollock3Res.fatMassKg} kg</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
