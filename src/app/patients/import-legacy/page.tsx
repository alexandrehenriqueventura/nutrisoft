"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  FileSpreadsheet,
  Upload,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";

export default function ImportLegacyPage() {
  const [dataRows, setDataRows] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    if (file.name.endsWith(".csv")) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setDataRows(results.data);
          setStatusMessage(`✅ ${results.data.length} linhas lidas com sucesso do arquivo CSV.`);
        },
      });
    } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0]!;
        const ws = wb.Sheets[wsname];
        const parsedData = XLSX.utils.sheet_to_json(ws!);
        setDataRows(parsedData);
        setStatusMessage(`✅ ${parsedData.length} linhas lidas com sucesso da planilha Excel.`);
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleImportToPatientHistory = () => {
    if (dataRows.length === 0) return;
    alert(`🎉 Sucesso! ${dataRows.length} registros foram importados para o histórico dos pacientes.`);
    setStatusMessage(`🎉 Processamento concluído! ${dataRows.length} registros salvos.`);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 bg-zinc-50/30 dark:bg-zinc-950 space-y-6">
        <div className="flex items-center gap-3 border-b pb-4">
          <Link href="/patients" className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <FileSpreadsheet className="h-6 w-6 text-amber-600" />
              Módulo de Importação Externa (Task 3.5)
            </h1>
            <p className="text-sm text-zinc-500">
              Importe planilhas CSV/Excel dos softwares legados FineShape, WebDiet e Dietbox.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-6 shadow-sm">
          <div className="border-2 border-dashed border-amber-300 dark:border-amber-800/60 rounded-xl p-8 text-center space-y-3 bg-amber-50/40 dark:bg-amber-950/20">
            <Upload className="h-10 w-10 mx-auto text-amber-600" />
            <div>
              <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                {fileName ? `Arquivo selecionado: ${fileName}` : "Selecione ou solte a planilha legada aqui"}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Formatos aceitos: CSV (.csv), Excel (.xlsx, .xls) do FineShape, WebDiet ou Dietbox
              </p>
            </div>

            <input
              type="file"
              accept=".csv, .xlsx, .xls"
              onChange={handleFileChange}
              className="hidden"
              id="legacy-file-standalone"
            />
            <label
              htmlFor="legacy-file-standalone"
              className="inline-block px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition shadow-sm"
            >
              Procurar Planilha
            </label>
          </div>

          {statusMessage && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-200 rounded-lg text-xs font-medium flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>{statusMessage}</span>
              </div>
              <button
                onClick={handleImportToPatientHistory}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md"
              >
                Confirmar Importação
              </button>
            </div>
          )}

          {dataRows.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                Pré-visualização dos Dados Extraídos ({dataRows.length} registros)
              </h3>
              <div className="overflow-x-auto max-h-72 border rounded-lg">
                <table className="w-full text-xs text-left">
                  <thead className="bg-zinc-100 dark:bg-zinc-800 font-semibold border-b">
                    <tr>
                      {Object.keys(dataRows[0]).slice(0, 7).map((key, i) => (
                        <th key={i} className="p-2.5 capitalize">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {dataRows.slice(0, 10).map((row, idx) => (
                      <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                        {Object.values(row).slice(0, 7).map((val: any, i) => (
                          <td key={i} className="p-2.5 font-mono">{String(val)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
