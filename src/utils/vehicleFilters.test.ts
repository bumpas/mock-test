import { describe, expect, it } from 'vitest'
import type { Vehicle } from '../components/card/Card'
import { filterAndSortVehicles } from './vehicleFilters'

const baseVehicles: Vehicle[] = [
  {
    id: 'V-1001',
    name: 'Atlas',
    model: 'E-Transit',
    year: 2022,
    depot: 'Austin',
    status: 'active',
    healthScore: 82,
    lastServiceDate: '2025-01-05',
    alerts: [],
    serviceHistory: ['2024-10-02'],
    isFavorite: true,
  },
  {
    id: 'V-1002',
    name: 'Bravo',
    model: 'Sprinter',
    year: 2021,
    depot: 'Dallas',
    status: 'maintenance',
    healthScore: 35,
    lastServiceDate: '2024-12-01',
    alerts: ['Oil change'],
    serviceHistory: ['2024-08-15'],
    isFavorite: false,
  },
]

const buildOptions = (overrides: Partial<Parameters<typeof filterAndSortVehicles>[1]> = {}) => ({
  search: '',
  statusFilter: 'all',
  depotFilter: 'all',
  sortBy: 'health-asc',
  favoritesOnly: false,
  favoriteIds: new Set<string>(),
  ...overrides,
})

describe('filterAndSortVehicles', () => {
  it('sorts by health ascending', () => {
    const results = filterAndSortVehicles(baseVehicles, buildOptions())
    expect(results.map((vehicle) => vehicle.id)).toEqual(['V-1002', 'V-1001'])
  })

  it('filters by favorites only', () => {
    const results = filterAndSortVehicles(
      baseVehicles,
      buildOptions({ favoritesOnly: true, favoriteIds: new Set(['V-1001']) })
    )
    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('V-1001')
  })
})
