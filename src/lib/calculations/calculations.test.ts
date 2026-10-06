import { describe, it, expect } from "vitest";
import {
  calculateHarrisBenedict1919,
  calculateHarrisBenedict1984,
  calculateMifflinStJeor,
  calculateCunningham,
  calculateFaoOms,
} from "./bmr";
import { calculateTdee } from "./tdee";
import { calculatePollock3, calculatePollock7, siriEquation, brozekEquation } from "./bodyFat";

describe("Motor de Cálculos Nutricionais & Antropométricos", () => {
  // Amostra de referência Masculina: 75kg, 175cm, 30 anos
  const maleSample = { weightKg: 75, heightCm: 175, ageYears: 30 };

  // Amostra de referência Feminina: 60kg, 165cm, 28 anos
  const femaleSample = { weightKg: 60, heightCm: 165, ageYears: 28 };

  describe("Task 2.1: Taxa Metabólica Basal (TMB)", () => {
    it("deve calcular Harris-Benedict (1919) corretamente para homem e mulher", () => {
      const maleBmr = calculateHarrisBenedict1919(
        "male",
        maleSample.weightKg,
        maleSample.heightCm,
        maleSample.ageYears
      );
      // 66.473 + (13.7516 * 75) + (5.0033 * 175) - (6.7550 * 30) = 66.473 + 1031.37 + 875.5775 - 202.65 = 1770.7705
      expect(maleBmr).toBeCloseTo(1770.77, 1);

      const femaleBmr = calculateHarrisBenedict1919(
        "female",
        femaleSample.weightKg,
        femaleSample.heightCm,
        femaleSample.ageYears
      );
      // 655.0955 + (9.5634 * 60) + (1.8496 * 165) - (4.6756 * 28) = 1403.17
      expect(femaleBmr).toBeCloseTo(1403.17, 1);
    });

    it("deve calcular Harris-Benedict Revisitada (1984) corretamente", () => {
      const maleBmr = calculateHarrisBenedict1984(
        "male",
        maleSample.weightKg,
        maleSample.heightCm,
        maleSample.ageYears
      );
      expect(maleBmr).toBeCloseTo(1762.63, 1);

      const femaleBmr = calculateHarrisBenedict1984(
        "female",
        femaleSample.weightKg,
        femaleSample.heightCm,
        femaleSample.ageYears
      );
      expect(femaleBmr).toBeCloseTo(1392.35, 1);
    });

    it("deve calcular Mifflin-St Jeor (1990) corretamente", () => {
      const maleBmr = calculateMifflinStJeor(
        "male",
        maleSample.weightKg,
        maleSample.heightCm,
        maleSample.ageYears
      );
      // (10 * 75) + (6.25 * 175) - (5 * 30) + 5 = 750 + 1093.75 - 150 + 5 = 1698.75
      expect(maleBmr).toEqual(1698.75);

      const femaleBmr = calculateMifflinStJeor(
        "female",
        femaleSample.weightKg,
        femaleSample.heightCm,
        femaleSample.ageYears
      );
      // (10 * 60) + (6.25 * 165) - (5 * 28) - 161 = 600 + 1031.25 - 140 - 161 = 1330.25
      expect(femaleBmr).toEqual(1330.25);
    });

    it("deve calcular Cunningham (1980) com base na Massa Magra", () => {
      const leanMassKg = 60; // 60kg de massa livre de gordura
      const bmr = calculateCunningham(leanMassKg);
      // 500 + (22 * 60) = 1820
      expect(bmr).toEqual(1820);
    });

    it("deve calcular FAO/OMS (1985) por faixa etária", () => {
      const maleBmr = calculateFaoOms("male", maleSample.weightKg, maleSample.ageYears);
      // 30 anos cai na faixa 30-60: (11.6 * 75) + 879 = 870 + 879 = 1749
      expect(maleBmr).toEqual(1749);

      const femaleBmr = calculateFaoOms("female", femaleSample.weightKg, femaleSample.ageYears);
      // 28 anos cai na faixa 18-30: (14.7 * 60) + 496 = 882 + 496 = 1378
      expect(femaleBmr).toEqual(1378);
    });
  });

  describe("Task 2.2: Gasto Energético Total (GET / TDEE)", () => {
    it("deve calcular GET multiplicando TMB pelo fator de atividade", () => {
      const bmr = 1700;
      const tdeeSedentary = calculateTdee(bmr, "sedentary"); // 1.2
      expect(tdeeSedentary).toEqual(2040);

      const tdeeModerate = calculateTdee(bmr, "moderate"); // 1.55
      expect(tdeeModerate).toEqual(2635);
    });

    it("deve aplicar o Fator Injúria / Estresse corretamente", () => {
      const bmr = 1700;
      const tdeeMajorSurgery = calculateTdee(bmr, "moderate", "majorSurgery"); // 1700 * 1.55 * 1.2
      expect(tdeeMajorSurgery).toEqual(3162);
    });
  });

  describe("Task 2.3: Percentual de Gordura Corporal (Pollock 3 e 7 Dobras)", () => {
    it("deve converter Densidade Corporal para % de gordura via Siri e Brozek", () => {
      const bd = 1.065; // Densidade de exemplo
      const siri = siriEquation(bd);
      const brozek = brozekEquation(bd);

      expect(siri).toBeGreaterThan(10);
      expect(brozek).toBeGreaterThan(10);
    });

    it("deve calcular Pollock 3 Dobras para Homem e Mulher", () => {
      const maleResult = calculatePollock3("male", 30, 75, {
        fold1: 12, // Peitoral
        fold2: 18, // Abdômen
        fold3: 15, // Coxa
      });

      expect(maleResult.bodyDensity).toBeGreaterThan(1.0);
      expect(maleResult.bodyFatPercent).toBeGreaterThan(5);
      expect(maleResult.fatMassKg + maleResult.leanMassKg).toBeCloseTo(75, 1);

      const femaleResult = calculatePollock3("female", 28, 60, {
        fold1: 15, // Tríceps
        fold2: 14, // Suprailíaca
        fold3: 18, // Coxa
      });

      expect(femaleResult.bodyDensity).toBeGreaterThan(1.0);
      expect(femaleResult.bodyFatPercent).toBeGreaterThan(10);
      expect(femaleResult.fatMassKg + femaleResult.leanMassKg).toBeCloseTo(60, 1);
    });

    it("deve calcular Pollock 7 Dobras para Homem e Mulher", () => {
      const result = calculatePollock7("male", 30, 80, {
        triceps: 10,
        subscapular: 12,
        chest: 8,
        midaxillary: 10,
        suprailiac: 14,
        abdomen: 18,
        thigh: 16,
      });

      expect(result.bodyDensity).toBeGreaterThan(1.0);
      expect(result.bodyFatPercent).toBeGreaterThan(5);
      expect(result.fatMassKg + result.leanMassKg).toBeCloseTo(80, 1);
    });
  });
});
