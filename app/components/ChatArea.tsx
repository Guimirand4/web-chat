"use client";

import { useState, useRef, useEffect } from "react";
import type { Message } from "../lib/chatData";
import ChatMessage from "./ChatMessage";

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  activeConversationId: number | null;
}

export default function ChatArea({
  messages,
  onSendMessage,
  onToggleSidebar,
  isSidebarOpen,
  activeConversationId,
}: ChatAreaProps) {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  // Limpa o input quando muda de conversa
  useEffect(() => {
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
  }, [activeConversationId]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending || !activeConversationId) return;

    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";

    setIsSending(true);
    try {
      await onSendMessage(trimmed);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + "px";
  };

  const canSend = !!input.trim() && !isSending && !!activeConversationId;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        background: "var(--bg-primary)",
        position: "relative",
      }}
    >
      {/* Header */}
      <header
        style={{
          height: "var(--header-height)",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          gap: "16px",
          flexShrink: 0,
          background: "var(--bg-secondary)",
        }}
      >
        {!isSidebarOpen && (
          <button
            onClick={onToggleSidebar}
            aria-label="Abrir menu"
            style={{
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
              padding: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "var(--border-radius-sm)",
              transition: "color var(--transition-fast)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}

        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "var(--border-radius-full)",
            background: "var(--accent-gradient)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8V4H8" />
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </div>

        <div>
          <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)" }}>
            ChatBot IA
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: "4px" }}>
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#22c55e",
                display: "inline-block",
              }}
            />
            Gemini Online
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Empty state */}
        {messages.length === 0 && !isSending && (
          <div
            className="animate-fade-in"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              textAlign: "center",
              padding: "40px 20px",
            }}
          >
            {activeConversationId ? (
              <>
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "var(--border-radius-lg)",
                    background: "var(--accent-gradient)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "var(--shadow-glow)",
                    animation: "float 4s ease-in-out infinite",
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h2 style={{ fontSize: "20px", fontWeight: 600, color: "var(--text-primary)" }}>
                  Como posso te ajudar?
                </h2>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", maxWidth: "400px", lineHeight: 1.6 }}>
                  Digite sua mensagem abaixo. Estou pronto para responder suas perguntas!
                </p>
              </>
            ) : (
              <>
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "var(--border-radius-lg)",
                    background: "var(--bg-tertiary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0.4,
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-secondary)" }}>
                  Selecione ou crie uma conversa
                </h2>
                <p style={{ fontSize: "14px", color: "var(--text-tertiary)", maxWidth: "360px", lineHeight: 1.6 }}>
                  Use a barra lateral para acessar seu histórico ou iniciar uma nova conversa.
                </p>
              </>
            )}
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatMessage key={msg.id} message={msg} index={i} />
        ))}

        {/* Typing indicator */}
        {isSending && (
          <div
            className="animate-fade-in"
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "10px",
              maxWidth: "75%",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "var(--border-radius-full)",
                background: "var(--bg-tertiary)",
                border: "1px solid var(--border-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8V4H8" />
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
            <div
              style={{
                padding: "16px 20px",
                borderRadius: "var(--border-radius-lg) var(--border-radius-lg) var(--border-radius-lg) 4px",
                background: "var(--bg-chat-bot)",
                display: "flex",
                gap: "6px",
                alignItems: "center",
              }}
            >
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div
        style={{
          padding: "16px 24px 24px",
          borderTop: "1px solid var(--border-color)",
          background: "var(--bg-secondary)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "12px",
            background: "var(--bg-input)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--border-radius-lg)",
            padding: "8px 8px 8px 16px",
            transition: "border-color var(--transition-fast), box-shadow var(--transition-fast)",
            opacity: !activeConversationId ? 0.5 : 1,
          }}
          onFocusCapture={(e) => {
            if (!activeConversationId) return;
            const container = e.currentTarget;
            container.style.borderColor = "var(--accent-primary)";
            container.style.boxShadow = "0 0 0 3px rgba(108, 92, 231, 0.1)";
          }}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              const container = e.currentTarget;
              container.style.borderColor = "var(--border-color)";
              container.style.boxShadow = "none";
            }
          }}
        >
          <textarea
            ref={inputRef}
            id="chat-input"
            value={input}
            onChange={handleTextareaInput}
            onKeyDown={handleKeyDown}
            placeholder={
              !activeConversationId
                ? "Selecione uma conversa para começar..."
                : "Digite sua mensagem..."
            }
            rows={1}
            disabled={!activeConversationId || isSending}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: "14.5px",
              fontFamily: "inherit",
              lineHeight: 1.5,
              resize: "none",
              maxHeight: "150px",
              padding: "6px 0",
              cursor: !activeConversationId ? "not-allowed" : "text",
            }}
          />
          <button
            id="send-message-btn"
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Enviar mensagem"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "var(--border-radius-sm)",
              border: "none",
              background: canSend ? "var(--accent-primary)" : "var(--bg-tertiary)",
              color: canSend ? "white" : "var(--text-tertiary)",
              cursor: canSend ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all var(--transition-fast)",
              flexShrink: 0,
            }}
          >
            {isSending ? (
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                }}
              />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </div>
        <p style={{ textAlign: "center", fontSize: "11px", color: "var(--text-tertiary)", marginTop: "8px" }}>
          ChatBot IA pode cometer erros. Verifique informações importantes.
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
