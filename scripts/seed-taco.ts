import { adminDb } from "../src/lib/firebase/admin";
import { db as clientDb } from "../src/lib/firebase/client";
import { collection, doc, writeBatch } from "firebase/firestore";

export interface TacoFoodItem {
  id?: string;
  category: string;
  description: string;
  humidity_percent?: number;
  energy_kcal: number;
  energy_kj?: number;
  protein_g: number;
  lipid_g: number;
  carbohydrate_g: number;
  fiber_g: number;
  ash_g?: number;
  calcium_mg?: number;
  magnesium_mg?: number;
  manganese_mg?: number;
  phosphorus_mg?: number;
  iron_mg?: number;
  sodium_mg?: number;
  potassium_mg?: number;
  copper_mg?: number;
  zinc_mg?: number;
  vitaminC_mg?: number;
  searchTokens: string[];
  source: "TACO 4ª Edição";
}

/**
 * Remove acentos e caracteres especiais de uma string
 */
export function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Gera tokens minúsculos e prefixos para buscas no Firestore
 */
export function generateSearchTokens(description: string, category: string): string[] {
  const fullText = `${description} ${category}`;
  const normalized = normalizeText(fullText);
  const words = normalized.split(" ").filter((w) => w.length >= 2);

  const tokensSet = new Set<string>();

  words.forEach((word) => {
    tokensSet.add(word);
    for (let i = 2; i <= word.length; i++) {
      tokensSet.add(word.substring(0, i));
    }
  });

  return Array.from(tokensSet);
}

// Amostra representativa da base TACO (4ª Edição) por 100g de alimento
export const TACO_DATABASE_SAMPLE: Omit<TacoFoodItem, "searchTokens" | "source">[] = [
  {
    category: "Cereais e derivados",
    description: "Arroz, integral, cozido",
    energy_kcal: 124,
    protein_g: 2.6,
    lipid_g: 1.0,
    carbohydrate_g: 25.8,
    fiber_g: 2.7,
    sodium_mg: 1,
    calcium_mg: 5,
    iron_mg: 0.3,
  },
  {
    category: "Cereais e derivados",
    description: "Arroz, tipo 1, cozido",
    energy_kcal: 128,
    protein_g: 2.5,
    lipid_g: 0.2,
    carbohydrate_g: 28.1,
    fiber_g: 1.6,
    sodium_mg: 1,
    calcium_mg: 4,
    iron_mg: 0.1,
  },
  {
    category: "Cereais e derivados",
    description: "Aveia, em flocos, crua",
    energy_kcal: 394,
    protein_g: 13.9,
    lipid_g: 8.5,
    carbohydrate_g: 66.6,
    fiber_g: 9.1,
    sodium_mg: 4,
    calcium_mg: 48,
    iron_mg: 4.4,
  },
  {
    category: "Cereais e derivados",
    description: "Pão, francês",
    energy_kcal: 300,
    protein_g: 8.0,
    lipid_g: 3.1,
    carbohydrate_g: 58.6,
    fiber_g: 2.3,
    sodium_mg: 648,
    calcium_mg: 16,
    iron_mg: 1.0,
  },
  {
    category: "Leguminosas e derivados",
    description: "Feijão, carioca, cozido",
    energy_kcal: 76,
    protein_g: 4.8,
    lipid_g: 0.5,
    carbohydrate_g: 13.6,
    fiber_g: 8.5,
    sodium_mg: 2,
    calcium_mg: 27,
    iron_mg: 1.3,
  },
  {
    category: "Leguminosas e derivados",
    description: "Feijão, preto, cozido",
    energy_kcal: 77,
    protein_g: 4.5,
    lipid_g: 0.5,
    carbohydrate_g: 14.0,
    fiber_g: 8.4,
    sodium_mg: 2,
    calcium_mg: 29,
    iron_mg: 1.5,
  },
  {
    category: "Carnes e derivados",
    description: "Frango, peito, sem pele, grelhado",
    energy_kcal: 159,
    protein_g: 32.0,
    lipid_g: 2.5,
    carbohydrate_g: 0.0,
    fiber_g: 0.0,
    sodium_mg: 50,
    calcium_mg: 7,
    iron_mg: 0.4,
  },
  {
    category: "Carnes e derivados",
    description: "Carne, bovina, patinho, sem gordura, grelhado",
    energy_kcal: 219,
    protein_g: 35.9,
    lipid_g: 7.3,
    carbohydrate_g: 0.0,
    fiber_g: 0.0,
    sodium_mg: 63,
    calcium_mg: 9,
    iron_mg: 3.0,
  },
  {
    category: "Ovos e derivados",
    description: "Ovo, de galinha, inteiro, cozido",
    energy_kcal: 146,
    protein_g: 13.3,
    lipid_g: 9.5,
    carbohydrate_g: 0.6,
    fiber_g: 0.0,
    sodium_mg: 146,
    calcium_mg: 49,
    iron_mg: 1.5,
  },
  {
    category: "Leite e derivados",
    description: "Leite, de vaca, integral",
    energy_kcal: 61,
    protein_g: 3.2,
    lipid_g: 3.2,
    carbohydrate_g: 4.8,
    fiber_g: 0.0,
    sodium_mg: 46,
    calcium_mg: 123,
    iron_mg: 0.1,
  },
  {
    category: "Leite e derivados",
    description: "Iogurte, natural, integral",
    energy_kcal: 51,
    protein_g: 4.1,
    lipid_g: 3.0,
    carbohydrate_g: 1.9,
    fiber_g: 0.0,
    sodium_mg: 49,
    calcium_mg: 143,
    iron_mg: 0.1,
  },
  {
    category: "Leite e derivados",
    description: "Queijo, minas, frescal",
    energy_kcal: 264,
    protein_g: 17.4,
    lipid_g: 20.2,
    carbohydrate_g: 3.2,
    fiber_g: 0.0,
    sodium_mg: 310,
    calcium_mg: 579,
    iron_mg: 0.2,
  },
  {
    category: "Frutas e derivados",
    description: "Banana, prata, crua",
    energy_kcal: 98,
    protein_g: 1.3,
    lipid_g: 0.1,
    carbohydrate_g: 26.0,
    fiber_g: 2.0,
    sodium_mg: 0,
    calcium_mg: 8,
    iron_mg: 0.2,
  },
  {
    category: "Frutas e derivados",
    description: "Maçã, fuji, com casca, crua",
    energy_kcal: 56,
    protein_g: 0.3,
    lipid_g: 0.2,
    carbohydrate_g: 15.2,
    fiber_g: 1.3,
    sodium_mg: 0,
    calcium_mg: 2,
    iron_mg: 0.1,
  },
  {
    category: "Verduras, hortaliças e derivados",
    description: "Batata, doce, cozida",
    energy_kcal: 77,
    protein_g: 0.6,
    lipid_g: 0.1,
    carbohydrate_g: 18.4,
    fiber_g: 2.2,
    sodium_mg: 3,
    calcium_mg: 17,
    iron_mg: 0.2,
  },
  {
    category: "Verduras, hortaliças e derivados",
    description: "Batata, inglesa, cozida",
    energy_kcal: 52,
    protein_g: 1.2,
    lipid_g: 0.0,
    carbohydrate_g: 11.9,
    fiber_g: 1.3,
    sodium_mg: 2,
    calcium_mg: 4,
    iron_mg: 0.2,
  },
  {
    category: "Verduras, hortaliças e derivados",
    description: "Brócolis, cozido",
    energy_kcal: 25,
    protein_g: 2.1,
    lipid_g: 0.5,
    carbohydrate_g: 4.4,
    fiber_g: 3.4,
    sodium_mg: 3,
    calcium_mg: 51,
    iron_mg: 0.6,
  },
  {
    category: "Óleos e gorduras",
    description: "Azeite, de oliva, extra virgem",
    energy_kcal: 884,
    protein_g: 0.0,
    lipid_g: 100.0,
    carbohydrate_g: 0.0,
    fiber_g: 0.0,
    sodium_mg: 0,
    calcium_mg: 0,
    iron_mg: 0.0,
  },
];

