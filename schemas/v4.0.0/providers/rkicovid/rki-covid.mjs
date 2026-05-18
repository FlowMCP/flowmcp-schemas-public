export const main = {
    namespace: 'rkicovid',
    name: 'RKI COVID-19',
    description: 'Access German COVID-19 epidemiology data from the Robert Koch Institute including national statistics, state-level data, district-level data, vaccination rates, and testing history.',
    docs: ['https://api.corona-zahlen.org/'],
    tags: ['health', 'epidemiology', 'covid', 'germany', 'rki', 'cacheTtlDaily'],
    version: '4.0.0',
    root: 'https://api.corona-zahlen.org',
    requiredServerParams: [],
    headers: {},
    tools: {
        getGermany: {
            method: 'GET',
            path: '/germany',
            description: 'Retrieve current national COVID-19 statistics for Germany including total cases, deaths, recovered, weekly incidence, R-value, and hospitalization data.',
            parameters: [],
            tests: [
                { _description: 'Get current Germany-wide COVID-19 statistics' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        cases: { type: 'number', description: 'Total cumulative cases' },
                        deaths: { type: 'number', description: 'Total deaths' },
                        recovered: { type: 'number', description: 'Total recovered' },
                        weekIncidence: { type: 'number', description: 'Cases per 100k population in last 7 days' },
                        casesPerWeek: { type: 'number', description: 'Absolute cases in last 7 days' },
                        delta: { type: 'object', description: 'Changes in cases, deaths, recovered, weekIncidence' },
                        r: { type: 'object', description: 'Reproduction rate (R-value) with 4-day and 7-day values' },
                        hospitalization: { type: 'object', description: 'Hospitalization data with 7-day cases and incidence' },
                        meta: { type: 'object', description: 'Source metadata and last update timestamp' }
                    }
                }
            }
        },
        getGermanyHistory: {
            method: 'GET',
            path: '/germany/history/cases/:days',
            description: 'Retrieve daily case history for Germany. Specify number of days to look back.',
            parameters: [
                { position: { key: 'days', value: '{{DAYS}}', location: 'insert' }, z: { primitive: 'number()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get last 7 days of case history', days: 7 },
                { _description: 'Get last 30 days of case history', days: 30 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        data: { type: 'array', description: 'Array of objects with cases (number) and date (ISO 8601 string)' },
                        meta: { type: 'object', description: 'Source metadata and last update timestamp' }
                    }
                }
            }
        },
        getStates: {
            method: 'GET',
            path: '/states',
            description: 'Retrieve COVID-19 statistics for all 16 German states (Bundeslaender). Data includes cases, deaths, incidence, and hospitalization per state.. Use IDs from results in getStateByAbbreviation',
            parameters: [],
            tests: [
                { _description: 'Get COVID-19 data for all German states' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        data: { type: 'object', description: 'Object keyed by state abbreviation (SH, HH, NI, HB, NW, HE, RP, BW, BY, SL, BE, BB, MV, SN, ST, TH) with full state data' },
                        meta: { type: 'object', description: 'Source metadata and last update timestamp' }
                    }
                }
            }
        },
        getStateByAbbreviation: {
            method: 'GET',
            path: '/states/:abbreviation',
            description: 'Retrieve COVID-19 statistics for a specific German state by its two-letter abbreviation.. Use getStates first to find valid IDs',
            parameters: [
                { position: { key: 'abbreviation', value: '{{STATE_ABBREVIATION}}', location: 'insert' }, z: { primitive: 'enum(SH,HH,NI,HB,NW,HE,RP,BW,BY,SL,BE,BB,MV,SN,ST,TH)', options: [] } }
            ],
            tests: [
                { _description: 'Get COVID-19 data for Bavaria', abbreviation: 'BY' },
                { _description: 'Get COVID-19 data for Berlin', abbreviation: 'BE' },
                { _description: 'Get COVID-19 data for Nordrhein-Westfalen', abbreviation: 'NW' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        data: { type: 'object', description: 'State data with id, name, abbreviation, population, cases, deaths, recovered, weekIncidence, delta, hospitalization' },
                        meta: { type: 'object', description: 'Source metadata and last update timestamp' }
                    }
                }
            }
        },
        getVaccinations: {
            method: 'GET',
            path: '/vaccinations',
            description: 'Retrieve vaccination statistics for Germany including total doses administered, vaccination rates by dose level, and breakdowns by vaccine manufacturer and age group.',
            parameters: [],
            tests: [
                { _description: 'Get German vaccination statistics' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'object',
                            description: 'Vaccination data with administeredVaccinations, vaccination/secondVaccination/boosterVaccination objects, states breakdown, and age group quotes'
                        },
                        meta: { type: 'object', description: 'Source metadata and last update timestamp' }
                    }
                }
            }
        },
        getDistricts: {
            method: 'GET',
            path: '/districts',
            description: 'Retrieve COVID-19 statistics for all German districts (Landkreise). Data keyed by AGS (Amtlicher Gemeindeschluessel) code.',
            parameters: [],
            tests: [
                { _description: 'Get COVID-19 data for all German districts' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        data: { type: 'object', description: 'Object keyed by AGS code with district data including name, state, population, cases, deaths, weekIncidence, delta' },
                        meta: { type: 'object', description: 'Source metadata and last update timestamp' }
                    }
                }
            }
        },
        getTestingHistory: {
            method: 'GET',
            path: '/testing/history',
            description: 'Retrieve weekly PCR testing history for Germany including number of tests performed, positive tests, positivity rate, and participating laboratory count.',
            parameters: [],
            tests: [
                { _description: 'Get PCR testing history for Germany' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'object',
                            properties: {
                                history: { type: 'array', description: 'Array of weekly entries with calendarWeek, performedTests, positiveTests, positivityRate, laboratoryCount' }
                            }
                        },
                        meta: { type: 'object', description: 'Source metadata and last update timestamp' }
                    }
                }
            }
        }
    }
}
