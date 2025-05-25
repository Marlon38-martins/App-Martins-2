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
    *   Firebase Firestore (for users, businesses, deals, subscriptions, redemptions)
    *   Firebase Storage (for images)
    *   Genkit (for AI features, if added)
*   **External APIs (Conceptual - Placeholders for integration):**
    *   Google Maps API (for maps, geocoding, routes)
    *   OpenWeather API (for weather information)
    *   WhatsApp API (for sharing - typically via URL schemes client-side)

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
    *   Planeje suas coleções (ex: `users`, `businesses`, `deals`, `subscriptions`, `redemptions`).
    *   **Crucial:** Defina as **Regras de Segurança (Security Rules)** para proteger seus dados adequadamente. (Exemplo: Permitir leitura pública de negócios e ofertas, mas escrita restrita a usuários autenticados/admins/parceiros).
5.  **Storage (Opcional):** Se for usar para imagens de parceiros/pontos turísticos, vá para "Storage", crie um bucket e configure as Regras de Segurança.
6.  **Firebase Cloud Messaging (FCM - para Push Notifications):**
    *   No seu projeto Firebase, vá em "Project settings" > "Cloud Messaging".
    *   Copie a "Server key" (legacy token) se você for usar a API HTTP v1 para enviar notificações do seu backend, ou configure o Admin SDK no seu backend.
    *   Para receber notificações no PWA, você precisará de um "Web Push certificate" (VAPID key pair) que é gerado no Firebase console em "Cloud Messaging" > "Web configuration". A chave pública será usada no seu frontend/service worker.

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
    *   Configure o diretório público para `out` (se você estiver exportando um site estático com PWA) ou `.next` (para SSR/ISR, o que pode requerer configuração adicional em `firebase.json` para reescritas para uma Cloud Function). Para um PWA com `next-pwa`, o output é tipicamente para a pasta `out` após um `next build && next export` (se você não estiver usando SSR/API routes que precisam de um servidor Node.js). Se você está usando SSR, a configuração é diferente. *Por padrão, `next-pwa` trabalha bem com o output do `next build` e Firebase Hosting pode servir o conteúdo de `.next/static` e reescrever outras rotas para um servidor Next.js se necessário.* **Para simplicidade com PWA, se você não precisa de SSR extensivo, um export estático é mais fácil.**
    *   Configure como um single-page app (SPA): Geralmente "Não" para Next.js com App Router, a menos que você esteja fazendo um export estático e queira que o Firebase lide com todas as rotas para `index.html`.
    *   Set up automatic builds and deploys with GitHub?: Opcional.
4.  Faça o deploy: `firebase deploy`

Consulte a [documentação oficial do Next.js sobre deploy](https://nextjs.org/docs/deployment) e a [documentação do `next-pwa`](https://www.npmjs.com/package/next-pwa) para mais opções e configurações detalhadas.

## PWA (Progressive Web App)
O projeto está configurado com `next-pwa`.
*   `public/manifest.json`: Contém os metadados do PWA. Personalize os ícones e detalhes.
*   `public/sw.js`: Um service worker básico está incluído.
*   Para testar, construa para produção e sirva localmente (ex: com `npx serve out`) ou deploy para o Firebase Hosting. Teste a funcionalidade "Adicionar à Tela Inicial" e o comportamento offline.

## Avisos e Passos Manuais Importantes

*   **Chaves de API:** As chaves para Firebase, Google Maps e OpenWeather DEVEM ser obtidas e configuradas manualmente no seu arquivo `.env.local`. **NÃO comite este arquivo com chaves reais em repositórios públicos.**
*   **Regras de Segurança do Firebase:** A segurança dos seus dados no Firestore e Storage depende da configuração correta das Regras de Segurança no console do Firebase. As regras padrão são muito permissivas.
*   **Backend para Agendamentos Reais, Pagamentos, Push Notifications:**
    *   **Agendamentos e Confirmações:** A lógica atual é simulada. Para agendamentos reais e confirmações (WhatsApp/Email), você precisará de um backend (ex: Firebase Cloud Functions ou um servidor dedicado) para processar os pedidos, interagir com APIs de mensagens, e gerenciar o status dos agendamentos.
    *   **Pagamentos de Assinatura:** Requer integração com um gateway de pagamento (Stripe, Mercado Pago) e lógica de backend para gerenciar assinaturas e webhooks.
    *   **Push Notifications:** Envio de notificações push requer lógica de backend (ex: Firebase Cloud Functions) para interagir com FCM/APNs.
*   **Comentários no Código:** Procure por comentários `// TODO:` ou `// Placeholder:` no código para identificar áreas que necessitam de implementação de backend, integração de APIs reais, ou substituição de dados mockados.

