import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const accessToken = useAppSelector((state) => state.auth.accessToken);

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
