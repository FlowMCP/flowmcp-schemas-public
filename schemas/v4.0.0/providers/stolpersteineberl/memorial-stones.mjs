// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean
// Namespace: "stolpersteineBerl" -> "stolpersteineberl"
// Note: The API serves a static JSON file — no server-side filtering.
// All search/filter routes fetch the full dataset and filter client-side.

export const main = {
    namespace: 'stolpersteineberl',
    name: 'Stolpersteine Berlin API',
    description: 'Access information about Stolpersteine (memorial stones) in Berlin commemorating victims of Nazi persecution',
    version: '4.0.0',
    docs: ['https://www.stolpersteine-berlin.de/', 'https://www.stolpersteine-berlin.de/de/api'],
    tags: ['memorial', 'history', 'berlin'],
    root: 'https://www.stolpersteine-berlin.de',
    tools: {
        getAllStones: {
            method: 'GET',
            path: '/de/api/json/stolpersteine.json',
            description: 'Get all Stolpersteine in Berlin. Returns the complete dataset. Use limit/offset for pagination.',
            parameters: [
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(10000)', 'default(100)', 'optional()'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'default(0)', 'optional()'] } }
            ],
            preload: {
                enabled: true,
                ttl: 2592000,
                description: 'All Stolpersteine in Berlin (~6.8MB, rarely changes)'
            },
            tests: [
                { _description: 'First 50 Stolpersteine', limit: 50 }
            ],
            output: {
                      "mimeType": "application/json",
                      "description": "Paginated list of Stolpersteine memorial stones in Berlin",
                      "schema": {
                                "type": "object",
                                "properties": {
                                          "source": {
                                                    "type": "string",
                                                    "description": "Data source identifier"
                                          },
                                          "totalCount": {
                                                    "type": "number",
                                                    "description": "Total stones in the dataset"
                                          },
                                          "returnedCount": {
                                                    "type": "number",
                                                    "description": "Number of stones in this response"
                                          },
                                          "offset": {
                                                    "type": "number",
                                                    "description": "Pagination offset"
                                          },
                                          "limit": {
                                                    "type": "number",
                                                    "description": "Max results per page"
                                          },
                                          "stolpersteine": {
                                                    "type": "array",
                                                    "description": "Array of memorial stone records",
                                                    "items": {
                                                              "type": "object",
                                                              "properties": {
                                                                        "id": {
                                                                                  "type": "string"
                                                                        },
                                                                        "firstName": {
                                                                                  "type": "string"
                                                                        },
                                                                        "lastName": {
                                                                                  "type": "string"
                                                                        },
                                                                        "address": {
                                                                                  "type": "string"
                                                                        },
                                                                        "district": {
                                                                                  "type": "string"
                                                                        },
                                                                        "lat": {
                                                                                  "type": "number"
                                                                        },
                                                                        "lon": {
                                                                                  "type": "number"
                                                                        }
                                                              }
                                                    }
                                          }
                                }
                      }
            },},
        searchStones: {
            method: 'GET',
            path: '/de/api/json/stolpersteine.json',
            description: 'Search Stolpersteine by person name or address. Filtering happens client-side on the full dataset.. Use IDs from results in getAllStones',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)', 'optional()'] } },
                { position: { key: 'name', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(2)', 'optional()'] } },
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(3)', 'optional()'] } }
            ],
            preload: {
                enabled: true,
                ttl: 2592000,
                description: 'Fetches full dataset, filters client-side'
            },
            tests: [
                { _description: 'Search by name', name: 'Cohen' }
            ],
            output: {
                      "mimeType": "application/json",
                      "description": "Search results for Stolpersteine matching query criteria",
                      "schema": {
                                "type": "object",
                                "properties": {
                                          "source": {
                                                    "type": "string",
                                                    "description": "Data source identifier"
                                          },
                                          "query": {
                                                    "type": "object",
                                                    "description": "Search parameters used"
                                          },
                                          "totalCount": {
                                                    "type": "number",
                                                    "description": "Total stones in dataset"
                                          },
                                          "matchCount": {
                                                    "type": "number",
                                                    "description": "Number of matching stones"
                                          },
                                          "stolpersteine": {
                                                    "type": "array",
                                                    "description": "Matching memorial stone records"
                                          }
                                }
                      }
            },},
        getStonesByDistrict: {
            method: 'GET',
            path: '/de/api/json/stolpersteine.json',
            description: 'Get Stolpersteine in a specific Berlin district. Filtering happens client-side.. Use getAllStones first to find valid IDs',
            parameters: [
                { position: { key: 'bezirk', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(Mitte,Friedrichshain-Kreuzberg,Pankow,Charlottenburg-Wilmersdorf,Spandau,Steglitz-Zehlendorf,Tempelhof-Schoeneberg,Neukoelln,Treptow-Koepenick,Marzahn-Hellersdorf,Lichtenberg,Reinickendorf)', options: [] } },
                { position: { key: 'ortsteil', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            preload: {
                enabled: true,
                ttl: 2592000,
                description: 'Fetches full dataset, filters by district client-side'
            },
            tests: [
                { _description: 'All stones in Mitte', bezirk: 'Mitte' }
            ],
            output: {
                      "mimeType": "application/json",
                      "description": "Stolpersteine in the specified Berlin district",
                      "schema": {
                                "type": "object",
                                "properties": {
                                          "source": {
                                                    "type": "string",
                                                    "description": "Data source identifier"
                                          },
                                          "filter": {
                                                    "type": "object",
                                                    "description": "District filter applied"
                                          },
                                          "matchCount": {
                                                    "type": "number",
                                                    "description": "Number of matching stones"
                                          },
                                          "stolpersteine": {
                                                    "type": "array",
                                                    "description": "Memorial stones in the district"
                                          }
                                }
                      }
            },},
        getStonesByLocation: {
            method: 'GET',
            path: '/de/api/json/stolpersteine.json',
            description: 'Get Stolpersteine near coordinates. Filtering by distance happens client-side.. Use getAllStones first to find valid IDs',
            parameters: [
                { position: { key: 'lat', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(52.3)', 'max(52.7)'] } },
                { position: { key: 'lon', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(13.0)', 'max(13.8)'] } },
                { position: { key: 'radius', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0.1)', 'max(5.0)', 'default(1.0)', 'optional()'] } }
            ],
            preload: {
                enabled: true,
                ttl: 2592000,
                description: 'Fetches full dataset, filters by proximity client-side'
            },
            tests: [
                { _description: 'Stones near Alexanderplatz', lat: 52.52, lon: 13.405, radius: 0.5 }
            ],
            output: {
                      "mimeType": "application/json",
                      "description": "Stolpersteine near the specified coordinates sorted by distance",
                      "schema": {
                                "type": "object",
                                "properties": {
                                          "source": {
                                                    "type": "string",
                                                    "description": "Data source identifier"
                                          },
                                          "filter": {
                                                    "type": "object",
                                                    "description": "Location and radius filter"
                                          },
                                          "matchCount": {
                                                    "type": "number",
                                                    "description": "Number of stones within radius"
                                          },
                                          "stolpersteine": {
                                                    "type": "array",
                                                    "description": "Nearby memorial stones with distance"
                                          }
                                }
                      }
            },}
    }
}


export const handlers = ( { sharedLists, libraries } ) => {
    const _cache = { data: null, timestamp: null, ttl: 3600000 }

    const fetchAllStones = async () => {
        const now = Date.now()
        if( _cache.data && _cache.timestamp && ( now - _cache.timestamp ) < _cache.ttl ) {
            return { stones: _cache.data, fromCache: true }
        }

        const response = await fetch( 'https://www.stolpersteine-berlin.de/de/api/json/stolpersteine.json' )
        if( !response.ok ) {
            throw new Error( `HTTP ${response.status}: ${response.statusText}` )
        }

        const data = await response.json()
        _cache.data = data
        _cache.timestamp = now

        return { stones: data, fromCache: false }
    }

    const normalizeStone = ( stone ) => {
        const normalized = {
            id: stone.id || stone.nummer,
            firstName: stone.first_name || stone.vorname || '',
            lastName: stone.last_name || stone.nachname || '',
            fullName: stone.full_name || stone.vollername || '',
            birthDate: stone.birth_date || stone.geburtsdatum || '',
            deathDate: stone.death_date || stone.todesdatum || '',
            persecutionReason: stone.persecution_reason || stone.verfolgungsgrund || '',
            address: stone.address || stone.adresse || '',
            district: stone.district || stone.bezirk || '',
            neighborhood: stone.neighborhood || stone.ortsteil || '',
            lat: parseFloat( stone.lat || stone.latitude ) || null,
            lon: parseFloat( stone.lon || stone.longitude ) || null,
            installationDate: stone.installation_date || stone.verlegung || ''
        }

        return normalized
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
        getAllStones: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { stones, fromCache } = await fetchAllStones()

                    if( !Array.isArray( stones ) ) {
                        struct.data = stones
                        return { struct }
                    }

                    const limit = payload.limit || 100
                    const offset = payload.offset || 0
                    const sliced = stones.slice( offset, offset + limit )
                    const normalized = sliced
                        .map( ( stone ) => normalizeStone( stone ) )

                    struct.data = {
                        source: 'Stolpersteine Berlin',
                        totalCount: stones.length,
                        returnedCount: normalized.length,
                        offset,
                        limit,
                        fromCache,
                        stolpersteine: normalized
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error fetching Stolpersteine: ${error.message}` )
                }

                return { struct }
            }
        },
        searchStones: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { stones, fromCache } = await fetchAllStones()

                    if( !Array.isArray( stones ) ) {
                        struct.data = stones
                        return { struct }
                    }

                    const q = ( payload.q || '' ).toLowerCase()
                    const name = ( payload.name || '' ).toLowerCase()
                    const address = ( payload.address || '' ).toLowerCase()

                    const filtered = stones
                        .filter( ( stone ) => {
                            const stoneStr = JSON.stringify( stone ).toLowerCase()
                            const fullName = ( stone.full_name || stone.vollername || stone.first_name || stone.vorname || '' ).toLowerCase()
                            const lastName = ( stone.last_name || stone.nachname || '' ).toLowerCase()
                            const stoneAddr = ( stone.address || stone.adresse || '' ).toLowerCase()

                            if( q && !stoneStr.includes( q ) ) { return false }
                            if( name && !fullName.includes( name ) && !lastName.includes( name ) ) { return false }
                            if( address && !stoneAddr.includes( address ) ) { return false }

                            return true
                        } )
                        .map( ( stone ) => normalizeStone( stone ) )

                    struct.data = {
                        source: 'Stolpersteine Berlin',
                        query: { q: q || null, name: name || null, address: address || null },
                        totalCount: stones.length,
                        matchCount: filtered.length,
                        fromCache,
                        stolpersteine: filtered
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error searching Stolpersteine: ${error.message}` )
                }

                return { struct }
            }
        },
        getStonesByDistrict: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { stones, fromCache } = await fetchAllStones()

                    if( !Array.isArray( stones ) ) {
                        struct.data = stones
                        return { struct }
                    }

                    const bezirk = ( payload.bezirk || '' ).toLowerCase()
                    const ortsteil = ( payload.ortsteil || '' ).toLowerCase()

                    const filtered = stones
                        .filter( ( stone ) => {
                            const stoneDistrict = ( stone.district || stone.bezirk || '' ).toLowerCase()
                            const stoneNeighborhood = ( stone.neighborhood || stone.ortsteil || '' ).toLowerCase()

                            if( bezirk && !stoneDistrict.includes( bezirk ) ) { return false }
                            if( ortsteil && !stoneNeighborhood.includes( ortsteil ) ) { return false }

                            return true
                        } )
                        .map( ( stone ) => normalizeStone( stone ) )

                    struct.data = {
                        source: 'Stolpersteine Berlin',
                        filter: { bezirk: payload.bezirk, ortsteil: payload.ortsteil || null },
                        totalCount: stones.length,
                        matchCount: filtered.length,
                        fromCache,
                        stolpersteine: filtered
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error filtering Stolpersteine by district: ${error.message}` )
                }

                return { struct }
            }
        },
        getStonesByLocation: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { stones, fromCache } = await fetchAllStones()

                    if( !Array.isArray( stones ) ) {
                        struct.data = stones
                        return { struct }
                    }

                    const targetLat = payload.lat
                    const targetLon = payload.lon
                    const radiusKm = payload.radius || 1.0

                    const filtered = stones
                        .filter( ( stone ) => {
                            const stoneLat = parseFloat( stone.lat || stone.latitude )
                            const stoneLon = parseFloat( stone.lon || stone.longitude )

                            if( isNaN( stoneLat ) || isNaN( stoneLon ) ) { return false }

                            const dist = haversineKm( {
                                lat1: targetLat,
                                lon1: targetLon,
                                lat2: stoneLat,
                                lon2: stoneLon
                            } )

                            return dist <= radiusKm
                        } )
                        .map( ( stone ) => {
                            const normalized = normalizeStone( stone )
                            normalized.distanceKm = haversineKm( {
                                lat1: targetLat,
                                lon1: targetLon,
                                lat2: normalized.lat,
                                lon2: normalized.lon
                            } )

                            return normalized
                        } )
                        .sort( ( a, b ) => a.distanceKm - b.distanceKm )

                    struct.data = {
                        source: 'Stolpersteine Berlin',
                        filter: { lat: targetLat, lon: targetLon, radiusKm },
                        totalCount: stones.length,
                        matchCount: filtered.length,
                        fromCache,
                        stolpersteine: filtered
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error filtering Stolpersteine by location: ${error.message}` )
                }

                return { struct }
            }
        }
    }
}
