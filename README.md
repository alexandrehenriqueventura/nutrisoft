# 🥗 NutriSoft - Gestão Nutricional & Prescrição Clínica Inteligente

**NutriSoft** é uma plataforma SaaS moderna de gestão para consultórios nutricionais e aplicativo PWA para pacientes, integrada ao ecossistema Google Cloud / Firebase (Firestore, Authentication, Storage, Cloud Functions e IA Google Gemini).

---

## 🚀 Tech Stack & Arquitetura

- **Frontend & Web Backoffice:** Next.js 14 (App Router, TypeScript, Tailwind CSS, Shadcn UI / Radix).
- **Backend & Serverless:** Firebase Cloud Functions (Node.js/TypeScript v2) + Server Actions.
- **Banco de Dados:** Google Cloud Firestore (NoSQL, suporte a cache offline e listeners em tempo real).
- **Autenticação & RBAC:** Firebase Authentication com Custom Claims (`role`: `nutri` | `secretaria` | `paciente`, `clinicId`).
- **Base de Alimentos:** Tabela TACO 4ª Edição com indexação de buscas por tokens e prefixos (`searchTokens`).
- **IA & OCR:** Google Gemini API para leitura inteligente de laudos médicos em PDF e sugestões de substituições alimentares.

---

## 📂 Estrutura do Projeto

```text
nutrisoft/
├── src/
│   ├── app/
│   │   ├── globals.css          # Estilos globais Tailwind CSS & Shadcn tokens
│   │   ├── layout.tsx           # Layout raiz com metadados
│   │   └── page.tsx             # Página inicial do sistema
│   └── lib/
│       ├── utils.ts             # Funções utilitárias (cn/clsx/tailwind-merge)
│       └── firebase/
│           ├── client.ts        # Singleton do Firebase SDK Client
│           └── admin.ts         # Singleton do Firebase Admin SDK
├── scripts/
│   └── seed-taco.ts             # Script de popular a base de dados TACO 4ª Edição
├── firestore.rules              # Regras de segurança Firestore com isolamento por clínica
├── .env.local.example           # Exemplo de variáveis de ambiente do Firebase
├── next.config.js               # Configuração do Next.js
├── package.json                 # Gerenciador de dependências e scripts
└── tailwind.config.ts           # Configuração do Tailwind CSS
```

---

## ⚙️ Configuração & Instalação Local

### 1. Clonar o repositório

```bash
git clone https://github.com/alexandrehenriqueventura/nutrisoft.git
cd nutrisoft
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as credenciais do seu projeto Firebase:

```env
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB4aAPV5KvNsXDzN-qSrJyYdCVmjRwd4D4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nutrisoft-df543.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nutrisoft-df543
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=nutrisoft-df543.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=648713053313
NEXT_PUBLIC_FIREBASE_APP_ID=1:648713053313:web:81ef97f1d21e3b20b5d980
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-2G5GB5FHSG

# Firebase Admin SDK (Opcional para scripts locais)
FIREBASE_ADMIN_PROJECT_ID=nutrisoft-df543
```

### 4. Executar em modo de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🛠️ Scripts Úteis

- `npm run dev`: Inicia o servidor local do Next.js.
- `npm run build`: Compila o projeto para produção.
- `npm run seed:taco`: Carrega os alimentos da base TACO (4ª Edição) na coleção `/foods` do Firestore.

---

## 🔥 Ativação do Cloud Firestore no Firebase Console

Para ativar o banco de dados **Cloud Firestore** no seu projeto Firebase (`nutrisoft-df543`):

1. Acesse o [Firebase Console](https://console.firebase.google.com/).
2. Selecione o seu projeto **`nutrisoft-df543`**.
3. No menu lateral esquerdo, sob a seção **Criação**, clique em **Firestore Database**.
4. Clique no botão **Criar banco de dados**.
5. Escolha a localização do banco (ex: `southamerica-east1 (São Paulo)` ou `us-central`).
6. Escolha iniciar em **Modo de produção** (as regras personalizadas do arquivo `firestore.rules` serão publicadas em seguida).
7. Clique em **Concluir / Criar**.

### Publicar as Regras de Segurança (`firestore.rules`)
Você pode copiar o conteúdo do arquivo `firestore.rules` e colar diretamente na aba **Regras** dentro da página do **Firestore Database** no Firebase Console e clicar em **Publicar**.

---

## 📄 Licença

Este projeto é de propriedade privada e desenvolvido para gestão de consultórios nutricionais.
