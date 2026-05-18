// Migrated from v1.2.0 -> v2.0.0
// Category: simple

export const main = {
    namespace: 'berlinevents',
    name: 'Berlin Events API',
    description: 'Access to Berlin city events data including markets, festivals, and public assemblies',
    version: '4.0.0',
    docs: ['https://www.berlin.de/'],
    tags: ['berlin', 'events', 'opendata', 'cacheTtlDaily'],
    root: 'https://www.berlin.de',
    tools: {
        markets_festivals: {
            method: 'GET',
            path: '/sen/web/service/maerkte-feste/wochen-troedelmaerkte/index.php/index/all.json',
            description: 'Weekly and flea markets in Berlin via Berlin.de. Returns structured JSON response data.',
            parameters: [],
            tests: [
                { _description: 'Get all weekly and flea markets in Berlin' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        messages: { type: 'object', properties: { messages: { type: 'array', items: { type: 'string' } }, success: { type: 'boolean' } } },
                        results: { type: 'object', properties: { count: { type: 'number' }, items_per_page: { type: 'number' } } },
                        index: { type: 'array', items: { type: 'object', properties: { id: { type: 'number' }, bezirk: { type: 'string' }, bezeichnung: { type: 'string' }, strasse: { type: 'string' }, plz: { type: 'string' }, zeitraum: { type: 'string' }, tage: { type: 'string' }, zeiten: { type: 'string' }, betreiber: { type: 'string' }, email: { type: 'string' }, www: { type: 'string' }, barrierefreiheit: { type: 'string' }, bemerkungen: { type: 'string' } } } },
                        item: { type: 'array', items: { type: 'string' } }
                    }
                }
            },
        },
        street_festivals: {
            method: 'GET',
            path: '/sen/web/service/maerkte-feste/strassen-volksfeste/index.php/index/all.json',
            description: 'Street and folk festivals in Berlin via Berlin.de. Returns structured JSON response data.',
            parameters: [],
            tests: [
                { _description: 'Get all street and folk festivals in Berlin' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        messages: { type: 'object', properties: { messages: { type: 'array', items: { type: 'string' } }, success: { type: 'boolean' } } },
                        results: { type: 'object', properties: { count: { type: 'number' }, items_per_page: { type: 'number' } } },
                        index: { type: 'array', items: { type: 'object', properties: { id: { type: 'number' }, bezirk: { type: 'string' }, bezeichnung: { type: 'string' }, strasse: { type: 'string' }, plz: { type: 'string' }, von: { type: 'string' }, bis: { type: 'string' }, zeit: { type: 'string' }, veranstalter: { type: 'string' }, mail: { type: 'string' }, www: { type: 'string' }, barrierefreiheit: { type: 'string' }, bemerkungen: { type: 'string' } } } },
                        item: { type: 'array', items: { type: 'string' } }
                    }
                }
            },
        },
        christmas_markets: {
            method: 'GET',
            path: '/sen/web/service/maerkte-feste/weihnachtsmaerkte/index.php/index/all.json',
            description: 'Christmas markets in Berlin via Berlin.de. Returns structured JSON response data.',
            parameters: [],
            tests: [
                { _description: 'Get all christmas markets in Berlin' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        messages: { type: 'object', properties: { messages: { type: 'array', items: { type: 'string' } }, success: { type: 'boolean' } } },
                        results: { type: 'object', properties: { count: { type: 'number' }, items_per_page: { type: 'number' } } },
                        index: { type: 'array', items: { type: 'object', properties: { id: { type: 'number' }, bezirk: { type: 'string' }, name: { type: 'string' }, strasse: { type: 'string' }, plz_ort: { type: 'string' }, von: { type: 'string' }, bis: { type: 'string' }, veranstalter: { type: 'string' }, oeffnungszeiten: { type: 'string' }, email: { type: 'string' }, www: { type: 'string' }, barrierefreiheit: { type: 'string' }, bemerkungen: { type: 'string' } } } },
                        item: { type: 'array', items: { type: 'string' } }
                    }
                }
            },
        },
        police_assemblies: {
            method: 'GET',
            path: '/polizei/service/versammlungsbehoerde/versammlungen-aufzuege/index.php/index/all.json',
            description: 'Police registered assemblies and demonstrations in Berlin via Berlin.de. Returns structured JSON response data.',
            parameters: [],
            tests: [
                { _description: 'Get all police registered assemblies and demonstrations' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        messages: { type: 'object', properties: { messages: { type: 'array', items: { type: 'string' } }, success: { type: 'boolean' } } },
                        results: { type: 'object', properties: { count: { type: 'number' }, items_per_page: { type: 'number' } } },
                        index: { type: 'array', items: { type: 'object', properties: { id: { type: 'number' }, datum: { type: 'string' }, von: { type: 'string' }, bis: { type: 'string' }, thema: { type: 'string' }, plz: { type: 'string' }, strasse_nr: { type: 'string' }, aufzugsstrecke: { type: 'string' } } } },
                        item: { type: 'array', items: { type: 'string' } }
                    }
                }
            },
        }
    }
}
