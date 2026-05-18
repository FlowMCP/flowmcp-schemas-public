export const main = {
    namespace: 'uncomtrade',
    name: 'UN Comtrade International Trade Statistics',
    description: 'Access the United Nations Comtrade database for international merchandise trade statistics. Query bilateral trade flows (imports/exports) between 200+ countries with HS commodity classification. Data covers 1962 to present with annual and monthly frequency. The preview endpoint is free and requires no API key. Rate limit: 1 request per second.',
    version: '4.0.0',
    docs: ['https://comtradedeveloper.un.org/'],
    tags: ['trade', 'economics', 'international', 'opendata', 'cacheTtlDaily'],
    root: 'https://comtradeapi.un.org',
    requiredServerParams: [],
    headers: {
        'Accept': 'application/json'
    },
    tools: {
        getTradeData: {
            method: 'GET',
            path: '/public/v1/preview/C/A/HS',
            description: 'Get merchandise trade data (preview). Returns bilateral trade flows with value, quantity, and weight. Reporter/partner use UN M49 codes (e.g. 276=Germany, 842=USA, 156=China, 826=UK, 250=France, 392=Japan). Flow: X=Export, M=Import. Commodity: TOTAL for aggregate or HS 2/4/6-digit codes. Limited to 500 records in preview mode.',
            parameters: [
                { position: { key: 'reporterCode', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'period', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'partnerCode', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'cmdCode', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(TOTAL)'] } },
                { position: { key: 'flowCode', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(X,M,DX,FM)', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Germany total exports 2023', reporterCode: 276, period: '2023', partnerCode: 0, cmdCode: 'TOTAL', flowCode: 'X' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { elapsedTime: { type: 'string' }, count: { type: 'number' }, data: { type: 'array', items: { type: 'object', properties: { typeCode: { type: 'string' }, freqCode: { type: 'string' }, refYear: { type: 'number' }, reporterCode: { type: 'number' }, flowCode: { type: 'string' }, partnerCode: { type: 'number' }, cmdCode: { type: 'string' }, primaryValue: { type: 'number' }, netWgt: { type: 'number' }, grossWgt: { type: 'number' }, qty: { type: 'number' } } } } } }
            }
        },
        getDataAvailability: {
            method: 'GET',
            path: '/public/v1/getDA/C/A/HS',
            description: 'Check data availability for a reporter country. Returns available years and dataset details for a given reporter using HS classification. Useful for discovering what time periods are available before querying trade data.. Use listReferences first to find valid IDs',
            parameters: [
                { position: { key: 'reporterCode', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Germany data availability', reporterCode: 276 },
                { _description: 'USA data availability', reporterCode: 842 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { elapsedTime: { type: 'string' }, count: { type: 'number' }, data: { type: 'array', items: { type: 'object', properties: { datasetCode: { type: 'number' }, typeCode: { type: 'string' }, freqCode: { type: 'string' }, period: { type: 'number' }, reporterCode: { type: 'number' }, reporterISO: { type: 'string' }, reporterDesc: { type: 'string' }, classificationCode: { type: 'string' }, totalRecords: { type: 'number' } } } } } }
            }
        },
        listReferences: {
            method: 'GET',
            path: '/files/v1/app/reference/ListofReferences.json',
            description: 'List all available reference data files. Returns URLs for reporters, partners, commodities, trade flows, transport modes, and quantity units reference data. Use these to discover valid codes for trade queries.',
            parameters: [],
            tests: [
                { _description: 'List all reference data files' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { results: { type: 'array', items: { type: 'object', properties: { category: { type: 'string' }, variable: { type: 'string' }, description: { type: 'string' }, fileuri: { type: 'string' } } } } } }
            }
        },
        listReporters: {
            method: 'GET',
            path: '/files/v1/app/reference/Reporters.json',
            description: 'List all reporter countries and areas with their M49 codes. Returns 200+ entities including ISO alpha-2/3 codes, group membership flags, and validity dates. Use reporter codes in getTradeData queries.',
            parameters: [],
            tests: [
                { _description: 'List all reporter countries' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { results: { type: 'array', items: { type: 'object', properties: { id: { type: 'number' }, text: { type: 'string' }, reporterCode: { type: 'number' }, reporterDesc: { type: 'string' }, reporterCodeIsoAlpha2: { type: 'string' }, reporterCodeIsoAlpha3: { type: 'string' }, isGroup: { type: 'boolean' } } } } } }
            }
        },
        listTradeRegimes: {
            method: 'GET',
            path: '/files/v1/app/reference/tradeRegimes.json',
            description: 'List all trade flow types (regimes). Returns codes like X=Export, M=Import, DX=Domestic Export, FM=Foreign Import, and specialized processing trade codes. Use flow codes in getTradeData queries.',
            parameters: [],
            tests: [
                { _description: 'List all trade flow types' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { more: { type: 'boolean' }, results: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, text: { type: 'string' } } } } } }
            }
        }
    }
}
