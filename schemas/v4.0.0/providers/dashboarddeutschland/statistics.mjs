// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean
// Namespace: "dashboardDeutschland" -> "dashboarddeutschland"

export const main = {
    namespace: 'dashboarddeutschland',
    name: 'Dashboard Deutschland API',
    description: 'DESTATIS Dashboard Deutschland providing German economic indicators, labour market data, energy statistics, trade figures, and financial market data',
    version: '4.0.0',
    docs: ['https://bundesapi.github.io/dashboard-deutschland-api/'],
    tags: ['statistics', 'germany', 'economy', 'destatis', 'cacheTtlDaily'],
    root: 'https://www.dashboard-deutschland.de',
    tools: {
        getDashboards: {
            method: 'GET',
            path: '/api/dashboard/get',
            description: 'Get all available dashboards with their categories and tile layouts. Returns dashboard name, description, and tile IDs for use with getIndicator.',
            parameters: [],
            tests: [
                { _description: 'Get all dashboards' },
                { _description: 'List available dashboard categories' },
                { _description: 'Fetch dashboard tile layouts' }
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
                            nameEn: { type: 'string' },
                            description: { type: 'string' },
                            descriptionEn: { type: 'string' },
                            teaser: { type: 'string', nullable: true },
                            teaserEn: { type: 'string', nullable: true },
                            conclusion: { type: 'string', nullable: true },
                            conclusionEn: { type: 'string', nullable: true },
                            category: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, nameEn: { type: 'string' }, description: { type: 'string' }, descriptionEn: { type: 'string' }, icon: { type: 'string' }, viewBox: { type: 'string' }, iconType: { type: 'string' }, color: { type: 'string', nullable: true }, catIndex: { type: 'number' }, image: { type: 'string', nullable: true }, alt: { type: 'string' }, isNewFlag: { type: 'boolean' }, hasAnalysis: { type: 'boolean', nullable: true } } },
                            tags: { type: 'array', items: { type: 'string' } },
                            image: { type: 'string', nullable: true },
                            clicks: { type: 'number' },
                            orderId: { type: 'number' },
                            trending: { type: 'boolean' },
                            top: { type: 'boolean' },
                            layoutTiles: { type: 'array', items: { type: 'object' } },
                            layoutMode: { type: 'string' }
                        }
                    }
                }
            },
        },
        getIndicator: {
            method: 'GET',
            path: '/api/tile/indicators',
            description: 'Get statistical indicator data by tile ID. Use tile IDs from getDashboards or known IDs like tile_1667811574092 (GDP), tile_1667460685909 (retail), tile_1666960424161 (Baltic Dry Index).',
            parameters: [
                { position: { key: 'ids', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] }, description: 'Tile ID from getDashboards, e.g. tile_1667811574092 for GDP indicator' }
            ],
            tests: [
                { _description: 'Get GDP indicator', ids: 'tile_1667811574092' },
                { _description: 'Get oil price indicator', ids: 'tile_1667995478843' },
                { _description: 'Get retail indicator', ids: 'tile_1667460685909' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            date: { type: 'number' },
                            json: { type: 'string' },
                            title: { type: 'string' }
                        }
                    }
                }
            },
        },
        getGeoData: {
            method: 'GET',
            path: '/geojson/de-all.geo.json',
            description: 'Get GeoJSON data of all German federal states for mapping via dashboardDeutschland.',
            parameters: [],
            tests: [
                { _description: 'Get Germany GeoJSON' },
                { _description: 'Fetch German federal states map data' },
                { _description: 'Get GeoJSON boundaries for Germany' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        type: { type: 'string' },
                        name: { type: 'string' },
                        title: { type: 'string' },
                        version: { type: 'string' },
                        copyrightShort: { type: 'string' },
                        copyrightUrl: { type: 'string' },
                        crs: { type: 'object', properties: { type: { type: 'string' }, properties: { type: 'object', properties: { name: { type: 'string' } } } } },
                        features: { type: 'array', items: { type: 'object', properties: { type: { type: 'string' }, properties: { type: 'object' }, geometry: { type: 'object' } } } }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getDashboards: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !Array.isArray( raw ) ) { return { response }}

            const dashboards = raw
            .map( ( d ) => {
            const tiles = ( d.layoutTiles || [] )
            .map( ( t ) => {
            const result = { id: t.id }

            return result
            } )

            return {
            id: d.id,
            name: d.name,
            nameEn: d.nameEn || null,
            description: d.description || null,
            tileCount: tiles.length,
            tileIds: tiles
            }
            } )

            response = {
            dashboardCount: dashboards.length,
            dashboards
            }

            return { response }
        }
    },
    getIndicator: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !Array.isArray( raw ) ) { return { response }}

            const indicators = raw
            .map( ( item ) => {
            const result = {
            id: item.id,
            title: item.title || null,
            date: item.date || null
            }

            return result
            } )

            response = {
            indicatorCount: indicators.length,
            indicators
            }

            return { response }
        }
    },
    getGeoData: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.features ) { return { response }}

            const states = raw.features
            .map( ( f ) => {
            const result = {
            name: f.properties?.name || null,
            id: f.properties?.id || null
            }

            return result
            } )

            response = {
            type: raw.type,
            stateCount: states.length,
            states
            }

            return { response }
        }
    }
} )
