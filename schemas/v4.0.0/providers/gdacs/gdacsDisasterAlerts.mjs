export const main = {
    namespace: 'gdacs',
    name: 'GdacsDisasterAlerts',
    description: 'Query the Global Disaster Alert and Coordination System (GDACS) for real-time natural disaster events — earthquakes, floods, tropical cyclones, volcanoes, wildfires, and droughts with alert levels and geographic data.',
    version: '4.0.0',
    docs: ['https://www.gdacs.org/gdacsapi/swagger/index.html'],
    tags: ['disasters', 'alerts', 'geospatial', 'emergencies', 'cacheTtlFrequent'],
    root: 'https://www.gdacs.org',
    requiredServerParams: [],
    headers: {},
    tools: {
        getRecentEvents: {
            method: 'GET',
            path: '/gdacsapi/api/events/geteventlist/SEARCH',
            description: 'Search recent disaster events worldwide. Returns a GeoJSON FeatureCollection of natural disaster alerts with severity, location, and affected areas. Use getEventData for related data. Use getEventGeometry for related data.',
            parameters: [
                {
                    position: {
                        key: 'eventlist',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'fromDate',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'toDate',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'alertlevel',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'enum(green,orange,red)',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'country',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'limit',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(100)', 'min(1)', 'max(100)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Get all recent disaster events in the last 30 days',
                    fromDate: '2026-02-01',
                    toDate: '2026-03-03',
                    limit: 20
                },
                {
                    _description: 'Get recent earthquake events',
                    eventlist: 'EQ',
                    limit: 10
                },
                {
                    _description: 'Get red alert level events',
                    alertlevel: 'red',
                    limit: 20
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        type: {
                            type: 'string',
                            description: 'GeoJSON type — FeatureCollection'
                        },
                        features: {
                            type: 'array',
                            description: 'Array of disaster event features',
                            items: {
                                type: 'object',
                                properties: {
                                    type: {
                                        type: 'string',
                                        description: 'Type classification'
                                    },
                                    geometry: {
                                        type: 'object',
                                        properties: {
                                            type: {
                                                type: 'string',
                                                description: 'Type classification'
                                            },
                                            coordinates: {
                                                type: 'array',
                                                items: {
                                                    type: 'number'
                                                },
                                                description: 'Geographic coordinates'
                                            }
                                        },
                                        description: 'Geometric shape data'
                                    },
                                    properties: {
                                        type: 'object',
                                        properties: {
                                            eventtype: {
                                                type: 'string',
                                                description: 'Disaster type (EQ, FL, TC, VO, WF, DR)'
                                            },
                                            eventid: {
                                                type: 'number',
                                                description: 'Unique event identifier'
                                            },
                                            name: {
                                                type: 'string',
                                                description: 'Event name'
                                            },
                                            description: {
                                                type: 'string',
                                                description: 'Event description'
                                            },
                                            alertlevel: {
                                                type: 'string',
                                                description: 'Alert level (Green, Orange, Red)'
                                            },
                                            alertscore: {
                                                type: 'number',
                                                description: 'Numeric alert score'
                                            },
                                            country: {
                                                type: 'string',
                                                description: 'Affected country'
                                            },
                                            fromdate: {
                                                type: 'string',
                                                description: 'Event start date'
                                            },
                                            todate: {
                                                type: 'string',
                                                description: 'Event end date'
                                            },
                                            severity: {
                                                type: 'object',
                                                description: 'Severity details (magnitude, value, unit)'
                                            }
                                        },
                                        description: 'Property collection'
                                    }
                                },
                                description: 'Individual item in the features collection'
                            }
                        }
                    }
                }
            }
        },
        getEventData: {
            method: 'GET',
            path: '/gdacsapi/api/events/geteventdata',
            description: 'Get detailed data for a specific disaster event by event type and event ID, including severity, affected population, and impact assessments. Use getRecentEvents for related data. Use getEventGeometry for related data.',
            parameters: [
                {
                    position: {
                        key: 'eventtype',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'enum(EQ,FL,TC,VO,WF,DR)',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'eventid',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: []
                    }
                }
            ],
            tests: [
                {
                    _description: 'Get details for a specific earthquake event',
                    eventtype: 'EQ',
                    eventid: 1526507
                },
                {
                    _description: 'Get details for a flood event',
                    eventtype: 'FL',
                    eventid: 1102983
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        geometry: {
                            type: 'object',
                            description: 'GeoJSON geometry of the event'
                        },
                        properties: {
                            type: 'object',
                            properties: {
                                eventtype: {
                                    type: 'string',
                                    description: 'Eventtype value'
                                },
                                eventid: {
                                    type: 'number',
                                    description: 'Eventid numeric value'
                                },
                                name: {
                                    type: 'string',
                                    description: 'Display name'
                                },
                                description: {
                                    type: 'string',
                                    description: 'Descriptive text'
                                },
                                alertlevel: {
                                    type: 'string',
                                    description: 'Alertlevel value'
                                },
                                severity: {
                                    type: 'object',
                                    description: 'Severity details'
                                },
                                population: {
                                    type: 'object',
                                    description: 'Affected population data'
                                },
                                country: {
                                    type: 'string',
                                    description: 'Country name or code'
                                }
                            },
                            description: 'Property collection'
                        }
                    }
                }
            }
        },
        getEventGeometry: {
            method: 'GET',
            path: '/gdacsapi/api/polygons/getgeometry',
            description: 'Get the geographic polygon geometry for a specific disaster event. Returns impact area boundaries as GeoJSON. Use getRecentEvents for related data. Use getEventData for related data.',
            parameters: [
                {
                    position: {
                        key: 'eventtype',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'enum(EQ,FL,TC,VO,WF,DR)',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'eventid',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'episodeid',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Get geometry for a specific earthquake',
                    eventtype: 'EQ',
                    eventid: 1526507
                },
                {
                    _description: 'Get geometry for a flood event with episode',
                    eventtype: 'FL',
                    eventid: 1102983,
                    episodeid: 1690089
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        type: {
                            type: 'string',
                            description: 'GeoJSON geometry type'
                        },
                        coordinates: {
                            type: 'array',
                            description: 'Coordinate arrays defining the geometry'
                        }
                    }
                }
            }
        },
        getEventsForApp: {
            method: 'GET',
            path: '/gdacsapi/api/events/geteventlist/events4app',
            description: 'Get a compact list of recent disaster events optimized for application consumption. Returns the most recent 100 events from the last 4 days. Use getRecentEvents for related data. Use getEventData for related data.',
            parameters: [],
            tests: [
                {
                    _description: 'Get recent events formatted for apps'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        type: {
                            type: 'string',
                            description: 'FeatureCollection'
                        },
                        features: {
                            type: 'array',
                            description: 'Array of recent disaster events',
                            items: {
                                type: 'object'
                            }
                        }
                    }
                }
            }
        }
    }
}
