export const main = {
    namespace: 'footballdata',
    name: 'football-data.org',
    description: 'RESTful API covering 183 football competitions worldwide with matches, standings, teams, scorers, and player data.',
    version: '4.0.0',
    docs: ['https://docs.football-data.org/general/v4/index.html'],
    tags: ['sports', 'football', 'soccer', 'competitions', 'worldwide', 'cacheTtlFrequent'],
    root: 'https://api.football-data.org/v4',
    requiredServerParams: ['FOOTBALLDATA_API_KEY'],
    headers: {
        'X-Auth-Token': '{{FOOTBALLDATA_API_KEY}}'
    },
    tools: {
        listCompetitions: {
            method: 'GET',
            path: '/competitions',
            description: 'Returns all available football competitions worldwide with season info and metadata. Use getCompetition for related data. Use getCompetitionMatches for related data.',
            parameters: [],
            tests: [
                {
                    _description: 'List all competitions'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: {
                            type: 'integer',
                            description: 'Number of items in the current response'
                        },
                        filters: {
                            type: 'object',
                            description: 'Filters details'
                        },
                        competitions: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'integer',
                                        description: 'Unique identifier'
                                    },
                                    name: {
                                        type: 'string',
                                        description: 'Display name'
                                    },
                                    code: {
                                        type: 'string',
                                        description: 'Status or error code'
                                    },
                                    type: {
                                        type: 'string',
                                        description: 'Type classification'
                                    },
                                    emblem: {
                                        type: 'string',
                                        description: 'Emblem value'
                                    },
                                    plan: {
                                        type: 'string',
                                        description: 'Plan value'
                                    },
                                    area: {
                                        type: 'object',
                                        properties: {
                                            id: {
                                                type: 'integer',
                                                description: 'Unique identifier'
                                            },
                                            name: {
                                                type: 'string',
                                                description: 'Display name'
                                            },
                                            code: {
                                                type: 'string',
                                                description: 'Status or error code'
                                            },
                                            flag: {
                                                type: 'string',
                                                description: 'Flag value'
                                            }
                                        },
                                        description: 'Area details'
                                    },
                                    currentSeason: {
                                        type: 'object',
                                        properties: {
                                            id: {
                                                type: 'integer',
                                                description: 'Unique identifier'
                                            },
                                            startDate: {
                                                type: 'string',
                                                description: 'StartDate value'
                                            },
                                            endDate: {
                                                type: 'string',
                                                description: 'EndDate value'
                                            },
                                            currentMatchday: {
                                                type: 'integer',
                                                description: 'CurrentMatchday data'
                                            }
                                        },
                                        description: 'CurrentSeason details'
                                    },
                                    numberOfAvailableSeasons: {
                                        type: 'integer',
                                        description: 'NumberOfAvailableSeasons data'
                                    },
                                    lastUpdated: {
                                        type: 'string',
                                        description: 'LastUpdated value'
                                    }
                                },
                                description: 'Individual item in the competitions collection'
                            },
                            description: 'Collection of competitions items'
                        }
                    }
                }
            }
        },
        getCompetition: {
            method: 'GET',
            path: '/competitions/:competitionId',
            description: 'Returns details for a specific competition including current season and available seasons. Use listCompetitions for related data. Use getCompetitionMatches for related data.',
            parameters: [
                {
                    position: {
                        key: 'competitionId',
                        value: '{{COMPETITION_ID}}',
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
                    _description: 'Get Bundesliga competition details',
                    COMPETITION_ID: 'BL1'
                },
                {
                    _description: 'Additional test for getCompetition',
                    competitionId: '1'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Unique identifier'
                        },
                        name: {
                            type: 'string',
                            description: 'Display name'
                        },
                        code: {
                            type: 'string',
                            description: 'Status or error code'
                        },
                        type: {
                            type: 'string',
                            description: 'Type classification'
                        },
                        emblem: {
                            type: 'string',
                            description: 'Emblem value'
                        },
                        area: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'integer',
                                    description: 'Unique identifier'
                                },
                                name: {
                                    type: 'string',
                                    description: 'Display name'
                                },
                                code: {
                                    type: 'string',
                                    description: 'Status or error code'
                                },
                                flag: {
                                    type: 'string',
                                    description: 'Flag value'
                                }
                            },
                            description: 'Area details'
                        },
                        currentSeason: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'integer',
                                    description: 'Unique identifier'
                                },
                                startDate: {
                                    type: 'string',
                                    description: 'StartDate value'
                                },
                                endDate: {
                                    type: 'string',
                                    description: 'EndDate value'
                                },
                                currentMatchday: {
                                    type: 'integer',
                                    description: 'CurrentMatchday data'
                                }
                            },
                            description: 'CurrentSeason details'
                        },
                        seasons: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'integer',
                                        description: 'Unique identifier'
                                    },
                                    startDate: {
                                        type: 'string',
                                        description: 'StartDate value'
                                    },
                                    endDate: {
                                        type: 'string',
                                        description: 'EndDate value'
                                    },
                                    currentMatchday: {
                                        type: 'integer',
                                        description: 'CurrentMatchday data'
                                    }
                                },
                                description: 'Individual item in the seasons collection'
                            },
                            description: 'Collection of seasons items'
                        },
                        lastUpdated: {
                            type: 'string',
                            description: 'LastUpdated value'
                        }
                    }
                }
            }
        },
        getCompetitionMatches: {
            method: 'GET',
            path: '/competitions/:competitionId/matches',
            description: 'Returns matches for a competition with optional season and matchday filters. Use listCompetitions for related data. Use getCompetition for related data.',
            parameters: [
                {
                    position: {
                        key: 'competitionId',
                        value: '{{COMPETITION_ID}}',
                        location: 'insert'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'season',
                        value: '{{SEASON}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'matchday',
                        value: '{{MATCHDAY}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Get Bundesliga matches for matchday 1 of 2024',
                    COMPETITION_ID: 'BL1',
                    SEASON: 2024,
                    MATCHDAY: 1
                },
                {
                    _description: 'Additional test for getCompetitionMatches',
                    competitionId: '1'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: {
                            type: 'integer',
                            description: 'Number of items in the current response'
                        },
                        filters: {
                            type: 'object',
                            description: 'Filters details'
                        },
                        competition: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'integer',
                                    description: 'Unique identifier'
                                },
                                name: {
                                    type: 'string',
                                    description: 'Display name'
                                },
                                code: {
                                    type: 'string',
                                    description: 'Status or error code'
                                }
                            },
                            description: 'Competition details'
                        },
                        matches: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'integer',
                                        description: 'Unique identifier'
                                    },
                                    utcDate: {
                                        type: 'string',
                                        description: 'UtcDate value'
                                    },
                                    status: {
                                        type: 'string',
                                        description: 'Response status indicator'
                                    },
                                    matchday: {
                                        type: 'integer',
                                        description: 'Matchday data'
                                    },
                                    homeTeam: {
                                        type: 'object',
                                        properties: {
                                            id: {
                                                type: 'integer',
                                                description: 'Unique identifier'
                                            },
                                            name: {
                                                type: 'string',
                                                description: 'Display name'
                                            },
                                            shortName: {
                                                type: 'string',
                                                description: 'ShortName value'
                                            },
                                            crest: {
                                                type: 'string',
                                                description: 'Crest value'
                                            }
                                        },
                                        description: 'HomeTeam details'
                                    },
                                    awayTeam: {
                                        type: 'object',
                                        properties: {
                                            id: {
                                                type: 'integer',
                                                description: 'Unique identifier'
                                            },
                                            name: {
                                                type: 'string',
                                                description: 'Display name'
                                            },
                                            shortName: {
                                                type: 'string',
                                                description: 'ShortName value'
                                            },
                                            crest: {
                                                type: 'string',
                                                description: 'Crest value'
                                            }
                                        },
                                        description: 'AwayTeam details'
                                    },
                                    score: {
                                        type: 'object',
                                        properties: {
                                            winner: {
                                                type: 'string',
                                                description: 'Winner value'
                                            },
                                            fullTime: {
                                                type: 'object',
                                                properties: {
                                                    home: {
                                                        type: 'integer',
                                                        description: 'Home data'
                                                    },
                                                    away: {
                                                        type: 'integer',
                                                        description: 'Away data'
                                                    }
                                                },
                                                description: 'FullTime details'
                                            },
                                            halfTime: {
                                                type: 'object',
                                                properties: {
                                                    home: {
                                                        type: 'integer',
                                                        description: 'Home data'
                                                    },
                                                    away: {
                                                        type: 'integer',
                                                        description: 'Away data'
                                                    }
                                                },
                                                description: 'HalfTime details'
                                            }
                                        },
                                        description: 'Relevance or quality score'
                                    }
                                },
                                description: 'Individual item in the matches collection'
                            },
                            description: 'Collection of matches items'
                        }
                    }
                }
            }
        },
        getCompetitionStandings: {
            method: 'GET',
            path: '/competitions/:competitionId/standings',
            description: 'Returns league standings including total, home, and away tables. Use listCompetitions for related data. Use getCompetition for related data.',
            parameters: [
                {
                    position: {
                        key: 'competitionId',
                        value: '{{COMPETITION_ID}}',
                        location: 'insert'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'season',
                        value: '{{SEASON}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Get Premier League standings for 2024 season',
                    COMPETITION_ID: 'PL',
                    SEASON: 2024
                },
                {
                    _description: 'Additional test for getCompetitionStandings',
                    competitionId: '1'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        competition: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'integer',
                                    description: 'Unique identifier'
                                },
                                name: {
                                    type: 'string',
                                    description: 'Display name'
                                },
                                code: {
                                    type: 'string',
                                    description: 'Status or error code'
                                }
                            },
                            description: 'Competition details'
                        },
                        season: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'integer',
                                    description: 'Unique identifier'
                                },
                                startDate: {
                                    type: 'string',
                                    description: 'StartDate value'
                                },
                                endDate: {
                                    type: 'string',
                                    description: 'EndDate value'
                                },
                                currentMatchday: {
                                    type: 'integer',
                                    description: 'CurrentMatchday data'
                                }
                            },
                            description: 'Season details'
                        },
                        standings: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    stage: {
                                        type: 'string',
                                        description: 'Stage value'
                                    },
                                    type: {
                                        type: 'string',
                                        description: 'Type classification'
                                    },
                                    table: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                position: {
                                                    type: 'integer',
                                                    description: 'Position data'
                                                },
                                                team: {
                                                    type: 'object',
                                                    properties: {
                                                        id: {
                                                            type: 'integer',
                                                            description: 'Unique identifier'
                                                        },
                                                        name: {
                                                            type: 'string',
                                                            description: 'Display name'
                                                        },
                                                        shortName: {
                                                            type: 'string',
                                                            description: 'ShortName value'
                                                        },
                                                        crest: {
                                                            type: 'string',
                                                            description: 'Crest value'
                                                        }
                                                    },
                                                    description: 'Team details'
                                                },
                                                playedGames: {
                                                    type: 'integer',
                                                    description: 'PlayedGames data'
                                                },
                                                won: {
                                                    type: 'integer',
                                                    description: 'Won data'
                                                },
                                                draw: {
                                                    type: 'integer',
                                                    description: 'Draw data'
                                                },
                                                lost: {
                                                    type: 'integer',
                                                    description: 'Lost data'
                                                },
                                                points: {
                                                    type: 'integer',
                                                    description: 'Points data'
                                                },
                                                goalsFor: {
                                                    type: 'integer',
                                                    description: 'GoalsFor data'
                                                },
                                                goalsAgainst: {
                                                    type: 'integer',
                                                    description: 'GoalsAgainst data'
                                                },
                                                goalDifference: {
                                                    type: 'integer',
                                                    description: 'GoalDifference data'
                                                }
                                            },
                                            description: 'Individual item in the table collection'
                                        },
                                        description: 'Collection of table items'
                                    }
                                },
                                description: 'Individual item in the standings collection'
                            },
                            description: 'Collection of standings items'
                        }
                    }
                }
            }
        },
        getCompetitionTopScorers: {
            method: 'GET',
            path: '/competitions/:competitionId/scorers',
            description: 'Returns top scorers for a competition ranked by goals. Use listCompetitions for related data. Use getCompetition for related data.',
            parameters: [
                {
                    position: {
                        key: 'competitionId',
                        value: '{{COMPETITION_ID}}',
                        location: 'insert'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'season',
                        value: '{{SEASON}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'limit',
                        value: '{{LIMIT}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(10)']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Get Bundesliga top 10 scorers for 2024 season',
                    COMPETITION_ID: 'BL1',
                    SEASON: 2024,
                    LIMIT: 10
                },
                {
                    _description: 'Additional test for getCompetitionTopScorers',
                    competitionId: '1'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: {
                            type: 'integer',
                            description: 'Number of items in the current response'
                        },
                        competition: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'integer',
                                    description: 'Unique identifier'
                                },
                                name: {
                                    type: 'string',
                                    description: 'Display name'
                                },
                                code: {
                                    type: 'string',
                                    description: 'Status or error code'
                                }
                            },
                            description: 'Competition details'
                        },
                        season: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'integer',
                                    description: 'Unique identifier'
                                },
                                startDate: {
                                    type: 'string',
                                    description: 'StartDate value'
                                },
                                endDate: {
                                    type: 'string',
                                    description: 'EndDate value'
                                }
                            },
                            description: 'Season details'
                        },
                        scorers: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    player: {
                                        type: 'object',
                                        properties: {
                                            id: {
                                                type: 'integer',
                                                description: 'Unique identifier'
                                            },
                                            name: {
                                                type: 'string',
                                                description: 'Display name'
                                            },
                                            nationality: {
                                                type: 'string',
                                                description: 'Nationality value'
                                            }
                                        },
                                        description: 'Player details'
                                    },
                                    team: {
                                        type: 'object',
                                        properties: {
                                            id: {
                                                type: 'integer',
                                                description: 'Unique identifier'
                                            },
                                            name: {
                                                type: 'string',
                                                description: 'Display name'
                                            },
                                            shortName: {
                                                type: 'string',
                                                description: 'ShortName value'
                                            },
                                            crest: {
                                                type: 'string',
                                                description: 'Crest value'
                                            }
                                        },
                                        description: 'Team details'
                                    },
                                    goals: {
                                        type: 'integer',
                                        description: 'Goals data'
                                    },
                                    assists: {
                                        type: 'integer',
                                        description: 'Assists data'
                                    },
                                    penalties: {
                                        type: 'integer',
                                        description: 'Penalties data'
                                    }
                                },
                                description: 'Individual item in the scorers collection'
                            },
                            description: 'Collection of scorers items'
                        }
                    }
                }
            }
        },
        getCompetitionTeams: {
            method: 'GET',
            path: '/competitions/:competitionId/teams',
            description: 'Returns all teams for a competition season. Use listCompetitions for related data. Use getCompetition for related data.',
            parameters: [
                {
                    position: {
                        key: 'competitionId',
                        value: '{{COMPETITION_ID}}',
                        location: 'insert'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'season',
                        value: '{{SEASON}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Get all Bundesliga teams for 2024 season',
                    COMPETITION_ID: 'BL1',
                    SEASON: 2024
                },
                {
                    _description: 'Additional test for getCompetitionTeams',
                    competitionId: '1'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: {
                            type: 'integer',
                            description: 'Number of items in the current response'
                        },
                        competition: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'integer',
                                    description: 'Unique identifier'
                                },
                                name: {
                                    type: 'string',
                                    description: 'Display name'
                                },
                                code: {
                                    type: 'string',
                                    description: 'Status or error code'
                                }
                            },
                            description: 'Competition details'
                        },
                        season: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'integer',
                                    description: 'Unique identifier'
                                },
                                startDate: {
                                    type: 'string',
                                    description: 'StartDate value'
                                },
                                endDate: {
                                    type: 'string',
                                    description: 'EndDate value'
                                },
                                currentMatchday: {
                                    type: 'integer',
                                    description: 'CurrentMatchday data'
                                }
                            },
                            description: 'Season details'
                        },
                        teams: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'integer',
                                        description: 'Unique identifier'
                                    },
                                    name: {
                                        type: 'string',
                                        description: 'Display name'
                                    },
                                    shortName: {
                                        type: 'string',
                                        description: 'ShortName value'
                                    },
                                    tla: {
                                        type: 'string',
                                        description: 'Tla value'
                                    },
                                    crest: {
                                        type: 'string',
                                        description: 'Crest value'
                                    },
                                    address: {
                                        type: 'string',
                                        description: 'Address identifier'
                                    },
                                    website: {
                                        type: 'string',
                                        description: 'Website value'
                                    },
                                    founded: {
                                        type: 'integer',
                                        description: 'Founded data'
                                    },
                                    venue: {
                                        type: 'string',
                                        description: 'Venue value'
                                    }
                                },
                                description: 'Individual item in the teams collection'
                            },
                            description: 'Collection of teams items'
                        }
                    }
                }
            }
        },
        getTeam: {
            method: 'GET',
            path: '/teams/:teamId',
            description: 'Returns detailed team information including squad and coaching staff. Use listCompetitions for related data. Use getCompetition for related data.',
            parameters: [
                {
                    position: {
                        key: 'teamId',
                        value: '{{TEAM_ID}}',
                        location: 'insert'
                    },
                    z: {
                        primitive: 'number()',
                        options: []
                    }
                }
            ],
            tests: [
                {
                    _description: 'Get FC Bayern Munich team details',
                    TEAM_ID: 5
                },
                {
                    _description: 'Additional test for getTeam',
                    teamId: 1
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Unique identifier'
                        },
                        name: {
                            type: 'string',
                            description: 'Display name'
                        },
                        shortName: {
                            type: 'string',
                            description: 'ShortName value'
                        },
                        tla: {
                            type: 'string',
                            description: 'Tla value'
                        },
                        crest: {
                            type: 'string',
                            description: 'Crest value'
                        },
                        address: {
                            type: 'string',
                            description: 'Address identifier'
                        },
                        website: {
                            type: 'string',
                            description: 'Website value'
                        },
                        founded: {
                            type: 'integer',
                            description: 'Founded data'
                        },
                        clubColors: {
                            type: 'string',
                            description: 'ClubColors value'
                        },
                        venue: {
                            type: 'string',
                            description: 'Venue value'
                        },
                        squad: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'integer',
                                        description: 'Unique identifier'
                                    },
                                    name: {
                                        type: 'string',
                                        description: 'Display name'
                                    },
                                    position: {
                                        type: 'string',
                                        description: 'Position value'
                                    },
                                    nationality: {
                                        type: 'string',
                                        description: 'Nationality value'
                                    }
                                },
                                description: 'Individual item in the squad collection'
                            },
                            description: 'Collection of squad items'
                        },
                        coach: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'integer',
                                    description: 'Unique identifier'
                                },
                                name: {
                                    type: 'string',
                                    description: 'Display name'
                                },
                                nationality: {
                                    type: 'string',
                                    description: 'Nationality value'
                                }
                            },
                            description: 'Coach details'
                        },
                        lastUpdated: {
                            type: 'string',
                            description: 'LastUpdated value'
                        }
                    }
                }
            }
        },
        getTodaysMatches: {
            method: 'GET',
            path: '/matches',
            description: 'Returns all matches scheduled for today across all competitions. Use listCompetitions for related data. Use getCompetition for related data.',
            parameters: [],
            tests: [
                {
                    _description: 'Get all matches scheduled for today'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: {
                            type: 'integer',
                            description: 'Number of items in the current response'
                        },
                        filters: {
                            type: 'object',
                            description: 'Filters details'
                        },
                        matches: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'integer',
                                        description: 'Unique identifier'
                                    },
                                    utcDate: {
                                        type: 'string',
                                        description: 'UtcDate value'
                                    },
                                    status: {
                                        type: 'string',
                                        description: 'Response status indicator'
                                    },
                                    competition: {
                                        type: 'object',
                                        properties: {
                                            id: {
                                                type: 'integer',
                                                description: 'Unique identifier'
                                            },
                                            name: {
                                                type: 'string',
                                                description: 'Display name'
                                            },
                                            code: {
                                                type: 'string',
                                                description: 'Status or error code'
                                            }
                                        },
                                        description: 'Competition details'
                                    },
                                    homeTeam: {
                                        type: 'object',
                                        properties: {
                                            id: {
                                                type: 'integer',
                                                description: 'Unique identifier'
                                            },
                                            name: {
                                                type: 'string',
                                                description: 'Display name'
                                            },
                                            shortName: {
                                                type: 'string',
                                                description: 'ShortName value'
                                            }
                                        },
                                        description: 'HomeTeam details'
                                    },
                                    awayTeam: {
                                        type: 'object',
                                        properties: {
                                            id: {
                                                type: 'integer',
                                                description: 'Unique identifier'
                                            },
                                            name: {
                                                type: 'string',
                                                description: 'Display name'
                                            },
                                            shortName: {
                                                type: 'string',
                                                description: 'ShortName value'
                                            }
                                        },
                                        description: 'AwayTeam details'
                                    },
                                    score: {
                                        type: 'object',
                                        properties: {
                                            winner: {
                                                type: 'string',
                                                description: 'Winner value'
                                            },
                                            fullTime: {
                                                type: 'object',
                                                properties: {
                                                    home: {
                                                        type: 'integer',
                                                        description: 'Home data'
                                                    },
                                                    away: {
                                                        type: 'integer',
                                                        description: 'Away data'
                                                    }
                                                },
                                                description: 'FullTime details'
                                            }
                                        },
                                        description: 'Relevance or quality score'
                                    }
                                },
                                description: 'Individual item in the matches collection'
                            },
                            description: 'Collection of matches items'
                        }
                    }
                }
            }
        }
    }
}
