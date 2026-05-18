export const main = {
    namespace: 'nobelprize',
    name: 'Nobel Prize API',
    description: 'Access the official Nobel Prize API by the Nobel Foundation. Query all Nobel Prizes from 1901 to present, search laureates by name/gender/country, and get detailed biographical data. Covers Physics, Chemistry, Medicine, Literature, Peace, and Economic Sciences. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://www.nobelprize.org/about/developer-zone-2/'],
    tags: ['science', 'awards', 'history', 'opendata', 'cacheTtlDaily'],
    root: 'https://api.nobelprize.org',
    requiredServerParams: [],
    headers: {
        'Accept': 'application/json'
    },
    tools: {
        listPrizes: {
            method: 'GET',
            path: '/2.1/nobelPrizes',
            description: 'List Nobel Prizes with optional filters. Filter by category (che=Chemistry, eco=Economics, lit=Literature, med=Medicine, pea=Peace, phy=Physics), year range, and number of laureates. Use laureate IDs from results in getLaureate for full biographies.',
            parameters: [
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(25)', 'max(100)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'yearTo', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'yearFrom', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'nobelPrizeCategory', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(che,eco,lit,med,pea,phy)', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'List recent Nobel Prizes', limit: 5, yearFrom: 2023 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { nobelPrizes: { type: 'array', items: { type: 'object', properties: { awardYear: { type: 'string' }, category: { type: 'object', properties: { en: { type: 'string' } } }, categoryFullName: { type: 'object', properties: { en: { type: 'string' } } }, dateAwarded: { type: 'string' }, prizeAmount: { type: 'number' }, prizeAmountAdjusted: { type: 'number' }, laureates: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, knownName: { type: 'object', properties: { en: { type: 'string' } } }, motivation: { type: 'object', properties: { en: { type: 'string' } } }, portion: { type: 'string' } } } } } } } } }
            }
        },
        searchLaureates: {
            method: 'GET',
            path: '/2.1/laureates',
            description: 'Search Nobel Prize laureates by name, gender, birth country, or prize category. Returns biographical data. Use returned IDs in getLaureate for full details including affiliations.',
            parameters: [
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(25)', 'max(100)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'name', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'gender', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(male,female,org)', options: ['optional()'] } },
                { position: { key: 'birthCountry', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'nobelPrizeCategory', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(che,eco,lit,med,pea,phy)', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Search for Einstein', name: 'Einstein', limit: 3 },
                { _description: 'Female physics laureates', gender: 'female', nobelPrizeCategory: 'phy', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { laureates: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, knownName: { type: 'object', properties: { en: { type: 'string' } } }, givenName: { type: 'object', properties: { en: { type: 'string' } } }, familyName: { type: 'object', properties: { en: { type: 'string' } } }, gender: { type: 'string' }, birth: { type: 'object', properties: { date: { type: 'string' }, place: { type: 'object' } } }, nobelPrizes: { type: 'array', items: { type: 'object', properties: { awardYear: { type: 'string' }, category: { type: 'object', properties: { en: { type: 'string' } } }, motivation: { type: 'object', properties: { en: { type: 'string' } } } } } } } } }, meta: { type: 'object', properties: { count: { type: 'number' } } } } }
            }
        },
        getLaureate: {
            method: 'GET',
            path: '/2.1/laureate/:id',
            description: 'Get detailed information about a specific Nobel laureate by ID. Returns full biography, birth/death details, affiliated institutions, and all prizes with motivations. Use IDs from searchLaureates or listPrizes laureate entries.',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Get Albert Einstein details', id: 26 },
                { _description: 'Get Marie Curie details', id: 6 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, knownName: { type: 'object', properties: { en: { type: 'string' } } }, givenName: { type: 'object', properties: { en: { type: 'string' } } }, familyName: { type: 'object', properties: { en: { type: 'string' } } }, gender: { type: 'string' }, birth: { type: 'object' }, death: { type: 'object' }, wikipedia: { type: 'object' }, wikidata: { type: 'object' }, nobelPrizes: { type: 'array' } } } }
            }
        }
    }
}
