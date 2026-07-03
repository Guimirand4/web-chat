"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";
import ChatSidebar from "../components/ChatSidebar";
import ChatArea from "../components/ChatArea";
import {
  getMockConversations,
  type Conversation,
  type Message,
} from "../lib/chatData";

export default function ChatPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const [conversations, setConversations] = useState<Conversation[]>(
    getMockConversations
  );
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Proteger rota: se não autenticado, redireciona para login
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  const handleSelectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, []);

  const handleNewChat = useCallback(() => {
    const newConv: Conversation = {
      id: crypto.randomUUID(),
      title: "Nova Conversa",
      preview: "",
      updatedAt: new Date(),
      messages: [],
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, []);

  const handleSendMessage = useCallback(
    (userMsg: Message, botReply: Message | null) => {
      setConversations((prev) => {
        return prev.map((conv) => {
          if (conv.id !== activeConversationId) return conv;

          if (conv.messages.find((m) => m.id === userMsg.id)) {
            if (botReply) {
              return {
                ...conv,
                messages: [...conv.messages, botReply],
                updatedAt: new Date(),
              };
            }
            return conv;
          }

          const updatedMessages = [...conv.messages, userMsg];
          const title =
            conv.title === "Nova Conversa"
              ? userMsg.content.slice(0, 50) +
                (userMsg.content.length > 50 ? "..." : "")
              : conv.title;

          return {
            ...conv,
            messages: updatedMessages,
            title,
            preview: userMsg.content.slice(0, 60),
            updatedAt: new Date(),
          };
        });
      });

      if (!activeConversationId) {
        const newConv: Conversation = {
          id: crypto.randomUUID(),
          title: userMsg.content.slice(0, 50),
          preview: userMsg.content.slice(0, 60),
          updatedAt: new Date(),
          messages: [userMsg],
        };
        setConversations((prev) => [newConv, ...prev]);
        setActiveConversationId(newConv.id);
      }
    },
    [activeConversationId]
  );

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  // Loading state enquanto verifica autenticação
  if (isLoading || !isAuthenticated) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100dvh",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid var(--border-color)",
            borderTopColor: "var(--accent-primary)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <ChatSidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={handleSelectConversation}
        onNewChat={handleNewChat}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        user={user}
        onLogout={logout}
      />
      <ChatArea
        messages={activeConversation?.messages ?? []}
        onSendMessage={handleSendMessage}
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={sidebarOpen}
      />
    </>
  );
}
