import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { login } from "@/features/auth/authSlice";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error, token } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (token) navigate("/booking", { replace: true });
  }, [token, navigate]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={onSubmit}>
        <h2 className={styles.title}>Вход</h2>

        <div className={styles.field}>
          <div className={styles.label}>Логин</div>
          <input
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin"
            autoComplete="username"
          />
        </div>

        <div className={styles.field}>
          <div className={styles.label}>Пароль</div>
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="admin"
            autoComplete="current-password"
          />
        </div>

        <button className={styles.primary} type="submit" disabled={loading}>
          {loading ? "Загрузка..." : "Войти"}
        </button>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.hint}>Демо-доступ: admin / admin</div>
      </form>
    </div>
  );
}
