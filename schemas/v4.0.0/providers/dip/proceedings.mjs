// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'dip',
    name: 'DIP Bundestag Proceedings',
    description: 'German Bundestag Documentation and Information System (DIP) API providing access to Vorgaenge (proceedings), Vorgangspositionen (proceeding positions), Aktivitaeten (activities), and Personen (members of parliament)',
    version: '4.0.0',
    docs: ['https://dip.bundestag.de/über-dip/hilfe/api'],
    tags: ['parliament', 'germany', 'opendata', 'legislation', 'cacheTtlDaily'],
    root: 'https://search.dip.bundestag.de/api/v1',
    requiredServerParams: ['DIP_BUNDESTAG_API_KEY'],
    tools: {
        listVorgaenge: {
            method: 'GET',
            path: '/vorgang?apikey={{DIP_BUNDESTAG_API_KEY}}',
            description: 'Search and list Vorgaenge (legislative proceedings) of the German Bundestag. Filter by legislative period, date range, type, or descriptor. Use getVorgang for related data. Use listVorgangspositionen for related data.',
            parameters: [
                {
                    position: {
                        key: 'f.wahlperiode',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'f.datum.start',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'f.datum.end',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'f.titel',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'f.vorgangstyp',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'f.beratungsstand',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'f.deskriptor',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'cursor',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        documents: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'number',
                                        description: 'Unique identifier'
                                    },
                                    typ: {
                                        type: 'string',
                                        description: 'Typ value'
                                    },
                                    titel: {
                                        type: 'string',
                                        description: 'Titel value'
                                    },
                                    wahlperiode: {
                                        type: 'number',
                                        description: 'Wahlperiode numeric value'
                                    }
                                },
                                description: 'Individual item in the documents collection'
                            },
                            description: 'Collection of documents items'
                        },
                        cursor: {
                            type: 'string',
                            description: 'Cursor for pagination'
                        },
                        numFound: {
                            type: 'number',
                            description: 'NumFound numeric value'
                        }
                    }
                }
            },
            tests: [
                {
                    _description: 'List Vorgaenge of current legislative period',
                    'f.wahlperiode': 20
                },
                {
                    _description: 'Search Vorgaenge by descriptor',
                    'f.deskriptor': 'Klimaschutz',
                    'f.wahlperiode': 20
                }
            ]
        },
        getVorgang: {
            method: 'GET',
            path: '/vorgang/:id?apikey={{DIP_BUNDESTAG_API_KEY}}',
            description: 'Get a single Vorgang (legislative proceeding) by its ID from the German Bundestag. Returns full proceeding details including related documents and activities. Use listVorgaenge for related data. Use listVorgangspositionen for related data.',
            parameters: [
                {
                    position: {
                        key: 'id',
                        value: '{{USER_PARAM}}',
                        location: 'insert'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['min(1)']
                    }
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'number',
                            description: 'Unique identifier'
                        },
                        typ: {
                            type: 'string',
                            description: 'Typ value'
                        },
                        titel: {
                            type: 'string',
                            description: 'Titel value'
                        },
                        wahlperiode: {
                            type: 'number',
                            description: 'Wahlperiode numeric value'
                        },
                        aktualisiert: {
                            type: 'string',
                            description: 'Aktualisiert value'
                        },
                        beratungsstand: {
                            type: 'string',
                            description: 'Beratungsstand value'
                        }
                    }
                }
            },
            tests: [
                {
                    _description: 'Get Vorgang by ID',
                    id: 306510
                },
                {
                    _description: 'Additional test for getVorgang',
                    id: 306511
                }
            ]
        },
        listVorgangspositionen: {
            method: 'GET',
            path: '/vorgangsposition?apikey={{DIP_BUNDESTAG_API_KEY}}',
            description: 'Search and list Vorgangspositionen (proceeding positions) of the German Bundestag. Filter by legislative period or date range. Use listVorgaenge for related data. Use getVorgang for related data.',
            parameters: [
                {
                    position: {
                        key: 'f.wahlperiode',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'f.datum.start',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'f.datum.end',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'f.titel',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'cursor',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        documents: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'number',
                                        description: 'Unique identifier'
                                    },
                                    titel: {
                                        type: 'string',
                                        description: 'Titel value'
                                    },
                                    datum: {
                                        type: 'string',
                                        description: 'Datum value'
                                    }
                                },
                                description: 'Individual item in the documents collection'
                            },
                            description: 'Collection of documents items'
                        },
                        cursor: {
                            type: 'string',
                            description: 'Cursor for pagination'
                        },
                        numFound: {
                            type: 'number',
                            description: 'NumFound numeric value'
                        }
                    }
                }
            },
            tests: [
                {
                    _description: 'List Vorgangspositionen of current period',
                    'f.wahlperiode': 20
                },
                {
                    _description: 'Additional test for listVorgangspositionen',
                    'f.wahlperiode': 1
                }
            ]
        },
        getVorgangsposition: {
            method: 'GET',
            path: '/vorgangsposition/:id?apikey={{DIP_BUNDESTAG_API_KEY}}',
            description: 'Get a single Vorgangsposition (proceeding position) by its ID from the German Bundestag. Use listVorgaenge for related data. Use getVorgang for related data.',
            parameters: [
                {
                    position: {
                        key: 'id',
                        value: '{{USER_PARAM}}',
                        location: 'insert'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['min(1)']
                    }
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'number',
                            description: 'Unique identifier'
                        },
                        titel: {
                            type: 'string',
                            description: 'Titel value'
                        },
                        datum: {
                            type: 'string',
                            description: 'Datum value'
                        },
                        aktivitaet_anzeige: {
                            type: 'string',
                            description: 'Aktivitaet_anzeige value'
                        }
                    }
                }
            },
            tests: [
                {
                    _description: 'Get Vorgangsposition by ID',
                    id: 362553
                },
                {
                    _description: 'Additional test for getVorgangsposition',
                    id: 362554
                }
            ]
        },
        listAktivitaeten: {
            method: 'GET',
            path: '/aktivitaet?apikey={{DIP_BUNDESTAG_API_KEY}}',
            description: 'Search and list Aktivitaeten (parliamentary activities) of the German Bundestag. Filter by legislative period, date range, person, or document type. Use listVorgaenge for related data. Use getVorgang for related data.',
            parameters: [
                {
                    position: {
                        key: 'f.wahlperiode',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'f.datum.start',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'f.datum.end',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'f.titel',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'f.dokumentart',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'cursor',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        documents: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'number',
                                        description: 'Unique identifier'
                                    },
                                    typ: {
                                        type: 'string',
                                        description: 'Typ value'
                                    },
                                    titel: {
                                        type: 'string',
                                        description: 'Titel value'
                                    },
                                    datum: {
                                        type: 'string',
                                        description: 'Datum value'
                                    }
                                },
                                description: 'Individual item in the documents collection'
                            },
                            description: 'Collection of documents items'
                        },
                        cursor: {
                            type: 'string',
                            description: 'Cursor for pagination'
                        },
                        numFound: {
                            type: 'number',
                            description: 'NumFound numeric value'
                        }
                    }
                }
            },
            tests: [
                {
                    _description: 'List Aktivitaeten of current period',
                    'f.wahlperiode': 20
                },
                {
                    _description: 'List Aktivitaeten by date range',
                    'f.datum.start': '2024-01-01',
                    'f.datum.end': '2024-06-30'
                }
            ]
        },
        getAktivitaet: {
            method: 'GET',
            path: '/aktivitaet/:id?apikey={{DIP_BUNDESTAG_API_KEY}}',
            description: 'Get a single Aktivitaet (parliamentary activity) by its ID from the German Bundestag. Use listVorgaenge for related data. Use getVorgang for related data.',
            parameters: [
                {
                    position: {
                        key: 'id',
                        value: '{{USER_PARAM}}',
                        location: 'insert'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['min(1)']
                    }
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'number',
                            description: 'Unique identifier'
                        },
                        typ: {
                            type: 'string',
                            description: 'Typ value'
                        },
                        titel: {
                            type: 'string',
                            description: 'Titel value'
                        },
                        datum: {
                            type: 'string',
                            description: 'Datum value'
                        },
                        wahlperiode: {
                            type: 'number',
                            description: 'Wahlperiode numeric value'
                        }
                    }
                }
            },
            tests: [
                {
                    _description: 'Get Aktivitaet by ID',
                    id: 944899
                },
                {
                    _description: 'Additional test for getAktivitaet',
                    id: 944900
                }
            ]
        },
        listPersonen: {
            method: 'GET',
            path: '/person?apikey={{DIP_BUNDESTAG_API_KEY}}',
            description: 'Search and list Personen (members of parliament) in the German Bundestag. Filter by legislative period or name. Use listVorgaenge for related data. Use getVorgang for related data.',
            parameters: [
                {
                    position: {
                        key: 'f.wahlperiode',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'f.datum.start',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'f.datum.end',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'f.person',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'cursor',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        documents: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'number',
                                        description: 'Unique identifier'
                                    },
                                    nachname: {
                                        type: 'string',
                                        description: 'Nachname value'
                                    },
                                    vorname: {
                                        type: 'string',
                                        description: 'Vorname value'
                                    },
                                    titel: {
                                        type: 'string',
                                        description: 'Titel value'
                                    },
                                    fraktion: {
                                        type: 'string',
                                        description: 'Fraktion value'
                                    }
                                },
                                description: 'Individual item in the documents collection'
                            },
                            description: 'Collection of documents items'
                        },
                        cursor: {
                            type: 'string',
                            description: 'Cursor for pagination'
                        },
                        numFound: {
                            type: 'number',
                            description: 'NumFound numeric value'
                        }
                    }
                }
            },
            tests: [
                {
                    _description: 'List Personen of current period',
                    'f.wahlperiode': 20
                },
                {
                    _description: 'Search Personen by name',
                    'f.person': 'Merz'
                }
            ]
        },
        getPerson: {
            method: 'GET',
            path: '/person/:id?apikey={{DIP_BUNDESTAG_API_KEY}}',
            description: 'Get a single Person (member of parliament) by their ID from the German Bundestag. Returns full biographical and political details. Use listVorgaenge for related data. Use getVorgang for related data.',
            parameters: [
                {
                    position: {
                        key: 'id',
                        value: '{{USER_PARAM}}',
                        location: 'insert'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['min(1)']
                    }
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'number',
                            description: 'Unique identifier'
                        },
                        nachname: {
                            type: 'string',
                            description: 'Nachname value'
                        },
                        vorname: {
                            type: 'string',
                            description: 'Vorname value'
                        },
                        titel: {
                            type: 'string',
                            description: 'Titel value'
                        },
                        fraktion: {
                            type: 'string',
                            description: 'Fraktion value'
                        },
                        wahlperiode: {
                            type: 'number',
                            description: 'Wahlperiode numeric value'
                        }
                    }
                }
            },
            tests: [
                {
                    _description: 'Get Person by ID',
                    id: 857
                },
                {
                    _description: 'Additional test for getPerson',
                    id: 858
                }
            ]
        }
    }
}

