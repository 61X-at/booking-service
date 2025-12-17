import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


export type User = {
    id: string;
    name: string;
};

export type AuthState = {
    accessToken: string | null;
    user: User | null;
};

const initialState: AuthState = {
    accessToken: localStorage.getItem("access_token"),
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAccessToken(state, action: PayloadAction<string | null>) {
            state.accessToken = action.payload;
            if (action.payload) {
                localStorage.setItem("access_token", action.payload);
            } else {
                localStorage.removeItem("access_token");
            }
        },
        setUser(state, action: PayloadAction<User | null>) {
            state.user = action.payload;
        },
        logout(state) {
            state.accessToken = null;
            state.user = null;
            localStorage.removeItem("access_token");
        },
    },
});

export const { setAccessToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
