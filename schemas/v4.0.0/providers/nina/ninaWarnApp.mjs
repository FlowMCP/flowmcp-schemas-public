export const main = {
    namespace: 'nina',
    name: 'NinaWarnApp',
    description: 'Access German civil protection warnings from BBK, DWD weather alerts, KATWARN, BIWAPP, and flood warnings via the official NINA Warn-App API.',
    version: '4.0.0',
    docs: ['https://nina.api.bund.dev/', 'https://github.com/bundesAPI/nina-api'],
    tags: ['warnings', 'emergency', 'germany', 'weather', 'cacheTtlRealtime'],
    root: 'https://warnung.bund.de',
    requiredServerParams: [],
    headers: {},
    tools: {
        getDashboard: {
            method: 'GET',
            path: '/api31/dashboard/:ars.json',
            description: 'Get active warnings for a specific German district by its AGS/ARS code (Amtlicher Gemeindeschlüssel). Returns all current alerts from all providers.',
            parameters: [
                { position: { key: 'ars', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get dashboard warnings for Berlin (ARS 110000000000)', ars: '110000000000' },
                { _description: 'Get dashboard warnings for Munich (ARS 091620000000)', ars: '091620000000' },
                { _description: 'Get dashboard warnings for Hamburg (ARS 020000000000)', ars: '020000000000' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Array of active warning overview items for the specified district',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', description: 'Warning identifier' },
                            payload: {
                                type: 'object',
                                properties: {
                                    version: { type: 'string' },
                                    type: { type: 'string', description: 'Warning source type (e.g. MOWAS, DWD, KATWARN, BIWAPP)' },
                                    id: { type: 'string' },
                                    hash: { type: 'string' },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            headline: { type: 'string', description: 'Warning headline' },
                                            msgType: { type: 'string' },
                                            references: { type: 'string' }
                                        }
                                    }
                                }
                            },
                            i18nTitle: {
                                type: 'object',
                                properties: {
                                    de: { type: 'string', description: 'German title' },
                                    en: { type: 'string', description: 'English title' }
                                }
                            },
                            sent: { type: 'string', description: 'ISO 8601 timestamp when warning was sent' },
                            effective: { type: 'string', description: 'Warning effective date' },
                            onset: { type: 'string', description: 'Warning onset date' },
                            expires: { type: 'string', description: 'Warning expiry date' },
                            transKeys: {
                                type: 'object',
                                properties: {
                                    event: { type: 'string', description: 'Event type key' }
                                }
                            }
                        }
                    }
                }
            }
        },
        getWarningById: {
            method: 'GET',
            path: '/api31/warnings/:identifier.json',
            description: 'Retrieve full details of a specific warning by its identifier. Returns CAP (Common Alerting Protocol) formatted warning with all areas and instructions.',
            parameters: [
                { position: { key: 'identifier', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get a specific MOWAS warning by ID', identifier: 'mow.DE-NW-BN-SE030-20190901-30-001' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        identifier: { type: 'string' },
                        sender: { type: 'string' },
                        sent: { type: 'string', description: 'ISO 8601 send timestamp' },
                        status: { type: 'string', description: 'Alert status (Actual, Exercise, Test)' },
                        msgType: { type: 'string', description: 'Message type (Alert, Update, Cancel)' },
                        scope: { type: 'string' },
                        info: {
                            type: 'array',
                            description: 'Array of warning info blocks (one per language)',
                            items: {
                                type: 'object',
                                properties: {
                                    language: { type: 'string' },
                                    category: { type: 'string' },
                                    event: { type: 'string', description: 'Event type description' },
                                    urgency: { type: 'string' },
                                    severity: { type: 'string' },
                                    certainty: { type: 'string' },
                                    headline: { type: 'string' },
                                    description: { type: 'string' },
                                    instruction: { type: 'string' },
                                    effective: { type: 'string' },
                                    onset: { type: 'string' },
                                    expires: { type: 'string' },
                                    area: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                areaDesc: { type: 'string', description: 'Area description' },
                                                geocode: { type: 'array', items: { type: 'object' } }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        getMowasMapData: {
            method: 'GET',
            path: '/api31/mowas/mapData.json',
            description: 'Get all active MoWaS (Modulares Warnsystem) warnings for the entire Germany map. Returns BBK civil protection warnings.',
            parameters: [],
            tests: [
                { _description: 'Get all current MoWaS civil protection warnings' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Array of active MoWaS warning map entries',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', description: 'Warning identifier' },
                            payload: { type: 'object', description: 'Warning payload data' },
                            i18nTitle: { type: 'object', properties: { de: { type: 'string' }, en: { type: 'string' } } },
                            sent: { type: 'string' },
                            effective: { type: 'string' },
                            onset: { type: 'string' },
                            expires: { type: 'string' }
                        }
                    }
                }
            }
        },
        getDwdMapData: {
            method: 'GET',
            path: '/api31/dwd/mapData.json',
            description: 'Get all active DWD (Deutscher Wetterdienst) weather warnings for Germany. Returns severe weather alerts including storms, heavy rain, and snow.',
            parameters: [],
            tests: [
                { _description: 'Get all current DWD weather warnings for Germany' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Array of active DWD weather warning map entries',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            payload: { type: 'object' },
                            i18nTitle: { type: 'object', properties: { de: { type: 'string' }, en: { type: 'string' } } },
                            sent: { type: 'string' },
                            effective: { type: 'string' },
                            onset: { type: 'string' },
                            expires: { type: 'string' }
                        }
                    }
                }
            }
        },
        getKatwarnMapData: {
            method: 'GET',
            path: '/api31/katwarn/mapData.json',
            description: 'Get all active KATWARN warnings for Germany. Returns civil protection alerts from the KATWARN platform.',
            parameters: [],
            tests: [
                { _description: 'Get all current KATWARN warnings' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Array of active KATWARN warning map entries',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            payload: { type: 'object' },
                            i18nTitle: { type: 'object', properties: { de: { type: 'string' }, en: { type: 'string' } } },
                            sent: { type: 'string' }
                        }
                    }
                }
            }
        },
        getLhpMapData: {
            method: 'GET',
            path: '/api31/lhp/mapData.json',
            description: 'Get all active LHP (Länderübergreifendes Hochwasser Portal) flood warnings for Germany. Returns river flood level alerts.',
            parameters: [],
            tests: [
                { _description: 'Get all current flood warnings for Germany' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Array of active flood warning map entries',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            payload: { type: 'object' },
                            i18nTitle: { type: 'object', properties: { de: { type: 'string' }, en: { type: 'string' } } },
                            sent: { type: 'string' }
                        }
                    }
                }
            }
        },
        getEventCodes: {
            method: 'GET',
            path: '/api31/appdata/gsb/eventCodes/eventCodes.json',
            description: 'Retrieve the list of all available event codes used in NINA warnings. Useful for understanding warning categories and icons.',
            parameters: [],
            tests: [
                { _description: 'Get all available NINA event codes' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Collection of event codes with icons and display names',
                    additionalProperties: {
                        type: 'object',
                        properties: {
                            name: { type: 'string', description: 'Event code display name in German' },
                            icon: { type: 'string', description: 'Icon filename for this event code' }
                        }
                    }
                }
            }
        }
    }
}
