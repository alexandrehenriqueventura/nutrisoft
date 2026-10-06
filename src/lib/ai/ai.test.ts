import { describe, it, expect } from "vitest";
import { extractLabResultsFromPDF } from "./labExtractor";
import { suggestFoodSubstitutions } from "./substitutionAssistant";

describe("ETAPA 4: Recursos Inteligentes com Google Gemini (IA)", () => {
  it("Task 4.1: deve extrair marcadores laboratoriais em schema JSON estruturado", async () => {
    const mockBase64 = "dGVzdC1wZGYtY29udGVudA==";
    const result = await extractLabResultsFromPDF(mockBase64);

    expect(result).toHaveProperty("glucose");
    expect(result).toHaveProperty("summary");
    expect(Array.isArray(result.alerts)).toBe(true);
  });

  it("Task 4.2: deve sugerir substitutos de alimentos com equivalência nutricional", async () => {
    const req = {
      originalFood: "Pão Francês",
      originalGrams: 50,
      originalKcal: 150,
      originalProtein: 4.0,
      originalCarbs: 29.3,
      originalLipids: 1.5,
    };

    const suggestions = await suggestFoodSubstitutions(req);

    expect(Array.isArray(suggestions)).toBe(true);
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0]).toHaveProperty("foodName");
    expect(suggestions[0]).toHaveProperty("suggestedGrams");
  });
});
