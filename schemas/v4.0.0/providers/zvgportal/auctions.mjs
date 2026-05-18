// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// Namespace: "zvgPortal" -> "zvgportal"
// Import: import { GERMAN_BUNDESLAENDER } from '../_shared/germanBundeslaender.mjs'
// Module-level code: 1 lines

export const main = {
    namespace: 'zvgportal',
    name: 'ZVG Portal Foreclosure Auctions',
    description: 'German foreclosure auction portal (Zwangsversteigerungsportal) for searching property auction listings across all 16 German states. Returns structured data from zvg-portal.de including auction dates, property details, valuations, and court information.',
    version: '4.0.0',
    docs: ['https://www.zvg-portal.de'],
    tags: ['immobilien', 'auktionen', 'justiz', 'cacheTtlDaily'],
    sharedLists: [
        { ref: 'germanBundeslaender', version: '3.0.0' }
    ],
    root: 'https://www.zvg-portal.de',
    tools: {
        searchAuctions: {
            method: 'GET',
            path: '/index.php',
            description: 'Search foreclosure auction listings by German state (Bundesland). Supports filtering by court, city, ZIP code, street, property type, and auction type. State codes: bw=Baden-Wuerttemberg, by=Bayern, be=Berlin, br=Brandenburg, hb=Bremen, hh=Hamburg, he=Hessen, mv=Mecklenburg-Vorpommern, ni=Niedersachsen, nw=Nordrhein-Westfalen, rp=Rheinland-Pfalz, sl=Saarland, sn=Sachsen, st=Sachsen-Anhalt, sh=Schleswig-Holstein, th=Thueringen. Property types (obj_art): 1=Reihenhaus, 2=Doppelhaushälfte, 3=Einfamilienhaus, 4=Mehrfamilienhaus, 5=ETW 1-2 Zi, 6=ETW 3-4 Zi, 7=ETW 5+ Zi, 8=Gewerbeeinheit, 9=Garage, 10=Kfz-Stellplatz, 13=Wohn-/Geschäftshaus, 14=Gewerbegrundstück, 15=Baugrundstück, 16=Unbebautes Grundstück, 17=Land-/Forstwirtschaft, 18=Sonstiges. Sort (order_by): 2=Termin, 1=Aktualisierung, 3=Aktenzeichen.',
            parameters: [
                { position: { key: 'land_abk', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(bw,by,be,br,hb,hh,he,mv,ni,nw,rp,sl,sn,st,sh,th)', options: [] } },
                { position: { key: 'ger_id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['default("0")'] } },
                { position: { key: 'order_by', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['default("2")'] } },
                { position: { key: 'plz', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'ort', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'str', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'art', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'obj_art', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Search Berlin auctions', land_abk: 'be', ger_id: '0', order_by: '2' },
                { _description: 'Search Bayern auctions', land_abk: 'by', ger_id: '0', order_by: '2' }
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
            },
        },
        getAuctionDetail: {
            method: 'GET',
            path: '/index.php?button=showZvg',
            description: 'Get full details of a specific foreclosure auction including property description, valuation (Verkehrswert), court info, auction venue, and links to documents (Bekanntmachung, Exposee, Gutachten, photos). Use the zvg_id and land_abk from searchAuctions results.',
            parameters: [
                { position: { key: 'zvg_id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'land_abk', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(2)', 'max(2)'] } }
            ],
            tests: [
                { _description: 'Get Berlin auction detail', zvg_id: '14171', land_abk: 'be' }
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
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => {
    const GERMAN_BUNDESLAENDER = sharedLists['germanBundeslaender']

    const bundeslandEnum = 'enum(' + GERMAN_BUNDESLAENDER.map( ( b ) => b.code ).join( ',' ) + ')'

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
            .replace( /&euro;/g, '€' )
            .replace( /&#128;/g, '€' )
            .replace( /&amp;/g, '&' )
            .replace( /&sect;/g, '§' )
            .replace( /\s+/g, ' ' )
            .trim()

        return cleaned
    }

    const _extractField = ( block, label ) => {
        const regex = new RegExp( label + '[\\s\\S]*?<\\/td>\\s*<td[^>]*>([\\s\\S]*?)<\\/td>', 'i' )
        const match = block.match( regex )

        if( !match ) { return '' }
        const raw = _stripHtml( match[1] )

        return raw
    }

    const _parseSearchHTML = ( html ) => {
        const auctions = []
        const blocks = html.split( /<hr>/i )

        blocks
            .forEach( ( block ) => {
                const hasAktenzeichen = /Aktenzeichen/i.test( block )
                if( !hasAktenzeichen ) { return }

                const nobrMatches = []
                const nobrRegex = /<nobr>([^<]+)<\/nobr>/gi
                let nobrM = nobrRegex.exec( block )
                const collectNobr = () => {
                    if( !nobrM ) { return }
                    nobrMatches.push( nobrM[1] )
                    nobrM = nobrRegex.exec( block )
                    collectNobr()
                }
                collectNobr()

                const azValue = nobrMatches
                    .find( ( v ) => /\d+\s*K\s*\d+/i.test( v ) ) || ''
                const aktenzeichen = _stripHtml( azValue )
                    .replace( /\(Detailansicht\)/i, '' ).trim()

                const zvgIdMatch = block.match( /zvg_id=(\d+)/ )
                const zvgId = zvgIdMatch ? zvgIdMatch[1] : ''

                const amtsgericht = _extractField( block, 'Amtsgericht' )
                const objektRaw = _extractField( block, 'Objekt/Lage' )
                const objekt = objektRaw.replace( /<!--[^>]*-->/g, '' ).replace( /\s*:\s*/, ': ' ).trim()
                const verkehrswert = _extractField( block, 'Verkehrswert' )
                const termin = _extractField( block, 'Termin' )

                if( !aktenzeichen || !objekt ) { return }

                auctions.push( { aktenzeichen, zvgId, amtsgericht, objekt, verkehrswert, termin } )
            } )

        const countMatch = html.match( /Insgesamt\s+(\d+)/i )
        const totalCount = countMatch ? parseInt( countMatch[1] ) : auctions.length

        return { totalCount, auctions }
    }

    const _parseDetailHTML = ( html, landAbk, zvgId ) => {
        const getField = ( label ) => {
            const regex = new RegExp( label + '[^<]*<\\/(?:td|nobr|TD|NOBR)>(?:\\s*<\\/(?:td|nobr|TD|NOBR)>)*\\s*<td[^>]*>([\\s\\S]*?)<\\/td>', 'i' )
            const match = html.match( regex )

            if( !match ) { return null }
            const raw = _stripHtml( match[1] )

            return raw || null
        }

        const azMatch = html.match( /<b>(\d{4}[^<]{5,30})<\/b>\s*<\/td>/i )
        const aktenzeichen = azMatch ? _stripHtml( azMatch[1] ) : null

        const amtsgerichtMatch = html.match( /Amtsgericht:\s*([^<]+)/i )
        const amtsgericht = amtsgerichtMatch ? _stripHtml( amtsgerichtMatch[1] ) : null

        const attachments = []
        const attachRegex = /href="([^"]*showAnhang[^"]*)"\s*\/?>([^<]*)/gi
        let attM = attachRegex.exec( html )
        const collectAttachments = () => {
            if( !attM ) { return }
            const href = attM[1].replace( /^\?/, 'index.php?' ).trim()
            const attachUrl = 'https://www.zvg-portal.de/' + href
            const name = _stripHtml( attM[2] )
            attachments.push( { name, url: attachUrl } )
            attM = attachRegex.exec( html )
            collectAttachments()
        }
        collectAttachments()

        const detail = {
            zvgId,
            landAbk,
            aktenzeichen,
            amtsgericht,
            art: getField( 'Art der Versteigerung' ),
            grundbuch: getField( 'Grundbuch' ),
            objekt: getField( 'Objekt/Lage' ),
            beschreibung: getField( 'Beschreibung' ),
            verkehrswert: getField( 'Verkehrswert' ),
            termin: getField( 'Termin' ),
            ortDerVersteigerung: getField( 'Ort der Versteigerung' ),
            attachments
        }

        return detail
    }

    return {
        searchAuctions: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                const url = new URL( payload.url )
                const params = url.searchParams

                const formData = new URLSearchParams()
                formData.append( 'land_abk', params.get( 'land_abk' ) || '' )
                formData.append( 'ger_id', params.get( 'ger_id' ) || '0' )
                formData.append( 'ger_name', '' )
                formData.append( 'order_by', params.get( 'order_by' ) || '2' )
                formData.append( 'az1', '' )
                formData.append( 'az2', '' )
                formData.append( 'az3', '' )
                formData.append( 'az4', '' )
                formData.append( 'art', params.get( 'art' ) || '' )
                formData.append( 'obj', '' )
                formData.append( 'str', params.get( 'str' ) || '' )
                formData.append( 'hnr', '' )
                formData.append( 'plz', params.get( 'plz' ) || '' )
                formData.append( 'ort', params.get( 'ort' ) || '' )
                formData.append( 'ortsteil', '' )
                formData.append( 'vtermin', '' )
                formData.append( 'btermin', '' )

                const objArt = params.get( 'obj_art' )
                if( objArt ) {
                formData.append( 'obj_arr[]', objArt )
                }

                const response = await fetch( 'https://www.zvg-portal.de/index.php?button=Suchen', {
                method: 'POST',
                headers: {
                ..._fetchHeaders,
                'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData.toString()
                } )

                if( !response.ok ) {
                struct['status'] = false
                struct['messages'].push( `HTTP ${response.status}: ${response.statusText}` )

                return { struct }}

                const html = await response.text()
                const { totalCount, auctions } = _parseSearchHTML( html )

                struct['data'] = {
                source: 'zvg-portal.de',
                totalCount,
                resultCount: auctions.length,
                auctions
                }
                } catch( error ) {
                struct['status'] = false
                struct['messages'].push( `Error searching auctions: ${error.message}` )
                }

                return { struct }
            }
        },
        getAuctionDetail: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                const rawUrl = payload.url
                const zvgIdMatch = rawUrl.match( /zvg_id=(\d+)/ )
                const landAbkMatch = rawUrl.match( /land_abk=([a-z]{2})/ )
                const zvgId = zvgIdMatch ? zvgIdMatch[1] : null
                const landAbk = landAbkMatch ? landAbkMatch[1] : null
                const detailUrl = `https://www.zvg-portal.de/index.php?button=showZvg&zvg_id=${zvgId}&land_abk=${landAbk}`

                const response = await fetch( detailUrl, {
                headers: {
                ..._fetchHeaders,
                'Referer': 'https://www.zvg-portal.de/index.php'
                }
                } )

                if( !response.ok ) {
                struct['status'] = false
                struct['messages'].push( `HTTP ${response.status}: ${response.statusText}` )

                return { struct }}

                const html = await response.text()
                const detail = _parseDetailHTML( html, landAbk, zvgId )

                struct['data'] = {
                source: 'zvg-portal.de',
                ...detail
                }
                } catch( error ) {
                struct['status'] = false
                struct['messages'].push( `Error fetching auction detail: ${error.message}` )
                }

                return { struct }
            }
        }
    }
}
