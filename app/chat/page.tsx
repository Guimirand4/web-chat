"use client";

import { useState, useCallback } from "react";
import ChatSidebar from "../components/ChatSidebar";
import ChatArea from "../components/ChatArea";
import {
  getMockConversations,
  createMessage,
  type Conversation,
  type Message,
} from "../lib/chatData";

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>(
    getMockConversations
  );
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  const handleSelectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    // Close sidebar on mobile
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
    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, []);

  const handleSendMessage = useCallback(
    (userMsg: Message, botReply: Message | null) => {
      setConversations((prev) => {
        return prev.map((conv) => {
          if (conv.id !== activeConversationId) return conv;

          // If we already have this message (duplicate protection)
          if (conv.messages.find((m) => m.id === userMsg.id)) {
            // This is the bot reply coming in
            if (botReply) {
              return {
                ...conv,
                messages: [...conv.messages, botReply],
                updatedAt: new Date(),
              };
            }
            return conv;
          }

          // New user message
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

      // If no active conversation, create one
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

  return (
    <>
      <ChatSidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={handleSelectConversation}
        onNewChat={handleNewChat}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
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
