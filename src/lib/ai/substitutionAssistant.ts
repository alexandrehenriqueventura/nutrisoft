import { GoogleGenAI, Type } from "@google/genai";

export interface FoodSubstitutionRequest {
  originalFood: string;
  originalGrams: number;
  originalKcal: number;
  originalProtein: number;
  originalCarbs: number;
  originalLipids: number;
  patientRestrictions?: string[];
}

export interface SubstitutionOption {
  foodName: string;
  suggestedGrams: number;
  kcal: number;
  protein: number;
  carbs: number;
  lipids: number;
  reasoning: string;
}

export async function suggestFoodSubstitutions(
  req: FoodSubstitutionRequest
): Promise<SubstitutionOption[]> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("⚠️ GEMINI_API_KEY não configurada. Retornando sugestões mock.");
    return [
      {
        foodName: "Tapioca de Goma",
        suggestedGrams: 40,
        kcal: req.originalKcal,
        protein: 0.5,
        carbs: 35.0,
        lipids: 0.2,
        reasoning: "Equivalente isocalórico prático para o café da manhã.",
      },
      {
        foodName: "Batata Doce Cozida",
        suggestedGrams: 120,
        kcal: req.originalKcal,
        protein: 1.0,
        carbs: 34.0,
        lipids: 0.2,
        reasoning: "Opção de baixo índice glicêmico e rica em fibras.",
      },
    ];
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Você é um nutricionista especialista em cálculo de dietas.
Recomende 3 opções de substitutos alimentares equivalentes para o alimento original:
Alimento Original: ${req.originalFood} (${req.originalGrams}g)
Calorias: ${req.originalKcal} kcal | Proteínas: ${req.originalProtein}g | Carboidratos: ${req.originalCarbs}g | Lipídios: ${req.originalLipids}g
Restrições/Preferências do Paciente: ${req.patientRestrictions?.join(", ") || "Nenhuma"}

Para cada substituto, forneça a quantidade exata em gramas necessária para manter a equivalência calórica/macronutricional e a justificativa nutricional.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ text: prompt }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              foodName: { type: Type.STRING, description: "Nome do alimento substituto" },
              suggestedGrams: { type: Type.NUMBER, description: "Porção sugerida em gramas" },
              kcal: { type: Type.NUMBER, description: "Calorias totais" },
              protein: { type: Type.NUMBER, description: "Proteínas em gramas" },
              carbs: { type: Type.NUMBER, description: "Carboidratos em gramas" },
              lipids: { type: Type.NUMBER, description: "Lipídios em gramas" },
              reasoning: { type: Type.STRING, description: "Justificativa nutricional" },
            },
            required: ["foodName", "suggestedGrams", "kcal", "protein", "carbs", "lipids", "reasoning"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("Sem resposta do Gemini");
    return JSON.parse(text) as SubstitutionOption[];
  } catch (error) {
    console.error("Erro no assistente de substituição via Gemini API:", error);
    throw error;
  }
}
