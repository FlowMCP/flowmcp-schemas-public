export const main = {
    namespace: 'hebcal',
    name: 'Hebcal Jewish Calendar',
    description: 'Access the Hebcal Jewish Calendar API for holidays, Shabbat times, and date conversion. Get Jewish holidays and events by year, Shabbat candle lighting times by location, and convert between Gregorian and Hebrew dates. Covers major and minor holidays, fast days, and Torah readings. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://www.hebcal.com/home/developer-apis'],
    tags: ['reference', 'calendar', 'religion', 'opendata', 'cacheTtlDaily'],
    root: 'https://www.hebcal.com',
    requiredServerParams: [],
    headers: {},
    tools: {
        getHolidays: {
            method: 'GET',
            path: '/hebcal',
            description: 'Get Jewish holidays and events for a given year and month. Set maj=on for major holidays, min=on for minor holidays, nx=on for Rosh Chodesh, ss=on for special Shabbatot.',
            parameters: [
                { position: { key: 'v', value: '1', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'cfg', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'year', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'month', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'maj', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(on,off)', options: ['optional()', 'default(on)'] } },
                { position: { key: 'min', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(on,off)', options: ['optional()', 'default(on)'] } }
            ],
            tests: [
                { _description: 'Jewish holidays 2024', v: '1', cfg: 'json', year: 2024, maj: 'on', min: 'on' },
                { _description: 'Major holidays March 2024', v: '1', cfg: 'json', year: 2024, month: 3, maj: 'on' },
                { _description: 'Holidays for 2025', v: '1', cfg: 'json', year: 2025, maj: 'on', min: 'on' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', description: 'Jewish holidays and events for the specified year/month', properties: { title: { type: 'string', description: 'Calendar title with year range' }, date: { type: 'string', description: 'Calendar generation timestamp' }, items: { type: 'array', description: 'Array of holiday and event objects', items: { type: 'object', properties: { title: { type: 'string', description: 'Holiday name in English (e.g. Passover, Yom Kippur)' }, date: { type: 'string', description: 'Gregorian date in YYYY-MM-DD format' }, hdate: { type: 'string', description: 'Hebrew date (e.g. 15 Nisan 5784)' }, category: { type: 'string', description: 'Event category (holiday, candles, havdalah, parashat, omer, dafyomi)' }, subcat: { type: 'string', description: 'Subcategory (major, minor, fast, modern, shabbat)' }, hebrew: { type: 'string', description: 'Holiday name in Hebrew characters' }, memo: { type: 'string', description: 'Additional information about the holiday or event' } } } } } }
            }
        },
        getShabbatTimes: {
            method: 'GET',
            path: '/shabbat',
            description: 'Get Shabbat candle lighting and Havdalah times for a location by GeoNames ID. Returns candle lighting time, Havdalah time, Torah reading, and next Shabbat info.',
            parameters: [
                { position: { key: 'cfg', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'geo', value: 'geoname', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'geonameid', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Shabbat times Jerusalem (281184)', cfg: 'json', geo: 'geoname', geonameid: 281184 },
                { _description: 'Shabbat times New York (5128581)', cfg: 'json', geo: 'geoname', geonameid: 5128581 },
                { _description: 'Shabbat times London (2643743)', cfg: 'json', geo: 'geoname', geonameid: 2643743 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', description: 'Shabbat times and Torah reading for the specified location', properties: { title: { type: 'string', description: 'Shabbat times title with location name' }, date: { type: 'string', description: 'Response generation timestamp' }, location: { type: 'object', description: 'Geographic location details used for time calculation', properties: { title: { type: 'string', description: 'Location display name' }, city: { type: 'string', description: 'City name' }, tzid: { type: 'string', description: 'IANA timezone identifier (e.g. Asia/Jerusalem)' }, latitude: { type: 'number', description: 'Latitude coordinate' }, longitude: { type: 'number', description: 'Longitude coordinate' }, cc: { type: 'string', description: 'ISO 3166-1 country code (e.g. IL, US)' }, country: { type: 'string', description: 'Full country name' } } }, items: { type: 'array', description: 'Shabbat events: candle lighting, Torah reading, Havdalah', items: { type: 'object', properties: { title: { type: 'string', description: 'Event name (Candle lighting, Parashat X, Havdalah)' }, date: { type: 'string', description: 'ISO 8601 date and time for the event' }, category: { type: 'string', description: 'Event category (candles, parashat, havdalah)' }, hebrew: { type: 'string', description: 'Event name in Hebrew characters' } } } } } }
            }
        },
        convertDate: {
            method: 'GET',
            path: '/converter',
            description: 'Convert between Gregorian and Hebrew calendar dates. Use g2h=1 for Gregorian-to-Hebrew, h2g=1 for Hebrew-to-Gregorian.',
            parameters: [
                { position: { key: 'cfg', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'gy', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'gm', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'gd', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'g2h', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Convert March 15 2024 to Hebrew', cfg: 'json', gy: 2024, gm: 3, gd: 15, g2h: 1 },
                { _description: 'Convert January 1 2025 to Hebrew', cfg: 'json', gy: 2025, gm: 1, gd: 1, g2h: 1 },
                { _description: 'Convert December 25 2024 to Hebrew', cfg: 'json', gy: 2024, gm: 12, gd: 25, g2h: 1 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', description: 'Converted date with both Gregorian and Hebrew calendar components', properties: { gy: { type: 'number', description: 'Gregorian year' }, gm: { type: 'number', description: 'Gregorian month (1-12)' }, gd: { type: 'number', description: 'Gregorian day of month' }, hy: { type: 'number', description: 'Hebrew year (e.g. 5784)' }, hm: { type: 'string', description: 'Hebrew month name (e.g. Nisan, Tishrei, Adar)' }, hd: { type: 'number', description: 'Hebrew day of month' }, hebrew: { type: 'string', description: 'Full Hebrew date in Hebrew characters' }, events: { type: 'array', description: 'Any Jewish holidays or events occurring on this date' } } }
            }
        }
    }
}
