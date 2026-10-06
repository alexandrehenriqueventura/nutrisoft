"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Camera,
  ArrowLeft,
  CheckCircle,
  Smile,
  Frown,
  Meh,
  Image as ImageIcon,
  Send,
} from "lucide-react";

export default function PatientDiaryPage() {
  const [mealType, setMealType] = useState("Almoço");
  const [satiety, setSatiety] = useState<number>(4);
  const [notes, setNotes] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20 max-w-md mx-auto border-x border-zinc-200 dark:border-zinc-800 p-4 space-y-4">
      <div className="flex items-center gap-3 border-b pb-3">
        <Link href="/patient-portal" className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Camera className="h-5 w-5 text-emerald-600" />
            Diário Alimentar
          </h1>
          <p className="text-xs text-zinc-500">Registre fotos das suas refeições e nível de saciedade.</p>
        </div>
      </div>

      {submitted ? (
        <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-center space-y-3">
          <CheckCircle className="h-10 w-10 text-emerald-600 mx-auto" />
          <h3 className="font-bold text-emerald-900 dark:text-emerald-200 text-base">Refeição Registrada!</h3>
          <p className="text-xs text-emerald-700 dark:text-emerald-300">
            Sua nutricionista receberá a foto e as observações em tempo real.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg"
          >
            Registrar Outra Refeição
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Refeição</label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-800 text-xs font-medium"
            >
              <option value="Café da Manhã">Café da Manhã</option>
              <option value="Almoço">Almoço</option>
              <option value="Lanche da Tarde">Lanche da Tarde</option>
              <option value="Jantar">Jantar</option>
              <option value="Ceia">Ceia</option>
            </select>
          </div>

          {/* Upload de Foto */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Foto do Prato</label>
            <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-4 text-center bg-white dark:bg-zinc-900 space-y-2">
              {previewImage ? (
                <div className="relative">
                  <img src={previewImage} alt="Foto do prato" className="max-h-48 rounded-lg mx-auto object-cover" />
                  <button
                    type="button"
                    onClick={() => setPreviewImage(null)}
                    className="mt-2 text-xs text-red-600 underline font-medium"
                  >
                    Trocar Foto
                  </button>
                </div>
              ) : (
                <>
                  <ImageIcon className="h-8 w-8 text-zinc-400 mx-auto" />
                  <p className="text-xs text-zinc-500">Tire uma foto ou selecione da galeria</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="meal-photo-input"
                  />
                  <label
                    htmlFor="meal-photo-input"
                    className="inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition"
                  >
                    Capturar Foto
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Escala de Saciedade (1 a 5) */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Nível de Saciedade (1 a 5)</label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSatiety(lvl)}
                  className={`py-2 rounded-lg font-bold text-xs transition border ${
                    satiety === lvl
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-zinc-500 mt-1 text-center">
              {satiety <= 2 ? "Ainda com fome" : satiety === 3 ? "Satisfeito" : "Muito Satisfeito"}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Observações ou Dificuldades</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Tive que substituir a proteína, senti vontade de doce..."
              className="w-full p-2.5 border rounded-lg dark:bg-zinc-800 text-xs"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            <Send className="h-4 w-4" />
            <span>Enviar ao Nutricionista</span>
          </button>
        </form>
      )}
    </div>
  );
}
