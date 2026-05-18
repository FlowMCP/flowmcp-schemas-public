export const main = {
    namespace: 'dailymed',
    name: 'DailyMed',
    description: 'Search FDA drug labels, SPL documents, drug names, NDC codes, and drug classes via the NLM DailyMed REST API.',
    version: '4.0.0',
    docs: ['https://dailymed.nlm.nih.gov/dailymed/app-support-web-services.cfm'],
    tags: ['health', 'drugs', 'fda', 'pharmacy', 'labels', 'cacheTtlDaily'],
    root: 'https://dailymed.nlm.nih.gov/dailymed/services/v2',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchSpls: {
            method: 'GET',
            path: '/spls.json',
            description: 'Search SPL (Structured Product Labeling) documents. Returns a paginated list of drug labels with set IDs, titles, and metadata. Use getSplById for related data. Use getDrugNames for related data.',
            parameters: [
                {
                    position: {
                        key: 'drug_name',
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
                        key: 'setid',
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
                        key: 'ndc',
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
                        key: 'pagesize',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(10)', 'max(100)']
                    }
                },
                {
                    position: {
                        key: 'page',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(1)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Search for aspirin labels',
                    drug_name: 'aspirin',
                    pagesize: 5
                },
                {
                    _description: 'Search for ibuprofen labels',
                    drug_name: 'ibuprofen',
                    pagesize: 3
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        metadata: {
                            type: 'object',
                            properties: {
                                total_elements: {
                                    type: 'number',
                                    description: 'Total_elements numeric value'
                                },
                                elements_per_page: {
                                    type: 'number',
                                    description: 'Elements_per_page numeric value'
                                },
                                current_page: {
                                    type: 'number',
                                    description: 'Current_page numeric value'
                                },
                                total_pages: {
                                    type: 'number',
                                    description: 'Total_pages numeric value'
                                }
                            },
                            description: 'Associated metadata'
                        },
                        data: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    setid: {
                                        type: 'string',
                                        description: 'Setid value'
                                    },
                                    spl_version: {
                                        type: 'number',
                                        description: 'Spl_version numeric value'
                                    },
                                    title: {
                                        type: 'string',
                                        description: 'Title or heading'
                                    },
                                    published_date: {
                                        type: 'string',
                                        description: 'Published_date value'
                                    }
                                },
                                description: 'Individual item in the data collection'
                            },
                            description: 'Response data payload'
                        }
                    }
                }
            }
        },
        getSplById: {
            method: 'GET',
            path: '/spls/:setId.json',
            description: 'Get detailed SPL document information for a specific SET ID including title, sponsor, product names, and active ingredients. Use searchSpls for related data. Use getDrugNames for related data.',
            parameters: [
                {
                    position: {
                        key: 'setId',
                        value: '{{USER_PARAM}}',
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
                    _description: 'Get aspirin SPL by set ID',
                    setId: 'bca21783-08f5-41a1-99de-32a76419a46e'
                },
                {
                    _description: 'Additional test for getSplById',
                    setId: '2'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'object',
                            properties: {
                                setid: {
                                    type: 'string',
                                    description: 'Setid value'
                                },
                                title: {
                                    type: 'string',
                                    description: 'Title or heading'
                                },
                                effective_time: {
                                    type: 'string',
                                    description: 'Effective_time value'
                                },
                                products: {
                                    type: 'array',
                                    description: 'Collection of products items'
                                }
                            },
                            description: 'Response data payload'
                        }
                    }
                }
            }
        },
        getDrugNames: {
            method: 'GET',
            path: '/drugnames.json',
            description: 'Retrieve drug names indexed in DailyMed. Supports filtering by drug name prefix. Use searchSpls for related data. Use getSplById for related data.',
            parameters: [
                {
                    position: {
                        key: 'drug_name',
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
                        key: 'pagesize',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(10)', 'max(100)']
                    }
                },
                {
                    position: {
                        key: 'page',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(1)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Search for drug names starting with amox',
                    drug_name: 'amox',
                    pagesize: 5
                },
                {
                    _description: 'Search for metformin',
                    drug_name: 'metformin',
                    pagesize: 5
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        metadata: {
                            type: 'object',
                            description: 'Associated metadata'
                        },
                        data: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    drug_name: {
                                        type: 'string',
                                        description: 'Drug_name value'
                                    }
                                },
                                description: 'Individual item in the data collection'
                            },
                            description: 'Response data payload'
                        }
                    }
                }
            }
        },
        getDrugClasses: {
            method: 'GET',
            path: '/drugclasses.json',
            description: 'Retrieve all drug classification types indexed in DailyMed (pharmacologic class, chemical structure, mechanism of action, etc.). Use searchSpls for related data. Use getSplById for related data.',
            parameters: [
                {
                    position: {
                        key: 'drug_class_name',
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
                        key: 'pagesize',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(10)', 'max(100)']
                    }
                },
                {
                    position: {
                        key: 'page',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(1)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Search for antibiotic drug classes',
                    drug_class_name: 'antibiotic',
                    pagesize: 5
                },
                {
                    _description: 'Additional test for getDrugClasses',
                    drug_class_name: 'test'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        metadata: {
                            type: 'object',
                            description: 'Associated metadata'
                        },
                        data: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    drug_class_name: {
                                        type: 'string',
                                        description: 'Drug_class_name value'
                                    },
                                    drug_class_coding_system: {
                                        type: 'string',
                                        description: 'Drug_class_coding_system value'
                                    }
                                },
                                description: 'Individual item in the data collection'
                            },
                            description: 'Response data payload'
                        }
                    }
                }
            }
        },
        getNdcs: {
            method: 'GET',
            path: '/ndcs.json',
            description: 'Retrieve National Drug Code (NDC) numbers. Supports filtering by drug name. Use searchSpls for related data. Use getSplById for related data.',
            parameters: [
                {
                    position: {
                        key: 'drug_name',
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
                        key: 'pagesize',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(10)', 'max(100)']
                    }
                },
                {
                    position: {
                        key: 'page',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(1)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Get NDC codes for aspirin',
                    drug_name: 'aspirin',
                    pagesize: 5
                },
                {
                    _description: 'Additional test for getNdcs',
                    drug_name: 'test'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        metadata: {
                            type: 'object',
                            description: 'Associated metadata'
                        },
                        data: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    ndc: {
                                        type: 'string',
                                        description: 'Ndc value'
                                    },
                                    drug_name: {
                                        type: 'string',
                                        description: 'Drug_name value'
                                    }
                                },
                                description: 'Individual item in the data collection'
                            },
                            description: 'Response data payload'
                        }
                    }
                }
            }
        },
        getUniis: {
            method: 'GET',
            path: '/uniis.json',
            description: 'Retrieve UNII (Unique Ingredient Identifier) codes for substances indexed in DailyMed. Use searchSpls for related data. Use getSplById for related data.',
            parameters: [
                {
                    position: {
                        key: 'unii',
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
                        key: 'pagesize',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(10)', 'max(100)']
                    }
                },
                {
                    position: {
                        key: 'page',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(1)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Get first 5 UNII codes',
                    pagesize: 5
                },
                {
                    _description: 'Additional test for getUniis',
                    unii: 'test'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        metadata: {
                            type: 'object',
                            description: 'Associated metadata'
                        },
                        data: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    unii: {
                                        type: 'string',
                                        description: 'Unii value'
                                    },
                                    substance_name: {
                                        type: 'string',
                                        description: 'Substance_name value'
                                    }
                                },
                                description: 'Individual item in the data collection'
                            },
                            description: 'Response data payload'
                        }
                    }
                }
            }
        }
    }
}
