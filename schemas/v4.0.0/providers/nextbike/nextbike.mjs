export const main = {
    namespace: 'nextbike',
    name: 'nextbike Bike Sharing',
    description: 'Access nextbike bike sharing data via the legacy API. Get station locations, real-time bike availability, and system information for 50+ German networks including Berlin, Leipzig, and more. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://github.com/ubahnverleih/WoBike/blob/master/Nextbike.md'],
    tags: ['transport', 'bike-sharing', 'germany', 'mobility', 'cacheTtlFrequent'],
    root: 'https://api.nextbike.net/maps',
    requiredServerParams: [],
    headers: {},
    tools: {
        getStationsAndBikes: {
            method: 'GET',
            path: '/nextbike-live.json',
            description: 'Get all stations and available bikes for a nextbike city/network. Returns station locations, capacity, available bikes by type, and individual bike details. Use city parameter for specific networks (e.g. 362 for Berlin). Get valid city IDs from getAllNetworks.',
            parameters: [
                { position: { key: 'city', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Get Berlin nextbike stations', city: 362 },
                { _description: 'Get Leipzig nextbike stations', city: 1 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Nextbike live data response with stations and bike availability for a specific network',
                    properties: {
                        countries: {
                            type: 'array',
                            description: 'Array of country objects containing city networks',
                            items: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string', description: 'Country or network operator name' },
                                    cities: {
                                        type: 'array',
                                        description: 'Array of city/network objects with their stations',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                uid: { type: 'number', description: 'Unique city/network identifier (use as city parameter)' },
                                                name: { type: 'string', description: 'City or network name' },
                                                available_bikes: { type: 'number', description: 'Total available bikes across all stations in this network' },
                                                num_places: { type: 'number', description: 'Total number of stations in this network' },
                                                places: {
                                                    type: 'array',
                                                    description: 'Array of station objects with location and availability',
                                                    items: {
                                                        type: 'object',
                                                        properties: {
                                                            uid: { type: 'number', description: 'Unique station identifier' },
                                                            name: { type: 'string', description: 'Station name or street address' },
                                                            lat: { type: 'number', description: 'Latitude coordinate of the station' },
                                                            lng: { type: 'number', description: 'Longitude coordinate of the station' },
                                                            bikes: { type: 'number', description: 'Total number of bikes currently at the station' },
                                                            bike_racks: { type: 'number', description: 'Total docking rack capacity' },
                                                            free_racks: { type: 'number', description: 'Number of empty docking racks available' },
                                                            bikes_available_to_rent: { type: 'number', description: 'Number of bikes available for rent (excluding reserved)' }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        getAllNetworks: {
            method: 'GET',
            path: '/nextbike-live.json',
            description: 'Get a list of all nextbike networks/cities worldwide with summary statistics. Returns country, city names, available bikes count, and network metadata. No city parameter returns all networks. Use returned uid values as city parameter in getStationsAndBikes.',
            parameters: [
                { position: { key: 'list_cities', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } }
            ],
            tests: [
                { _description: 'List all nextbike networks', list_cities: 1 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Nextbike response with all available networks worldwide',
                    properties: {
                        countries: {
                            type: 'array',
                            description: 'Array of country objects containing network listings',
                            items: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string', description: 'Country or network operator name' },
                                    country: { type: 'string', description: 'ISO country code (e.g. DE, AT, PL)' },
                                    cities: {
                                        type: 'array',
                                        description: 'Array of city/network objects with summary statistics',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                uid: { type: 'number', description: 'Unique network identifier, use as city parameter in getStationsAndBikes' },
                                                name: { type: 'string', description: 'City or network name' },
                                                available_bikes: { type: 'number', description: 'Total available bikes in this network' },
                                                num_places: { type: 'number', description: 'Total number of stations in this network' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
