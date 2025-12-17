import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import { setAccessToken, setUser } from "@/features/auth/authSlice";

export function LoginPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogin = () => {
        dispatch(setAccessToken("mock-token"));
        dispatch(
            setUser({
                id: "1",
                name: "Test User",
            })
        );

        navigate("/booking");
    };

    return (
        <div
            style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f6f6fb",
            }}
        >
            <div
                style={{
                    width: 360,
                    padding: 24,
                    background: "#fff",
                    borderRadius: 16,
                    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                }}
            >
                <h2 style={{ marginBottom: 16 }}>Mock login</h2>

                <button
                    onClick={handleLogin}
                    style={{
                        width: "100%",
                        height: 44,
                        borderRadius: 999,
                        border: "none",
                        background: "#9aa0ad",
                        color: "#fff",
                        fontWeight: 600,
                        cursor: "pointer",
                    }}
                >
                    Войти как Test User
                </button>
            </div>
        </div>
    );
}
