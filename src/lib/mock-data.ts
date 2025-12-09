import { City, Vendor, Bid, Route, Statistics } from '@/types'

// Port Locations (from picture 1)
const portRampRegions: City[] = [
  { id: 'atl', name: 'Atlanta', state: 'GA', isPort: true, isInland: false },
  { id: 'bal', name: 'Baltimore', state: 'MD', isPort: true, isInland: false },
  { id: 'bos', name: 'Boston', state: 'MA', isPort: true, isInland: false },
  { id: 'cal', name: 'Calgary', state: 'AB', country: 'Canada', isPort: true, isInland: false },
  { id: 'chs', name: 'Charleston', state: 'SC', isPort: true, isInland: false },
  { id: 'clt', name: 'Charlotte', state: 'NC', isPort: true, isInland: false },
  { id: 'chi', name: 'Chicago', state: 'IL', isPort: true, isInland: false },
  { id: 'cle', name: 'Cleveland', state: 'OH', isPort: true, isInland: false },
  { id: 'col', name: 'Columbus', state: 'OH', isPort: true, isInland: false },
  { id: 'dfw', name: 'Dallas / Fort Worth', state: 'TX', isPort: true, isInland: false },
  { id: 'den', name: 'Denver', state: 'CO', isPort: true, isInland: false },
  { id: 'det', name: 'Detroit', state: 'MI', isPort: true, isInland: false },
  { id: 'hnl', name: 'Honolulu', state: 'HI', isPort: true, isInland: false },
  { id: 'hou', name: 'Houston', state: 'TX', isPort: true, isInland: false },
  { id: 'ind', name: 'Indianapolis', state: 'IN', isPort: true, isInland: false },
  { id: 'kc', name: 'Kansas City', state: 'KS/MO', isPort: true, isInland: false },
  { id: 'lalb', name: 'LA / Long Beach', state: 'CA', isPort: true, isInland: false },
  { id: 'lou', name: 'Louisville', state: 'KY', isPort: true, isInland: false },
  { id: 'mem-mar', name: 'Memphis, TN / Marion, AR', state: 'TN/AR', isPort: true, isInland: false },
  { id: 'mia-pe', name: 'Miami, FL / Port Everglades, FL', state: 'FL', isPort: true, isInland: false },
  { id: 'msp', name: 'Minneapolis / St. Paul', state: 'MN', isPort: true, isInland: false },
  { id: 'mob', name: 'Mobile', state: 'AL', isPort: true, isInland: false },
  { id: 'mtl', name: 'Montreal', state: 'PQ', country: 'Canada', isPort: true, isInland: false },
  { id: 'nsh', name: 'Nashville', state: 'TN', isPort: true, isInland: false },
  { id: 'no', name: 'New Orleans', state: 'LA', isPort: true, isInland: false },
  { id: 'ny-nj', name: 'New York / New Jersey', state: 'NY/NJ', isPort: true, isInland: false },
  { id: 'nor', name: 'Norfolk', state: 'VA', isPort: true, isInland: false },
  { id: 'oak', name: 'Oakland', state: 'CA', isPort: true, isInland: false },
  { id: 'phi', name: 'Philadelphia', state: 'PA', isPort: true, isInland: false },
  { id: 'pit', name: 'Pittsburgh', state: 'PA', isPort: true, isInland: false },
  { id: 'por', name: 'Portland', state: 'OR', isPort: true, isInland: false },
  { id: 'slc', name: 'Salt Lake City', state: 'UT', isPort: true, isInland: false },
  { id: 'sav', name: 'Savannah', state: 'GA', isPort: true, isInland: false },
  { id: 'sea-tac', name: 'Seattle / Tacoma', state: 'WA', isPort: true, isInland: false },
  { id: 'tam', name: 'Tampa', state: 'FL', isPort: true, isInland: false },
  { id: 'tor', name: 'Toronto', state: 'ON', country: 'Canada', isPort: true, isInland: false },
  { id: 'van', name: 'Vancouver', state: 'BC', country: 'Canada', isPort: true, isInland: false },
]

