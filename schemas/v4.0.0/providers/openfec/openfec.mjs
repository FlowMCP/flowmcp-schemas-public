export const main = {
    namespace: 'openfec',
    name: 'OpenFEC US Campaign Finance',
    description: 'Access the US Federal Election Commission (FEC) campaign finance data. Search candidates, committees, filings, and financial totals for all US federal elections. Covers presidential, Senate, and House races with detailed fundraising and spending data from 1980 to present. Free API key required (sign up at api.open.fec.gov). DEMO_KEY available for testing.',
    version: '4.0.0',
    docs: ['https://api.open.fec.gov/developers/'],
    tags: ['politics', 'finance', 'usa', 'opendata', 'cacheTtlDaily'],
    root: 'https://api.open.fec.gov',
    requiredServerParams: ['API_DATA_GOV_KEY'],
    headers: {},
    tools: {
        searchCandidates: {
            method: 'GET',
            path: '/v1/candidates/search/',
            description: 'Search US federal election candidates by name, state, office, party, or election year. Returns candidate details including ID, office, party, state, and election cycles.',
            parameters: [
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'name', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'office', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(P,S,H)', options: ['optional()'] } },
                { position: { key: 'state', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'party', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'election_year', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'per_page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'max(100)'] } }
            ],
            tests: [
                { _description: 'Search Biden candidates', name: 'Biden', per_page: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { results: { type: 'array', items: { type: 'object', properties: { candidate_id: { type: 'string' }, name: { type: 'string' }, office_full: { type: 'string' }, party_full: { type: 'string' }, state: { type: 'string' }, election_years: { type: 'array', items: { type: 'number' } }, incumbent_challenge_full: { type: 'string' } } } }, pagination: { type: 'object', properties: { count: { type: 'number' }, page: { type: 'number' }, per_page: { type: 'number' }, pages: { type: 'number' } } } } }
            }
        },
        getCandidateTotals: {
            method: 'GET',
            path: '/v1/candidates/totals/',
            description: 'Get financial totals for candidates. Returns total receipts, disbursements, cash on hand, and debt for each candidate. Sort by receipts to find top fundraisers. Filter by election year and office type (P=President, S=Senate, H=House).',
            parameters: [
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'election_year', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'office', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(P,S,H)', options: ['optional()'] } },
                { position: { key: 'sort', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(-receipts)'] } },
                { position: { key: 'per_page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'max(100)'] } }
            ],
            tests: [
                { _description: 'Top 2024 presidential fundraisers', election_year: 2024, office: 'P', per_page: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { results: { type: 'array', items: { type: 'object', properties: { candidate_id: { type: 'string' }, name: { type: 'string' }, office: { type: 'string' }, party: { type: 'string' }, receipts: { type: 'number' }, disbursements: { type: 'number' }, cash_on_hand_end_period: { type: 'number' }, debts_owed_by_committee: { type: 'number' }, election_year: { type: 'number' } } } }, pagination: { type: 'object', properties: { count: { type: 'number' } } } } }
            }
        },
        searchCommittees: {
            method: 'GET',
            path: '/v1/committees/',
            description: 'Search political committees (PACs, Super PACs, party committees, candidate committees). Returns committee name, type, party affiliation, designation, and filing frequency.',
            parameters: [
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'committee_type', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'per_page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'max(100)'] } }
            ],
            tests: [
                { _description: 'Search for DNC committee', q: 'Democratic National Committee', per_page: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { results: { type: 'array', items: { type: 'object', properties: { committee_id: { type: 'string' }, name: { type: 'string' }, committee_type_full: { type: 'string' }, party_full: { type: 'string' }, designation_full: { type: 'string' }, state: { type: 'string' }, filing_frequency: { type: 'string' } } } }, pagination: { type: 'object', properties: { count: { type: 'number' } } } } }
            }
        },
        getElectionSummary: {
            method: 'GET',
            path: '/v1/elections/',
            description: 'Get election summary data showing candidates competing in a specific race. Returns candidates with their financial totals for the given office, state, and election cycle.',
            parameters: [
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'office', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(president,senate,house)', options: [] } },
                { position: { key: 'cycle', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'state', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'per_page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'max(100)'] } }
            ],
            tests: [
                { _description: '2024 presidential election', office: 'president', cycle: 2024, per_page: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { results: { type: 'array', items: { type: 'object', properties: { candidate_id: { type: 'string' }, candidate_name: { type: 'string' }, total_receipts: { type: 'number' }, total_disbursements: { type: 'number' }, cash_on_hand_end_period: { type: 'number' }, party_full: { type: 'string' }, incumbent_challenge_full: { type: 'string' } } } }, pagination: { type: 'object', properties: { count: { type: 'number' } } } } }
            }
        }
    }
}
