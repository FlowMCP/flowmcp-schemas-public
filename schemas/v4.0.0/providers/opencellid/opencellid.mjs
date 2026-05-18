export const main = {
    namespace: 'opencellid',
    name: 'OpenCellID',
    description: 'Look up cell tower locations, get geolocation from cell tower identifiers, and query cell towers in geographic areas using the largest open database of cell towers worldwide.',
    version: '4.0.0',
    docs: ['https://wiki.opencellid.org/wiki/API'],
    tags: ['telecom', 'geolocation', 'celltowers', 'mobile', 'coverage', 'cacheTtlDaily'],
    root: 'https://opencellid.org',
    requiredServerParams: ['OPENCELLID_API_KEY'],
    headers: {},
    tools: {
        getCellPosition: {
            method: 'GET',
            path: '/cell/get',
            description: 'Get the geographic position of a specific cell tower by its MCC, MNC, LAC, and Cell ID. Returns latitude, longitude, and estimated range.',
            parameters: [
                { position: { key: 'key', value: '{{OPENCELLID_API_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'mcc', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'mnc', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'lac', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'cellid', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'radio', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(GSM,UMTS,LTE,CDMA,NR,NBIOT)', options: ['optional()'] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get position of a GSM cell tower in Germany', mcc: 262, mnc: 2, lac: 5313, cellid: 20469 },
                { _description: 'Get LTE cell tower position in Germany', mcc: 262, mnc: 1, lac: 1000, cellid: 12345, radio: 'LTE' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { lat: { type: 'number' }, lon: { type: 'number' }, range: { type: 'number' }, mcc: { type: 'number' }, mnc: { type: 'number' }, lac: { type: 'number' }, cellid: { type: 'number' }, radio: { type: 'string' } } }
            },
        },
        getCellsInArea: {
            method: 'GET',
            path: '/cell/getInArea',
            description: 'Get all cell towers within a geographic bounding box. Filter by mobile country code, network code, area code, or radio technology.',
            parameters: [
                { position: { key: 'key', value: '{{OPENCELLID_API_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'BBOX', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'mcc', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'mnc', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'lac', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'radio', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(GSM,UMTS,LTE,CDMA,NR,NBIOT)', options: ['optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(50)', 'max(50)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get cell towers in central Berlin area', BBOX: '52.50,13.37,52.53,13.42' },
                { _description: 'Get LTE towers in Munich area', BBOX: '48.10,11.50,48.20,11.60', radio: 'LTE', limit: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { cells: { type: 'array', items: { type: 'object', properties: { lat: { type: 'number' }, lon: { type: 'number' }, mcc: { type: 'number' }, mnc: { type: 'number' }, lac: { type: 'number' }, cellid: { type: 'number' }, radio: { type: 'string' }, range: { type: 'number' }, samples: { type: 'number' } } } } } }
            },
        },
        getCellCountInArea: {
            method: 'GET',
            path: '/cell/getInAreaSize',
            description: 'Get the total count of cell towers within a geographic bounding box without returning individual tower data. Useful for checking data density before querying.',
            parameters: [
                { position: { key: 'key', value: '{{OPENCELLID_API_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'BBOX', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'mcc', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'mnc', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'lac', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Count cell towers in Berlin area', BBOX: '52.40,13.20,52.60,13.60' },
                { _description: 'Count Telekom towers in Hamburg area', BBOX: '53.45,9.85,53.65,10.15', mcc: 262, mnc: 1 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { count: { type: 'number' } } }
            },
        },
        addMeasurement: {
            method: 'GET',
            path: '/measure/add',
            description: 'Add a single cell tower measurement with GPS coordinates and signal data to the OpenCellID database.',
            parameters: [
                { position: { key: 'key', value: '{{OPENCELLID_API_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'lat', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'lon', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'mcc', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'mnc', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'lac', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'cellid', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'signal', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'act', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(GSM,UMTS,LTE,CDMA,NR,NBIOT)', options: ['optional()'] } },
                { position: { key: 'rating', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Add a GSM measurement in Berlin', lat: 52.5200, lon: 13.4050, mcc: 262, mnc: 2, lac: 5313, cellid: 20469, signal: -75, act: 'GSM' }
            ],
            output: {
                mimeType: 'text/plain',
                schema: { type: 'string' }
            },
        },
    },
}
