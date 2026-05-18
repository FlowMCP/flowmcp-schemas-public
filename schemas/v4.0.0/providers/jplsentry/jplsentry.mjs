export const main = {
    namespace: 'jplsentry',
    name: 'JPL Sentry',
    description: 'Access NASA JPL Sentry system for near-Earth object impact risk assessment — retrieve impact probability data, Palermo scale ratings, and virtual impactor details.',
    version: '4.0.0',
    docs: ['https://ssd-api.jpl.nasa.gov/doc/sentry.html'],
    tags: ['nasa', 'space', 'asteroid', 'impact', 'neo', 'science', 'cacheTtlDaily'],
    root: 'https://ssd-api.jpl.nasa.gov',
    requiredServerParams: [],
    headers: {},
    tools: {
        getSentryObject: {
            method: 'GET',
            path: '/sentry.api',
            description: 'Retrieve Sentry impact risk data for a specific near-Earth object by designation.',
            parameters: [
                { position: { key: 'des', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Object designation, e.g. "2000 SG344" or "101955" for Bennu' }
            ],
            tests: [
                { _description: 'Get impact risk data for Apophis (99942)', des: '99942' },
                { _description: 'Get impact risk data for 2000 SG344', des: '2000 SG344' },
                { _description: 'Get impact risk data for Bennu (101955)', des: '101955' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        signature: { type: 'object', description: 'API version and source info', properties: { source: { type: 'string' }, version: { type: 'string' } } },
                        summary: { type: 'object', description: 'Summary risk data including designation, impact probability, Palermo scale, diameter, and observation dates', properties: { fullname: { type: 'string' }, des: { type: 'string' }, h: { type: 'string' }, ip: { type: 'string' }, ps_cum: { type: 'string' }, ps_max: { type: 'string' }, ts_max: { type: 'string' }, n_imp: { type: 'number' }, v_imp: { type: 'string' }, v_inf: { type: 'string' }, diameter: { type: 'string' }, mass: { type: 'string' }, energy: { type: 'string' }, first_obs: { type: 'string' }, last_obs: { type: 'string' }, nobs: { type: 'number' } } },
                        data: { type: 'array', description: 'Individual virtual impactor records with date, impact probability, Palermo scale, and energy', items: { type: 'object', properties: { date: { type: 'string' }, ip: { type: 'string' }, ps: { type: 'string' }, ts: { type: 'string' }, energy: { type: 'string' }, sigma_vi: { type: 'string' } } } },
                        error: { type: 'string', description: 'Error message when the object is not found or has been removed from Sentry' },
                        removed: { type: 'string', description: 'Removal timestamp when the queried object was removed from the Sentry catalog' }
                    }
                }
            }
        },
        getSentryObjectBySpk: {
            method: 'GET',
            path: '/sentry.api',
            description: 'Retrieve Sentry impact risk data for a specific near-Earth object by SPK-ID.',
            parameters: [
                { position: { key: 'spk', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] }, description: 'SPK-ID (Small-body Primary Key), a unique numeric identifier assigned by JPL, e.g. 2101955 for Bennu' }
            ],
            tests: [
                { _description: 'Get impact risk data for Apophis by SPK-ID', spk: 2099942 },
                { _description: 'Get impact risk data for Bennu by SPK-ID', spk: 2101955 },
                { _description: 'Get impact risk data for 1950 DA by SPK-ID', spk: 2029075 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        signature: { type: 'object', description: 'API version and source info', properties: { source: { type: 'string' }, version: { type: 'string' } } },
                        summary: { type: 'object', description: 'Summary risk data including designation, impact probability, Palermo scale, diameter, and observation dates', properties: { fullname: { type: 'string' }, des: { type: 'string' }, h: { type: 'string' }, ip: { type: 'string' }, ps_cum: { type: 'string' }, ps_max: { type: 'string' }, ts_max: { type: 'string' }, n_imp: { type: 'number' }, v_imp: { type: 'string' }, v_inf: { type: 'string' }, diameter: { type: 'string' }, mass: { type: 'string' }, energy: { type: 'string' }, first_obs: { type: 'string' }, last_obs: { type: 'string' }, nobs: { type: 'number' } } },
                        data: { type: 'array', description: 'Individual virtual impactor records with date, impact probability, Palermo scale, and energy', items: { type: 'object', properties: { date: { type: 'string' }, ip: { type: 'string' }, ps: { type: 'string' }, ts: { type: 'string' }, energy: { type: 'string' }, sigma_vi: { type: 'string' } } } },
                        error: { type: 'string', description: 'Error message when the object is not found or has been removed from Sentry' },
                        removed: { type: 'string', description: 'Removal timestamp when the queried object was removed from the Sentry catalog' }
                    }
                }
            }
        },
        getSentrySummary: {
            method: 'GET',
            path: '/sentry.api',
            description: 'Retrieve summary data for all objects in the Sentry impact risk catalog, optionally filtered by magnitude, Palermo scale, impact probability, or observation recency.',
            parameters: [
                { position: { key: 'h-max', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(-10)', 'max(100)'] }, description: 'Maximum absolute magnitude H threshold — only return objects brighter (smaller H) than this value' },
                { position: { key: 'ps-min', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(-20)', 'max(20)'] }, description: 'Minimum cumulative Palermo Scale value — filter for objects with higher risk ratings' },
                { position: { key: 'ip-min', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] }, description: 'Minimum cumulative impact probability threshold, e.g. 1e-3 for 0.1% chance' },
                { position: { key: 'days', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(1)'] }, description: 'Only return objects observed within the last N days (integer number of days)' }
            ],
            tests: [
                { _description: 'Get all Sentry objects summary', 'ip-min': 0.001 },
                { _description: 'Get Sentry objects with high impact probability', 'ip-min': 1e-3 },
                { _description: 'Get Sentry objects with Palermo scale >= -2', 'ps-min': -2 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        signature: { type: 'object', description: 'API version and source info', properties: { source: { type: 'string' }, version: { type: 'string' } } },
                        count: { type: 'string', description: 'Number of objects returned' },
                        data: { type: 'array', description: 'Array of Sentry summary records', items: { type: 'object', properties: { des: { type: 'string' }, fullname: { type: 'string' }, h: { type: 'string' }, id: { type: 'string' }, ip: { type: 'string' }, ps_cum: { type: 'string' }, ps_max: { type: 'string' }, ts_max: { type: 'string' }, n_imp: { type: 'number' }, v_inf: { type: 'string' }, diameter: { type: 'string' }, range: { type: 'string' }, last_obs: { type: 'string' }, last_obs_jd: { type: 'string' } } } }
                    }
                }
            }
        },
        getVirtualImpactors: {
            method: 'GET',
            path: '/sentry.api',
            description: 'Retrieve virtual impactor data for all Sentry objects, optionally filtered by magnitude, Palermo scale, or impact probability.',
            parameters: [
                { position: { key: 'all', value: '1', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Fixed value "1" to request all individual virtual impactor records instead of summary data' },
                { position: { key: 'h-max', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(-10)', 'max(100)'] }, description: 'Maximum absolute magnitude H threshold — only return impactors for objects brighter than this value' },
                { position: { key: 'ps-min', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'min(-20)', 'max(20)'] }, description: 'Minimum Palermo Scale value — filter for virtual impactors with higher risk ratings' },
                { position: { key: 'ip-min', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] }, description: 'Minimum impact probability threshold for individual virtual impactors, e.g. 1e-3' }
            ],
            tests: [
                { _description: 'Get all virtual impactors with high impact probability', 'ip-min': 1e-3 },
                { _description: 'Get virtual impactors with Palermo scale >= -5', 'ps-min': -5 },
                { _description: 'Get virtual impactors for bright objects only', 'h-max': 22 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        signature: { type: 'object', description: 'API version and source info', properties: { source: { type: 'string' }, version: { type: 'string' } } },
                        count: { type: 'number', description: 'Number of virtual impactors returned' },
                        data: { type: 'array', description: 'Array of virtual impactor records with date, energy, and probability', items: { type: 'object', properties: { des: { type: 'string' }, fullname: { type: 'string' }, id: { type: 'string' }, date: { type: 'string' }, ip: { type: 'string' }, ps: { type: 'string' }, ts: { type: 'string' }, energy: { type: 'string' }, sigma_vi: { type: 'string' }, method: { type: 'string' } } } }
                    }
                }
            }
        },
        getRemovedObjects: {
            method: 'GET',
            path: '/sentry.api',
            description: 'Retrieve the list of objects that have been removed from the Sentry impact risk catalog.',
            parameters: [
                { position: { key: 'removed', value: '1', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Fixed value "1" to request the list of removed objects' }
            ],
            tests: [
                { _description: 'Get all removed Sentry objects' },
                { _description: 'Get removed objects list for catalog tracking' },
                { _description: 'Fetch full removed-objects history' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        signature: { type: 'object', description: 'API version and source info', properties: { source: { type: 'string' }, version: { type: 'string' } } },
                        count: { type: 'string', description: 'Number of removed objects' },
                        data: { type: 'array', description: 'Array of removed object records with designation and removal date', items: { type: 'object', properties: { des: { type: 'string' }, removed: { type: 'string' } } } }
                    }
                }
            }
        }
    }
}

export const handlers = ( { sharedLists, libraries } ) => ( {
    getSentryObject: {
        postRequest: async ( { response } ) => {
            if ( response?.error ) {
                return { response: { error: response.error, removed: response.removed || null, signature: response.signature } }
            }
            return { response }
        }
    },
    getSentryObjectBySpk: {
        postRequest: async ( { response } ) => {
            if ( response?.error ) {
                return { response: { error: response.error, removed: response.removed || null, signature: response.signature } }
            }
            return { response }
        }
    }
} )
