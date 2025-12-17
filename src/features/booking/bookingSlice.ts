import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { BookingState, Seat, SeatStatus, Booking } from "./types";

const demoSeats: Seat[] = [
    { id: "S1", label: "Место 1", x: 43.5, y: 42 },
    { id: "S2", label: "Место 2", x: 47, y: 42 },
    { id: "S3", label: "Место 3", x: 47, y: 46 },
    { id: "S4", label: "Место 4", x: 43.5, y: 46 },
    { id: "S5", label: "Место 5", x: 43.5, y: 55 },
];

const initialState: BookingState = {
    date: new Date().toISOString().slice(0, 10),
    office: "Крутой офис, г. Екатеринбург",
    floor: "Этаж 4",
    seats: demoSeats,
    seatStatusById: Object.fromEntries(demoSeats.map(s => [s.id, "free" as SeatStatus])),
    selectedSeatId: null,
    myBookings: [],
    status: "idle",
    error: null,
};

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        setDate(state, action: PayloadAction<string>) {
            state.date = action.payload;
            state.selectedSeatId = null;
        },
        setOffice(state, action: PayloadAction<string>) {
            state.office = action.payload;
            state.selectedSeatId = null;
        },
        setFloor(state, action: PayloadAction<string>) {
            state.floor = action.payload;
            state.selectedSeatId = null;
        },
        selectSeat(state, action: PayloadAction<string | null>) {
            state.selectedSeatId = action.payload;
        },
        setSeatStatuses(state, action: PayloadAction<Record<string, SeatStatus>>) {
            state.seatStatusById = action.payload;
        },
        setMyBookings(state, action: PayloadAction<Booking[]>) {
            state.myBookings = action.payload;
        },
    },
});

export const { setDate, setOffice, setFloor, selectSeat, setSeatStatuses, setMyBookings } =
    bookingSlice.actions;

export default bookingSlice.reducer;