// Inland Locations (from picture 2)
const inlandLocations: City[] = [
  { id: 'abbeville-sc', name: 'Abbeville', state: 'SC', isPort: false, isInland: true },
  { id: 'appling-ga', name: 'Appling', state: 'GA', isPort: false, isInland: true },
  { id: 'augusta-ga', name: 'Augusta', state: 'GA', isPort: false, isInland: true },
  { id: 'east-point-ga', name: 'East Point', state: 'GA', isPort: false, isInland: true },
  { id: 'gadsden-al', name: 'Gadsden', state: 'AL', isPort: false, isInland: true },
  { id: 'huntsville-al', name: 'Huntsville', state: 'AL', isPort: false, isInland: true },
  { id: 'lawrenceville-ga', name: 'Lawrenceville', state: 'GA', isPort: false, isInland: true },
  { id: 'tifton-ga', name: 'Tifton', state: 'GA', isPort: false, isInland: true },
  { id: 'hampstead-md', name: 'Hampstead', state: 'MD', isPort: false, isInland: true },
  { id: 'north-east-md', name: 'North East', state: 'MD', isPort: false, isInland: true },
  { id: 'franklin-nh', name: 'Franklin', state: 'NH', isPort: false, isInland: true },
  { id: 'slatersville-ri', name: 'Slatersville', state: 'RI', isPort: false, isInland: true },
  { id: 'kings-mountain-nc', name: 'Kings Mountain', state: 'NC', isPort: false, isInland: true },
  { id: 'orangeburg-sc', name: 'Orangeburg', state: 'SC', isPort: false, isInland: true },
  { id: 'saint-pauls-nc', name: 'Saint Pauls', state: 'NC', isPort: false, isInland: true },
  { id: 'sanford-nc', name: 'Sanford', state: 'NC', isPort: false, isInland: true },
  { id: 'spindale-nc', name: 'Spindale', state: 'NC', isPort: false, isInland: true },
  { id: 'summerville-sc', name: 'Summerville', state: 'SC', isPort: false, isInland: true },
  { id: 'amana-ia', name: 'Amana', state: 'IA', isPort: false, isInland: true },
  { id: 'cedar-rapids-ia', name: 'Cedar Rapids', state: 'IA', isPort: false, isInland: true },
  { id: 'chicago-il-inland', name: 'Chicago', state: 'IL', isPort: false, isInland: true },
  { id: 'elkhart-in', name: 'Elkhart', state: 'IN', isPort: false, isInland: true },
  { id: 'janesville-wi', name: 'Janesville', state: 'WI', isPort: false, isInland: true },
  { id: 'joliet-il', name: 'Joliet', state: 'IL', isPort: false, isInland: true },
  { id: 'kalamazoo-mi', name: 'Kalamazoo', state: 'MI', isPort: false, isInland: true },
  { id: 'marshalltown-ia', name: 'Marshalltown', state: 'IA', isPort: false, isInland: true },
  { id: 'mount-pleasant-wi', name: 'Mount Pleasant', state: 'WI', isPort: false, isInland: true },
  { id: 'pingree-grove-il', name: 'Pingree Grove', state: 'IL', isPort: false, isInland: true },
  { id: 'richmond-in', name: 'Richmond', state: 'IN', isPort: false, isInland: true },
  { id: 'romeoville-il', name: 'Romeoville', state: 'IL', isPort: false, isInland: true },
  { id: 'shorewood-il', name: 'Shorewood', state: 'IL', isPort: false, isInland: true },
  { id: 'sturtevant-wi', name: 'Sturtevant', state: 'WI', isPort: false, isInland: true },
  { id: 'vernon-hills-il', name: 'Vernon Hills', state: 'IL', isPort: false, isInland: true },
  { id: 'bellevue-oh', name: 'Bellevue', state: 'OH', isPort: false, isInland: true },
  { id: 'cleveland-oh-inland', name: 'Cleveland', state: 'OH', isPort: false, isInland: true },
  { id: 'export-pa', name: 'Export', state: 'PA', isPort: false, isInland: true },
  { id: 'greenville-oh', name: 'Greenville', state: 'OH', isPort: false, isInland: true },
  { id: 'new-philadelphia-oh', name: 'New Philadelphia', state: 'OH', isPort: false, isInland: true },
  { id: 'north-ridgeville-oh', name: 'North Ridgeville', state: 'OH', isPort: false, isInland: true },
  { id: 'smithton-pa', name: 'Smithton', state: 'PA', isPort: false, isInland: true },
  { id: 'clyde-oh', name: 'Clyde', state: 'OH', isPort: false, isInland: true },
  { id: 'columbus-oh-inland', name: 'Columbus', state: 'OH', isPort: false, isInland: true },
  { id: 'fostoria-oh', name: 'Fostoria', state: 'OH', isPort: false, isInland: true },
  { id: 'groveport-oh', name: 'Groveport', state: 'OH', isPort: false, isInland: true },
  { id: 'marion-oh', name: 'Marion', state: 'OH', isPort: false, isInland: true },
  { id: 'middleport-oh', name: 'Middleport', state: 'OH', isPort: false, isInland: true },
  { id: 'north-canton-oh', name: 'North Canton', state: 'OH', isPort: false, isInland: true },
  { id: 'tuppers-plains-oh', name: 'Tuppers Plains', state: 'OH', isPort: false, isInland: true },
  { id: 'euless-tx', name: 'Euless', state: 'TX', isPort: false, isInland: true },
  { id: 'fort-worth-tx', name: 'Fort Worth', state: 'TX', isPort: false, isInland: true },
  { id: 'garland-tx', name: 'Garland', state: 'TX', isPort: false, isInland: true },
  { id: 'irving-tx', name: 'Irving', state: 'TX', isPort: false, isInland: true },
  { id: 'lancaster-tx', name: 'Lancaster', state: 'TX', isPort: false, isInland: true },
  { id: 'mena-ar', name: 'Mena', state: 'AR', isPort: false, isInland: true },
  { id: 'san-antonio-tx', name: 'San Antonio', state: 'TX', isPort: false, isInland: true },
  { id: 'brighton-co', name: 'Brighton', state: 'CO', isPort: false, isInland: true },
  { id: 'shelby-township-mi', name: 'Shelby Township', state: 'MI', isPort: false, isInland: true },
  { id: 'troy-mi', name: 'Troy', state: 'MI', isPort: false, isInland: true },
  { id: 'honolulu-hi-inland', name: 'Honolulu', state: 'HI', isPort: false, isInland: true },
  { id: 'kahului-hi', name: 'Kahului', state: 'HI', isPort: false, isInland: true },
  { id: 'houston-tx-inland', name: 'Houston', state: 'TX', isPort: false, isInland: true },
  { id: 'kyle-tx', name: 'Kyle', state: 'TX', isPort: false, isInland: true },
  { id: 'laredo-tx', name: 'Laredo', state: 'TX', isPort: false, isInland: true },
  { id: 'mcallen-tx', name: 'McAllen', state: 'TX', isPort: false, isInland: true },
  { id: 'plainfield-in', name: 'Plainfield', state: 'IN', isPort: false, isInland: true },
  { id: 'kansas-city-mo-inland', name: 'Kansas City', state: 'MO', isPort: false, isInland: true },
  { id: 'lenexa-ks', name: 'Lenexa', state: 'KS', isPort: false, isInland: true },
  { id: 'carson-ca', name: 'Carson', state: 'CA', isPort: false, isInland: true },
  { id: 'chatsworth-ca', name: 'Chatsworth', state: 'CA', isPort: false, isInland: true },
  { id: 'chino-ca', name: 'Chino', state: 'CA', isPort: false, isInland: true },
  { id: 'compton-ca', name: 'Compton', state: 'CA', isPort: false, isInland: true },
  { id: 'goodyear-az', name: 'Goodyear', state: 'AZ', isPort: false, isInland: true },
  { id: 'long-beach-ca', name: 'Long Beach', state: 'CA', isPort: false, isInland: true },
  { id: 'los-angeles-ca', name: 'Los Angeles', state: 'CA', isPort: false, isInland: true },
  { id: 'mira-loma-ca', name: 'Mira Loma', state: 'CA', isPort: false, isInland: true },
  { id: 'nogales-az', name: 'Nogales', state: 'AZ', isPort: false, isInland: true },
  { id: 'ontario-ca', name: 'Ontario', state: 'CA', isPort: false, isInland: true },
  { id: 'oxnard-ca', name: 'Oxnard', state: 'CA', isPort: false, isInland: true },
  { id: 'perris-ca', name: 'Perris', state: 'CA', isPort: false, isInland: true },
  { id: 'phoenix-az', name: 'Phoenix', state: 'AZ', isPort: false, isInland: true },
  { id: 'rancho-dominguez-ca', name: 'Rancho Dominguez', state: 'CA', isPort: false, isInland: true },
  { id: 'sacramento-ca', name: 'Sacramento', state: 'CA', isPort: false, isInland: true },
  { id: 'san-diego-ca', name: 'San Diego', state: 'CA', isPort: false, isInland: true },
  { id: 'santa-monica-ca', name: 'Santa Monica', state: 'CA', isPort: false, isInland: true },
  { id: 'tolleson-az', name: 'Tolleson', state: 'AZ', isPort: false, isInland: true },
  { id: 'tucson-az', name: 'Tucson', state: 'AZ', isPort: false, isInland: true },
  { id: 'louisville-ky-inland', name: 'Louisville', state: 'KY', isPort: false, isInland: true },
  { id: 'grenada-ms', name: 'Grenada', state: 'MS', isPort: false, isInland: true },
  { id: 'lexington-in', name: 'Lexington', state: 'IN', isPort: false, isInland: true },
  { id: 'little-rock-ar', name: 'Little Rock', state: 'AR', isPort: false, isInland: true },
  { id: 'memphis-in', name: 'Memphis', state: 'IN', isPort: false, isInland: true },
  { id: 'olive-branch-ms', name: 'Olive Branch', state: 'MS', isPort: false, isInland: true },
  { id: 'southaven-ms', name: 'Southaven', state: 'MS', isPort: false, isInland: true },
  { id: 'boca-raton-fl', name: 'Boca Raton', state: 'FL', isPort: false, isInland: true },
  { id: 'coral-springs-fl', name: 'Coral Springs', state: 'FL', isPort: false, isInland: true },
  { id: 'doral-fl', name: 'Doral', state: 'FL', isPort: false, isInland: true },
  { id: 'key-west-fl', name: 'Key West', state: 'FL', isPort: false, isInland: true },
  { id: 'medley-fl', name: 'Medley', state: 'FL', isPort: false, isInland: true },
  { id: 'miami-fl-inland', name: 'Miami', state: 'FL', isPort: false, isInland: true },
  { id: 'odessa-fl', name: 'Odessa', state: 'FL', isPort: false, isInland: true },
  { id: 'orlando-fl-inland', name: 'Orlando', state: 'FL', isPort: false, isInland: true },
  { id: 'plant-city-fl', name: 'Plant City', state: 'FL', isPort: false, isInland: true },
  { id: 'tampa-fl-inland', name: 'Tampa', state: 'FL', isPort: false, isInland: true },
  { id: 'north-mankato-mn', name: 'North Mankato', state: 'MN', isPort: false, isInland: true },
  { id: 'winona-mn', name: 'Winona', state: 'MN', isPort: false, isInland: true },
  { id: 'lebanon-tn', name: 'Lebanon', state: 'TN', isPort: false, isInland: true },
  { id: 'manchester-tn', name: 'Manchester', state: 'TN', isPort: false, isInland: true },
  { id: 'tullahoma-tn', name: 'Tullahoma', state: 'TN', isPort: false, isInland: true },
  { id: 'whites-creek-tn', name: 'Whites Creek', state: 'TN', isPort: false, isInland: true },
  { id: 'houma-la', name: 'Houma', state: 'LA', isPort: false, isInland: true },
  { id: 'bensalem-pa', name: 'Bensalem', state: 'PA', isPort: false, isInland: true },
  { id: 'conklin-ny', name: 'Conklin', state: 'NY', isPort: false, isInland: true },
  { id: 'east-syracuse-ny', name: 'East Syracuse', state: 'NY', isPort: false, isInland: true },
  { id: 'edison-nj', name: 'Edison', state: 'NJ', isPort: false, isInland: true },
  { id: 'englewood-nj', name: 'Englewood', state: 'NJ', isPort: false, isInland: true },
  { id: 'fredericksburg-pa', name: 'Fredericksburg', state: 'PA', isPort: false, isInland: true },
  { id: 'kearny-nj', name: 'Kearny', state: 'NJ', isPort: false, isInland: true },
  { id: 'lyndhurst-nj', name: 'Lyndhurst', state: 'NJ', isPort: false, isInland: true },
  { id: 'new-milford-ct', name: 'New Milford', state: 'CT', isPort: false, isInland: true },
  { id: 'new-york-ny-inland', name: 'New York', state: 'NY', isPort: false, isInland: true },
  { id: 'south-river-nj', name: 'South River', state: 'NJ', isPort: false, isInland: true },
  { id: 'norfolk-va-inland', name: 'Norfolk', state: 'VA', isPort: false, isInland: true },
  { id: 'south-hill-va', name: 'South Hill', state: 'VA', isPort: false, isInland: true },
  { id: 'patterson-ca', name: 'Patterson', state: 'CA', isPort: false, isInland: true },
  { id: 'richmond-ca', name: 'Richmond', state: 'CA', isPort: false, isInland: true },
  { id: 'sparks-nv', name: 'Sparks', state: 'NV', isPort: false, isInland: true },
  { id: 'west-sacramento-ca', name: 'West Sacramento', state: 'CA', isPort: false, isInland: true },
  { id: 'idaho-falls-id', name: 'Idaho Falls', state: 'ID', isPort: false, isInland: true },
  { id: 'portland-or-inland', name: 'Portland', state: 'OR', isPort: false, isInland: true },
  { id: 'american-fork-ut', name: 'American Fork', state: 'UT', isPort: false, isInland: true },
  { id: 'belgrade-mt', name: 'Belgrade', state: 'MT', isPort: false, isInland: true },
  { id: 'salt-lake-city-ut', name: 'Salt Lake City', state: 'UT', isPort: false, isInland: true },
  { id: 'pooler-ga', name: 'Pooler', state: 'GA', isPort: false, isInland: true },
  { id: 'calgary-ab-canada', name: 'Calgary', state: 'AB', country: 'Canada', isPort: false, isInland: true },
  { id: 'hawkesbury-on-canada', name: 'Hawkesbury', state: 'ON', country: 'Canada', isPort: false, isInland: true },
  { id: 'brampton-canada', name: 'Brampton', state: 'ON', country: 'Canada', isPort: false, isInland: true },
  { id: 'burlington-ontario-canada', name: 'Burlington', state: 'ON', country: 'Canada', isPort: false, isInland: true },
  { id: 'caledon-ontario-canada', name: 'Caledon', state: 'ON', country: 'Canada', isPort: false, isInland: true },
  { id: 'mississauga-ontario-canada', name: 'Mississauga', state: 'ON', country: 'Canada', isPort: false, isInland: true },
  { id: 'oakville-ontario-canada', name: 'Oakville', state: 'ON', country: 'Canada', isPort: false, isInland: true },
  { id: 'pickering-ontario-canada', name: 'Pickering', state: 'ON', country: 'Canada', isPort: false, isInland: true },
  { id: 'toronto-on-canada', name: 'Toronto', state: 'ON', country: 'Canada', isPort: false, isInland: true },
  { id: 'vaughan-canada', name: 'Vaughan', state: 'ON', country: 'Canada', isPort: false, isInland: true },
  { id: 'woodbridge-ontario-canada', name: 'Woodbridge', state: 'ON', country: 'Canada', isPort: false, isInland: true },
  { id: 'delta-bc-canada', name: 'Delta', state: 'BC', country: 'Canada', isPort: false, isInland: true },
  { id: 'richmond-bc-canada', name: 'Richmond', state: 'BC', country: 'Canada', isPort: false, isInland: true },
]

