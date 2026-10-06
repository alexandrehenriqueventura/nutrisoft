export type Gender = "male" | "female";

/**
 * Harris-Benedict (1919)
 * Homens: BMR = 66.4730 + (13.7516 * W) + (5.0033 * H) - (6.7550 * A)
 * Mulheres: BMR = 655.0955 + (9.5634 * W) + (1.8496 * H) - (4.6756 * A)
 */
export function calculateHarrisBenedict1919(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  ageYears: number
): number {
  if (weightKg <= 0 || heightCm <= 0 || ageYears <= 0) return 0;

  if (gender === "male") {
    return 66.473 + 13.7516 * weightKg + 5.0033 * heightCm - 6.755 * ageYears;
  }
  return 655.0955 + 9.5634 * weightKg + 1.8496 * heightCm - 4.6756 * ageYears;
}

/**
 * Harris-Benedict Revisitada por Roza e Shizgal (1984)
 * Homens: BMR = 88.362 + (13.397 * W) + (4.799 * H) - (5.677 * A)
 * Mulheres: BMR = 447.593 + (9.247 * W) + (3.098 * H) - (4.330 * A)
 */
export function calculateHarrisBenedict1984(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  ageYears: number
): number {
  if (weightKg <= 0 || heightCm <= 0 || ageYears <= 0) return 0;

  if (gender === "male") {
    return 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * ageYears;
  }
  return 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * ageYears;
}

/**
 * Mifflin-St Jeor (1990) - Padrão-ouro moderno
 * BMR = (10 * W) + (6.25 * H) - (5 * A) + s (onde s = +5 para homens e -161 para mulheres)
 */
export function calculateMifflinStJeor(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  ageYears: number
): number {
  if (weightKg <= 0 || heightCm <= 0 || ageYears <= 0) return 0;

  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  return gender === "male" ? base + 5 : base - 161;
}

/**
 * Cunningham (1980) - Baseado na Massa Livre de Gordura (Massa Magra)
 * BMR = 500 + 22 * FFM (kg)
 */
export function calculateCunningham(leanMassKg: number): number {
  if (leanMassKg <= 0) return 0;
  return 500 + 22 * leanMassKg;
}

/**
 * Fórmulas FAO/OMS (1985)
 * Agrupadas por faixas etárias
 */
export function calculateFaoOms(
  gender: Gender,
  weightKg: number,
  ageYears: number
): number {
  if (weightKg <= 0 || ageYears < 0) return 0;

  if (gender === "male") {
    if (ageYears < 3) return 60.9 * weightKg - 54;
    if (ageYears < 10) return 22.7 * weightKg + 495;
    if (ageYears < 18) return 17.5 * weightKg + 651;
    if (ageYears < 30) return 15.3 * weightKg + 679;
    if (ageYears < 60) return 11.6 * weightKg + 879;
    return 13.5 * weightKg + 487;
  } else {
    if (ageYears < 3) return 61.0 * weightKg - 51;
    if (ageYears < 10) return 22.5 * weightKg + 499;
    if (ageYears < 18) return 12.2 * weightKg + 746;
    if (ageYears < 30) return 14.7 * weightKg + 496;
    if (ageYears < 60) return 8.7 * weightKg + 829;
    return 10.5 * weightKg + 596;
  }
}
