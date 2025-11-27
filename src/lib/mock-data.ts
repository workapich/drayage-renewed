import { City, Vendor, Bid, Route, Statistics } from '@/types'

export const cities: City[] = [
  { id: 'atl', name: 'Atlanta', state: 'GA', isPort: true, isInland: false },
  { id: 'bhm', name: 'Birmingham', state: 'AL', isPort: false, isInland: true },
  { id: 'clt', name: 'Charlotte', state: 'NC', isPort: false, isInland: true },
  { id: 'nsh', name: 'Nashville', state: 'TN', isPort: false, isInland: true },
  { id: 'aus', name: 'Austin', state: 'TX', isPort: true, isInland: false },
  { id: 'bos', name: 'Boston', state: 'MA', isPort: true, isInland: false },
  { id: 'buf', name: 'Buffalo', state: 'NY', isPort: true, isInland: false },
  { id: 'chi', name: 'Chicago', state: 'IL', isPort: true, isInland: false },
  { id: 'cle', name: 'Cleveland', state: 'OH', isPort: true, isInland: false },
  { id: 'dal', name: 'Dallas', state: 'TX', isPort: true, isInland: false },
  { id: 'den', name: 'Denver', state: 'CO', isPort: true, isInland: false },
  { id: 'elp', name: 'El Paso', state: 'TX', isPort: true, isInland: false },
  { id: 'fre', name: 'Fresno', state: 'CA', isPort: true, isInland: false },
  { id: 'hou', name: 'Houston', state: 'TX', isPort: true, isInland: false },
  { id: 'ind', name: 'Indianapolis', state: 'IN', isPort: true, isInland: false },
  { id: 'jax', name: 'Jacksonville', state: 'FL', isPort: true, isInland: false },
  { id: 'kc', name: 'Kansas City', state: 'MO', isPort: true, isInland: false },
  { id: 'lv', name: 'Las Vegas', state: 'NV', isPort: true, isInland: false },
  { id: 'la', name: 'Los Angeles', state: 'CA', isPort: true, isInland: false },
  { id: 'mia', name: 'Miami', state: 'FL', isPort: true, isInland: false },
  { id: 'mil', name: 'Milwaukee', state: 'WI', isPort: true, isInland: false },
  { id: 'ny', name: 'New York', state: 'NY', isPort: true, isInland: false },
  { id: 'no', name: 'New Orleans', state: 'LA', isPort: true, isInland: false },
  { id: 'okc', name: 'Oklahoma City', state: 'OK', isPort: true, isInland: false },
  { id: 'orl', name: 'Orlando', state: 'FL', isPort: true, isInland: false },
  { id: 'phi', name: 'Philadelphia', state: 'PA', isPort: true, isInland: false },
  { id: 'phx', name: 'Phoenix', state: 'AZ', isPort: true, isInland: false },
  { id: 'por', name: 'Portland', state: 'OR', isPort: true, isInland: false },
  { id: 'ral', name: 'Raleigh', state: 'NC', isPort: true, isInland: false },
  { id: 'sac', name: 'Sacramento', state: 'CA', isPort: true, isInland: false },
  { id: 'sa', name: 'San Antonio', state: 'TX', isPort: true, isInland: false },
  { id: 'sd', name: 'San Diego', state: 'CA', isPort: true, isInland: false },
  { id: 'sf', name: 'San Francisco', state: 'CA', isPort: true, isInland: false },
  { id: 'sea', name: 'Seattle', state: 'WA', isPort: true, isInland: false },
  { id: 'stl', name: 'St. Louis', state: 'MO', isPort: true, isInland: false },
  { id: 'tam', name: 'Tampa', state: 'FL', isPort: true, isInland: false },
  { id: 'tuc', name: 'Tucson', state: 'AZ', isPort: true, isInland: false },
  { id: 'vb', name: 'Virginia Beach', state: 'VA', isPort: true, isInland: false },
  { id: 'dc', name: 'Washington D.C.', state: 'DC', isPort: true, isInland: false },
  { id: 'cha', name: 'Chattanooga', state: 'TN', isPort: false, isInland: true },
  { id: 'gvl', name: 'Greenville', state: 'SC', isPort: false, isInland: true },
  { id: 'jax-fl', name: 'Jacksonville', state: 'FL', isPort: false, isInland: true },
  { id: 'knx', name: 'Knoxville', state: 'TN', isPort: false, isInland: true },
  { id: 'mem', name: 'Memphis', state: 'TN', isPort: false, isInland: true },
  { id: 'sav', name: 'Savannah', state: 'GA', isPort: false, isInland: true },
]

