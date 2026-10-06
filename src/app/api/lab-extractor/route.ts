import { NextRequest, NextResponse } from "next/server";
import { extractLabResultsFromPDF } from "@/lib/ai/labExtractor";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { base64Data, mimeType } = body;

    if (!base64Data) {
      return NextResponse.json({ error: "base64Data é obrigatório" }, { status: 400 });
    }

    const result = await extractLabResultsFromPDF(base64Data, mimeType || "application/pdf");
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro ao extrair exames" }, { status: 500 });
  }
}
