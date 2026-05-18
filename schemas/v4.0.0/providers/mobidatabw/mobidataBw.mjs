export const main = {
    namespace: 'mobidatabw',
    name: 'MobiData BW Integrationsplattform',
    description: 'Access open mobility data from Baden-Wuerttemberg (Germany) via the MobiData BW integration platform. Includes parking data (27,966 sites), GTFS transit stops, sharing providers (100+ GBFS feeds), and traffic roadworks. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://api.mobidata-bw.de/', 'https://github.com/mobidata-bw'],
    tags: ['transport', 'parking', 'sharing', 'germany', 'mobility', 'open-data', 'cacheTtlFrequent'],
    root: 'https://api.mobidata-bw.de',
    requiredServerParams: [],
    headers: {
        'User-Agent': 'FlowMCP/1.0'
    },
    tools: {
        getParkingSites: {
            method: 'GET',
            path: '/park-api/api/public/v3/parking-sites',
            description: 'Get parking sites across Baden-Wuerttemberg with real-time occupancy data. Returns location, capacity, operator info, and availability. Supports cursor pagination via start parameter. Sources include APCOA, DB Bahnpark, PBW, and municipal operators. Use source_uid filter to narrow by provider. Use getParkingSpots for individual spots like bike or disabled parking.',
            parameters: [
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(100)'] } },
                { position: { key: 'start', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'source_uid', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get first 10 parking sites', limit: 10 },
                { _description: 'Get DB Bahnpark parking sites', source_uid: 'bahn_v2', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated list of parking sites with cursor-based navigation',
                    properties: {
                        items: { type: 'array', description: 'Array of parking site objects', items: { type: 'object', properties: { id: { type: 'number', description: 'Unique parking site identifier' }, name: { type: 'string', description: 'Human-readable parking site name' }, address: { type: 'string', description: 'Street address of the parking site' }, type: { type: 'string', description: 'Parking type (e.g. Parkhaus, Tiefgarage, Parkplatz)' }, purpose: { type: 'string', description: 'Purpose classification (e.g. car, bike)' }, capacity: { type: 'number', description: 'Total number of parking spaces' }, lat: { type: 'string', description: 'Latitude coordinate as string' }, lon: { type: 'string', description: 'Longitude coordinate as string' }, has_realtime_data: { type: 'boolean', description: 'Whether live occupancy data is available' }, operator_name: { type: 'string', description: 'Name of the parking site operator (e.g. APCOA, DB Bahnpark)' } } } },
                        total_count: { type: 'number', description: 'Total number of parking sites matching the query' },
                        next_id: { type: 'number', description: 'Cursor ID for the next page of results, use as start parameter' },
                        next_path: { type: 'string', description: 'Pre-built API path for fetching the next page' }
                    }
                }
            }
        },
        getGtfsStops: {
            method: 'GET',
            path: '/gtfs/stops',
            description: 'Get GTFS transit stops in Baden-Wuerttemberg. Supports PostgREST filter operators for searching by name, location, or other fields. Use stop_name=like.Stuttgart* for prefix search. Returns stop locations with parent station references for building transit network views.',
            parameters: [
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(100)'] } },
                { position: { key: 'stop_name', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Search Stuttgart stops', stop_name: 'like.Stuttgart*', limit: 10 },
                { _description: 'Get first 5 stops', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Array of GTFS transit stop records',
                    items: {
                        type: 'object',
                        properties: {
                            stop_id: { type: 'string', description: 'GTFS stop identifier (unique within the feed)' },
                            stop_name: { type: 'string', description: 'Public name of the transit stop' },
                            stop_loc: { type: 'object', description: 'GeoJSON point geometry for the stop location', properties: { type: { type: 'string', description: 'GeoJSON geometry type (always Point)' }, coordinates: { type: 'array', description: 'Longitude and latitude as [lon, lat] array' } } },
                            parent_station: { type: 'string', description: 'stop_id of the parent station, empty for top-level stations' },
                            location_type: { type: 'string', description: 'GTFS location type: 0=stop, 1=station, 2=entrance/exit' }
                        }
                    }
                }
            }
        },
        getSharingProviders: {
            method: 'GET',
            path: '/sharing/gbfs',
            description: 'Get aggregated GBFS feeds from 100+ sharing providers in Baden-Wuerttemberg including bikes, cars, e-scooters, and cargo bikes. Returns a list of provider systems with their GBFS feed URLs. Use the system ID from results with getSharingStations to get station details for a specific provider.',
            parameters: [],
            tests: [
                { _description: 'Get all sharing providers' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Container for all available sharing provider systems',
                    properties: {
                        systems: {
                            type: 'array',
                            description: 'List of sharing provider systems with GBFS feed URLs',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string', description: 'System identifier, use with getSharingStations (e.g. stadtmobil_stuttgart)' },
                                    url: { type: 'string', description: 'URL to the GBFS feed for this sharing provider' }
                                }
                            }
                        }
                    }
                }
            }
        },
        getSharingStations: {
            method: 'GET',
            path: '/sharing/gbfs/v2/:systemId/station_information.json',
            description: 'Get station information for a specific sharing provider. Returns station locations, capacity, and names. Use system IDs from getSharingProviders (e.g. stadtmobil_stuttgart, regiorad_stuttgart).',
            parameters: [
                { position: { key: 'systemId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get Stadtmobil Stuttgart stations', systemId: 'stadtmobil_stuttgart' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'GBFS station information response for a single sharing provider',
                    properties: {
                        data: {
                            type: 'object',
                            description: 'Data wrapper containing the stations array',
                            properties: {
                                stations: {
                                    type: 'array',
                                    description: 'List of sharing stations with location and capacity',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            station_id: { type: 'string', description: 'Unique station identifier within this system' },
                                            name: { type: 'string', description: 'Public name of the station' },
                                            lat: { type: 'number', description: 'Latitude coordinate of the station' },
                                            lon: { type: 'number', description: 'Longitude coordinate of the station' },
                                            capacity: { type: 'number', description: 'Total docking capacity at this station' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        getParkingSpots: {
            method: 'GET',
            path: '/park-api/api/public/v3/parking-spots',
            description: 'Get individual parking spots (e.g. bike parking, disabled parking) with detailed location and type information. Unlike getParkingSites which returns facilities, this returns individual designated spots. Supports cursor pagination via start parameter.',
            parameters: [
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(100)'] } },
                { position: { key: 'start', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get first 10 parking spots', limit: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated list of individual parking spots with cursor navigation',
                    properties: {
                        items: { type: 'array', description: 'Array of individual parking spot objects', items: { type: 'object' } },
                        total_count: { type: 'number', description: 'Total number of parking spots matching the query' },
                        next_id: { type: 'number', description: 'Cursor ID for the next page of results, use as start parameter' }
                    }
                }
            }
        }
    }
}
