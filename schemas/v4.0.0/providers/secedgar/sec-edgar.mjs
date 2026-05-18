export const main = {
    namespace: 'secedgar',
    name: 'SEC EDGAR Financial Filings',
    description: 'Access the US Securities and Exchange Commission EDGAR database. Search company filings (10-K, 10-Q, 8-K, S-1, etc.) using full-text search. Covers all publicly traded US companies with filings from 1993 to present. Free, no API key required. User-Agent header required.',
    version: '4.0.0',
    docs: ['https://efts.sec.gov/LATEST/', 'https://www.sec.gov/edgar/sec-api-documentation'],
    tags: ['finance', 'usa', 'sec', 'opendata', 'cacheTtlDaily'],
    root: 'https://efts.sec.gov',
    requiredServerParams: [],
    headers: {
        'User-Agent': 'FlowMCP/2.0 contact@flowmcp.com',
        'Accept': 'application/json'
    },
    tools: {
        searchFilings: {
            method: 'GET',
            path: '/LATEST/search-index',
            description: 'Full-text search across all SEC EDGAR filings. Search by company name, ticker, CIK, or keywords within filings. Filter by form type (10-K=annual, 10-Q=quarterly, 8-K=current, S-1=IPO) and date range. Returns filing metadata including entity name, form type, file date, and accession number.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'forms', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'dateRange', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(custom)', options: ['optional()'] } },
                { position: { key: 'startdt', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'enddt', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Search Apple 10-K filings', q: 'apple', forms: '10-K' },
                { _description: 'Search Tesla filings 2024', q: 'tesla', forms: '10-K', dateRange: 'custom', startdt: '2024-01-01', enddt: '2024-12-31' },
                { _description: 'Search for IPO filings (S-1)', q: 'S-1', forms: 'S-1' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { hits: { type: 'object', properties: { total: { type: 'object', properties: { value: { type: 'number' } } }, hits: { type: 'array', items: { type: 'object', properties: { _source: { type: 'object', properties: { file_date: { type: 'string' }, display_names: { type: 'array' }, form: { type: 'string' }, adsh: { type: 'string' }, ciks: { type: 'array' }, period_ending: { type: 'string' }, file_num: { type: 'array' } } } } } } } } } }
            }
        }
    }
}
