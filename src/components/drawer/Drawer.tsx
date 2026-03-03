import React from "react";
import styles from "./Drawer.module.css";
import type { Vehicle } from "../card/Card";

export type DrawerProps = {
  open: boolean;
  vehicle: Vehicle | null;
  onClose: () => void;
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function badgeClass(status: string): string {
  switch (status) {
    case "Available": return styles.badgeAvailable;
    case "In Maintenance": return styles.badgeInMaintenance;
    case "Reserved": return styles.badgeReserved;
    default: return "";
  }
}

const Drawer: React.FC<DrawerProps> = ({ open, vehicle, onClose }) => {
  const hasAlerts = (vehicle?.alerts?.length ?? 0) > 0;
  const title = vehicle ? `${vehicle.name} · ${vehicle.model}` : "";

  return (
    <div
      className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className={styles.header}>
          <h2 className={styles.title}>
            {hasAlerts && <span aria-label="has alerts">⚠️</span>}
            {title}
          </h2>
          <button className={styles.closeButton} type="button" onClick={onClose}>
            Close
          </button>
        </header>

        {vehicle && (
          <>
            <div className={styles.divider} />

            <div className={styles.metaRow}>
              <span className={`${styles.badge} ${badgeClass(vehicle.status)}`}>
                {vehicle.status}
              </span>
              <span className={styles.metaItem}>
                <span className={styles.metaLabel}>Depot:</span>
                <span className={styles.metaValue}>{vehicle.depot}</span>
              </span>
              <span className={styles.metaItem}>
                <span className={styles.metaLabel}>Last service:</span>
                <span className={styles.metaValue}>{formatDate(vehicle.lastServiceDate)}</span>
              </span>
            </div>

            <div className={styles.divider} />

            <section className={styles.section}>
              <h3 className={styles.sectionHeading}>Alerts</h3>
              {vehicle.alerts.length === 0 ? (
                <p className={styles.emptyText}>None</p>
              ) : (
                vehicle.alerts.map((alert) => (
                  <div key={alert} className={styles.alertItem}>
                    <span aria-hidden="true">⚠</span>
                    {alert}
                  </div>
                ))
              )}
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionHeading}>Service History</h3>
              <div className={styles.historyList}>
                {vehicle.serviceHistory.map((entry) => {
                  const colonIdx = entry.indexOf(": ");
                  const dateStr = colonIdx !== -1 ? entry.slice(0, colonIdx) : entry;
                  const desc = colonIdx !== -1 ? entry.slice(colonIdx + 2) : "";
                  return (
                    <div key={entry} className={styles.historyEntry}>
                      <div className={styles.historyDot} />
                      <div className={styles.historyContent}>
                        <span className={styles.historyDate}>{formatDate(dateStr)}</span>
                        <span className={styles.historyDesc}>{desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Drawer;
