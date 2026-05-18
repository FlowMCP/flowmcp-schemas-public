// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'pegelonline',
    name: 'Pegel-Online API',
    description: 'German federal waterway gauging stations API providing real-time water levels, measurements, and station data from the WSV',
    version: '4.0.0',
    docs: ['https://pegel-online.api.bund.dev/'],
    tags: ['water', 'germany', 'environment', 'hydrology', 'cacheTtlFrequent'],
    root: 'https://www.pegelonline.wsv.de/webservices/rest-api/v2',
    tools: {
        getStations: {
            method: 'GET',
            path: '/stations.json',
            description: 'Get all gauging stations. Optionally filter by waterway name. Use station UUIDs in getStationDetail or getCurrentMeasurement. Use getWaters to discover waterway names.',
            parameters: [
                { position: { key: 'waters', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['default("20")', 'optional()'] } }
            ],
            tests: [
                { _description: 'Get stations on the Rhine', waters: 'RHEIN', limit: '5' },
                { _description: 'Get all stations limited to 5', limit: '5' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            uuid: { type: 'string' },
                            number: { type: 'string' },
                            shortname: { type: 'string' },
                            longname: { type: 'string' },
                            km: { type: 'number' },
                            agency: { type: 'string' },
                            longitude: { type: 'number' },
                            latitude: { type: 'number' },
                            water: { type: 'object', properties: { shortname: { type: 'string' }, longname: { type: 'string' } } }
                        }
                    }
                }
            },
        },
        getStationDetail: {
            method: 'GET',
            path: '/stations/:uuid.json?includeTimeseries=true&includeCurrentMeasurement=true',
            description: 'Get detailed station info with timeseries and current measurements. Use station UUID from getStations. For just the latest value, use getCurrentMeasurement.',
            parameters: [
                { position: { key: 'uuid', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } }
            ],
            tests: [
                { _description: 'Get Konstanz-Rhein station detail', uuid: 'e020e651-e422-46d3-ae28-34887c5a4a8e' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        uuid: { type: 'string' },
                        number: { type: 'string' },
                        shortname: { type: 'string' },
                        longname: { type: 'string' },
                        km: { type: 'number' },
                        agency: { type: 'string' },
                        longitude: { type: 'number' },
                        latitude: { type: 'number' },
                        water: { type: 'object', properties: { shortname: { type: 'string' }, longname: { type: 'string' } } },
                        timeseries: { type: 'array', items: { type: 'object', properties: { shortname: { type: 'string' }, longname: { type: 'string' }, unit: { type: 'string' }, equidistance: { type: 'number' }, currentMeasurement: { type: 'object' } } } }
                    }
                }
            },
        },
        getWaters: {
            method: 'GET',
            path: '/waters.json',
            description: 'Get list of all waterways (rivers, canals, lakes) with gauging stations. via pegelonline.',
            parameters: [],
            tests: [
                { _description: 'Get all waterways' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            shortname: { type: 'string' },
                            longname: { type: 'string' }
                        }
                    }
                }
            },
        },
        getCurrentMeasurement: {
            method: 'GET',
            path: '/stations/:uuid/:timeseries/currentmeasurement.json',
            description: 'Get the current water level measurement for a specific station and timeseries. Use UUID from getStations. Timeseries shortname is typically W (water level) or Q (discharge). For full timeseries data use getStationDetail.',
            parameters: [
                { position: { key: 'uuid', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'timeseries', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['default("W")'] } }
            ],
            tests: [
                {
                    _description: 'Get current water level for Konstanz-Rhein',
                    uuid: 'e020e651-e422-46d3-ae28-34887c5a4a8e',
                    timeseries: 'W'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        timestamp: { type: 'string' },
                        value: { type: 'number' },
                        stateMnwMhw: { type: 'string' },
                        stateNswHsw: { type: 'string' }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getStations: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !Array.isArray( raw ) ) { return { response }}

            const stations = raw
            .map( ( station ) => {
            const result = {
            uuid: station.uuid,
            name: station.shortname || station.longname,
            km: station.km,
            agency: station.agency,
            longitude: station.longitude,
            latitude: station.latitude,
            water: station.water?.shortname || null
            }

            return result
            } )

            response = {
            stationCount: stations.length,
            stations
            }

            return { response }
        }
    },
    getStationDetail: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw ) { return { response }}

            const timeseries = ( raw.timeseries || [] )
            .map( ( ts ) => {
            const result = {
            shortname: ts.shortname,
            longname: ts.longname,
            unit: ts.unit,
            currentValue: ts.currentMeasurement?.value || null,
            currentTimestamp: ts.currentMeasurement?.timestamp || null,
            state: ts.currentMeasurement?.stateMnwMhw || null
            }

            return result
            } )

            response = {
            uuid: raw.uuid,
            name: raw.shortname || raw.longname,
            km: raw.km,
            agency: raw.agency,
            longitude: raw.longitude,
            latitude: raw.latitude,
            water: raw.water?.shortname || null,
            timeseries
            }

            return { response }
        }
    },
    getWaters: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !Array.isArray( raw ) ) { return { response }}

            response = {
            waterCount: raw.length,
            waters: raw
            .map( ( w ) => {
            const result = { shortname: w.shortname, longname: w.longname }

            return result
            } )
            }

            return { response }
        }
    }
} )
