// Schema for #317 — OpenFIGI Financial Instrument Global Identifiers
// No API key required for basic access (lower rate limits)

export const main = {
    namespace: 'openfigi',
    name: 'OpenFIGI',
    description: 'Map financial identifiers (ISIN, CUSIP, SEDOL, ticker) to FIGI codes, search instruments by keyword, and retrieve valid mapping field values via the OpenFIGI API. Free to use without API key.',
    version: '4.0.0',
    docs: ['https://www.openfigi.com/api/documentation'],
    tags: ['finance', 'identifiers', 'securities', 'opendata', 'cacheTtlDaily'],
    root: 'https://api.openfigi.com',
    requiredServerParams: [],
    headers: {
        'Content-Type': 'application/json'
    },
    tools: {
        mapIdentifiers: {
            method: 'POST',
            path: '/v3/mapping',
            description: 'Map third-party financial identifiers (ISIN, CUSIP, SEDOL, ticker, etc.) to FIGI codes. Accepts an array of mapping jobs and returns FIGI metadata for each.',
            parameters: [
                {
                    position: { key: 'idType', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'enum(ID_ISIN,ID_BB_UNIQUE,ID_SEDOL,ID_COMMON,ID_WERTPAPIER,ID_CUSIP,ID_CINS,ID_BB,TICKER,BASE_TICKER,ID_CUSIP_8_CHR,COMPOSITE_ID_BB_GLOBAL,ID_BB_GLOBAL,ID_BB_GLOBAL_SHARE_CLASS_LEVEL,ID_BB_SEC_NUM_DES,ID_FULL_EXCHANGE_SYMBOL,ID_EXCH_SYMBOL,OCC_SYMBOL,UNIQUE_ID_FUT_OPT,OPRA_SYMBOL,TRADING_SYSTEM_IDENTIFIER,ID_SHORT_CODE,VENDOR_INDEX_CODE)', options: [] }
                },
                {
                    position: { key: 'idValue', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'string()', options: ['min(1)'] }
                },
                {
                    position: { key: 'exchCode', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'string()', options: ['optional()'] }
                },
                {
                    position: { key: 'micCode', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'string()', options: ['optional()'] }
                },
                {
                    position: { key: 'currency', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'string()', options: ['optional()'] }
                },
                {
                    position: { key: 'marketSecDes', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'string()', options: ['optional()'] }
                }
            ],
            tests: [
                { _description: 'Map Apple ticker to FIGI', idType: 'TICKER', idValue: 'AAPL' },
                { _description: 'Map ISIN to FIGI', idType: 'ID_ISIN', idValue: 'US0378331005' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            data: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        figi: { type: 'string' },
                                        name: { type: 'string' },
                                        ticker: { type: 'string' },
                                        exchCode: { type: 'string' },
                                        compositeFIGI: { type: 'string' },
                                        securityType: { type: 'string' },
                                        marketSector: { type: 'string' },
                                        shareClassFIGI: { type: 'string' },
                                        securityType2: { type: 'string' },
                                        securityDescription: { type: 'string' }
                                    }
                                }
                            },
                            error: { type: 'string' },
                            warning: { type: 'string' }
                        }
                    }
                }
            }
        },
        searchInstruments: {
            method: 'POST',
            path: '/v3/search',
            description: 'Search for financial instruments by keyword. Returns matching FIGI records with metadata. Supports pagination and filtering by exchange, currency, and security type.',
            parameters: [
                {
                    position: { key: 'query', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'string()', options: ['min(1)'] }
                },
                {
                    position: { key: 'exchCode', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'string()', options: ['optional()'] }
                },
                {
                    position: { key: 'marketSecDes', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'string()', options: ['optional()'] }
                },
                {
                    position: { key: 'currency', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'string()', options: ['optional()'] }
                },
                {
                    position: { key: 'securityType', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'string()', options: ['optional()'] }
                },
                {
                    position: { key: 'start', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'string()', options: ['optional()'] }
                }
            ],
            tests: [
                { _description: 'Search for Apple instruments', query: 'Apple' },
                { _description: 'Search for Microsoft on US exchanges', query: 'Microsoft', currency: 'USD' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    figi: { type: 'string' },
                                    name: { type: 'string' },
                                    ticker: { type: 'string' },
                                    exchCode: { type: 'string' },
                                    compositeFIGI: { type: 'string' },
                                    securityType: { type: 'string' },
                                    marketSector: { type: 'string' },
                                    shareClassFIGI: { type: 'string' },
                                    securityType2: { type: 'string' },
                                    securityDescription: { type: 'string' }
                                }
                            }
                        },
                        error: { type: 'string' },
                        next: { type: 'string' }
                    }
                }
            }
        },
        filterInstruments: {
            method: 'POST',
            path: '/v3/filter',
            description: 'Filter financial instruments with alphabetical FIGI listing and total result count. Same parameters as search but returns total count for pagination.',
            parameters: [
                {
                    position: { key: 'query', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'string()', options: ['min(1)'] }
                },
                {
                    position: { key: 'exchCode', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'string()', options: ['optional()'] }
                },
                {
                    position: { key: 'currency', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'string()', options: ['optional()'] }
                },
                {
                    position: { key: 'marketSecDes', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'string()', options: ['optional()'] }
                },
                {
                    position: { key: 'start', value: '{{USER_PARAM}}', location: 'body' },
                    z: { primitive: 'string()', options: ['optional()'] }
                }
            ],
            tests: [
                { _description: 'Filter for Tesla instruments', query: 'Tesla' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    figi: { type: 'string' },
                                    name: { type: 'string' },
                                    ticker: { type: 'string' },
                                    exchCode: { type: 'string' },
                                    compositeFIGI: { type: 'string' },
                                    securityType: { type: 'string' },
                                    marketSector: { type: 'string' }
                                }
                            }
                        },
                        error: { type: 'string' },
                        total: { type: 'number' },
                        next: { type: 'string' }
                    }
                }
            }
        },
        getMappingValues: {
            method: 'GET',
            path: '/v3/mapping/values/:key',
            description: 'Retrieve all valid values for a given mapping field. Use to discover valid idType, exchCode, micCode, currency, marketSecDes, securityType, or stateCode values.',
            parameters: [
                {
                    position: { key: 'key', value: '{{USER_PARAM}}', location: 'insert' },
                    z: { primitive: 'enum(idType,exchCode,micCode,currency,marketSecDes,securityType,securityType2,stateCode)', options: [] }
                }
            ],
            tests: [
                { _description: 'Get valid idType values', key: 'idType' },
                { _description: 'Get valid exchange codes', key: 'exchCode' },
                { _description: 'Get valid currency codes', key: 'currency' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        values: {
                            type: 'array',
                            items: { type: 'string' }
                        }
                    }
                }
            }
        }
    }
}

export const handlers = () => ( {
    mapIdentifiers: {
        preRequest: async ( { struct, payload } ) => {
            const body = struct['body'] || {}
            const mappingJob = {}
            if( body['idType'] ) { mappingJob['idType'] = body['idType'] }
            if( body['idValue'] ) { mappingJob['idValue'] = body['idValue'] }
            if( body['exchCode'] ) { mappingJob['exchCode'] = body['exchCode'] }
            if( body['micCode'] ) { mappingJob['micCode'] = body['micCode'] }
            if( body['currency'] ) { mappingJob['currency'] = body['currency'] }
            if( body['marketSecDes'] ) { mappingJob['marketSecDes'] = body['marketSecDes'] }
            struct['body'] = [mappingJob]

            return { struct, payload }
        }
    }
} )
