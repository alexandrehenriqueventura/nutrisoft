"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UtensilsCrossed,
  Droplets,
  Calendar,
  CheckCircle,
  ShoppingBag,
  Camera,
  WifiOff,
  Bell,
} from "lucide-react";

export default function PatientPortalPage() {
  const [waterGlasses, setWaterGlasses] = useState(5); // 5 * 250ml = 1250ml
  const waterGoal = 8; // 2000ml

  const [meals, setMeals] = useState([
    {
      id: "m1",
      name: "Café da Manhã",
      time: "07:30",
      consumed: true,
      items: [
        "2 Ovos cozidos (100g)",
        "1 Pão francês (50g)",
        "1 Xícara de café preto sem açúcar",
      ],
    },
    {
      id: "m2",
      name: "Almoço",
      time: "12:30",
      consumed: false,
      items: [
        "1.5 Escumadeiras de Arroz integral (150g)",
        "1 Concha de Feijão carioca (100g)",
        "1 Filé de Peito de frango grelhado (150g)",
        "Salada verde de alface e tomate à vontade (Azeite 1 colher de chá)",
      ],
    },
    {
      id: "m3",
      name: "Lanche da Tarde",
      time: "16:00",
      consumed: false,
      items: [
        "1 Banana prata (100g)",
        "2 Colheres de sopa de Aveia em flocos (30g)",
      ],
    },
    {
      id: "m4",
      name: "Jantar",
      time: "20:00",
      consumed: false,
      items: [
        "Batata doce cozida (150g)",
        "Carne moída / patinho (120g)",
      ],
    },
  ]);

  const toggleMealConsumed = (id: string) => {
    setMeals(
      meals.map((m) => (m.id === id ? { ...m, consumed: !m.consumed } : m))
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20 max-w-md mx-auto border-x border-zinc-200 dark:border-zinc-800">
      {/* Header Mobile Patient */}
      <div className="bg-emerald-600 text-white p-5 rounded-b-2xl shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs bg-emerald-700/80 px-2 py-0.5 rounded font-medium">Plano Ativo • Prescrito</span>
            <h1 className="text-xl font-bold mt-1">Olá, Carlos! 👋</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-emerald-800/80 px-2 py-1 rounded flex items-center gap-1">
              <WifiOff className="h-3 w-3" /> Offline
            </span>
          </div>
        </div>

        {/* Hidratação em tempo real */}
        <div className="bg-white/10 backdrop-blur p-3.5 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <Droplets className="h-6 w-6 text-blue-200" />
            <div>
              <p className="font-semibold">Hidratação do Dia</p>
              <p className="text-emerald-100">{waterGlasses * 250} ml / {waterGoal * 250} ml ({waterGlasses}/{waterGoal} copos)</p>
            </div>
          </div>
          <button
            onClick={() => setWaterGlasses((v) => Math.min(waterGoal, v + 1))}
            className="bg-white text-emerald-800 font-bold px-3 py-1.5 rounded-lg shadow text-xs hover:bg-emerald-50 active:scale-95 transition"
          >
            + 250ml
          </button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="p-4 space-y-4">
        {/* Atálhos Rápidos */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/patient-portal/diary"
            className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm flex items-center gap-3 text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:border-emerald-500 transition"
          >
            <Camera className="h-5 w-5 text-emerald-600" />
            <div>
              <span>Diário Alimentar</span>
              <p className="text-[10px] text-zinc-500 font-normal">Enviar foto do prato</p>
            </div>
          </Link>

          <Link
            href="/patient-portal/grocery"
            className="p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm flex items-center gap-3 text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:border-emerald-500 transition"
          >
            <ShoppingBag className="h-5 w-5 text-blue-600" />
            <div>
              <span>Lista de Compras</span>
              <p className="text-[10px] text-zinc-500 font-normal">Gerada da dieta</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center justify-between pt-2">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Sua Dieta Hoje</h2>
          <span className="text-xs text-zinc-500 flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> Terça-feira
          </span>
        </div>

        {/* Refeições */}
        <div className="space-y-3">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className={`p-4 rounded-xl border transition ${
                meal.consumed
                  ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between border-b pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="h-4 w-4 text-emerald-600" />
                  <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{meal.name}</span>
                  <span className="text-[11px] text-zinc-500 font-mono bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                    {meal.time}
                  </span>
                </div>

                <button
                  onClick={() => toggleMealConsumed(meal.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition ${
                    meal.consumed
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 hover:bg-emerald-100 hover:text-emerald-700"
                  }`}
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  {meal.consumed ? "Consumido" : "Marcar"}
                </button>
              </div>

              <ul className="space-y-1 text-xs text-zinc-700 dark:text-zinc-300">
                {meal.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
