"use client";

import type { Message } from "../lib/chatData";

interface ChatMessageProps {
  message: Message;
  index: number;
}

export default function ChatMessage({ message, index }: ChatMessageProps) {
  const isUser = message.sender === "user";

  const timeStr = message.timestamp.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={isUser ? "animate-slide-in-right" : "animate-slide-in-left"}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        gap: "4px",
        animationDelay: `${index * 40}ms`,
        animationFillMode: "both",
      }}
    >
      {/* Sender label — apenas para o bot */}
      {!isUser && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            paddingLeft: "4px",
          }}
        >
          {/* Ícone do bot */}
          <div
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "4px",
              background: "var(--accent-gradient)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--text-tertiary)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            ChatBot IA
          </span>
        </div>
      )}

      {/* Message Bubble */}
      <div
        className="chat-bubble-wrapper"
        style={{
          maxWidth: "min(68%, 680px)",
          width: "100%",
          position: "relative",
        }}
      >
        <div
          style={{
            padding: isUser ? "10px 16px" : "14px 18px",
            borderRadius: isUser
              ? "18px 18px 4px 18px"
              : "4px 18px 18px 18px",
            background: isUser ? "var(--bg-chat-user)" : "var(--bg-chat-bot)",
            color: isUser ? "var(--text-chat-user)" : "var(--text-chat-bot)",
            fontSize: "14.5px",
            lineHeight: 1.65,
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            boxShadow: isUser
              ? "0 2px 8px rgba(108, 92, 231, 0.2)"
              : "var(--shadow-sm)",
            border: isUser ? "none" : "1px solid var(--border-color)",
          }}
        >
          {message.content}
        </div>
      </div>

      {/* Timestamp */}
      <span
        style={{
          fontSize: "11px",
          color: "var(--text-tertiary)",
          paddingLeft: isUser ? "0" : "4px",
          paddingRight: "4px",
          opacity: 0.7,
        }}
      >
        {timeStr}
      </span>
    </div>
  );
}
