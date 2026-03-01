import React from "react";
import styles from "./Toolbar.module.css";

export type ToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  depot: string;
  onDepotChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  favoritesOnly: boolean;
  onFavoritesToggle: (value: boolean) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  statuses: string[];
  depots: string[];
  resultCount: number;
};

const Toolbar: React.FC<ToolbarProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  depot,
  onDepotChange,
  sort,
  onSortChange,
  favoritesOnly,
  onFavoritesToggle,
  onClear,
  hasActiveFilters,
  statuses,
  depots,
  resultCount,
}) => {
  return (
    <div className={styles.toolbar}>
      <div className={styles.group}>
        <label className={styles.label} htmlFor="search">
          Search
        </label>
        <input
          id="search"
          className={styles.input}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by name or ID"
          type="search"
        />
      </div>
      <div className={styles.group}>
        <label className={styles.label} htmlFor="status">
          Status
        </label>
        <select
          id="status"
          className={styles.select}
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
        >
          <option value="all">All</option>
          {statuses.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.group}>
        <label className={styles.label} htmlFor="depot">
          Depot
        </label>
        <select
          id="depot"
          className={styles.select}
          value={depot}
          onChange={(event) => onDepotChange(event.target.value)}
        >
          <option value="all">All</option>
          {depots.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.group}>
        <label className={styles.label} htmlFor="sort">
          Sort
        </label>
        <select
          id="sort"
          className={styles.select}
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
        >
          <option value="health-asc">Health (low → high)</option>
          <option value="health-desc">Health (high → low)</option>
          <option value="service-desc">Last service (new → old)</option>
          <option value="service-asc">Last service (old → new)</option>
          <option value="name-asc">Name (A → Z)</option>
        </select>
      </div>
      <div className={styles.group}>
        <span className={styles.label}>Favorites</span>
        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={favoritesOnly}
            onChange={(event) => onFavoritesToggle(event.target.checked)}
          />
          Show favorites only
        </label>
      </div>
      {hasActiveFilters ? (
        <button type="button" className={styles.clearButton} onClick={onClear}>
          Clear filters
        </button>
      ) : null}
      <div className={styles.count} aria-live="polite">
        {resultCount} vehicles
      </div>
    </div>
  );
};

export default Toolbar;
