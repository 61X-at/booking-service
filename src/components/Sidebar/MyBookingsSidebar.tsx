import { Link, useLocation } from "react-router-dom";
import styles from "./Sidebar.module.css";

export function MyBookingsSidebar() {
    const loc = useLocation();

    return (
        <div className={styles.sidebar}>
            <div className={styles.header}>
                <div className={styles.user}>
                    <div className={styles.avatar} />
                    <div className={styles.userName}>Иван Иванов</div>
                </div>

                <div className={styles.tabs}>
                    <Link className={tabClass(loc.pathname === "/booking")} to="/booking">Бронирование</Link>
                    <Link className={tabClass(loc.pathname === "/my")} to="/my">Моя бронь</Link>
                </div>
            </div>

            <div className={styles.field}>
                <div className={styles.label}>Поиск</div>
                <input className={styles.input} placeholder="по месту / офису / дате" />
            </div>

            <div className={styles.cards}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={styles.card}>
                        <div className={styles.cardTitle}>21 ноября</div>
                        <div className={styles.cardText}>Место 1, этаж 4</div>
                        <div className={styles.cardText}>Крутой офис, г. Екатеринбург</div>
                        <button className={styles.secondary} onClick={() => alert("Открыть модалку отмены")}>
                            Отменить
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function tabClass(active: boolean) {
    return `${styles.tab} ${active ? styles.tabActive : ""}`;
}
