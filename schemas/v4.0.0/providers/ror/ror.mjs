export const main = {
    namespace: 'ror',
    name: 'ROR',
    description: 'Query the Research Organization Registry (ROR) to search, retrieve, and match research organizations worldwide. Provides persistent identifiers for over 100,000 organizations.',
    version: '4.0.0',
    docs: ['https://ror.readme.io/v2/docs/rest-api', 'https://ror.org/'],
    tags: ['science', 'research', 'organizations', 'identifiers', 'cacheTtlDaily'],
    root: 'https://api.ror.org/v2',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchOrganizations: {
            method: 'GET',
            path: '/organizations',
            description: 'Quick search for research organizations by name or external identifier. Searches the names and external_ids fields. Returns up to 20 results per page.. Use IDs from results in advancedSearchOrganizations',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } }
            ],
            tests: [
                { _description: 'Search for MIT', query: 'MIT' },
                { _description: 'Search for Max Planck', query: 'Max Planck' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        number_of_results: { type: 'number' },
                        items: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, names: { type: 'array' }, types: { type: 'array' }, status: { type: 'string' }, locations: { type: 'array' } } } }
                    }
                }
            },
        },
        advancedSearchOrganizations: {
            method: 'GET',
            path: '/organizations',
            description: 'Advanced search across all ROR fields using Elasticsearch query string syntax. Supports boolean operators, wildcards, field-specific queries (e.g. types:education), and date ranges.',
            parameters: [
                { position: { key: 'query.advanced', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } }
            ],
            tests: [
                { _description: 'Search for facility-type organizations', 'query.advanced': 'types:facility' },
                { _description: 'Search for education orgs in Germany', 'query.advanced': 'types:education AND locations.geonames_details.country_code:DE' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        number_of_results: { type: 'number' },
                        items: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, names: { type: 'array' }, types: { type: 'array' }, status: { type: 'string' }, locations: { type: 'array' }, established: { type: 'number' } } } }
                    }
                }
            },
        },
        matchAffiliation: {
            method: 'GET',
            path: '/organizations',
            description: 'Match an affiliation string to ROR organization records. Designed for parsing complex affiliation strings from research papers. Results are not paginated.. Use searchOrganizations first to find valid IDs',
            parameters: [
                { position: { key: 'affiliation', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Match a university affiliation string', affiliation: 'Department of Physics, University of Oxford, Oxford, UK' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        number_of_results: { type: 'number' },
                        items: { type: 'array', items: { type: 'object', properties: { substring: { type: 'string' }, score: { type: 'number' }, matching_type: { type: 'string' }, chosen: { type: 'boolean' }, organization: { type: 'object' } } } }
                    }
                }
            },
        },
        getOrganization: {
            method: 'GET',
            path: '/organizations/:rorId',
            description: 'Retrieve a single organization record by its ROR ID. Returns full details including names, types, locations, external IDs, relationships, and administrative metadata.. Use searchOrganizations first to find valid IDs',
            parameters: [
                { position: { key: 'rorId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get CERN record', rorId: '01ggx4157' },
                { _description: 'Get MIT record', rorId: '042nb2s44' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        names: { type: 'array' },
                        types: { type: 'array' },
                        status: { type: 'string' },
                        established: { type: 'number' },
                        locations: { type: 'array' },
                        external_ids: { type: 'array' },
                        links: { type: 'array' },
                        relationships: { type: 'array' },
                        admin: { type: 'object' }
                    }
                }
            },
        }
    }
}
