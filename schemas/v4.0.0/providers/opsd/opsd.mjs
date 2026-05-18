export const main = {
    namespace: 'opsd',
    name: 'Open Power System Data',
    description: 'Access European conventional power plant data from Open Power System Data (OPSD). Search and filter 6000+ power plants across 20+ European countries by energy source, technology, capacity, country, and location. Includes fossil fuels, renewables, and nuclear plants. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://open-power-system-data.org/', 'https://data.open-power-system-data.org/conventional_power_plants/'],
    tags: ['energy', 'environment', 'europe', 'opendata', 'cacheTtlDaily'],
    root: 'https://data.open-power-system-data.org',
    requiredServerParams: [],
    headers: {},
    tools: {
        listPlants: {
            method: 'GET',
            path: '/conventional_power_plants/2020-10-01/conventional_power_plants_EU.csv',
            description: 'List and filter European conventional power plants. Filter by country (ISO2: DE, FR, UK, NO, etc.), energy source level (Fossil fuels, Renewable energy, Nuclear), technology (Steam turbine, Gas turbine, Combined cycle), CHP status, and minimum capacity in MW. Returns paginated results.',
            parameters: [
                { position: { key: 'country', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'energySource', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(Fossil fuels,Renewable energy,Nuclear,Other or unspecified energy sources)', options: ['optional()'] } },
                { position: { key: 'technology', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'minCapacity', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(0)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(50)', 'min(1)', 'max(500)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] } }
            ],
            preload: {
                enabled: true,
                ttl: 2592000,
                description: 'EU conventional power plants (~1.2MB CSV, updated infrequently)'
            },
            tests: [
                { _description: 'List German power plants', country: 'DE', limit: 10 },
                { _description: 'List nuclear plants in Europe', energySource: 'Nuclear', limit: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { totalCount: { type: 'number' }, matchCount: { type: 'number' }, offset: { type: 'number' }, limit: { type: 'number' }, plants: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, company: { type: 'string' }, city: { type: 'string' }, country: { type: 'string' }, capacity: { type: 'number' }, energySource: { type: 'string' }, technology: { type: 'string' }, chp: { type: 'string' }, lat: { type: 'number' }, lon: { type: 'number' } } } } } }
            }
        },
        searchPlants: {
            method: 'GET',
            path: '/conventional_power_plants/2020-10-01/conventional_power_plants_EU.csv',
            description: 'Search power plants by name, company, or city. Case-insensitive full-text search across all text fields.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'country', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(50)', 'min(1)', 'max(500)'] } }
            ],
            preload: {
                enabled: true,
                ttl: 2592000,
                description: 'Fetches full dataset, searches client-side'
            },
            tests: [
                { _description: 'Search for Vattenfall plants', q: 'Vattenfall', limit: 10 },
                { _description: 'Search for Hamburg plants', q: 'Hamburg', country: 'DE', limit: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { query: { type: 'string' }, matchCount: { type: 'number' }, plants: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, company: { type: 'string' }, city: { type: 'string' }, country: { type: 'string' }, capacity: { type: 'number' }, energySource: { type: 'string' }, technology: { type: 'string' } } } } } }
            }
        },
        getPlantsByLocation: {
            method: 'GET',
            path: '/conventional_power_plants/2020-10-01/conventional_power_plants_EU.csv',
            description: 'Find power plants near a geographic coordinate. Uses haversine distance calculation. Returns plants sorted by distance within the specified radius in km.',
            parameters: [
                { position: { key: 'lat', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(-90)', 'max(90)'] } },
                { position: { key: 'lon', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(-180)', 'max(180)'] } },
                { position: { key: 'radius', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(50)', 'min(1)', 'max(500)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(100)'] } }
            ],
            preload: {
                enabled: true,
                ttl: 2592000,
                description: 'Fetches full dataset, filters by proximity client-side'
            },
            tests: [
                { _description: 'Plants near Berlin', lat: 52.52, lon: 13.405, radius: 50, limit: 10 },
                { _description: 'Plants near Paris', lat: 48.856, lon: 2.352, radius: 100, limit: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { center: { type: 'object', properties: { lat: { type: 'number' }, lon: { type: 'number' } } }, radiusKm: { type: 'number' }, matchCount: { type: 'number' }, plants: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, country: { type: 'string' }, capacity: { type: 'number' }, energySource: { type: 'string' }, technology: { type: 'string' }, distanceKm: { type: 'number' }, lat: { type: 'number' }, lon: { type: 'number' } } } } } }
            }
        },
        getEnergyMix: {
            method: 'GET',
            path: '/conventional_power_plants/2020-10-01/conventional_power_plants_EU.csv',
            description: 'Get aggregated installed capacity by energy source and country. Shows the energy mix breakdown for a specific country or all of Europe. Returns total capacity in MW per energy source.',
            parameters: [
                { position: { key: 'country', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            preload: {
                enabled: true,
                ttl: 2592000,
                description: 'Fetches full dataset, aggregates client-side'
            },
            tests: [
                { _description: 'Energy mix for Germany', country: 'DE' },
                { _description: 'Energy mix for all of Europe', country: 'DE' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { country: { type: 'string' }, totalCapacityMW: { type: 'number' }, plantCount: { type: 'number' }, byEnergySource: { type: 'array', items: { type: 'object', properties: { energySource: { type: 'string' }, capacityMW: { type: 'number' }, plantCount: { type: 'number' }, percentage: { type: 'number' } } } } } }
            }
        },
        listCountries: {
            method: 'GET',
            path: '/conventional_power_plants/2020-10-01/conventional_power_plants_EU.csv',
            description: 'List all countries in the OPSD dataset with their total plant count and installed capacity in MW.',
            parameters: [],
            preload: {
                enabled: true,
                ttl: 2592000,
                description: 'Fetches full dataset, aggregates by country client-side'
            },
            tests: [
                { _description: 'List all countries with plant counts' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { totalCountries: { type: 'number' }, totalPlants: { type: 'number' }, countries: { type: 'array', items: { type: 'object', properties: { country: { type: 'string' }, plantCount: { type: 'number' }, totalCapacityMW: { type: 'number' } } } } } }
            }
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => {
    const CSV_URL = 'https://data.open-power-system-data.org/conventional_power_plants/2020-10-01/conventional_power_plants_EU.csv'
    const _cache = { data: null, timestamp: null, ttl: 86400000 }

    const fetchAllPlants = async () => {
        const now = Date.now()
        if( _cache.data && _cache.timestamp && ( now - _cache.timestamp ) < _cache.ttl ) {
            return { plants: _cache.data, fromCache: true }
        }

        const response = await fetch( CSV_URL )
        if( !response.ok ) {
            throw new Error( `HTTP ${response.status}: ${response.statusText}` )
        }

        const text = await response.text()
        const lines = text.split( '\n' )
        const headers = lines[0].split( ',' )
        const plants = []

        const parseRow = ( line ) => {
            const values = []
            let current = ''
            let inQuotes = false

            const chars = line.split( '' )
            chars
                .forEach( ( char ) => {
                    if( char === '"' ) {
                        inQuotes = !inQuotes
                    } else if( char === ',' && !inQuotes ) {
                        values.push( current.trim() )
                        current = ''
                    } else {
                        current += char
                    }
                } )
            values.push( current.trim() )

            return values
        }

        lines.slice( 1 )
            .forEach( ( line ) => {
                if( !line.trim() ) { return }
                const values = parseRow( line )
                const plant = {
                    name: values[0] || '',
                    company: values[1] || '',
                    street: values[2] || '',
                    postcode: values[3] || '',
                    city: values[4] || '',
                    country: values[5] || '',
                    capacity: parseFloat( values[6] ) || 0,
                    energySource: values[7] || '',
                    technology: values[8] || '',
                    chp: values[9] || '',
                    commissioned: values[10] || '',
                    type: values[11] || '',
                    lat: parseFloat( values[12] ) || null,
                    lon: parseFloat( values[13] ) || null,
                    eicCode: values[14] || '',
                    energySourceLevel1: values[15] || '',
                    energySourceLevel2: values[16] || '',
                    energySourceLevel3: values[17] || ''
                }

                plants.push( plant )
            } )

        _cache.data = plants
        _cache.timestamp = now

        return { plants, fromCache: false }
    }

    const haversineKm = ( { lat1, lon1, lat2, lon2 } ) => {
        const toRad = ( deg ) => deg * Math.PI / 180
        const R = 6371
        const dLat = toRad( lat2 - lat1 )
        const dLon = toRad( lon2 - lon1 )
        const a = Math.sin( dLat / 2 ) * Math.sin( dLat / 2 ) +
            Math.cos( toRad( lat1 ) ) * Math.cos( toRad( lat2 ) ) *
            Math.sin( dLon / 2 ) * Math.sin( dLon / 2 )
        const c = 2 * Math.atan2( Math.sqrt( a ), Math.sqrt( 1 - a ) )
        const distance = R * c

        return distance
    }

    return {
        listPlants: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { plants, fromCache } = await fetchAllPlants()
                    const country = ( payload.country || '' ).toUpperCase()
                    const energySource = payload.energySource || ''
                    const technology = ( payload.technology || '' ).toLowerCase()
                    const minCapacity = payload.minCapacity || 0
                    const limit = payload.limit || 50
                    const offset = payload.offset || 0

                    const filtered = plants
                        .filter( ( plant ) => {
                            if( country && plant.country !== country ) { return false }
                            if( energySource && plant.energySourceLevel1 !== energySource ) { return false }
                            if( technology && !plant.technology.toLowerCase().includes( technology ) ) { return false }
                            if( minCapacity && plant.capacity < minCapacity ) { return false }

                            return true
                        } )

                    const sliced = filtered.slice( offset, offset + limit )
                    const result = sliced
                        .map( ( plant ) => {
                            const entry = {
                                name: plant.name,
                                company: plant.company,
                                city: plant.city,
                                country: plant.country,
                                capacity: plant.capacity,
                                energySource: plant.energySourceLevel1,
                                energySourceDetail: plant.energySourceLevel2,
                                technology: plant.technology,
                                chp: plant.chp,
                                commissioned: plant.commissioned,
                                lat: plant.lat,
                                lon: plant.lon
                            }

                            return entry
                        } )

                    struct.data = {
                        source: 'Open Power System Data',
                        totalCount: plants.length,
                        matchCount: filtered.length,
                        offset,
                        limit,
                        fromCache,
                        plants: result
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error fetching power plants: ${error.message}` )
                }

                return { struct }
            }
        },
        searchPlants: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { plants, fromCache } = await fetchAllPlants()
                    const q = ( payload.q || '' ).toLowerCase()
                    const country = ( payload.country || '' ).toUpperCase()
                    const limit = payload.limit || 50

                    const filtered = plants
                        .filter( ( plant ) => {
                            if( country && plant.country !== country ) { return false }
                            const searchStr = [plant.name, plant.company, plant.city, plant.street].join( ' ' ).toLowerCase()
                            if( q && !searchStr.includes( q ) ) { return false }

                            return true
                        } )
                        .slice( 0, limit )
                        .map( ( plant ) => {
                            const entry = {
                                name: plant.name,
                                company: plant.company,
                                city: plant.city,
                                country: plant.country,
                                capacity: plant.capacity,
                                energySource: plant.energySourceLevel1,
                                energySourceDetail: plant.energySourceLevel2,
                                technology: plant.technology,
                                commissioned: plant.commissioned,
                                lat: plant.lat,
                                lon: plant.lon
                            }

                            return entry
                        } )

                    struct.data = {
                        source: 'Open Power System Data',
                        query: q,
                        matchCount: filtered.length,
                        fromCache,
                        plants: filtered
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error searching power plants: ${error.message}` )
                }

                return { struct }
            }
        },
        getPlantsByLocation: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { plants, fromCache } = await fetchAllPlants()
                    const targetLat = payload.lat
                    const targetLon = payload.lon
                    const radiusKm = payload.radius || 50
                    const limit = payload.limit || 20

                    const nearby = plants
                        .filter( ( plant ) => {
                            if( plant.lat === null || plant.lon === null ) { return false }
                            const dist = haversineKm( { lat1: targetLat, lon1: targetLon, lat2: plant.lat, lon2: plant.lon } )

                            return dist <= radiusKm
                        } )
                        .map( ( plant ) => {
                            const distanceKm = Math.round( haversineKm( { lat1: targetLat, lon1: targetLon, lat2: plant.lat, lon2: plant.lon } ) * 10 ) / 10
                            const entry = {
                                name: plant.name,
                                country: plant.country,
                                city: plant.city,
                                capacity: plant.capacity,
                                energySource: plant.energySourceLevel1,
                                energySourceDetail: plant.energySourceLevel2,
                                technology: plant.technology,
                                distanceKm,
                                lat: plant.lat,
                                lon: plant.lon
                            }

                            return entry
                        } )
                        .sort( ( a, b ) => a.distanceKm - b.distanceKm )
                        .slice( 0, limit )

                    struct.data = {
                        source: 'Open Power System Data',
                        center: { lat: targetLat, lon: targetLon },
                        radiusKm,
                        matchCount: nearby.length,
                        fromCache,
                        plants: nearby
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error finding plants by location: ${error.message}` )
                }

                return { struct }
            }
        },
        getEnergyMix: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { plants, fromCache } = await fetchAllPlants()
                    const country = ( payload.country || '' ).toUpperCase()

                    const filtered = country
                        ? plants.filter( ( plant ) => plant.country === country )
                        : plants

                    const bySource = {}
                    filtered
                        .forEach( ( plant ) => {
                            const source = plant.energySourceLevel1 || 'Unknown'
                            if( !bySource[source] ) {
                                bySource[source] = { capacityMW: 0, plantCount: 0 }
                            }
                            bySource[source].capacityMW += plant.capacity
                            bySource[source].plantCount += 1
                        } )

                    const totalCapacity = filtered.reduce( ( sum, plant ) => sum + plant.capacity, 0 )
                    const energyMix = Object.entries( bySource )
                        .map( ( [ energySource, data ] ) => {
                            const entry = {
                                energySource,
                                capacityMW: Math.round( data.capacityMW * 10 ) / 10,
                                plantCount: data.plantCount,
                                percentage: Math.round( ( data.capacityMW / totalCapacity ) * 1000 ) / 10
                            }

                            return entry
                        } )
                        .sort( ( a, b ) => b.capacityMW - a.capacityMW )

                    struct.data = {
                        source: 'Open Power System Data',
                        country: country || 'ALL',
                        totalCapacityMW: Math.round( totalCapacity * 10 ) / 10,
                        plantCount: filtered.length,
                        fromCache,
                        byEnergySource: energyMix
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error calculating energy mix: ${error.message}` )
                }

                return { struct }
            }
        },
        listCountries: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { plants, fromCache } = await fetchAllPlants()
                    const byCountry = {}

                    plants
                        .forEach( ( plant ) => {
                            const c = plant.country || 'Unknown'
                            if( !byCountry[c] ) {
                                byCountry[c] = { plantCount: 0, totalCapacityMW: 0 }
                            }
                            byCountry[c].plantCount += 1
                            byCountry[c].totalCapacityMW += plant.capacity
                        } )

                    const countries = Object.entries( byCountry )
                        .map( ( [ country, data ] ) => {
                            const entry = {
                                country,
                                plantCount: data.plantCount,
                                totalCapacityMW: Math.round( data.totalCapacityMW * 10 ) / 10
                            }

                            return entry
                        } )
                        .sort( ( a, b ) => b.totalCapacityMW - a.totalCapacityMW )

                    struct.data = {
                        source: 'Open Power System Data',
                        totalCountries: countries.length,
                        totalPlants: plants.length,
                        fromCache,
                        countries
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error listing countries: ${error.message}` )
                }

                return { struct }
            }
        }
    }
}