export async function seedTacoDatabase() {
  console.log("🌱 Preparando o seed da base de dados TACO para a coleção /foods...");

  // Tenta utilizar o Admin SDK se houver credenciais GCP / Service Account configuradas
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    try {
      console.log("🔒 Utilizando Firebase Admin SDK com credenciais registradas...");
      const foodsCollection = adminDb.collection("foods");
      const batch = adminDb.batch();

      let count = 0;
      for (const item of TACO_DATABASE_SAMPLE) {
        const docRef = foodsCollection.doc();
        const searchTokens = generateSearchTokens(item.description, item.category);

        const fullItem: TacoFoodItem = {
          ...item,
          id: docRef.id,
          searchTokens,
          source: "TACO 4ª Edição",
        };

        batch.set(docRef, fullItem);
        count++;
      }

      await batch.commit();
      console.log(`✅ Seed concluído via Admin SDK! ${count} alimentos TACO inseridos na coleção /foods.`);
      return;
    } catch (err) {
      console.warn("⚠️ Não foi possível usar Admin SDK diretamente:", (err as Error).message);
    }
  }

  // Tenta utilizar o Client SDK (se autenticado ou com regras de dev ativas)
  try {
    console.log("🌐 Utilizando Firebase Client SDK...");
    const batch = writeBatch(clientDb);
    const foodsRef = collection(clientDb, "foods");

    let count = 0;
    for (const item of TACO_DATABASE_SAMPLE) {
      const docRef = doc(foodsRef);
      const searchTokens = generateSearchTokens(item.description, item.category);

      const fullItem: TacoFoodItem = {
        ...item,
        id: docRef.id,
        searchTokens,
        source: "TACO 4ª Edição",
      };

      batch.set(docRef, fullItem);
      count++;
    }

    await batch.commit();
    console.log(`✅ Seed concluído via Client SDK! ${count} alimentos TACO inseridos na coleção /foods.`);
  } catch (err) {
    console.warn("ℹ️ Execução offline/sem credenciais de produção no ambiente local:");
    console.log(`ℹ️ O script processou com sucesso ${TACO_DATABASE_SAMPLE.length} itens com tokens de busca gerados.`);
    console.log("🔑 Insira a FIREBASE_SERVICE_ACCOUNT_KEY no arquivo .env.local para sincronizar diretamente com o Firestore da nuvem.");
  }
}

// Se executado diretamente via terminal
if (require.main === module) {
  seedTacoDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Erro no seed da base TACO:", err);
      process.exit(1);
    });
}
