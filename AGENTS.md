<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# 📋 Documentação do Projeto — ChatBot IA (Front-End)

## Objetivo do Projeto

Este é o **front-end** de um chatbot com inteligência artificial. O sistema permite que o usuário faça login (via Google) e converse com um assistente virtual. As conversas são organizadas em um histórico lateral, inspirado em interfaces como ChatGPT, Claude e Gemini.

### Status Atual

- ✅ Tela de Login com Google (integrada com backend OAuth)
- ✅ Tela de Chat com sidebar de histórico e área de mensagens
- ✅ Sistema de temas (dark/light) com toggle
- ✅ Autenticação real via Google OAuth (backend redireciona para Google, retorna JWT)
- ✅ Proteção de rotas (chat só acessível autenticado)
- ✅ Dados do usuário (nome, email, foto) do Google exibidos na sidebar
- ✅ Respostas do bot mockadas localmente
- ⬜ Integração com API de IA (OpenAI, Gemini, etc.)
- ⬜ Persistência de conversas (banco de dados / backend)

---

## Stack Tecnológica

| Tecnologia       | Versão   | Uso                              |
|------------------|----------|----------------------------------|
| Next.js          | 16.2.10  | Framework React (App Router)     |
| React            | 19.2.4   | Biblioteca de UI                 |
| TypeScript       | ^5       | Tipagem estática                 |
| Tailwind CSS     | ^4       | Import base (`@import "tailwindcss"`) + CSS customizado |
| Geist Font       | built-in | Tipografia (via `next/font/google`) |

---

## Arquitetura e Estrutura de Pastas

```
front-end-chat-bot/
├── .env.local                   # Variáveis de ambiente (NEXT_PUBLIC_BACKEND_URL)
├── app/
│   ├── globals.css              # Design system completo (variáveis CSS, temas, animações)
│   ├── layout.tsx               # Root layout (ThemeProvider + AuthProvider + ThemeToggle)
│   ├── page.tsx                 # Página de Login (rota /) — redireciona se autenticado
│   ├── favicon.ico
│   │
│   ├── auth/
│   │   └── callback/
│   │       └── page.tsx         # Captura JWT da URL após OAuth e salva no localStorage
│   │
│   ├── chat/
│   │   ├── layout.tsx           # Layout do chat (container flex)
│   │   └── page.tsx             # Página do Chat (rota /chat) — rota protegida
│   │
│   ├── components/
│   │   ├── AuthProvider.tsx     # Context provider para autenticação (user, token, logout)
│   │   ├── ThemeProvider.tsx    # Context provider para tema dark/light
│   │   ├── ThemeToggle.tsx      # Botão flutuante de troca de tema (canto superior direito)
│   │   ├── GoogleLoginButton.tsx # Botão de login — redireciona para backend OAuth
│   │   ├── ChatSidebar.tsx      # Sidebar com histórico + dados do usuário + logout
│   │   ├── ChatArea.tsx         # Área principal do chat (header + mensagens + input)
│   │   └── ChatMessage.tsx      # Componente individual de mensagem (bolha)
│   │
│   └── lib/
│       ├── auth.ts              # Utilitários de auth (token, fetchUser, authFetch, logout)
│       └── chatData.ts          # Types, dados mock e respostas simuladas do bot
│
├── public/                      # Assets estáticos
├── package.json
├── tsconfig.json
├── next.config.ts               # Config (imagens Google permitidas)
├── postcss.config.mjs
├── eslint.config.mjs
├── AGENTS.md                    # Esta documentação (regras para agentes IA)
└── CLAUDE.md                    # Referência ao AGENTS.md
```

---

## Rotas

| Rota              | Arquivo                      | Descrição                              |
|-------------------|------------------------------|----------------------------------------|
| `/`               | `app/page.tsx`               | Login — redireciona se já autenticado  |
| `/auth/callback`  | `app/auth/callback/page.tsx` | Captura JWT da URL após OAuth          |
| `/chat`           | `app/chat/page.tsx`          | Chat — rota protegida (requer auth)    |
---

## Fluxo de Autenticação (Google OAuth)

```
1. Usuário clica "Entrar com Google"
       ↓
2. Frontend redireciona para: GET {BACKEND_URL}/auth/google/login
       ↓
3. Backend redireciona para tela de consentimento do Google
       ↓
4. Usuário autoriza → Google redireciona para: GET {BACKEND_URL}/auth/google/callback
       ↓
5. Backend cria/busca user, gera JWT, redireciona para:
   {FRONTEND_URL}/auth/callback?token=eyJhbGci...
       ↓
6. Frontend (/auth/callback) captura o token da URL e salva no localStorage
       ↓
7. Frontend redireciona para /chat
       ↓
8. AuthProvider busca dados do usuário:
   GET {BACKEND_URL}/auth/me
   Header: Authorization: Bearer {token}
```

