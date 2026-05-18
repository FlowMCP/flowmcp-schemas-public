export const main = {
    namespace: 'transitousmotis',
    name: 'Transitous MOTIS',
    description: 'Access pan-European public transit routing via the Transitous MOTIS API. Search locations, plan multimodal journeys across 30+ countries, and get departure boards for any transit stop in Europe. Covers trains, buses, trams, metros, and ferries. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://github.com/motis-project/motis', 'https://europe.motis-project.de/'],
    tags: ['transport', 'public-transit', 'europe', 'routing', 'timetable', 'cacheTtlFrequent'],
    root: 'https://europe.motis-project.de',
    requiredServerParams: [],
    headers: {},
    tools: {
        geocode: {
            method: 'GET',
            path: '/api/v1/geocode',
            description: 'Search for transit stops and places across Europe by name. Returns matching locations with coordinates, country, timezone, and administrative areas. Use the returned coordinates or IDs for trip planning.',
            parameters: [
                { position: { key: 'text', value: '{{QUERY}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Search for Berlin stations', text: 'Berlin Hauptbahnhof' },
                { _description: 'Search for Paris stations', text: 'Paris Gare du Nord' },
                { _description: 'Search for Vienna', text: 'Wien Hauptbahnhof' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'array', items: { type: 'object', properties: { type: { type: 'string' }, name: { type: 'string' }, id: { type: 'string' }, lat: { type: 'number' }, lon: { type: 'number' }, country: { type: 'string' }, tz: { type: 'string' }, zip: { type: 'string' }, areas: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, adminLevel: { type: 'number' } } } } } } }
            }
        },
        planTrip: {
            method: 'GET',
            path: '/api/v1/plan',
            description: 'Plan a multimodal public transit journey between two points in Europe. Specify origin and destination as lat,lon coordinates. Returns itineraries with legs, transfers, walking segments, and departure/arrival times.',
            parameters: [
                { position: { key: 'fromPlace', value: '{{FROM_COORDS}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'toPlace', value: '{{TO_COORDS}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'time', value: '{{DEPARTURE_TIME}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'arriveBy', value: '{{ARRIVE_BY}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(false)'] } },
                { position: { key: 'numItineraries', value: '{{NUM_ITINERARIES}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(5)', 'min(1)', 'max(10)'] } },
                { position: { key: 'pedestrianProfile', value: '{{PEDESTRIAN_PROFILE}}', location: 'query' }, z: { primitive: 'enum(FOOT,WHEELCHAIR)', options: ['optional()', 'default(FOOT)'] } }
            ],
            tests: [
                { _description: 'Plan trip Berlin to Hamburg', fromPlace: '52.5200,13.4050', toPlace: '53.5511,9.9937', numItineraries: 3 },
                { _description: 'Plan trip Paris to Brussels', fromPlace: '48.8566,2.3522', toPlace: '50.8503,4.3517', numItineraries: 2 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { itineraries: { type: 'array', items: { type: 'object', properties: { duration: { type: 'number' }, startTime: { type: 'number' }, endTime: { type: 'number' }, transfers: { type: 'number' }, legs: { type: 'array', items: { type: 'object', properties: { mode: { type: 'string' }, from: { type: 'object' }, to: { type: 'object' }, startTime: { type: 'number' }, endTime: { type: 'number' }, duration: { type: 'number' }, routeShortName: { type: 'string' }, agencyName: { type: 'string' }, intermediateStops: { type: 'array' } } } } } } } } }
            }
        },
        reverseGeocode: {
            method: 'GET',
            path: '/api/v1/reverse-geocode',
            description: 'Find the nearest transit stops to a geographic coordinate. Returns nearby stops with their names, IDs, and distances.',
            parameters: [
                { position: { key: 'place', value: '{{COORDS}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Find stops near Berlin Mitte', place: '52.5200,13.4050' },
                { _description: 'Find stops near Amsterdam Centraal', place: '52.3791,4.9003' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'array', items: { type: 'object', properties: { type: { type: 'string' }, name: { type: 'string' }, id: { type: 'string' }, lat: { type: 'number' }, lon: { type: 'number' }, country: { type: 'string' }, areas: { type: 'array' } } } }
            }
        }
    }
}
