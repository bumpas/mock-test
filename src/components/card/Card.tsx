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
      <h3 className={styles.title}>
        {vehicle.name} - {vehicle.model}
      </h3>
      {vehicle.healthScore !== undefined && (
        <div className={styles.health} aria-label={`Health: ${vehicle.healthScore}%`}>
          <span
            className={styles.progress}
            style={{ "--value": vehicle.healthScore } as React.CSSProperties}
            aria-hidden="true"
          >
            <span aria-hidden="true" className={styles.progressValue}>{vehicle.healthScore}%</span>
          </span>
        </div>
      )}
    </div>
    <span className={styles.badge}>
      {vehicle.status}
    </span>
    <p className={styles.row}>
      <strong>Year:</strong> {vehicle.year}
    </p>
    <p className={styles.row}>
      <strong>Depot:</strong> {vehicle.depot}
    </p>
    <p className={styles.row}>
      <strong>Last Service:</strong> {vehicle.lastServiceDate}
    </p>
    <div className={styles.actions} onClick={(event) => event.stopPropagation()}>
      <span>
        <input type="checkbox" id={`compare-${vehicle.id}`} name="compare" value={vehicle.id} />
        <label htmlFor={`compare-${vehicle.id}`}>Compare</label>  
      </span>
      <button
        type="button"
        className={styles.favoriteButton}
        aria-pressed={vehicle.isFavorite}
        aria-label={vehicle.isFavorite ? "Remove from favorites" : "Add to favorites"}
        onClick={(event) => {
          event.stopPropagation();
          onToggleFavorite?.(vehicle.id);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            event.stopPropagation();
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
    </div>
  </div>
);

export default Card;