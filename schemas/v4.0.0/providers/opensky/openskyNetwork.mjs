export const main = {
    namespace: 'opensky',
    name: 'OpenskyNetwork',
    description: 'Query the OpenSky Network for real-time aircraft tracking — state vectors, flight history, airport arrivals and departures, and trajectory waypoints from a global ADS-B receiver network.',
    version: '4.0.0',
    docs: ['https://openskynetwork.github.io/opensky-api/rest.html'],
    tags: ['aviation', 'tracking', 'geospatial', 'transportation', 'cacheTtlRealtime'],
    root: 'https://opensky-network.org',
    requiredServerParams: [],
    headers: {},
    tools: {
        getAllStates: {
            method: 'GET',
            path: '/api/states/all',
            description: 'Get current state vectors for all aircraft or those within a geographic bounding box. Each state vector contains position, velocity, heading, altitude, and identification data.',
            parameters: [
                { position: { key: 'time', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'icao24', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'lamin', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(-90)', 'max(90)'] } },
                { position: { key: 'lomin', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(-180)', 'max(180)'] } },
                { position: { key: 'lamax', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(-90)', 'max(90)'] } },
                { position: { key: 'lomax', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(-180)', 'max(180)'] } }
            ],
            tests: [
                { _description: 'Get all aircraft over Central Europe', lamin: 45.8, lomin: 5.9, lamax: 55.0, lomax: 15.0 },
                { _description: 'Get state for a specific aircraft by ICAO24', icao24: '3c6675' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        time: { type: 'number', description: 'Unix timestamp of the state vectors' },
                        states: {
                            type: 'array',
                            description: 'Array of state vector arrays [icao24, callsign, origin_country, time_position, last_contact, longitude, latitude, baro_altitude, on_ground, velocity, true_track, vertical_rate, sensors, geo_altitude, squawk, spi, position_source, category]',
                            items: { type: 'array' }
                        }
                    }
                }
            }
        },
        getFlightsAll: {
            method: 'GET',
            path: '/api/flights/all',
            description: 'Get all flights within a time interval. The interval must not exceed 2 hours. Returns flight records with origin and destination airports.',
            parameters: [
                { position: { key: 'begin', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'end', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Get all flights in a 1-hour window', begin: 1709251200, end: 1709254800 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            icao24: { type: 'string', description: 'ICAO24 transponder address in hex' },
                            firstSeen: { type: 'number', description: 'Unix timestamp of first position update' },
                            estDepartureAirport: { type: 'string', description: 'Estimated departure airport ICAO code' },
                            lastSeen: { type: 'number', description: 'Unix timestamp of last position update' },
                            estArrivalAirport: { type: 'string', description: 'Estimated arrival airport ICAO code' },
                            callsign: { type: 'string', description: 'Callsign of the aircraft' },
                            estDepartureAirportHorizDistance: { type: 'number' },
                            estDepartureAirportVertDistance: { type: 'number' },
                            estArrivalAirportHorizDistance: { type: 'number' },
                            estArrivalAirportVertDistance: { type: 'number' },
                            departureAirportCandidatesCount: { type: 'number' },
                            arrivalAirportCandidatesCount: { type: 'number' }
                        }
                    }
                }
            }
        },
        getFlightsByAircraft: {
            method: 'GET',
            path: '/api/flights/aircraft',
            description: 'Get flights for a specific aircraft identified by its ICAO24 address. The time interval must not exceed 30 days.',
            parameters: [
                { position: { key: 'icao24', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'begin', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'end', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Get flights for a Lufthansa aircraft in a 7-day window', icao24: '3c6675', begin: 1709164800, end: 1709769600 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            icao24: { type: 'string' },
                            firstSeen: { type: 'number' },
                            estDepartureAirport: { type: 'string' },
                            lastSeen: { type: 'number' },
                            estArrivalAirport: { type: 'string' },
                            callsign: { type: 'string' }
                        }
                    }
                }
            }
        },
        getArrivalsByAirport: {
            method: 'GET',
            path: '/api/flights/arrival',
            description: 'Get flights arriving at a specific airport. Airport is identified by ICAO code. The time interval must not exceed 7 days.',
            parameters: [
                { position: { key: 'airport', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'begin', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'end', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Get arrivals at Frankfurt Airport in a 24-hour window', airport: 'EDDF', begin: 1709251200, end: 1709337600 },
                { _description: 'Get arrivals at London Heathrow', airport: 'EGLL', begin: 1709251200, end: 1709337600 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            icao24: { type: 'string' },
                            firstSeen: { type: 'number' },
                            estDepartureAirport: { type: 'string' },
                            lastSeen: { type: 'number' },
                            estArrivalAirport: { type: 'string' },
                            callsign: { type: 'string' }
                        }
                    }
                }
            }
        },
        getDeparturesByAirport: {
            method: 'GET',
            path: '/api/flights/departure',
            description: 'Get flights departing from a specific airport. Airport is identified by ICAO code. The time interval must not exceed 7 days.',
            parameters: [
                { position: { key: 'airport', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'begin', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'end', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Get departures from Munich Airport in a 24-hour window', airport: 'EDDM', begin: 1709251200, end: 1709337600 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            icao24: { type: 'string' },
                            firstSeen: { type: 'number' },
                            estDepartureAirport: { type: 'string' },
                            lastSeen: { type: 'number' },
                            estArrivalAirport: { type: 'string' },
                            callsign: { type: 'string' }
                        }
                    }
                }
            }
        },
        getTrack: {
            method: 'GET',
            path: '/api/tracks/all',
            description: 'Get trajectory waypoints for a specific aircraft. Returns a series of waypoints with timestamps, positions, and altitudes tracing the flight path.',
            parameters: [
                { position: { key: 'icao24', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'time', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get track waypoints for a specific aircraft', icao24: '3c6675', time: 1709251200 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        icao24: { type: 'string', description: 'ICAO24 address of the aircraft' },
                        startTime: { type: 'number', description: 'Unix timestamp of first waypoint' },
                        endTime: { type: 'number', description: 'Unix timestamp of last waypoint' },
                        callsign: { type: 'string', description: 'Callsign during the flight' },
                        path: {
                            type: 'array',
                            description: 'Array of waypoints [time, latitude, longitude, baro_altitude, true_track, on_ground]',
                            items: { type: 'array' }
                        }
                    }
                }
            }
        }
    }
}
