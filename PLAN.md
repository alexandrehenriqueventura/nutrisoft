# 📋 PLANO DE EXECUÇÃO EM SPRINT (TASKLIST) - NutriSoft

## 🚀 TECH STACK & ARQUITETURA
- **Frontend & Web Backoffice:** Next.js (App Router, TypeScript, Tailwind CSS, Shadcn UI / Radix).
- **Backend & Serverless:** Firebase Cloud Functions (Node.js/TypeScript v2) + Server Actions.
- **Banco de Dados:** Google Cloud Firestore (NoSQL, offline cache, real-time listeners).
- **Autenticação:** Firebase Authentication com Custom Claims (`role`: `nutri` | `secretaria` | `paciente`, `clinicId`).
- **Storage:** Cloud Storage for Firebase (Laudos médicos em PDF, fotos de pratos e antropometria).
- **IA & OCR:** Google Cloud Vertex AI / Gemini API.
- **App do Paciente:** PWA (Next.js responsivo com Service Workers / Web Push).

---

## 🗄️ MODELAGEM DE DADOS (FIRESTORE SCHEMA)

```text
/clinics/{clinicId}
    /users/{userId}               // Dados do nutricionista ou secretária
    /patients/{patientId}         // Ficha do paciente
        /anamneses/{anamneseId}   // Histórico, hábitos, recordatório 24h
        /evaluations/{evalId}     // Antropometria (Pollock, circunferências, bioimpedância)
        /dietPlans/{dietPlanId}   // Plano alimentar estruturado
        /foodDiary/{diaryEntryId} // Diário alimentar em tempo real (fotos, notas, conformidade)
        /labResults/{labId}       // Exames de sangue estruturados via IA
/foods/{foodId}                   // Base global de alimentos (TACO) com searchTokens
```

---

## 📋 SPRINT TASKLIST

### ETAPA 1: Setup do Workspace, Firebase e Seed de Dados
- [x] **Task 1.1**: Inicializar projeto Next.js com TypeScript, Tailwind CSS e Shadcn UI.
- [x] **Task 1.2**: Configurar Firebase SDK Client (`src/lib/firebase/client.ts`) e Firebase Admin SDK (`src/lib/firebase/admin.ts`).
- [x] **Task 1.3**: Escrever o arquivo `firestore.rules` com isolamento estrito por `clinicId` e permissões de paciente.
- [x] **Task 1.4**: Criar script de seed (`scripts/seed-taco.ts`) para carregar a base de dados TACO 4ª edição para a coleção global `/foods` no Firestore, gerando tokens minúsculos (`searchTokens: string[]`) para consulta.

### ETAPA 2: Motor de Cálculos Nutricionais & Antropométricos
- [ ] **Task 2.1**: Implementar motor matemático puro de Taxa Metabólica Basal (TMB):
  - Harris-Benedict (1919 e 1984)
  - Mifflin-St Jeor
  - Cunningham
  - Fórmulas FAO/OMS
- [ ] **Task 2.2**: Implementar motor de cálculo de Gasto Energético Total (GET) com fatores de atividade física e fator injúria.
- [ ] **Task 2.3**: Implementar fórmulas de percentual de gordura corporal:
  - Pollock 3 dobras e Pollock 7 dobras
  - Jackson-Pollock
- [ ] **Task 2.4**: Criar testes unitários (Vitest/Jest) cobrindo todos os cálculos com amostras de referência.

### ETAPA 3: Backoffice Clínico (Dashboard do Nutricionista)
- [ ] **Task 3.1**: Implementar tela de autenticação e controle de sessão por função (nutri, secretaria).
- [ ] **Task 3.2**: Desenvolver CRUD completo de Pacientes com busca rápida e ficha cadastral.
- [ ] **Task 3.3**: Construir módulo de Avaliação Física:
  - Formulário dinâmico de dobras cutâneas e circunferências.
  - Gráficos de evolução histórica (peso, % de gordura, massa magra) usando Recharts.
- [ ] **Task 3.4**: Construir o Construtor Visual de Planos Alimentares:
  - Adição de refeições (Café da Manhã, Almoço, etc.).
  - Busca dinâmica de alimentos na coleção `/foods`.
  - Cálculo instantâneo do balanço de macros (Carboidratos, Proteínas, Lipídios, Fibras) e calorias da refeição e do dia.
  - Lista de substitutos equivalentes por porção.
  - Exportação e formatação do plano em PDF profissional.
- [ ] **Task 3.5**: Módulo de Importação Externa - Criar parser para importação de planilhas CSV/Excel vindas de softwares legados (FineShape, WebDiet, Dietbox) para popular o histórico antropométrico do paciente.

### ETAPA 4: Recursos Inteligentes com Google Gemini (IA)
- [ ] **Task 4.1**: Criar Cloud Function / Server Action para processamento de exames laboratoriais:
  - Upload de PDF de hemograma e bioquímica para o Firebase Storage.
  - Envio do arquivo para a API do Gemini com schema JSON estruturado (Glicose, HbA1c, Colesterol Total, HDL, LDL, Triglicérides, TSH, etc.).
  - Salvamento dos valores extraídos diretamente em `/patients/{id}/labResults`.
- [ ] **Task 4.2**: Assistente de sugestão: criar prompt estruturado para sugerir substituições de alimentos respeitando o balanço calórico/macro da refeição.

### ETAPA 5: Portal / PWA do Paciente & Notificações
- [ ] **Task 5.1**: Criar layout mobile-first para a visão do paciente (login simplificado via link mágico ou senha).
- [ ] **Task 5.2**: Visualização em tempo real do plano alimentar ativo com suporte a leitura offline (`enableIndexedDbPersistence`).
- [ ] **Task 5.3**: Módulo de Diário Alimentar: paciente envia fotos das refeições e relata saciedade/dificuldade.
- [ ] **Task 5.4**: Geração automática da lista de compras da semana a partir do plano alimentar.
- [ ] **Task 5.5**: Configurar Firebase Cloud Messaging (FCM) para disparos de lembretes de hidratação e horários de refeição.

---

## 🚦 CRITÉRIOS DE ACEITE DO MVP
1. Nutricionista consegue cadastrar um paciente, registrar medidas e obter o % de gordura calculado automaticamente.
2. É possível montar um plano alimentar completo com alimentos da base TACO com atualização de macronutrientes em tempo real.
3. Importar histórico antropométrico vindo de planilhas CSV/Excel (FineShape, WebDiet, Dietbox).
4. Paciente acessa seu painel via navegador mobile, visualiza a dieta sem conexão com a internet e registra fotos no diário alimentar.
5. Regras do Firestore impedem rigorosamente que um paciente veja dados de outro paciente ou de outra clínica.