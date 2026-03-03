import React from "react";
import styles from "./card.module.css";

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  year: number;
  depot: string;
  status: string;
  healthScore: number;
  lastServiceDate: string;
  alerts: string[];
  serviceHistory: string[];
  isFavorite: boolean;
}

type CardProps = {
  vehicle: Vehicle;
  onSelect?: (vehicle: Vehicle) => void;
  isSelected?: boolean;
  onToggleFavorite?: (vehicleId: string) => void;
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function healthColor(score: number): string {
  if (score >= 80) return "#16a34a";
  if (score >= 70) return "#d97706";
  return "#dc2626";
}

function healthBg(score: number): string {
  if (score >= 80) return "#f0fdf4";
  if (score >= 70) return "#fffbeb";
  return "#fef2f2";
}

function badgeClass(status: string): string {
  switch (status) {
    case "Available": return styles.badgeAvailable;
    case "In Maintenance": return styles.badgeInMaintenance;
    case "Reserved": return styles.badgeReserved;
    default: return "";
  }
}

const Card: React.FC<CardProps> = ({
  vehicle,
  onSelect,
  isSelected = false,
  onToggleFavorite,
}) => (
  <div
    className={`${styles.card} ${vehicle.alerts.length > 0 ? styles.alert : ""} ${isSelected ? styles.cardSelected : ""}`}
    role="button"
    tabIndex={0}
    data-vehicle-id={vehicle.id}
    aria-selected={isSelected}
    onClick={() => onSelect?.(vehicle)}
    onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelect?.(vehicle);
      }
    }}
  >
    <div className={styles.header}>
      <div className={styles.info}>
        <h3 className={styles.name}>{vehicle.name}</h3>
        <p className={styles.model}>{vehicle.model} · {vehicle.year}</p>
        <span className={`${styles.badge} ${badgeClass(vehicle.status)}`}>
          {vehicle.status}
        </span>
      </div>
      <div className={styles.health} aria-label={`Health: ${vehicle.healthScore}%`}>
        <span
          className={styles.progress}
          style={{
            "--value": vehicle.healthScore,
            "--health-color": healthColor(vehicle.healthScore),
            "--health-bg": healthBg(vehicle.healthScore),
          } as React.CSSProperties}
          aria-hidden="true"
        >
          <span className={styles.progressValue}>{vehicle.healthScore}%</span>
        </span>
      </div>
    </div>

    <p className={styles.meta}>
      {vehicle.depot} · Last service {formatDate(vehicle.lastServiceDate)}
    </p>

    {vehicle.alerts.length > 0 && (
      <div className={styles.alertPill}>
        <span aria-hidden="true">⚠</span>
        {vehicle.alerts[0]}
      </div>
    )}

    <div className={styles.footer} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        className={styles.favoriteButton}
        aria-pressed={vehicle.isFavorite}
        aria-label={vehicle.isFavorite ? "Remove from favorites" : "Add to favorites"}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite?.(vehicle.id);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite?.(vehicle.id);
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`${styles.favoriteIcon} ${vehicle.isFavorite ? styles.active : ""}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </button>
      <span className={styles.vehicleId}>{vehicle.id}</span>
    </div>
  </div>
);

export default Card;