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
    const bg =
        status === "free" ? "#2aa31a" :
            status === "busy" ? "#8b1c1c" :
                status === "mine" ? "#2b6fff" :
                    "#9aa0ad";

    return (
        <div
            title={label}
            style={{
                width: 18,
                height: 18,
                borderRadius: 2,
                background: bg,
                outline: selected ? "3px solid rgba(0,0,0,0.35)" : "none",
                cursor: status === "free" ? "pointer" : "not-allowed",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
        />
    );
}
