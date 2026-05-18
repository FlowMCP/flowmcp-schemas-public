export const main = {
    namespace: 'unpaywall',
    name: 'Unpaywall',
    description: 'Detect open access status and find free PDF locations for any DOI. Covers 100M+ scholarly articles with OA classification (gold, green, hybrid, bronze) and direct links to free full-text versions.',
    version: '4.0.0',
    docs: ['https://unpaywall.org/products/api'],
    tags: ['science', 'openaccess', 'publications', 'doi', 'research', 'cacheTtlDaily'],
    root: 'https://api.unpaywall.org/v2',
    requiredServerParams: ['UNPAYWALL_EMAIL'],
    headers: {},
    tools: {
        getByDoi: {
            method: 'GET',
            path: '/:doi',
            description: 'Get open access status and locations for a scholarly article by its DOI. Returns OA classification, best OA location with PDF link, all available OA locations, journal info, and author data. Requires email as query parameter.',
            parameters: [
                { position: { key: 'doi', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'email', value: '{{UNPAYWALL_EMAIL}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get OA status for a Nature article', doi: '10.1038/nature12373' },
                { _description: 'Get OA status for a PLOS ONE article', doi: '10.1371/journal.pone.0300325' },
                { _description: 'Check OA for a Science paper', doi: '10.1126/science.aax3100' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        doi: { type: 'string' },
                        is_oa: { type: 'boolean' },
                        oa_status: { type: 'string' },
                        title: { type: 'string' },
                        journal_name: { type: 'string' },
                        best_oa_location: { type: 'object' },
                        oa_locations: { type: 'array' }
                    }
                }
            },
        }
    }
}
