export const main = {
    namespace: 'bundeswahlleiterin',
    name: 'Die Bundeswahlleiterin',
    description: 'Access official German federal election results from Die Bundeswahlleiterin. Query Bundestagswahl 2025 results by constituency, state, or party. Includes first votes (Erststimmen), second votes (Zweitstimmen), voter turnout, and structural data for all 299 constituencies. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://www.bundeswahlleiterin.de/', 'https://www.bundeswahlleiterin.de/bundestagswahlen/2025/ergebnisse/opendata.html'],
    tags: ['government', 'elections', 'germany', 'opendata', 'cacheTtlStatic'],
    root: 'https://www.bundeswahlleiterin.de',
    requiredServerParams: [],
    headers: {},
    tools: {
        getResults: {
            method: 'GET',
            path: '/bundestagswahlen/2025/ergebnisse/opendata/btw25/csv/kerg.csv',
            description: 'Get Bundestagswahl 2025 election results. Filter by state (01=SH, 02=HH, 03=NI, 04=HB, 05=NW, 06=HE, 07=RP, 08=BW, 09=BY, 10=SL, 11=BE, 12=BB, 13=MV, 14=SN, 15=ST, 16=TH) or constituency number. Returns party results with first and second votes.',
            parameters: [
                { position: { key: 'state', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'constituency', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(50)', 'min(1)', 'max(299)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] } }
            ],
            preload: {
                enabled: true,
                ttl: 2592000,
                description: 'BTW 2025 official results (~160KB CSV, static after certification)'
            },
            tests: [
                { _description: 'Get all constituency results', limit: 5 },
                { _description: 'Get Berlin constituency results', state: '11', limit: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { election: { type: 'string' }, totalConstituencies: { type: 'number' }, matchCount: { type: 'number' }, constituencies: { type: 'array', items: { type: 'object', properties: { nr: { type: 'number' }, name: { type: 'string' }, state: { type: 'string' }, winner: { type: 'string' }, eligibleVoters: { type: 'number' }, voters: { type: 'number' }, turnoutPct: { type: 'number' }, parties: { type: 'object' } } } } } }
            }
        },
        searchConstituencies: {
            method: 'GET',
            path: '/bundestagswahlen/2025/ergebnisse/opendata/btw25/csv/kerg.csv',
            description: 'Search constituencies by name. Case-insensitive search across constituency names.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            preload: {
                enabled: true,
                ttl: 2592000,
                description: 'Fetches full dataset, searches client-side'
            },
            tests: [
                { _description: 'Search for Berlin constituencies', q: 'Berlin' },
                { _description: 'Search for Munich constituencies', q: 'München' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { query: { type: 'string' }, matchCount: { type: 'number' }, constituencies: { type: 'array', items: { type: 'object', properties: { nr: { type: 'number' }, name: { type: 'string' }, state: { type: 'string' }, winner: { type: 'string' }, turnoutPct: { type: 'number' } } } } } }
            }
        },
        getPartyResults: {
            method: 'GET',
            path: '/bundestagswahlen/2025/ergebnisse/opendata/btw25/csv/kerg.csv',
            description: 'Get nationwide results for a specific party across all constituencies. Party names: SPD, CDU, GRÜNE, FDP, AfD, CSU, Die Linke, BSW, Volt, FREIE WÄHLER, SSW, etc.',
            parameters: [
                { position: { key: 'party', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'voteType', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(erst,zweit,both)', options: ['optional()', 'default(both)'] } }
            ],
            preload: {
                enabled: true,
                ttl: 2592000,
                description: 'Fetches full dataset, filters by party client-side'
            },
            tests: [
                { _description: 'CDU results nationwide', party: 'CDU' },
                { _description: 'AfD second votes only', party: 'AfD', voteType: 'zweit' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { party: { type: 'string' }, totalFirstVotes: { type: 'number' }, totalSecondVotes: { type: 'number' }, constituencies: { type: 'array', items: { type: 'object', properties: { nr: { type: 'number' }, name: { type: 'string' }, firstVotes: { type: 'number' }, secondVotes: { type: 'number' } } } } } }
            }
        },
        getNationalSummary: {
            method: 'GET',
            path: '/bundestagswahlen/2025/ergebnisse/opendata/btw25/csv/kerg.csv',
            description: 'Get the national summary of the Bundestagswahl 2025. Returns total votes, turnout, and results for all parties sorted by second votes.',
            parameters: [],
            preload: {
                enabled: true,
                ttl: 2592000,
                description: 'Fetches full dataset, extracts national summary'
            },
            tests: [
                { _description: 'Get national election summary' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { election: { type: 'string' }, eligibleVoters: { type: 'number' }, totalVoters: { type: 'number' }, turnoutPct: { type: 'number' }, parties: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, firstVotes: { type: 'number' }, secondVotes: { type: 'number' }, firstVotesPct: { type: 'number' }, secondVotesPct: { type: 'number' } } } } } }
            }
        },
        getStructuralData: {
            method: 'GET',
            path: '/dam/jcr/181f9e38-38db-4f64-991c-8141dfa0f2cb/btw2025_strukturdaten.csv',
            description: 'Get structural/demographic data for constituencies: population, age distribution, area, housing, employment, income, education, and unemployment rates.',
            parameters: [
                { position: { key: 'constituency', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'state', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(50)', 'min(1)', 'max(299)'] } }
            ],
            preload: {
                enabled: true,
                ttl: 2592000,
                description: 'Constituency structural data (~98KB CSV, static)'
            },
            tests: [
                { _description: 'Get structural data for all constituencies', limit: 5 },
                { _description: 'Get Berlin structural data', state: '11', limit: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { totalConstituencies: { type: 'number' }, constituencies: { type: 'array', items: { type: 'object', properties: { nr: { type: 'number' }, name: { type: 'string' }, state: { type: 'string' }, population: { type: 'number' }, area: { type: 'number' }, populationDensity: { type: 'number' }, unemploymentRate: { type: 'number' } } } } } }
            }
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => {
    const _resultCache = { data: null, timestamp: null, ttl: 86400000 }
    const _structCache = { data: null, timestamp: null, ttl: 86400000 }

    const STATE_NAMES = {
        '01': 'Schleswig-Holstein', '02': 'Hamburg', '03': 'Niedersachsen',
        '04': 'Bremen', '05': 'Nordrhein-Westfalen', '06': 'Hessen',
        '07': 'Rheinland-Pfalz', '08': 'Baden-Württemberg', '09': 'Bayern',
        '10': 'Saarland', '11': 'Berlin', '12': 'Brandenburg',
        '13': 'Mecklenburg-Vorpommern', '14': 'Sachsen', '15': 'Sachsen-Anhalt',
        '16': 'Thüringen'
    }

    const fetchResults = async () => {
        const now = Date.now()
        if( _resultCache.data && _resultCache.timestamp && ( now - _resultCache.timestamp ) < _resultCache.ttl ) {
            return { data: _resultCache.data, fromCache: true }
        }

        const response = await fetch( 'https://www.bundeswahlleiterin.de/bundestagswahlen/2025/ergebnisse/opendata/btw25/csv/kerg.csv' )
        if( !response.ok ) {
            throw new Error( `HTTP ${response.status}: ${response.statusText}` )
        }

        const text = await response.text()
        const lines = text.split( '\n' )

        const partyLine = lines[5] || ''
        const partyNames = partyLine.split( ';' )
        const parties = []
        let idx = 4

        const collectParties = () => {
            if( idx >= partyNames.length ) { return }
            const name = partyNames[idx].trim()
            if( name && name !== '' ) {
                parties.push( { name, startIdx: idx } )
            }
            idx += 4
            collectParties()
        }
        collectParties()

        const constituencies = []
        lines.slice( 8 )
            .forEach( ( line ) => {
                if( !line.trim() ) { return }
                const cols = line.split( ';' )
                const nr = parseInt( cols[0] )
                if( isNaN( nr ) ) { return }

                const name = cols[1] || ''
                const stateCode = ( cols[2] || '' ).trim()
                const winner = cols[3] || ''
                const eligibleFirst = parseInt( cols[4] ) || 0
                const votersFirst = parseInt( cols[8] ) || 0
                const eligibleSecond = parseInt( cols[6] ) || 0
                const votersSecond = parseInt( cols[10] ) || 0
                const validFirst = parseInt( cols[16] ) || 0
                const validSecond = parseInt( cols[18] ) || 0

                const partyResults = {}
                parties
                    .forEach( ( party ) => {
                        const i = party.startIdx
                        const firstVotes = parseInt( cols[i] ) || 0
                        const secondVotes = parseInt( cols[i + 2] ) || 0
                        if( firstVotes > 0 || secondVotes > 0 ) {
                            partyResults[party.name] = {
                                firstVotes,
                                secondVotes,
                                firstVotesPct: validFirst > 0 ? Math.round( ( firstVotes / validFirst ) * 1000 ) / 10 : 0,
                                secondVotesPct: validSecond > 0 ? Math.round( ( secondVotes / validSecond ) * 1000 ) / 10 : 0
                            }
                        }
                    } )

                const turnout = eligibleFirst > 0 ? Math.round( ( votersFirst / eligibleFirst ) * 1000 ) / 10 : 0

                constituencies.push( {
                    nr,
                    name,
                    stateCode,
                    stateName: STATE_NAMES[stateCode] || stateCode,
                    winner,
                    eligibleVoters: eligibleFirst,
                    voters: votersFirst,
                    turnoutPct: turnout,
                    validFirstVotes: validFirst,
                    validSecondVotes: validSecond,
                    parties: partyResults
                } )
            } )

        _resultCache.data = { parties: parties.map( ( p ) => p.name ), constituencies }
        _resultCache.timestamp = now

        return { data: _resultCache.data, fromCache: false }
    }

    const fetchStructural = async () => {
        const now = Date.now()
        if( _structCache.data && _structCache.timestamp && ( now - _structCache.timestamp ) < _structCache.ttl ) {
            return { data: _structCache.data, fromCache: true }
        }

        const response = await fetch( 'https://www.bundeswahlleiterin.de/dam/jcr/181f9e38-38db-4f64-991c-8141dfa0f2cb/btw2025_strukturdaten.csv' )
        if( !response.ok ) {
            throw new Error( `HTTP ${response.status}: ${response.statusText}` )
        }

        const text = await response.text()
        const lines = text.split( '\n' )
        const constituencies = []

        lines.slice( 9 )
            .forEach( ( line ) => {
                if( !line.trim() ) { return }
                const cols = line.split( ';' )
                const stateCode = ( cols[0] || '' ).trim()
                const nr = parseInt( cols[1] )
                if( isNaN( nr ) ) { return }

                const name = cols[2] || ''
                const population = parseFloat( ( cols[5] || '' ).replace( ',', '.' ) ) || 0
                const area = parseFloat( ( cols[4] || '' ).replace( ',', '.' ) ) || 0
                const density = parseFloat( ( cols[7] || '' ).replace( ',', '.' ) ) || 0
                const under18Pct = parseFloat( ( cols[10] || '' ).replace( ',', '.' ) ) || 0
                const age18to24Pct = parseFloat( ( cols[11] || '' ).replace( ',', '.' ) ) || 0
                const age25to34Pct = parseFloat( ( cols[12] || '' ).replace( ',', '.' ) ) || 0
                const age35to59Pct = parseFloat( ( cols[13] || '' ).replace( ',', '.' ) ) || 0
                const age60to74Pct = parseFloat( ( cols[14] || '' ).replace( ',', '.' ) ) || 0
                const age75plusPct = parseFloat( ( cols[15] || '' ).replace( ',', '.' ) ) || 0
                const foreignersPct = parseFloat( ( cols[6] || '' ).replace( ',', '.' ) ) || 0
                const unemploymentRate = parseFloat( ( cols[43] || '' ).replace( ',', '.' ) ) || 0

                constituencies.push( {
                    nr,
                    name,
                    stateCode,
                    stateName: STATE_NAMES[stateCode] || stateCode,
                    populationThousands: population,
                    areaKm2: area,
                    populationDensity: density,
                    foreignersPct,
                    ageDistribution: { under18Pct, age18to24Pct, age25to34Pct, age35to59Pct, age60to74Pct, age75plusPct },
                    unemploymentRate
                } )
            } )

        _structCache.data = constituencies
        _structCache.timestamp = now

        return { data: constituencies, fromCache: false }
    }

    return {
        getResults: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { data, fromCache } = await fetchResults()
                    const stateFilter = ( payload.state || '' ).trim()
                    const constituencyFilter = payload.constituency || null
                    const limit = payload.limit || 50
                    const offset = payload.offset || 0

                    const filtered = data.constituencies
                        .filter( ( c ) => {
                            if( stateFilter && c.stateCode !== stateFilter ) { return false }
                            if( constituencyFilter && c.nr !== constituencyFilter ) { return false }

                            return true
                        } )

                    const sliced = filtered.slice( offset, offset + limit )

                    struct.data = {
                        source: 'Die Bundeswahlleiterin',
                        election: 'Bundestagswahl 2025',
                        totalConstituencies: data.constituencies.length,
                        matchCount: filtered.length,
                        offset,
                        limit,
                        fromCache,
                        constituencies: sliced
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error fetching election results: ${error.message}` )
                }

                return { struct }
            }
        },
        searchConstituencies: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { data, fromCache } = await fetchResults()
                    const q = ( payload.q || '' ).toLowerCase()

                    const filtered = data.constituencies
                        .filter( ( c ) => {
                            const searchStr = [c.name, c.stateName, c.winner].join( ' ' ).toLowerCase()

                            return searchStr.includes( q )
                        } )
                        .map( ( c ) => {
                            const entry = {
                                nr: c.nr,
                                name: c.name,
                                state: c.stateName,
                                winner: c.winner,
                                turnoutPct: c.turnoutPct,
                                voters: c.voters
                            }

                            return entry
                        } )

                    struct.data = {
                        source: 'Die Bundeswahlleiterin',
                        query: q,
                        matchCount: filtered.length,
                        fromCache,
                        constituencies: filtered
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error searching constituencies: ${error.message}` )
                }

                return { struct }
            }
        },
        getPartyResults: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { data, fromCache } = await fetchResults()
                    const partySearch = ( payload.party || '' ).toLowerCase()
                    const voteType = payload.voteType || 'both'

                    const matchedParty = data.parties
                        .find( ( p ) => p.toLowerCase().includes( partySearch ) ) || payload.party

                    let totalFirst = 0
                    let totalSecond = 0
                    const results = data.constituencies
                        .filter( ( c ) => c.parties[matchedParty] )
                        .map( ( c ) => {
                            const p = c.parties[matchedParty]
                            totalFirst += p.firstVotes
                            totalSecond += p.secondVotes
                            const entry = {
                                nr: c.nr,
                                name: c.name,
                                state: c.stateName
                            }
                            if( voteType === 'erst' || voteType === 'both' ) {
                                entry.firstVotes = p.firstVotes
                                entry.firstVotesPct = p.firstVotesPct
                            }
                            if( voteType === 'zweit' || voteType === 'both' ) {
                                entry.secondVotes = p.secondVotes
                                entry.secondVotesPct = p.secondVotesPct
                            }

                            return entry
                        } )

                    struct.data = {
                        source: 'Die Bundeswahlleiterin',
                        election: 'Bundestagswahl 2025',
                        party: matchedParty,
                        totalFirstVotes: totalFirst,
                        totalSecondVotes: totalSecond,
                        constituenciesWithVotes: results.length,
                        fromCache,
                        constituencies: results
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error fetching party results: ${error.message}` )
                }

                return { struct }
            }
        },
        getNationalSummary: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { data, fromCache } = await fetchResults()

                    let totalEligible = 0
                    let totalVoters = 0
                    let totalValidFirst = 0
                    let totalValidSecond = 0
                    const partyTotals = {}

                    data.constituencies
                        .forEach( ( c ) => {
                            totalEligible += c.eligibleVoters
                            totalVoters += c.voters
                            totalValidFirst += c.validFirstVotes
                            totalValidSecond += c.validSecondVotes

                            Object.entries( c.parties )
                                .forEach( ( [ name, votes ] ) => {
                                    if( !partyTotals[name] ) {
                                        partyTotals[name] = { firstVotes: 0, secondVotes: 0 }
                                    }
                                    partyTotals[name].firstVotes += votes.firstVotes
                                    partyTotals[name].secondVotes += votes.secondVotes
                                } )
                        } )

                    const parties = Object.entries( partyTotals )
                        .map( ( [ name, votes ] ) => {
                            const entry = {
                                name,
                                firstVotes: votes.firstVotes,
                                secondVotes: votes.secondVotes,
                                firstVotesPct: totalValidFirst > 0 ? Math.round( ( votes.firstVotes / totalValidFirst ) * 1000 ) / 10 : 0,
                                secondVotesPct: totalValidSecond > 0 ? Math.round( ( votes.secondVotes / totalValidSecond ) * 1000 ) / 10 : 0
                            }

                            return entry
                        } )
                        .sort( ( a, b ) => b.secondVotes - a.secondVotes )

                    struct.data = {
                        source: 'Die Bundeswahlleiterin',
                        election: 'Bundestagswahl 2025',
                        eligibleVoters: totalEligible,
                        totalVoters,
                        turnoutPct: totalEligible > 0 ? Math.round( ( totalVoters / totalEligible ) * 1000 ) / 10 : 0,
                        validFirstVotes: totalValidFirst,
                        validSecondVotes: totalValidSecond,
                        fromCache,
                        parties
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error fetching national summary: ${error.message}` )
                }

                return { struct }
            }
        },
        getStructuralData: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { data, fromCache } = await fetchStructural()
                    const stateFilter = ( payload.state || '' ).trim()
                    const constituencyFilter = payload.constituency || null
                    const limit = payload.limit || 50

                    const filtered = data
                        .filter( ( c ) => {
                            if( stateFilter && c.stateCode !== stateFilter ) { return false }
                            if( constituencyFilter && c.nr !== constituencyFilter ) { return false }

                            return true
                        } )
                        .slice( 0, limit )

                    struct.data = {
                        source: 'Die Bundeswahlleiterin',
                        totalConstituencies: data.length,
                        matchCount: filtered.length,
                        fromCache,
                        constituencies: filtered
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error fetching structural data: ${error.message}` )
                }

                return { struct }
            }
        }
    }
}
