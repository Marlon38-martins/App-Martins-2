# Guia Mais - Aplicativo de Turismo e Vantagens

Seu clube de vantagens em Martins, RN e região! Encontre os melhores estabelecimentos, ofertas exclusivas e explore o que a cidade tem a oferecer.

## Tecnologias Utilizadas

*   **Frontend:**
    *   Next.js (App Router)
    *   React
    *   TypeScript
    *   ShadCN UI Components
    *   Tailwind CSS
*   **Backend (Conceptual - to be fully implemented):**
    *   Firebase (Authentication, Firestore, Storage)
    *   Genkit (for AI features, if added)
*   **External APIs (Conceptual - to be integrated):**
    *   Google Maps API (for maps and geocoding)
    *   OpenWeather API (for weather information)

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
    *   **Crucial:** Defina as **Regras de Segurança (Security Rules)** para proteger seus dados adequadamente.
5.  **Storage (Opcional):** Se for usar para imagens de parceiros, vá para "Storage", crie um bucket e configure as Regras de Segurança.

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

## Build para Produção (Web App)

```bash
npm run build
# ou
yarn build
# ou
pnpm build
```
Isso criará uma versão otimizada do seu aplicativo na pasta `.next/`.

## Deploy (Web App)

Você pode hospedar seu aplicativo Next.js em várias plataformas. [Firebase Hosting](https://firebase.google.com/docs/hosting) é uma excelente opção:

1.  Instale o Firebase CLI: `npm install -g firebase-tools`
2.  Faça login: `firebase login`
3.  Inicialize o Firebase no seu projeto: `firebase init hosting`
    *   Selecione seu projeto Firebase.
    *   Configure o diretório público para `.next` (ou a pasta de saída do seu build, que pode requerer configuração adicional em `firebase.json` para Next.js SSR/ISR).
    *   Configure como um single-page app (SPA): Não (geralmente para Next.js com App Router).
    *   Set up automatic builds and deploys with GitHub?: Opcional.
4.  Faça o deploy: `firebase deploy`

Consulte a [documentação oficial do Next.js sobre deploy](https://nextjs.org/docs/deployment) para mais opções.

## PWA (Progressive Web App) - Opcional

Para transformar seu aplicativo Next.js em um PWA:
1.  Instale `next-pwa`: `npm install next-pwa`
2.  Configure-o no seu `next.config.ts`.
3.  Crie um arquivo `public/manifest.json` com os metadados do seu app.
4.  Crie um service worker (ex: `public/sw.js`).
5.  Teste o comportamento offline e a funcionalidade "Adicionar à Tela Inicial".

## Avisos e Passos Manuais Importantes

*   **Chaves de API:** As chaves para Firebase, Google Maps e OpenWeather DEVEM ser obtidas e configuradas manualmente no seu arquivo `.env.local`. **NÃO comite este arquivo com chaves reais em repositórios públicos.**
*   **Regras de Segurança do Firebase:** A segurança dos seus dados no Firestore e Storage depende da configuração correta das Regras de Segurança no console do Firebase. As regras padrão são muito permissivas.
*   **Backend para Push Notifications, Pagamentos, etc.:** Funcionalidades como envio de notificações push, processamento de pagamentos de assinatura, e integrações complexas com WhatsApp/e-mail requerem lógica de backend (ex: Firebase Cloud Functions ou um servidor dedicado) que não faz parte deste projeto frontend.
*   **Comentários no Código:** Procure por comentários `// TODO:` ou `// Placeholder:` no código para identificar áreas que necessitam de implementação de backend, integração de APIs reais, ou substituição de dados mockados.
