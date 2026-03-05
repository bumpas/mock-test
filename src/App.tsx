import { useEffect, useMemo, useState } from 'react'
import Card, { type Vehicle } from './components/card/Card'
import Drawer from './components/drawer/Drawer'
import Toolbar from './components/toolbar/Toolbar'
import vehicles from './data/vehicles.json'
import { filterAndSortVehicles } from './utils/vehicleFilters'

function App() {
  const baseVehicles = useMemo(() => vehicles as Vehicle[], [])
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => {
    const stored = localStorage.getItem('favorites')
    if (!stored) {
      return new Set()
    }
    try {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        return new Set(parsed.filter((id) => typeof id === 'string'))
      }
    } catch {
      // ignore invalid localStorage data
    }
    return new Set()
  })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [depotFilter, setDepotFilter] = useState('all')
  const [sortBy, setSortBy] = useState('health-asc')
  const [favoritesOnly, setFavoritesOnly] = useState(false)

  const handleClearFilters = () => {
    setSearch('')
    setStatusFilter('all')
    setDepotFilter('all')
    setSortBy('health-asc')
    setFavoritesOnly(false)
  }

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(Array.from(favoriteIds)))
  }, [favoriteIds])

  const vehicleList = useMemo(
    () =>
      baseVehicles.map((vehicle) => ({
        ...vehicle,
        isFavorite: favoriteIds.has(vehicle.id) || Boolean(vehicle.isFavorite),
      })),
    [baseVehicles, favoriteIds]
  )

  const statusOptions = useMemo(
    () => Array.from(new Set(baseVehicles.map((vehicle) => vehicle.status))).sort(),
    [baseVehicles]
  )
  const depotOptions = useMemo(
    () => Array.from(new Set(baseVehicles.map((vehicle) => vehicle.depot))).sort(),
    [baseVehicles]
  )

  const filteredVehicles = useMemo(
    () =>
      filterAndSortVehicles(vehicleList, {
        search,
        statusFilter,
        depotFilter,
        sortBy,
        favoritesOnly,
        favoriteIds,
      }),
    [vehicleList, search, statusFilter, depotFilter, sortBy, favoritesOnly, favoriteIds]
  )

  const hasActiveFilters =
    search.trim().length > 0 ||
    statusFilter !== 'all' ||
    depotFilter !== 'all' ||
    sortBy !== 'health-asc' ||
    favoritesOnly

  useEffect(() => {
    if (!selectedVehicle) {
      return
    }

    const selectedCard = document.querySelector<HTMLElement>(
      `[data-vehicle-id="${selectedVehicle.id}"]`
    )
    selectedCard?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setSelectedVehicle(null)
        return
      }

      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
        return
      }

      event.preventDefault()
      const currentIndex = filteredVehicles.findIndex((vehicle) => vehicle.id === selectedVehicle.id)
      if (currentIndex === -1) {
        return
      }

      const direction = event.key === 'ArrowRight' ? 1 : -1
      const nextIndex = (currentIndex + direction + filteredVehicles.length) % filteredVehicles.length
      setSelectedVehicle(filteredVehicles[nextIndex])
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedVehicle, filteredVehicles])

  const handleToggleFavorite = (vehicleId: string) => {
    setFavoriteIds((current) => {
      const next = new Set(current)
      if (next.has(vehicleId)) {
        next.delete(vehicleId)
      } else {
        next.add(vehicleId)
      }
      return next
    })
  }

  return (
    <>
      <div className="container">
        <h1>Woven Fleet Services</h1>
        <Toolbar
          search={search}
          onSearchChange={setSearch}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          depot={depotFilter}
          onDepotChange={setDepotFilter}
          sort={sortBy}
          onSortChange={setSortBy}
          favoritesOnly={favoritesOnly}
          onFavoritesToggle={setFavoritesOnly}
          onClear={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
          statuses={statusOptions}
          depots={depotOptions}
          resultCount={filteredVehicles.length}
        />
        {filteredVehicles.length === 0 ? (
          <div className="empty-state" role="status" aria-live="polite">
            <h2>No vehicles match your filters</h2>
            <p>Try adjusting your search or clearing filters to see more results.</p>
            {hasActiveFilters ? (
              <button
                type="button"
                className="empty-state__button"
                onClick={handleClearFilters}
              >
                Clear filters
              </button>
            ) : null}
          </div>
        ) : (
          <div className="card-grid">
            {filteredVehicles.map((vehicle) => (
              <Card
                key={vehicle.id}
                vehicle={vehicle}
                onSelect={setSelectedVehicle}
                isSelected={selectedVehicle?.id === vehicle.id}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
      <Drawer
        open={selectedVehicle !== null}
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
      />
    </>
  )
}

export default App
