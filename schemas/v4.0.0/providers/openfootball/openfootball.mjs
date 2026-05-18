export const main = {
    namespace: 'openfootball',
    name: 'OpenFootball',
    description: 'Static JSON football data from GitHub for Bundesliga, Premier League, La Liga, and other major European leagues.',
    version: '4.0.0',
    docs: ['https://github.com/openfootball/football.json'],
    tags: ['sports', 'football', 'soccer', 'opendata', 'cacheTtlStatic'],
    root: 'https://raw.githubusercontent.com/openfootball/football.json/master',
    requiredServerParams: [],
    headers: {},
    tools: {
        getBundesliga: {
            method: 'GET',
            path: '/:season/de.1.json',
            description: 'Returns all matches for a German Bundesliga season with scores and matchday info.',
            parameters: [
                { position: { key: 'season', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get Bundesliga 2024-25 season', season: '2024-25' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        matches: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    round: { type: 'string' },
                                    date: { type: 'string' },
                                    time: { type: 'string' },
                                    team1: { type: 'string' },
                                    team2: { type: 'string' },
                                    score: {
                                        type: 'object',
                                        properties: {
                                            ft: {
                                                type: 'array',
                                                items: { type: 'integer' }
                                            },
                                            ht: {
                                                type: 'array',
                                                items: { type: 'integer' }
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
        getPremierLeague: {
            method: 'GET',
            path: '/:season/en.1.json',
            description: 'Returns all matches for an English Premier League season with scores and matchday info.',
            parameters: [
                { position: { key: 'season', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get Premier League 2024-25 season', season: '2024-25' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        matches: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    round: { type: 'string' },
                                    date: { type: 'string' },
                                    time: { type: 'string' },
                                    team1: { type: 'string' },
                                    team2: { type: 'string' },
                                    score: {
                                        type: 'object',
                                        properties: {
                                            ft: {
                                                type: 'array',
                                                items: { type: 'integer' }
                                            },
                                            ht: {
                                                type: 'array',
                                                items: { type: 'integer' }
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
        getLaLiga: {
            method: 'GET',
            path: '/:season/es.1.json',
            description: 'Returns all matches for a Spanish La Liga season with scores and matchday info.',
            parameters: [
                { position: { key: 'season', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get La Liga 2024-25 season', season: '2024-25' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        matches: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    round: { type: 'string' },
                                    date: { type: 'string' },
                                    time: { type: 'string' },
                                    team1: { type: 'string' },
                                    team2: { type: 'string' },
                                    score: {
                                        type: 'object',
                                        properties: {
                                            ft: {
                                                type: 'array',
                                                items: { type: 'integer' }
                                            },
                                            ht: {
                                                type: 'array',
                                                items: { type: 'integer' }
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
        getSerieA: {
            method: 'GET',
            path: '/:season/it.1.json',
            description: 'Returns all matches for an Italian Serie A season with scores and matchday info.',
            parameters: [
                { position: { key: 'season', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get Serie A 2024-25 season', season: '2024-25' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        matches: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    round: { type: 'string' },
                                    date: { type: 'string' },
                                    time: { type: 'string' },
                                    team1: { type: 'string' },
                                    team2: { type: 'string' },
                                    score: {
                                        type: 'object',
                                        properties: {
                                            ft: {
                                                type: 'array',
                                                items: { type: 'integer' }
                                            },
                                            ht: {
                                                type: 'array',
                                                items: { type: 'integer' }
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
        getLigue: {
            method: 'GET',
            path: '/:season/fr.1.json',
            description: 'Returns all matches for a French Ligue 1 season with scores and matchday info.',
            parameters: [
                { position: { key: 'season', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get Ligue 1 2024-25 season', season: '2024-25' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        matches: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    round: { type: 'string' },
                                    date: { type: 'string' },
                                    time: { type: 'string' },
                                    team1: { type: 'string' },
                                    team2: { type: 'string' },
                                    score: {
                                        type: 'object',
                                        properties: {
                                            ft: {
                                                type: 'array',
                                                items: { type: 'integer' }
                                            },
                                            ht: {
                                                type: 'array',
                                                items: { type: 'integer' }
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
        getBundesligaTwo: {
            method: 'GET',
            path: '/:season/de.2.json',
            description: 'Returns all matches for a German 2. Bundesliga season with scores and matchday info.',
            parameters: [
                { position: { key: 'season', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get 2. Bundesliga 2024-25 season', season: '2024-25' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        matches: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    round: { type: 'string' },
                                    date: { type: 'string' },
                                    time: { type: 'string' },
                                    team1: { type: 'string' },
                                    team2: { type: 'string' },
                                    score: {
                                        type: 'object',
                                        properties: {
                                            ft: {
                                                type: 'array',
                                                items: { type: 'integer' }
                                            },
                                            ht: {
                                                type: 'array',
                                                items: { type: 'integer' }
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
        getChampionship: {
            method: 'GET',
            path: '/:season/en.2.json',
            description: 'Returns all matches for an English Championship season with scores and matchday info.',
            parameters: [
                { position: { key: 'season', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get Championship 2024-25 season', season: '2024-25' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        matches: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    round: { type: 'string' },
                                    date: { type: 'string' },
                                    time: { type: 'string' },
                                    team1: { type: 'string' },
                                    team2: { type: 'string' },
                                    score: {
                                        type: 'object',
                                        properties: {
                                            ft: {
                                                type: 'array',
                                                items: { type: 'integer' }
                                            },
                                            ht: {
                                                type: 'array',
                                                items: { type: 'integer' }
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
        getChampionsLeague: {
            method: 'GET',
            path: '/:season/cl.json',
            description: 'Returns all matches for a UEFA Champions League season with scores and matchday info.',
            parameters: [
                { position: { key: 'season', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get Champions League 2023-24 season', season: '2023-24' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        matches: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    round: { type: 'string' },
                                    date: { type: 'string' },
                                    time: { type: 'string' },
                                    team1: { type: 'string' },
                                    team2: { type: 'string' },
                                    score: {
                                        type: 'object',
                                        properties: {
                                            ft: {
                                                type: 'array',
                                                items: { type: 'integer' }
                                            },
                                            ht: {
                                                type: 'array',
                                                items: { type: 'integer' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
