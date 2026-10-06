import { Gender } from "./bmr";

export interface Pollock3Skinfolds {
  // Homens: Peitoral, Abdômen, Coxa
  // Mulheres: Tríceps, Suprailíaca, Coxa
  fold1: number; // Peitoral (homens) ou Tríceps (mulheres)
  fold2: number; // Abdômen (homens) ou Suprailíaca (mulheres)
  fold3: number; // Coxa (ambos)
}

export interface Pollock7Skinfolds {
  triceps: number;
  subscapular: number;
  chest: number;
  midaxillary: number;
  suprailiac: number;
  abdomen: number;
  thigh: number;
}

export interface BodyCompositionResult {
  bodyDensity: number;
  bodyFatPercent: number; // %
  fatMassKg: number;      // kg
  leanMassKg: number;     // kg
}

/**
 * Converte Densidade Corporal (BD) em % de Gordura via Fórmula de Siri (1956)
 */
export function siriEquation(bodyDensity: number): number {
  if (bodyDensity <= 0) return 0;
  const bf = ((4.95 / bodyDensity) - 4.5) * 100;
  return Math.max(0, Math.min(100, bf));
}

/**
 * Converte Densidade Corporal (BD) em % de Gordura via Fórmula de Brozek (1963)
 */
export function brozekEquation(bodyDensity: number): number {
  if (bodyDensity <= 0) return 0;
  const bf = ((4.57 / bodyDensity) - 4.142) * 100;
  return Math.max(0, Math.min(100, bf));
}

/**
 * Pollock 3 Dobras (Jackson & Pollock)
 */
export function calculatePollock3(
  gender: Gender,
  ageYears: number,
  weightKg: number,
  skinfolds: Pollock3Skinfolds,
  formula: "siri" | "brozek" = "siri"
): BodyCompositionResult {
  const sum = skinfolds.fold1 + skinfolds.fold2 + skinfolds.fold3;
  if (sum <= 0 || weightKg <= 0 || ageYears <= 0) {
    return { bodyDensity: 0, bodyFatPercent: 0, fatMassKg: 0, leanMassKg: 0 };
  }

  let bd = 0;
  if (gender === "male") {
    // Homens: Peitoral + Abdômen + Coxa
    bd = 1.10938 - 0.0008267 * sum + 0.0000016 * (sum * sum) - 0.0002574 * ageYears;
  } else {
    // Mulheres: Tríceps + Suprailíaca + Coxa
    bd = 1.0994921 - 0.0009929 * sum + 0.0000023 * (sum * sum) - 0.0001392 * ageYears;
  }

  const bodyFatPercent = formula === "siri" ? siriEquation(bd) : brozekEquation(bd);
  const fatMassKg = weightKg * (bodyFatPercent / 100);
  const leanMassKg = weightKg - fatMassKg;

  return {
    bodyDensity: Number(bd.toFixed(5)),
    bodyFatPercent: Number(bodyFatPercent.toFixed(2)),
    fatMassKg: Number(fatMassKg.toFixed(2)),
    leanMassKg: Number(leanMassKg.toFixed(2)),
  };
}

/**
 * Pollock 7 Dobras (Jackson & Pollock 1978 / Jackson et al. 1980)
 */
export function calculatePollock7(
  gender: Gender,
  ageYears: number,
  weightKg: number,
  skinfolds: Pollock7Skinfolds,
  formula: "siri" | "brozek" = "siri"
): BodyCompositionResult {
  const sum =
    skinfolds.triceps +
    skinfolds.subscapular +
    skinfolds.chest +
    skinfolds.midaxillary +
    skinfolds.suprailiac +
    skinfolds.abdomen +
    skinfolds.thigh;

  if (sum <= 0 || weightKg <= 0 || ageYears <= 0) {
    return { bodyDensity: 0, bodyFatPercent: 0, fatMassKg: 0, leanMassKg: 0 };
  }

  let bd = 0;
  if (gender === "male") {
    bd = 1.112 - 0.00043499 * sum + 0.00000055 * (sum * sum) - 0.00028826 * ageYears;
  } else {
    bd = 1.097 - 0.00046971 * sum + 0.00000056 * (sum * sum) - 0.00012828 * ageYears;
  }

  const bodyFatPercent = formula === "siri" ? siriEquation(bd) : brozekEquation(bd);
  const fatMassKg = weightKg * (bodyFatPercent / 100);
  const leanMassKg = weightKg - fatMassKg;

  return {
    bodyDensity: Number(bd.toFixed(5)),
    bodyFatPercent: Number(bodyFatPercent.toFixed(2)),
    fatMassKg: Number(fatMassKg.toFixed(2)),
    leanMassKg: Number(leanMassKg.toFixed(2)),
  };
}
