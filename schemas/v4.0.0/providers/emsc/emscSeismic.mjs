export const main = {
    namespace: 'emsc',
    name: 'EMSC Seismic Portal',
    description: 'Query the European-Mediterranean Seismological Centre earthquake catalog via the FDSN web service. Search events by magnitude, location, depth, and time range.',
    version: '4.0.0',
    docs: ['https://www.seismicportal.eu/fdsn-wsevent.html', 'https://www.seismicportal.eu/webservices.html'],
    tags: ['earthquake', 'seismology', 'geology', 'hazards', 'cacheTtlFrequent'],
    root: 'https://www.seismicportal.eu',
    requiredServerParams: [],
    headers: {},
    tools: {
        queryEvents: {
            method: 'GET',
            path: '/fdsnws/event/1/query',
            description: 'Search earthquake events with filters for magnitude, location, depth, and time range. Returns GeoJSON FeatureCollection. Use getEventById to retrieve a specific event by its EMSC ID from the results.',
            parameters: [
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'max(12000)'] } },
                { position: { key: 'minmag', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'maxmag', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'start', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'end', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'minlat', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'maxlat', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get last 10 earthquakes above magnitude 5', limit: 10, minmag: 5 },
                { _description: 'Get earthquakes in Mediterranean region in 2024', minlat: 30, maxlat: 46, start: '2024-01-01', end: '2024-12-31', minmag: 4, limit: 20 },
                { _description: 'Get recent large earthquakes worldwide', minmag: 6, limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'GeoJSON FeatureCollection of earthquake events matching the search criteria',
                    properties: {
                        type: { type: 'string', description: 'GeoJSON type, always "FeatureCollection"' },
                        features: { type: 'array', description: 'Array of earthquake event GeoJSON Features', items: { type: 'object', properties: { type: { type: 'string', description: 'GeoJSON type, always "Feature"' }, id: { type: 'string', description: 'EMSC event identifier (e.g. "20190330_0000065"), usable with getEventById' }, geometry: { type: 'object', description: 'GeoJSON Point with [longitude, latitude, depth_km] coordinates' }, properties: { type: 'object', description: 'Event properties including time, magnitude (mag), magnitude type (magtype), place description (flynn_region), depth, and source authority' } } } }
                    }
                }
            },
        },
        getEventById: {
            method: 'GET',
            path: '/fdsnws/event/1/query',
            description: 'Get a specific earthquake event by its EMSC event ID (e.g. "20190330_0000065"). Use queryEvents to search and discover event IDs.',
            parameters: [
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'eventid', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get specific earthquake event', eventid: '20190330_0000065' },
                { _description: 'Get 2023 Turkey-Syria earthquake', eventid: '20230206_0000073' },
                { _description: 'Get 2024 Taiwan earthquake', eventid: '20240403_0000007' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'GeoJSON FeatureCollection containing the single requested earthquake event',
                    properties: {
                        type: { type: 'string', description: 'GeoJSON type, always "FeatureCollection"' },
                        features: { type: 'array', description: 'Array containing the matched earthquake event (typically 1 element)' }
                    }
                }
            },
        }
    }
}
