export default function LoadingModal({ streamedContent }: { streamedContent: string }) {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      backdropFilter: "blur(4px)"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        borderRadius: "24px",
        backgroundColor: "#1a1d25",
        padding: "32px",
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)"
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "48px",
              height: "48px",
              animation: "spin 1s linear infinite",
              borderRadius: "50%",
              border: "4px solid #2a2d35",
              borderTopColor: "#2563eb"
            }} />
            <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#e8ebf2" }}>Analyse en cours</h2>
            <p style={{ fontSize: "12px", color: "#8a8d99" }}>La machine réfléchit...</p>
          </div>

          {streamedContent && (
            <div style={{
              maxHeight: "192px",
              width: "100%",
              overflowY: "auto",
              borderRadius: "8px",
              backgroundColor: "#252a35",
              padding: "16px"
            }}>
              <p style={{ fontSize: "14px", lineHeight: "1.5", color: "#e8ebf2" }}>
                {streamedContent}
                <span style={{ animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite", color: "#2563eb" }}>▊</span>
              </p>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {[0, 150, 300].map((delay) => (
              <div
                key={delay}
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: delay % 2 === 0 ? "#10b981" : "#2563eb",
                  animation: `bounce 1.4s infinite`,
                  animationDelay: `${delay}ms`
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 80%, 100% { opacity: 1; }
          40% { opacity: 0.5; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
