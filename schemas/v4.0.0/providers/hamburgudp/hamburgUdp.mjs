export const main = {
    namespace: 'hamburgudp',
    name: 'Hamburg Urban Data Platform (SensorThings)',
    description: 'Access IoT sensor data from Hamburg via the OGC SensorThings API. Includes E-charging stations (Stromnetz Hamburg), StadtRad bike-sharing, traffic sensors, and energy data. Supports OData filtering, pagination, and expansion. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://www.urbandataplatform.hamburg/', 'https://iot.hamburg.de/v1.1/'],
    tags: ['iot', 'smart-city', 'germany', 'hamburg', 'mobility', 'sensors', 'cacheTtlFrequent'],
    root: 'https://iot.hamburg.de/v1.1',
    requiredServerParams: [],
    headers: {},
    tools: {
        getThings: {
            method: 'GET',
            path: '/Things',
            description: 'List IoT devices/stations in Hamburg. Filter by name keyword to find specific types (e.g. StadtRad, E-Charging, traffic). Use device IDs with getThingById. Supports OData $top, $skip, $filter, $expand.',
            parameters: [
                { position: { key: '$top', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'max(1000)'] } },
                { position: { key: '$skip', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: '$filter', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: '$expand', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get first 10 things', '$top': 10 },
                { _description: 'Get StadtRad stations', '$filter': "substringof('StadtRad',name)", '$top': 10 },
                { _description: 'Get things with locations expanded', '$top': 5, '$expand': 'Locations' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', description: 'Paginated list of IoT devices/stations from Hamburg SensorThings API', properties: { value: { type: 'array', description: 'Array of IoT thing objects', items: { type: 'object', properties: { '@iot.id': { type: 'number', description: 'Unique SensorThings entity ID, use with getThingById' }, name: { type: 'string', description: 'Device/station name (e.g. StadtRad station name, E-Charging point ID)' }, description: { type: 'string', description: 'Human-readable description of the device' }, properties: { type: 'object', description: 'Additional metadata properties specific to the device type' } } } }, '@iot.nextLink': { type: 'string', description: 'URL for the next page of results (OData pagination)' } } }
            }
        },
        getThingById: {
            method: 'GET',
            path: '/Things(:id)',
            description: 'Get a specific IoT device by ID with optional expansion of Locations, Datastreams, or Observations. Use $expand=Datastreams to get datastream IDs for getObservations.',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } },
                { position: { key: '$expand', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get E-charging station with locations', id: 15955, '$expand': 'Locations' },
                { _description: 'Get thing with datastreams', id: 15955, '$expand': 'Datastreams' },
                { _description: 'Get thing basic info', id: 15955 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', description: 'Single IoT device/station with optional expanded relations', properties: { '@iot.id': { type: 'number', description: 'Unique SensorThings entity ID' }, name: { type: 'string', description: 'Device/station name' }, description: { type: 'string', description: 'Human-readable description' }, Locations: { type: 'array', description: 'Geographic locations with coordinates (when $expand=Locations)' }, Datastreams: { type: 'array', description: 'Sensor data streams with IDs for getObservations (when $expand=Datastreams)' } } }
            }
        },
        getObservations: {
            method: 'GET',
            path: '/Datastreams(:datastreamId)/Observations',
            description: 'Get sensor observations/measurements from a specific datastream. Returns timestamped values. Use getThingById with $expand=Datastreams to find datastream IDs.',
            parameters: [
                { position: { key: 'datastreamId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } },
                { position: { key: '$top', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'max(1000)'] } },
                { position: { key: '$orderby', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(phenomenonTime desc)'] } }
            ],
            tests: [
                { _description: 'Get latest E-charging observations', datastreamId: 36769, '$top': 5 },
                { _description: 'Get latest 10 observations sorted desc', datastreamId: 36769, '$top': 10, '$orderby': 'phenomenonTime desc' },
                { _description: 'Get 3 most recent observations', datastreamId: 36769, '$top': 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', description: 'Timestamped sensor observations from the specified datastream', properties: { value: { type: 'array', description: 'Array of observation records', items: { type: 'object', properties: { '@iot.id': { type: 'number', description: 'Unique observation ID' }, phenomenonTime: { type: 'string', description: 'ISO 8601 timestamp of when the phenomenon was observed' }, result: { type: 'object', description: 'Measurement value (structure varies by sensor type: availability, count, reading)' }, resultTime: { type: 'string', description: 'ISO 8601 timestamp of when the result was recorded' } } } } } }
            }
        }
    }
}
