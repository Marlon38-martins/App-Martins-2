# Guia Mais - Aplicativo de Turismo e Vantagens

Seu clube de vantagens em Martins, RN e região! Encontre os melhores estabelecimentos, ofertas exclusivas e explore o que a cidade tem a oferecer.

## Tecnologias Utilizadas

*   **Frontend:**
    *   Next.js (App Router)
    *   React
    *   TypeScript
    *   ShadCN UI Components
    *   Tailwind CSS
    *   `next-pwa` (for Progressive Web App capabilities)
*   **Backend (Conceptual - Firebase integration prepared):**
    *   Firebase Authentication (Email/Password, Google)
    *   Firebase Firestore (for users, businesses, deals, subscriptions, redemptions, appointments)
    *   Firebase Storage (for images)
    *   Firebase Cloud Messaging (FCM) (for Push Notifications)
    *   Genkit (for AI features, if added)
*   **External APIs (Conceptual - Placeholders for integration):**
    *   Google Maps API (for maps, geocoding, routes)
    *   OpenWeather API (for weather information)
    *   WhatsApp API (for sharing - typically via URL schemes client-side or backend for direct messaging)

## Configuração do Projeto

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do seu projeto e adicione suas chaves de API. **Não comite este arquivo no seu repositório Git.**

Exemplo de conteúdo para `.env.local`:

```ini
# Firebase Configuration (obtenha do seu console Firebase)
NEXT_PUBLIC_FIREBASE_API_KEY="SUA_CHAVE_DE_API_FIREBASE"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="SEU_DOMINIO_AUTH_FIREBASE.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="SEU_ID_DE_PROJETO_FIREBASE"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="SEU_BUCKET_STORAGE_FIREBASE.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="SEU_ID_DE_REMETENTE_MENSAGENS_FIREBASE"
NEXT_PUBLIC_FIREBASE_APP_ID="SEU_ID_DE_APP_FIREBASE"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="SEU_MEASUREMENT_ID_FIREBASE" # Opcional, para Analytics

# Google Maps API Key (obtenha do Google Cloud Console)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="SUA_CHAVE_DE_API_GOOGLE_MAPS"

# OpenWeather API Key (obtenha do OpenWeatherMap)
NEXT_PUBLIC_OPENWEATHER_API_KEY="SUA_CHAVE_DE_API_OPENWEATHER"
```

**Importante:** O aplicativo está configurado para usar dados mockados se as chaves do Firebase não estiverem presentes ou forem inválidas. Isso permite o desenvolvimento do frontend sem uma configuração completa do Firebase.

### 2. Instalar Dependências

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 3. Configurar Firebase (Manual)

1.  Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
2.  Adicione um aplicativo Web ao seu projeto Firebase e copie as credenciais de configuração para o seu arquivo `.env.local`.
3.  **Authentication:** No console do Firebase, vá para "Authentication" -> "Sign-in method" e habilite os provedores "Email/Password" e "Google".
4.  **Firestore:**
    *   Vá para "Firestore Database" e crie um banco de dados no modo "Native".
    *   Planeje suas coleções (ex: `users`, `businesses`, `deals`, `subscriptions`, `redemptions`, `appointments`).
    *   **Crucial:** Defina as **Regras de Segurança (Security Rules)** para proteger seus dados adequadamente. (Exemplo: Permitir leitura pública de negócios e ofertas, mas escrita restrita a usuários autenticados/admins/parceiros).
5.  **Storage (Opcional):** Se for usar para imagens de parceiros/pontos turísticos, vá para "Storage", crie um bucket e configure as Regras de Segurança.
6.  **Firebase Cloud Messaging (FCM - para Push Notifications):**
    *   No seu projeto Firebase, vá em "Project settings" > "Cloud Messaging".
    *   Se ainda não existir, habilite a API "Firebase Cloud Messaging API (V1)".
    *   Gere uma chave de servidor (se for enviar notificações do seu próprio backend) ou configure o Admin SDK.
    *   Para receber notificações no PWA, você precisará de um "Web Push certificate" (VAPID key pair). No console do Firebase, vá em "Project settings" > "Cloud Messaging" > "Web configuration" (abaixo de "Web Push certificates") e clique em "Generate key pair". A chave pública será usada no seu frontend/service worker.

