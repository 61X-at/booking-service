import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import bookingReducer from "@/features/booking/bookingSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        booking: bookingReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