export const vendors: Vendor[] = [
  { id: 'v1', mcid: 'MC-123456', email: 'john.smith@transport.com', status: 'active', totalBids: 45, joinedDate: '1/15/2024' },
  { id: 'v2', mcid: 'MC-789012', email: 'sarah.j@logistics.com', status: 'active', totalBids: 38, joinedDate: '2/20/2024' },
  { id: 'v3', mcid: 'MC-345678', email: 'mike@davisfreight.com', status: 'inactive', totalBids: 22, joinedDate: '11/10/2023' },
  { id: 'v4', mcid: 'MC-901234', email: 'vendor1@example.com', status: 'active', totalBids: 35, joinedDate: '3/5/2024' },
  { id: 'v5', mcid: 'MC-567890', email: 'vendor2@example.com', status: 'blocked', totalBids: 28, joinedDate: '4/12/2024' },
  { id: 'v6', mcid: 'MC-234567', email: 'vendor3@example.com', status: 'active', totalBids: 31, joinedDate: '5/18/2024' },
  { id: 'v7', mcid: 'MC-890123', email: 'vendor4@example.com', status: 'active', totalBids: 27, joinedDate: '6/22/2024' },
  { id: 'v8', mcid: 'MC-456789', email: 'vendor5@example.com', status: 'active', totalBids: 33, joinedDate: '7/8/2024' },
  { id: 'v9', mcid: 'MC-012345', email: 'vendor6@example.com', status: 'active', totalBids: 29, joinedDate: '8/15/2024' },
]

// Generate routes for Atlanta port
const atlantaRoutes: Route[] = [
  { id: 'r1', portCityId: 'atl', inlandCityId: 'bhm', portCity: cities[0], inlandCity: cities[1] },
  { id: 'r2', portCityId: 'atl', inlandCityId: 'clt', portCity: cities[0], inlandCity: cities[2] },
  { id: 'r3', portCityId: 'atl', inlandCityId: 'nsh', portCity: cities[0], inlandCity: cities[3] },
  { id: 'r4', portCityId: 'atl', inlandCityId: 'cha', portCity: cities[0], inlandCity: cities[37] },
  { id: 'r5', portCityId: 'atl', inlandCityId: 'gvl', portCity: cities[0], inlandCity: cities[38] },
  { id: 'r6', portCityId: 'atl', inlandCityId: 'jax-fl', portCity: cities[0], inlandCity: cities[39] },
  { id: 'r7', portCityId: 'atl', inlandCityId: 'knx', portCity: cities[0], inlandCity: cities[40] },
  { id: 'r8', portCityId: 'atl', inlandCityId: 'mem', portCity: cities[0], inlandCity: cities[41] },
  { id: 'r9', portCityId: 'atl', inlandCityId: 'sav', portCity: cities[0], inlandCity: cities[42] },
]

