"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setToken } from "../../lib/auth";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      setToken(token);
      // Redireciona para o chat
      router.replace("/chat");
    } else {
      setError("Token não encontrado. Tente fazer login novamente.");
      // Redireciona para login após 3 segundos
      setTimeout(() => router.replace("/"), 3000);
    }
  }, [router]);

  return (
    <main
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100dvh",
      }}
    >
      <div
        className="glass animate-scale-in"
        style={{
          padding: "48px 40px",
          borderRadius: "var(--border-radius-xl)",
          textAlign: "center",
          maxWidth: "400px",
          margin: "0 20px",
          boxShadow: "var(--shadow-glass)",
        }}
      >
        {error ? (
          <>
            {/* Error icon */}
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "var(--border-radius-full)",
                background: "rgba(239, 68, 68, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <p style={{ color: "var(--text-primary)", fontSize: "15px", fontWeight: 500 }}>
              {error}
            </p>
            <p style={{ color: "var(--text-tertiary)", fontSize: "13px", marginTop: "8px" }}>
              Redirecionando para o login...
            </p>
          </>
        ) : (
          <>
            {/* Loading spinner */}
            <div
              style={{
                width: "48px",
                height: "48px",
                border: "3px solid var(--border-color)",
                borderTopColor: "var(--accent-primary)",
                borderRadius: "50%",
                margin: "0 auto 20px",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <p style={{ color: "var(--text-primary)", fontSize: "15px", fontWeight: 500 }}>
              Autenticando...
            </p>
            <p style={{ color: "var(--text-tertiary)", fontSize: "13px", marginTop: "8px" }}>
              Aguarde, estamos configurando sua sessão.
            </p>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
