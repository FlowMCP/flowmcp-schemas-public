// service.bund.de — Public Procurement Tenders RSS Feed
// Category: handlers-clean
// No API key required — public RSS feed endpoint
// executeRequest handlers receive userParams via payload.userParams (not payload directly).

export const main = {
    namespace: 'servicebund',
    name: 'service.bund.de Procurement Tenders',
    description: 'Search and filter German public procurement tenders (Ausschreibungen) and awarded contracts from federal, state, and municipal authorities via RSS feed',
    version: '4.0.0',
    docs: ['https://www.service.bund.de/Content/DE/Ausschreibungen/Suche/Formular.html'],
    tags: ['procurement', 'tenders', 'germany', 'government', 'opendata'],
    root: 'https://www.service.bund.de',
    tools: {
        searchTenders: {
            method: 'GET',
            path: '/Content/DE/Ausschreibungen/Suche/Formular.html',
            description: 'Search open tenders with optional filters for keyword, federal state, service category, and procurement procedure type. Returns up to 100 results sorted by date.',
            parameters: [
                { position: { key: 'keyword', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(2)', 'optional()'] } },
                { position: { key: 'state', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'category', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'procedureType', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'default(20)', 'optional()'] } }
            ],
            tests: [
                { _description: 'All recent tenders (no filters)', keyword: 'Software', state: 'berlin', limit: 5 },
                { _description: 'IT tenders in Berlin', keyword: 'Software', state: 'berlin', limit: 5 },
                { _description: 'Construction tenders', category: 'bauleistungen', limit: 5 },
                { _description: 'Tenders in Bayern', state: 'bayern', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', description: 'Response status' },
                        data: { type: 'object', description: 'Response payload' }
                    }
                }
            }
        },
        getTendersByState: {
            method: 'GET',
            path: '/Content/DE/Ausschreibungen/Suche/Formular.html',
            description: 'Get open tenders filtered by a specific German federal state (Bundesland). Valid states: berlin, hamburg, bremen, niedersachsen, nordrhein-westfalen, hessen, rheinland-pfalz, baden-wuerttemberg, bayern, saarland, schleswig-holstein, mecklenburg-vorpommern, sachsen, sachsen-anhalt, thueringen, brandenburg, keineangabe (bundesweit).',
            parameters: [
                { position: { key: 'state', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(2)'] } },
                { position: { key: 'keyword', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(2)', 'optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'default(20)', 'optional()'] } }
            ],
            tests: [
                { _description: 'Tenders in Berlin', state: 'berlin', limit: 5 },
                { _description: 'Tenders in Hamburg with keyword', state: 'hamburg', keyword: 'IT', limit: 5 },
                { _description: 'Tenders in Nordrhein-Westfalen', state: 'nordrhein-westfalen', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', description: 'Response status' },
                        data: { type: 'object', description: 'Response payload' }
                    }
                }
            }
        },
        getTendersByCategory: {
            method: 'GET',
            path: '/Content/DE/Ausschreibungen/Suche/Formular.html',
            description: 'Get open tenders filtered by service category (Leistungen und Erzeugnisse). Valid categories: bauleistungen, dienstleistungen, lieferleistungen, arbeitsmarktdienstleistungen, informationstechnik, forschungundentwicklung, kraftfahrwesen, maschinen, kommunikationsundelektrotechnik, medizintechnik, bekleidungmoebelunddruck, energiequellen, rohwasserreinwasser, sanitaetswesen, lebensmittel, fertigerzeugnisse, natuerlicheerzeugnisse, waffenmunitionundtechnischesondergeraete, schiffswesen.',
            parameters: [
                { position: { key: 'category', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(2)'] } },
                { position: { key: 'state', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'keyword', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(2)', 'optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'default(20)', 'optional()'] } }
            ],
            tests: [
                { _description: 'IT tenders', category: 'informationstechnik', limit: 5 },
                { _description: 'Construction tenders in Berlin', category: 'bauleistungen', state: 'berlin', limit: 5 },
                { _description: 'Service tenders', category: 'dienstleistungen', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', description: 'Response status' },
                        data: { type: 'object', description: 'Response payload' }
                    }
                }
            }
        },
        getAwardedContracts: {
            method: 'GET',
            path: '/Content/DE/Ausschreibungen/Suche/Formular.html',
            description: 'Get awarded contracts (Vergebene Auftraege) with optional filters for keyword, state, and category.',
            parameters: [
                { position: { key: 'keyword', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(2)', 'optional()'] } },
                { position: { key: 'state', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'category', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'default(20)', 'optional()'] } }
            ],
            tests: [
                { _description: 'Recent awarded contracts', limit: 5 },
                { _description: 'Awarded contracts in Berlin', state: 'berlin', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', description: 'Response status' },
                        data: { type: 'object', description: 'Response payload' }
                    }
                }
            }
        },
        searchByKeyword: {
            method: 'GET',
            path: '/Content/DE/Ausschreibungen/Suche/Formular.html',
            description: 'Quick keyword search across all open tenders. Returns matching Ausschreibungen sorted by date.',
            parameters: [
                { position: { key: 'keyword', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(2)'] } },
                { position: { key: 'state', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'default(20)', 'optional()'] } }
            ],
            tests: [
                { _description: 'Search for Software tenders', keyword: 'Software', limit: 5 },
                { _description: 'Search for Reinigung', keyword: 'Reinigung', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', description: 'Response status' },
                        data: { type: 'object', description: 'Response payload' }
                    }
                }
            }
        },
        getRecentTenders: {
            method: 'GET',
            path: '/Content/DE/Ausschreibungen/Suche/Formular.html',
            description: 'Get the most recent open tenders sorted by publication date (newest first), no filters applied.',
            parameters: [
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'default(20)', 'optional()'] } }
            ],
            tests: [
                { _description: 'Latest 10 tenders', limit: 10 },
                { _description: 'Latest 5 tenders', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', description: 'Response status' },
                        data: { type: 'object', description: 'Response payload' }
                    }
                }
            }
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => {
    const RSS_BASE = 'https://www.service.bund.de/Content/DE/Ausschreibungen/Suche/Formular.html'

    const STATE_MAP = {
        'berlin': 'berlin',
        'hamburg': 'hamburg',
        'bremen': 'bremen',
        'niedersachsen': 'niedersachsen',
        'nordrhein-westfalen': 'nordrhein-westfalen',
        'hessen': 'hessen',
        'rheinland-pfalz': 'rheinland-pfalz',
        'baden-wuerttemberg': 'baden-württemberg',
        'bayern': 'bayern',
        'saarland': 'saarland',
        'schleswig-holstein': 'schleswig-holstein',
        'mecklenburg-vorpommern': 'mecklenburg-vorpommern',
        'sachsen': 'sachsen',
        'sachsen-anhalt': 'sachsen-anhalt',
        'thueringen': 'thüringen',
        'brandenburg': 'brandenburg',
        'keineangabe': 'keineangabe'
    }

    const CATEGORY_MAP = {
        'bauleistungen': 'leistung-bauleistungen',
        'dienstleistungen': 'leistung-dienstleistungen',
        'lieferleistungen': 'leistung-lieferleistungen',
        'arbeitsmarktdienstleistungen': 'leistung-arbeitsmarktdienstleistungen',
        'informationstechnik': 'leistung-informationstechnik',
        'forschungundentwicklung': 'leistung-forschungundentwicklung',
        'kraftfahrwesen': 'leistung-kraftfahrwesen',
        'maschinen': 'leistung-maschinen',
        'kommunikationsundelektrotechnik': 'leistung-kommunikationsundelektrotechnik',
        'medizintechnik': 'leistung-medizintechnik',
        'bekleidungmoebelunddruck': 'leistung-bekleidungmoebelunddruck',
        'energiequellen': 'leistung-energiequellen',
        'rohwasserreinwasser': 'leistung-rohwasserreinwasser',
        'sanitaetswesen': 'leistung-sanitaetswesen',
        'lebensmittel': 'leistung-lebensmittel',
        'fertigerzeugnisse': 'leistung-fertigerzeugnisse',
        'natuerlicheerzeugnisse': 'leistung-natuerlicheerzeugnisse',
        'waffenmunitionundtechnischesondergeraete': 'leistung-waffenmunitionundtechnischesondergeraete',
        'schiffswesen': 'leistung-schiffswesen'
    }

    const PROCEDURE_MAP = {
        'vob': 'ausschreibungsart-vob',
        'vgv': 'ausschreibungsart-vgv',
        'vol': 'ausschreibungsart-vol',
        'sonstige': 'sonstige',
        'uvgo': 'ausschreibungsart-uvgo',
        'vof': 'ausschreibungsart-vof',
        'sektvo': 'ausschreibungsart-sektvo',
        'vsvgv': 'ausschreibungsart-vsvgv',
        'konzvgv': 'ausschreibungsart-konzvgv',
        'haushaltsrecht': 'ausschreibungsart-haushaltsrecht'
    }

    const decodeHtmlEntities = ( { text } ) => {
        const entities = {
            '&#228;': 'ä', '&#246;': 'ö', '&#252;': 'ü',
            '&#196;': 'Ä', '&#214;': 'Ö', '&#220;': 'Ü',
            '&#223;': 'ß', '&#233;': 'é', '&#232;': 'è',
            '&#39;': "'", '&#34;': '"',
            '&amp;': '&', '&lt;': '<', '&gt;': '>',
            '&quot;': '"', '&apos;': "'",
            '&uuml;': 'ü', '&ouml;': 'ö', '&auml;': 'ä',
            '&Uuml;': 'Ü', '&Ouml;': 'Ö', '&Auml;': 'Ä',
            '&szlig;': 'ß'
        }

        let result = text
        Object.entries( entities )
            .forEach( ( [ entity, char ] ) => {
                result = result.split( entity ).join( char )
            } )

        result = result.replace( /&#(\d+);/g, ( _, code ) => String.fromCharCode( parseInt( code ) ) )

        return result
    }

    const stripHtml = ( { text } ) => {
        const cleaned = text
            .replace( /<[^>]*>/g, '' )
            .replace( /\s+/g, ' ' )
            .trim()

        return cleaned
    }

    const extractField = ( { html, label } ) => {
        const regex = new RegExp( `${label}[:\\s]*<strong>([^<]*)<\\/strong>`, 'i' )
        const match = html.match( regex )

        if( !match ) {
            return null
        }

        const value = decodeHtmlEntities( { text: match[1].trim() } )

        return value
    }

    const buildRssUrl = ( { type = 0, keyword, state, category, procedureType, limit = 20 } ) => {
        const params = new URLSearchParams()
        params.set( 'nn', '4641482' )
        params.set( 'sortOrder', 'dateOfIssue_dt desc' )
        params.set( 'jobsrss', 'true' )
        params.set( 'type', String( type ) )
        params.set( 'resultsPerPage', String( Math.min( limit, 100 ) ) )

        if( keyword ) {
            params.set( 'templateQueryString', keyword )
        }

        if( state ) {
            const stateKey = state.toLowerCase().trim()
            const stateValue = STATE_MAP[stateKey]

            if( !stateValue ) {
                throw new Error( `Invalid state "${state}". Valid: ${Object.keys( STATE_MAP ).join( ', ' )}` )
            }

            params.set( 'cl2Addresses_Adresse_State', stateValue )
        }

        if( category ) {
            const catKey = category.toLowerCase().trim()
            const catValue = CATEGORY_MAP[catKey]

            if( !catValue ) {
                throw new Error( `Invalid category "${category}". Valid: ${Object.keys( CATEGORY_MAP ).join( ', ' )}` )
            }

            params.set( 'cl2Categories_LeistungenErzeugnisse', catValue )
        }

        if( procedureType ) {
            const procKey = procedureType.toLowerCase().trim()
            const procValue = PROCEDURE_MAP[procKey]

            if( !procValue ) {
                throw new Error( `Invalid procedureType "${procedureType}". Valid: ${Object.keys( PROCEDURE_MAP ).join( ', ' )}` )
            }

            params.set( 'cl2Categories_AllocationType', procValue )
        }

        const url = `${RSS_BASE}?${params.toString()}`

        return url
    }

    const fetchRss = async ( { url } ) => {
        const response = await fetch( url, {
            headers: { 'Accept': 'application/rss+xml, application/xml, text/xml' }
        } )

        if( !response.ok ) {
            throw new Error( `HTTP ${response.status}: ${response.statusText}` )
        }

        const xml = await response.text()

        return xml
    }

    const parseRssItems = ( { xml } ) => {
        const matches = [ ...xml.matchAll( /<item>([\s\S]*?)<\/item>/g ) ]
        const items = matches
            .map( ( match ) => {
                const itemXml = match[1]
                const rawTitle = ( itemXml.match( /<title>([\s\S]*?)<\/title>/ ) || [] )[1] || ''
                const link = ( itemXml.match( /<link>([\s\S]*?)<\/link>/ ) || [] )[1] || ''
                const rawDescription = ( itemXml.match( /<description>([\s\S]*?)<\/description>/ ) || [] )[1] || ''
                const pubDate = ( itemXml.match( /<pubDate>([\s\S]*?)<\/pubDate>/ ) || [] )[1] || ''
                const guid = ( itemXml.match( /<guid>([\s\S]*?)<\/guid>/ ) || [] )[1] || ''

                const title = decodeHtmlEntities( { text: rawTitle.trim() } )
                const cleanLink = link.replace( /#track=.*$/, '' ).trim()

                const descHtml = rawDescription
                    .replace( /^[\s\S]*?\[CDATA\[/, '' )
                    .replace( /\]\]>[\s\S]*$/, '' )

                const location = extractField( { html: descHtml, label: 'Erf(?:&uuml;|ü)llungsort' } )
                const authority = extractField( { html: descHtml, label: 'Vergabestelle' } )
                const deadline = extractField( { html: descHtml, label: 'Angebotsfrist' } )
                const publicationEnd = extractField( { html: descHtml, label: 'Ver(?:ö|&ouml;)ffentlichungsende' } )

                const item = {
                    title,
                    link: cleanLink,
                    location,
                    authority,
                    deadline,
                    publicationEnd,
                    publishedAt: pubDate.trim(),
                    id: guid.trim()
                }

                return item
            } )

        return items
    }

    const executeSearch = async ( { struct, userParams, type = 0 } ) => {
        const { keyword, state, category, procedureType, limit } = userParams

        const url = buildRssUrl( {
            type,
            keyword: keyword || null,
            state: state || null,
            category: category || null,
            procedureType: procedureType || null,
            limit: limit || 20
        } )

        const xml = await fetchRss( { url } )
        const items = parseRssItems( { xml } )

        const filters = {}

        if( keyword ) { filters['keyword'] = keyword }
        if( state ) { filters['state'] = state }
        if( category ) { filters['category'] = category }
        if( procedureType ) { filters['procedureType'] = procedureType }

        struct.data = {
            source: 'service.bund.de',
            type: type === 0 ? 'Ausschreibungen' : type === 1 ? 'Vergebene Aufträge' : 'Vergebene Aufträge (evergabe-online.de)',
            filters,
            resultCount: items.length,
            items
        }

        return struct
    }

    return {
        searchTenders: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { userParams } = payload
                    await executeSearch( { struct, userParams, type: 0 } )
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error searching tenders: ${error.message}` )
                }

                return { struct }
            }
        },
        getTendersByState: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { userParams } = payload
                    await executeSearch( { struct, userParams, type: 0 } )
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error fetching tenders by state: ${error.message}` )
                }

                return { struct }
            }
        },
        getTendersByCategory: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { userParams } = payload
                    await executeSearch( { struct, userParams, type: 0 } )
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error fetching tenders by category: ${error.message}` )
                }

                return { struct }
            }
        },
        getAwardedContracts: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { userParams } = payload
                    await executeSearch( { struct, userParams, type: 1 } )
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error fetching awarded contracts: ${error.message}` )
                }

                return { struct }
            }
        },
        searchByKeyword: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { userParams } = payload
                    await executeSearch( { struct, userParams, type: 0 } )
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error searching by keyword: ${error.message}` )
                }

                return { struct }
            }
        },
        getRecentTenders: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { userParams } = payload
                    await executeSearch( { struct, userParams, type: 0 } )
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error fetching recent tenders: ${error.message}` )
                }

                return { struct }
            }
        }
    }
}
