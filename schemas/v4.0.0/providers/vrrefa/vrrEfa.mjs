export const main = {
    namespace: 'vrrefa',
    name: 'VRR EFA - Public Transit Rhein-Ruhr',
    description: 'Access public transit data for the Rhein-Ruhr region (and Germany-wide via DELFI) using the EFA API. Search stops, get real-time departures, plan trips, and view service alerts. Free, no API key required. Also serves as a DELFI-wide endpoint covering all German transit operators.',
    version: '4.0.0',
    docs: ['https://www.vrr.de/service/opendataportal/', 'https://github.com/SDS1234/EFA-Endpoints'],
    tags: ['transport', 'public-transit', 'germany', 'timetable', 'realtime', 'cacheTtlFrequent'],
    root: 'https://efa.vrr.de/standard',
    requiredServerParams: [],
    headers: {},
    tools: {
        findStops: {
            method: 'GET',
            path: '/XML_STOPFINDER_REQUEST',
            description: 'Search for public transit stops by name. Returns matching stops with coordinates, transport modes, and stop IDs. Covers all German transit stops via DELFI integration.',
            parameters: [
                { position: { key: 'outputFormat', value: 'JSON', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(JSON)'] } },
                { position: { key: 'type_sf', value: 'any', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(any)'] } },
                { position: { key: 'name_sf', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'anyObjFilter_sf', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(2)'] } }
            ],
            tests: [
                { _description: 'Search for Essen Hbf', name_sf: 'Essen Hbf' },
                { _description: 'Search for Berlin Hbf (DELFI-wide)', name_sf: 'Berlin Hbf' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { stopFinder: { type: 'object', properties: { points: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, stateless: { type: 'string' }, ref: { type: 'object' } } } } } } } }
            }
        },
        getDepartures: {
            method: 'GET',
            path: '/XML_DM_REQUEST',
            description: 'Get real-time departures from a stop. Returns scheduled and actual departure times, line info, direction, platform, and delay. Includes disruption alerts.',
            parameters: [
                { position: { key: 'outputFormat', value: 'JSON', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(JSON)'] } },
                { position: { key: 'type_dm', value: 'any', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(any)'] } },
                { position: { key: 'name_dm', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'mode', value: 'direct', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(direct)'] } },
                { position: { key: 'useRealtime', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)'] } }
            ],
            tests: [
                { _description: 'Get departures from Essen Hbf', name_dm: 'Essen Hbf', limit: 10 },
                { _description: 'Get departures from Duesseldorf Hbf', name_dm: 'Düsseldorf Hbf', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { departureList: { type: 'array', items: { type: 'object', properties: { dateTime: { type: 'object' }, realDateTime: { type: 'object' }, servingLine: { type: 'object' }, platform: { type: 'string' }, countdown: { type: 'string' } } } } } }
            }
        },
        planTrip: {
            method: 'GET',
            path: '/XML_TRIP_REQUEST2',
            description: 'Plan a trip between two stops. Returns route options with legs, transfer points, duration, and fare zones.. Use findStops first to find valid IDs',
            parameters: [
                { position: { key: 'outputFormat', value: 'JSON', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(JSON)'] } },
                { position: { key: 'type_origin', value: 'any', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(any)'] } },
                { position: { key: 'name_origin', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'type_destination', value: 'any', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(any)'] } },
                { position: { key: 'name_destination', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Trip from Essen to Dortmund', name_origin: 'Essen Hbf', name_destination: 'Dortmund Hbf' },
                { _description: 'Trip from Duisburg to Koeln', name_origin: 'Duisburg Hbf', name_destination: 'Köln Hbf' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { trips: { type: 'array', items: { type: 'object', properties: { duration: { type: 'string' }, legs: { type: 'array', items: { type: 'object' } } } } } } }
            }
        }
    }
}
