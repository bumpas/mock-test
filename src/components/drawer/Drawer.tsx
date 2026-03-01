import React from "react";
import styles from "./Drawer.module.css";

export type DrawerProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  alerts?: boolean;
};

const Drawer: React.FC<DrawerProps> = ({ open, title, onClose, children, alerts }) => {
  return (
    <div
      className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className={styles.header}>
          <h2 className={styles.title}>
            {alerts && (
              <span className={styles.alertBadge} aria-label="alert">
                ⚠️
              </span>
            )}
            {title}
          </h2>
          <button className={styles.closeButton} type="button" onClick={onClose}>
            Close
          </button>
        </header>
        {children}
      </div>
    </div>
  );
};

export default Drawer;
