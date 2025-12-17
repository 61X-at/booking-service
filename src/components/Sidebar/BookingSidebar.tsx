import { Link, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectSeat, setDate } from "@/features/booking/bookingSlice";

export function BookingSidebar() {
    const loc = useLocation();
    const dispatch = useAppDispatch();
    const { date, office, floor, seats, seatStatusById, selectedSeatId } = useAppSelector((s) => s.booking);
    const { user } = useAppSelector((s) => s.auth);

    const freeSeats = seats.filter((s) => (seatStatusById[s.id] ?? "free") === "free");

    return (
        <div className={styles.sidebar}>
            <div className={styles.header}>
                <div className={styles.user}>
                    <div className={styles.avatar} />
                    <div className={styles.userName}>{user?.name ?? "Пользователь"}</div>
                </div>

                <div className={styles.tabs}>
                    <Link className={tabClass(loc.pathname === "/booking")} to="/booking">Бронирование</Link>
                    <Link className={tabClass(loc.pathname === "/my")} to="/my">Моя бронь</Link>
                </div>
            </div>

            <div className={styles.field}>
                <div className={styles.label}>Дата</div>
                <input
                    className={styles.input}
                    type="date"
                    value={date}
                    onChange={(e) => dispatch(setDate(e.target.value))}
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

            <div className={styles.sectionTitle}>Свободные места</div>
            <div className={styles.list}>
                {freeSeats.map((s) => (
                    <button
                        key={s.id}
                        className={seatBtnClass(selectedSeatId === s.id)}
                        onClick={() => dispatch(selectSeat(s.id))}
                    >
                        <span>{s.label}</span>
                        <span className={styles.check}>{selectedSeatId === s.id ? "✓" : ""}</span>
                    </button>
                ))}
            </div>

            <div className={styles.bottom}>
                <button
                    className={styles.primary}
                    disabled={!selectedSeatId}
                    onClick={() => {
                        // тут позже будет thunk createBooking()
                        alert(`Бронь: ${selectedSeatId} на ${date}`);
                    }}
                >
                    Забронировать
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
