export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        height: "100dvh",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}
