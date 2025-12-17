import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { LoginPage } from "@/pages/LoginPage";
import { BookingPage } from "@/pages/BookingPage";
import { MyBookingsPage } from "@/pages/MyBookingsPage";

export function AppRouter() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
                path="/booking"
                element={
                    <ProtectedRoute>
                        <BookingPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/my"
                element={
                    <ProtectedRoute>
                        <MyBookingsPage />
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to="/booking" replace />} />
        </Routes>
    );
}
