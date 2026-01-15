import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Sidebar.module.css";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  fetchMyBookings,
  cancelBooking,
  hydrateSeatStatuses,
  setDate,
  selectSeat,
  clearBookingError,
} from "@/features/booking/bookingSlice";
import { doLogout } from "@/features/auth/authSlice";

export function MyBookingsSidebar() {
  const loc = useLocation();
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  const { myBookings, status, error } = useAppSelector((s) => s.booking);
  const { user } = useAppSelector((s) => s.auth);

  const [q, setQ] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const userBoxRef = useRef<HTMLDivElement | null>(null);

  // закрытие меню по клику вне
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!menuOpen) return;
      const el = userBoxRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menuOpen]);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch, user?.id]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return myBookings;

    return myBookings.filter((b) => {
      const hay = `${b.date} ${b.seatId} ${b.office} ${b.floor}`.toLowerCase();
      return hay.includes(query);
    });
  }, [myBookings, q]);

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <div
          className={styles.user}
          ref={userBoxRef}
          onClick={() => setMenuOpen((v) => !v)}
          role="button"
          tabIndex={0}
        >
          <div className={styles.avatar} />
          <div className={styles.userName}>{user?.name ?? "Пользователь"}</div>

          {menuOpen && (
            <div className={styles.userMenu} onClick={(e) => e.stopPropagation()}>
              <button
                className={styles.userMenuBtn}
                onClick={() => {
                  setMenuOpen(false);
                  dispatch(doLogout());
                  nav("/login", { replace: true });
                }}
              >
                ВЫЙТИ
              </button>
            </div>
          )}
        </div>

        <div className={styles.tabs}>
          <Link className={tabClass(loc.pathname === "/booking")} to="/booking">
            Бронирование
          </Link>
          <Link className={tabClass(loc.pathname === "/my")} to="/my">
            Моя бронь
          </Link>
        </div>
      </div>

      <div className={styles.field}>
        <div className={styles.label}>Поиск</div>
        <input
          className={styles.input}
          placeholder="по месту / офису / дате"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {error && (
        <div style={{ color: "#8b1c1c", fontSize: 12, lineHeight: 1.3 }}>
          {error}
        </div>
      )}

      <div className={styles.cards}>
        {filtered.length === 0 ? (
          <div style={{ fontSize: 13, color: "#444" }}>Пока нет бронирований</div>
        ) : (
          filtered.map((b) => (
            <div key={b.id} className={styles.card}>
              <div
                className={styles.cardTitle}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  dispatch(clearBookingError());
                  dispatch(setDate(b.date));
                  dispatch(selectSeat(b.seatId));
                  dispatch(hydrateSeatStatuses({ date: b.date }));
                }}
                title="Клик — показать на плане"
              >
                {b.date}
              </div>

              <div className={styles.cardText}>
                Место {b.seatId}, {b.floor}
              </div>
              <div className={styles.cardText}>{b.office}</div>

              <button
                className={styles.secondary}
                disabled={status === "loading"}
                onClick={() => dispatch(cancelBooking({ id: b.id }))}
              >
                {status === "loading" ? "Загрузка..." : "Отменить"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function tabClass(active: boolean) {
  return `${styles.tab} ${active ? styles.tabActive : ""}`;
}
