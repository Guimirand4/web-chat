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
        gap: "6px",
        animationDelay: `${index * 50}ms`,
        animationFillMode: "both",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "10px",
          flexDirection: isUser ? "row-reverse" : "row",
          maxWidth: "75%",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "var(--border-radius-full)",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: 600,
            background: isUser ? "var(--accent-gradient)" : "var(--bg-tertiary)",
            color: isUser ? "white" : "var(--text-secondary)",
            border: isUser ? "none" : "1px solid var(--border-color)",
          }}
        >
          {isUser ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8V4H8" />
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
          )}
        </div>

        {/* Message Bubble */}
        <div
          style={{
            padding: "12px 16px",
            borderRadius: isUser
              ? "var(--border-radius-lg) var(--border-radius-lg) 4px var(--border-radius-lg)"
              : "var(--border-radius-lg) var(--border-radius-lg) var(--border-radius-lg) 4px",
            background: isUser ? "var(--bg-chat-user)" : "var(--bg-chat-bot)",
            color: isUser ? "var(--text-chat-user)" : "var(--text-chat-bot)",
            fontSize: "14.5px",
            lineHeight: 1.6,
            wordBreak: "break-word",
            boxShadow: "var(--shadow-sm)",
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
          paddingLeft: isUser ? "0" : "42px",
          paddingRight: isUser ? "42px" : "0",
        }}
      >
        {timeStr}
      </span>
    </div>
  );
}
