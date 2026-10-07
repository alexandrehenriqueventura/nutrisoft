export type BristolType = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface BristolDescription {
  type: BristolType;
  title: string;
  description: string;
  classification: "Constipação Severa" | "Constipação" | "Ideal / Normal" | "Tendência a Diarreia" | "Diarreia";
  color: string;
}

export const BRISTOL_SCALE: BristolDescription[] = [
  {
    type: 1,
    title: "Tipo 1: Caroços duros separados",
    description: "Caroços duros e separados, como nozes. Difíceis de passar.",
    classification: "Constipação Severa",
    color: "text-amber-800 bg-amber-100 dark:bg-amber-950",
  },
  {
    type: 2,
    title: "Tipo 2: Formato de salsicha, empelotado",
    description: "Formato de salsicha, mas empelotado e aglomerado.",
    classification: "Constipação",
    color: "text-amber-700 bg-amber-50 dark:bg-amber-900/60",
  },
  {
    type: 3,
    title: "Tipo 3: Formato de salsicha com ranhuras",
    description: "Como uma salsicha, mas com ranhuras na superfície.",
    classification: "Ideal / Normal",
    color: "text-emerald-700 bg-emerald-50 dark:bg-emerald-950",
  },
  {
    type: 4,
    title: "Tipo 4: Formato de salsicha ou cobra, macia",
    description: "Como uma salsicha ou cobra, lisa e macia. Formato ideal.",
    classification: "Ideal / Normal",
    color: "text-emerald-800 bg-emerald-100 dark:bg-emerald-900",
  },
  {
    type: 5,
    title: "Tipo 5: Pedaços de massa macia com bordas nítidas",
    description: "Pedaços de massa macia com bordas nítidas. Passam facilmente.",
    classification: "Tendência a Diarreia",
    color: "text-yellow-700 bg-yellow-50 dark:bg-yellow-950",
  },
  {
    type: 6,
    title: "Tipo 6: Pedaços esfarrapados, massa pastosa",
    description: "Pedaços esfarrapados, massa pastosa com bordas irregulares.",
    classification: "Tendência a Diarreia",
    color: "text-orange-700 bg-orange-100 dark:bg-orange-950",
  },
  {
    type: 7,
    title: "Tipo 7: Aquoso, sem partes sólidas",
    description: "Totalmente líquido, sem partes sólidas. Diarreia severa.",
    classification: "Diarreia",
    color: "text-red-700 bg-red-100 dark:bg-red-950",
  },
];

export interface RecallItem {
  id: string;
  foodDescription: string;
  quantityGrams: number;
  energy_kcal: number;
  protein_g: number;
  carbohydrate_g: number;
  lipid_g: number;
}

export interface RecallMeal {
  id: string;
  mealName: string; // Ex: Café da Manhã, Almoço
  time: string;
  items: RecallItem[];
}

export interface AnamnesisRecord {
  id: string;
  createdAt: string;
  // Histórico Clínico & Queixa
  mainComplaint: string;
  clinicalHistory: string;
  medications: string;
  supplements: string;
  allergiesIntolerances: string[];
  
  // Hábitos & Estilo de Vida
  sleepHours: number;
  sleepQuality: "Excelente" | "Boa" | "Regular" | "Ruim";
  waterIntakeLiters: number;
  physicalActivity: string;
  smokingAlcohol: string;

  // Saúde Gastrointestinal (Escala de Bristol)
  bristolStoolType: BristolType;
  bowelFrequencyPerDay: string;
  digestiveSymptoms: string[]; // Ex: Azia, Estufamento, Gases, Refluxo

  // Recordatório 24 Horas
  recall24h: RecallMeal[];
}
