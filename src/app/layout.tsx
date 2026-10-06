import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "NutriSoft - Gestão Nutricional & Prescrição Clínica",
  description: "Plataforma SaaS de gestão de consultório nutricional com IA e acompanhamento de pacientes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased min-h-screen bg-background text-foreground">
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
