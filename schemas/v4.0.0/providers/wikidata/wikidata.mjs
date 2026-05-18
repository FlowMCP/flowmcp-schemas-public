export const main = {
    namespace: 'wikidata',
    name: 'Wikidata SPARQL',
    description: 'Query the Wikidata knowledge graph via SPARQL. Access 100M+ structured items covering countries, people, organizations, scientific data, and more. Predefined queries for common lookups plus free-form SPARQL support. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://www.wikidata.org/wiki/Wikidata:SPARQL_query_service', 'https://query.wikidata.org/'],
    tags: ['knowledge', 'linkeddata', 'sparql', 'opendata', 'cacheTtlDaily'],
    root: 'https://query.wikidata.org',
    requiredServerParams: [],
    headers: {
        'User-Agent': 'FlowMCP/2.0 (https://flowmcp.com)',
        'Accept': 'application/sparql-results+json'
    },
    tools: {
        countriesByPopulation: {
            method: 'GET',
            path: '/sparql',
            description: 'List countries ranked by population. Returns country name, Wikidata ID, and population count ordered by population descending.',
            parameters: [
                { position: { key: 'limit', value: '{{LIMIT}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(300)'] } }
            ],
            tests: [
                { _description: 'Top 10 countries by population', limit: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { results: { type: 'array', items: { type: 'object', properties: { item: { type: 'string' }, label: { type: 'string' }, population: { type: 'string' } } } } } }
            }
        },
        citiesByCountry: {
            method: 'GET',
            path: '/sparql',
            description: 'List cities in a given country by Wikidata country ID (e.g. Q183 for Germany, Q30 for USA). Returns city names and optional population data.',
            parameters: [
                { position: { key: 'countryId', value: '{{COUNTRY_ID}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'limit', value: '{{LIMIT}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(200)'] } }
            ],
            tests: [
                { _description: 'Cities in Germany (Q183)', countryId: 'Q183', limit: 10 },
                { _description: 'Cities in USA (Q30)', countryId: 'Q30', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { results: { type: 'array', items: { type: 'object', properties: { item: { type: 'string' }, label: { type: 'string' }, population: { type: 'string' } } } } } }
            }
        },
        programmingLanguages: {
            method: 'GET',
            path: '/sparql',
            description: 'List programming languages with optional inception year and developer. Returns language names, Wikidata IDs, and metadata.',
            parameters: [
                { position: { key: 'limit', value: '{{LIMIT}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(50)', 'min(1)', 'max(500)'] } }
            ],
            tests: [
                { _description: 'First 20 programming languages', limit: 20 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { results: { type: 'array', items: { type: 'object', properties: { item: { type: 'string' }, label: { type: 'string' }, inception: { type: 'string' }, developer: { type: 'string' } } } } } }
            }
        },
        universitiesByCountry: {
            method: 'GET',
            path: '/sparql',
            description: 'List universities in a given country by Wikidata country ID. Returns university names, founding dates, and locations.',
            parameters: [
                { position: { key: 'countryId', value: '{{COUNTRY_ID}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'limit', value: '{{LIMIT}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(200)'] } }
            ],
            tests: [
                { _description: 'Universities in Germany (Q183)', countryId: 'Q183', limit: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { results: { type: 'array', items: { type: 'object', properties: { item: { type: 'string' }, label: { type: 'string' }, inception: { type: 'string' }, location: { type: 'string' } } } } } }
            }
        },
        nobelLaureatesByYear: {
            method: 'GET',
            path: '/sparql',
            description: 'List Nobel Prize laureates for a given year. Returns names, prize category, and Wikidata references.',
            parameters: [
                { position: { key: 'year', value: '{{YEAR}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1901)', 'max(2025)'] } }
            ],
            tests: [
                { _description: 'Nobel laureates 2023', year: 2023 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { results: { type: 'array', items: { type: 'object', properties: { laureate: { type: 'string' }, laureateLabel: { type: 'string' }, prize: { type: 'string' }, prizeLabel: { type: 'string' } } } } } }
            }
        },
        querySparql: {
            method: 'GET',
            path: '/sparql',
            description: 'Execute a custom SPARQL query against the Wikidata knowledge graph. Full SPARQL 1.1 support with Wikidata-specific extensions like the label service.',
            parameters: [
                { position: { key: 'query', value: '{{SPARQL_QUERY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Domestic cats', query: 'SELECT ?item ?itemLabel WHERE { ?item wdt:P31 wd:Q146 . SERVICE wikibase:label { bd:serviceParam wikibase:language "en" } } LIMIT 5' },
                { _description: 'Countries with capitals', query: 'SELECT ?country ?countryLabel ?capital ?capitalLabel WHERE { ?country wdt:P31 wd:Q6256 . ?country wdt:P36 ?capital . SERVICE wikibase:label { bd:serviceParam wikibase:language "en" } } LIMIT 10' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { head: { type: 'object', properties: { vars: { type: 'array', items: { type: 'string' } } } }, results: { type: 'object', properties: { bindings: { type: 'array', items: { type: 'object' } } } } } }
            }
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    countriesByPopulation: {
        preRequest: async ( { struct, payload } ) => {
            const limit = payload?.limit || 20
            const sparql = `SELECT ?item ?itemLabel ?population WHERE { ?item wdt:P31 wd:Q6256 . ?item wdt:P1082 ?population . SERVICE wikibase:label { bd:serviceParam wikibase:language "en" } } ORDER BY DESC(?population) LIMIT ${limit}`
            struct['queryParams'] = { query: sparql, format: 'json' }

            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            const results = ( response?.results?.bindings || [] )
                .map( ( b ) => {
                    const item = { item: b.item?.value, label: b.itemLabel?.value, population: b.population?.value }

                    return item
                } )

            return { response: { results } }
        }
    },
    citiesByCountry: {
        preRequest: async ( { struct, payload } ) => {
            const { countryId } = payload
            const limit = payload?.limit || 20
            const sparql = `SELECT ?item ?itemLabel ?population WHERE { ?item wdt:P31 wd:Q515 . ?item wdt:P17 wd:${countryId} . OPTIONAL { ?item wdt:P1082 ?population } SERVICE wikibase:label { bd:serviceParam wikibase:language "en" } } ORDER BY DESC(?population) LIMIT ${limit}`
            struct['queryParams'] = { query: sparql, format: 'json' }

            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            const results = ( response?.results?.bindings || [] )
                .map( ( b ) => {
                    const item = { item: b.item?.value, label: b.itemLabel?.value, population: b.population?.value || null }

                    return item
                } )

            return { response: { results } }
        }
    },
    programmingLanguages: {
        preRequest: async ( { struct, payload } ) => {
            const limit = payload?.limit || 50
            const sparql = `SELECT ?item ?itemLabel ?inception ?developerLabel WHERE { ?item wdt:P31 wd:Q9143 . OPTIONAL { ?item wdt:P571 ?inception } OPTIONAL { ?item wdt:P178 ?developer } SERVICE wikibase:label { bd:serviceParam wikibase:language "en" } } ORDER BY ?inception LIMIT ${limit}`
            struct['queryParams'] = { query: sparql, format: 'json' }

            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            const results = ( response?.results?.bindings || [] )
                .map( ( b ) => {
                    const item = { item: b.item?.value, label: b.itemLabel?.value, inception: b.inception?.value || null, developer: b.developerLabel?.value || null }

                    return item
                } )

            return { response: { results } }
        }
    },
    universitiesByCountry: {
        preRequest: async ( { struct, payload } ) => {
            const { countryId } = payload
            const limit = payload?.limit || 20
            const sparql = `SELECT ?item ?itemLabel ?inception ?locationLabel WHERE { ?item wdt:P31 wd:Q3918 . ?item wdt:P17 wd:${countryId} . OPTIONAL { ?item wdt:P571 ?inception } OPTIONAL { ?item wdt:P131 ?location } SERVICE wikibase:label { bd:serviceParam wikibase:language "en" } } ORDER BY ?inception LIMIT ${limit}`
            struct['queryParams'] = { query: sparql, format: 'json' }

            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            const results = ( response?.results?.bindings || [] )
                .map( ( b ) => {
                    const item = { item: b.item?.value, label: b.itemLabel?.value, inception: b.inception?.value || null, location: b.locationLabel?.value || null }

                    return item
                } )

            return { response: { results } }
        }
    },
    nobelLaureatesByYear: {
        preRequest: async ( { struct, payload } ) => {
            const { year } = payload
            const sparql = `SELECT ?laureate ?laureateLabel ?prize ?prizeLabel WHERE { ?laureate p:P166 ?statement . ?statement ps:P166 ?prize . ?prize wdt:P31/wdt:P279* wd:Q7191 . ?statement pq:P585 ?time . FILTER(YEAR(?time) = ${year}) SERVICE wikibase:label { bd:serviceParam wikibase:language "en" } } LIMIT 50`
            struct['queryParams'] = { query: sparql, format: 'json' }

            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            const results = ( response?.results?.bindings || [] )
                .map( ( b ) => {
                    const item = { laureate: b.laureate?.value, laureateLabel: b.laureateLabel?.value, prize: b.prize?.value, prizeLabel: b.prizeLabel?.value }

                    return item
                } )

            return { response: { results } }
        }
    }
} )
