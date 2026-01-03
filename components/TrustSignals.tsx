export function TrustSignals() {
  const signals = [
    "100% of calls handled",
    "All conversations logged",
    "System operating normally",
    "No action required",
  ];

  return (
    <div className="trust-signal rounded-2xl p-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {signals.map((signal, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 subtle-pulse" />
            <span className="text-xs text-emerald-400/80">{signal}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