### Variáveis de Ambiente
- `NEXT_PUBLIC_BACKEND_URL` — URL base da API backend (`.env.local`)
  - Produção: `https://api-chat-six-ruby.vercel.app`
  - Local: `http://localhost:8000`

### Armazenamento do Token
- Token JWT salvo em `localStorage` com chave `auth_token`
- `lib/auth.ts` expõe: `getToken()`, `setToken()`, `removeToken()`, `isAuthenticated()`
- `authFetch()` — wrapper de `fetch` que injeta o header `Authorization: Bearer`

### Proteção de Rotas
- `/` (login) → redireciona para `/chat` se já autenticado
- `/chat` → redireciona para `/` se NÃO autenticado
- Ambas mostram spinner durante a verificação de auth

---



### Componentes
- **Server Components** são usados por padrão (layouts, pages estáticas)
- **Client Components** usam a diretiva `"use client"` no topo do arquivo
- Todos os componentes interativos (botões, inputs, estados) são Client Components
- Componentes ficam em `app/components/`
- Lógica/dados compartilhados ficam em `app/lib/`

### Estilização
- **CSS Variables** (custom properties) para todas as cores, sombras, espaçamentos e transições
- Dois temas: `light` (padrão na `:root`) e `dark` (via `[data-theme="dark"]`)
- O tema é persistido no `localStorage` e respeita `prefers-color-scheme` do sistema
- Animações declaradas com `@keyframes` e classes utilitárias (`.animate-fade-in`, `.animate-slide-up`, etc.)
- Glassmorphism via classe `.glass` (backdrop-filter + border)
- Estilos são aplicados via prop `style={{}}` inline nos componentes (sem CSS Modules nesta fase)

### Gerenciamento de Estado
- Estado gerenciado localmente com `useState` nos componentes
- Tema global via React Context (`ThemeProvider`)
- Sem estado global complexo (Redux, Zustand) — será avaliado quando houver backend

### Idioma
- **Interface em português** (pt-BR)
- Código e nomes de variáveis/componentes em **inglês**

---

## Design System (globals.css)

O arquivo `globals.css` contém todo o design system com:

### Variáveis CSS Principais
- `--bg-*`: cores de fundo (primary, secondary, tertiary, sidebar, chat-user, chat-bot, etc.)
- `--text-*`: cores de texto (primary, secondary, tertiary, inverse)
- `--accent-*`: cores de destaque da marca (roxo `#6c5ce7`)
- `--border-*`: cores e raios de borda
- `--shadow-*`: sombras (sm, md, lg, xl, glow, glass)
- `--transition-*`: durações de transição (fast: 150ms, base: 250ms, slow: 400ms)
- `--sidebar-width`: largura da sidebar (320px)
- `--header-height`: altura do header (64px)

### Animações Disponíveis
- `fadeIn`, `slideUp`, `slideInLeft`, `slideInRight`, `scaleIn`
- `gradientShift` (fundo animado do login)
- `float` (orbes flutuantes)
- `typingDot` (indicador de digitação)
- `pulse`, `bounce`

---

## Fluxo da Aplicação

1. **Usuário acessa `/`** → Vê a tela de login com card glassmorphism
2. **Clica em "Entrar com Google"** → É redirecionado para `/chat` (login simulado)
3. **Tela de chat carrega** → Sidebar com conversas mock + área de chat vazia
4. **Seleciona uma conversa** → Mensagens aparecem na área de chat
5. **Clica em "Nova Conversa"** → Cria uma conversa em branco
6. **Digita uma mensagem** → Mensagem do usuário aparece, bot "digita" e responde (~1-2s)
7. **Toggle de tema** → Botão no canto superior direito alterna dark/light

---

## Próximos Passos (Roadmap)

1. **Autenticação real** com Google (NextAuth.js ou Firebase Auth)
2. **Integração com API de IA** (OpenAI GPT, Google Gemini, etc.)
3. **Backend** para persistência de conversas (Node.js + banco de dados)
4. **Responsividade** refinada para mobile
5. **Funcionalidades extras**: editar/excluir conversas, busca no histórico, exportar chat

---

## Comandos Úteis

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build

# Rodar build de produção
npm start

# Linting
npm run lint
```

---

## Regras para Agentes IA

1. **Sempre leia** `node_modules/next/dist/docs/` antes de usar APIs do Next.js 16 — há breaking changes
2. **Mantenha a interface em português** (pt-BR) — código/variáveis em inglês
3. **Use CSS Variables** do design system existente — não invente novas cores inline
4. **Client Components** devem ter `"use client"` no topo
5. **Não remova comentários** ou código existente sem instrução explícita
6. **Teste sempre** com `npm run dev` após alterações significativas
