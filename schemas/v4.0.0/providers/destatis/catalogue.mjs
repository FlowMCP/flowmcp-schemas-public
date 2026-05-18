// DESTATIS GENESIS API — Search, Browse & Metadata
// Category: handlers-clean
// Note: All endpoints use POST with form-encoded body + username/password headers.
// Auth credential (STATISTISCHES_BUNDESAMT) is used as both username and password.
// search and getQualitySigns work without auth (GAST defaults).
// executeRequest handlers receive userParams via payload.userParams (not payload directly).

export const main = {
    namespace: 'destatis',
    name: 'DESTATIS Catalogue',
    description: 'Search and browse German federal statistics from DESTATIS GENESIS database — tables, statistics, variables, and metadata',
    version: '4.0.0',
    docs: [
        'https://destatis.api.bund.dev/',
        'https://www-genesis.destatis.de/genesisWS/rest/2020/application.wadl'
    ],
    tags: ['statistics', 'germany', 'government', 'opendata', 'destatis'],
    root: 'https://www-genesis.destatis.de/genesisWS/rest/2020',
    tools: {
        search: {
            method: 'POST',
            path: '/find/find',
            description: 'Universal search across all DESTATIS data — returns matching statistics, tables, variables, and timeseries. Works without authentication (guest access). Use listTables for related data. Use listStatistics for related data.',
            parameters: [
                {
                    position: {
                        key: 'term',
                        value: '{{USER_PARAM}}',
                        location: 'body'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['min(2)']
                    }
                },
                {
                    position: {
                        key: 'category',
                        value: '{{USER_PARAM}}',
                        location: 'body'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['default("all")', 'optional()']
                    }
                },
                {
                    position: {
                        key: 'pagelength',
                        value: '{{USER_PARAM}}',
                        location: 'body'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['min(1)', 'max(500)', 'default(100)', 'optional()']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Search for population data',
                    term: 'Bevoelkerung'
                },
                {
                    _description: 'Search for table 12411',
                    term: '12411',
                    pagelength: 5
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from search',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        listTables: {
            method: 'POST',
            path: '/catalogue/tables',
            description: 'Browse available tables by code pattern (e.g. "12411*" for population tables). Requires authentication. Use search for related data. Use listStatistics for related data.',
            parameters: [
                {
                    position: {
                        key: 'selection',
                        value: '{{USER_PARAM}}',
                        location: 'body'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['min(1)']
                    }
                },
                {
                    position: {
                        key: 'pagelength',
                        value: '{{USER_PARAM}}',
                        location: 'body'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['min(1)', 'max(500)', 'default(100)', 'optional()']
                    }
                },
                {
                    position: {
                        key: 'area',
                        value: '{{USER_PARAM}}',
                        location: 'body'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['default("free")', 'optional()']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Population tables',
                    selection: '12411*',
                    pagelength: 5
                },
                {
                    _description: 'All tables starting with 1',
                    selection: '1*',
                    pagelength: 10
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from listTables',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        listStatistics: {
            method: 'POST',
            path: '/catalogue/statistics',
            description: 'Browse available statistics by code pattern (e.g. "124*" for population statistics). Requires authentication. Use search for related data. Use listTables for related data.',
            parameters: [
                {
                    position: {
                        key: 'selection',
                        value: '{{USER_PARAM}}',
                        location: 'body'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['default("*")', 'optional()']
                    }
                },
                {
                    position: {
                        key: 'pagelength',
                        value: '{{USER_PARAM}}',
                        location: 'body'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['min(1)', 'max(500)', 'default(100)', 'optional()']
                    }
                },
                {
                    position: {
                        key: 'area',
                        value: '{{USER_PARAM}}',
                        location: 'body'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['default("free")', 'optional()']
                    }
                }
            ],
            tests: [
                {
                    _description: 'All statistics',
                    selection: '*',
                    pagelength: 5
                },
                {
                    _description: 'Additional test for listStatistics',
                    selection: 'test'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from listStatistics',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        getTableMetadata: {
            method: 'POST',
            path: '/metadata/table',
            description: 'Get detailed metadata for a specific table (description, variables, time range). Requires authentication. Use search for related data. Use listTables for related data.',
            parameters: [
                {
                    position: {
                        key: 'name',
                        value: '{{USER_PARAM}}',
                        location: 'body'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['min(1)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Population table metadata',
                    name: '12411-0001'
                },
                {
                    _description: 'Additional test for getTableMetadata',
                    name: '12411-0001 alt'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from getTableMetadata',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        getStatisticMetadata: {
            method: 'POST',
            path: '/metadata/statistic',
            description: 'Get detailed metadata for a specific statistic (description, tables, variables). Requires authentication. Use search for related data. Use listTables for related data.',
            parameters: [
                {
                    position: {
                        key: 'name',
                        value: '{{USER_PARAM}}',
                        location: 'body'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['min(1)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Population statistic metadata',
                    name: '12411'
                },
                {
                    _description: 'Additional test for getStatisticMetadata',
                    name: '12411 alt'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from getStatisticMetadata',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        getQualitySigns: {
            method: 'GET',
            path: '/catalogue/qualitysigns',
            description: 'Reference data for quality signs used in statistical tables (e.g. "/" = confidential, "..." = not yet available). Works without authentication. Use search for related data. Use listTables for related data.',
            parameters: [],
            tests: [
                {
                    _description: 'Quality signs reference'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from getQualitySigns',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        }
    }
}

export const handlers = ( { sharedLists, libraries } ) => {
    const genesisPost = async ( { url, params, credential } ) => {
        const username = credential || 'GAST'
        const password = credential || 'GAST'

        const body = Object.entries( params )
            .filter( ( [ , v ] ) => v !== undefined && v !== null && v !== '' )
            .map( ( [ k, v ] ) => `${encodeURIComponent( k )}=${encodeURIComponent( v )}` )
            .join( '&' )

        const response = await fetch( url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'username': username,
                'password': password
            },
            body
        } )

        if( !response.ok ) {
            throw new Error( `HTTP ${response.status}: ${response.statusText}` )
        }

        const data = await response.json()

        if( data.Status?.Code !== 0 && data.Code ) {
            throw new Error( `GENESIS ${data.Code}: ${data.Content}` )
        }

        return data
    }

    const cleanResponse = ( { raw } ) => {
        const { Ident, Status, Copyright, ...rest } = raw
        const result = {
            service: Ident?.Service || null,
            method: Ident?.Method || null,
            statusCode: Status?.Code ?? null,
            statusMessage: Status?.Content || null,
            copyright: Copyright || null,
            ...rest
        }

        delete result.Parameter

        return result
    }

    return {
        search: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { userParams, serverParams } = payload
                    const credential = serverParams?.STATISTISCHES_BUNDESAMT || null

                    const raw = await genesisPost( {
                        url: 'https://www-genesis.destatis.de/genesisWS/rest/2020/find/find',
                        params: {
                            term: userParams.term,
                            category: userParams.category || 'all',
                            pagelength: String( userParams.pagelength || 100 ),
                            language: 'de'
                        },
                        credential
                    } )

                    const cleaned = cleanResponse( { raw } )
                    const statistics = ( cleaned.Statistics || [] )
                        .map( ( s ) => ( { code: s.Code, name: s.Content, cubes: parseInt( s.Cubes ) || 0 } ) )
                    const tables = ( cleaned.Tables || [] )
                        .map( ( t ) => ( { code: t.Code, name: t.Content } ) )
                    const variables = ( cleaned.Variables || [] )
                        .map( ( v ) => ( { code: v.Code, name: v.Content, type: v.Type } ) )

                    struct.data = {
                        source: 'DESTATIS GENESIS',
                        query: { term: userParams.term, category: userParams.category || 'all' },
                        statisticsCount: statistics.length,
                        tablesCount: tables.length,
                        variablesCount: variables.length,
                        statistics,
                        tables,
                        variables,
                        copyright: cleaned.copyright
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error searching DESTATIS: ${error.message}` )
                }

                return { struct }
            }
        },
        listTables: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { userParams, serverParams } = payload
                    const credential = serverParams?.STATISTISCHES_BUNDESAMT || null

                    if( !credential ) {
                        throw new Error( 'STATISTISCHES_BUNDESAMT credential required for catalogue access' )
                    }

                    const raw = await genesisPost( {
                        url: 'https://www-genesis.destatis.de/genesisWS/rest/2020/catalogue/tables',
                        params: {
                            selection: userParams.selection,
                            pagelength: String( userParams.pagelength || 100 ),
                            area: userParams.area || 'free',
                            language: 'de'
                        },
                        credential
                    } )

                    const cleaned = cleanResponse( { raw } )
                    const tables = ( cleaned.List || [] )
                        .map( ( t ) => ( { code: t.Code, name: t.Content, time: t.Time || null } ) )

                    struct.data = {
                        source: 'DESTATIS GENESIS',
                        filter: { selection: userParams.selection },
                        tableCount: tables.length,
                        tables,
                        copyright: cleaned.copyright
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error listing tables: ${error.message}` )
                }

                return { struct }
            }
        },
        listStatistics: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { userParams, serverParams } = payload
                    const credential = serverParams?.STATISTISCHES_BUNDESAMT || null

                    if( !credential ) {
                        throw new Error( 'STATISTISCHES_BUNDESAMT credential required for catalogue access' )
                    }

                    const raw = await genesisPost( {
                        url: 'https://www-genesis.destatis.de/genesisWS/rest/2020/catalogue/statistics',
                        params: {
                            selection: userParams.selection || '*',
                            pagelength: String( userParams.pagelength || 100 ),
                            area: userParams.area || 'free',
                            language: 'de'
                        },
                        credential
                    } )

                    const cleaned = cleanResponse( { raw } )
                    const statistics = ( cleaned.List || [] )
                        .map( ( s ) => ( { code: s.Code, name: s.Content, cubes: parseInt( s.Cubes ) || 0 } ) )

                    struct.data = {
                        source: 'DESTATIS GENESIS',
                        filter: { selection: userParams.selection || '*' },
                        statisticCount: statistics.length,
                        statistics,
                        copyright: cleaned.copyright
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error listing statistics: ${error.message}` )
                }

                return { struct }
            }
        },
        getTableMetadata: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { userParams, serverParams } = payload
                    const credential = serverParams?.STATISTISCHES_BUNDESAMT || null

                    if( !credential ) {
                        throw new Error( 'STATISTISCHES_BUNDESAMT credential required for metadata access' )
                    }

                    const raw = await genesisPost( {
                        url: 'https://www-genesis.destatis.de/genesisWS/rest/2020/metadata/table',
                        params: {
                            name: userParams.name,
                            language: 'de'
                        },
                        credential
                    } )

                    const cleaned = cleanResponse( { raw } )
                    const obj = cleaned.Object || {}
                    const variables = ( obj.Variables || [] )
                        .map( ( v ) => ( { code: v.Code, name: v.Content, type: v.Type, values: parseInt( v.Values ) || 0 } ) )

                    struct.data = {
                        source: 'DESTATIS GENESIS',
                        query: { name: userParams.name },
                        table: {
                            code: obj.Code || null,
                            name: obj.Content || null,
                            time: obj.Time || null,
                            updated: obj.Updated || null
                        },
                        variableCount: variables.length,
                        variables,
                        copyright: cleaned.copyright
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error fetching table metadata: ${error.message}` )
                }

                return { struct }
            }
        },
        getStatisticMetadata: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { userParams, serverParams } = payload
                    const credential = serverParams?.STATISTISCHES_BUNDESAMT || null

                    if( !credential ) {
                        throw new Error( 'STATISTISCHES_BUNDESAMT credential required for metadata access' )
                    }

                    const raw = await genesisPost( {
                        url: 'https://www-genesis.destatis.de/genesisWS/rest/2020/metadata/statistic',
                        params: {
                            name: userParams.name,
                            language: 'de'
                        },
                        credential
                    } )

                    const cleaned = cleanResponse( { raw } )
                    const obj = cleaned.Object || {}
                    const frequencies = ( Array.isArray( obj.Frequency ) ? obj.Frequency : [] )
                        .map( ( f ) => ( { from: f.From || null, to: f.To || null, type: f.Type || null } ) )

                    struct.data = {
                        source: 'DESTATIS GENESIS',
                        query: { name: userParams.name },
                        statistic: {
                            code: obj.Code || null,
                            name: obj.Content || null,
                            cubeCount: parseInt( obj.Cubes ) || null,
                            variableCount: parseInt( obj.Variables ) || null,
                            updated: obj.Updated || null
                        },
                        frequencies,
                        information: obj.Information || null,
                        copyright: cleaned.copyright
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error fetching statistic metadata: ${error.message}` )
                }

                return { struct }
            }
        },
        getQualitySigns: {
            postRequest: async ( { response } ) => {
                if( !response?.List ) { return { response } }

                const signs = response.List
                    .map( ( s ) => ( { symbol: s.Code, meaning: s.Content } ) )

                const result = {
                    source: 'DESTATIS GENESIS',
                    signCount: signs.length,
                    signs,
                    copyright: response.Copyright || null
                }

                return { response: result }
            }
        }
    }
}
