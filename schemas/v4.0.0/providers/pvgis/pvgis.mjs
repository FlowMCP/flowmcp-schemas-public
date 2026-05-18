export const main = {
    namespace: 'pvgis',
    name: 'PVGIS',
    description: 'Access the EU Photovoltaic Geographical Information System (PVGIS) by JRC. Calculate solar PV energy output, monthly and daily radiation, hourly time series, and horizon profiles for any location.',
    version: '4.0.0',
    docs: ['https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis/getting-started-pvgis/api-non-interactive-service_en'],
    tags: ['energy', 'solar', 'photovoltaic', 'radiation', 'climate', 'eu', 'cacheTtlStatic'],
    root: 'https://re.jrc.ec.europa.eu/api/v5_3',
    requiredServerParams: [],
    headers: {},
    tools: {
        pvCalculation: {
            method: 'GET',
            path: '/PVcalc',
            description: 'Calculate energy output of a grid-connected PV system for a given location. Supports fixed, single-axis, and two-axis tracking systems.',
            parameters: [
                { position: { key: 'lat', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'lon', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'peakpower', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'loss', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'pvtechchoice', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(crystSi,crystSi2025,CIS,CdTe,Unknown)', options: ['optional()', 'default(crystSi)'] } },
                { position: { key: 'mountingplace', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(free,building)', options: ['optional()', 'default(free)'] } },
                { position: { key: 'angle', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'aspect', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'optimalangles', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(0,1)', options: ['optional()', 'default(0)'] } },
                { position: { key: 'raddatabase', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(PVGIS-SARAH3,PVGIS-NSRDB,PVGIS-ERA5)', options: ['optional()'] } },
                { position: { key: 'outputformat', value: 'json', location: 'query' }, z: { primitive: 'enum(csv,basic,json)', options: ['default(json)'] } }
            ],
            tests: [
                { _description: 'PV calculation for Berlin (5kW, 14% loss)', lat: 52.52, lon: 13.405, peakpower: 5, loss: 14 },
                { _description: 'PV calc for Rome with optimal angles', lat: 41.9, lon: 12.5, peakpower: 3, loss: 14, optimalangles: 1 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        inputs: { type: 'object', properties: { location: { type: 'object' }, meteo_data: { type: 'object' }, mounting_system: { type: 'object' }, pv_module: { type: 'object' } } },
                        outputs: { type: 'object', properties: { monthly: { type: 'object' }, totals: { type: 'object' } } },
                        meta: { type: 'object' }
                    }
                }
            },
        },
        monthlyRadiation: {
            method: 'GET',
            path: '/MRcalc',
            description: 'Get monthly average solar radiation data for a location. Includes global horizontal irradiation, optimal angle radiation, direct normal irradiance, and temperature.',
            parameters: [
                { position: { key: 'lat', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'lon', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'horirrad', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(0,1)', options: ['optional()', 'default(1)'] } },
                { position: { key: 'optrad', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(0,1)', options: ['optional()', 'default(0)'] } },
                { position: { key: 'mr_dni', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(0,1)', options: ['optional()', 'default(0)'] } },
                { position: { key: 'avtemp', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(0,1)', options: ['optional()', 'default(0)'] } },
                { position: { key: 'startyear', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'endyear', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'raddatabase', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(PVGIS-SARAH3,PVGIS-NSRDB,PVGIS-ERA5)', options: ['optional()'] } },
                { position: { key: 'outputformat', value: 'json', location: 'query' }, z: { primitive: 'enum(csv,basic,json)', options: ['default(json)'] } }
            ],
            tests: [
                { _description: 'Monthly radiation for Munich', lat: 48.137, lon: 11.576, horirrad: 1 },
                { _description: 'Monthly radiation for Lisbon with temperature', lat: 38.72, lon: -9.14, horirrad: 1, avtemp: 1 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        inputs: { type: 'object', properties: { location: { type: 'object' }, meteo_data: { type: 'object' } } },
                        outputs: { type: 'object', properties: { monthly: { type: 'object' } } },
                        meta: { type: 'object' }
                    }
                }
            },
        },
        dailyRadiation: {
            method: 'GET',
            path: '/DRcalc',
            description: 'Get daily radiation profiles showing how solar irradiance varies throughout the day for a given month and location.',
            parameters: [
                { position: { key: 'lat', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'lon', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'month', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'global', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(0,1)', options: ['optional()', 'default(1)'] } },
                { position: { key: 'clearsky', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(0,1)', options: ['optional()', 'default(0)'] } },
                { position: { key: 'showtemperatures', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(0,1)', options: ['optional()', 'default(0)'] } },
                { position: { key: 'angle', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'aspect', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'raddatabase', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(PVGIS-SARAH3,PVGIS-NSRDB,PVGIS-ERA5)', options: ['optional()'] } },
                { position: { key: 'outputformat', value: 'json', location: 'query' }, z: { primitive: 'enum(csv,basic,json)', options: ['default(json)'] } }
            ],
            tests: [
                { _description: 'Daily radiation for Berlin in June', lat: 52.52, lon: 13.405, month: 6, global: 1 },
                { _description: 'Daily radiation for Madrid in December', lat: 40.42, lon: -3.7, month: 12, global: 1, showtemperatures: 1 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        inputs: { type: 'object', properties: { location: { type: 'object' }, meteo_data: { type: 'object' } } },
                        outputs: { type: 'object', properties: { daily_profile: { type: 'object' } } },
                        meta: { type: 'object' }
                    }
                }
            },
        },
        hourlySeries: {
            method: 'GET',
            path: '/seriescalc',
            description: 'Get hourly time series of solar radiation and optionally PV power output for a location over a range of years.',
            parameters: [
                { position: { key: 'lat', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'lon', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'pvcalculation', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(0,1)', options: ['optional()', 'default(0)'] } },
                { position: { key: 'peakpower', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'loss', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'angle', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'aspect', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'optimalangles', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(0,1)', options: ['optional()', 'default(0)'] } },
                { position: { key: 'startyear', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'endyear', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'components', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(0,1)', options: ['optional()', 'default(0)'] } },
                { position: { key: 'raddatabase', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(PVGIS-SARAH3,PVGIS-NSRDB,PVGIS-ERA5)', options: ['optional()'] } },
                { position: { key: 'outputformat', value: 'json', location: 'query' }, z: { primitive: 'enum(csv,basic,json)', options: ['default(json)'] } }
            ],
            tests: [
                { _description: 'Hourly radiation for Vienna 2020', lat: 48.21, lon: 16.37, startyear: 2020, endyear: 2020 },
                { _description: 'Hourly PV output for Berlin 2019', lat: 52.52, lon: 13.405, pvcalculation: 1, peakpower: 5, loss: 14, startyear: 2019, endyear: 2019 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        inputs: { type: 'object', properties: { location: { type: 'object' }, meteo_data: { type: 'object' } } },
                        outputs: { type: 'object', properties: { hourly: { type: 'array' } } },
                        meta: { type: 'object' }
                    }
                }
            },
        },
        typicalMeteoYear: {
            method: 'GET',
            path: '/tmy',
            description: 'Get Typical Meteorological Year (TMY) data for a location. TMY is a synthetic year of hourly data selected from a multi-year period to represent typical conditions.',
            parameters: [
                { position: { key: 'lat', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'lon', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'startyear', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'endyear', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'outputformat', value: 'json', location: 'query' }, z: { primitive: 'enum(csv,basic,json,epw)', options: ['default(json)'] } }
            ],
            tests: [
                { _description: 'TMY data for Berlin', lat: 52.52, lon: 13.405 },
                { _description: 'TMY data for Stockholm', lat: 59.33, lon: 18.07 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        inputs: { type: 'object', properties: { location: { type: 'object' }, meteo_data: { type: 'object' } } },
                        outputs: { type: 'object', properties: { tmy_hourly: { type: 'array' }, months_selected: { type: 'array' } } },
                        meta: { type: 'object' }
                    }
                }
            },
        },
        horizonProfile: {
            method: 'GET',
            path: '/printhorizon',
            description: 'Get the terrain horizon profile for a location. Shows elevation angles in all compass directions that may cause shading of solar panels.',
            parameters: [
                { position: { key: 'lat', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'lon', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'outputformat', value: 'json', location: 'query' }, z: { primitive: 'enum(csv,basic,json)', options: ['default(json)'] } }
            ],
            tests: [
                { _description: 'Horizon profile for Zurich', lat: 47.37, lon: 8.54 },
                { _description: 'Horizon profile for Alpine location', lat: 46.69, lon: 10.33 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        inputs: { type: 'object', properties: { location: { type: 'object' } } },
                        outputs: { type: 'object', properties: { horizon_profile: { type: 'array' } } },
                        meta: { type: 'object' }
                    }
                }
            },
        }
    }
}
