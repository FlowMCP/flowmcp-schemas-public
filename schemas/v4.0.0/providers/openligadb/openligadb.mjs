export const main = {
    namespace: 'openligadb',
    name: 'OpenLigaDB',
    description: 'Free REST API for German and international football league data including matches, standings, goal scorers, and team information.',
    version: '4.0.0',
    docs: ['https://api.openligadb.de/index.html'],
    tags: ['sports', 'football', 'soccer', 'bundesliga', 'germany', 'cacheTtlFrequent'],
    root: 'https://api.openligadb.de',
    requiredServerParams: [],
    headers: {},
    tools: {
        getAvailableLeagues: {
            method: 'GET',
            path: '/getavailableleagues',
            description: 'Returns all available leagues and seasons across all sports.',
            parameters: [],
            tests: [
                { _description: 'Get all available leagues' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            leagueId: { type: 'integer' },
                            leagueName: { type: 'string' },
                            leagueShortcut: { type: 'string' },
                            leagueSeason: { type: 'string' },
                            sport: {
                                type: 'object',
                                properties: {
                                    sportId: { type: 'integer' },
                                    sportName: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        },
        getMatchdayData: {
            method: 'GET',
            path: '/getmatchdata/:leagueShortcut/:leagueSeason/:groupOrderId',
            description: 'Returns all matches for a specific matchday (Spieltag) in a league season.',
            parameters: [
                { position: { key: 'leagueShortcut', value: '{{LEAGUE}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'leagueSeason', value: '{{SEASON}}', location: 'insert' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'groupOrderId', value: '{{MATCHDAY}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Get Bundesliga matchday 1 of 2024 season', LEAGUE: 'bl1', SEASON: 2024, MATCHDAY: 1 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            matchID: { type: 'integer' },
                            matchDateTime: { type: 'string' },
                            matchIsFinished: { type: 'boolean' },
                            group: {
                                type: 'object',
                                properties: {
                                    groupName: { type: 'string' },
                                    groupOrderID: { type: 'integer' },
                                    groupID: { type: 'integer' }
                                }
                            },
                            team1: {
                                type: 'object',
                                properties: {
                                    teamId: { type: 'integer' },
                                    teamName: { type: 'string' },
                                    shortName: { type: 'string' },
                                    teamIconUrl: { type: 'string' }
                                }
                            },
                            team2: {
                                type: 'object',
                                properties: {
                                    teamId: { type: 'integer' },
                                    teamName: { type: 'string' },
                                    shortName: { type: 'string' },
                                    teamIconUrl: { type: 'string' }
                                }
                            },
                            matchResults: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        resultName: { type: 'string' },
                                        pointsTeam1: { type: 'integer' },
                                        pointsTeam2: { type: 'integer' },
                                        resultDescription: { type: 'string' }
                                    }
                                }
                            },
                            goals: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        goalGetterName: { type: 'string' },
                                        scoreTeam1: { type: 'integer' },
                                        scoreTeam2: { type: 'integer' },
                                        matchMinute: { type: 'integer' },
                                        isPenalty: { type: 'boolean' },
                                        isOwnGoal: { type: 'boolean' }
                                    }
                                }
                            },
                            location: {
                                type: 'object',
                                properties: {
                                    locationCity: { type: 'string' },
                                    locationStadium: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        },
        getSeasonMatches: {
            method: 'GET',
            path: '/getmatchdata/:leagueShortcut/:leagueSeason',
            description: 'Returns all matches for an entire league season.',
            parameters: [
                { position: { key: 'leagueShortcut', value: '{{LEAGUE}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'leagueSeason', value: '{{SEASON}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Get all Bundesliga matches for 2024 season', LEAGUE: 'bl1', SEASON: 2024 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            matchID: { type: 'integer' },
                            matchDateTime: { type: 'string' },
                            matchIsFinished: { type: 'boolean' },
                            team1: {
                                type: 'object',
                                properties: {
                                    teamId: { type: 'integer' },
                                    teamName: { type: 'string' },
                                    shortName: { type: 'string' }
                                }
                            },
                            team2: {
                                type: 'object',
                                properties: {
                                    teamId: { type: 'integer' },
                                    teamName: { type: 'string' },
                                    shortName: { type: 'string' }
                                }
                            },
                            matchResults: { type: 'array' },
                            goals: { type: 'array' }
                        }
                    }
                }
            }
        },
        getLeagueTable: {
            method: 'GET',
            path: '/getbltable/:leagueShortcut/:leagueSeason',
            description: 'Returns the league standings table with points, wins, draws, losses, and goal statistics.',
            parameters: [
                { position: { key: 'leagueShortcut', value: '{{LEAGUE}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'leagueSeason', value: '{{SEASON}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Get Bundesliga table for 2024 season', LEAGUE: 'bl1', SEASON: 2024 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            teamInfoId: { type: 'integer' },
                            teamName: { type: 'string' },
                            shortName: { type: 'string' },
                            teamIconUrl: { type: 'string' },
                            points: { type: 'integer' },
                            matches: { type: 'integer' },
                            won: { type: 'integer' },
                            draw: { type: 'integer' },
                            lost: { type: 'integer' },
                            goals: { type: 'integer' },
                            opponentGoals: { type: 'integer' },
                            goalDiff: { type: 'integer' }
                        }
                    }
                }
            }
        },
        getGoalGetters: {
            method: 'GET',
            path: '/getgoalgetters/:leagueShortcut/:leagueSeason',
            description: 'Returns the top goal scorers for a league season, sorted by goal count descending.',
            parameters: [
                { position: { key: 'leagueShortcut', value: '{{LEAGUE}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'leagueSeason', value: '{{SEASON}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Get Bundesliga top scorers for 2024 season', LEAGUE: 'bl1', SEASON: 2024 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            goalGetterId: { type: 'integer' },
                            goalGetterName: { type: 'string' },
                            goalCount: { type: 'integer' }
                        }
                    }
                }
            }
        },
        getAvailableTeams: {
            method: 'GET',
            path: '/getavailableteams/:leagueShortcut/:leagueSeason',
            description: 'Returns all teams participating in a league season.',
            parameters: [
                { position: { key: 'leagueShortcut', value: '{{LEAGUE}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'leagueSeason', value: '{{SEASON}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Get all Bundesliga teams for 2024 season', LEAGUE: 'bl1', SEASON: 2024 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            teamId: { type: 'integer' },
                            teamName: { type: 'string' },
                            shortName: { type: 'string' },
                            teamIconUrl: { type: 'string' },
                            teamGroupName: { type: 'string' }
                        }
                    }
                }
            }
        },
        getAvailableGroups: {
            method: 'GET',
            path: '/getavailablegroups/:leagueShortcut/:leagueSeason',
            description: 'Returns all available matchdays (Spieltage) for a league season.',
            parameters: [
                { position: { key: 'leagueShortcut', value: '{{LEAGUE}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'leagueSeason', value: '{{SEASON}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Get all matchdays for Bundesliga 2024 season', LEAGUE: 'bl1', SEASON: 2024 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            groupName: { type: 'string' },
                            groupOrderID: { type: 'integer' },
                            groupID: { type: 'integer' }
                        }
                    }
                }
            }
        },
        getCurrentMatchday: {
            method: 'GET',
            path: '/getcurrentgroup/:leagueShortcut',
            description: 'Returns the current matchday for a league.',
            parameters: [
                { position: { key: 'leagueShortcut', value: '{{LEAGUE}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get current Bundesliga matchday', LEAGUE: 'bl1' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        groupName: { type: 'string' },
                        groupOrderID: { type: 'integer' },
                        groupID: { type: 'integer' }
                    }
                }
            }
        }
    }
}
