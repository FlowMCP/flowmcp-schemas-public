export const main = {
    namespace: 'nagerdate',
    name: 'Nager.Date Public Holidays',
    description: 'Access public holiday data for 100+ countries worldwide via the Nager.Date API. Get holidays by year and country, upcoming holidays, long weekends, and available country list. Data covers official public holidays with local names and regional variants. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://date.nager.at/Api'],
    tags: ['reference', 'calendar', 'opendata', 'cacheTtlDaily'],
    root: 'https://date.nager.at',
    requiredServerParams: [],
    headers: {},
    tools: {
        getPublicHolidays: {
            method: 'GET',
            path: '/api/v3/publicholidays/:year/:countryCode',
            description: 'Get public holidays for a specific year and country. Returns date, local name, English name, type, and whether it applies globally or to specific counties/regions. Use listCountries to get valid country codes. Use getLongWeekends to find extended weekends around these holidays.',
            parameters: [
                { position: { key: 'year', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'countryCode', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'US holidays 2024', year: 2024, countryCode: 'US' },
                { _description: 'German holidays 2024', year: 2024, countryCode: 'DE' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'array', description: 'List of public holidays for the requested year and country', items: { type: 'object', properties: { date: { type: 'string', description: 'Holiday date in YYYY-MM-DD format' }, localName: { type: 'string', description: 'Holiday name in the local language' }, name: { type: 'string', description: 'Holiday name in English' }, countryCode: { type: 'string', description: 'ISO 3166-1 alpha-2 country code' }, fixed: { type: 'boolean', description: 'Whether the holiday falls on the same date every year' }, global: { type: 'boolean', description: 'Whether the holiday applies nationwide (true) or only to specific regions (false)' }, counties: { type: 'array', description: 'Array of county/region codes where the holiday applies (null if global)' }, types: { type: 'array', description: 'Holiday type classifications (e.g. Public, Bank, Optional)' } } } }
            }
        },
        getNextHolidays: {
            method: 'GET',
            path: '/api/v3/nextpublicholidays/:countryCode',
            description: 'Get upcoming public holidays for a country. Returns the next holidays from today onwards. Use listCountries for valid country codes. For historical data, use getPublicHolidays with a specific year.',
            parameters: [
                { position: { key: 'countryCode', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Next US holidays', countryCode: 'US' },
                { _description: 'Next German holidays', countryCode: 'DE' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'array', description: 'List of upcoming public holidays starting from today', items: { type: 'object', properties: { date: { type: 'string', description: 'Holiday date in YYYY-MM-DD format' }, localName: { type: 'string', description: 'Holiday name in the local language' }, name: { type: 'string', description: 'Holiday name in English' }, countryCode: { type: 'string', description: 'ISO 3166-1 alpha-2 country code' }, global: { type: 'boolean', description: 'Whether the holiday applies nationwide' }, types: { type: 'array', description: 'Holiday type classifications (e.g. Public, Bank, Optional)' } } } }
            }
        },
        getLongWeekends: {
            method: 'GET',
            path: '/api/v3/longweekend/:year/:countryCode',
            description: 'Get long weekends (holiday + adjacent weekend days) for a specific year and country. Returns start date, end date, day count, and whether a bridge day is needed. Useful for vacation planning around public holidays from getPublicHolidays.',
            parameters: [
                { position: { key: 'year', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'countryCode', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'German long weekends 2024', year: 2024, countryCode: 'DE' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'array', description: 'List of long weekends created by holidays adjacent to regular weekends', items: { type: 'object', properties: { startDate: { type: 'string', description: 'First day of the long weekend in YYYY-MM-DD format' }, endDate: { type: 'string', description: 'Last day of the long weekend in YYYY-MM-DD format' }, dayCount: { type: 'number', description: 'Total number of consecutive days off' }, needBridgeDay: { type: 'boolean', description: 'Whether taking an extra day off (bridge day) is needed to connect the weekend' } } } }
            }
        },
        listCountries: {
            method: 'GET',
            path: '/api/v3/availablecountries',
            description: 'List all available countries with their ISO 3166-1 alpha-2 country codes and names. Use the returned countryCode values with getPublicHolidays, getNextHolidays, and getLongWeekends.',
            parameters: [],
            tests: [
                { _description: 'List all countries' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'array', description: 'List of all countries supported by the Nager.Date API', items: { type: 'object', properties: { countryCode: { type: 'string', description: 'ISO 3166-1 alpha-2 country code (e.g. US, DE, GB)' }, name: { type: 'string', description: 'Full country name in English' } } } }
            }
        }
    }
}