// Generate sample bids
const generateBids = (): Bid[] => {
  const bids: Bid[] = []
  const baseRates = [275, 280, 285, 290, 295, 300]
  const fscPercentages = [10.34, 10.53, 10.71, 10.91, 11.11]
  
  atlantaRoutes.forEach((route, routeIdx) => {
    vendors.slice(0, 3 + (routeIdx % 3)).forEach((vendor, vendorIdx) => {
      const baseRate = baseRates[vendorIdx % baseRates.length]
      const fsc = fscPercentages[vendorIdx % fscPercentages.length]
      const total = Math.round(baseRate * (1 + fsc / 100))
      const status = vendorIdx % 4 === 0 ? 'pending' : 'submitted'
      
      bids.push({
        id: `bid-${route.id}-${vendor.id}-${vendorIdx}`,
        vendorId: vendor.id,
        vendorEmail: vendor.email,
        routeId: route.id,
        portCityId: route.portCityId,
        inlandCityId: route.inlandCityId,
        baseRate,
        fsc,
        total,
        accessorials: {
          chassis: 0,
          yardStorage: 0,
          hazmat: 0,
          bond: 0,
          split: 0,
          flip: 0,
          overweight: 0,
          prepull: 0,
        },
        submittedAt: new Date(2025, 0, 14 - vendorIdx - routeIdx, 14 + vendorIdx, 20).toISOString(),
        status,
      })
    })
  })
  
  return bids
}

export const bids: Bid[] = generateBids()

export const routes: Route[] = atlantaRoutes

export const statistics: Statistics = {
  totalBids: 1117,
  bidsLast24h: 23,
  bidsLast7d: 147,
  activeRoutes: 439,
}

// Helper functions
export const getCityById = (id: string): City | undefined => {
  return cities.find(c => c.id === id)
}

export const getPortCities = (): City[] => {
  return cities.filter(c => c.isPort)
}

export const getInlandCitiesForPort = (portCityId: string): City[] => {
  const routeIds = routes.filter(r => r.portCityId === portCityId).map(r => r.inlandCityId)
  return cities.filter(c => routeIds.includes(c.id))
}

export const getRoutesForPort = (portCityId: string): Route[] => {
  return routes.filter(r => r.portCityId === portCityId)
}

export const getBidsForRoute = (routeId: string): Bid[] => {
  return bids.filter(b => b.routeId === routeId)
}

export const getBidsForPort = (portCityId: string): Bid[] => {
  return bids.filter(b => b.portCityId === portCityId)
}

export const getBidCountsByCity = (): Record<string, number> => {
  // Mock data matching the screenshots
  return {
    'atl': 45,
    'aus': 18,
    'bos': 32,
    'buf': 12,
    'chi': 56,
    'cle': 21,
    'dal': 48,
    'den': 28,
    'elp': 15,
    'fre': 9,
    'hou': 41,
    'ind': 24,
    'jax': 19,
    'kc': 22,
    'lv': 31,
    'la': 67,
    'mia': 38,
    'mil': 16,
    'nsh': 27,
    'no': 23,
    'ny': 59,
    'okc': 17,
    'orl': 25,
    'phi': 44,
    'phx': 34,
    'por': 26,
    'ral': 18,
    'sac': 21,
    'sa': 30,
    'sd': 36,
    'sf': 42,
    'sea': 39,
    'stl': 28,
    'tam': 26,
    'tuc': 13,
    'vb': 16,
    'dc': 51,
  }
}

export const getPendingBidCountsByCity = (vendorId: string): Record<string, number> => {
  const counts: Record<string, number> = {}
  cities.filter(c => c.isPort).forEach(city => {
    const cityBids = getBidsForPort(city.id).filter(b => b.vendorId === vendorId)
    counts[city.id] = cityBids.filter(b => b.status === 'pending').length
  })
  // Mock: Return some pending counts for demo
  return {
    'atl': 3,
    'ny': 5,
    'la': 6,
    'chi': 2,
    'hou': 3,
    'mia': 3,
    'phi': 4,
    'sf': 4,
    'sea': 3,
    'dal': 4,
    'bos': 5,
    'dc': 4,
  }
}

export const getSubmittedBidCountsByCity = (vendorId: string): Record<string, number> => {
  const counts: Record<string, number> = {}
  cities.filter(c => c.isPort).forEach(city => {
    const cityBids = getBidsForPort(city.id).filter(b => b.vendorId === vendorId)
    counts[city.id] = cityBids.filter(b => b.status === 'submitted').length
  })
  // Mock: Return some submitted counts for demo
  return {
    'nsh': 1,
  }
}

