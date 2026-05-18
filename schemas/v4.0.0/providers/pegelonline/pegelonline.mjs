// Schema for #142 — Pegelonline (German Federal Waterways Water Levels)
// No API key required — public federal government API

export const main = {
    namespace: 'pegelonline',
    name: 'Pegelonline Water Levels',
    description: 'Query real-time water levels, station data and measurements from German federal waterways via Pegelonline API. No API key required.',
    version: '4.0.0',
    docs: ['https://www.pegelonline.wsv.de/webservices/rest-api/v2/'],
    tags: ['water', 'environment', 'germany', 'government', 'cacheTtlFrequent'],
    root: 'https://www.pegelonline.wsv.de/webservices/rest-api/v2',
    tools: {
        getStations: {
            method: 'GET',
            path: '/stations.json',
            description: 'List all water level monitoring stations on German federal waterways. Use station names or UUIDs in getStation for details or getMeasurements for historical data. Use getWaters to find water body names for filtering.',
            parameters: [
                { position: { key: 'waters', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'includeTimeseries', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(true,false)', options: ['optional()', 'default(false)'] } },
                { position: { key: 'includeCurrentMeasurement', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(true,false)', options: ['optional()', 'default(false)'] } }
            ],
            output: { mimeType: 'application/json', schema: { type: 'array', items: { type: 'object', properties: { uuid: { type: 'string' }, number: { type: 'string' }, shortname: { type: 'string' }, longname: { type: 'string' }, km: { type: 'number' }, agency: { type: 'string' }, longitude: { type: 'number' }, latitude: { type: 'number' }, water: { type: 'object', properties: { shortname: { type: 'string' }, longname: { type: 'string' } } } } } } },
            tests: [
                { _description: 'All stations on RHEIN', waters: 'RHEIN', includeCurrentMeasurement: 'true' },
                { _description: 'All stations with current values', includeCurrentMeasurement: 'true' }
            ],
        },
        getStation: {
            method: 'GET',
            path: '/stations/:stationId.json',
            description: 'Get details for a single station by name or UUID. Include timeseries for available measurement types and current values.',
            parameters: [
                { position: { key: 'stationId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(2)'] } },
                { position: { key: 'includeTimeseries', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(true,false)', options: ['optional()', 'default(true)'] } },
                { position: { key: 'includeCurrentMeasurement', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(true,false)', options: ['optional()', 'default(true)'] } }
            ],
            output: { mimeType: 'application/json', schema: { type: 'object', properties: { uuid: { type: 'string' }, number: { type: 'string' }, shortname: { type: 'string' }, longname: { type: 'string' }, km: { type: 'number' }, agency: { type: 'string' }, longitude: { type: 'number' }, latitude: { type: 'number' }, water: { type: 'object' }, timeseries: { type: 'array', items: { type: 'object', properties: { shortname: { type: 'string' }, longname: { type: 'string' }, unit: { type: 'string' }, equidistance: { type: 'number' }, currentMeasurement: { type: 'object', properties: { timestamp: { type: 'string' }, value: { type: 'number' }, stateMnwMhw: { type: 'string' }, stateNswHsw: { type: 'string' } } } } } } } } },
            tests: [
                { _description: 'Köln water level', stationId: 'KÖLN' },
                { _description: 'Berlin-Spandau water level', stationId: 'BERLIN-SPANDAU OP' }
            ],
        },
        getMeasurements: {
            method: 'GET',
            path: '/stations/:stationId/W/measurements.json',
            description: 'Get water level (W) measurement history for a station. Use station names from getStations. Start parameter is ISO 8601 duration (P1D=1 day, P7D=1 week, P30D=30 days).',
            parameters: [
                { position: { key: 'stationId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(2)'] } },
                { position: { key: 'start', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(P1D)'] } }
            ],
            output: { mimeType: 'application/json', schema: { type: 'array', items: { type: 'object', properties: { timestamp: { type: 'string' }, value: { type: 'number' } } } } },
            tests: [
                { _description: 'Köln last 24h', stationId: 'KÖLN', start: 'P1D' },
                { _description: 'Hamburg St. Pauli last 7 days', stationId: 'HAMBURG ST. PAULI', start: 'P7D' }
            ],
        },
        getWaters: {
            method: 'GET',
            path: '/waters.json',
            description: 'List all water bodies (rivers, canals, lakes) monitored by Pegelonline. Returns short and long names.',
            parameters: [],
            output: { mimeType: 'application/json', schema: { type: 'array', items: { type: 'object', properties: { shortname: { type: 'string' }, longname: { type: 'string' } } } } },
            tests: [
                { _description: 'List all monitored water bodies' }
            ],
        }
    }
}
