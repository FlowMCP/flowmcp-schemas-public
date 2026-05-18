// Marktstammdatenregister API — Energy Market Master Data (BNetzA)
// Free public API, no auth required
// Source: marktstammdaten.api.bund.dev

export const main = {
    namespace: 'marktstammdaten',
    name: 'Marktstammdatenregister (Energy Market Data)',
    description: 'Query the German energy market master data register (MaStR) from Bundesnetzagentur — public data on 8.4M+ electricity and gas generation/consumption units with filtering and pagination.',
    version: '4.0.0',
    docs: ['https://marktstammdaten.api.bund.dev/', 'https://github.com/bundesAPI/marktstammdaten-api'],
    tags: ['government', 'energy', 'electricity', 'gas', 'germany', 'opendata', 'cacheTtlDaily'],
    root: 'https://www.marktstammdatenregister.de/MaStR',
    tools: {
        getStromerzeugung: {
            method: 'GET',
            path: '/Einheit/EinheitJson/GetErweiterteOeffentlicheEinheitStromerzeugung',
            description: 'Get extended public data on electricity generation units. Supports filtering and pagination. Filter syntax: "FieldName~operator~value" (e.g. "In Betrieb~eq~35" for active units). Use getFilterColumnsStromerzeugung to discover valid filter fields and values.',
            parameters: [
                { position: { key: 'filter', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'default(1)'] } },
                { position: { key: 'pageSize', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(5000)', 'default(10)'] } }
            ],
            tests: [
                { _description: 'Get first page of electricity generation units', page: 1, pageSize: 5 },
                { _description: 'Get active electricity generation units', filter: 'In Betrieb~eq~35', page: 1, pageSize: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated list of electricity generation units from MaStR',
                    properties: {
                        Total: { type: 'number', description: 'Total number of units matching the filter' },
                        Data: { type: 'array', description: 'Generation unit records for the current page', items: { type: 'object', properties: { EinheitMastrNummer: { type: 'string', description: 'Unique MaStR unit registration number' }, NameStromerzeugungseinheit: { type: 'string', description: 'Name of the generation unit' }, Bruttoleistung: { type: 'number', description: 'Gross power capacity in kW' }, Nettonennleistung: { type: 'number', description: 'Net rated power capacity in kW' }, AnlagenbetreiberMastrNummer: { type: 'string', description: 'Operator MaStR registration number' }, Ort: { type: 'string', description: 'City or location' }, Bundesland: { type: 'string', description: 'German federal state' }, Postleitzahl: { type: 'string', description: 'Postal code' }, Energietraeger: { type: 'string', description: 'Energy source (e.g. Solar, Wind, Biomasse)' }, Inbetriebnahmedatum: { type: 'string', description: 'Commissioning date (ISO format)' }, EinheitBetriebsstatus: { type: 'string', description: 'Operational status (e.g. In Betrieb, Stillgelegt)' } } } }
                    }
                }
            }
        },
        getFilterColumnsStromerzeugung: {
            method: 'GET',
            path: '/Einheit/EinheitJson/GetFilterColumnsErweiterteOeffentlicheEinheitStromerzeugung',
            description: 'Get available filter columns and their possible values for electricity generation unit queries. Returns column names and value lists for constructing filter expressions (FieldName~operator~value) in getStromerzeugung.',
            parameters: [],
            tests: [
                { _description: 'Get filter columns for electricity generation' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Available filter columns with their display names and possible values',
                    items: {
                        type: 'object',
                        properties: {
                            Column: { type: 'string', description: 'Internal column/field name for use in filter expressions' },
                            DisplayName: { type: 'string', description: 'Human-readable column label in German' },
                            Values: { type: 'array', description: 'Possible filter values with id and display text', items: { type: 'object', properties: { Id: { type: 'number', description: 'Numeric value to use in filter (e.g. 35 for active)' }, Value: { type: 'string', description: 'Human-readable label for the filter value' } } } }
                        }
                    }
                }
            }
        },
        getFilterColumnsStromverbrauch: {
            method: 'GET',
            path: '/Einheit/EinheitJson/GetFilterColumnsErweiterteOeffentlicheEinheitStromverbrauch',
            description: 'Get available filter columns and their possible values for electricity consumption unit queries.',
            parameters: [],
            tests: [
                { _description: 'Get filter columns for electricity consumption' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Available filter columns for electricity consumption queries',
                    items: { type: 'object', properties: { Column: { type: 'string', description: 'Internal column name' }, DisplayName: { type: 'string', description: 'German display label' }, Values: { type: 'array', description: 'Possible filter values', items: { type: 'object', properties: { Id: { type: 'number', description: 'Numeric filter value' }, Value: { type: 'string', description: 'Display text' } } } } } }
                }
            }
        },
        getFilterColumnsGaserzeugung: {
            method: 'GET',
            path: '/Einheit/EinheitJson/GetFilterColumnsErweiterteOeffentlicheEinheitGaserzeugung',
            description: 'Get available filter columns and their possible values for gas generation unit queries.',
            parameters: [],
            tests: [
                { _description: 'Get filter columns for gas generation' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Available filter columns for gas generation queries',
                    items: { type: 'object', properties: { Column: { type: 'string', description: 'Internal column name' }, DisplayName: { type: 'string', description: 'German display label' }, Values: { type: 'array', description: 'Possible filter values', items: { type: 'object', properties: { Id: { type: 'number', description: 'Numeric filter value' }, Value: { type: 'string', description: 'Display text' } } } } } }
                }
            }
        },
        getFilterColumnsGasverbrauch: {
            method: 'GET',
            path: '/Einheit/EinheitJson/GetFilterColumnsErweiterteOeffentlicheEinheitGasverbrauch',
            description: 'Get available filter columns and their possible values for gas consumption unit queries.',
            parameters: [],
            tests: [
                { _description: 'Get filter columns for gas consumption' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Available filter columns for gas consumption queries',
                    items: { type: 'object', properties: { Column: { type: 'string', description: 'Internal column name' }, DisplayName: { type: 'string', description: 'German display label' }, Values: { type: 'array', description: 'Possible filter values', items: { type: 'object', properties: { Id: { type: 'number', description: 'Numeric filter value' }, Value: { type: 'string', description: 'Display text' } } } } } }
                }
            }
        }
    }
}
