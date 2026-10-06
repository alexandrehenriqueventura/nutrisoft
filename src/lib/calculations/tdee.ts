export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "heavy"
  | "athlete";

export type InjuryFactor =
  | "none"
  | "minorSurgery"
  | "majorSurgery"
  | "infectionMinor"
  | "infectionModerate"
  | "infectionSevere"
  | "traumaBlunt"
  | "traumaHead"
  | "burns30"
  | "burns50";

export const ACTIVITY_FACTORS: Record<ActivityLevel, { factor: number; label: string }> = {
  sedentary: { factor: 1.2, label: "Sedentário (pouco ou nenhum exercício)" },
  light: { factor: 1.375, label: "Leve (exercício 1 a 3 dias/semana)" },
  moderate: { factor: 1.55, label: "Moderado (exercício 3 a 5 dias/semana)" },
  heavy: { factor: 1.725, label: "Intenso (exercício 6 a 7 dias/semana)" },
  athlete: { factor: 1.9, label: "Muito Intenso / Atleta (treino 2x/dia)" },
};

export const INJURY_FACTORS: Record<InjuryFactor, { factor: number; label: string }> = {
  none: { factor: 1.0, label: "Sem Injúria / Paciente Hígido (1.0)" },
  minorSurgery: { factor: 1.1, label: "Cirurgia Menor (1.1)" },
  majorSurgery: { factor: 1.2, label: "Cirurgia Maior (1.2)" },
  infectionMinor: { factor: 1.2, label: "Infecção Leve (1.2)" },
  infectionModerate: { factor: 1.3, label: "Infecção Moderada (1.3)" },
  infectionSevere: { factor: 1.4, label: "Infecção Grave / Sepse (1.4)" },
  traumaBlunt: { factor: 1.35, label: "Traumatismo Esquelético (1.35)" },
  traumaHead: { factor: 1.6, label: "Trauma Crânio-Encefálico (1.6)" },
  burns30: { factor: 1.5, label: "Queimadura 30-50% (1.5)" },
  burns50: { factor: 2.0, label: "Queimadura > 50% (2.0)" },
};

/**
 * Cálculo do Gasto Energético Total (GET / TDEE)
 * GET = TMB * Fator de Atividade * Fator Injúria
 */
export function calculateTdee(
  bmr: number,
  activityLevel: ActivityLevel,
  injuryFactor: InjuryFactor = "none"
): number {
  if (bmr <= 0) return 0;

  const actCoeff = ACTIVITY_FACTORS[activityLevel]?.factor ?? 1.2;
  const injCoeff = INJURY_FACTORS[injuryFactor]?.factor ?? 1.0;

  return bmr * actCoeff * injCoeff;
}
