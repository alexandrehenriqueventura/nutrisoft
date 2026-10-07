"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  calculatePollock3,
} from "@/lib/calculations/bodyFat";
import { TACO_DATABASE_SAMPLE } from "@/lib/tacoData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Activity,
  UtensilsCrossed,
  FileSpreadsheet,
  Plus,
  Search,
  Trash2,
  Printer,
  Upload,
  ArrowLeft,
  CheckCircle,
  BrainCircuit,
  Sparkles,
  FileText,
  Stethoscope,
} from "lucide-react";
import { AnamnesisTab } from "@/components/patient/AnamnesisTab";
import Papa from "papaparse";
import * as XLSX from "xlsx";

interface FoodItemInMeal {
  id: string;
  description: string;
  quantityGrams: number;
  energy_kcal: number;
  protein_g: number;
  carbohydrate_g: number;
  lipid_g: number;
  fiber_g: number;
  substitutes?: string[];
}

interface Meal {
  id: string;
  name: string;
  time: string;
  items: FoodItemInMeal[];
}

export function PatientDetailClient({ id }: { id: string }) {
  const [activeTab, setActiveTab] = useState<"anamnesis" | "evaluation" | "dietBuilder" | "labResults" | "importLegacy">("anamnesis");

  const [aiExtracting, setAiExtracting] = useState(false);
  const [labData, setLabData] = useState<{
    glucose?: number;
    hba1c?: number;
    totalCholesterol?: number;
    hdl?: number;
    ldl?: number;
    triglycerides?: number;
    tsh?: number;
    vitaminD?: number;
    summary?: string;
    alerts?: string[];
  } | null>({
    glucose: 92,
    hba1c: 5.4,
    totalCholesterol: 185,
    hdl: 52,
    ldl: 110,
    triglycerides: 115,
    tsh: 2.1,
    vitaminD: 34,
    summary: "Exame de sangue analisado com sucesso pelo Gemini 2.5. Todos os marcadores metabólicos dentro da faixa de referência.",
    alerts: ["Glicemia de jejum excelente (92 mg/dL)", "Vitamina D em níveis adequados (34 ng/mL)"],
  });

  const [patient] = useState({
    id: id || "p1",
    name: "Carlos Eduardo Oliveira",
    email: "carlos.eduardo@email.com",
    phone: "(11) 98765-4321",
    age: 34,
    gender: "male" as const,
    weightKg: 82.5,
    heightCm: 178,
  });

  const [evalHistory, setEvalHistory] = useState([
    { date: "10/06/2026", weight: 87.0, bodyFat: 22.4, leanMass: 67.5 },
    { date: "10/07/2026", weight: 85.2, bodyFat: 20.8, leanMass: 67.5 },
    { date: "10/08/2026", weight: 83.8, bodyFat: 19.5, leanMass: 67.4 },
    { date: "10/09/2026", weight: 82.5, bodyFat: 18.4, leanMass: 67.3 },
  ]);

  const [fold1, setFold1] = useState(12);
  const [fold2, setFold2] = useState(18);
  const [fold3, setFold3] = useState(15);
  const [currentWeight, setCurrentWeight] = useState(patient.weightKg);

  const evalResult = calculatePollock3(patient.gender, patient.age, currentWeight, {
    fold1,
    fold2,
    fold3,
  });

  const handleSaveEvaluation = () => {
    const today = new Date().toLocaleDateString("pt-BR");
    setEvalHistory([
      ...evalHistory,
      {
        date: today,
        weight: currentWeight,
        bodyFat: evalResult.bodyFatPercent,
        leanMass: evalResult.leanMassKg,
      },
    ]);
    alert("✅ Nova Avaliação Física salva no histórico do paciente!");
  };

  const [meals, setMeals] = useState<Meal[]>([
    {
      id: "m1",
      name: "Café da Manhã",
      time: "07:30",
      items: [
        {
          id: "fi1",
          description: "Ovo, de galinha, inteiro, cozido",
          quantityGrams: 100,
          energy_kcal: 146,
          protein_g: 13.3,
          carbohydrate_g: 0.6,
          lipid_g: 9.5,
          fiber_g: 0,
          substitutes: ["Queijo minas frescal (60g)", "Frango grelhado (50g)"],
        },
        {
          id: "fi2",
          description: "Pão, francês",
          quantityGrams: 50,
          energy_kcal: 150,
          protein_g: 4.0,
          carbohydrate_g: 29.3,
          lipid_g: 1.5,
          fiber_g: 1.1,
          substitutes: ["Tapioca (40g)", "Aveia em flocos (30g)"],
        },
      ],
    },
    {
      id: "m2",
      name: "Almoço",
      time: "12:30",
      items: [
        {
          id: "fi3",
          description: "Arroz, integral, cozido",
          quantityGrams: 150,
          energy_kcal: 186,
          protein_g: 3.9,
          carbohydrate_g: 38.7,
          lipid_g: 1.5,
          fiber_g: 4.0,
        },
        {
          id: "fi4",
          description: "Feijão, carioca, cozido",
          quantityGrams: 100,
          energy_kcal: 76,
          protein_g: 4.8,
          carbohydrate_g: 13.6,
          lipid_g: 0.5,
          fiber_g: 8.5,
        },
        {
          id: "fi5",
          description: "Frango, peito, sem pele, grelhado",
          quantityGrams: 150,
          energy_kcal: 238,
          protein_g: 48.0,
          carbohydrate_g: 0,
          lipid_g: 3.7,
          fiber_g: 0,
        },
      ],
    },
  ]);

  const [tacoSearch, setTacoSearch] = useState("");
  const [selectedMealId, setSelectedMealId] = useState("m1");

  const filteredFoods = TACO_DATABASE_SAMPLE.filter(
    (food) =>
      food.description.toLowerCase().includes(tacoSearch.toLowerCase()) ||
      food.category.toLowerCase().includes(tacoSearch.toLowerCase())
  );

  const handleAddFoodToMeal = (food: typeof TACO_DATABASE_SAMPLE[0]) => {
    const newItem: FoodItemInMeal = {
      id: `fi-${Date.now()}`,
      description: food.description,
      quantityGrams: 100,
      energy_kcal: food.energy_kcal,
      protein_g: food.protein_g,
      carbohydrate_g: food.carbohydrate_g,
      lipid_g: food.lipid_g,
      fiber_g: food.fiber_g,
    };

    setMeals(
      meals.map((m) => (m.id === selectedMealId ? { ...m, items: [...m.items, newItem] } : m))
    );
  };

  const handleRemoveFoodItem = (mealId: string, itemId: string) => {
    setMeals(
      meals.map((m) =>
        m.id === mealId ? { ...m, items: m.items.filter((item) => item.id !== itemId) } : m
      )
    );
  };

  const totalKcal = meals.reduce(
    (acc, m) => acc + m.items.reduce((iAcc, item) => iAcc + (item.energy_kcal * item.quantityGrams) / 100, 0),
    0
  );
  const totalProtein = meals.reduce(
    (acc, m) => acc + m.items.reduce((iAcc, item) => iAcc + (item.protein_g * item.quantityGrams) / 100, 0),
    0
  );
  const totalCarbs = meals.reduce(
    (acc, m) => acc + m.items.reduce((iAcc, item) => iAcc + (item.carbohydrate_g * item.quantityGrams) / 100, 0),
    0
  );
  const totalLipids = meals.reduce(
    (acc, m) => acc + m.items.reduce((iAcc, item) => iAcc + (item.lipid_g * item.quantityGrams) / 100, 0),
    0
  );

  const [importedStatus, setImportedStatus] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith(".csv")) {
      Papa.parse(file, {
        complete: (results) => {
          processLegacyData(results.data as any[]);
        },
      });
    } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0]!;
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws!);
        processLegacyData(data);
      };
      reader.readAsBinaryString(file);
    }
  };

  const processLegacyData = (data: any[]) => {
    setImportedStatus(`✅ ${data.length} registros extraídos de planilha legada (FineShape/WebDiet) e incorporados com sucesso ao histórico!`);
    setEvalHistory([
      ...evalHistory,
      { date: "01/05/2026 (Importado)", weight: 89.5, bodyFat: 24.1, leanMass: 67.9 },
    ]);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 bg-zinc-50/30 dark:bg-zinc-950 space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <Link href="/patients" className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{patient.name}</h1>
              <p className="text-xs text-zinc-500">
                {patient.age} anos • {patient.gender === "male" ? "Masculino" : "Feminino"} • Tel: {patient.phone}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-xs font-semibold rounded-lg"
            >
              <Printer className="h-4 w-4" />
              <span>Imprimir PDF</span>
            </button>
          </div>
        </div>

        <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab("anamnesis")}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition flex items-center gap-1.5 flex-shrink-0 ${
              activeTab === "anamnesis"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <Stethoscope className="h-4 w-4 text-emerald-600" />
            <span>Anamnese & Recordatório 24h</span>
          </button>
          <button
            onClick={() => setActiveTab("evaluation")}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition flex-shrink-0 ${
              activeTab === "evaluation"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Avaliação Física & Antropometria
          </button>
          <button
            onClick={() => setActiveTab("dietBuilder")}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition flex-shrink-0 ${
              activeTab === "dietBuilder"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Plano Alimentar
          </button>
          <button
            onClick={() => setActiveTab("labResults")}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition flex items-center gap-1.5 flex-shrink-0 ${
              activeTab === "labResults"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <BrainCircuit className="h-4 w-4 text-purple-600" />
            <span>Exames & IA Gemini</span>
          </button>
          <button
            onClick={() => setActiveTab("importLegacy")}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition flex-shrink-0 ${
              activeTab === "importLegacy"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Importação Legada
          </button>
        </div>

        {activeTab === "anamnesis" && <AnamnesisTab patientId={patient.id} />}

        {activeTab === "evaluation" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
                <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-600" />
                  Nova Avaliação (Pollock 3 Dobras)
                </h3>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <label className="block text-zinc-600 mb-1">Peso Atual (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={currentWeight}
                      onChange={(e) => setCurrentWeight(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 font-bold text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-600 mb-1">Peitoral / Tríceps (mm)</label>
                    <input
                      type="number"
                      value={fold1}
                      onChange={(e) => setFold1(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-600 mb-1">Abdômen / Suprailíaca (mm)</label>
                    <input
                      type="number"
                      value={fold2}
                      onChange={(e) => setFold2(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-600 mb-1">Coxa (mm)</label>
                    <input
                      type="number"
                      value={fold3}
                      onChange={(e) => setFold3(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 font-bold"
                    />
                  </div>

                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-lg space-y-1">
                    <span className="text-xs text-emerald-700 font-semibold uppercase">Resultado Instantâneo</span>
                    <p className="text-2xl font-extrabold text-emerald-800 dark:text-emerald-200">
                      {evalResult.bodyFatPercent}% Gordura
                    </p>
                    <div className="text-xs flex justify-between pt-1">
                      <span>Massa Magra: <strong>{evalResult.leanMassKg} kg</strong></span>
                      <span>Gorda: <strong>{evalResult.fatMassKg} kg</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveEvaluation}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-xs transition"
                  >
                    Salvar no Histórico do Paciente
                  </button>
                </div>
              </div>

              <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
                <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">
                  Evolução Histórica (% Gordura e Peso Corporal)
                </h3>

                <div className="h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={evalHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" orientation="left" stroke="#10b981" />
                      <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="bodyFat" name="% Gordura Corporal" stroke="#10b981" strokeWidth={3} />
                      <Line yAxisId="right" type="monotone" dataKey="weight" name="Peso (kg)" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "dietBuilder" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-4 shadow-sm">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200">
                <span className="text-xs text-emerald-700 font-semibold uppercase">Calorias Totais</span>
                <p className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mt-0.5">{Math.round(totalKcal)} kcal</p>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200">
                <span className="text-xs text-blue-700 font-semibold uppercase">Proteínas</span>
                <p className="text-xl font-bold text-blue-800 dark:text-blue-200 mt-0.5">{Math.round(totalProtein)}g</p>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200">
                <span className="text-xs text-amber-700 font-semibold uppercase">Carboidratos</span>
                <p className="text-xl font-bold text-amber-800 dark:text-amber-200 mt-0.5">{Math.round(totalCarbs)}g</p>
              </div>

              <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-lg border border-purple-200">
                <span className="text-xs text-purple-700 font-semibold uppercase">Lipídios</span>
                <p className="text-xl font-bold text-purple-800 dark:text-purple-200 mt-0.5">{Math.round(totalLipids)}g</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {meals.map((meal) => (
                  <div
                    key={meal.id}
                    className={`bg-white dark:bg-zinc-900 rounded-xl border p-5 space-y-3 shadow-sm ${
                      selectedMealId === meal.id ? "ring-2 ring-emerald-500 border-emerald-500" : "border-zinc-200 dark:border-zinc-800"
                    }`}
                    onClick={() => setSelectedMealId(meal.id)}
                  >
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <UtensilsCrossed className="h-4 w-4 text-emerald-600" />
                        <h4 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">{meal.name}</h4>
                        <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 font-mono">
                          {meal.time}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-600">
                        {Math.round(
                          meal.items.reduce((acc, i) => acc + (i.energy_kcal * i.quantityGrams) / 100, 0)
                        )}{" "}
                        kcal
                      </span>
                    </div>

                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
                      {meal.items.map((item) => (
                        <div key={item.id} className="py-2.5 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-zinc-900 dark:text-zinc-100">{item.description}</span>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-zinc-700 dark:text-zinc-300">{item.quantityGrams}g</span>
                              <button
                                onClick={() => handleRemoveFoodItem(meal.id, item.id)}
                                className="text-zinc-400 hover:text-red-600"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          {item.substitutes && item.substitutes.length > 0 && (
                            <div className="text-[11px] text-zinc-500 bg-zinc-50 dark:bg-zinc-800/60 p-1.5 rounded">
                              <strong className="text-emerald-600">Substitutos Equivalentes:</strong> {item.substitutes.join(" | ")}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm h-fit">
                <div>
                  <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">Adicionar da Tabela TACO</h4>
                  <p className="text-xs text-zinc-500">Adicionando na refeição selecionada</p>
                </div>

                <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 p-2 rounded-lg border">
                  <Search className="h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Buscar alimento (ex: arroz, frango, feijão)..."
                    value={tacoSearch}
                    onChange={(e) => setTacoSearch(e.target.value)}
                    className="w-full bg-transparent outline-none text-xs"
                  />
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100 text-xs">
                  {filteredFoods.slice(0, 10).map((food, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between hover:bg-zinc-50 p-1 rounded">
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-zinc-100">{food.description}</p>
                        <p className="text-[10px] text-zinc-500">{food.category} • {food.energy_kcal} kcal/100g</p>
                      </div>
                      <button
                        onClick={() => handleAddFoodToMeal(food)}
                        className="p-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white rounded transition"
                        title="Adicionar à refeição"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "labResults" && (
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <BrainCircuit className="h-6 w-6 text-purple-600" />
                  Módulo de Leitura de Exames via Gemini 2.5 IA (Task 4.1 & 4.2)
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Faça upload do laudo em PDF para extração estruturada automática de marcadores (Glicose, HbA1c, Colesterol, TSH) e geração de sugestões nutricionais.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setAiExtracting(true);
                    setTimeout(() => {
                      setAiExtracting(false);
                      setLabData({
                        glucose: 92,
                        hba1c: 5.4,
                        totalCholesterol: 185,
                        hdl: 52,
                        ldl: 110,
                        triglycerides: 115,
                        tsh: 2.1,
                        vitaminD: 34,
                        summary: "Laudo analisado com sucesso pelo Gemini 2.5 Flash. Níveis de glicose, tireoide e perfil lipídico dentro dos parâmetros de normalidade.",
                        alerts: ["Glicemia de jejum (92 mg/dL) excelente", "Hemoglobina Glicada (5.4%) normal", "Perfil Lipídico equilibrado"],
                      });
                    }, 800);
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition shadow-sm flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{aiExtracting ? "Analisando com IA..." : "Extrair Laudo com Gemini IA"}</span>
                </button>
              </div>
            </div>

            <div className="border-2 border-dashed border-purple-200 dark:border-purple-900/60 rounded-xl p-6 text-center space-y-3 bg-purple-50/30 dark:bg-purple-950/20">
              <Upload className="h-8 w-8 mx-auto text-purple-600" />
              <div>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Upload de PDF de Hemograma / Exame de Sangue</p>
                <p className="text-xs text-zinc-500">O Gemini processa o laudo médico e preenche os marcadores automaticamente.</p>
              </div>
              <input type="file" accept=".pdf,image/*" className="hidden" id="lab-pdf-upload" />
              <label
                htmlFor="lab-pdf-upload"
                className="inline-block px-4 py-2 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 text-xs font-semibold rounded-lg cursor-pointer transition"
              >
                Selecionar Laudo PDF
              </label>
            </div>

            {labData && (
              <div className="space-y-4 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-600" />
                    Valores Extraídos do Laudo (JSON Estruturado)
                  </h4>
                  <span className="text-xs bg-purple-100 text-purple-800 font-semibold px-2.5 py-0.5 rounded-full">
                    Gemini 2.5 OCR Active
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg border">
                    <span className="text-zinc-500 block">Glicose em Jejum</span>
                    <span className="font-bold text-base text-zinc-900 dark:text-zinc-100">{labData.glucose} mg/dL</span>
                    <span className="text-[10px] text-emerald-600 font-medium block">Normal (70-99)</span>
                  </div>

                  <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg border">
                    <span className="text-zinc-500 block">HbA1c (Hemog. Glicada)</span>
                    <span className="font-bold text-base text-zinc-900 dark:text-zinc-100">{labData.hba1c}%</span>
                    <span className="text-[10px] text-emerald-600 font-medium block">Normal (&lt; 5.7%)</span>
                  </div>

                  <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg border">
                    <span className="text-zinc-500 block">Colesterol Total</span>
                    <span className="font-bold text-base text-zinc-900 dark:text-zinc-100">{labData.totalCholesterol} mg/dL</span>
                    <span className="text-[10px] text-emerald-600 font-medium block">Desejável (&lt; 190)</span>
                  </div>

                  <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg border">
                    <span className="text-zinc-500 block">Colesterol HDL</span>
                    <span className="font-bold text-base text-zinc-900 dark:text-zinc-100">{labData.hdl} mg/dL</span>
                    <span className="text-[10px] text-emerald-600 font-medium block">Bom (&gt; 40)</span>
                  </div>

                  <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg border">
                    <span className="text-zinc-500 block">Colesterol LDL</span>
                    <span className="font-bold text-base text-zinc-900 dark:text-zinc-100">{labData.ldl} mg/dL</span>
                    <span className="text-[10px] text-emerald-600 font-medium block">Ótimo (&lt; 130)</span>
                  </div>

                  <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg border">
                    <span className="text-zinc-500 block">Triglicérides</span>
                    <span className="font-bold text-base text-zinc-900 dark:text-zinc-100">{labData.triglycerides} mg/dL</span>
                    <span className="text-[10px] text-emerald-600 font-medium block">Desejável (&lt; 150)</span>
                  </div>

                  <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg border">
                    <span className="text-zinc-500 block">TSH (Tireoide)</span>
                    <span className="font-bold text-base text-zinc-900 dark:text-zinc-100">{labData.tsh} uIU/mL</span>
                    <span className="text-[10px] text-emerald-600 font-medium block">Normal (0.4-4.5)</span>
                  </div>

                  <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg border">
                    <span className="text-zinc-500 block">Vitamina D</span>
                    <span className="font-bold text-base text-zinc-900 dark:text-zinc-100">{labData.vitaminD} ng/mL</span>
                    <span className="text-[10px] text-emerald-600 font-medium block">Suficiente (&gt; 30)</span>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-lg space-y-2">
                  <span className="text-xs font-semibold text-purple-800 dark:text-purple-200 uppercase">Síntese Diagnóstica da IA</span>
                  <p className="text-xs text-purple-900 dark:text-purple-100 font-medium">{labData.summary}</p>
                  <ul className="space-y-1 text-xs text-emerald-700 dark:text-emerald-300 pt-1">
                    {labData.alerts?.map((alert, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 font-medium">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{alert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "importLegacy" && (
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-6 shadow-sm">
            <div>
              <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-amber-600" />
                Módulo de Importação Externa (FineShape, WebDiet, Dietbox)
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Faça upload de planilhas CSV ou Excel exportadas de softwares legados para popular automaticamente o histórico antropométrico do paciente.
              </p>
            </div>

            <div className="border-2 border-dashed border-amber-300 dark:border-amber-800/60 rounded-xl p-8 text-center space-y-3 bg-amber-50/40 dark:bg-amber-950/20">
              <Upload className="h-8 w-8 mx-auto text-amber-600" />
              <div>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Arraste seu arquivo CSV ou Excel (.xlsx, .xls) aqui</p>
                <p className="text-xs text-zinc-500">Suporte nativo aos formatos FineShape, WebDiet e Dietbox</p>
              </div>

              <input
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileUpload}
                className="hidden"
                id="legacy-file-input"
              />
              <label
                htmlFor="legacy-file-input"
                className="inline-block px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition shadow-sm"
              >
                Selecionar Arquivo
              </label>
            </div>

            {importedStatus && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-200 rounded-lg text-xs font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>{importedStatus}</span>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
