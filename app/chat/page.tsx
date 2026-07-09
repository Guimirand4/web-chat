"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";
import ChatSidebar from "../components/ChatSidebar";
import ChatArea from "../components/ChatArea";
import {
  listConversations,
  createConversation,
  getConversation,
  deleteConversation,
  sendMessage,
  type ApiConversationPreview,
  type ApiMessage,
} from "../lib/chatApi";
import type { Conversation, Message } from "../lib/chatData";

const MAX_CONVERSATIONS = 2;

// Converte ApiMessage → Message interno
function toMessage(m: ApiMessage): Message {
  return {
    id: m.id,
    content: m.content,
    sender: m.sender,
    timestamp: new Date(m.created_at),
  };
}

// Converte ApiConversationPreview → Conversation interna (sem mensagens)
function toConversation(c: ApiConversationPreview): Conversation {
  return {
    id: c.id,
    title: c.title,
    preview: c.preview,
    updatedAt: new Date(c.updated_at),
    messages: [],
  };
}

export default function ChatPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isFetchingHistory, setIsFetchingHistory] = useState(true);
  const [limitError, setLimitError] = useState<string | null>(null);

  // ── Proteção de rota ──
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  // ── Carregar histórico ao montar ──
  useEffect(() => {
    if (!isAuthenticated) return;

    listConversations()
      .then((list) => setConversations(list.map(toConversation)))
      .catch(() => {/* silencia erros de rede na montagem */})
      .finally(() => setIsFetchingHistory(false));
  }, [isAuthenticated]);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  // ── Selecionar conversa (carrega mensagens se ainda não carregadas) ──
  const handleSelectConversation = useCallback(async (id: number) => {
    setActiveConversationId(id);
    if (window.innerWidth <= 768) setSidebarOpen(false);

    // Verifica se já tem as mensagens carregadas
    const existing = conversations.find((c) => c.id === id);
    if (existing && existing.messages.length > 0) return;

    try {
      const detail = await getConversation(id);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, messages: detail.messages.map(toMessage) }
            : c
        )
      );
    } catch {
      // mantém a conversa sem mensagens se falhar
    }
  }, [conversations]);

  // ── Criar nova conversa ──
  const handleNewChat = useCallback(async () => {
    setLimitError(null);
    try {
      const newConv = await createConversation();
      const conv: Conversation = {
        id: newConv.id,
        title: newConv.title,
        preview: "",
        updatedAt: new Date(newConv.created_at),
        messages: [],
      };
      setConversations((prev) => [conv, ...prev]);
      setActiveConversationId(newConv.id);
      if (window.innerWidth <= 768) setSidebarOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error && (err as Error & { status?: number }).status === 403) {
        setLimitError(err.message);
      }
    }
  }, []);

  // ── Deletar conversa ──
  const handleDeleteConversation = useCallback(async (id: number) => {
    try {
      await deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConversationId === id) {
        setActiveConversationId(null);
      }
      setLimitError(null); // limpa erro de limite ao deletar
    } catch {
      // silencia — pode exibir toast no futuro
    }
  }, [activeConversationId]);

  // ── Enviar mensagem ──
  const handleSendMessage = useCallback(
    async (userContent: string): Promise<void> => {
      if (!activeConversationId) return;

      // Mensagem otimista do usuário (ID temporário negativo)
      const tempUserMsg: Message = {
        id: Date.now() * -1,
        content: userContent,
        sender: "user",
        timestamp: new Date(),
      };

      // Adiciona imediatamente na UI
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeConversationId) return c;
          const title =
            c.title === "Nova Conversa"
              ? userContent.slice(0, 50) + (userContent.length > 50 ? "..." : "")
              : c.title;
          return {
            ...c,
            title,
            preview: userContent.slice(0, 60),
            updatedAt: new Date(),
            messages: [...c.messages, tempUserMsg],
          };
        })
      );

      // Chama a API — o backend salva ambas e retorna a resposta do bot
      const botMsg = await sendMessage(activeConversationId, userContent);
      const botMessage = toMessage(botMsg);

      // Substitui a msg temporária pelo ID real + adiciona resposta do bot
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeConversationId) return c;
          const withoutTemp = c.messages.filter((m) => m.id !== tempUserMsg.id);
          const realUser: Message = {
            id: botMsg.id - 1, // o user message é o anterior
            content: userContent,
            sender: "user",
            timestamp: tempUserMsg.timestamp,
          };
          return {
            ...c,
            updatedAt: new Date(),
            messages: [...withoutTemp, realUser, botMessage],
          };
        })
      );
    },
    [activeConversationId]
  );

  const toggleSidebar = useCallback(() => setSidebarOpen((p) => !p), []);

  // ── Loading state ──
  if (isLoading || !isAuthenticated) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", height: "100dvh" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid var(--border-color)", borderTopColor: "var(--accent-primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const isAtLimit = conversations.length >= MAX_CONVERSATIONS;

  return (
    <>
      <ChatSidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        user={user}
        onLogout={logout}
        isAtLimit={isAtLimit}
        limitError={limitError}
        isFetchingHistory={isFetchingHistory}
      />
      <ChatArea
        messages={activeConversation?.messages ?? []}
        onSendMessage={handleSendMessage}
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={sidebarOpen}
        activeConversationId={activeConversationId}
      />
    </>
  );
}
