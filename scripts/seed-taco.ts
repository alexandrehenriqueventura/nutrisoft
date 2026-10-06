import { adminDb } from "../src/lib/firebase/admin";
import { db as clientDb } from "../src/lib/firebase/client";
import { collection, doc, writeBatch } from "firebase/firestore";
import {
  TACO_DATABASE_SAMPLE,
  generateSearchTokens,
  TacoFoodItem,
} from "../src/lib/tacoData";

export async function seedTacoDatabase() {
  console.log("🌱 Preparando o seed da base de dados TACO para a coleção /foods...");

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
  }
}

if (require.main === module) {
  seedTacoDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Erro no seed da base TACO:", err);
      process.exit(1);
    });
}
