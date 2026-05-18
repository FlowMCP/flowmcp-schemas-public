export const main = {
    namespace: 'spacex',
    name: 'SpacexApi',
    description: 'Access SpaceX mission data — launches, rockets, crew members, Starlink satellites, launchpads, and company information via the open SpaceX REST API.',
    version: '4.0.0',
    docs: ['https://github.com/r-spacex/SpaceX-API'],
    tags: ['space', 'launches', 'rockets', 'satellites', 'cacheTtlFrequent'],
    root: 'https://api.spacexdata.com',
    requiredServerParams: [],
    headers: {},
    tools: {
        getAllLaunches: {
            method: 'GET',
            path: '/v5/launches',
            description: 'Retrieve all SpaceX launches (past and upcoming). Returns full launch data including mission name, date, rocket, success status, and media links.. Use IDs from results in getUpcomingLaunches',
            parameters: [],
            tests: [
                { _description: 'Get all SpaceX launches' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', description: 'Unique launch identifier' },
                            name: { type: 'string', description: 'Launch designation e.g. CRS-20' },
                            flight_number: { type: 'number', description: 'Sequential mission number' },
                            date_utc: { type: 'string', description: 'Launch timestamp in UTC ISO-8601' },
                            date_unix: { type: 'number', description: 'Launch timestamp as Unix epoch' },
                            upcoming: { type: 'boolean', description: 'True if launch is scheduled in the future' },
                            success: { type: 'boolean', description: 'Mission success status (null if upcoming)' },
                            rocket: { type: 'string', description: 'Rocket ID reference' },
                            launchpad: { type: 'string', description: 'Launchpad ID reference' },
                            details: { type: 'string', description: 'Mission description and objectives' },
                            cores: { type: 'array', description: 'Booster information including reuse and landing data' },
                            payloads: { type: 'array', items: { type: 'string' }, description: 'Payload ID references' },
                            capsules: { type: 'array', items: { type: 'string' }, description: 'Capsule ID references' },
                            failures: { type: 'array', description: 'Mission anomaly records' },
                            links: {
                                type: 'object',
                                properties: {
                                    patch: { type: 'object', properties: { small: { type: 'string' }, large: { type: 'string' } } },
                                    webcast: { type: 'string', description: 'YouTube livestream URL' },
                                    article: { type: 'string' },
                                    wikipedia: { type: 'string' },
                                    reddit: { type: 'object' },
                                    flickr: { type: 'object' }
                                }
                            }
                        }
                    }
                }
            }
        },
        getLatestLaunch: {
            method: 'GET',
            path: '/v5/launches/latest',
            description: 'Get the most recently completed SpaceX launch with full mission details.. Use getAllLaunches first to find valid IDs',
            parameters: [],
            tests: [
                { _description: 'Get the latest SpaceX launch' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        flight_number: { type: 'number' },
                        date_utc: { type: 'string' },
                        success: { type: 'boolean' },
                        rocket: { type: 'string' },
                        details: { type: 'string' },
                        links: { type: 'object' },
                        cores: { type: 'array' },
                        payloads: { type: 'array' }
                    }
                }
            }
        },
        getUpcomingLaunches: {
            method: 'GET',
            path: '/v5/launches/upcoming',
            description: 'Get all upcoming SpaceX launches. Returns scheduled missions with target dates and available mission details.',
            parameters: [],
            tests: [
                { _description: 'Get all upcoming SpaceX launches' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            flight_number: { type: 'number' },
                            date_utc: { type: 'string' },
                            upcoming: { type: 'boolean' },
                            rocket: { type: 'string' },
                            launchpad: { type: 'string' },
                            details: { type: 'string' },
                            links: { type: 'object' }
                        }
                    }
                }
            }
        },
        getLaunchById: {
            method: 'GET',
            path: '/v5/launches/:id',
            description: 'Retrieve full details for a specific SpaceX launch by its unique identifier.. Use getAllLaunches first to find valid IDs',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get details for Falcon Heavy Demo flight', id: '5eb87d47ffd86e000604b38a' },
                { _description: 'Get details for CRS-20 mission', id: '5eb87d42ffd86e000604b384' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        flight_number: { type: 'number' },
                        date_utc: { type: 'string' },
                        success: { type: 'boolean' },
                        rocket: { type: 'string' },
                        details: { type: 'string' },
                        cores: { type: 'array' },
                        payloads: { type: 'array' },
                        links: { type: 'object' },
                        failures: { type: 'array' }
                    }
                }
            }
        },
        getAllRockets: {
            method: 'GET',
            path: '/v4/rockets',
            description: 'Get specifications for all SpaceX rockets including Falcon 9, Falcon Heavy, Dragon, and Starship. Returns physical specs, engine data, and performance metrics.',
            parameters: [],
            tests: [
                { _description: 'Get all SpaceX rocket specifications' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string', description: 'Rocket name e.g. Falcon 9' },
                            active: { type: 'boolean' },
                            stages: { type: 'number' },
                            boosters: { type: 'number' },
                            cost_per_launch: { type: 'number', description: 'Cost per launch in USD' },
                            success_rate_pct: { type: 'number' },
                            first_flight: { type: 'string' },
                            country: { type: 'string' },
                            company: { type: 'string' },
                            height: { type: 'object', properties: { meters: { type: 'number' }, feet: { type: 'number' } } },
                            diameter: { type: 'object', properties: { meters: { type: 'number' }, feet: { type: 'number' } } },
                            mass: { type: 'object', properties: { kg: { type: 'number' }, lb: { type: 'number' } } },
                            payload_weights: { type: 'array', description: 'Payload capacity for various orbits (LEO, GTO, Mars, etc.)' },
                            first_stage: { type: 'object', description: 'First stage engine and fuel data' },
                            second_stage: { type: 'object', description: 'Second stage engine and fuel data' },
                            engines: { type: 'object', description: 'Engine type, number, and performance specs' },
                            description: { type: 'string' },
                            flickr_images: { type: 'array', items: { type: 'string' } },
                            wikipedia: { type: 'string' }
                        }
                    }
                }
            }
        },
        getAllCrew: {
            method: 'GET',
            path: '/v4/crew',
            description: 'Get all Dragon crew members who have flown or are assigned to SpaceX missions. Returns astronaut profiles with agency, status, and launch history.',
            parameters: [],
            tests: [
                { _description: 'Get all SpaceX Dragon crew members' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            agency: { type: 'string', description: 'Space agency e.g. NASA, ESA, JAXA' },
                            image: { type: 'string', description: 'Profile photo URL' },
                            wikipedia: { type: 'string' },
                            launches: { type: 'array', items: { type: 'string' }, description: 'Launch IDs crew member participated in' },
                            status: { type: 'string', description: 'Current status (active, inactive, retired, unknown)' }
                        }
                    }
                }
            }
        },
        getStarlinkSatellites: {
            method: 'GET',
            path: '/v4/starlink',
            description: 'Get orbital data for all Starlink satellites updated hourly from Space Track. Returns position, velocity, and orbital mechanics data.',
            parameters: [],
            tests: [
                { _description: 'Get all Starlink satellite orbital data' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            version: { type: 'string', description: 'Starlink satellite version' },
                            launch: { type: 'string', description: 'Launch mission ID reference' },
                            longitude: { type: 'number', description: 'Current longitude in degrees' },
                            latitude: { type: 'number', description: 'Current latitude in degrees' },
                            height_km: { type: 'number', description: 'Orbital altitude in kilometers' },
                            velocity_kms: { type: 'number', description: 'Current orbital velocity in km/s' },
                            spaceTrack: {
                                type: 'object',
                                description: 'NORAD Space Track orbital mechanics data',
                                properties: {
                                    CCSDS_OMM_VERS: { type: 'string' },
                                    OBJECT_NAME: { type: 'string', description: 'Satellite name e.g. STARLINK-1007' },
                                    OBJECT_ID: { type: 'string', description: 'COSPAR international designator' },
                                    NORAD_CAT_ID: { type: 'string', description: 'NORAD catalog number' },
                                    INCLINATION: { type: 'number', description: 'Orbital inclination in degrees' },
                                    PERIOD: { type: 'number', description: 'Orbital period in minutes' },
                                    APOAPSIS: { type: 'number', description: 'Highest point of orbit in km' },
                                    PERIAPSIS: { type: 'number', description: 'Lowest point of orbit in km' },
                                    DECAY_DATE: { type: 'string', description: 'Date of orbital decay (null if active)' }
                                }
                            }
                        }
                    }
                }
            }
        },
        getCompanyInfo: {
            method: 'GET',
            path: '/v4/company',
            description: 'Get SpaceX company information including founding details, employees, vehicles, valuation, and headquarters location.. Use getAllLaunches first to find valid IDs',
            parameters: [],
            tests: [
                { _description: 'Get SpaceX company overview' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        founder: { type: 'string' },
                        founded: { type: 'number', description: 'Year founded' },
                        employees: { type: 'number' },
                        vehicles: { type: 'number', description: 'Number of active vehicles' },
                        launch_sites: { type: 'number' },
                        test_sites: { type: 'number' },
                        ceo: { type: 'string' },
                        cto: { type: 'string' },
                        coo: { type: 'string' },
                        cto_propulsion: { type: 'string' },
                        valuation: { type: 'number', description: 'Company valuation in USD' },
                        summary: { type: 'string', description: 'Company mission description' },
                        headquarters: {
                            type: 'object',
                            properties: {
                                address: { type: 'string' },
                                city: { type: 'string' },
                                state: { type: 'string' }
                            }
                        },
                        links: {
                            type: 'object',
                            properties: {
                                website: { type: 'string' },
                                flickr: { type: 'string' },
                                twitter: { type: 'string' },
                                elon_twitter: { type: 'string' }
                            }
                        }
                    }
                }
            }
        }
    }
}
