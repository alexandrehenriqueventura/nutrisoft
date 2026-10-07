"use client";

import React, { useState } from "react";
import {
  AnamnesisRecord,
  BRISTOL_SCALE,
  BristolType,
  RecallMeal,
  RecallItem,
} from "@/lib/types/anamnesis";
import { TACO_DATABASE_SAMPLE } from "@/lib/tacoData";
import {
  FileText,
  HeartPulse,
  Moon,
  Droplets,
  Stethoscope,
  Plus,
  Trash2,
  CheckCircle,
  Search,
  Clock,
  UtensilsCrossed,
  AlertTriangle,
  Smile,
  ShieldAlert,
} from "lucide-react";

const COMMON_ALLERGIES = [
  "Lactose / Leite",
  "Glúten / Trigo",
  "Ovos",
  "Frutos do Mar",
  "Amendoim / Oleaginosas",
  "Soja",
  "Corantes Sintéticos",
];

const COMMON_DIGESTIVE_SYMPTOMS = [
  "Estufamento abdominal",
  "Azia / Gastrite",
  "Refluxo gastroesofágico",
  "Gases em excesso",
  "Sensação de empachamento",
  "Cólicas abdominais",
];

export function AnamnesisTab({ patientId }: { patientId: string }) {
  // Form State
  const [mainComplaint, setMainComplaint] = useState(
    "Dificuldade para perder peso, lentidão intestinal e fadiga no meio da tarde."
  );
  const [clinicalHistory, setClinicalHistory] = useState("Histórico familiar de Diabetes Tipo 2.");
  const [medications, setMedications] = useState("Nenhum medicamento de uso contínuo.");
  const [supplements, setSupplements] = useState("Vitamina D3 2000 UI/dia, Creatina 5g/dia.");
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([
    "Lactose / Leite",
  ]);

  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState<"Excelente" | "Boa" | "Regular" | "Ruim">("Boa");
  const [waterIntakeLiters, setWaterIntakeLiters] = useState(2.2);
  const [physicalActivity, setPhysicalActivity] = useState("Musculação 4x/semana + Caminhada 30min.");
  const [smokingAlcohol, setSmokingAlcohol] = useState("Álcool socialmente nos finais de semana. Não fumante.");

  const [bristolStoolType, setBristolStoolType] = useState<BristolType>(3);
  const [bowelFrequencyPerDay, setBowelFrequencyPerDay] = useState("1 vez ao dia (Manhã)");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    "Estufamento abdominal",
    "Gases em excesso",
  ]);

  // Recordatório 24 Horas
  const [recallMeals, setRecallMeals] = useState<RecallMeal[]>([
    {
      id: "r1",
      mealName: "Café da Manhã",
      time: "07:30",
      items: [
        {
          id: "ri1",
          foodDescription: "Pão, francês",
          quantityGrams: 50,
          energy_kcal: 150,
          protein_g: 4.0,
          carbohydrate_g: 29.3,
          lipid_g: 1.5,
        },
        {
          id: "ri2",
          foodDescription: "Ovo, de galinha, inteiro, cozido",
          quantityGrams: 100,
          energy_kcal: 146,
          protein_g: 13.3,
          carbohydrate_g: 0.6,
          lipid_g: 9.5,
        },
      ],
    },
    {
      id: "r2",
      mealName: "Almoço",
      time: "12:30",
      items: [
        {
          id: "ri3",
          foodDescription: "Arroz, integral, cozido",
          quantityGrams: 150,
          energy_kcal: 186,
          protein_g: 3.9,
          carbohydrate_g: 38.7,
          lipid_g: 1.5,
        },
        {
          id: "ri4",
          foodDescription: "Frango, peito, sem pele, grelhado",
          quantityGrams: 150,
          energy_kcal: 238,
          protein_g: 48.0,
          carbohydrate_g: 0,
          lipid_g: 3.7,
        },
      ],
    },
  ]);

  const [tacoSearch, setTacoSearch] = useState("");
  const [selectedMealId, setSelectedMealId] = useState("r1");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleAllergy = (item: string) => {
    if (selectedAllergies.includes(item)) {
      setSelectedAllergies(selectedAllergies.filter((a) => a !== item));
    } else {
      setSelectedAllergies([...selectedAllergies, item]);
    }
  };

  const toggleSymptom = (item: string) => {
    if (selectedSymptoms.includes(item)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== item));
    } else {
      setSelectedSymptoms([...selectedSymptoms, item]);
    }
  };

  const handleAddFoodToRecall = (food: typeof TACO_DATABASE_SAMPLE[0]) => {
    const newItem: RecallItem = {
      id: `ri-${Date.now()}`,
      foodDescription: food.description,
      quantityGrams: 100,
      energy_kcal: food.energy_kcal,
      protein_g: food.protein_g,
      carbohydrate_g: food.carbohydrate_g,
      lipid_g: food.lipid_g,
    };

    setRecallMeals(
      recallMeals.map((m) => (m.id === selectedMealId ? { ...m, items: [...m.items, newItem] } : m))
    );
  };

  const handleRemoveRecallItem = (mealId: string, itemId: string) => {
    setRecallMeals(
      recallMeals.map((m) =>
        m.id === mealId ? { ...m, items: m.items.filter((item) => item.id !== itemId) } : m
      )
    );
  };

  // Cálculo Totais R24h
  const totalRecallKcal = recallMeals.reduce(
    (acc, m) => acc + m.items.reduce((iAcc, item) => iAcc + (item.energy_kcal * item.quantityGrams) / 100, 0),
    0
  );
  const totalRecallProtein = recallMeals.reduce(
    (acc, m) => acc + m.items.reduce((iAcc, item) => iAcc + (item.protein_g * item.quantityGrams) / 100, 0),
    0
  );
  const totalRecallCarbs = recallMeals.reduce(
    (acc, m) => acc + m.items.reduce((iAcc, item) => iAcc + (item.carbohydrate_g * item.quantityGrams) / 100, 0),
    0
  );
  const totalRecallLipids = recallMeals.reduce(
    (acc, m) => acc + m.items.reduce((iAcc, item) => iAcc + (item.lipid_g * item.quantityGrams) / 100, 0),
    0
  );

  const filteredFoods = TACO_DATABASE_SAMPLE.filter(
    (food) =>
      food.description.toLowerCase().includes(tacoSearch.toLowerCase()) ||
      food.category.toLowerCase().includes(tacoSearch.toLowerCase())
  );

  const handleSaveAnamnesis = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <form onSubmit={handleSaveAnamnesis} className="space-y-6">
      {/* 1. Queixa Principal & Histórico Clínico */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
        <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b pb-2">
          <Stethoscope className="h-5 w-5 text-emerald-600" />
          1. Queixa Principal & Histórico Clínico
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="md:col-span-2">
            <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Queixa Principal / Objetivos do Paciente *
            </label>
            <textarea
              rows={2}
              required
              value={mainComplaint}
              onChange={(e) => setMainComplaint(e.target.value)}
              className="w-full p-2.5 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 text-xs"
              placeholder="Ex: Emagrecimento, hipertrofia, melhora do trânsito intestinal..."
            ></textarea>
          </div>

          <div>
            <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Histórico Médico / Patologias
            </label>
            <input
              type="text"
              value={clinicalHistory}
              onChange={(e) => setClinicalHistory(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 text-xs"
              placeholder="Ex: Hipertensão, Diabetes, SOP, Tireoide..."
            />
          </div>

          <div>
            <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Medicamentos em Uso Contínuo
            </label>
            <input
              type="text"
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 text-xs"
              placeholder="Ex: Papanicolau, Anticoncepcional, Anti-hipertensivo..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Suplementos Alimentares Atuais
            </label>
            <input
              type="text"
              value={supplements}
              onChange={(e) => setSupplements(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700 text-xs"
              placeholder="Ex: Whey protein, Creatina, Ômega 3, Multivitamínico..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Alergias & Intolerâncias Alimentares
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_ALLERGIES.map((allergy) => {
                const isSelected = selectedAllergies.includes(allergy);
                return (
                  <button
                    key={allergy}
                    type="button"
                    onClick={() => toggleAllergy(allergy)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                      isSelected
                        ? "bg-red-50 text-red-700 border-red-300 dark:bg-red-950 dark:text-red-300"
                        : "bg-zinc-50 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700"
                    }`}
                  >
                    {isSelected ? "⛔ " : "+ "}
                    {allergy}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Hábitos de Vida & Sono */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
        <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b pb-2">
          <Moon className="h-5 w-5 text-indigo-600" />
          2. Estilo de Vida, Sono & Hidratação
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div>
            <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">Horas de Sono / Noite</label>
            <input
              type="number"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 font-bold"
            />
          </div>

          <div>
            <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">Qualidade do Sono</label>
            <select
              value={sleepQuality}
              onChange={(e) => setSleepQuality(e.target.value as any)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 text-xs font-medium"
            >
              <option value="Excelente">Excelente</option>
              <option value="Boa">Boa</option>
              <option value="Regular">Regular</option>
              <option value="Ruim">Ruim</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">Consumo Hídrico (Litros/dia)</label>
            <input
              type="number"
              step="0.1"
              value={waterIntakeLiters}
              onChange={(e) => setWaterIntakeLiters(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 font-bold text-blue-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">Atividade Física Atual</label>
            <input
              type="text"
              value={physicalActivity}
              onChange={(e) => setPhysicalActivity(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 text-xs"
            />
          </div>

          <div>
            <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">Tabagismo / Bebida Alcoólica</label>
            <input
              type="text"
              value={smokingAlcohol}
              onChange={(e) => setSmokingAlcohol(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 text-xs"
            />
          </div>
        </div>
      </div>

      {/* 3. Saúde Gastrointestinal (Escala de Bristol) */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-amber-600" />
            3. Saúde Intestinal & Escala de Bristol (Formato de Fezes)
          </h3>
          <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-semibold">
            Bristol Scale Visual
          </span>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Selecione o formato predominante segundo a Escala de Bristol (1 a 7):
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {BRISTOL_SCALE.map((item) => {
              const isSelected = bristolStoolType === item.type;
              return (
                <div
                  key={item.type}
                  onClick={() => setBristolStoolType(item.type)}
                  className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                    isSelected
                      ? "ring-2 ring-emerald-500 border-emerald-500 shadow-md bg-emerald-50/40 dark:bg-emerald-950/40"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">Tipo {item.type}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${item.color}`}>
                        {item.classification}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-300 font-medium">{item.title}</p>
                    <p className="text-[10px] text-zinc-500">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Frequência Evacuatória
              </label>
              <input
                type="text"
                value={bowelFrequencyPerDay}
                onChange={(e) => setBowelFrequencyPerDay(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 text-xs"
                placeholder="Ex: 1x ao dia, a cada 2 dias..."
              />
            </div>

            <div>
              <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Sintomas Digestivos Relatados
              </label>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_DIGESTIVE_SYMPTOMS.map((sym) => {
                  const isSel = selectedSymptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                        isSel
                          ? "bg-amber-600 text-white"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200"
                      }`}
                    >
                      {sym}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recordatório de 24 Horas (R24h) */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-5 shadow-sm">
        <div className="flex items-center justify-between border-b pb-2">
          <div>
            <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              4. Recordatório de 24 Horas (R24h)
            </h3>
            <p className="text-xs text-zinc-500">
              Registro dos alimentos consumidos no dia anterior para levantamento de calorias e macros habituais.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold bg-blue-50 dark:bg-blue-950 p-2 rounded-lg border border-blue-200">
            <span>Total Recalc:</span>
            <span className="text-blue-700 dark:text-blue-300 font-bold">{Math.round(totalRecallKcal)} kcal</span>
            <span>({Math.round(totalRecallProtein)}g P | {Math.round(totalRecallCarbs)}g C | {Math.round(totalRecallLipids)}g L)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {recallMeals.map((meal) => (
              <div
                key={meal.id}
                className={`bg-white dark:bg-zinc-900 rounded-xl border p-4 space-y-2.5 ${
                  selectedMealId === meal.id ? "ring-2 ring-blue-500 border-blue-500" : "border-zinc-200 dark:border-zinc-800"
                }`}
                onClick={() => setSelectedMealId(meal.id)}
              >
                <div className="flex items-center justify-between border-b pb-1.5">
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{meal.mealName}</span>
                    <span className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-600">
                      {meal.time}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-blue-600">
                    {Math.round(
                      meal.items.reduce((acc, i) => acc + (i.energy_kcal * i.quantityGrams) / 100, 0)
                    )}{" "}
                    kcal
                  </span>
                </div>

                <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
                  {meal.items.map((item) => (
                    <div key={item.id} className="py-2 flex items-center justify-between">
                      <div>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">{item.foodDescription}</span>
                        <span className="text-[10px] text-zinc-500 block">
                          {Math.round((item.energy_kcal * item.quantityGrams) / 100)} kcal • {item.quantityGrams}g
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveRecallItem(meal.id, item.id)}
                        className="text-zinc-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3 shadow-sm h-fit text-xs">
            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Adicionar ao Recordatório (TACO)</h4>
              <p className="text-[10px] text-zinc-500">Alimento será incluído na refeição selecionada</p>
            </div>

            <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 p-2 rounded-lg border">
              <Search className="h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Buscar alimento TACO..."
                value={tacoSearch}
                onChange={(e) => setTacoSearch(e.target.value)}
                className="w-full bg-transparent outline-none text-xs"
              />
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-zinc-100">
              {filteredFoods.slice(0, 8).map((food, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between hover:bg-zinc-50 p-1 rounded">
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">{food.description}</p>
                    <p className="text-[10px] text-zinc-500">{food.energy_kcal} kcal/100g</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddFoodToRecall(food)}
                    className="p-1 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Botão de Salvar Anamnese */}
      <div className="flex items-center justify-between pt-2 border-t">
        {savedSuccess ? (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span>✅ Anamnese Clínica e Recordatório 24h salvos com sucesso!</span>
          </div>
        ) : (
          <div></div>
        )}

        <button
          type="submit"
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 ml-auto"
        >
          <CheckCircle className="h-4 w-4" />
          <span>Salvar Anamnese & Recordatório 24h</span>
        </button>
      </div>
    </form>
  );
}
