export const main = {
    namespace: 'epodata',
    name: 'EPO Linked Data',
    description: 'Access European Patent Office patent data via the Linked Data API (ELDA). Look up patent applications, publications, families, and CPC/IPC classifications. Covers 100M+ patent documents across all EPO member states. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://data.epo.org/linked-data/', 'https://data.epo.org/linked-data/about.html'],
    tags: ['patents', 'research', 'linkeddata', 'cacheTtlDaily'],
    root: 'https://data.epo.org',
    requiredServerParams: [],
    headers: {},
    tools: {
        listApplications: {
            method: 'GET',
            path: '/linked-data/elda-common/linked-data/doc/application.json',
            description: 'List and filter patent applications. Filter by authority (EP, DE, US, JP, etc.), filing date range, and grant date range. Returns application number, filing date, authority, kind, and associated publications. Use getApplication for related data. Use getPublication for related data.',
            parameters: [
                {
                    position: {
                        key: 'authority',
                        value: '{{AUTHORITY}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()', 'default(EP)']
                    }
                },
                {
                    position: {
                        key: 'minFilingDate',
                        value: '{{MIN_FILING_DATE}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'maxFilingDate',
                        value: '{{MAX_FILING_DATE}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'pageSize',
                        value: '{{PAGE_SIZE}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(10)', 'min(1)', 'max(50)']
                    }
                },
                {
                    position: {
                        key: 'page',
                        value: '{{PAGE}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(0)', 'min(0)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Recent EP patent applications',
                    authority: 'EP',
                    pageSize: 5
                },
                {
                    _description: 'German patent applications',
                    authority: 'DE',
                    pageSize: 3
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        page: {
                            type: 'number',
                            description: 'Current page number'
                        },
                        itemsPerPage: {
                            type: 'number',
                            description: 'ItemsPerPage numeric value'
                        },
                        items: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    applicationNumber: {
                                        type: 'string',
                                        description: 'ApplicationNumber value'
                                    },
                                    applicationNumberEpodoc: {
                                        type: 'string',
                                        description: 'ApplicationNumberEpodoc value'
                                    },
                                    filingDate: {
                                        type: 'string',
                                        description: 'FilingDate value'
                                    },
                                    authority: {
                                        type: 'string',
                                        description: 'Authority value'
                                    },
                                    kind: {
                                        type: 'string',
                                        description: 'Kind value'
                                    }
                                },
                                description: 'Individual item in the items collection'
                            },
                            description: 'Collection of result items'
                        }
                    }
                }
            }
        },
        getApplication: {
            method: 'GET',
            path: '/linked-data/elda-common/linked-data/doc/application/:st3Code/:applicationNumber.json',
            description: 'Get detailed information about a specific patent application by its authority code (EP, DE, US, etc.) and application number. Returns filing date, grant date, CPC classification, family, and publications. Use listApplications for related data. Use getPublication for related data.',
            parameters: [
                {
                    position: {
                        key: 'st3Code',
                        value: '{{ST3_CODE}}',
                        location: 'insert'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'applicationNumber',
                        value: '{{APPLICATION_NUMBER}}',
                        location: 'insert'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                }
            ],
            tests: [
                {
                    _description: 'EP application 99203729',
                    st3Code: 'EP',
                    applicationNumber: '99203729'
                },
                {
                    _description: 'EP application 20736154',
                    st3Code: 'EP',
                    applicationNumber: '20736154'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        applicationNumber: {
                            type: 'string',
                            description: 'ApplicationNumber value'
                        },
                        applicationNumberEpodoc: {
                            type: 'string',
                            description: 'ApplicationNumberEpodoc value'
                        },
                        filingDate: {
                            type: 'string',
                            description: 'FilingDate value'
                        },
                        grantDate: {
                            type: 'string',
                            description: 'GrantDate value'
                        },
                        classification: {
                            type: 'string',
                            description: 'Classification value'
                        },
                        familyId: {
                            type: 'string',
                            description: 'FamilyId value'
                        },
                        publications: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    label: {
                                        type: 'string',
                                        description: 'Human-readable label'
                                    },
                                    date: {
                                        type: 'string',
                                        description: 'Date value'
                                    },
                                    kind: {
                                        type: 'string',
                                        description: 'Kind value'
                                    }
                                },
                                description: 'Individual item in the publications collection'
                            },
                            description: 'Collection of publications items'
                        }
                    }
                }
            }
        },
        getPublication: {
            method: 'GET',
            path: '/linked-data/elda-common/linked-data/data/publication/:st3Code/:publicationNumber/:pubKind/-.json',
            description: 'Get a specific patent publication with full metadata. Returns title, abstract, applicant, inventors, agent, CPC/IPC classifications, and links to PDF/HTML representations. Use pubKind like A1, B1, A2, etc. Use listApplications for related data. Use getApplication for related data.',
            parameters: [
                {
                    position: {
                        key: 'st3Code',
                        value: '{{ST3_CODE}}',
                        location: 'insert'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'publicationNumber',
                        value: '{{PUBLICATION_NUMBER}}',
                        location: 'insert'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'pubKind',
                        value: '{{PUB_KIND}}',
                        location: 'insert'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                }
            ],
            tests: [
                {
                    _description: 'EP publication 3906058 A1',
                    st3Code: 'EP',
                    publicationNumber: '3906058',
                    pubKind: 'A1'
                },
                {
                    _description: 'EP publication 1010425 A9',
                    st3Code: 'EP',
                    publicationNumber: '1010425',
                    pubKind: 'A9'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        label: {
                            type: 'string',
                            description: 'Human-readable label'
                        },
                        title: {
                            type: 'string',
                            description: 'Title or heading'
                        },
                        abstract: {
                            type: 'string',
                            description: 'Abstract or summary text'
                        },
                        applicant: {
                            type: 'string',
                            description: 'Applicant value'
                        },
                        inventors: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Collection of inventors items'
                        },
                        publicationDate: {
                            type: 'string',
                            description: 'PublicationDate value'
                        },
                        publicationKind: {
                            type: 'string',
                            description: 'PublicationKind value'
                        },
                        classifications: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Collection of classifications items'
                        }
                    }
                }
            }
        },
        getFamily: {
            method: 'GET',
            path: '/linked-data/elda-common/linked-data/data/simple-family/:familyId.json',
            description: 'Get a patent family (DOCDB simple family) by its ID. Returns all family members across different patent authorities and the representative member. Use listApplications for related data. Use getApplication for related data.',
            parameters: [
                {
                    position: {
                        key: 'familyId',
                        value: '{{FAMILY_ID}}',
                        location: 'insert'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                }
            ],
            tests: [
                {
                    _description: 'Family 19768124',
                    familyId: '19768124'
                },
                {
                    _description: 'Family 23355309',
                    familyId: '23355309'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        familyId: {
                            type: 'string',
                            description: 'FamilyId value'
                        },
                        members: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    authority: {
                                        type: 'string',
                                        description: 'Authority value'
                                    },
                                    applicationNumber: {
                                        type: 'string',
                                        description: 'ApplicationNumber value'
                                    },
                                    kind: {
                                        type: 'string',
                                        description: 'Kind value'
                                    }
                                },
                                description: 'Individual item in the members collection'
                            },
                            description: 'Collection of members items'
                        },
                        representativeMember: {
                            type: 'string',
                            description: 'RepresentativeMember value'
                        }
                    }
                }
            }
        },
        lookupCpc: {
            method: 'GET',
            path: '/linked-data/elda-common/linked-data/def/cpc/:symbol.json',
            description: 'Look up a CPC (Cooperative Patent Classification) symbol. Returns title, hierarchy level, concordant IPC symbols, and broader/narrower categories. Use hyphens instead of slashes (e.g. B28B5-025 instead of B28B5/025). Use listApplications for related data. Use getApplication for related data.',
            parameters: [
                {
                    position: {
                        key: 'symbol',
                        value: '{{SYMBOL}}',
                        location: 'insert'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                }
            ],
            tests: [
                {
                    _description: 'CPC B28B5-025',
                    symbol: 'B28B5-025'
                },
                {
                    _description: 'CPC section A',
                    symbol: 'A'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        symbol: {
                            type: 'string',
                            description: 'Token or asset symbol'
                        },
                        title: {
                            type: 'string',
                            description: 'Title or heading'
                        },
                        level: {
                            type: 'string',
                            description: 'Level value'
                        },
                        concordantIpc: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Collection of concordantIpc items'
                        }
                    }
                }
            }
        },
        listPublications: {
            method: 'GET',
            path: '/linked-data/elda-common/linked-data/data/publication/:st3Code.json',
            description: 'List patent publications for a specific authority (EP, DE, US, JP, etc.). Returns publication labels, dates, and kinds with pagination. Use listApplications for related data. Use getApplication for related data.',
            parameters: [
                {
                    position: {
                        key: 'st3Code',
                        value: '{{ST3_CODE}}',
                        location: 'insert'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'pageSize',
                        value: '{{PAGE_SIZE}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(10)', 'min(1)', 'max(50)']
                    }
                },
                {
                    position: {
                        key: 'page',
                        value: '{{PAGE}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(0)', 'min(0)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'EP publications',
                    st3Code: 'EP',
                    pageSize: 5
                },
                {
                    _description: 'US publications',
                    st3Code: 'US',
                    pageSize: 3
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        page: {
                            type: 'number',
                            description: 'Current page number'
                        },
                        itemsPerPage: {
                            type: 'number',
                            description: 'ItemsPerPage numeric value'
                        },
                        items: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    label: {
                                        type: 'string',
                                        description: 'Human-readable label'
                                    },
                                    publicationDate: {
                                        type: 'string',
                                        description: 'PublicationDate value'
                                    },
                                    publicationKind: {
                                        type: 'string',
                                        description: 'PublicationKind value'
                                    }
                                },
                                description: 'Individual item in the items collection'
                            },
                            description: 'Collection of result items'
                        }
                    }
                }
            }
        }
    }
}

