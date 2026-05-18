export const main = {
    namespace: 'eeawaterbase',
    name: 'EEA DISCODATA',
    description: 'Query European Environment Agency datasets via the DISCODATA SQL-to-JSON API. Access environmental data on CO2 emissions, biodiversity (EUNIS), and climate policies using Transact-SQL queries. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://discodata.eea.europa.eu/Help.html'],
    tags: ['environment', 'europe', 'opendata', 'science', 'climate', 'cacheTtlDaily'],
    root: 'https://discodata.eea.europa.eu',
    requiredServerParams: [],
    headers: {},
    tools: {
        runQuery: {
            method: 'GET',
            path: '/sql',
            description: 'Execute a Transact-SQL SELECT query against EEA DISCODATA and return JSON results. Use [Database].[version].[Table] format. Known databases: EUNIS (biodiversity), CO2Emission (vehicle emissions), GHGPAMS (climate policies). For typed queries, use queryCo2Cars, queryClimatePolicies, or queryEunisSpecies instead.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'p', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } },
                { position: { key: 'nrOfHits', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(100)', 'max(10000)'] } }
            ],
            tests: [
                { _description: 'Query EUNIS species at Austrian site', query: "SELECT TOP 5 * FROM [EUNIS].[v1].[Site_Species] WHERE code_site = 'AT1101112'", p: 1, nrOfHits: 5 },
                { _description: 'Count EUNIS species records', query: 'SELECT count(*) as total FROM [EUNIS].[v1].[Site_Species]', p: 1, nrOfHits: 1 },
                { _description: 'List available CO2 emission years', query: 'SELECT DISTINCT year FROM [CO2Emission].[latest].[co2cars] ORDER BY year DESC', p: 1, nrOfHits: 20 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'DISCODATA SQL query result set',
                    properties: {
                        results: { type: 'array', description: 'Array of row objects with keys matching the SELECT column names', items: { type: 'object' } }
                    }
                }
            },
        },
        queryCo2Cars: {
            method: 'GET',
            path: '/sql',
            description: 'Query CO2 emissions data for passenger cars in Europe from [CO2Emission].[latest].[co2cars]. Key columns: MS (country code), Mk (manufacturer), Cn (model), Ft (fuel type: P=petrol, D=diesel, E=electric), Enedc/Ewltp (g CO2/km), Ep (engine power in KW), year, status. Use runQuery for ad-hoc exploration.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'p', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } },
                { position: { key: 'nrOfHits', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(100)', 'max(10000)'] } }
            ],
            tests: [
                { _description: 'Get 10 Volkswagen cars from 2019', query: "SELECT TOP 10 MS, Mk, Cn, Ft, [Ewltp (g/km)], [Ep (KW)] FROM [CO2Emission].[latest].[co2cars] WHERE year = 2019 AND Mk = 'VOLKSWAGEN'", p: 1, nrOfHits: 10 },
                { _description: 'Get Tesla electric vehicles', query: "SELECT TOP 10 MS, Mk, Cn, Ft, [Ewltp (g/km)], [Ep (KW)] FROM [CO2Emission].[latest].[co2cars] WHERE Mk = 'TESLA MOTORS' AND Ft = 'ELECTRIC'", p: 1, nrOfHits: 10 },
                { _description: 'Average emissions by fuel type for 2020', query: "SELECT Ft, AVG([Ewltp (g/km)]) as avg_co2 FROM [CO2Emission].[latest].[co2cars] WHERE year = 2020 GROUP BY Ft", p: 1, nrOfHits: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'CO2 emissions query result for European passenger cars',
                    properties: {
                        results: { type: 'array', description: 'Array of vehicle emission records', items: { type: 'object', properties: { MS: { type: 'string', description: 'EU member state country code (e.g. DE, FR, IT)' }, Mk: { type: 'string', description: 'Vehicle manufacturer name (e.g. VOLKSWAGEN, BMW)' }, Cn: { type: 'string', description: 'Commercial vehicle model name' }, Ft: { type: 'string', description: 'Fuel type code: P=petrol, D=diesel, E=electric, PHE=plug-in hybrid' } } } }
                    }
                }
            },
        },
        queryClimatePolicies: {
            method: 'GET',
            path: '/sql',
            description: 'Query EU climate change policies and measures (PAMs) from [GHGPAMS].[latest].[PAMs_Viewer_Flat_file_final_elasticsearch]. Key columns: Country, Name_of_policy_or_measure, Status_of_implementation, Type_of_policy_instrument, Sector_s__affected. Use runQuery for ad-hoc exploration.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'p', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } },
                { position: { key: 'nrOfHits', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(100)', 'max(10000)'] } }
            ],
            tests: [
                { _description: 'Get Austrian climate policies', query: "SELECT TOP 10 Country, Name_of_policy_or_measure, Status_of_implementation, Type_of_policy_instrument FROM [GHGPAMS].[latest].[PAMs_Viewer_Flat_file_final_elasticsearch] WHERE Country = 'Austria'", p: 1, nrOfHits: 10 },
                { _description: 'Get German transport sector policies', query: "SELECT TOP 10 Country, Name_of_policy_or_measure, Status_of_implementation FROM [GHGPAMS].[latest].[PAMs_Viewer_Flat_file_final_elasticsearch] WHERE Country = 'Germany' AND Sector_s__affected LIKE '%Transport%'", p: 1, nrOfHits: 10 },
                { _description: 'Count policies by country', query: "SELECT Country, COUNT(*) as policy_count FROM [GHGPAMS].[latest].[PAMs_Viewer_Flat_file_final_elasticsearch] GROUP BY Country ORDER BY policy_count DESC", p: 1, nrOfHits: 30 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'EU climate policy query result from the GHGPAMS database',
                    properties: {
                        results: { type: 'array', description: 'Array of climate policy records', items: { type: 'object', properties: { Country: { type: 'string', description: 'EU member state name (e.g. Austria, Germany)' }, Name_of_policy_or_measure: { type: 'string', description: 'Official name of the climate policy or measure' }, Status_of_implementation: { type: 'string', description: 'Implementation status (e.g. Implemented, Planned, Adopted)' }, Type_of_policy_instrument: { type: 'string', description: 'Policy instrument type (e.g. Economic, Regulatory, Voluntary)' } } } }
                    }
                }
            },
        },
        queryEunisSpecies: {
            method: 'GET',
            path: '/sql',
            description: 'Query EUNIS biodiversity data for species at European protected sites from [EUNIS].[v1].[Site_Species]. Key columns: code_site, id_eunis, code_2000, species_name, species_group_name, picture_url. Use runQuery for ad-hoc exploration across any DISCODATA table.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'p', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } },
                { position: { key: 'nrOfHits', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(100)', 'max(10000)'] } }
            ],
            tests: [
                { _description: 'Get species at Austrian site', query: "SELECT * FROM [EUNIS].[v1].[Site_Species] WHERE code_site = 'AT1101112'", p: 1, nrOfHits: 10 },
                { _description: 'Get flowering plants across sites', query: "SELECT TOP 10 code_site, species_name FROM [EUNIS].[v1].[Site_Species] WHERE species_group_name = 'Flowering Plants'", p: 1, nrOfHits: 10 },
                { _description: 'Count species per group', query: "SELECT species_group_name, COUNT(*) as cnt FROM [EUNIS].[v1].[Site_Species] GROUP BY species_group_name ORDER BY cnt DESC", p: 1, nrOfHits: 20 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'EUNIS biodiversity query result for species at protected European sites',
                    properties: {
                        results: { type: 'array', description: 'Array of species occurrence records', items: { type: 'object', properties: { code_site: { type: 'string', description: 'Natura 2000 / EUNIS site code (e.g. AT1101112)' }, id_eunis: { type: 'number', description: 'EUNIS species numeric identifier' }, species_name: { type: 'string', description: 'Scientific species name (Latin binomial)' }, species_group_name: { type: 'string', description: 'Taxonomic group (e.g. Flowering Plants, Mammals, Birds)' }, picture_url: { type: 'string', description: 'URL to species photo on EUNIS portal (may be null)' } } } }
                    }
                }
            },
        }
    }
}
