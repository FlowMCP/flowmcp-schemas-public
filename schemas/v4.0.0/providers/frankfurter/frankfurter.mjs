export const main = {
    namespace: 'frankfurter',
    name: 'Frankfurter Exchange Rates',
    description: 'Access foreign exchange rates published by the European Central Bank via the Frankfurter API. Get latest and historical rates for 30+ currencies. Query time series data between any two dates. Data updated daily around 16:00 CET. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://frankfurter.dev/docs'],
    tags: ['finance', 'currency', 'exchange', 'opendata', 'cacheTtlDaily'],
    root: 'https://api.frankfurter.dev',
    requiredServerParams: [],
    headers: {},
    tools: {
        getLatest: {
            method: 'GET',
            path: '/v1/latest',
            description: 'Get the latest exchange rates. Optionally specify base currency and target currencies. Default base is EUR. Use listCurrencies for valid currency codes.',
            parameters: [
                { position: { key: 'base', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(EUR)'] } },
                { position: { key: 'symbols', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Latest USD rates', base: 'USD' },
                { _description: 'EUR to GBP and JPY', base: 'EUR', symbols: 'GBP,JPY' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', description: 'Exchange rate response with base currency and rates map', properties: { amount: { type: 'number', description: 'Amount used for conversion (always 1.0)' }, base: { type: 'string', description: 'Base currency code (e.g. EUR, USD)' }, date: { type: 'string', description: 'Date of the rates in YYYY-MM-DD format' }, rates: { type: 'object', description: 'Map of currency codes to exchange rates relative to base (e.g. {"USD": 1.08, "GBP": 0.86})' } } }
            }
        },
        getHistorical: {
            method: 'GET',
            path: '/v1/:date',
            description: 'Get exchange rates for a specific historical date (YYYY-MM-DD). Data available from 1999-01-04 onwards. Optionally filter by base and target currencies. Same filters as getLatest. Use listCurrencies for valid codes.',
            parameters: [
                { position: { key: 'date', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'base', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(EUR)'] } },
                { position: { key: 'symbols', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Rates on 2024-01-02', date: '2024-01-02', base: 'USD' },
                { _description: 'EUR to GBP on 2023-06-15', date: '2023-06-15', symbols: 'GBP' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', description: 'Historical exchange rate response for a specific date', properties: { amount: { type: 'number', description: 'Amount used for conversion (always 1.0)' }, base: { type: 'string', description: 'Base currency code' }, date: { type: 'string', description: 'Actual date of rates in YYYY-MM-DD (may differ from requested if weekend/holiday)' }, rates: { type: 'object', description: 'Map of currency codes to exchange rates relative to base' } } }
            }
        },
        getTimeSeries: {
            method: 'GET',
            path: '/v1/:startDate..:endDate',
            description: 'Get exchange rate time series between two dates (YYYY-MM-DD..YYYY-MM-DD). Returns daily rates for the date range. Optionally filter by base and target currencies.',
            parameters: [
                { position: { key: 'startDate', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'endDate', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'base', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(EUR)'] } },
                { position: { key: 'symbols', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'USD to EUR Jan 2024', startDate: '2024-01-01', endDate: '2024-01-05', base: 'USD', symbols: 'EUR' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', description: 'Time series of daily exchange rates between two dates', properties: { amount: { type: 'number', description: 'Amount used for conversion (always 1.0)' }, base: { type: 'string', description: 'Base currency code' }, start_date: { type: 'string', description: 'Start of the date range in YYYY-MM-DD' }, end_date: { type: 'string', description: 'End of the date range in YYYY-MM-DD' }, rates: { type: 'object', description: 'Map of dates to rate objects — each date key maps to {currencyCode: rate} (e.g. {"2024-01-02": {"USD": 1.08}})' } } }
            }
        },
        listCurrencies: {
            method: 'GET',
            path: '/v1/currencies',
            description: 'List all available currencies with their full names. Returns currency codes (EUR, USD, GBP, etc.) mapped to currency names. Use these codes as base/symbols values in getLatest, getHistorical, and getTimeSeries.',
            parameters: [],
            tests: [
                { _description: 'List all currencies' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', description: 'Map of currency codes to full currency names (e.g. {"EUR": "Euro", "USD": "United States Dollar"})' }
            }
        }
    }
}
