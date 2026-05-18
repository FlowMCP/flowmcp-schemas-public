export const main = {
    namespace: 'smithsoniangvp',
    name: 'SmithsonianVolcanoes',
    description: 'Query the Smithsonian Global Volcanism Program (GVP) Volcanoes of the World database via WFS — retrieve Holocene and Pleistocene volcano data and eruption history as GeoJSON.',
    version: '4.0.0',
    docs: ['https://volcano.si.edu/database/webservices.cfm'],
    tags: ['volcanoes', 'geology', 'geospatial', 'natural-hazards', 'cacheTtlDaily'],
    root: 'https://webservices.volcano.si.edu',
    requiredServerParams: [],
    headers: {},
    tools: {
        getHoloceneVolcanoes: {
            method: 'GET',
            path: '/geoserver/GVP-VOTW/ows',
            description: 'Get Holocene volcanoes (active in the last 11,700 years) from the Smithsonian database. Returns GeoJSON features with volcano name, location, type, and elevation.',
            parameters: [
                { position: { key: 'service', value: 'WFS', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'version', value: '1.0.0', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'request', value: 'GetFeature', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'typeName', value: 'GVP-VOTW:Smithsonian_VOTW_Holocene_Volcanoes', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'outputFormat', value: 'application/json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'maxFeatures', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(100)', 'min(1)', 'max(2000)'] } }
            ],
            tests: [
                { _description: 'Get first 50 Holocene volcanoes', maxFeatures: 50 },
                { _description: 'Get 200 Holocene volcanoes', maxFeatures: 200 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        type: { type: 'string', description: 'FeatureCollection' },
                        totalFeatures: { type: 'number', description: 'Total number of matching features' },
                        features: {
                            type: 'array',
                            description: 'Array of volcano GeoJSON features',
                            items: {
                                type: 'object',
                                properties: {
                                    type: { type: 'string' },
                                    geometry: { type: 'object', properties: { type: { type: 'string' }, coordinates: { type: 'array', items: { type: 'number' } } } },
                                    properties: {
                                        type: 'object',
                                        properties: {
                                            Volcano_Name: { type: 'string', description: 'Name of the volcano' },
                                            Volcano_Number: { type: 'number', description: 'GVP volcano number' },
                                            Country: { type: 'string', description: 'Country where the volcano is located' },
                                            Primary_Volcano_Type: { type: 'string', description: 'Volcano type (Stratovolcano, Shield, etc.)' },
                                            Elevation: { type: 'number', description: 'Summit elevation in meters' },
                                            Region: { type: 'string', description: 'Geographic region' },
                                            Last_Eruption_Year: { type: 'string', description: 'Year of last known eruption' },
                                            Tectonic_Setting: { type: 'string', description: 'Tectonic environment' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        getPleistoceneVolcanoes: {
            method: 'GET',
            path: '/geoserver/GVP-VOTW/ows',
            description: 'Get Pleistocene volcanoes (active between 2.6 million and 11,700 years ago) from the Smithsonian database. Returns GeoJSON features with volcano details.',
            parameters: [
                { position: { key: 'service', value: 'WFS', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'version', value: '1.0.0', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'request', value: 'GetFeature', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'typeName', value: 'GVP-VOTW:Smithsonian_VOTW_Pleistocene_Volcanoes', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'outputFormat', value: 'application/json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'maxFeatures', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(100)', 'min(1)', 'max(2000)'] } }
            ],
            tests: [
                { _description: 'Get first 50 Pleistocene volcanoes', maxFeatures: 50 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        type: { type: 'string' },
                        totalFeatures: { type: 'number' },
                        features: { type: 'array', items: { type: 'object' } }
                    }
                }
            }
        },
        getHoloceneEruptions: {
            method: 'GET',
            path: '/geoserver/GVP-VOTW/ows',
            description: 'Get Holocene eruption records from the Smithsonian database. Returns eruption events with dates, VEI (Volcanic Explosivity Index), and associated volcano data.',
            parameters: [
                { position: { key: 'service', value: 'WFS', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'version', value: '1.0.0', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'request', value: 'GetFeature', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'typeName', value: 'GVP-VOTW:Smithsonian_VOTW_Holocene_Eruptions', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'outputFormat', value: 'application/json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'maxFeatures', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(100)', 'min(1)', 'max(2000)'] } }
            ],
            tests: [
                { _description: 'Get first 50 Holocene eruptions', maxFeatures: 50 },
                { _description: 'Get 200 Holocene eruption records', maxFeatures: 200 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        type: { type: 'string' },
                        totalFeatures: { type: 'number' },
                        features: {
                            type: 'array',
                            description: 'Array of eruption GeoJSON features',
                            items: {
                                type: 'object',
                                properties: {
                                    type: { type: 'string' },
                                    geometry: { type: 'object' },
                                    properties: {
                                        type: 'object',
                                        properties: {
                                            Volcano_Name: { type: 'string', description: 'Name of the volcano' },
                                            Volcano_Number: { type: 'number', description: 'GVP volcano number' },
                                            Eruption_Number: { type: 'number', description: 'Unique eruption identifier' },
                                            VEI: { type: 'number', description: 'Volcanic Explosivity Index (0-8)' },
                                            Start_Year: { type: 'number', description: 'Eruption start year' },
                                            End_Year: { type: 'number', description: 'Eruption end year' },
                                            Eruption_Category: { type: 'string', description: 'Eruption category (Confirmed, Uncertain)' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        getRecentEruptions: {
            method: 'GET',
            path: '/geoserver/GVP-VOTW/ows',
            description: 'Get eruptions since 1960 from the E3 WebApp layer. Focused dataset of recent volcanic activity with emissions and monitoring data.',
            parameters: [
                { position: { key: 'service', value: 'WFS', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'version', value: '1.0.0', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'request', value: 'GetFeature', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'typeName', value: 'GVP-VOTW:E3WebApp_Eruptions1960', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'outputFormat', value: 'application/json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'maxFeatures', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(100)', 'min(1)', 'max(2000)'] } }
            ],
            tests: [
                { _description: 'Get 50 eruptions since 1960', maxFeatures: 50 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        type: { type: 'string' },
                        totalFeatures: { type: 'number' },
                        features: { type: 'array', items: { type: 'object' } }
                    }
                }
            }
        }
    }
}