export const cities: City[] = [...portRampRegions, ...inlandLocations]

export const vendors: Vendor[] = [
  {
    id: 'v1',
    mcid: 'MC-123456',
    email: 'john.smith@transport.com',
    status: 'active',
    totalBids: 45,
    joinedDate: '1/15/2024',
    canWhitelistVendors: true,
  },
  {
    id: 'v2',
    mcid: 'MC-789012',
    email: 'sarah.j@logistics.com',
    status: 'active',
    totalBids: 38,
    joinedDate: '2/20/2024',
  },
  {
    id: 'v3',
    mcid: 'MC-345678',
    email: 'mike@davisfreight.com',
    status: 'inactive',
    totalBids: 22,
    joinedDate: '11/10/2023',
  },
  {
    id: 'v4',
    mcid: 'MC-901234',
    email: 'vendor1@example.com',
    status: 'active',
    totalBids: 35,
    joinedDate: '3/5/2024',
  },
  {
    id: 'v5',
    mcid: 'MC-567890',
    email: 'vendor2@example.com',
    status: 'blocked',
    totalBids: 28,
    joinedDate: '4/12/2024',
  },
  {
    id: 'v6',
    mcid: 'MC-234567',
    email: 'vendor3@example.com',
    status: 'active',
    totalBids: 31,
    joinedDate: '5/18/2024',
  },
  {
    id: 'v7',
    mcid: 'MC-890123',
    email: 'vendor4@example.com',
    status: 'active',
    totalBids: 27,
    joinedDate: '6/22/2024',
  },
  {
    id: 'v8',
    mcid: 'MC-456789',
    email: 'vendor5@example.com',
    status: 'active',
    totalBids: 33,
    joinedDate: '7/8/2024',
  },
  {
    id: 'v9',
    mcid: 'MC-012345',
    email: 'vendor6@example.com',
    status: 'active',
    totalBids: 29,
    joinedDate: '8/15/2024',
  },
]

