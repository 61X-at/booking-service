import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { BookingState, Seat, SeatStatus, Booking } from "./types";
import { readBookings, writeBookings, makeId } from "./storage";
import type { RootState } from "@/app/store";

const demoSeats: Seat[] = [
  { id: "S1", label: "Место 1", x: 43.5, y: 42 },
  { id: "S2", label: "Место 2", x: 47, y: 42 },
  { id: "S3", label: "Место 3", x: 47, y: 46 },
  { id: "S4", label: "Место 4", x: 43.5, y: 46 },
  { id: "S5", label: "Место 5", x: 43.5, y: 55 },
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function clampDateNotPast(date: string) {
  const t = todayISO();
  return date < t ? t : date;
}

function computeForDate(args: {
  seats: Seat[];
  date: string;
  userId: string;
  bookings: Booking[];
}): { statuses: Record<string, SeatStatus>; myBookingOnDate: Booking | null } {
  const { seats, date, userId, bookings } = args;

  const statuses: Record<string, SeatStatus> = Object.fromEntries(
    seats.map((s) => [s.id, "free" as SeatStatus])
  );

  const myBookingOnDate =
    bookings.find((b) => b.userId === userId && b.date === date) ?? null;

  for (const b of bookings) {
    if (b.date !== date) continue;
    if (!(b.seatId in statuses)) continue;

    statuses[b.seatId] = b.userId === userId ? "mine" : "busy";
  }

  if (myBookingOnDate) {
    for (const seatId of Object.keys(statuses)) {
      if (statuses[seatId] === "free") statuses[seatId] = "disabled";
    }
  }

  return { statuses, myBookingOnDate };
}

export const hydrateSeatStatuses = createAsyncThunk<
  { statuses: Record<string, SeatStatus>; myBookingOnDate: Booking | null },
  { date?: string } | undefined,
  { state: RootState; rejectValue: string }
>("booking/hydrateSeatStatuses", async (payload, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const date = clampDateNotPast(payload?.date ?? state.booking.date);
    const userId = state.auth.user?.id ?? "demo";

    const bookings = readBookings();
    return computeForDate({
      seats: state.booking.seats,
      date,
      userId,
      bookings,
    });
  } catch {
    return rejectWithValue("Не удалось загрузить статусы мест");
  }
});

export const fetchMyBookings = createAsyncThunk<
  Booking[],
  void,
  { state: RootState; rejectValue: string }
>("booking/fetchMyBookings", async (_, { getState, rejectWithValue }) => {
  try {
    const userId = getState().auth.user?.id ?? "demo";
    const bookings = readBookings();
    return bookings
      .filter((b) => b.userId === userId)
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  } catch {
    return rejectWithValue("Не удалось загрузить мои бронирования");
  }
});

export const createBooking = createAsyncThunk<
  Booking,
  void,
  { state: RootState; rejectValue: string }
>("booking/createBooking", async (_, { getState, dispatch, rejectWithValue }) => {
  const state = getState();
  const userId = state.auth.user?.id ?? "demo";

  const date = state.booking.date;
  const seatId = state.booking.selectedSeatId;
  const office = state.booking.office;
  const floor = state.booking.floor;

  if (!seatId) return rejectWithValue("Выберите место");

  // NEW: запрет на прошлые даты (на всякий случай — кроме UI)
  if (date < todayISO()) {
    return rejectWithValue("Нельзя бронировать на прошедшую дату");
  }

  try {
    const bookings = readBookings();

    const alreadyBookedThatDay = bookings.some(
      (b) => b.userId === userId && b.date === date
    );
    if (alreadyBookedThatDay) {
      return rejectWithValue("У вас уже есть бронь на выбранную дату");
    }

    const conflict = bookings.some((b) => b.date === date && b.seatId === seatId);
    if (conflict) {
      return rejectWithValue("Это место уже занято на выбранную дату");
    }

    const booking: Booking = {
      id: makeId("BOOK"),
      userId,
      date,
      seatId,
      office,
      floor,
    };

    writeBookings([...bookings, booking]);

    await dispatch(hydrateSeatStatuses({ date }));
    await dispatch(fetchMyBookings());

    return booking;
  } catch {
    return rejectWithValue("Не удалось создать бронирование");
  }
});

export const cancelBooking = createAsyncThunk<
  string,
  { id: string },
  { state: RootState; rejectValue: string }
>("booking/cancelBooking", async ({ id }, { getState, dispatch, rejectWithValue }) => {
  const state = getState();
  const userId = state.auth.user?.id ?? "demo";

  try {
    const bookings = readBookings();
    const target = bookings.find((b) => b.id === id);

    if (!target) return rejectWithValue("Бронирование не найдено");
    if (target.userId !== userId) return rejectWithValue("Нельзя отменить чужую бронь");

    writeBookings(bookings.filter((b) => b.id !== id));

    await dispatch(hydrateSeatStatuses({ date: state.booking.date }));
    await dispatch(fetchMyBookings());

    return id;
  } catch {
    return rejectWithValue("Не удалось отменить бронирование");
  }
});

const initialState: BookingState = {
  date: todayISO(),
  office: "Крутой офис, г. Екатеринбург",
  floor: "Этаж 4",
  seats: demoSeats,
  seatStatusById: Object.fromEntries(demoSeats.map((s) => [s.id, "free" as SeatStatus])),
  selectedSeatId: null,

  myBookings: [],
  myBookingOnDate: null,

  status: "idle",
  error: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setDate(state, action: PayloadAction<string>) {
      const next = clampDateNotPast(action.payload);
      state.date = next;
      state.selectedSeatId = null;
      state.error = null;
    },
    setOffice(state, action: PayloadAction<string>) {
      state.office = action.payload;
      state.selectedSeatId = null;
      state.error = null;
    },
    setFloor(state, action: PayloadAction<string>) {
      state.floor = action.payload;
      state.selectedSeatId = null;
      state.error = null;
    },
    selectSeat(state, action: PayloadAction<string | null>) {
      state.selectedSeatId = action.payload;
      state.error = null;
    },
    clearBookingError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrateSeatStatuses.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(hydrateSeatStatuses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.seatStatusById = action.payload.statuses;
        state.myBookingOnDate = action.payload.myBookingOnDate;

        if (state.myBookingOnDate) {
          state.selectedSeatId = null;
        }
      })
      .addCase(hydrateSeatStatuses.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Ошибка";
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.myBookings = action.payload;
      })
      .addCase(createBooking.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state) => {
        state.status = "succeeded";
        state.selectedSeatId = null;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Ошибка";
      })
      .addCase(cancelBooking.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Ошибка";
      });
  },
});

export const { setDate, setOffice, setFloor, selectSeat, clearBookingError } =
  bookingSlice.actions;

export default bookingSlice.reducer;
