// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'nina',
    name: 'NINA Warn-App API',
    description: 'German federal warning system (NINA) providing DWD weather warnings, MOWAS civil protection alerts, BIWAPP and KATWARN notifications',
    version: '4.0.0',
    docs: ['https://nina.api.bund.dev/'],
    tags: ['warnings', 'germany', 'safety', 'cacheTtlFrequent'],
    root: 'https://warnung.bund.de/api31',
    tools: {
        getDwdWarnings: {
            method: 'GET',
            path: '/dwd/mapData.json',
            description: 'Get current DWD (Deutscher Wetterdienst) weather warnings across Germany via nina.',
            parameters: [],
            tests: [
                { _description: 'Get all DWD weather warnings' }
            ],
            output: {
                mimeType: 'application/json',
                description: 'Array of active DWD weather warnings across Germany',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', description: 'Unique warning identifier' },
                            version: { type: 'number', description: 'Warning message version number' },
                            startDate: { type: 'string', description: 'Warning validity start (ISO 8601)' },
                            expiresDate: { type: 'string', description: 'Warning expiration date (ISO 8601)' },
                            severity: { type: 'string', description: 'Severity level (Minor, Moderate, Severe, Extreme)' },
                            urgency: { type: 'string', description: 'Urgency level (Immediate, Expected, Future)' },
                            type: { type: 'string', description: 'Warning type identifier (e.g. HEAT, WIND, THUNDERSTORM)' },
                            i18nTitle: { type: 'object', description: 'Localized warning title in multiple languages', properties: { de: { type: 'string', description: 'German title' }, en: { type: 'string', description: 'English title' }, ar: { type: 'string', description: 'Arabic title' }, es: { type: 'string', description: 'Spanish title' }, fr: { type: 'string', description: 'French title' }, pl: { type: 'string', description: 'Polish title' }, ru: { type: 'string', description: 'Russian title' }, tr: { type: 'string', description: 'Turkish title' } } }
                        }
                    }
                }
            },
        },
        getMowasWarnings: {
            method: 'GET',
            path: '/mowas/mapData.json',
            description: 'Get current MOWAS (Modulares Warnsystem) official civil protection warnings. Compare with getDwdWarnings for weather-specific and getBiwappWarnings/getKatwarnWarnings for municipal alerts.',
            parameters: [],
            tests: [
                { _description: 'Get all MOWAS civil protection warnings' }
            ],
            output: {
                mimeType: 'application/json',
                description: 'Array of active MOWAS civil protection warnings',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', description: 'Unique warning identifier' },
                            version: { type: 'number', description: 'Warning message version number' },
                            startDate: { type: 'string', description: 'Warning validity start (ISO 8601)' },
                            severity: { type: 'string', description: 'Severity level (Minor, Moderate, Severe, Extreme)' },
                            urgency: { type: 'string', description: 'Urgency level (Immediate, Expected, Future)' },
                            type: { type: 'string', description: 'Warning type identifier' },
                            i18nTitle: { type: 'object', description: 'Localized warning title', properties: { de: { type: 'string', description: 'German title' } } },
                            transKeys: { type: 'object', description: 'Translation key references', properties: { event: { type: 'string', description: 'Event translation key' } } }
                        }
                    }
                }
            },
        },
        getBiwappWarnings: {
            method: 'GET',
            path: '/biwapp/mapData.json',
            description: 'Get current BIWAPP (Buerger Info und Warn App) municipal-level warnings. For federal-level alerts see getMowasWarnings, for weather see getDwdWarnings.',
            parameters: [],
            tests: [
                { _description: 'Get all BIWAPP municipal warnings' }
            ],
            output: {
                mimeType: 'application/json',
                description: 'Array of active BIWAPP municipal warnings',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', description: 'Unique warning identifier' },
                            version: { type: 'number', description: 'Warning message version number' },
                            startDate: { type: 'string', description: 'Warning validity start (ISO 8601)' },
                            expiresDate: { type: 'string', description: 'Warning expiration date (ISO 8601)' },
                            severity: { type: 'string', description: 'Severity level (Minor, Moderate, Severe, Extreme)' },
                            urgency: { type: 'string', description: 'Urgency level (Immediate, Expected, Future)' },
                            type: { type: 'string', description: 'Warning type identifier' },
                            i18nTitle: { type: 'object', description: 'Localized warning title', properties: { de: { type: 'string', description: 'German title' } } }
                        }
                    }
                }
            },
        },
        getKatwarnWarnings: {
            method: 'GET',
            path: '/katwarn/mapData.json',
            description: 'Get current KATWARN alerts for disaster and crisis situations. For weather warnings use getDwdWarnings, for federal civil protection use getMowasWarnings.',
            parameters: [],
            tests: [
                { _description: 'Get all KATWARN alerts' }
            ],
            output: {
                mimeType: 'application/json',
                description: 'Array of active KATWARN disaster/crisis alerts',
                schema: {
                    type: 'array',
                    items: { type: 'string', description: 'KATWARN alert identifier' }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getDwdWarnings: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !Array.isArray( raw ) ) { return { response }}

            const warnings = raw
            .map( ( warning ) => {
            const { id, severity, urgency, type, startDate, expiresDate, i18nTitle } = warning
            const title = i18nTitle?.de || i18nTitle?.en || null

            return {
            id,
            title,
            severity,
            urgency,
            type,
            startDate,
            expiresDate
            }
            } )

            response = {
            warningCount: warnings.length,
            warnings
            }

            return { response }
        }
    },
    getMowasWarnings: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !Array.isArray( raw ) ) { return { response }}

            const warnings = raw
            .map( ( warning ) => {
            const { id, severity, urgency, type, startDate, expiresDate, i18nTitle } = warning
            const title = i18nTitle?.de || i18nTitle?.en || null

            return {
            id,
            title,
            severity,
            urgency,
            type,
            startDate,
            expiresDate
            }
            } )

            response = {
            warningCount: warnings.length,
            warnings
            }

            return { response }
        }
    },
    getBiwappWarnings: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !Array.isArray( raw ) ) { return { response }}

            const warnings = raw
            .map( ( warning ) => {
            const { id, severity, urgency, type, startDate, expiresDate, i18nTitle } = warning
            const title = i18nTitle?.de || i18nTitle?.en || null

            return {
            id,
            title,
            severity,
            urgency,
            type,
            startDate,
            expiresDate
            }
            } )

            response = {
            warningCount: warnings.length,
            warnings
            }

            return { response }
        }
    },
    getKatwarnWarnings: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !Array.isArray( raw ) ) { return { response }}

            const warnings = raw
            .map( ( warning ) => {
            const { id, severity, urgency, type, startDate, expiresDate, i18nTitle } = warning
            const title = i18nTitle?.de || i18nTitle?.en || null

            return {
            id,
            title,
            severity,
            urgency,
            type,
            startDate,
            expiresDate
            }
            } )

            response = {
            warningCount: warnings.length,
            warnings
            }

            return { response }
        }
    }
} )
