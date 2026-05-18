export const main = {
    namespace: 'openrouteservice',
    name: 'OpenRouteService',
    description: 'Open-source routing, isochrones, distance matrix, geocoding, elevation, and route optimization powered by OpenStreetMap data.',
    version: '4.0.0',
    docs: [
        'https://openrouteservice.org/dev/#/api-docs',
        'https://giscience.github.io/openrouteservice/api-reference/endpoints/'
    ],
    tags: [
        'routing',
        'geocoding',
        'maps',
        'isochrones',
        'geospatial',
        'openstreetmap',
        'cacheTtlDaily'
    ],
    root: 'https://api.openrouteservice.org',
    requiredServerParams: ['ORS_API_KEY'],
    headers: {
        'Authorization': '{{ORS_API_KEY}}',
        'Content-Type': 'application/json'
    },
    tools: {
        directions: {
            method: 'POST',
            path: '/v2/directions/:profile',
            description: 'Calculate a route between two or more coordinates for a given transport profile. Returns distance, duration, geometry, and turn-by-turn instructions.',
            parameters: [
                {
                    position: { key: 'profile', value: '{{USER_PARAM}}', location: 'insert' },
                    z: { primitive: 'enum(driving-car,driving-hgv,cycling-regular,cycling-mountain,cycling-road,cycling-electric,foot-walking,foot-hiking,wheelchair)', options: [] }
                },
                {
                    position: { key: 'coordinates', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'array()', options: [] }
                },
                {
                    position: { key: 'language', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'string()', options: ['optional()', 'default(en)'] }
                },
                {
                    position: { key: 'units', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'enum(m,km,mi)', options: ['optional()', 'default(m)'] }
                },
                {
                    position: { key: 'instructions', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'boolean()', options: ['optional()', 'default(true)'] }
                },
                {
                    position: { key: 'preference', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'enum(fastest,shortest,recommended)', options: ['optional()', 'default(recommended)'] }
                }
            ],
            tests: [
                {
                    _description: 'Route by car from Berlin to Munich',
                    profile: 'driving-car',
                    coordinates: [[13.388860, 52.517037], [11.575382, 48.137154]]
                },
                {
                    _description: 'Walking route in Paris with shortest preference',
                    profile: 'foot-walking',
                    coordinates: [[2.3522, 48.8566], [2.2945, 48.8584]],
                    preference: 'shortest'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        tools: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    summary: {
                                        type: 'object',
                                        properties: {
                                            distance: { type: 'number' },
                                            duration: { type: 'number' }
                                        }
                                    },
                                    geometry: { type: 'string' },
                                    segments: { type: 'array' }
                                }
                            }
                        },
                        metadata: { type: 'object' }
                    }
                }
            }
        },
        isochrones: {
            method: 'POST',
            path: '/v2/isochrones/:profile',
            description: 'Calculate isochrone polygons showing reachable areas from given locations within specified time or distance ranges.',
            parameters: [
                {
                    position: { key: 'profile', value: '{{USER_PARAM}}', location: 'insert' },
                    z: { primitive: 'enum(driving-car,driving-hgv,cycling-regular,cycling-mountain,cycling-road,cycling-electric,foot-walking,foot-hiking,wheelchair)', options: [] }
                },
                {
                    position: { key: 'locations', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'array()', options: [] }
                },
                {
                    position: { key: 'range', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'array()', options: [] }
                },
                {
                    position: { key: 'range_type', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'enum(time,distance)', options: ['optional()', 'default(time)'] }
                },
                {
                    position: { key: 'units', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'enum(m,km,mi)', options: ['optional()', 'default(m)'] }
                }
            ],
            tests: [
                {
                    _description: 'Isochrone 10 minutes walking from Berlin center',
                    profile: 'foot-walking',
                    locations: [[13.388860, 52.517037]],
                    range: [600]
                },
                {
                    _description: 'Driving isochrones at 5 and 10 minute intervals',
                    profile: 'driving-car',
                    locations: [[8.681495, 49.41461]],
                    range: [300, 600]
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        type: { type: 'string' },
                        features: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    type: { type: 'string' },
                                    geometry: { type: 'object' },
                                    properties: {
                                        type: 'object',
                                        properties: {
                                            value: { type: 'number' },
                                            center: { type: 'array' }
                                        }
                                    }
                                }
                            }
                        },
                        metadata: { type: 'object' }
                    }
                }
            }
        },
        matrix: {
            method: 'POST',
            path: '/v2/matrix/:profile',
            description: 'Calculate a time and/or distance matrix between sets of origin and destination locations.',
            parameters: [
                {
                    position: { key: 'profile', value: '{{USER_PARAM}}', location: 'insert' },
                    z: { primitive: 'enum(driving-car,driving-hgv,cycling-regular,cycling-mountain,cycling-road,cycling-electric,foot-walking,foot-hiking,wheelchair)', options: [] }
                },
                {
                    position: { key: 'locations', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'array()', options: [] }
                },
                {
                    position: { key: 'metrics', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'array()', options: ['optional()'] }
                },
                {
                    position: { key: 'sources', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'array()', options: ['optional()'] }
                },
                {
                    position: { key: 'destinations', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'array()', options: ['optional()'] }
                },
                {
                    position: { key: 'units', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'enum(m,km,mi)', options: ['optional()', 'default(m)'] }
                }
            ],
            tests: [
                {
                    _description: 'Distance matrix between 3 German cities',
                    profile: 'driving-car',
                    locations: [[13.388860, 52.517037], [11.575382, 48.137154], [9.993682, 53.551086]],
                    metrics: ['distance', 'duration']
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        durations: {
                            type: 'array',
                            items: { type: 'array' }
                        },
                        distances: {
                            type: 'array',
                            items: { type: 'array' }
                        },
                        destinations: { type: 'array' },
                        sources: { type: 'array' },
                        metadata: { type: 'object' }
                    }
                }
            }
        },
        geocodeSearch: {
            method: 'GET',
            path: '/geocode/search',
            description: 'Forward geocode a text query to coordinates using the Pelias geocoder. Resolve addresses, place names, and postal codes.',
            parameters: [
                {
                    position: { key: 'api_key', value: '{{ORS_API_KEY}}', location: 'query' },
                    z: { primitive: 'string()', options: [] }
                },
                {
                    position: { key: 'text', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'string()', options: [] }
                },
                {
                    position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'number()', options: ['optional()', 'default(10)'] }
                },
                {
                    position: { key: 'boundary.country', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'string()', options: ['optional()'] }
                },
                {
                    position: { key: 'layers', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'string()', options: ['optional()'] }
                }
            ],
            tests: [
                {
                    _description: 'Geocode Brandenburg Gate Berlin',
                    text: 'Brandenburg Gate, Berlin',
                    size: 5
                },
                {
                    _description: 'Geocode address in Germany',
                    text: 'Friedrichstrasse 43, Berlin',
                    'boundary.country': 'DE',
                    size: 3
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        type: { type: 'string' },
                        features: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    type: { type: 'string' },
                                    geometry: {
                                        type: 'object',
                                        properties: {
                                            type: { type: 'string' },
                                            coordinates: { type: 'array' }
                                        }
                                    },
                                    properties: {
                                        type: 'object',
                                        properties: {
                                            label: { type: 'string' },
                                            name: { type: 'string' },
                                            country: { type: 'string' },
                                            region: { type: 'string' },
                                            confidence: { type: 'number' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        geocodeReverse: {
            method: 'GET',
            path: '/geocode/reverse',
            description: 'Reverse geocode coordinates to a human-readable address or place name.',
            parameters: [
                {
                    position: { key: 'api_key', value: '{{ORS_API_KEY}}', location: 'query' },
                    z: { primitive: 'string()', options: [] }
                },
                {
                    position: { key: 'point.lon', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'number()', options: [] }
                },
                {
                    position: { key: 'point.lat', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'number()', options: [] }
                },
                {
                    position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'number()', options: ['optional()', 'default(10)'] }
                },
                {
                    position: { key: 'layers', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'string()', options: ['optional()'] }
                }
            ],
            tests: [
                {
                    _description: 'Reverse geocode Berlin center coordinates',
                    'point.lon': 13.388860,
                    'point.lat': 52.517037
                },
                {
                    _description: 'Reverse geocode Eiffel Tower',
                    'point.lon': 2.2945,
                    'point.lat': 48.8584
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        type: { type: 'string' },
                        features: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    type: { type: 'string' },
                                    geometry: { type: 'object' },
                                    properties: {
                                        type: 'object',
                                        properties: {
                                            label: { type: 'string' },
                                            name: { type: 'string' },
                                            street: { type: 'string' },
                                            country: { type: 'string' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        elevation: {
            method: 'POST',
            path: '/elevation/point',
            description: 'Get elevation data for a single point coordinate using SRTM datasets.',
            parameters: [
                {
                    position: { key: 'format_in', value: 'point', location: 'body' },
                    z: { primitive: 'string()', options: [] }
                },
                {
                    position: { key: 'format_out', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'enum(point,geojson)', options: ['optional()', 'default(point)'] }
                },
                {
                    position: { key: 'geometry', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'array()', options: [] }
                }
            ],
            tests: [
                {
                    _description: 'Elevation for Brandenburg Gate Berlin',
                    geometry: [13.349762, 52.515560]
                },
                {
                    _description: 'Elevation for Mount Zugspitze area',
                    geometry: [10.9863, 47.4210]
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        type: { type: 'string' },
                        geometry: {
                            type: 'object',
                            properties: {
                                type: { type: 'string' },
                                coordinates: { type: 'array' }
                            }
                        }
                    }
                }
            }
        },
        optimization: {
            method: 'POST',
            path: '/optimization',
            description: 'Solve vehicle routing problems (VRP) using VROOM. Optimize the order of stops for one or multiple vehicles with time windows and capacities.',
            parameters: [
                {
                    position: { key: 'jobs', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'array()', options: [] }
                },
                {
                    position: { key: 'vehicles', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'array()', options: [] }
                }
            ],
            tests: [
                {
                    _description: 'Optimize delivery route for 3 jobs with 1 vehicle in Berlin',
                    jobs: [
                        { id: 1, location: [13.388860, 52.517037] },
                        { id: 2, location: [13.397634, 52.529407] },
                        { id: 3, location: [13.428555, 52.523219] }
                    ],
                    vehicles: [
                        { id: 1, profile: 'driving-car', start: [13.388860, 52.517037], end: [13.388860, 52.517037] }
                    ]
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        summary: {
                            type: 'object',
                            properties: {
                                cost: { type: 'number' },
                                tools: { type: 'number' },
                                unassigned: { type: 'number' },
                                duration: { type: 'number' },
                                distance: { type: 'number' }
                            }
                        },
                        tools: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    vehicle: { type: 'number' },
                                    steps: { type: 'array' },
                                    cost: { type: 'number' },
                                    duration: { type: 'number' },
                                    distance: { type: 'number' }
                                }
                            }
                        },
                        unassigned: { type: 'array' }
                    }
                }
            }
        }
    }
}