export const handlers = ( { sharedLists, libraries } ) => {
    const extractLabel = ( obj ) => {
        if( typeof obj === 'string' ) { return obj }
        if( obj?.label ) { return obj.label }
        if( obj?._about ) { return obj._about.split( '/' ).pop() }

        return ''
    }

    const extractItems = ( response ) => {
        const result = response?.result || response

        return result?.items || []
    }

    const extractPrimaryTopic = ( response ) => {
        const result = response?.result || response

        return result?.primaryTopic || null
    }

    return {
        listApplications: {
            preRequest: async ( { struct, payload } ) => {
                const authority = payload?.authority || 'EP'
                const pageSize = payload?.pageSize || 10
                const page = payload?.page || 0
                const params = { 'applicationAuthority.notation': authority, '_pageSize': pageSize, '_page': page, '_view': 'short' }
                if( payload?.minFilingDate ) { params['min-filingDate'] = payload.minFilingDate }
                if( payload?.maxFilingDate ) { params['max-filingDate'] = payload.maxFilingDate }
                struct['queryParams'] = params

                return { struct }
            },
            postRequest: async ( { response, struct, payload } ) => {
                const result = response?.result || response
                const rawItems = result?.items || []
                const items = rawItems
                    .map( ( item ) => {
                        const entry = {
                            applicationNumber: item.applicationNumber || '',
                            applicationNumberEpodoc: item.applicationNumberEpodoc || '',
                            filingDate: item.filingDate || '',
                            authority: extractLabel( item.applicationAuthority ),
                            kind: extractLabel( item.applicationKind )
                        }

                        return entry
                    } )

                return { response: { page: result?.page || 0, itemsPerPage: result?.itemsPerPage || 10, items } }
            }
        },
        getApplication: {
            postRequest: async ( { response, struct, payload } ) => {
                const topic = extractPrimaryTopic( response )
                if( !topic ) { return { response: { error: 'Application not found' } } }
                const publications = ( Array.isArray( topic.publication ) ? topic.publication : topic.publication ? [topic.publication] : [] )
                    .map( ( pub ) => {
                        const entry = { label: pub.label || '', date: pub.publicationDate || '', kind: extractLabel( pub.publicationKind ) }

                        return entry
                    } )
                const familyAbout = topic.family?._about || ''
                const familyId = familyAbout ? familyAbout.split( '/' ).pop() : ''
                const result = {
                    applicationNumber: topic.applicationNumber || '',
                    applicationNumberEpodoc: topic.applicationNumberEpodoc || '',
                    filingDate: topic.filingDate || '',
                    grantDate: topic.grantDate || '',
                    classification: extractLabel( topic.classificationCPCInventive ),
                    familyId,
                    publications
                }

                return { response: result }
            }
        },
        getPublication: {
            postRequest: async ( { response, struct, payload } ) => {
                const topic = extractPrimaryTopic( response )
                if( !topic ) { return { response: { error: 'Publication not found' } } }
                const titles = Array.isArray( topic.titleOfInvention ) ? topic.titleOfInvention : topic.titleOfInvention ? [topic.titleOfInvention] : []
                const title = titles[0] || ''
                const inventors = ( Array.isArray( topic.inventorVC ) ? topic.inventorVC : topic.inventorVC ? [topic.inventorVC] : [] )
                    .map( ( vc ) => {
                        const name = vc.fn || extractLabel( vc )

                        return name
                    } )
                const applicant = topic.applicantVC?.fn || extractLabel( topic.applicantVC ) || ''
                const cpcInventive = extractLabel( topic.classificationCPCInventive )
                const cpcAdditional = ( Array.isArray( topic.classificationCPCAdditional ) ? topic.classificationCPCAdditional : topic.classificationCPCAdditional ? [topic.classificationCPCAdditional] : [] )
                    .map( ( c ) => {
                        const label = extractLabel( c )

                        return label
                    } )
                const classifications = cpcInventive ? [cpcInventive, ...cpcAdditional] : cpcAdditional
                const result = {
                    label: topic.label || '',
                    title,
                    abstract: topic.abstract || '',
                    applicant,
                    inventors,
                    publicationDate: topic.publicationDate || '',
                    publicationKind: extractLabel( topic.publicationKind ),
                    classifications
                }

                return { response: result }
            }
        },
        getFamily: {
            postRequest: async ( { response, struct, payload } ) => {
                const topic = extractPrimaryTopic( response )
                if( !topic ) { return { response: { error: 'Family not found' } } }
                const aboutParts = ( topic._about || '' ).split( '/' )
                const familyId = aboutParts.pop() || ''
                const rawMembers = Array.isArray( topic.familyMember ) ? topic.familyMember : topic.familyMember ? [topic.familyMember] : []
                const members = rawMembers
                    .map( ( m ) => {
                        const entry = {
                            authority: extractLabel( m.applicationAuthority ),
                            applicationNumber: m.applicationNumber || '',
                            kind: extractLabel( m.applicationKind )
                        }

                        return entry
                    } )
                const representative = topic.representativeFamilyMember?.applicationNumber || extractLabel( topic.representativeFamilyMember ) || ''
                const result = { familyId, members, representativeMember: representative }

                return { response: result }
            }
        },
        lookupCpc: {
            postRequest: async ( { response, struct, payload } ) => {
                const topic = extractPrimaryTopic( response )
                if( !topic ) { return { response: { error: 'CPC symbol not found' } } }
                const titles = Array.isArray( topic.fullTitle ) ? topic.fullTitle : Array.isArray( topic.title ) ? topic.title : topic.fullTitle ? [topic.fullTitle] : topic.title ? [topic.title] : []
                const concordant = ( Array.isArray( topic.concordantIPC ) ? topic.concordantIPC : topic.concordantIPC ? [topic.concordantIPC] : [] )
                    .map( ( c ) => {
                        const label = extractLabel( c )

                        return label
                    } )
                const result = {
                    symbol: topic.cpcSymbol || extractLabel( topic ),
                    title: titles.join( ' - ' ),
                    level: extractLabel( topic.type ),
                    concordantIpc: concordant
                }

                return { response: result }
            }
        },
        listPublications: {
            preRequest: async ( { struct, payload } ) => {
                const pageSize = payload?.pageSize || 10
                const page = payload?.page || 0
                struct['queryParams'] = { '_pageSize': pageSize, '_page': page }

                return { struct }
            },
            postRequest: async ( { response, struct, payload } ) => {
                const result = response?.result || response
                const rawItems = result?.items || []
                const items = rawItems
                    .map( ( item ) => {
                        const entry = {
                            label: item.label || '',
                            publicationDate: item.publicationDate || '',
                            publicationKind: extractLabel( item.publicationKind )
                        }

                        return entry
                    } )

                return { response: { page: result?.page || 0, itemsPerPage: result?.itemsPerPage || 10, items } }
            }
        }
    }
}
