import GoogleLoginButton from "./components/GoogleLoginButton";

export default function LoginPage() {
  return (
    <main
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        minHeight: "100dvh",
      }}
    >
      {/* Animated gradient background */}
      <div
        className="gradient-bg"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.15,
          zIndex: 0,
        }}
      />

      {/* Floating orbs for visual depth */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "15%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(108,92,231,0.3) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "float 6s ease-in-out infinite",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          right: "10%",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(116,185,255,0.3) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "float 8s ease-in-out 1s infinite",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "30%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(162,155,254,0.2) 0%, transparent 70%)",
          filter: "blur(50px)",
          animation: "float 7s ease-in-out 2s infinite",
          zIndex: 0,
        }}
      />

      {/* Login Card */}
      <div
        className="glass animate-scale-in"
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "440px",
          margin: "0 20px",
          padding: "48px 40px",
          borderRadius: "var(--border-radius-xl)",
          boxShadow: "var(--shadow-glass)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "32px",
        }}
      >
        {/* Logo / Icon */}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "var(--border-radius-lg)",
            background: "var(--accent-gradient)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-glow)",
          }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <circle cx="9" cy="10" r="1" fill="white" stroke="none" />
            <circle cx="12" cy="10" r="1" fill="white" stroke="none" />
            <circle cx="15" cy="10" r="1" fill="white" stroke="none" />
          </svg>
        </div>

        {/* Title & Subtitle */}
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: "8px",
              color: "var(--text-primary)",
            }}
          >
            ChatBot IA
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "var(--text-secondary)",
              lineHeight: 1.5,
            }}
          >
            Seu assistente inteligente para respostas rápidas e conversas produtivas.
          </p>
        </div>

        {/* Divider */}
        <div
          style={{
            width: "100%",
            height: "1px",
            background: "var(--border-color)",
          }}
        />

        {/* Google Login Button */}
        <div style={{ width: "100%" }}>
          <GoogleLoginButton />
        </div>

        {/* Footer text */}
        <p
          style={{
            fontSize: "12px",
            color: "var(--text-tertiary)",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          Ao entrar, você concorda com nossos Termos de Uso e Política de Privacidade.
        </p>
      </div>
    </main>
  );
}
