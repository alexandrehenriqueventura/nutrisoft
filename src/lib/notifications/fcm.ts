import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "../firebase/client";

export async function requestNotificationPermission(): Promise<string | null> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    console.warn("Notificações Web Push não suportadas neste ambiente.");
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const messaging = getMessaging(app);
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "YOUR_PUBLIC_VAPID_KEY",
      });
      console.log("FCM Token registrado:", token);
      return token;
    }
  } catch (error) {
    console.warn("Erro ao solicitar permissão de notificações FCM:", error);
  }

  return null;
}

export function scheduleMealReminder(mealName: string, time: string) {
  console.log(`⏰ Lembrete agendado para refeição "${mealName}" às ${time}`);
}
