export const main = {
    namespace: 'googlefactcheck',
    name: 'Google Fact Check Tools',
    description: 'Search fact-checked claims from professional fact-checkers worldwide. Query by text or image to find claim reviews with ratings and sources.',
    version: '4.0.0',
    docs: ['https://developers.google.com/fact-check/tools/api'],
    tags: ['factcheck', 'claims', 'misinformation', 'verification', 'news', 'cacheTtlDaily'],
    root: 'https://factchecktools.googleapis.com',
    requiredServerParams: ['GOOGLE_FACTCHECK_API_KEY'],
    headers: {},
    tools: {
        searchClaims: {
            method: 'GET',
            path: '/v1alpha1/claims:search',
            description: 'Search through fact-checked claims by text query. Returns matching claims with review ratings, publishers, and source URLs. Use searchClaimsByImage for related data. Use listClaimReviewMarkup for related data.',
            parameters: [
                {
                    position: {
                        key: 'query',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'languageCode',
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
                        key: 'reviewPublisherSiteFilter',
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
                        key: 'maxAgeDays',
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
                        key: 'pageSize',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(10)']
                    }
                },
                {
                    position: {
                        key: 'pageToken',
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
                        key: 'offset',
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
                        key: 'key',
                        value: '{{GOOGLE_FACTCHECK_API_KEY}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                }
            ],
            tests: [
                {
                    _description: 'Search for climate change claims',
                    query: 'climate change',
                    pageSize: 5
                },
                {
                    _description: 'Search for COVID vaccine claims in English',
                    query: 'covid vaccine',
                    languageCode: 'en',
                    pageSize: 3
                },
                {
                    _description: 'Search claims reviewed by specific publisher',
                    query: 'election',
                    reviewPublisherSiteFilter: 'politifact.com',
                    pageSize: 5
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        claims: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    text: {
                                        type: 'string',
                                        description: 'Text content'
                                    },
                                    claimant: {
                                        type: 'string',
                                        description: 'Claimant value'
                                    },
                                    claimDate: {
                                        type: 'string',
                                        description: 'ClaimDate value'
                                    },
                                    claimReview: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                publisher: {
                                                    type: 'object',
                                                    properties: {
                                                        name: {
                                                            type: 'string',
                                                            description: 'Display name'
                                                        },
                                                        site: {
                                                            type: 'string',
                                                            description: 'Site value'
                                                        }
                                                    },
                                                    description: 'Publisher name'
                                                },
                                                url: {
                                                    type: 'string',
                                                    description: 'URL link'
                                                },
                                                title: {
                                                    type: 'string',
                                                    description: 'Title or heading'
                                                },
                                                reviewDate: {
                                                    type: 'string',
                                                    description: 'ReviewDate value'
                                                },
                                                textualRating: {
                                                    type: 'string',
                                                    description: 'TextualRating value'
                                                },
                                                languageCode: {
                                                    type: 'string',
                                                    description: 'LanguageCode value'
                                                }
                                            },
                                            description: 'Individual item in the claimReview collection'
                                        },
                                        description: 'Collection of claimReview items'
                                    }
                                },
                                description: 'Individual item in the claims collection'
                            },
                            description: 'Collection of claims items'
                        },
                        nextPageToken: {
                            type: 'string',
                            description: 'NextPageToken value'
                        }
                    }
                }
            }
        },
        searchClaimsByImage: {
            method: 'GET',
            path: '/v1alpha1/claims:imageSearch',
            description: 'Search through fact-checked claims using a publicly accessible image URL as the query. Use searchClaims for related data. Use listClaimReviewMarkup for related data.',
            parameters: [
                {
                    position: {
                        key: 'imageUri',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'languageCode',
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
                        key: 'pageSize',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(10)']
                    }
                },
                {
                    position: {
                        key: 'pageToken',
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
                        key: 'offset',
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
                        key: 'key',
                        value: '{{GOOGLE_FACTCHECK_API_KEY}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                }
            ],
            tests: [
                {
                    _description: 'Search claims by image URL',
                    imageUri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png',
                    pageSize: 3
                },
                {
                    _description: 'Additional test for searchClaimsByImage',
                    imageUri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png alt',
                    key: 'test'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        results: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    claim: {
                                        type: 'object',
                                        properties: {
                                            text: {
                                                type: 'string',
                                                description: 'Text content'
                                            },
                                            claimant: {
                                                type: 'string',
                                                description: 'Claimant value'
                                            },
                                            claimDate: {
                                                type: 'string',
                                                description: 'ClaimDate value'
                                            },
                                            claimReview: {
                                                type: 'array',
                                                description: 'Collection of claimReview items'
                                            }
                                        },
                                        description: 'Claim details'
                                    }
                                },
                                description: 'Individual item in the results collection'
                            },
                            description: 'Array of result items'
                        },
                        nextPageToken: {
                            type: 'string',
                            description: 'NextPageToken value'
                        }
                    }
                }
            }
        },
        listClaimReviewMarkup: {
            method: 'GET',
            path: '/v1alpha1/pages',
            description: 'List ClaimReview markup pages for a specific URL or organization. Requires OAuth authentication. Use searchClaims for related data. Use searchClaimsByImage for related data.',
            parameters: [
                {
                    position: {
                        key: 'url',
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
                        key: 'organization',
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
                        key: 'pageSize',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(10)']
                    }
                },
                {
                    position: {
                        key: 'pageToken',
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
                        key: 'offset',
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
                        key: 'key',
                        value: '{{GOOGLE_FACTCHECK_API_KEY}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                }
            ],
            tests: [
                {
                    _description: 'List ClaimReview markup pages',
                    pageSize: 5
                },
                {
                    _description: 'Additional test for listClaimReviewMarkup',
                    key: 'test'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        claimReviewMarkupPages: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    name: {
                                        type: 'string',
                                        description: 'Display name'
                                    },
                                    pageUrl: {
                                        type: 'string',
                                        description: 'PageUrl value'
                                    },
                                    publishDate: {
                                        type: 'string',
                                        description: 'PublishDate value'
                                    },
                                    claimReviewMarkups: {
                                        type: 'array',
                                        description: 'Collection of claimReviewMarkups items'
                                    },
                                    versionId: {
                                        type: 'string',
                                        description: 'VersionId value'
                                    }
                                },
                                description: 'Individual item in the claimReviewMarkupPages collection'
                            },
                            description: 'Collection of claimReviewMarkupPages items'
                        },
                        nextPageToken: {
                            type: 'string',
                            description: 'NextPageToken value'
                        }
                    }
                }
            }
        }
    }
}
