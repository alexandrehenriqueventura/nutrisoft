import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NutriSoft - Gestão Nutricional & Prescrição Clínica",
  description: "Plataforma de gestão de consultório nutricional com IA e acompanhamento de pacientes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
