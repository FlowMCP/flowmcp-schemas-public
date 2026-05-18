// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'strahlenschutz',
    name: 'BfS Strahlenschutz ODL API',
    description: 'German Federal Office for Radiation Protection (BfS) ambient dose rate monitoring data via WFS/OGC service with 1685 measuring stations across Germany',
    version: '4.0.0',
    docs: ['https://strahlenschutz.api.bund.dev/'],
    tags: ['radiation', 'germany', 'environment', 'safety', 'cacheTtlFrequent'],
    root: 'https://www.imis.bfs.de/ogc/opendata/ows',
    tools: {
        getLatestReadings: {
            method: 'GET',
            path: '/?service=WFS&version=1.1.0&request=GetFeature&typeName=opendata:odlinfo_odl_1h_latest&outputFormat=application/json',
            description: 'Get the latest 1-hour ambient dose rate readings from all measuring stations. Returns station name, location, radiation value in microsieverts per hour, and measurement timestamp.',
            parameters: [
                { position: { key: 'maxFeatures', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['default("50")', 'optional()'] } }
            ],
            tests: [
                { _description: 'Get latest radiation readings (50 stations)' }
            ,
                { _description: 'Default test for getLatestReadings' }],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        type: { type: 'string' },
                        features: { type: 'array', items: { type: 'object', properties: { type: { type: 'string' }, id: { type: 'string' }, geometry: { type: 'object' }, geometry_name: { type: 'string' }, properties: { type: 'object' } } } },
                        totalFeatures: { type: 'number' },
                        numberMatched: { type: 'number' },
                        numberReturned: { type: 'number' },
                        timeStamp: { type: 'string' },
                        crs: { type: 'object', properties: { type: { type: 'string' }, properties: { type: 'object', properties: { name: { type: 'string' } } } } }
                    }
                }
            },
        },
        getStationTimeseries: {
            method: 'GET',
            path: '/?service=WFS&version=1.1.0&request=GetFeature&typeName=opendata:odlinfo_timeseries_odl_1h&outputFormat=application/json',
            description: 'Get 1-hour radiation timeseries data for a specific station. Use the station kenn value from getLatestReadings as viewparams (e.g. kenn:031020004).',
            parameters: [
                { position: { key: 'viewparams', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'sortBy', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['default("end_measure+D")', 'optional()'] } },
                { position: { key: 'maxFeatures', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['default("24")', 'optional()'] } }
            ],
            tests: [
                { _description: 'Get 24h timeseries for station Pruem', viewparams: 'kenn:072322961' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        type: { type: 'string' },
                        features: { type: 'array', items: { type: 'object', properties: { type: { type: 'string' }, id: { type: 'string' }, geometry: { type: 'object' }, geometry_name: { type: 'string' }, properties: { type: 'object' } } } },
                        totalFeatures: { type: 'number' },
                        numberMatched: { type: 'number' },
                        numberReturned: { type: 'number' },
                        timeStamp: { type: 'string' },
                        crs: { type: 'object', properties: { type: { type: 'string' }, properties: { type: 'object', properties: { name: { type: 'string' } } } } }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getLatestReadings: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.features ) { return { response }}

            const readings = raw.features
            .map( ( feature ) => {
            const { properties, geometry } = feature
            const result = {
            id: properties.id || null,
            name: properties.name || null,
            kenn: properties.kenn || null,
            value: properties.value,
            unit: properties.unit || 'µSv/h',
            startMeasure: properties.start_measure || null,
            endMeasure: properties.end_measure || null,
            siteStatus: properties.site_status_text || null,
            coordinates: geometry?.coordinates || null
            }

            return result
            } )

            response = {
            totalFeatures: raw.totalFeatures || readings.length,
            readingCount: readings.length,
            readings
            }

            return { response }
        }
    },
    getStationTimeseries: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.features ) { return { response }}

            const readings = raw.features
            .map( ( feature ) => {
            const { properties, geometry } = feature
            const result = {
            id: properties.id || null,
            name: properties.name || null,
            kenn: properties.kenn || null,
            value: properties.value,
            unit: properties.unit || 'µSv/h',
            startMeasure: properties.start_measure || null,
            endMeasure: properties.end_measure || null,
            siteStatus: properties.site_status_text || null,
            coordinates: geometry?.coordinates || null
            }

            return result
            } )

            response = {
            totalFeatures: raw.totalFeatures || readings.length,
            readingCount: readings.length,
            readings
            }

            return { response }
        }
    }
} )
