// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'autobahn',
    name: 'Autobahn App API',
    description: 'Real-time traffic data for German motorways including roadworks, warnings, closures, webcams, and electric charging stations',
    version: '4.0.0',
    docs: ['https://autobahn.api.bund.dev/'],
    tags: ['traffic', 'germany', 'infrastructure', 'cacheTtlFrequent'],
    root: 'https://verkehr.autobahn.de/o/autobahn',
    tools: {
        listRoads: {
            method: 'GET',
            path: '/',
            description: 'List all available German motorway identifiers (A1, A2, etc.) Returns structured JSON response data.',
            parameters: [],
            tests: [
                { _description: 'List all motorways' },
                { _description: 'List all available road identifiers' },
                { _description: 'Fetch motorway list for Germany' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        roads: { type: 'array', items: { type: 'string' } }
                    }
                }
            },
        },
        getRoadworks: {
            method: 'GET',
            path: '/:roadId/services/roadworks',
            description: 'Get current roadworks and construction sites for a specific motorway. Required: roadId.',
            parameters: [
                { position: { key: 'roadId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'German motorway identifier, e.g. A1, A7, A99' }
            ],
            tests: [
                { _description: 'Get roadworks on A1', roadId: 'A1' },
                { _description: 'Get roadworks on A7', roadId: 'A7' },
                { _description: 'Get roadworks on A9', roadId: 'A9' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        roadworks: { type: 'array', items: { type: 'object', properties: { identifier: { type: 'string' }, icon: { type: 'string' }, isBlocked: { type: 'string' }, future: { type: 'boolean' }, extent: { type: 'string' }, point: { type: 'string' }, startLcPosition: { type: 'string' }, impact: { type: 'object' }, display_type: { type: 'string' }, subtitle: { type: 'string' }, title: { type: 'string' }, startTimestamp: { type: 'string' }, coordinate: { type: 'object' }, description: { type: 'array', items: { type: 'string' } }, routeRecommendation: { type: 'array', items: { type: 'string' } }, footer: { type: 'array', items: { type: 'string' } }, lorryParkingFeatureIcons: { type: 'array', items: { type: 'string' } }, geometry: { type: 'object' } } } }
                    }
                }
            },
        },
        getWarnings: {
            method: 'GET',
            path: '/:roadId/services/warning',
            description: 'Get current traffic warnings for a specific motorway via Autobahn API — query by roadId.',
            parameters: [
                { position: { key: 'roadId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'German motorway identifier, e.g. A1, A3, A7' }
            ],
            tests: [
                { _description: 'Get warnings on A1', roadId: 'A1' },
                { _description: 'Get warnings on A3', roadId: 'A3' },
                { _description: 'Get warnings on A5', roadId: 'A5' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        warning: { type: 'array', items: { type: 'object', properties: { identifier: { type: 'string' }, icon: { type: 'string' }, isBlocked: { type: 'string' }, future: { type: 'boolean' }, extent: { type: 'string' }, point: { type: 'string' }, startLcPosition: { type: 'string' }, display_type: { type: 'string' }, subtitle: { type: 'string' }, title: { type: 'string' }, startTimestamp: { type: 'string' }, delayTimeValue: { type: 'string' }, abnormalTrafficType: { type: 'string' }, averageSpeed: { type: 'string' }, coordinate: { type: 'object' }, description: { type: 'array', items: { type: 'string' } }, routeRecommendation: { type: 'array', items: { type: 'string' } }, footer: { type: 'array', items: { type: 'string' } }, lorryParkingFeatureIcons: { type: 'array', items: { type: 'string' } }, source: { type: 'string' }, geometry: { type: 'object' } } } }
                    }
                }
            },
        },
        getClosures: {
            method: 'GET',
            path: '/:roadId/services/closure',
            description: 'Get current road closures for a specific motorway via Autobahn API — query by roadId.',
            parameters: [
                { position: { key: 'roadId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'German motorway identifier, e.g. A1, A5, A9' }
            ],
            tests: [
                { _description: 'Get closures on A1', roadId: 'A1' },
                { _description: 'Get closures on A5', roadId: 'A5' },
                { _description: 'Get closures on A3', roadId: 'A3' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        closure: { type: 'array', items: { type: 'object', properties: { identifier: { type: 'string' }, icon: { type: 'string' }, isBlocked: { type: 'string' }, future: { type: 'boolean' }, extent: { type: 'string' }, point: { type: 'string' }, startLcPosition: { type: 'string' }, impact: { type: 'object' }, display_type: { type: 'string' }, subtitle: { type: 'string' }, title: { type: 'string' }, coordinate: { type: 'object' }, description: { type: 'array', items: { type: 'string' } }, routeRecommendation: { type: 'array', items: { type: 'string' } }, footer: { type: 'array', items: { type: 'string' } }, lorryParkingFeatureIcons: { type: 'array', items: { type: 'string' } }, geometry: { type: 'object' } } } }
                    }
                }
            },
        },
        getChargingStations: {
            method: 'GET',
            path: '/:roadId/services/electric_charging_station',
            description: 'Get electric vehicle charging stations along a specific motorway. Required: roadId.',
            parameters: [
                { position: { key: 'roadId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'German motorway identifier, e.g. A1, A9, A7' }
            ],
            tests: [
                { _description: 'Get charging stations on A1', roadId: 'A1' },
                { _description: 'Get charging stations on A9', roadId: 'A9' },
                { _description: 'Get charging stations on A5', roadId: 'A5' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        electric_charging_station: { type: 'array', items: { type: 'object', properties: { identifier: { type: 'string' }, icon: { type: 'string' }, isBlocked: { type: 'string' }, future: { type: 'boolean' }, extent: { type: 'string' }, point: { type: 'string' }, display_type: { type: 'string' }, subtitle: { type: 'string' }, title: { type: 'string' }, coordinate: { type: 'object' }, description: { type: 'array', items: { type: 'string' } }, routeRecommendation: { type: 'array', items: { type: 'string' } }, footer: { type: 'array', items: { type: 'string' } }, lorryParkingFeatureIcons: { type: 'array', items: { type: 'string' } } } } }
                    }
                }
            },
        },
        getWebcams: {
            method: 'GET',
            path: '/:roadId/services/webcam',
            description: 'Get traffic webcams along a specific motorway via Autobahn API — query by roadId.',
            parameters: [
                { position: { key: 'roadId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'German motorway identifier, e.g. A9, A3, A1' }
            ],
            tests: [
                { _description: 'Get webcams on A9', roadId: 'A9' },
                { _description: 'Get webcams on A3', roadId: 'A3' },
                { _description: 'Get webcams on A7', roadId: 'A7' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        webcam: { type: 'array', items: { type: 'string' } }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    listRoads: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.roads ) { return { response }}

            response = {
            totalRoads: raw.roads.length,
            roads: raw.roads
            }

            return { response }
        }
    },
    getRoadworks: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.roadworks ) { return { response }}

            const roadworks = raw.roadworks
            .map( ( item ) => {
            const { identifier, title, subtitle, extent, isBlocked, description, future } = item

            return {
            id: identifier,
            title,
            subtitle,
            isBlocked: isBlocked === 'true',
            isFuture: future,
            extent,
            details: ( description || [] ).filter( ( d ) => d.length > 0 )
            }
            } )

            response = {
            totalRoadworks: roadworks.length,
            roadworks
            }

            return { response }
        }
    },
    getWarnings: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.warning ) { return { response }}

            const warnings = raw.warning
            .map( ( item ) => {
            const { identifier, title, subtitle, extent, isBlocked, description, display_type } = item

            return {
            id: identifier,
            title,
            subtitle,
            type: display_type,
            isBlocked: isBlocked === 'true',
            extent,
            details: ( description || [] ).filter( ( d ) => d.length > 0 )
            }
            } )

            response = {
            totalWarnings: warnings.length,
            warnings
            }

            return { response }
        }
    },
    getClosures: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.closure ) { return { response }}

            const closures = raw.closure
            .map( ( item ) => {
            const { identifier, title, subtitle, extent, isBlocked, description, future } = item

            return {
            id: identifier,
            title,
            subtitle,
            isBlocked: isBlocked === 'true',
            isFuture: future,
            extent,
            details: ( description || [] ).filter( ( d ) => d.length > 0 )
            }
            } )

            response = {
            totalClosures: closures.length,
            closures
            }

            return { response }
        }
    },
    getChargingStations: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.electric_charging_station ) { return { response }}

            const stations = raw.electric_charging_station
            .map( ( item ) => {
            const { identifier, title, subtitle, point, description } = item

            return {
            id: identifier,
            title,
            subtitle,
            coordinates: point,
            details: ( description || [] ).filter( ( d ) => d.length > 0 )
            }
            } )

            response = {
            totalStations: stations.length,
            stations
            }

            return { response }
        }
    },
    getWebcams: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.webcam ) { return { response }}

            const webcams = raw.webcam
            .map( ( item ) => {
            const { identifier, title, subtitle, point, description, operator, imageurl } = item

            return {
            id: identifier,
            title,
            subtitle,
            coordinates: point,
            operator,
            imageUrl: imageurl,
            details: ( description || [] ).filter( ( d ) => d.length > 0 )
            }
            } )

            response = {
            totalWebcams: webcams.length,
            webcams
            }

            return { response }
        }
    }
} )
