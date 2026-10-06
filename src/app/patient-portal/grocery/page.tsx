"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ArrowLeft,
  CheckSquare,
  Square,
  Apple,
  Beef,
  Milk,
  Package,
} from "lucide-react";

interface GroceryItem {
  id: string;
  category: "Hortifrúti" | "Açougue" | "Laticínios" | "Mercearia";
  name: string;
  weeklyQuantity: string;
  checked: boolean;
}

export default function GroceryListPage() {
  const [items, setItems] = useState<GroceryItem[]>([
    { id: "g1", category: "Açougue", name: "Ovos de Galinha", weeklyQuantity: "14 unidades", checked: true },
    { id: "g2", category: "Açougue", name: "Peito de Frango", weeklyQuantity: "1.05 kg", checked: false },
    { id: "g3", category: "Açougue", name: "Patinho / Carne Moída", weeklyQuantity: "840g", checked: false },
    { id: "g4", category: "Hortifrúti", name: "Banana Prata", weeklyQuantity: "7 unidades", checked: true },
    { id: "g5", category: "Hortifrúti", name: "Batata Doce", weeklyQuantity: "1.05 kg", checked: false },
    { id: "g6", category: "Hortifrúti", name: "Alface e Tomate", weeklyQuantity: "2 maços / 1 kg", checked: false },
    { id: "g7", category: "Mercearia", name: "Arroz Integral", weeklyQuantity: "1 kg", checked: false },
    { id: "g8", category: "Mercearia", name: "Feijão Carioca", weeklyQuantity: "700g", checked: false },
    { id: "g9", category: "Mercearia", name: "Aveia em Flocos", weeklyQuantity: "250g", checked: true },
    { id: "g10", category: "Mercearia", name: "Pão Francês", weeklyQuantity: "7 unidades", checked: false },
  ]);

  const toggleCheck = (id: string) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const categories = ["Açougue", "Hortifrúti", "Mercearia", "Laticínios"] as const;

  const categoryIcons = {
    Hortifrúti: Apple,
    Açougue: Beef,
    Laticínios: Milk,
    Mercearia: Package,
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20 max-w-md mx-auto border-x border-zinc-200 dark:border-zinc-800 p-4 space-y-4">
      <div className="flex items-center gap-3 border-b pb-3">
        <Link href="/patient-portal" className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-blue-600" />
            Lista de Compras Semanal
          </h1>
          <p className="text-xs text-zinc-500">Gerada automaticamente a partir do seu Plano Alimentar.</p>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((cat) => {
          const catItems = items.filter((i) => i.category === cat);
          if (catItems.length === 0) return null;
          const Icon = categoryIcons[cat];

          return (
            <div key={cat} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-2.5 shadow-sm">
              <div className="flex items-center gap-2 border-b pb-2">
                <Icon className="h-4 w-4 text-blue-600" />
                <h3 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">{cat}</h3>
              </div>

              <div className="space-y-1.5 divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
                {catItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className="pt-1.5 flex items-center justify-between cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 p-1 rounded"
                  >
                    <div className="flex items-center gap-2.5">
                      {item.checked ? (
                        <CheckSquare className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <Square className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                      )}
                      <span className={item.checked ? "line-through text-zinc-400" : "font-medium text-zinc-800 dark:text-zinc-200"}>
                        {item.name}
                      </span>
                    </div>

                    <span className="font-mono text-[11px] bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600">
                      {item.weeklyQuantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