// Generate routes for Atlanta port
const atlantaRoutes: Route[] = (() => {
  const atlPortRampRegion = cities.find(c => c.id === 'atl')!
  const abbevilleInlandLocation = cities.find(c => c.id === 'abbeville-sc')!
  const augustaInlandLocation = cities.find(c => c.id === 'augusta-ga')!
  const poolerInlandLocation = cities.find(c => c.id === 'pooler-ga')!
  
  return [
    { id: 'r1', portRampRegionId: 'atl', inlandLocationId: 'abbeville-sc', portRampRegion: atlPortRampRegion, inlandLocation: abbevilleInlandLocation },
    { id: 'r2', portRampRegionId: 'atl', inlandLocationId: 'augusta-ga', portRampRegion: atlPortRampRegion, inlandLocation: augustaInlandLocation },
    { id: 'r3', portRampRegionId: 'atl', inlandLocationId: 'pooler-ga', portRampRegion: atlPortRampRegion, inlandLocation: poolerInlandLocation },
  ]
})()

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
        portRampRegionId: route.portRampRegionId,
        inlandLocationId: route.inlandLocationId,
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

export const getPortRampRegions = (): City[] => {
  return cities.filter(c => c.isPort)
}

export const getInlandLocationsForPortRampRegion = (portRampRegionId: string): City[] => {
  const routeIds = routes.filter(r => r.portRampRegionId === portRampRegionId).map(r => r.inlandLocationId)
  return cities.filter(c => routeIds.includes(c.id))
}

