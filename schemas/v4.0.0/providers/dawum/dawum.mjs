export const main = {
    namespace: 'dawum',
    name: 'DAWUM',
    description: 'Access German election poll data from dawum.de including surveys from all major institutes, parliament results, party data, and polling methodologies.',
    docs: ['https://dawum.de/API/'],
    tags: ['politics', 'elections', 'polls', 'germany', 'surveys', 'cacheTtlDaily'],
    version: '4.0.0',
    root: 'https://api.dawum.de',
    requiredServerParams: [],
    headers: {},
    tools: {
        getAllData: {
            method: 'GET',
            path: '/',
            description: 'Retrieve the complete DAWUM database including all parliaments, institutes, taskers, methods, parties, and surveys with poll results. Use getNewestSurveys for related data. Use getLastUpdate for related data.',
            parameters: [],
            tests: [
                {
                    _description: 'Get complete DAWUM database'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        Database: {
                            type: 'object',
                            description: 'Metadata about the database (license, author, last update)'
                        },
                        Parliaments: {
                            type: 'object',
                            description: 'German parliaments (Bundestag, state legislatures, EU Parliament)'
                        },
                        Institutes: {
                            type: 'object',
                            description: 'Polling institutes (Forsa, INSA, Infratest dimap, etc.)'
                        },
                        Taskers: {
                            type: 'object',
                            description: 'Media organizations commissioning polls'
                        },
                        Methods: {
                            type: 'object',
                            description: 'Survey methodologies (telephone, online, in-person)'
                        },
                        Parties: {
                            type: 'object',
                            description: 'German political parties'
                        },
                        Surveys: {
                            type: 'object',
                            description: 'Individual poll results with dates, sample sizes, and party percentages'
                        }
                    }
                }
            }
        },
        getNewestSurveys: {
            method: 'GET',
            path: '/newest_surveys.json',
            description: 'Retrieve only the most recent survey from each institute per parliament. Compact version of the full database for quick access to latest polls. Use getAllData for related data. Use getLastUpdate for related data.',
            parameters: [],
            tests: [
                {
                    _description: 'Get newest surveys per institute and parliament'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        Database: {
                            type: 'object',
                            description: 'Metadata about the database'
                        },
                        Parliaments: {
                            type: 'object',
                            description: 'German parliaments'
                        },
                        Institutes: {
                            type: 'object',
                            description: 'Polling institutes'
                        },
                        Taskers: {
                            type: 'object',
                            description: 'Commissioning organizations'
                        },
                        Methods: {
                            type: 'object',
                            description: 'Survey methodologies'
                        },
                        Parties: {
                            type: 'object',
                            description: 'Political parties'
                        },
                        Surveys: {
                            type: 'object',
                            description: 'Most recent surveys only'
                        }
                    }
                }
            }
        },
        getLastUpdate: {
            method: 'GET',
            path: '/last_update.txt',
            description: 'Retrieve the timestamp of the last database update. Useful for cache invalidation and freshness checks. Use getAllData for related data. Use getNewestSurveys for related data.',
            parameters: [],
            tests: [
                {
                    _description: 'Get last update timestamp'
                }
            ],
            output: {
                mimeType: 'text/plain',
                schema: {
                    type: 'string',
                    description: 'Unix timestamp of the last database update'
                }
            }
        }
    }
}
