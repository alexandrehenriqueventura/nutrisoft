"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export type UserRole = "nutri" | "secretaria" | "paciente" | "admin";

interface UserProfile {
  uid: string;
  email: string | null;
  name: string;
  role: UserRole;
  clinicId: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  setDemoUser: (role: UserRole, clinicId?: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  setDemoUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>({
    uid: "demo-nutri-uid",
    email: "nutri@nutrisoft.com.br",
    name: "Dra. Ana Silva (Nutricionista)",
    role: "nutri",
    clinicId: "clinica-demo-123",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        // Obter claims personalizadas
        const idTokenResult = await firebaseUser.getIdTokenResult();
        const role = (idTokenResult.claims.role as UserRole) || "nutri";
        const clinicId = (idTokenResult.claims.clinicId as string) || "clinica-demo-123";

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email || "Usuário",
          role,
          clinicId,
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (e) {
      console.warn("Autenticação com Firebase Client falhou ou ambiente de teste ativado:", e);
      // Fallback para protótipo em ambiente de teste
      setUser({
        uid: "user-" + Date.now(),
        email,
        name: email.split("@")[0] || "Usuário",
        role: "nutri",
        clinicId: "clinica-demo-123",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      // ignore
    }
    setUser(null);
  };

  const setDemoUser = (role: UserRole, clinicId: string = "clinica-demo-123") => {
    setUser({
      uid: `demo-${role}-id`,
      email: `${role}@nutrisoft.com.br`,
      name: role === "nutri" ? "Dra. Ana Silva (Nutri)" : role === "secretaria" ? "Mariana (Secretária)" : "Carlos (Paciente)",
      role,
      clinicId,
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setDemoUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
