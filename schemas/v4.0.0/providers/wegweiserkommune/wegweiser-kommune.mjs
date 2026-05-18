export const main = {
    namespace: 'wegweiserkommune',
    name: 'Wegweiser Kommune Municipal Statistics',
    description: 'Access German municipal statistics from Wegweiser Kommune by Bertelsmann Stiftung. Query 100+ demographic, social, and economic indicators for all German cities with 5,000+ residents. Covers childcare, education, demographics, finances, integration, social affairs, and population forecasts from 2006-2040. Data licensed CC0 (public domain). Free, no API key required.',
    version: '4.0.0',
    docs: ['https://www.wegweiser-kommune.de/open-data'],
    tags: ['statistics', 'germany', 'demographics', 'opendata', 'cacheTtlDaily'],
    root: 'https://www.wegweiser-kommune.de/data-api',
    requiredServerParams: [],
    headers: {
        'Accept': 'application/json'
    },
    tools: {
        listIndicators: {
            method: 'GET',
            path: '/rest/indicator/list',
            description: 'List all 100+ available indicators with metadata. Each indicator includes name, explanation, calculation formula, data source, unit, available years, and minimum/maximum region granularity. Indicators cover childcare, education, demographics, integration, social affairs, finances, and more.',
            parameters: [],
            tests: [
                { _description: 'List all available indicators' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'array', items: { type: 'object', properties: { id: { type: 'number' }, name: { type: 'string' }, title: { type: 'string' }, type: { type: 'string' }, explanation: { type: 'string' }, calculation: { type: 'string' }, source: { type: 'string' }, unit: { type: 'string' }, friendlyUrl: { type: 'string' }, years: { type: 'array', items: { type: 'number' } }, topics: { type: 'array', items: { type: 'string' } } } } }
            }
        },
        listTopics: {
            method: 'GET',
            path: '/rest/topic/list',
            description: 'List all topic categories with their associated indicators. Topics include Kinderbetreuung, Bildung, Demografischer Wandel, Integration, Soziale Lage, Finanzen, and population forecasts. Each topic contains nested indicator objects.',
            parameters: [],
            tests: [
                { _description: 'List all topic categories' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'array', items: { type: 'object', properties: { id: { type: 'number' }, name: { type: 'string' }, title: { type: 'string' }, friendlyUrl: { type: 'string' }, type: { type: 'string' }, indicators: { type: 'array' }, topics: { type: 'array' } } } }
            }
        },
        listRegions: {
            method: 'GET',
            path: '/rest/region/list',
            description: 'List all available regions (German cities with 5,000+ residents). Returns region IDs, AGS codes (Amtlicher Gemeindeschluessel), ARS codes, region type, demographic type, and parent region. Types: KREISFREIE_STADT, KREIS, GEMEINDE, etc.',
            parameters: [],
            tests: [
                { _description: 'List all available regions' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'array', items: { type: 'object', properties: { friendlyUrl: { type: 'string' }, name: { type: 'string' }, title: { type: 'string' }, id: { type: 'number' }, ags: { type: 'string' }, ars: { type: 'string' }, type: { type: 'string' }, demographicType: { type: 'number' }, parent: { type: 'string' } } } }
            }
        },
        getStatisticsTypes: {
            method: 'GET',
            path: '/rest/statistics/types',
            description: 'List available statistics types with year ranges and visualization options. Types: COMMUNAL_DATA (2006-2023), POPULATION_FORECAST (2020-2040), AGE_STRUCTURE, AGE_STRUCTURE_FORECAST. Each type lists supported renderer types (TABLE, BAR_CHART, LINE_CHART, MAP).',
            parameters: [],
            tests: [
                { _description: 'List statistics types with available years' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'array', items: { type: 'object', properties: { type: { type: 'string' }, name: { type: 'string' }, years: { type: 'array', items: { type: 'number' } }, rendererTypes: { type: 'array', items: { type: 'string' } }, indicatorsAvailable: { type: 'boolean' } } } }
            }
        },
        getStatisticsData: {
            method: 'GET',
            path: '/rest/statistics/data/:friendlyUrl',
            description: 'Get actual statistics data using a friendly URL path. The friendlyUrl is constructed as: indicator+region+years+renderer (plus-separated). Example: arbeitslosenquote+berlin+2020-2023+tabelle. Returns region data, indicator metadata, and the actual data values.',
            parameters: [
                { position: { key: 'friendlyUrl', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Childcare rate Berlin 2020-2023', friendlyUrl: '3-bis-5-jaehrige-in-tageseinrichtungen+berlin+2020-2023+tabelle' },
                { _description: 'Population Munich 2020-2023', friendlyUrl: 'bevoelkerungsentwicklung+muenchen+2020-2023+tabelle' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { regionsAndRegionFilters: { type: 'array' }, indicatorsAndTopics: { type: 'array' }, renderer: { type: 'string' }, years: { type: 'array', items: { type: 'number' } }, data: { type: 'array' } } }
            }
        },
        getIndicatorInfo: {
            method: 'GET',
            path: '/rest/indicator/get/:friendlyUrl',
            description: 'Get detailed metadata for a specific indicator by its friendly URL. Returns calculation formula, data source, unit, available years, supported region types, and topic categorization.',
            parameters: [
                { position: { key: 'friendlyUrl', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get childcare indicator info', friendlyUrl: '3-bis-5-jaehrige-in-tageseinrichtungen' },
                { _description: 'Get population development info', friendlyUrl: 'bevoelkerungsentwicklung' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { id: { type: 'number' }, name: { type: 'string' }, title: { type: 'string' }, explanation: { type: 'string' }, calculation: { type: 'string' }, source: { type: 'string' }, unit: { type: 'string' }, friendlyUrl: { type: 'string' }, years: { type: 'array', items: { type: 'number' } }, topics: { type: 'array', items: { type: 'string' } } } }
            }
        },
        getRegionInfo: {
            method: 'GET',
            path: '/rest/region/get/:friendlyUrl',
            description: 'Get detailed information about a specific region by its friendly URL. Returns AGS code, region type, demographic type, parent region, and available statistics.',
            parameters: [
                { position: { key: 'friendlyUrl', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get Berlin region info', friendlyUrl: 'berlin' },
                { _description: 'Get Munich region info', friendlyUrl: 'muenchen' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { friendlyUrl: { type: 'string' }, name: { type: 'string' }, title: { type: 'string' }, id: { type: 'number' }, ags: { type: 'string' }, type: { type: 'string' }, demographicType: { type: 'number' }, parent: { type: 'string' } } }
            }
        },
        listDemographicTypes: {
            method: 'GET',
            path: '/rest/demographicTypes',
            description: 'List all demographic types used to categorize regions. The Bertelsmann Stiftung classifies German municipalities into demographic types based on population structure, growth trends, and socioeconomic characteristics.',
            parameters: [],
            tests: [
                { _description: 'List all demographic types' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'array', items: { type: 'object', properties: { number: { type: 'number' }, name: { type: 'string' }, description: { type: 'string' } } } }
            }
        }
    }
}
