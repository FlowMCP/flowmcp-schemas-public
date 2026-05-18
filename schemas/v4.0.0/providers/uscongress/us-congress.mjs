export const main = {
    namespace: 'uscongress',
    name: 'US Congress API',
    description: 'Access the official US Congress API by the Library of Congress. Search bills, resolutions, members, committees, nominations, and amendments across all sessions of Congress. Covers the 93rd Congress (1973) to present. DEMO_KEY available for testing, free API key recommended for production (sign up at api.congress.gov).',
    version: '4.0.0',
    docs: ['https://api.congress.gov/'],
    tags: ['politics', 'usa', 'legislation', 'opendata', 'cacheTtlDaily'],
    root: 'https://api.congress.gov',
    requiredServerParams: ['API_DATA_GOV_KEY'],
    headers: {},
    tools: {
        listBills: {
            method: 'GET',
            path: '/v3/bill',
            description: 'List bills and resolutions from the US Congress. Filter by congress number (93-119). Returns bill number, title, origin chamber, latest action, and sponsor information. Sorted by update date.',
            parameters: [
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'max(250)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } }
            ],
            tests: [
                { _description: 'List recent bills', limit: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { bills: { type: 'array', items: { type: 'object', properties: { congress: { type: 'number' }, number: { type: 'string' }, title: { type: 'string' }, type: { type: 'string' }, originChamber: { type: 'string' }, originChamberCode: { type: 'string' }, latestAction: { type: 'object', properties: { actionDate: { type: 'string' }, text: { type: 'string' } } }, updateDate: { type: 'string' }, url: { type: 'string' } } } }, pagination: { type: 'object', properties: { count: { type: 'number' }, next: { type: 'string' } } } } }
            }
        },
        listBillsByCongress: {
            method: 'GET',
            path: '/v3/bill/:congress',
            description: 'List bills from a specific Congress session. Congress numbers: 93 (1973-1974) through 119 (2025-2026). Each Congress lasts 2 years. Returns all bill types for the given session.',
            parameters: [
                { position: { key: 'congress', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'max(250)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } }
            ],
            tests: [
                { _description: 'Bills from 119th Congress (2025-2026)', congress: 119, limit: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { bills: { type: 'array', items: { type: 'object', properties: { congress: { type: 'number' }, number: { type: 'string' }, title: { type: 'string' }, type: { type: 'string' }, originChamber: { type: 'string' }, latestAction: { type: 'object', properties: { actionDate: { type: 'string' }, text: { type: 'string' } } }, url: { type: 'string' } } } }, pagination: { type: 'object', properties: { count: { type: 'number' } } } } }
            }
        },
        getBill: {
            method: 'GET',
            path: '/v3/bill/:congress/:billType/:billNumber',
            description: 'Get detailed information about a specific bill. Returns full bill data including sponsors, cosponsors, committees, CBO cost estimates, subjects, and related bills. Bill types: hr (House), s (Senate), hjres, sjres, hconres, sconres, hres, sres.',
            parameters: [
                { position: { key: 'congress', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'billType', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(hr,s,hjres,sjres,hconres,sconres,hres,sres)', options: [] } },
                { position: { key: 'billNumber', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get HR 1 from 118th Congress', congress: 118, billType: 'hr', billNumber: 1 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { bill: { type: 'object', properties: { congress: { type: 'number' }, number: { type: 'string' }, title: { type: 'string' }, type: { type: 'string' }, originChamber: { type: 'string' }, introducedDate: { type: 'string' }, policyArea: { type: 'object', properties: { name: { type: 'string' } } }, sponsors: { type: 'array' }, cosponsors: { type: 'object' }, committees: { type: 'object' }, latestAction: { type: 'object', properties: { actionDate: { type: 'string' }, text: { type: 'string' } } }, cboCostEstimates: { type: 'array' }, laws: { type: 'array' } } } } }
            }
        },
        listMembers: {
            method: 'GET',
            path: '/v3/member',
            description: 'List all current and former members of Congress. Returns name, party, state, district, depiction (photo), and term information. Filter by state or search by name.',
            parameters: [
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'max(250)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'currentMember', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'List current members', currentMember: true, limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { members: { type: 'array', items: { type: 'object', properties: { bioguideId: { type: 'string' }, name: { type: 'string' }, partyName: { type: 'string' }, state: { type: 'string' }, district: { type: 'number' }, depiction: { type: 'object', properties: { imageUrl: { type: 'string' } } }, terms: { type: 'object' }, updateDate: { type: 'string' } } } }, pagination: { type: 'object', properties: { count: { type: 'number' } } } } }
            }
        },
        getMember: {
            method: 'GET',
            path: '/v3/member/:bioguideId',
            description: 'Get detailed information about a specific member of Congress by their Bioguide ID. Returns full biography, party history, all terms served, sponsored and cosponsored legislation counts.',
            parameters: [
                { position: { key: 'bioguideId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get Patrick Leahy details', bioguideId: 'L000174' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { member: { type: 'object', properties: { bioguideId: { type: 'string' }, birthYear: { type: 'string' }, currentMember: { type: 'boolean' }, directOrderName: { type: 'string' }, invertedOrderName: { type: 'string' }, partyHistory: { type: 'array' }, sponsoredLegislation: { type: 'object', properties: { count: { type: 'number' } } }, cosponsoredLegislation: { type: 'object', properties: { count: { type: 'number' } } }, terms: { type: 'array' }, depiction: { type: 'object' } } } } }
            }
        },
        listCommittees: {
            method: 'GET',
            path: '/v3/committee',
            description: 'List congressional committees. Returns committee name, chamber (House, Senate, Joint), type, and subcommittees. Filter by chamber to see only House or Senate committees.',
            parameters: [
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'max(250)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'chamber', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(House,Senate,Joint)', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'List Senate committees', chamber: 'Senate', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { committees: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, chamber: { type: 'string' }, systemCode: { type: 'string' }, committeeTypeCode: { type: 'string' }, updateDate: { type: 'string' }, url: { type: 'string' } } } }, pagination: { type: 'object', properties: { count: { type: 'number' } } } } }
            }
        },
        listNominations: {
            method: 'GET',
            path: '/v3/nomination',
            description: 'List presidential nominations submitted to the Senate for confirmation. Returns nomination citation, congress, description, latest action, and whether it is a military nomination.',
            parameters: [
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'max(250)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } }
            ],
            tests: [
                { _description: 'List recent nominations', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { nominations: { type: 'array', items: { type: 'object', properties: { citation: { type: 'string' }, congress: { type: 'number' }, number: { type: 'number' }, latestAction: { type: 'object', properties: { actionDate: { type: 'string' }, text: { type: 'string' } } }, nominationType: { type: 'object', properties: { isMilitary: { type: 'boolean' } } }, updateDate: { type: 'string' } } } }, pagination: { type: 'object', properties: { count: { type: 'number' } } } } }
            }
        }
    }
}
