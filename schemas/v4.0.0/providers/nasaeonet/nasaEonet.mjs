export const main = {
    namespace: 'nasaeonet',
    name: 'NASA EONET',
    description: 'NASA Earth Observatory Natural Event Tracker (EONET). Tracks natural events worldwide including wildfires, severe storms, volcanoes, earthquakes, floods, sea ice, and more. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://eonet.gsfc.nasa.gov/docs/v3'],
    tags: ['nasa', 'environment', 'disasters', 'geospatial', 'cacheTtlFrequent'],
    root: 'https://eonet.gsfc.nasa.gov/api/v3',
    requiredServerParams: [],
    headers: {},
    tools: {
        getEvents: {
            method: 'GET',
            path: '/events',
            description: 'Get natural events worldwide. Filter by status (open/closed), category, date range, source, and limit. Returns event geometry (points/polygons) and metadata. Use getCategories to find valid category IDs. Use getSources to discover contributing data sources.',
            parameters: [
                { position: { key: 'limit', value: '{{LIMIT}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(100)'] } },
                { position: { key: 'status', value: '{{STATUS}}', location: 'query' }, z: { primitive: 'enum(open,closed)', options: ['optional()'] } },
                { position: { key: 'category', value: '{{CATEGORY}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'source', value: '{{SOURCE}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'start', value: '{{START_DATE}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'end', value: '{{END_DATE}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'days', value: '{{DAYS}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get 5 currently open events', LIMIT: '5', STATUS: 'open' },
                { _description: 'Get wildfire events from last 7 days', CATEGORY: 'wildfires', DAYS: '7', LIMIT: '5' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'EONET event collection with metadata',
                    properties: {
                        title: { type: 'string', description: 'Collection title (e.g. EONET Events)' },
                        description: { type: 'string', description: 'Collection description from EONET' },
                        events: {
                            type: 'array',
                            description: 'Array of natural event records',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string', description: 'Unique EONET event identifier (e.g. EONET_6690)' },
                                    title: { type: 'string', description: 'Human-readable event title (e.g. Wildfire - California)' },
                                    categories: { type: 'array', description: 'Event category classifications (e.g. wildfires, severeStorms)', items: { type: 'object' } },
                                    sources: { type: 'array', description: 'Data sources reporting this event (e.g. InciWeb, GDACS)', items: { type: 'object' } },
                                    geometry: { type: 'array', description: 'Time-series of geographic coordinates tracking the event over time', items: { type: 'object' } }
                                }
                            }
                        }
                    }
                }
            }
        },
        getEventById: {
            method: 'GET',
            path: '/events/:eventId',
            description: 'Get a single natural event by its EONET ID (e.g. EONET_6690). Returns full event details including all geometry points over time, categories, and source references. Use event IDs from getEvents or getEventsByCategory.',
            parameters: [
                { position: { key: 'eventId', value: '{{EVENT_ID}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get a specific wildfire event', EVENT_ID: 'EONET_6690' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Full details of a single EONET natural event',
                    properties: {
                        id: { type: 'string', description: 'Unique EONET event identifier' },
                        title: { type: 'string', description: 'Human-readable event title' },
                        categories: { type: 'array', description: 'Event category classifications', items: { type: 'object' } },
                        sources: { type: 'array', description: 'Data sources that reported this event with URLs', items: { type: 'object' } },
                        geometry: { type: 'array', description: 'Time-series of geographic coordinates tracking the event progression', items: { type: 'object' } }
                    }
                }
            }
        },
        getCategories: {
            method: 'GET',
            path: '/categories',
            description: 'List all available EONET event categories (e.g., wildfires, severe storms, volcanoes, earthquakes, floods, sea/lake ice, drought). Use category IDs as filter values in getEvents and getEventsByCategory.',
            parameters: [],
            tests: [
                { _description: 'List all event categories' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Collection of all EONET event categories',
                    properties: {
                        title: { type: 'string', description: 'Collection title' },
                        categories: {
                            type: 'array',
                            description: 'Array of event category definitions',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string', description: 'Category identifier used as filter in getEvents (e.g. wildfires, severeStorms)' },
                                    title: { type: 'string', description: 'Human-readable category name (e.g. Wildfires, Severe Storms)' }
                                }
                            }
                        }
                    }
                }
            }
        },
        getEventsByCategory: {
            method: 'GET',
            path: '/categories/:categoryId',
            description: 'Get all events for a specific category (e.g., wildfires, severeStorms, volcanoes). Supports the same filters as getEvents. Use getCategories to find valid category IDs.',
            parameters: [
                { position: { key: 'categoryId', value: '{{CATEGORY_ID}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'limit', value: '{{LIMIT}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(100)'] } },
                { position: { key: 'status', value: '{{STATUS}}', location: 'query' }, z: { primitive: 'enum(open,closed)', options: ['optional()'] } },
                { position: { key: 'days', value: '{{DAYS}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get recent volcano events', CATEGORY_ID: 'volcanoes', LIMIT: '5' },
                { _description: 'Get severe storms from last 30 days', CATEGORY_ID: 'severeStorms', DAYS: '30', LIMIT: '5' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Events filtered by a single EONET category',
                    properties: {
                        title: { type: 'string', description: 'Category title (e.g. EONET Events: Wildfires)' },
                        events: { type: 'array', description: 'Array of natural event records for this category', items: { type: 'object' } }
                    }
                }
            }
        },
        getSources: {
            method: 'GET',
            path: '/sources',
            description: 'List all data sources that contribute events to EONET (NASA, USGS, GDACS, NOAA, etc.). Use source IDs as filter values in getEvents.',
            parameters: [],
            tests: [
                { _description: 'List all EONET data sources' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Collection of all EONET data source organizations',
                    properties: {
                        title: { type: 'string', description: 'Collection title' },
                        sources: {
                            type: 'array',
                            description: 'Array of data source organizations contributing to EONET',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string', description: 'Source identifier used as filter in getEvents (e.g. InciWeb, GDACS)' },
                                    title: { type: 'string', description: 'Full name of the data source organization' },
                                    source: { type: 'string', description: 'URL to the data source homepage' },
                                    link: { type: 'string', description: 'EONET API link to events from this source' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
