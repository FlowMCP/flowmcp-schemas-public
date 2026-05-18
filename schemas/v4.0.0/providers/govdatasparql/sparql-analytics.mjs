// GovData.de SPARQL Analytics — Aggregations over 177k+ DCAT-AP.de datasets
// Category: handlers-clean
// No API key required — public SPARQL endpoint

export const main = {
    namespace: 'govdatasparql',
    name: 'GovData.de SPARQL Analytics',
    description: 'Aggregate analytics over the German open data catalog via SPARQL — theme statistics, top publishers, format distribution, keyword trends, and recent datasets from 177k+ DCAT-AP.de entries',
    version: '4.0.0',
    docs: ['https://www.govdata.de/sparql', 'https://www.dcat-ap.de/def/'],
    tags: ['government', 'opendata', 'germany', 'sparql', 'analytics', 'cacheTtlDaily'],
    root: 'https://www.govdata.de',
    tools: {
        getCatalogOverview: {
            method: 'GET',
            path: '/sparql',
            description: 'Get full catalog statistics — total dataset count and breakdown by EU data theme (DCAT-AP). No parameters required. Use searchByTheme for related data. Use getRecentDatasets for related data.',
            parameters: [],
            tests: [
                {
                    _description: 'Catalog overview statistics'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from getCatalogOverview',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        searchByTheme: {
            method: 'GET',
            path: '/sparql',
            description: 'List datasets for a specific EU data theme code (e.g. ENVI, ECON, HEAL). Returns title, publisher, and last modified date. Use getCatalogOverview for related data. Use getRecentDatasets for related data.',
            parameters: [
                {
                    position: {
                        key: 'theme',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['min(3)', 'max(4)']
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
                        options: ['min(1)', 'max(100)', 'default(20)', 'optional()']
                    }
                },
                {
                    position: {
                        key: 'offset',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['min(0)', 'default(0)', 'optional()']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Environment datasets',
                    theme: 'ENVI',
                    limit: 5
                },
                {
                    _description: 'Economy datasets',
                    theme: 'ECON',
                    limit: 5
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from searchByTheme',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        getRecentDatasets: {
            method: 'GET',
            path: '/sparql',
            description: 'List recently modified or added datasets within a time window. Returns title, publisher, and modification date sorted newest first. Use getCatalogOverview for related data. Use searchByTheme for related data.',
            parameters: [
                {
                    position: {
                        key: 'days',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['min(1)', 'max(365)', 'default(30)', 'optional()']
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
                        options: ['min(1)', 'max(100)', 'default(20)', 'optional()']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Last 7 days',
                    days: 7,
                    limit: 5
                },
                {
                    _description: 'Additional test for getRecentDatasets',
                    days: 1
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from getRecentDatasets',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        getFormatDistribution: {
            method: 'GET',
            path: '/sparql',
            description: 'Distribution of resource file formats (CSV, JSON, XML, PDF, etc.) across all datasets, sorted by count descending. Use getCatalogOverview for related data. Use searchByTheme for related data.',
            parameters: [
                {
                    position: {
                        key: 'limit',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['min(1)', 'max(50)', 'default(20)', 'optional()']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Top 10 formats',
                    limit: 10
                },
                {
                    _description: 'Top 5 formats',
                    limit: 5
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from getFormatDistribution',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        getTopPublishers: {
            method: 'GET',
            path: '/sparql',
            description: 'Top publishers/organizations ranked by number of datasets they provide. Use getCatalogOverview for related data. Use searchByTheme for related data.',
            parameters: [
                {
                    position: {
                        key: 'limit',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['min(1)', 'max(100)', 'default(20)', 'optional()']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Top 10 publishers',
                    limit: 10
                },
                {
                    _description: 'Top 5 publishers',
                    limit: 5
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from getTopPublishers',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        getTopKeywords: {
            method: 'GET',
            path: '/sparql',
            description: 'Most frequently used keywords/tags across all datasets, sorted by occurrence count. Use getCatalogOverview for related data. Use searchByTheme for related data.',
            parameters: [
                {
                    position: {
                        key: 'limit',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['min(1)', 'max(100)', 'default(30)', 'optional()']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Top 20 keywords',
                    limit: 20
                },
                {
                    _description: 'Top 5 keywords',
                    limit: 5
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from getTopKeywords',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        getDatasetsByPublisher: {
            method: 'GET',
            path: '/sparql',
            description: 'Search datasets by publisher name (substring match). Returns title, modification date, and theme. Use getCatalogOverview for related data. Use searchByTheme for related data.',
            parameters: [
                {
                    position: {
                        key: 'publisher',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['min(2)']
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
                        options: ['min(1)', 'max(100)', 'default(20)', 'optional()']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Datasets from Statistisches Bundesamt',
                    publisher: 'Statistisches Bundesamt',
                    limit: 5
                },
                {
                    _description: 'Datasets from Bundesamt fuer Kartographie',
                    publisher: 'Bundesamt',
                    limit: 5
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from getDatasetsByPublisher',
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
    const SPARQL_ENDPOINT = 'https://www.govdata.de/sparql'

    const THEME_MAP = {
        'AGRI': 'Agriculture, fisheries, forestry and food',
        'ECON': 'Economy and finance',
        'EDUC': 'Education, culture and sport',
        'ENER': 'Energy',
        'ENVI': 'Environment',
        'GOVE': 'Government and public sector',
        'HEAL': 'Health',
        'INTR': 'International issues',
        'JUST': 'Justice, legal system and public safety',
        'REGI': 'Regions and cities',
        'SOCI': 'Population and society',
        'TECH': 'Science and technology',
        'TRAN': 'Transport'
    }

    const THEME_URI_BASE = 'http://publications.europa.eu/resource/authority/data-theme/'

    const sanitizeSparql = ( { input } ) => {
        const cleaned = input.replace( /["\\]/g, '' ).substring( 0, 200 )

        return cleaned
    }

    const executeSparql = async ( { query } ) => {
        const url = `${SPARQL_ENDPOINT}?query=${encodeURIComponent( query )}`
        const response = await fetch( url, {
            headers: { 'Accept': 'application/sparql-results+json' }
        } )

        if( !response.ok ) {
            throw new Error( `SPARQL ${response.status}: ${response.statusText}` )
        }

        const data = await response.json()

        return data
    }

    const extractBindings = ( { data } ) => {
        const bindings = data?.results?.bindings || []

        return bindings
    }

    const getBindingValue = ( { binding, key } ) => {
        const value = binding[ key ]?.value || null

        return value
    }

    const extractThemeCode = ( { uri } ) => {
        if( !uri ) { return null }
        const code = uri.replace( THEME_URI_BASE, '' )

        return code
    }

    return {
        getCatalogOverview: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const query = `
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX dct: <http://purl.org/dc/terms/>

SELECT ?theme (COUNT(DISTINCT ?dataset) AS ?count)
WHERE {
    ?dataset a dcat:Dataset .
    OPTIONAL { ?dataset dcat:theme ?theme }
}
GROUP BY ?theme
ORDER BY DESC(?count)
`
                    const data = await executeSparql( { query } )
                    const bindings = extractBindings( { data } )

                    let totalDatasets = 0
                    const themes = []

                    bindings
                        .forEach( ( binding ) => {
                            const themeUri = getBindingValue( { binding, key: 'theme' } )
                            const count = parseInt( getBindingValue( { binding, key: 'count' } ) ) || 0
                            totalDatasets += count

                            if( themeUri && themeUri.startsWith( THEME_URI_BASE ) ) {
                                const code = extractThemeCode( { uri: themeUri } )
                                const name = THEME_MAP[ code ] || code
                                themes.push( { code, name, datasetCount: count } )
                            }
                        } )

                    struct.data = {
                        source: 'GovData SPARQL',
                        totalDatasets,
                        themeCount: themes.length,
                        themes
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error fetching catalog overview: ${error.message}` )
                }

                return { struct }
            }
        },
        searchByTheme: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { userParams } = payload
                    const themeCode = userParams.theme.toUpperCase()

                    if( !THEME_MAP[ themeCode ] ) {
                        throw new Error( `Invalid theme code "${themeCode}". Valid: ${Object.keys( THEME_MAP ).join( ', ' )}` )
                    }

                    const limit = userParams.limit || 20
                    const offset = userParams.offset || 0
                    const themeUri = `${THEME_URI_BASE}${themeCode}`

                    const query = `
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>

SELECT ?dataset ?title ?publisher ?modified
WHERE {
    ?dataset a dcat:Dataset ;
             dcat:theme <${themeUri}> ;
             dct:title ?title .
    OPTIONAL { ?dataset dct:publisher/foaf:name ?publisher }
    OPTIONAL { ?dataset dct:modified ?modified }
    FILTER( LANG(?title) = "de" || LANG(?title) = "" )
}
ORDER BY DESC(?modified)
LIMIT ${limit}
OFFSET ${offset}
`
                    const data = await executeSparql( { query } )
                    const bindings = extractBindings( { data } )

                    const datasets = bindings
                        .map( ( binding ) => {
                            const title = getBindingValue( { binding, key: 'title' } )
                            const publisher = getBindingValue( { binding, key: 'publisher' } )
                            const modified = getBindingValue( { binding, key: 'modified' } )

                            return { title, publisher, modified }
                        } )

                    struct.data = {
                        source: 'GovData SPARQL',
                        theme: { code: themeCode, name: THEME_MAP[ themeCode ] },
                        returnedCount: datasets.length,
                        offset,
                        datasets
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error searching by theme: ${error.message}` )
                }

                return { struct }
            }
        },
        getRecentDatasets: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { userParams } = payload
                    const days = userParams.days || 30
                    const limit = userParams.limit || 20

                    const query = `
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT ?dataset ?title ?publisher ?modified
WHERE {
    ?dataset a dcat:Dataset ;
             dct:title ?title ;
             dct:modified ?modified .
    OPTIONAL { ?dataset dct:publisher/foaf:name ?publisher }
    FILTER( LANG(?title) = "de" || LANG(?title) = "" )
    FILTER( ?modified >= "${new Date( Date.now() - days * 86400000 ).toISOString().split( 'T' )[ 0 ]}"^^xsd:date )
}
ORDER BY DESC(?modified)
LIMIT ${limit}
`
                    const data = await executeSparql( { query } )
                    const bindings = extractBindings( { data } )

                    const datasets = bindings
                        .map( ( binding ) => {
                            const title = getBindingValue( { binding, key: 'title' } )
                            const publisher = getBindingValue( { binding, key: 'publisher' } )
                            const modified = getBindingValue( { binding, key: 'modified' } )

                            return { title, publisher, modified }
                        } )

                    struct.data = {
                        source: 'GovData SPARQL',
                        filter: { days, since: new Date( Date.now() - days * 86400000 ).toISOString().split( 'T' )[ 0 ] },
                        returnedCount: datasets.length,
                        datasets
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error fetching recent datasets: ${error.message}` )
                }

                return { struct }
            }
        },
        getFormatDistribution: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { userParams } = payload
                    const limit = userParams.limit || 20

                    const query = `
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX dct: <http://purl.org/dc/terms/>

SELECT ?format (COUNT(?distribution) AS ?count)
WHERE {
    ?dataset a dcat:Dataset ;
             dcat:distribution ?distribution .
    ?distribution dct:format ?format .
}
GROUP BY ?format
ORDER BY DESC(?count)
LIMIT ${limit}
`
                    const data = await executeSparql( { query } )
                    const bindings = extractBindings( { data } )

                    const formats = bindings
                        .map( ( binding ) => {
                            const format = getBindingValue( { binding, key: 'format' } )
                            const count = parseInt( getBindingValue( { binding, key: 'count' } ) ) || 0
                            const label = format
                                ? format.replace( /^.*\//, '' ).replace( /^.*#/, '' )
                                : 'unknown'

                            return { format: label, uri: format, distributionCount: count }
                        } )

                    const totalDistributions = formats
                        .reduce( ( acc, f ) => acc + f.distributionCount, 0 )

                    struct.data = {
                        source: 'GovData SPARQL',
                        totalDistributions,
                        formatCount: formats.length,
                        formats
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error fetching format distribution: ${error.message}` )
                }

                return { struct }
            }
        },
        getTopPublishers: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { userParams } = payload
                    const limit = userParams.limit || 20

                    const query = `
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>

SELECT ?publisherName (COUNT(DISTINCT ?dataset) AS ?count)
WHERE {
    ?dataset a dcat:Dataset ;
             dct:publisher ?publisher .
    ?publisher foaf:name ?publisherName .
}
GROUP BY ?publisherName
ORDER BY DESC(?count)
LIMIT ${limit}
`
                    const data = await executeSparql( { query } )
                    const bindings = extractBindings( { data } )

                    const publishers = bindings
                        .map( ( binding ) => {
                            const name = getBindingValue( { binding, key: 'publisherName' } )
                            const count = parseInt( getBindingValue( { binding, key: 'count' } ) ) || 0

                            return { name, datasetCount: count }
                        } )

                    struct.data = {
                        source: 'GovData SPARQL',
                        publisherCount: publishers.length,
                        publishers
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error fetching top publishers: ${error.message}` )
                }

                return { struct }
            }
        },
        getTopKeywords: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { userParams } = payload
                    const limit = userParams.limit || 30

                    const query = `
PREFIX dcat: <http://www.w3.org/ns/dcat#>

SELECT ?keyword (COUNT(DISTINCT ?dataset) AS ?count)
WHERE {
    ?dataset a dcat:Dataset ;
             dcat:keyword ?keyword .
}
GROUP BY ?keyword
ORDER BY DESC(?count)
LIMIT ${limit}
`
                    const data = await executeSparql( { query } )
                    const bindings = extractBindings( { data } )

                    const keywords = bindings
                        .map( ( binding ) => {
                            const keyword = getBindingValue( { binding, key: 'keyword' } )
                            const count = parseInt( getBindingValue( { binding, key: 'count' } ) ) || 0

                            return { keyword, datasetCount: count }
                        } )

                    struct.data = {
                        source: 'GovData SPARQL',
                        keywordCount: keywords.length,
                        keywords
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error fetching top keywords: ${error.message}` )
                }

                return { struct }
            }
        },
        getDatasetsByPublisher: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { userParams } = payload
                    const publisher = sanitizeSparql( { input: userParams.publisher } )
                    const limit = userParams.limit || 20

                    const query = `
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>

SELECT ?dataset ?title ?publisherName ?modified ?theme
WHERE {
    ?dataset a dcat:Dataset ;
             dct:title ?title ;
             dct:publisher ?pub .
    ?pub foaf:name ?publisherName .
    OPTIONAL { ?dataset dct:modified ?modified }
    OPTIONAL { ?dataset dcat:theme ?theme }
    FILTER( CONTAINS( LCASE(?publisherName), LCASE("${publisher}") ) )
    FILTER( LANG(?title) = "de" || LANG(?title) = "" )
}
ORDER BY DESC(?modified)
LIMIT ${limit}
`
                    const data = await executeSparql( { query } )
                    const bindings = extractBindings( { data } )

                    const datasets = bindings
                        .map( ( binding ) => {
                            const title = getBindingValue( { binding, key: 'title' } )
                            const publisherName = getBindingValue( { binding, key: 'publisherName' } )
                            const modified = getBindingValue( { binding, key: 'modified' } )
                            const themeUri = getBindingValue( { binding, key: 'theme' } )
                            const themeCode = extractThemeCode( { uri: themeUri } )
                            const themeName = themeCode ? ( THEME_MAP[ themeCode ] || themeCode ) : null

                            return { title, publisher: publisherName, modified, theme: themeName }
                        } )

                    struct.data = {
                        source: 'GovData SPARQL',
                        filter: { publisher },
                        returnedCount: datasets.length,
                        datasets
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error searching by publisher: ${error.message}` )
                }

                return { struct }
            }
        }
    }
}
