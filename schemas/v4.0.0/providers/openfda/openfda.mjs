export const main = {
    namespace: 'openfda',
    name: 'OpenFda',
    description: 'Access FDA public datasets via openFDA — search drug adverse events, drug labels, food enforcement actions, device recalls, and drug approval records.',
    docs: ['https://open.fda.gov/apis/', 'https://open.fda.gov/apis/query-syntax/'],
    tags: ['health', 'medicine', 'fda', 'drugs', 'safety', 'recalls', 'regulatory', 'cacheTtlDaily'],
    version: '4.0.0',
    root: 'https://api.fda.gov',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchDrugEvents: {
            method: 'GET',
            path: '/drug/event.json',
            description: 'Search FDA Adverse Event Reporting System (FAERS) for drug adverse event reports. Filter by drug name, reaction, patient demographics, and report dates. For drug prescribing info see searchDrugLabels, for recalls see searchDrugEnforcement.',
            parameters: [
                { position: { key: 'search', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'count', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(1000)'] } },
                { position: { key: 'skip', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] } }
            ],
            tests: [
                { _description: 'Search adverse events for aspirin', search: 'patient.drug.medicinalproduct:"aspirin"', limit: 5 },
                { _description: 'Count top reported reactions for ibuprofen', search: 'patient.drug.medicinalproduct:"ibuprofen"', count: 'patient.reaction.reactionmeddrapt.exact', limit: 10 },
                { _description: 'Search serious adverse events with hospitalization outcome', search: 'serious:1+AND+primarysource.qualification:1', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                description: 'Paginated list of FDA adverse event reports or count aggregation',
                schema: { type: 'object', properties: { meta: { type: 'object', description: 'Response metadata with pagination and disclaimer', properties: { results: { type: 'object', properties: { skip: { type: 'number', description: 'Offset of results' }, limit: { type: 'number', description: 'Max results returned' }, total: { type: 'number', description: 'Total matching records' } } } } }, results: { type: 'array', description: 'Array of adverse event report objects' } } }
            }
        },
        searchDrugLabels: {
            method: 'GET',
            path: '/drug/label.json',
            description: 'Search FDA drug product labels (package inserts) for prescribing information, warnings, dosage, and indications. For adverse event reports see searchDrugEvents.',
            parameters: [
                { position: { key: 'search', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(1000)'] } },
                { position: { key: 'skip', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] } }
            ],
            tests: [
                { _description: 'Search drug labels for metformin', search: 'openfda.generic_name:"metformin"', limit: 3 },
                { _description: 'Search drug labels with a specific warning about pregnancy', search: 'warnings:"pregnancy"', limit: 5 },
                { _description: 'Search labels for insulin products', search: 'openfda.generic_name:"insulin"', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                description: 'Paginated list of FDA drug product label records',
                schema: { type: 'object', properties: { meta: { type: 'object', description: 'Response metadata with pagination', properties: { results: { type: 'object', properties: { skip: { type: 'number' }, limit: { type: 'number' }, total: { type: 'number' } } } } }, results: { type: 'array', description: 'Array of drug label objects with prescribing information' } } }
            }
        },
        searchDrugEnforcement: {
            method: 'GET',
            path: '/drug/enforcement.json',
            description: 'Search FDA drug recall enforcement reports including voluntary recalls, Class I/II/III classifications, reason for recall, and affected products.',
            parameters: [
                { position: { key: 'search', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(1000)'] } },
                { position: { key: 'skip', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] } }
            ],
            tests: [
                { _description: 'Get recent Class I drug recalls (most serious)', search: 'classification:"Class I"', limit: 5 },
                { _description: 'Search drug recalls by product description containing acetaminophen', search: 'product_description:"acetaminophen"', limit: 5 },
                { _description: 'Search drug recalls in 2024', search: 'recall_initiation_date:[20240101+TO+20241231]', limit: 10 }
            ],
            output: {
                mimeType: 'application/json',
                description: 'Paginated list of FDA drug recall enforcement reports',
                schema: { type: 'object', properties: { meta: { type: 'object', description: 'Response metadata', properties: { results: { type: 'object', properties: { skip: { type: 'number' }, limit: { type: 'number' }, total: { type: 'number' } } } } }, results: { type: 'array', description: 'Array of drug recall enforcement objects' } } }
            }
        },
        searchFoodEnforcement: {
            method: 'GET',
            path: '/food/enforcement.json',
            description: 'Search FDA food recall enforcement reports including product descriptions, recall reasons, classification, and distribution scope.',
            parameters: [
                { position: { key: 'search', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(1000)'] } },
                { position: { key: 'skip', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] } }
            ],
            tests: [
                { _description: 'Get recent Class I food recalls (most serious)', search: 'classification:"Class I"', limit: 5 },
                { _description: 'Search food recalls mentioning allergen contamination', search: 'reason_for_recall:"allergen"', limit: 5 },
                { _description: 'Search peanut-related food recalls', search: 'product_description:"peanut"', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                description: 'Paginated list of FDA food recall enforcement reports',
                schema: { type: 'object', properties: { meta: { type: 'object', description: 'Response metadata', properties: { results: { type: 'object', properties: { skip: { type: 'number' }, limit: { type: 'number' }, total: { type: 'number' } } } } }, results: { type: 'array', description: 'Array of food recall enforcement objects' } } }
            }
        },
        searchDeviceEvents: {
            method: 'GET',
            path: '/device/event.json',
            description: 'Search FDA Medical Device Reporting (MDR) adverse event reports for medical device malfunction, injury, and death reports.',
            parameters: [
                { position: { key: 'search', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'count', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(1000)'] } },
                { position: { key: 'skip', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] } }
            ],
            tests: [
                { _description: 'Search device events for insulin pump malfunctions', search: 'device.generic_name:"insulin pump"', limit: 5 },
                { _description: 'Count top device generic names in adverse event reports', count: 'device.generic_name.exact', limit: 10 },
                { _description: 'Search for events involving pacemaker devices', search: 'device.generic_name:"pacemaker"', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                description: 'Paginated list of FDA medical device adverse event reports',
                schema: { type: 'object', properties: { meta: { type: 'object', description: 'Response metadata', properties: { results: { type: 'object', properties: { skip: { type: 'number' }, limit: { type: 'number' }, total: { type: 'number' } } } } }, results: { type: 'array', description: 'Array of device adverse event report objects' } } }
            }
        }
    },
}