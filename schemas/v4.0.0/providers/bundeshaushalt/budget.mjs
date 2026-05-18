// Bundeshaushalt API — Federal Budget Data (BMF)
// Free public API, no auth required
// Source: bundeshaushalt.de

export const main = {
    namespace: 'bundeshaushalt',
    name: 'Bundeshaushalt (Federal Budget)',
    description: 'Query the German federal budget data from 2012-2025 — expenses and income by Einzelplan, functional classification, or expenditure group with hierarchical drill-down.',
    version: '4.0.0',
    docs: ['https://github.com/bundesAPI/bundeshaushalt-api', 'https://www.bundeshaushalt.de/'],
    tags: ['government', 'finance', 'budget', 'germany', 'opendata', 'cacheTtlDaily'],
    root: 'https://bundeshaushalt.de/internalapi',
    requiredServerParams: [],
    tools: {
        getBudgetByEinzelplan: {
            method: 'GET',
            path: '/budgetData',
            description: 'Get federal budget data by Einzelplan (ministry/department). Use id to drill down: Level 0 = all Einzelplaene, Level 1 = Kapitel, Level 2 = Titel, Level 3 = Detail with PDF links.',
            parameters: [
                { position: { key: 'year', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(2012)', 'max(2025)', 'default(2024)'] }, description: 'Budget year between 2012 and 2025' },
                { position: { key: 'account', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum()', options: ['values(expenses,income)', 'default(expenses)'] }, description: 'Budget direction: expenses (Ausgaben) or income (Einnahmen)' },
                { position: { key: 'quota', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum()', options: ['values(target,actual)', 'default(target)'] }, description: 'Budget type: target (Soll) for planned amounts, actual (Ist) for realized amounts' },
                { position: { key: 'unit', value: 'single', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Classification unit, fixed to single for Einzelplan view' },
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Drill-down ID for hierarchy navigation, e.g. 11 for Ministry of Labor, 11-1101 for Kapitel level' }
            ],
            tests: [
                { _description: 'Get all Einzelplaene expenses 2024', year: 2024, account: 'expenses', quota: 'target' },
                { _description: 'Drill into Ministry of Labor (11)', year: 2024, account: 'expenses', quota: 'target', id: '11' },
                { _description: 'Get income overview 2023', year: 2023, account: 'income', quota: 'target' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        meta: { type: 'object', description: 'Request metadata and hierarchy navigation info', properties: { year: { type: 'number', description: 'Requested budget year' }, unit: { type: 'string', description: 'Classification unit (single, function, or group)' }, quota: { type: 'string', description: 'Budget type (target or actual)' }, account: { type: 'string', description: 'Budget direction (expenses or income)' }, timestamp: { type: 'number', description: 'Response generation timestamp' }, modifyDate: { type: 'string', description: 'Last data modification date' }, entity: { type: 'string', description: 'Data entity identifier' }, levelCur: { type: 'number', description: 'Current hierarchy level (0 = top)' }, levelMax: { type: 'number', description: 'Maximum drill-down depth available' } } },
                        detail: { type: 'object', description: 'Summary of the current hierarchy node', properties: { label: { type: 'string', description: 'Display name of this budget item' }, value: { type: 'number', description: 'Total amount in euros for this item' }, relativeToParentValue: { type: 'number', description: 'Percentage share relative to parent item' }, relativeValue: { type: 'number', description: 'Percentage share relative to total budget' }, tableLabel: { type: 'string', description: 'Label used in table displays' }, selectionLabel: { type: 'string', description: 'Label used in selection/dropdown displays' } } },
                        children: { type: 'array', description: 'Sub-items at the next hierarchy level for drill-down', items: { type: 'object', properties: { id: { type: 'string', description: 'Child item ID used for further drill-down via the id parameter' }, budgetNumber: { type: 'string', description: 'Official budget classification number' }, label: { type: 'string', description: 'Display name of this child budget item' }, value: { type: 'number', description: 'Amount in euros' }, relativeToParentValue: { type: 'number', description: 'Percentage share relative to parent' }, relativeValue: { type: 'number', description: 'Percentage share relative to total budget' } } } }
                    }
                }
            }
        },
        getBudgetByFunction: {
            method: 'GET',
            path: '/budgetData',
            description: 'Get federal budget data by functional classification (Funktionenplan). Use id with F- prefix to drill down: Level 0 = Hauptfunktionen, Level 1+ = sub-functions (e.g. F-2, F-22, F-221).',
            parameters: [
                { position: { key: 'year', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(2012)', 'max(2025)', 'default(2024)'] }, description: 'Budget year between 2012 and 2025' },
                { position: { key: 'account', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum()', options: ['values(expenses,income)', 'default(expenses)'] }, description: 'Budget direction: expenses (Ausgaben) or income (Einnahmen)' },
                { position: { key: 'quota', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum()', options: ['values(target,actual)', 'default(target)'] }, description: 'Budget type: target (Soll) for planned amounts, actual (Ist) for realized amounts' },
                { position: { key: 'unit', value: 'function', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Classification unit, fixed to function for Funktionenplan view' },
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Drill-down ID with F- prefix for functional hierarchy, e.g. F-2 for social security, F-22 for sub-function' }
            ],
            tests: [
                { _description: 'Get all Hauptfunktionen expenses 2024', year: 2024, account: 'expenses', quota: 'target' },
                { _description: 'Drill into social security (F-2)', year: 2024, account: 'expenses', quota: 'target', id: 'F-2' },
                { _description: 'Get functional income 2023', year: 2023, account: 'income', quota: 'target' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        meta: { type: 'object', description: 'Request metadata and hierarchy navigation info', properties: { year: { type: 'number', description: 'Requested budget year' }, unit: { type: 'string', description: 'Classification unit (function)' }, quota: { type: 'string', description: 'Budget type (target or actual)' }, account: { type: 'string', description: 'Budget direction (expenses or income)' }, timestamp: { type: 'number', description: 'Response generation timestamp' }, modifyDate: { type: 'string', description: 'Last data modification date' }, entity: { type: 'string', description: 'Data entity identifier' }, levelCur: { type: 'number', description: 'Current hierarchy level (0 = top)' }, levelMax: { type: 'number', description: 'Maximum drill-down depth available' } } },
                        detail: { type: 'object', description: 'Summary of the current functional classification node', properties: { label: { type: 'string', description: 'Display name of this functional item' }, value: { type: 'number', description: 'Total amount in euros' }, relativeToParentValue: { type: 'number', description: 'Percentage share relative to parent' }, relativeValue: { type: 'number', description: 'Percentage share relative to total budget' }, tableLabel: { type: 'string', description: 'Table display label' }, selectionLabel: { type: 'string', description: 'Selection display label' } } },
                        children: { type: 'array', description: 'Sub-functions at the next level for drill-down', items: { type: 'object', properties: { id: { type: 'string', description: 'Child ID with F- prefix for further drill-down' }, budgetNumber: { type: 'string', description: 'Official functional classification number' }, label: { type: 'string', description: 'Display name of this sub-function' }, value: { type: 'number', description: 'Amount in euros' }, relativeToParentValue: { type: 'number', description: 'Percentage share relative to parent' }, relativeValue: { type: 'number', description: 'Percentage share relative to total budget' } } } }
                    }
                }
            }
        },
        getBudgetByGroup: {
            method: 'GET',
            path: '/budgetData',
            description: 'Get federal budget data by expenditure group (Gruppierungsplan). Use id with G- prefix to drill down: Level 0 = Hauptgruppen, Level 1+ = sub-groups (e.g. G-6, G-63, G-636).',
            parameters: [
                { position: { key: 'year', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(2012)', 'max(2025)', 'default(2024)'] }, description: 'Budget year between 2012 and 2025' },
                { position: { key: 'account', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum()', options: ['values(expenses,income)', 'default(expenses)'] }, description: 'Budget direction: expenses (Ausgaben) or income (Einnahmen)' },
                { position: { key: 'quota', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum()', options: ['values(target,actual)', 'default(target)'] }, description: 'Budget type: target (Soll) for planned amounts, actual (Ist) for realized amounts' },
                { position: { key: 'unit', value: 'group', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Classification unit, fixed to group for Gruppierungsplan view' },
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Drill-down ID with G- prefix for group hierarchy, e.g. G-6 for transfers, G-63 for sub-group' }
            ],
            tests: [
                { _description: 'Get all Hauptgruppen expenses 2024', year: 2024, account: 'expenses', quota: 'target' },
                { _description: 'Drill into transfers (G-6)', year: 2024, account: 'expenses', quota: 'target', id: 'G-6' },
                { _description: 'Get group income 2023', year: 2023, account: 'income', quota: 'target' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        meta: { type: 'object', description: 'Request metadata and hierarchy navigation info', properties: { year: { type: 'number', description: 'Requested budget year' }, unit: { type: 'string', description: 'Classification unit (group)' }, quota: { type: 'string', description: 'Budget type (target or actual)' }, account: { type: 'string', description: 'Budget direction (expenses or income)' }, timestamp: { type: 'number', description: 'Response generation timestamp' }, modifyDate: { type: 'string', description: 'Last data modification date' }, entity: { type: 'string', description: 'Data entity identifier' }, levelCur: { type: 'number', description: 'Current hierarchy level (0 = top)' }, levelMax: { type: 'number', description: 'Maximum drill-down depth available' } } },
                        detail: { type: 'object', description: 'Summary of the current expenditure group node', properties: { label: { type: 'string', description: 'Display name of this group item' }, value: { type: 'number', description: 'Total amount in euros' }, relativeToParentValue: { type: 'number', description: 'Percentage share relative to parent' }, relativeValue: { type: 'number', description: 'Percentage share relative to total budget' }, tableLabel: { type: 'string', description: 'Table display label' }, selectionLabel: { type: 'string', description: 'Selection display label' } } },
                        children: { type: 'array', description: 'Sub-groups at the next level for drill-down', items: { type: 'object', properties: { id: { type: 'string', description: 'Child ID with G- prefix for further drill-down' }, budgetNumber: { type: 'string', description: 'Official group classification number' }, label: { type: 'string', description: 'Display name of this sub-group' }, value: { type: 'number', description: 'Amount in euros' }, relativeToParentValue: { type: 'number', description: 'Percentage share relative to parent' }, relativeValue: { type: 'number', description: 'Percentage share relative to total budget' } } } }
                    }
                }
            }
        }
    }
}
