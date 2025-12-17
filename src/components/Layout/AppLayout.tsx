import styles from "./AppLayout.module.css";

export function AppLayout({
    left,
    right,
}: {
    left: React.ReactNode;
    right: React.ReactNode;
}) {
    return (
        <div className={styles.page}>
            <div className={styles.left}>{left}</div>
            <aside className={styles.right}>{right}</aside>
        </div>
    );
}