export const getRoutesForPortRampRegion = (portRampRegionId: string): Route[] => {
  return routes.filter(r => r.portRampRegionId === portRampRegionId)
}

export const getBidsForRoute = (routeId: string): Bid[] => {
  return bids.filter(b => b.routeId === routeId)
}

export const getBidsForPortRampRegion = (portRampRegionId: string): Bid[] => {
  return bids.filter(b => b.portRampRegionId === portRampRegionId)
}

export const getBidCountsByPortRampRegion = (): Record<string, number> => {
  // Mock data matching the screenshots
  const counts: Record<string, number> = {}
  portRampRegions.forEach(portRampRegion => {
    counts[portRampRegion.id] = Math.floor(Math.random() * 70) + 10
  })
  return counts
}

export const getPendingBidCountsByPortRampRegion = (vendorId: string): Record<string, number> => {
  const counts: Record<string, number> = {}
  cities.filter(c => c.isPort).forEach(portRampRegion => {
    const portRampRegionBids = getBidsForPortRampRegion(portRampRegion.id).filter(b => b.vendorId === vendorId)
    counts[portRampRegion.id] = portRampRegionBids.filter(b => b.status === 'pending').length
  })
  // Mock: Return some pending counts for demo
  return {
    'atl': 3,
    'ny-nj': 5,
    'lalb': 6,
    'chi': 2,
    'hou': 3,
    'mia-pe': 3,
    'phi': 4,
    'oak': 4,
    'sea-tac': 3,
    'dfw': 4,
    'bos': 5,
    'nor': 4,
  }
}

export const getSubmittedBidCountsByPortRampRegion = (vendorId: string): Record<string, number> => {
  const counts: Record<string, number> = {}
  cities.filter(c => c.isPort).forEach(portRampRegion => {
    const portRampRegionBids = getBidsForPortRampRegion(portRampRegion.id).filter(b => b.vendorId === vendorId)
    counts[portRampRegion.id] = portRampRegionBids.filter(b => b.status === 'submitted').length
  })
  // Mock: Return some submitted counts for demo
  return {
    'nsh': 1,
  }
}
