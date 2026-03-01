import type { Vehicle } from '../components/card/Card'

export type VehicleFilterOptions = {
  search: string
  statusFilter: string
  depotFilter: string
  sortBy: string
  favoritesOnly: boolean
  favoriteIds: Set<string>
}

export const filterAndSortVehicles = (
  vehicles: Vehicle[],
  options: VehicleFilterOptions
): Vehicle[] => {
  const { search, statusFilter, depotFilter, sortBy, favoritesOnly, favoriteIds } = options
  const normalizedSearch = search.trim().toLowerCase()

  const filtered = vehicles.filter((vehicle) => {
    if (favoritesOnly && !favoriteIds.has(vehicle.id)) {
      return false
    }

    if (statusFilter !== 'all' && vehicle.status !== statusFilter) {
      return false
    }

    if (depotFilter !== 'all' && vehicle.depot !== depotFilter) {
      return false
    }

    if (normalizedSearch.length > 0) {
      const haystack = `${vehicle.name} ${vehicle.id}`.toLowerCase()
      if (!haystack.includes(normalizedSearch)) {
        return false
      }
    }

    return true
  })

  const sorted = [...filtered]
  sorted.sort((a, b) => {
    switch (sortBy) {
      case 'health-asc':
        return a.healthScore - b.healthScore
      case 'service-asc':
        return new Date(a.lastServiceDate).getTime() - new Date(b.lastServiceDate).getTime()
      case 'service-desc':
        return new Date(b.lastServiceDate).getTime() - new Date(a.lastServiceDate).getTime()
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'health-desc':
      default:
        return b.healthScore - a.healthScore
    }
  })

  return sorted
}
