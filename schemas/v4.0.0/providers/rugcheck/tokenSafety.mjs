// Migrated from v1.2.0 -> v2.0.0
// Category: simple

export const main = {
    namespace: 'rugcheck',
    name: 'Rugcheck Token Safety',
    description: 'Check Solana token safety scores, risk reports, votes, and trending tokens via rugcheck.xyz',
    version: '4.0.0',
    docs: ['https://api.rugcheck.xyz/swagger/index.html'],
    tags: ['solana', 'security', 'tokens', 'cacheTtlFrequent'],
    root: 'https://api.rugcheck.xyz',
    tools: {
        getTokenReport: {
            method: 'GET',
            path: '/v1/tokens/:mint/report/summary',
            description: 'Get a summarized safety report for a Solana token by its mint address. Required: mint.. Use getTokenVotes first to find valid IDs',
            parameters: [
                { position: { key: 'mint', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(32)'] } }
            ],
            tests: [
                { _description: 'Get safety report for USDC token', mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        mint: { type: 'string' },
                        tokenProgram: { type: 'string' },
                        creator: { type: 'string', nullable: true },
                        creatorBalance: { type: 'number' },
                        token: { type: 'string', nullable: true },
                        token_extensions: { type: 'string', nullable: true },
                        tokenMeta: { type: 'string', nullable: true },
                        topHolders: { type: 'string', nullable: true },
                        freezeAuthority: { type: 'string', nullable: true },
                        mintAuthority: { type: 'string', nullable: true },
                        risks: { type: 'string', nullable: true },
                        score: { type: 'number' },
                        score_normalised: { type: 'number' },
                        fileMeta: { type: 'string', nullable: true },
                        lockerOwners: { type: 'string', nullable: true },
                        lockers: { type: 'string', nullable: true },
                        markets: { type: 'string', nullable: true },
                        totalMarketLiquidity: { type: 'number' },
                        totalStableLiquidity: { type: 'number' },
                        totalLPProviders: { type: 'number' },
                        totalHolders: { type: 'number' },
                        price: { type: 'number' },
                        rugged: { type: 'boolean' },
                        tokenType: { type: 'string' },
                        transferFee: { type: 'object', properties: { pct: { type: 'number' }, maxAmount: { type: 'number' }, authority: { type: 'string' } } },
                        knownAccounts: { type: 'number', nullable: true },
                        events: { type: 'string', nullable: true },
                        verification: { type: 'string', nullable: true },
                        graphInsidersDetected: { type: 'number' },
                        insiderNetworks: { type: 'string', nullable: true },
                        detectedAt: { type: 'string' },
                        creatorTokens: { type: 'string', nullable: true },
                        launchpad: { type: 'string', nullable: true },
                        deployPlatform: { type: 'string' }
                    }
                }
            },
        },
        getTokenVotes: {
            method: 'GET',
            path: '/v1/tokens/:mint/votes',
            description: 'Get community votes for a Solana token via Rugcheck — query by mint. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'mint', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(32)'] } }
            ],
            tests: [
                { _description: 'Get community votes for USDC token', mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        up: { type: 'number' },
                        down: { type: 'number' },
                        userVoted: { type: 'boolean' }
                    }
                }
            },
        },
        getRecentTokens: {
            method: 'GET',
            path: '/v1/stats/recent',
            description: 'Get recently analyzed tokens via Rugcheck. Returns structured JSON response data.',
            parameters: [],
            tests: [
                { _description: 'Fetch recently analyzed tokens' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            mint: { type: 'string' },
                            metadata: { type: 'object', properties: { name: { type: 'string' }, symbol: { type: 'string' }, uri: { type: 'string' }, mutable: { type: 'boolean' }, updateAuthority: { type: 'string' } } },
                            user_visits: { type: 'number' },
                            visits: { type: 'number' },
                            score: { type: 'number' }
                        }
                    }
                }
            },
        },
        getTrendingTokens: {
            method: 'GET',
            path: '/v1/stats/trending',
            description: 'Get currently trending tokens on Solana via Rugcheck. Returns structured JSON response data.',
            parameters: [],
            tests: [
                { _description: 'Fetch trending tokens' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            mint: { type: 'string' },
                            vote_count: { type: 'number' },
                            up_count: { type: 'number' }
                        }
                    }
                }
            },
        },
        getNewTokens: {
            method: 'GET',
            path: '/v1/stats/new_tokens',
            description: 'Get newly created tokens on Solana via Rugcheck. Returns structured JSON response data.',
            parameters: [],
            tests: [
                { _description: 'Fetch new tokens' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            mint: { type: 'string' },
                            decimals: { type: 'number' },
                            symbol: { type: 'string' },
                            creator: { type: 'string' },
                            mintAuthority: { type: 'string' },
                            freezeAuthority: { type: 'string' },
                            program: { type: 'string' },
                            createAt: { type: 'string' },
                            updatedAt: { type: 'string' },
                            events: { type: 'string', nullable: true }
                        }
                    }
                }
            },
        },
        getVerifiedTokens: {
            method: 'GET',
            path: '/v1/stats/verified',
            description: 'Get verified tokens on Solana via Rugcheck. Returns structured JSON response data.',
            parameters: [],
            tests: [
                { _description: 'Fetch verified tokens' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            mint: { type: 'string' },
                            payer: { type: 'string' },
                            name: { type: 'string' },
                            symbol: { type: 'string' },
                            description: { type: 'string' },
                            jup_verified: { type: 'boolean' },
                            jup_strict: { type: 'boolean' },
                            links: { type: 'string', nullable: true }
                        }
                    }
                }
            },
        }
    }
}
