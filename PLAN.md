{\rtf1\ansi\ansicpg1252\cocoartf2907
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\froman\fcharset0 Times-Roman;\f1\fnil\fcharset0 AppleColorEmoji;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue0;}
{\*\expandedcolortbl;;\cssrgb\c0\c0\c0;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs24 \cf0 \expnd0\expndtw0\kerning0
# MISSION: NutriCloud - Sistema de Gest\'e3o Nutricional & Prescri\'e7\'e3o Cl\'ednica\
\
Construir uma plataforma SaaS de gest\'e3o de consult\'f3rio nutricional e aplicativo para pacientes utilizando o ecossistema Google Cloud / Firebase (Firestore, Cloud Functions, Storage, Auth e Gemini API).\
\
---\
\
## 
\f1 \uc0\u55357 \u57056 
\f0  TECH STACK & ARQUITETURA\
\
- **Frontend & Web Backoffice:** Next.js (App Router, TypeScript, Tailwind CSS, Shadcn UI / Radix).\
- **Backend & Serverless:** Firebase Cloud Functions (Node.js/TypeScript v2) + Server Actions.\
- **Banco de Dados:** Google Cloud Firestore (NoSQL, offline cache, real-time listeners).\
- **Autentica\'e7\'e3o:** Firebase Authentication com Custom Claims (`role`: `nutri` | `secretaria` | `paciente`, `clinicId`).\
- **Storage:** Cloud Storage for Firebase (Laudos m\'e9dicos em PDF, fotos de pratos e antropometria).\
- **IA & OCR:** Google Cloud Vertex AI / Gemini 1.5/2.0 Flash via SDK `@google/genai`.\
- **App do Paciente:** PWA (Next.js responsivo com Service Workers / Web Push).\
\
---\
\
## 
\f1 \uc0\u55357 \u56513 
\f0  MODELAGEM DE DADOS (FIRESTORE SCHEMA)\
\
```text\
/clinics/\{clinicId\}\
    /users/\{userId\}               // Dados do nutricionista ou secret\'e1ria\
    /patients/\{patientId\}         // Ficha do paciente\
        /anamneses/\{anamneseId\}   // Hist\'f3rico, h\'e1bitos, recordat\'f3rio 24h\
        /evaluations/\{evalId\}     // Antropometria (Pollock, circunfer\'eancias, bioimped\'e2ncia)\
        /dietPlans/\{dietPlanId\}   // Plano alimentar estruturado (refei\'e7\'f5es, itens e substitutos em 1 doc)\
        /foodDiary/\{diaryEntryId\} // Di\'e1rio alimentar em tempo real (fotos, notas, conformidade)\
        /labResults/\{labId\}       // Exames de sangue estruturados via IA\
/foods/\{foodId\}                   // Base de alimentos (TACO, IBGE, USDA) com tokens de busca\
\
\
// Import the functions you need from the SDKs you need\
import \{ initializeApp \} from "firebase/app";\
import \{ getAnalytics \} from "firebase/analytics";\
// TODO: Add SDKs for Firebase products that you want to use\
// https://firebase.google.com/docs/web/setup#available-libraries\
\
// Your web app's Firebase configuration\
// For Firebase JS SDK v7.20.0 and later, measurementId is optional\
const firebaseConfig = \{\
  apiKey: "AIzaSyB4aAPV5KvNsXDzN-qSrJyYdCVmjRwd4D4",\
  authDomain: "nutrisoft-df543.firebaseapp.com",\
  projectId: "nutrisoft-df543",\
  storageBucket: "nutrisoft-df543.firebasestorage.app",\
  messagingSenderId: "648713053313",\
  appId: "1:648713053313:web:81ef97f1d21e3b20b5d980",\
  measurementId: "G-2G5GB5FHSG"\
\};\
\
// Initialize Firebase\
const app = initializeApp(firebaseConfig);\
const analytics = getAnalytics(app);}