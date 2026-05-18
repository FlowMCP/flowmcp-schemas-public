export const main = {
    namespace: 'secdata',
    name: 'SEC EDGAR Company Data',
    description: 'Access SEC EDGAR structured company data. Get XBRL financial facts (revenue, net income, assets, etc.) and filing histories for all US public companies by CIK number. CIK must be zero-padded to 10 digits (e.g., CIK0000320193 for Apple). Free, no API key required. User-Agent header required.',
    version: '4.0.0',
    docs: ['https://www.sec.gov/edgar/sec-api-documentation'],
    tags: ['finance', 'usa', 'sec', 'opendata', 'cacheTtlDaily'],
    root: 'https://data.sec.gov',
    requiredServerParams: [],
    headers: {
        'User-Agent': 'FlowMCP/2.0 contact@flowmcp.com',
        'Accept': 'application/json'
    },
    tools: {
        getCompanyFacts: {
            method: 'GET',
            path: '/api/xbrl/companyfacts/:cikPadded.json',
            description: 'Get all XBRL financial facts for a company by CIK number. Returns standardized financial data (revenue, net income, assets, liabilities, etc.) from all filed reports. CIK must be zero-padded to 10 digits with CIK prefix (e.g., CIK0000320193 for Apple, CIK0001318605 for Tesla). Very large response with full financial history.',
            parameters: [
                { position: { key: 'cikPadded', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Apple Inc financial facts', cikPadded: 'CIK0000320193' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { cik: { type: 'number' }, entityName: { type: 'string' }, facts: { type: 'object', properties: { dei: { type: 'object' }, 'us-gaap': { type: 'object' } } } } }
            }
        },
        getCompanyFilings: {
            method: 'GET',
            path: '/submissions/:cikPadded.json',
            description: 'Get filing history and company metadata by CIK number. Returns the last 40+ filings with form type, filing date, accession number, and primary document. Also includes company details: name, ticker, SIC code, fiscal year end, and addresses. CIK must be zero-padded to 10 digits with CIK prefix.',
            parameters: [
                { position: { key: 'cikPadded', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Apple Inc filings', cikPadded: 'CIK0000320193' },
                { _description: 'Tesla Inc filings', cikPadded: 'CIK0001318605' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { cik: { type: 'string' }, entityType: { type: 'string' }, sic: { type: 'string' }, sicDescription: { type: 'string' }, name: { type: 'string' }, tickers: { type: 'array', items: { type: 'string' } }, exchanges: { type: 'array', items: { type: 'string' } }, ein: { type: 'string' }, stateOfIncorporation: { type: 'string' }, fiscalYearEnd: { type: 'string' }, filings: { type: 'object', properties: { recent: { type: 'object', properties: { accessionNumber: { type: 'array' }, filingDate: { type: 'array' }, form: { type: 'array' }, primaryDocument: { type: 'array' }, primaryDocDescription: { type: 'array' } } } } } } }
            }
        },
        getCompanyConcept: {
            method: 'GET',
            path: '/api/xbrl/companyconcept/:cikPadded/us-gaap/:concept.json',
            description: 'Get a specific XBRL financial concept for a company over time. Returns historical values for one metric. Useful for time-series analysis. Common us-gaap concepts: Assets, Liabilities, StockholdersEquity, NetIncomeLoss, EarningsPerShareBasic, CashAndCashEquivalentsAtCarryingValue, RevenueFromContractWithCustomerExcludingAssessedTax. Concept names are case-sensitive.. Use getCompanyFacts first to find valid IDs',
            parameters: [
                { position: { key: 'cikPadded', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'concept', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Apple total assets', cikPadded: 'CIK0000320193', concept: 'Assets' },
                { _description: 'Tesla net income', cikPadded: 'CIK0001318605', concept: 'NetIncomeLoss' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { cik: { type: 'number' }, taxonomy: { type: 'string' }, tag: { type: 'string' }, label: { type: 'string' }, entityName: { type: 'string' }, units: { type: 'object' } } }
            }
        }
    }
}
