// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'mudab',
    name: 'MUDAB Marine Environment Database API',
    description: 'German Federal Institute of Hydrology (BfG) marine environment database providing monitoring data from coastal states and research institutions',
    version: '4.0.0',
    docs: ['https://mudab.api.bund.dev/'],
    tags: ['marine', 'germany', 'environment', 'monitoring', 'cacheTtlFrequent'],
    root: 'https://geoportal.bafg.de/mudab/rest/BaseController/FilterElements',
    headers: {
        'Content-Type': 'application/json'
    },
    tools: {
        getStations: {
            method: 'POST',
            path: '/STATION_SMALL',
            description: 'Get all marine monitoring stations. Returns station name, type, and compartment. Use station metadata to understand which parameters are measured at each location. See getParameters for available measurement types.',
            parameters: [],
            tests: [
                { _description: 'Get all marine stations' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response containing the array of marine monitoring stations',
                    properties: {
                        V_STATION_SMALL: { type: 'array', description: 'Array of marine monitoring station records', items: { type: 'object', properties: { metadataid: { type: 'number', description: 'Unique station metadata identifier' }, STATNAME_ST: { type: 'string', description: 'Station name' }, NAME_PS: { type: 'string', description: 'Project station name (alternative identifier)' }, STATIONTYPE_ST: { type: 'string', description: 'Station type classification (e.g. monitoring, research)' }, COMPT_DS: { type: 'string', description: 'Environmental compartment being measured (e.g. water, sediment, biota)' } } } }
                    }
                }
            },
        },
        getParameters: {
            method: 'POST',
            path: '/MV_PARAMETER',
            description: 'Get all measured parameters including pollutants, nutrients, and biological indicators with their parameter groups. Use to understand what measurements are available across monitoring stations from getStations.',
            parameters: [],
            tests: [
                { _description: 'Get all measurement parameters' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response containing the array of measurement parameter definitions',
                    properties: {
                        MV_PARAMETER: { type: 'array', description: 'Array of measurement parameter records', items: { type: 'object', properties: { metadataid: { type: 'number', description: 'Unique parameter metadata identifier' }, COMPT_DS: { type: 'string', description: 'Environmental compartment (e.g. water, sediment, biota)' }, PARAMETER: { type: 'string', description: 'Parameter code identifier' }, PARAMETERGRUPPE: { type: 'string', description: 'Parameter group code' }, PARAM_NAME: { type: 'string', description: 'Human-readable parameter name (e.g. Cadmium, Nitrate)' }, PARGROUP: { type: 'string', description: 'Parameter group code (alternative field)' }, PARAMGROUP_NAME: { type: 'string', description: 'Human-readable parameter group name (e.g. Heavy Metals, Nutrients)' } } } }
                    }
                }
            },
        },
        getProjectStations: {
            method: 'POST',
            path: '/PROJECTSTATION_SMALL',
            description: 'Get monitoring stations associated with specific research projects. Returns project-station associations with region and institute information. Complements getStations with project-level context.',
            parameters: [],
            tests: [
                { _description: 'Get project stations' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response containing the array of project-station associations',
                    properties: {
                        V_MUDAB_PROJECTSTATION: { type: 'array', description: 'Array of project-station association records', items: { type: 'object', properties: { metadataid: { type: 'number', description: 'Unique metadata identifier for this project-station record' }, PROJECTSTATIONID: { type: 'number', description: 'Unique project-station association identifier' }, NAME_PS: { type: 'string', description: 'Project station name' }, REGION: { type: 'string', description: 'Geographic region of the station (e.g. North Sea, Baltic Sea)' }, INSTITUT: { type: 'string', description: 'Research institute operating the station' } } } }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getStations: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw ) { return { response }}

            const key = Object.keys( raw )[ 0 ]
            const stations = raw[ key ] || []

            const formatted = stations
            .slice( 0, 200 )
            .map( ( s ) => {
            const result = {
            id: s.metadataid,
            name: s.STATNAME_ST || s.NAME_PS,
            type: s.STATIONTYPE_ST || null,
            compartment: s.COMPT_DS || null
            }

            return result
            } )

            response = {
            totalStations: stations.length,
            stationCount: formatted.length,
            stations: formatted
            }

            return { response }
        }
    },
    getParameters: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw ) { return { response }}

            const key = Object.keys( raw )[ 0 ]
            const params = raw[ key ] || []

            const formatted = params
            .slice( 0, 200 )
            .map( ( p ) => {
            const result = {
            id: p.metadataid,
            parameter: p.PARAMETER,
            name: p.PARAM_NAME,
            group: p.PARAMGROUP_NAME || p.PARGROUP,
            compartment: p.COMPT_DS || null
            }

            return result
            } )

            response = {
            totalParameters: params.length,
            parameterCount: formatted.length,
            parameters: formatted
            }

            return { response }
        }
    },
    getProjectStations: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw ) { return { response }}

            const key = Object.keys( raw )[ 0 ]
            const items = raw[ key ] || []

            response = {
            key,
            totalItems: items.length,
            items: items.slice( 0, 100 )
            }

            return { response }
        }
    }
} )