export const handlers = ( { sharedLists, libraries } ) => ( {
    listVorgaenge: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.documents ) { return { response }}

            const vorgaenge = raw.documents
            .map( ( doc ) => {
            const result = {
            id: doc.id || null,
            vorgangstyp: doc.vorgangstyp || null,
            titel: doc.titel || null,
            datum: doc.datum || null,
            wahlperiode: doc.wahlperiode || null,
            beratungsstand: doc.beratungsstand || null,
            initiative: doc.initiative || null,
            aktualisiert: doc.aktualisiert || null
            }

            return result
            } )

            response = {
            count: vorgaenge.length,
            cursor: raw.cursor || null,
            vorgaenge
            }

            return { response }
        }
    },
    listVorgangspositionen: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.documents ) { return { response }}

            const positionen = raw.documents
            .map( ( doc ) => {
            const result = {
            id: doc.id || null,
            vorgangId: doc.vorgang_id || null,
            titel: doc.titel || null,
            datum: doc.datum || null,
            aktivitaetsart: doc.aktivitaetsart || null,
            aktualisiert: doc.aktualisiert || null
            }

            return result
            } )

            response = {
            count: positionen.length,
            cursor: raw.cursor || null,
            positionen
            }

            return { response }
        }
    },
    listAktivitaeten: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.documents ) { return { response }}

            const aktivitaeten = raw.documents
            .map( ( doc ) => {
            const result = {
            id: doc.id || null,
            dokumentart: doc.dokumentart || null,
            titel: doc.titel || null,
            datum: doc.datum || null,
            wahlperiode: doc.wahlperiode || null,
            aktualisiert: doc.aktualisiert || null
            }

            return result
            } )

            response = {
            count: aktivitaeten.length,
            cursor: raw.cursor || null,
            aktivitaeten
            }

            return { response }
        }
    },
    listPersonen: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.documents ) { return { response }}

            const personen = raw.documents
            .map( ( doc ) => {
            const result = {
            id: doc.id || null,
            nachname: doc.nachname || null,
            vorname: doc.vorname || null,
            titel: doc.titel || null,
            typ: doc.typ || null,
            wahlperiode: doc.wahlperiode || null,
            basisdatum: doc.basisdatum || null,
            aktualisiert: doc.aktualisiert || null
            }

            return result
            } )

            response = {
            count: personen.length,
            cursor: raw.cursor || null,
            personen
            }

            return { response }
        }
    }
} )
