export type Seat = {
    id: string;
    label: string; // "Место 1"
    x: number; // 0..100 (%)
    y: number; // 0..100 (%)
};

export type SeatStatus = "free" | "busy" | "mine" | "disabled";

export type Booking = {
    id: string;
    date: string; // YYYY-MM-DD
    seatId: string;
    office: string;
    floor: string;
};

export type BookingState = {
    date: string; // выбранная дата
    office: string;
    floor: string;
    seats: Seat[];
    seatStatusById: Record<string, SeatStatus>;
    selectedSeatId: string | null;

    myBookings: Booking[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
};
