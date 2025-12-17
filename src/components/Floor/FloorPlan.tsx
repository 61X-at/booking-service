import floorImg from "@/assets/floors/floor-4.png";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectSeat } from "@/features/booking/bookingSlice";
import { SeatMarker } from "./Seat";

export function FloorPlan() {
    const dispatch = useAppDispatch();
    const { seats, seatStatusById, selectedSeatId } = useAppSelector(s => s.booking);

    return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <img
                src={floorImg}
                alt="Floor plan"
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                    userSelect: "none",
                    pointerEvents: "none",
                }}
            />

            {/* overlay */}
            <div style={{ position: "absolute", inset: 0 }}>
                {seats.map((seat) => {
                    const status = seatStatusById[seat.id] ?? "free";
                    const selected = selectedSeatId === seat.id;

                    return (
                        <div
                            key={seat.id}
                            style={{
                                position: "absolute",
                                left: `${seat.x}%`,
                                top: `${seat.y}%`,
                                transform: "translate(-50%, -50%)",
                            }}
                            onClick={() => {
                                if (status !== "free") return;
                                dispatch(selectSeat(seat.id));
                            }}
                        >
                            <SeatMarker label={seat.label} status={status} selected={selected} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
