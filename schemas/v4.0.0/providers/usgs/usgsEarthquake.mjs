export const main = {
    namespace: 'usgs',
    name: 'UsgsEarthquake',
    description: 'Query USGS Earthquake Hazards Program data — search earthquakes by location, magnitude, date range, and depth with GeoJSON responses.',
    version: '4.0.0',
    docs: ['https://earthquake.usgs.gov/fdsnws/event/1/'],
    tags: ['earthquakes', 'geology', 'geospatial', 'hazards', 'cacheTtlFrequent'],
    root: 'https://earthquake.usgs.gov',
    requiredServerParams: [],
    headers: {},
    tools: {
        queryEarthquakes: {
            method: 'GET',
            path: '/fdsnws/event/1/query',
            description: 'Search earthquakes with flexible filtering by date range, magnitude, depth, and geographic bounds. Returns GeoJSON FeatureCollection.. Use IDs from results in countEarthquakes',
            parameters: [
                { position: { key: 'format', value: 'geojson', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'starttime', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'endtime', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'minmagnitude', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(-1)', 'max(10)'] } },
                { position: { key: 'maxmagnitude', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(-1)', 'max(10)'] } },
                { position: { key: 'minlatitude', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(-90)', 'max(90)'] } },
                { position: { key: 'maxlatitude', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(-90)', 'max(90)'] } },
                { position: { key: 'minlongitude', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(-180)', 'max(180)'] } },
                { position: { key: 'maxlongitude', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(-180)', 'max(180)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(20000)'] } },
                { position: { key: 'orderby', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(time,time-asc,magnitude,magnitude-asc)', options: ['optional()', 'default(time)'] } }
            ],
            tests: [
                { _description: 'Get recent M5+ earthquakes globally', minmagnitude: 5, limit: 20, orderby: 'time' },
                { _description: 'Get earthquakes in California bounding box last 7 days', starttime: '2025-02-23', endtime: '2025-03-02', minlatitude: 32, maxlatitude: 42, minlongitude: -125, maxlongitude: -114, limit: 20 },
                { _description: 'Get largest earthquakes in 2024', starttime: '2024-01-01', endtime: '2024-12-31', minmagnitude: 7, orderby: 'magnitude', limit: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        type: { type: 'string', description: 'GeoJSON type — always FeatureCollection' },
                        metadata: {
                            type: 'object',
                            properties: {
                                generated: { type: 'number', description: 'Unix timestamp of response generation' },
                                url: { type: 'string' },
                                title: { type: 'string' },
                                status: { type: 'number' },
                                api: { type: 'string', description: 'API version' },
                                count: { type: 'number', description: 'Number of events returned' }
                            }
                        },
                        features: {
                            type: 'array',
                            description: 'Array of earthquake GeoJSON Features',
                            items: {
                                type: 'object',
                                properties: {
                                    type: { type: 'string' },
                                    properties: {
                                        type: 'object',
                                        properties: {
                                            mag: { type: 'number', description: 'Earthquake magnitude' },
                                            place: { type: 'string', description: 'Human-readable location description' },
                                            time: { type: 'number', description: 'Unix millisecond timestamp of origin' },
                                            updated: { type: 'number', description: 'Unix millisecond timestamp of last update' },
                                            tz: { type: 'number', description: 'Timezone offset in minutes from UTC' },
                                            url: { type: 'string', description: 'USGS event page URL' },
                                            detail: { type: 'string', description: 'GeoJSON detail URL for this event' },
                                            felt: { type: 'number', description: 'Number of Did You Feel It reports' },
                                            cdi: { type: 'number', description: 'Maximum reported intensity (DYFI)' },
                                            mmi: { type: 'number', description: 'Maximum estimated instrumental intensity (ShakeMap)' },
                                            alert: { type: 'string', description: 'PAGER alert level (green/yellow/orange/red)' },
                                            status: { type: 'string', description: 'Review status (automatic/reviewed)' },
                                            tsunami: { type: 'number', description: '1 if tsunami warning issued' },
                                            sig: { type: 'number', description: 'Significance score (0-1000)' },
                                            net: { type: 'string', description: 'Contributing network ID' },
                                            code: { type: 'string', description: 'Network-specific event code' },
                                            ids: { type: 'string', description: 'Comma-separated list of event IDs' },
                                            type: { type: 'string', description: 'Event type (earthquake, quarry blast, etc.)' },
                                            magType: { type: 'string', description: 'Magnitude type (ml, mw, ms, mb, etc.)' },
                                            depth: { type: 'number', description: 'Depth in kilometers (from geometry.coordinates[2])' }
                                        }
                                    },
                                    geometry: {
                                        type: 'object',
                                        properties: {
                                            type: { type: 'string', description: 'Always Point' },
                                            coordinates: {
                                                type: 'array',
                                                description: '[longitude, latitude, depth_km]',
                                                items: { type: 'number' }
                                            }
                                        }
                                    },
                                    id: { type: 'string', description: 'Unique event identifier' }
                                }
                            }
                        },
                        bbox: {
                            type: 'array',
                            description: 'Bounding box [minLon, minLat, minDepth, maxLon, maxLat, maxDepth]',
                            items: { type: 'number' }
                        }
                    }
                }
            }
        },
        queryByRadius: {
            method: 'GET',
            path: '/fdsnws/event/1/query',
            description: 'Search earthquakes within a circular radius from a center point. Useful for finding earthquakes near a specific city or location.',
            parameters: [
                { position: { key: 'format', value: 'geojson', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'latitude', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(-90)', 'max(90)'] } },
                { position: { key: 'longitude', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(-180)', 'max(180)'] } },
                { position: { key: 'maxradiuskm', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'max(20002)'] } },
                { position: { key: 'starttime', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'endtime', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'minmagnitude', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(-1)', 'max(10)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(20000)'] } },
                { position: { key: 'orderby', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(time,time-asc,magnitude,magnitude-asc)', options: ['optional()', 'default(time)'] } }
            ],
            tests: [
                { _description: 'Earthquakes within 200km of Tokyo in the last 30 days', latitude: 35.6762, longitude: 139.6503, maxradiuskm: 200, starttime: '2025-02-01', limit: 20 },
                { _description: 'M3+ earthquakes within 500km of San Francisco', latitude: 37.7749, longitude: -122.4194, maxradiuskm: 500, minmagnitude: 3, limit: 20 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        type: { type: 'string' },
                        metadata: { type: 'object', properties: { count: { type: 'number' }, title: { type: 'string' } } },
                        features: { type: 'array', items: { type: 'object' } },
                        bbox: { type: 'array', items: { type: 'number' } }
                    }
                }
            }
        },
        countEarthquakes: {
            method: 'GET',
            path: '/fdsnws/event/1/count',
            description: 'Count the number of earthquakes matching the given filter criteria without retrieving full event data.',
            parameters: [
                { position: { key: 'format', value: 'geojson', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'starttime', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'endtime', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'minmagnitude', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(-1)', 'max(10)'] } },
                { position: { key: 'minlatitude', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(-90)', 'max(90)'] } },
                { position: { key: 'maxlatitude', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(-90)', 'max(90)'] } },
                { position: { key: 'minlongitude', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(-180)', 'max(180)'] } },
                { position: { key: 'maxlongitude', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(-180)', 'max(180)'] } }
            ],
            tests: [
                { _description: 'Count M5+ earthquakes globally in 2024', starttime: '2024-01-01', endtime: '2024-12-31', minmagnitude: 5 },
                { _description: 'Count all earthquakes in the last 7 days', starttime: '2025-02-23', endtime: '2025-03-02' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: { type: 'number', description: 'Number of earthquakes matching the query' },
                        maxAllowed: { type: 'number', description: 'Maximum number of events allowed by the service' }
                    }
                }
            }
        },
        getEventById: {
            method: 'GET',
            path: '/fdsnws/event/1/query',
            description: 'Retrieve full details for a specific earthquake event by its USGS event ID.. Use queryEarthquakes first to find valid IDs',
            parameters: [
                { position: { key: 'format', value: 'geojson', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'eventid', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get details for 2024 Noto Peninsula earthquake', eventid: 'us6000m0xl' },
                { _description: 'Get details for specific event', eventid: 'nc73821036' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        type: { type: 'string' },
                        properties: {
                            type: 'object',
                            properties: {
                                mag: { type: 'number' },
                                place: { type: 'string' },
                                time: { type: 'number' },
                                updated: { type: 'number' },
                                alert: { type: 'string' },
                                status: { type: 'string' },
                                tsunami: { type: 'number' },
                                sig: { type: 'number' },
                                type: { type: 'string' }
                            }
                        },
                        geometry: { type: 'object', properties: { coordinates: { type: 'array', items: { type: 'number' } } } },
                        id: { type: 'string' }
                    }
                }
            }
        },
        getSignificantEarthquakes: {
            method: 'GET',
            path: '/fdsnws/event/1/query',
            description: 'Query significant earthquakes filtered by PAGER alert level. Use alert levels green, yellow, orange, or red for impact-based filtering.',
            parameters: [
                { position: { key: 'format', value: 'geojson', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'alertlevel', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(green,yellow,orange,red)', options: [] } },
                { position: { key: 'starttime', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'endtime', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(20000)'] } },
                { position: { key: 'orderby', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(time,time-asc,magnitude,magnitude-asc)', options: ['optional()', 'default(time)'] } }
            ],
            tests: [
                { _description: 'Get red alert level earthquakes in 2024', alertlevel: 'red', starttime: '2024-01-01', endtime: '2024-12-31', limit: 20 },
                { _description: 'Get orange and red alert earthquakes recently', alertlevel: 'orange', starttime: '2025-01-01', limit: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        type: { type: 'string' },
                        metadata: { type: 'object', properties: { count: { type: 'number' }, title: { type: 'string' } } },
                        features: { type: 'array', items: { type: 'object' } }
                    }
                }
            }
        }
    }
}
