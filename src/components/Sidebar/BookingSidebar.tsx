import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import styles from "./Sidebar.module.css";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  selectSeat,
  setDate,
  hydrateSeatStatuses,
  createBooking,
  clearBookingError,
} from "@/features/booking/bookingSlice";
import { doLogout } from "@/features/auth/authSlice";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function BookingSidebar() {
  const loc = useLocation();
  const nav = useNavigate();
  const dispatch = useAppDispatch();

  const {
    date,
    office,
    floor,
    seats,
    seatStatusById,
    selectedSeatId,
    status,
    error,
    myBookingOnDate,
  } = useAppSelector((s) => s.booking);
  const { user } = useAppSelector((s) => s.auth);

  const [menuOpen, setMenuOpen] = useState(false);
  const userBoxRef = useRef<HTMLDivElement | null>(null);

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
    dispatch(hydrateSeatStatuses({ date }));
  }, [dispatch, date, user?.id]);

  const freeSeats = seats.filter((s) => (seatStatusById[s.id] ?? "free") === "free");
  const bookingDisabled = Boolean(myBookingOnDate) || !selectedSeatId || status === "loading";

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
        <div className={styles.label}>Дата</div>
        <input
          className={styles.input}
          type="date"
          min={todayISO()}  // <-- запрет на прошлые даты в UI
          value={date}
          onChange={(e) => {
            dispatch(clearBookingError());
            dispatch(setDate(e.target.value));
          }}
        />
      </div>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <div className={styles.label}>Офис</div>
          <div className={styles.pill}>{office}</div>
        </div>
        <div className={styles.field}>
          <div className={styles.label}>Этаж</div>
          <div className={styles.pill}>{floor}</div>
        </div>
      </div>

      {myBookingOnDate && (
        <div style={{ fontSize: 12, color: "#2b6fff", lineHeight: 1.35 }}>
          У вас уже есть бронь на эту дату: <b>{myBookingOnDate.seatId}</b>
        </div>
      )}

      <div className={styles.sectionTitle}>Свободные места</div>
      <div className={styles.list}>
        {freeSeats.length === 0 ? (
          <div style={{ fontSize: 12, color: "#666" }}>
            {myBookingOnDate ? "Свободные места недоступны — бронь уже есть." : "Нет свободных мест."}
          </div>
        ) : (
          freeSeats.map((s) => (
            <button
              key={s.id}
              className={seatBtnClass(selectedSeatId === s.id)}
              onClick={() => dispatch(selectSeat(s.id))}
            >
              <span>{s.label}</span>
              <span className={styles.check}>{selectedSeatId === s.id ? "✓" : ""}</span>
            </button>
          ))
        )}
      </div>

      {error && (
        <div style={{ color: "#8b1c1c", fontSize: 12, lineHeight: 1.3 }}>
          {error}
        </div>
      )}

      <div className={styles.bottom}>
        <button
          className={styles.primary}
          disabled={bookingDisabled}
          onClick={() => dispatch(createBooking())}
        >
          {status === "loading" ? "Загрузка..." : "Забронировать"}
        </button>
      </div>
    </div>
  );
}

function tabClass(active: boolean) {
  return `${styles.tab} ${active ? styles.tabActive : ""}`;
}
function seatBtnClass(active: boolean) {
  return `${styles.seatBtn} ${active ? styles.seatBtnActive : ""}`;
}
