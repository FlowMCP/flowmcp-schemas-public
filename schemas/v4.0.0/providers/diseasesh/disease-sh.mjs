export const main = {
    namespace: 'diseasesh',
    name: 'Disease.sh Epidemic Data',
    description: 'Access global epidemic data from disease.sh (formerly NovelCOVID). Get COVID-19 statistics for 200+ countries, US states, and historical timelines. Also covers influenza and vaccine data. Updated every 10 minutes from Johns Hopkins, Worldometers, and government sources. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://disease.sh/docs/'],
    tags: ['health', 'covid', 'statistics', 'opendata', 'cacheTtlFrequent'],
    root: 'https://disease.sh',
    requiredServerParams: [],
    headers: {},
    tools: {
        getGlobalStats: {
            method: 'GET',
            path: '/v3/covid-19/all',
            description: 'Get global COVID-19 statistics. Returns total cases, deaths, recovered, active, critical, tests, population, and today\'s numbers.',
            parameters: [],
            tests: [
                { _description: 'Get global COVID-19 stats' },
                { _description: 'Fetch worldwide COVID-19 totals' },
                { _description: 'Get global pandemic summary data' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { updated: { type: 'number', description: 'Unix timestamp of last data update' }, cases: { type: 'number', description: 'Total confirmed cases worldwide' }, todayCases: { type: 'number', description: 'New cases reported today' }, deaths: { type: 'number', description: 'Total deaths worldwide' }, todayDeaths: { type: 'number', description: 'New deaths reported today' }, recovered: { type: 'number', description: 'Total recovered worldwide' }, active: { type: 'number', description: 'Currently active cases' }, critical: { type: 'number', description: 'Cases in critical condition' }, casesPerOneMillion: { type: 'number', description: 'Cases per one million population' }, deathsPerOneMillion: { type: 'number', description: 'Deaths per one million population' }, tests: { type: 'number', description: 'Total tests conducted' }, population: { type: 'number', description: 'World population estimate' }, activePerOneMillion: { type: 'number', description: 'Active cases per one million population' }, affectedCountries: { type: 'number', description: 'Number of countries with confirmed cases' } } }
            }
        },
        getCountryStats: {
            method: 'GET',
            path: '/v3/covid-19/countries/:country',
            description: 'Get COVID-19 statistics for a specific country. Use country name, ISO2, ISO3, or country ID. Returns cases, deaths, recovered, tests, and per-million metrics.',
            parameters: [
                { position: { key: 'country', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'Country name, ISO2, ISO3, or numeric country ID' }
            ],
            tests: [
                { _description: 'Germany COVID stats', country: 'germany' },
                { _description: 'USA COVID stats', country: 'usa' },
                { _description: 'Brazil COVID stats', country: 'brazil' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { updated: { type: 'number', description: 'Unix timestamp of last data update' }, country: { type: 'string', description: 'Country name' }, countryInfo: { type: 'object', description: 'Country metadata including ISO codes and flag', properties: { iso2: { type: 'string', description: 'ISO 3166-1 alpha-2 country code' }, iso3: { type: 'string', description: 'ISO 3166-1 alpha-3 country code' }, flag: { type: 'string', description: 'URL to country flag image' } } }, cases: { type: 'number', description: 'Total confirmed cases' }, todayCases: { type: 'number', description: 'New cases reported today' }, deaths: { type: 'number', description: 'Total deaths' }, todayDeaths: { type: 'number', description: 'New deaths reported today' }, recovered: { type: 'number', description: 'Total recovered' }, active: { type: 'number', description: 'Currently active cases' }, critical: { type: 'number', description: 'Cases in critical condition' }, casesPerOneMillion: { type: 'number', description: 'Cases per one million population' }, tests: { type: 'number', description: 'Total tests conducted' }, population: { type: 'number', description: 'Country population' }, continent: { type: 'string', description: 'Continent the country belongs to' } } }
            }
        },
        getAllCountries: {
            method: 'GET',
            path: '/v3/covid-19/countries',
            description: 'Get COVID-19 statistics for all countries. Can be sorted by cases, deaths, recovered, active, critical, or tests. Returns 200+ countries.',
            parameters: [
                { position: { key: 'sort', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(cases,todayCases,deaths,todayDeaths,recovered,active,critical,tests)', options: ['optional()', 'default(cases)'] }, description: 'Sort countries by metric: cases, todayCases, deaths, todayDeaths, recovered, active, critical, or tests' }
            ],
            tests: [
                { _description: 'Countries sorted by cases', sort: 'cases' },
                { _description: 'Countries sorted by deaths', sort: 'deaths' },
                { _description: 'Countries sorted by active cases', sort: 'active' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'array', items: { type: 'object', properties: { country: { type: 'string', description: 'Country name' }, countryInfo: { type: 'object', description: 'Country metadata', properties: { iso2: { type: 'string', description: 'ISO 3166-1 alpha-2 code' }, flag: { type: 'string', description: 'Country flag image URL' } } }, cases: { type: 'number', description: 'Total confirmed cases' }, deaths: { type: 'number', description: 'Total deaths' }, recovered: { type: 'number', description: 'Total recovered' }, active: { type: 'number', description: 'Currently active cases' }, population: { type: 'number', description: 'Country population' } } } }
            }
        },
        getHistorical: {
            method: 'GET',
            path: '/v3/covid-19/historical/:country',
            description: 'Get historical COVID-19 data for a country. Returns daily cases, deaths, and recovered over time. Use lastdays parameter to limit (default 30, max 9999 for all data).',
            parameters: [
                { position: { key: 'country', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'Country name, ISO2, ISO3, or numeric country ID' },
                { position: { key: 'lastdays', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(30)'] }, description: 'Number of days of historical data to return (default 30, max 9999 for all)' }
            ],
            tests: [
                { _description: 'Germany last 7 days', country: 'germany', lastdays: 7 },
                { _description: 'USA last 30 days', country: 'usa', lastdays: 30 },
                { _description: 'India last 14 days', country: 'india', lastdays: 14 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { country: { type: 'string', description: 'Country name' }, province: { type: 'array', description: 'List of provinces with data' }, timeline: { type: 'object', description: 'Historical timeline data with date-keyed objects', properties: { cases: { type: 'object', description: 'Daily cumulative case counts keyed by date' }, deaths: { type: 'object', description: 'Daily cumulative death counts keyed by date' }, recovered: { type: 'object', description: 'Daily cumulative recovery counts keyed by date' } } } } }
            }
        },
        getContinentStats: {
            method: 'GET',
            path: '/v3/covid-19/continents/:continent',
            description: 'Get COVID-19 statistics for a specific continent. Returns aggregated data for all countries in the continent.',
            parameters: [
                { position: { key: 'continent', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(North America,South America,Europe,Asia,Africa,Oceania)', options: [] }, description: 'Continent name to query statistics for' }
            ],
            tests: [
                { _description: 'Europe COVID stats', continent: 'Europe' },
                { _description: 'Asia COVID stats', continent: 'Asia' },
                { _description: 'North America COVID stats', continent: 'North America' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { updated: { type: 'number', description: 'Unix timestamp of last data update' }, continent: { type: 'string', description: 'Continent name' }, cases: { type: 'number', description: 'Total confirmed cases across all countries' }, deaths: { type: 'number', description: 'Total deaths across all countries' }, recovered: { type: 'number', description: 'Total recovered across all countries' }, active: { type: 'number', description: 'Currently active cases' }, critical: { type: 'number', description: 'Cases in critical condition' }, population: { type: 'number', description: 'Total continent population' }, countries: { type: 'array', description: 'List of country names in this continent', items: { type: 'string' } } } }
            }
        }
    }
}
