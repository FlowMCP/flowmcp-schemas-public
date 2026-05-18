// Schema for #325 — Insolvenzbekanntmachungen (German Insolvency Announcements)

export const main = {
    namespace: 'insolvenzbekanntmachungen',
    name: 'Insolvenzbekanntmachungen',
    description: 'Official German insolvency announcement portal (insolvenzbekanntmachungen.de). Search insolvency proceedings by debtor name, court, federal state, date range, case number, or subject type. Returns structured data from the JSF search form.',
    version: '4.0.0',
    docs: ['https://neu.insolvenzbekanntmachungen.de'],
    tags: ['insolvency', 'legal', 'germany', 'government', 'finance', 'cacheTtlDaily'],
    sharedLists: [
        { ref: 'germanBundeslaender', version: '3.0.0' }
    ],
    root: 'https://neu.insolvenzbekanntmachungen.de',
    tools: {
        searchInsolvencies: {
            method: 'GET',
            path: '/ap/suche.jsf',
            description: 'Search German insolvency announcements. Filter by federal state (0=Baden-Wuerttemberg, 1=Bayern, 2=Berlin, 3=Brandenburg, 4=Bremen, 5=Hamburg, 6=Hessen, 7=Mecklenburg-Vorpommern, 8=Niedersachsen, 9=Nordrhein-Westfalen, 10=Rheinland-Pfalz, 11=Saarland, 12=Sachsen, 13=Sachsen-Anhalt, 14=Schleswig-Holstein, 15=Thueringen). Subject types: 0=Sicherungsmassnahmen, 1=Abweisungen mangels Masse, 2=Eroeffnungen, 3=Entscheidungen, 4=Sonstiges, 5=Entscheidungen nach Aufhebung, 7=Restschuldbefreiung.',
            parameters: [
                { position: { key: 'bundesland', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'nachname', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'vorname', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'sitz', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'gegenstand', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(0,1,2,3,4,5,7)', options: ['optional()'] } },
                { position: { key: 'datumVon', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'datumBis', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'registerzeichen', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(IN,IK,IE,AR)', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Insolvency openings in Berlin (last 14 days)', bundesland: '2', gegenstand: '2' },
                { _description: 'Search by debtor name Mueller', nachname: 'Mueller' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        source: { type: 'string' },
                        totalCount: { type: 'number' },
                        results: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    veroeffentlichungsdatum: { type: 'string' },
                                    aktenzeichen: { type: 'string' },
                                    gericht: { type: 'string' },
                                    name: { type: 'string' },
                                    sitz: { type: 'string' },
                                    register: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}


export const handlers = ( { sharedLists } ) => {
    const _fetchHeaders = {
        'User-Agent': 'Mozilla/5.0 (compatible; FlowMCP/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'de-DE,de;q=0.9'
    }

    const _stripHtml = ( str ) => {
        const cleaned = str
            .replace( /<[^>]*>/g, '' )
            .replace( /&nbsp;/g, ' ' )
            .replace( /&auml;/g, 'ä' )
            .replace( /&ouml;/g, 'ö' )
            .replace( /&uuml;/g, 'ü' )
            .replace( /&szlig;/g, 'ß' )
            .replace( /&Auml;/g, 'Ä' )
            .replace( /&Ouml;/g, 'Ö' )
            .replace( /&Uuml;/g, 'Ü' )
            .replace( /&amp;/g, '&' )
            .replace( /&sect;/g, '§' )
            .replace( /\s+/g, ' ' )
            .trim()

        return cleaned
    }

    const _getViewState = async ( cookieJar ) => {
        const response = await fetch( 'https://neu.insolvenzbekanntmachungen.de/ap/suche.jsf', {
            headers: _fetchHeaders,
            redirect: 'follow'
        } )

        if( !response.ok ) { return { viewState: null, cookies: null } }

        const html = await response.text()
        const vsMatch = html.match( /name="jakarta\.faces\.ViewState"[^>]*value="([^"]*)"/ )
            || html.match( /name="javax\.faces\.ViewState"[^>]*value="([^"]*)"/ )
        const viewState = vsMatch ? vsMatch[1] : null

        const setCookies = response.headers.getSetCookie
            ? response.headers.getSetCookie()
            : []
        const cookies = setCookies
            .map( ( c ) => c.split( ';' )[0] )
            .join( '; ' )

        return { viewState, cookies }
    }

    const _buildFormData = ( params, viewState ) => {
        const url = new URL( params.url || 'https://neu.insolvenzbekanntmachungen.de/ap/suche.jsf' )
        const sp = url.searchParams

        const today = new Date()
        const twoWeeksAgo = new Date( today.getTime() - 14 * 24 * 60 * 60 * 1000 )
        const formatDate = ( d ) => d.toISOString().split( 'T' )[0]

        const form = new URLSearchParams()
        form.append( 'frm_suche', 'frm_suche' )
        form.append( 'jakarta.faces.ViewState', viewState )

        const bundesland = sp.get( 'bundesland' )
        form.append( 'frm_suche:lsom_bundesland:lsom', bundesland || '-- Alle Bundeslaender --' )
        form.append( 'frm_suche:lsom_gericht:lsom', '' )

        form.append( 'frm_suche:ldi_datumVon:datumHtml5', sp.get( 'datumVon' ) || formatDate( twoWeeksAgo ) )
        form.append( 'frm_suche:ldi_datumBis:datumHtml5', sp.get( 'datumBis' ) || formatDate( today ) )

        form.append( 'frm_suche:lsom_wildcard:lsom', '0' )
        form.append( 'frm_suche:litx_firmaNachName:text', sp.get( 'nachname' ) || '' )
        form.append( 'frm_suche:litx_vorname:text', sp.get( 'vorname' ) || '' )
        form.append( 'frm_suche:litx_sitzWohnsitz:text', sp.get( 'sitz' ) || '' )

        form.append( 'frm_suche:iaz_aktenzeichen:itx_abteilung', '' )

        const regz = sp.get( 'registerzeichen' )
        const regzMap = { 'IN': '1', 'IK': '2', 'IE': '3', 'AR': '0' }
        form.append( 'frm_suche:iaz_aktenzeichen:som_registerzeichen', regzMap[regz] || '--' )
        form.append( 'frm_suche:iaz_aktenzeichen:itx_lfdNr', '' )
        form.append( 'frm_suche:iaz_aktenzeichen:itx_jahr', '' )

        const gegenstand = sp.get( 'gegenstand' )
        form.append( 'frm_suche:lsom_gegenstand:lsom', gegenstand || '-- Alle Gegenstaende innerhalb des Verfahrens --' )

        form.append( 'frm_suche:ireg_registereintrag:som_registergericht', '' )
        form.append( 'frm_suche:ireg_registereintrag:som_registerart', '--' )
        form.append( 'frm_suche:ireg_registereintrag:itx_registernummer', '' )

        form.append( 'frm_suche:cbt_suchen', 'Suchen' )

        return form
    }

    const _parseResultsHTML = ( html ) => {
        const results = []
        const tableMatch = html.match( /<table[^>]*id="tbl_ergebnis"[^>]*>([\s\S]*?)<\/table>/i )

        if( !tableMatch ) { return results }

        const tbody = tableMatch[1]
        const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi
        let rowMatch = rowRegex.exec( tbody )
        let isHeader = true

        const collectRows = () => {
            if( !rowMatch ) { return }

            if( isHeader ) {
                isHeader = false
                rowMatch = rowRegex.exec( tbody )
                collectRows()

                return
            }

            const row = rowMatch[1]
            const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi
            const cells = []
            let cellMatch = cellRegex.exec( row )

            const collectCells = () => {
                if( !cellMatch ) { return }
                cells.push( _stripHtml( cellMatch[1] ) )
                cellMatch = cellRegex.exec( row )
                collectCells()
            }

            collectCells()

            if( cells.length >= 6 ) {
                results.push( {
                    veroeffentlichungsdatum: cells[0] || '',
                    aktenzeichen: cells[1] || '',
                    gericht: cells[2] || '',
                    name: cells[3] || '',
                    sitz: cells[4] || '',
                    register: cells[5] || ''
                } )
            }

            rowMatch = rowRegex.exec( tbody )
            collectRows()
        }

        collectRows()

        return results
    }

    return {
        searchInsolvencies: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { viewState, cookies } = await _getViewState()

                    if( !viewState ) {
                        struct['status'] = false
                        struct['messages'].push( 'Failed to obtain JSF ViewState token' )

                        return { struct }
                    }

                    const formData = _buildFormData( payload, viewState )

                    const headers = {
                        ..._fetchHeaders,
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Referer': 'https://neu.insolvenzbekanntmachungen.de/ap/suche.jsf'
                    }

                    if( cookies ) {
                        headers['Cookie'] = cookies
                    }

                    const response = await fetch( 'https://neu.insolvenzbekanntmachungen.de/ap/suche.jsf', {
                        method: 'POST',
                        headers,
                        body: formData.toString(),
                        redirect: 'follow'
                    } )

                    if( !response.ok ) {
                        struct['status'] = false
                        struct['messages'].push( `HTTP ${response.status}: ${response.statusText}` )

                        return { struct }
                    }

                    const html = await response.text()
                    const results = _parseResultsHTML( html )

                    struct['data'] = {
                        source: 'insolvenzbekanntmachungen.de',
                        totalCount: results.length,
                        results
                    }
                } catch( error ) {
                    struct['status'] = false
                    struct['messages'].push( `Error searching insolvencies: ${error.message}` )
                }

                return { struct }
            }
        }
    }
}