### 4. Configurar Google Maps API (Manual)
1.  Vá para o [Google Cloud Console](https://console.cloud.google.com/).
2.  Crie um projeto ou selecione um existente.
3.  Habilite as APIs "Maps JavaScript API" e "Geocoding API".
4.  Crie uma chave de API e restrinja-a para os domínios do seu aplicativo (incluindo `localhost` para desenvolvimento).
5.  Adicione a chave ao seu `.env.local` como `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.

### 5. Configurar OpenWeather API (Manual)
1.  Crie uma conta em [OpenWeatherMap](https://openweathermap.org/).
2.  Obtenha uma chave de API e adicione-a ao seu `.env.local` como `NEXT_PUBLIC_OPENWEATHER_API_KEY`.

## Rodar Localmente

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Abra [http://localhost:9002](http://localhost:9002) (ou a porta que for configurada) no seu navegador.

## Build para Produção (Web App / PWA)

```bash
npm run build
# ou
yarn build
# ou
pnpm build
```
Isso criará uma versão otimizada do seu aplicativo na pasta `.next/`, incluindo os assets para o PWA.

## Deploy (Web App / PWA)

Você pode hospedar seu aplicativo Next.js em várias plataformas. [Firebase Hosting](https://firebase.google.com/docs/hosting) é uma excelente opção:

1.  Instale o Firebase CLI: `npm install -g firebase-tools`
2.  Faça login: `firebase login`
3.  Inicialize o Firebase no seu projeto: `firebase init hosting`
    *   Selecione seu projeto Firebase.
    *   Configure o diretório público para `out` (se você estiver exportando um site estático com `next export` - o PWA funciona bem aqui). No entanto, com o App Router, o output padrão é a pasta `.next` para SSR/ISR. Firebase Hosting pode servir conteúdo de `.next/static` e reescrever outras rotas para um servidor Next.js (requer Cloud Functions for Firebase se você tem funcionalidades server-side). Para uma PWA mais simples com `next-pwa`, o output gerado pelo `next build` é geralmente o que você usa.
    *   **Para a configuração atual (App Router + `next-pwa`):**
        *   Quando o Firebase CLI perguntar "What do you want to use as your public directory?", digite `.next`.
        *   Configure como um single-page app (SPA)? **No**. Next.js com App Router lida com o roteamento.
        *   Set up automatic builds and deploys with GitHub? Opcional.
        *   File `.next/hosting/index.html` already exists. Overwrite? **No**, a menos que você saiba que quer sobrescrever.
    *   Firebase irá criar ou atualizar seu arquivo `firebase.json`. Ele deve parecer algo como:
        ```json
        {
          "hosting": {
            "public": ".next", // Se você não usa `output: 'export'`
            // "public": "out", // Se você usa `output: 'export'` em next.config.ts
            "ignore": [
              "firebase.json",
              "**/.*",
              "**/node_modules/**"
            ],
            "rewrites": [
              {
                "source": "**",
                "function": "server" // Se você tem SSR/API routes que precisam de um servidor Node.js
                // "destination": "/index.html" // Para um SPA puro ou export estático com client-side routing
              }
            ]
          }
          // Se usar Cloud Functions para SSR:
          // "functions": {
          //   "source": "functions" // Ou o diretório das suas cloud functions
          // }
        }
        ```
        **Nota:** Para um app Next.js com App Router que pode ter funcionalidades server-side, você geralmente precisará de uma Cloud Function para servir o app. Se o seu app é puramente estático (ou você usa `output: 'export'` em `next.config.ts`), o diretório público seria `out`. A configuração atual com `next-pwa` funciona bem com o output do `next build` para PWAs.
4.  Faça o deploy: `firebase deploy`

Consulte a [documentação oficial do Next.js sobre deploy](https://nextjs.org/docs/deployment) e a [documentação do `next-pwa`](https://www.npmjs.com/package/next-pwa) para mais opções e configurações detalhadas.

## PWA (Progressive Web App)
O projeto está configurado com `next-pwa`.
*   `public/manifest.json`: Contém os metadados do PWA. Personalize os ícones e detalhes. **Importante:** Substitua os ícones placeholder em `/public/icons/` (ex: `icon-192x192.png`, `icon-512x512.png`) pelos ícones reais do seu aplicativo e certifique-se de que os caminhos em `manifest.json` estão corretos.
*   `public/sw.js`: Um service worker básico está incluído, gerado por `next-pwa`.
*   Para testar, construa para produção (`npm run build`) e sirva localmente (ex: com `npx serve .next/server/app` se SSR, ou `npx serve out` se export estático) ou deploy para o Firebase Hosting. Teste a funcionalidade "Adicionar à Tela Inicial" e o comportamento offline.

## Avisos e Passos Manuais Importantes

*   **Chaves de API:** As chaves para Firebase, Google Maps e OpenWeather DEVEM ser obtidas e configuradas manualmente no seu arquivo `.env.local`. **NÃO comite este arquivo com chaves reais em repositórios públicos.**
*   **Regras de Segurança do Firebase:** A segurança dos seus dados no Firestore e Storage depende da configuração correta das Regras de Segurança no console do Firebase. As regras padrão são muito permissivas.
*   **Backend para Agendamentos Reais, Pagamentos, Push Notifications:**
    *   **Agendamentos e Confirmações:** A lógica atual é simulada. Para agendamentos reais e confirmações (WhatsApp/Email), você precisará de um backend (ex: Firebase Cloud Functions ou um servidor dedicado) para processar os pedidos, interagir com APIs de mensagens, e gerenciar o status dos agendamentos.
    *   **Pagamentos de Assinatura:** Requer integração com um gateway de pagamento (Stripe, Mercado Pago) e lógica de backend para gerenciar assinaturas e webhooks.
    *   **Push Notifications:** Envio de notificações push requer lógica de backend (ex: Firebase Cloud Functions) para interagir com FCM/APNs, utilizando os tokens dos dispositivos dos usuários.
*   **Comentários no Código:** Procure por comentários `// TODO:` ou `// Placeholder:` no código para identificar áreas que necessitam de implementação de backend, integração de APIs reais, ou substituição de dados mockados.
*   **Multilíngue:** A estrutura para isso não foi completamente implementada. Você precisará de bibliotecas como `next-intl` ou `react-i18next` e arquivos de tradução.
*   **Geração de APK:** Este é um projeto Next.js (Web). Para um APK Android nativo, você precisaria de um framework como React Native, Flutter, ou usar uma ferramenta como CapacitorJS para empacotar seu app web em um contêiner nativo. A funcionalidade PWA permite que o web app seja "instalado" em dispositivos móveis.
