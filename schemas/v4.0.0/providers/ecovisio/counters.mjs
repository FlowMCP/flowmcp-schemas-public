// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'ecovisio',
    name: 'Eco-Visio Counter API',
    description: 'Eco-Counter bicycle and pedestrian counting stations API providing traffic counting data from automated sensors across German cities and worldwide',
    version: '4.0.0',
    docs: ['https://eco-visio.api.bund.dev/'],
    tags: ['mobility', 'germany', 'cycling', 'pedestrian', 'cacheTtlDaily'],
    root: 'https://www.eco-visio.net/api/aladdin/1.0.0',
    tools: {
        getCountersByOrganization: {
            method: 'GET',
            path: '/pbl/publicwebpageplus/:idOrganisme',
            description: 'Get all counting stations for a public organization by its ID. Known German IDs: 888 (Rostock), 4586 (global bike display), 6116 (Schwerin), 6997 (Greifswald), 6811 (Boeblingen). The handler simplifies the response to id, name, coordinates, startDate, periodStart, and mainType.',
            parameters: [
                { position: { key: 'idOrganisme', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } }
            ],
            tests: [
                { _description: 'Get Rostock counting stations', idOrganisme: '888' },
                { _description: 'Get global bike counter display', idOrganisme: '4586' },
                { _description: 'Get Schwerin counting stations', idOrganisme: '6116' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'List of counting stations belonging to the specified organization (max 200 returned by handler)',
                    items: {
                        type: 'object',
                        properties: {
                            id_pdc_img: { type: 'number', description: 'Image identifier for the counter display' },
                            idPdc: { type: 'number', description: 'Unique counter station identifier' },
                            lat: { type: 'number', description: 'GPS latitude of the counting station' },
                            lon: { type: 'number', description: 'GPS longitude of the counting station' },
                            nom: { type: 'string', description: 'Station name, typically the street or location name (French)' },
                            photo: { type: 'array', description: 'Array of photo objects for the station installation', items: { type: 'object' } },
                            lienPublic: { type: 'string', description: 'Public URL to the station data display page' },
                            pratique: { type: 'array', description: 'Transport modes counted (cycling, pedestrian, etc.)', items: { type: 'object' } },
                            mainPratique: { type: 'number', description: 'Primary counting mode ID (e.g. 1=cycling, 2=pedestrian)' },
                            debut: { type: 'string', description: 'Start date of data collection (YYYY-MM-DD format)' },
                            debutPeriode: { type: 'string', description: 'Start of the current reporting period' },
                            current_year_default: { type: 'number', description: 'Default year for current data display' },
                            externalUrl: { type: 'string', description: 'External link to related resource' },
                            nomOrganisme: { type: 'string', description: 'Name of the organization operating this counter' },
                            logo: { type: 'string', description: 'URL to the organization logo image' },
                            pays: { type: 'string', description: 'Country code where the counter is located' },
                            sig: { type: 'number', description: 'GIS reference identifier' },
                            today: { type: 'string', description: 'Today total count as formatted string' },
                            total: { type: 'number', description: 'All-time total count across entire data period' },
                            lastDay: { type: 'number', description: 'Count from the most recent full day' },
                            moyD: { type: 'number', description: 'Average daily count across the data period' }
                        }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getCountersByOrganization: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !Array.isArray( raw ) ) { return { response }}

            const counters = raw
            .slice( 0, 200 )
            .map( ( counter ) => {
            const result = {
            id: counter.idPdc || null,
            name: counter.nom || null,
            latitude: counter.lat || null,
            longitude: counter.lon || null,
            startDate: counter.debut || null,
            periodStart: counter.debutPeriode || null,
            mainType: counter.mainPratique || null
            }

            return result
            } )

            response = {
            totalCounters: raw.length,
            counterCount: counters.length,
            counters
            }

            return { response }
        }
    }
} )
