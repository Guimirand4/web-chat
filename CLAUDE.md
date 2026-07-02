# ChatBot IA — Front-End

> 📎 A documentação completa do projeto está em [AGENTS.md](./AGENTS.md). Este arquivo serve como referência rápida.

---

## Resumo do Projeto

Front-end de um chatbot com IA, construído com **Next.js 16 (App Router)** + **TypeScript** + **Tailwind CSS 4**.

### Telas
- **Login** (`/`) — Tela de login com botão "Entrar com Google" (simulado)
- **Chat** (`/chat`) — Interface de chat com sidebar de histórico à esquerda e área de mensagens

### Estado Atual
- Login simulado (sem OAuth real)
- Chat com respostas mockadas localmente
- Tema dark/light com toggle persistido em localStorage

---

## Estrutura Rápida

```
app/
├── page.tsx                     → Login (/)
├── layout.tsx                   → Root layout + ThemeProvider
├── globals.css                  → Design system (variáveis, temas, animações)
├── chat/
│   ├── page.tsx                 → Chat (/chat)
│   └── layout.tsx               → Layout flex do chat
├── components/
│   ├── ThemeProvider.tsx         → Context de tema (dark/light)
│   ├── ThemeToggle.tsx          → Botão de troca de tema
│   ├── GoogleLoginButton.tsx    → Botão login Google
│   ├── ChatSidebar.tsx          → Sidebar histórico
│   ├── ChatArea.tsx             → Área de chat (header + mensagens + input)
│   └── ChatMessage.tsx          → Bolha de mensagem individual
└── lib/
    └── chatData.ts              → Types, mock data, respostas do bot
```

---

## Convenções

- **Interface em português** (pt-BR) | Código em inglês
- Temas via CSS Variables (`--bg-*`, `--text-*`, `--accent-*`)
- Componentes interativos usam `"use client"`
- Estilos inline via `style={{}}` (sem CSS Modules nesta fase)
- Paleta de cores principal: roxo `#6c5ce7` / azul `#74b9ff`

---

## Comandos

```bash
npm run dev     # Dev server (http://localhost:3000)
npm run build   # Build de produção
npm run lint    # ESLint
```

---

## Próximos Passos

1. Autenticação Google real (NextAuth / Firebase Auth)
2. Integração com API de IA (OpenAI / Gemini)
3. Backend + banco de dados para persistir conversas
4. Melhorias de responsividade mobile
5. Editar/excluir conversas, busca, exportação

---

> Para detalhes completos sobre arquitetura, design system, padrões e regras, consulte [AGENTS.md](./AGENTS.md).
