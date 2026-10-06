import { GoogleGenAI, Type } from "@google/genai";

export interface LabResultData {
  glucose?: number;
  hba1c?: number;
  totalCholesterol?: number;
  hdl?: number;
  ldl?: number;
  triglycerides?: number;
  tsh?: number;
  ferritin?: number;
  vitaminD?: number;
  summary: string;
  alerts: string[];
}

export async function extractLabResultsFromPDF(
  base64Data: string,
  mimeType: string = "application/pdf"
): Promise<LabResultData> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("⚠️ GEMINI_API_KEY não configurada. Retornando extração mock de demonstração.");
    return {
      glucose: 92,
      hba1c: 5.4,
      totalCholesterol: 185,
      hdl: 52,
      ldl: 110,
      triglycerides: 115,
      tsh: 2.1,
      ferritin: 140,
      vitaminD: 34,
      summary: "Exame dentro dos padrões normais com leve atenção recomendada ao lipidograma.",
      alerts: ["Glicemia de jejum excelente (92 mg/dL)", "Vitamina D em níveis adequados (34 ng/mL)"],
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Analise este laudo laboratorial de exames de sangue (hemograma/bioquímica). 
Extraia estritamente em formato JSON os seguintes valores numéricos encontrados:
- Glicose em jejum (mg/dL)
- Hemoglobina Glicada HbA1c (%)
- Colesterol Total (mg/dL)
- Colesterol HDL (mg/dL)
- Colesterol LDL (mg/dL)
- Triglicérides (mg/dL)
- TSH (uIU/mL)
- Ferritina (ng/mL)
- Vitamina D / 25-OH (ng/mL)

Forneça também um resumo clínico conciso e alertas de valores alterados.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType,
            data: base64Data,
          },
        },
        { text: prompt },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            glucose: { type: Type.NUMBER, description: "Glicose em mg/dL" },
            hba1c: { type: Type.NUMBER, description: "HbA1c em %" },
            totalCholesterol: { type: Type.NUMBER, description: "Colesterol Total" },
            hdl: { type: Type.NUMBER, description: "HDL" },
            ldl: { type: Type.NUMBER, description: "LDL" },
            triglycerides: { type: Type.NUMBER, description: "Triglicérides" },
            tsh: { type: Type.NUMBER, description: "TSH" },
            ferritin: { type: Type.NUMBER, description: "Ferritina" },
            vitaminD: { type: Type.NUMBER, description: "Vitamina D" },
            summary: { type: Type.STRING, description: "Síntese clínica concisa" },
            alerts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Alertas de marcadores alterados",
            },
          },
          required: ["summary", "alerts"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("Sem resposta do Gemini");
    return JSON.parse(text) as LabResultData;
  } catch (error) {
    console.error("Erro na extração via Gemini API:", error);
    throw error;
  }
}
