import { NextRequest, NextResponse } from "next/server";
import { suggestFoodSubstitutions } from "@/lib/ai/substitutionAssistant";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const suggestions = await suggestFoodSubstitutions(body);
    return NextResponse.json({ success: true, data: suggestions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro no assistente de substituição" }, { status: 500 });
  }
}
