export const main = {
    namespace: 'ukparliament',
    name: 'UK Parliament Members',
    description: 'Access official UK Parliament Members API. Search Members of Parliament (MPs and Lords) by name, party, constituency, or House. Get biographical data, party affiliations, contact details, and portrait URLs. Covers both Houses of Parliament with current and historical members. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://members-api.parliament.uk/index.html'],
    tags: ['politics', 'uk', 'legislation', 'opendata', 'cacheTtlDaily'],
    root: 'https://members-api.parliament.uk',
    requiredServerParams: [],
    headers: {
        'Accept': 'application/json'
    },
    tools: {
        searchMembers: {
            method: 'GET',
            path: '/api/Members/Search',
            description: 'Search Members of Parliament by name, party, constituency, or House. Returns biographical data including party, constituency, portrait, and current status. Covers both Commons (MPs) and Lords.. Use IDs from results in getMember',
            parameters: [
                { position: { key: 'Name', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'House', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(Commons,Lords)', options: ['optional()'] } },
                { position: { key: 'IsCurrentMember', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(true)'] } },
                { position: { key: 'skip', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'take', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'max(100)'] } }
            ],
            tests: [
                { _description: 'Search for Johnson', Name: 'Johnson', take: 3 },
                { _description: 'Current Lords', House: 'Lords', IsCurrentMember: true, take: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { items: { type: 'array', items: { type: 'object', properties: { value: { type: 'object', properties: { id: { type: 'number' }, nameDisplayAs: { type: 'string' }, nameFullTitle: { type: 'string' }, gender: { type: 'string' }, latestParty: { type: 'object', properties: { id: { type: 'number' }, name: { type: 'string' } } }, latestHouseMembership: { type: 'object', properties: { membershipFrom: { type: 'string' }, house: { type: 'number' } } }, thumbnailUrl: { type: 'string' } } } } } }, totalResults: { type: 'number' } } }
            }
        },
        getMember: {
            method: 'GET',
            path: '/api/Members/:id',
            description: 'Get detailed information about a specific Member of Parliament by ID. Returns full biography, party history, constituency, contact details, and portrait URL.. Use searchMembers first to find valid IDs',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Get Keir Starmer (id 4514)', id: 4514 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { value: { type: 'object', properties: { id: { type: 'number' }, nameDisplayAs: { type: 'string' }, nameFullTitle: { type: 'string' }, gender: { type: 'string' }, latestParty: { type: 'object', properties: { name: { type: 'string' } } }, latestHouseMembership: { type: 'object', properties: { membershipFrom: { type: 'string' } } }, thumbnailUrl: { type: 'string' } } } } }
            }
        },
        getMemberVotingRecord: {
            method: 'GET',
            path: '/api/Members/:id/Voting',
            description: 'Get the voting record of a specific Member of Parliament. Returns a list of divisions (votes) the member participated in, with their vote direction (aye/no) and the division details.. Use searchMembers first to find valid IDs',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'house', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(Commons,Lords)', options: [] } },
                { position: { key: 'skip', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'take', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'max(100)'] } }
            ],
            tests: [
                { _description: 'Keir Starmer voting record', id: 4514, house: 'Commons', take: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { items: { type: 'array', items: { type: 'object', properties: { value: { type: 'object', properties: { memberId: { type: 'number' }, memberVotedAye: { type: 'boolean' }, publishedDivision: { type: 'object', properties: { divisionId: { type: 'number' }, date: { type: 'string' }, title: { type: 'string' }, ayeCount: { type: 'number' }, noCount: { type: 'number' } } } } } } } }, totalResults: { type: 'number' } } }
            }
        },
        getMemberContactDetails: {
            method: 'GET',
            path: '/api/Members/:id/Contact',
            description: 'Get contact details for a Member of Parliament. Returns email, phone, postal address, and social media links.',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Keir Starmer contact details', id: 4514 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { value: { type: 'array', items: { type: 'object', properties: { type: { type: 'string' }, isPreferred: { type: 'boolean' }, isWebAddress: { type: 'boolean' }, line1: { type: 'string' }, line2: { type: 'string' }, postcode: { type: 'string' }, email: { type: 'string' }, phone: { type: 'string' } } } } } }
            }
        }
    }
}
