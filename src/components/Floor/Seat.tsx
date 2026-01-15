import type { SeatStatus } from "@/features/booking/types";

export function SeatMarker({
  label,
  status,
  selected,
}: {
  label: string;
  status: SeatStatus;
  selected: boolean;
}) {
  const size = status === "mine" ? 22 : 18;

  const bg =
    status === "free"
      ? "#2aa31a"
      : status === "busy"
      ? "#8b1c1c"
      : status === "mine"
      ? "#2b6fff"
      : status === "disabled"
      ? "rgba(42, 163, 26, 0.30)" // бледно-зелёный
      : "#9aa0ad";

  return (
    <div
      title={label}
      style={{
        width: size,
        height: size,
        borderRadius: 2,
        background: bg,
        outline: selected ? "3px solid rgba(0,0,0,0.35)" : "none",
        cursor: status === "free" ? "pointer" : "not-allowed",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        transform: status === "mine" ? "scale(1.03)" : "none",
      }}
    />
  );
}
