export const main = {
    namespace: 'metaver',
    name: 'MetaVer - German Metadata Portal',
    description: 'Search 31,900+ metadata records from 8 German federal states via OGC CSW 2.0.2. Find geodata services, open data, INSPIRE datasets with download links (WFS, WMS, CSV, GeoJSON). XML responses parsed to JSON via executeRequest handlers. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://metaver.de/', 'https://metaver.de/csw?service=CSW&request=GetCapabilities'],
    tags: ['metadata', 'geodata', 'germany', 'open-data', 'inspire', 'csw', 'cacheTtlDaily'],
    root: 'https://metaver.de',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchRecords: {
            method: 'GET',
            path: '/csw',
            description: 'Search metadata records across 8 German states. Returns parsed JSON with titles, identifiers, abstracts, and keywords. Pagination via maxRecords and startPosition.',
            parameters: [
                { position: { key: 'maxRecords', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(50)'] } },
                { position: { key: 'startPosition', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] } }
            ],
            tests: [
                { _description: 'Get first 3 records', maxRecords: 3 },
                { _description: 'Get records 11-15', maxRecords: 5, startPosition: 11 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { numberOfRecordsMatched: { type: 'string' }, numberOfRecordsReturned: { type: 'string' }, records: { type: 'array' } } }
            }
        },
        getRecordById: {
            method: 'GET',
            path: '/csw',
            description: 'Get full metadata for a record by UUID. Returns title, abstract, identifier, and all download URLs (WFS, WMS, CSV, GeoJSON).',
            parameters: [
                { position: { key: 'Id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get Fahrradhaeuschen Hamburg', Id: '3B703125-E552-49B4-A6F1-5E246525900F' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { title: { type: 'string' }, identifier: { type: 'string' }, abstract: { type: 'string' }, links: { type: 'array' } } }
            }
        },
        webSearch: {
            method: 'GET',
            path: '/freitextsuche',
            description: 'Search metaver web interface. Filter by type: opendata, inspire, hvd, adv, maps, metadata. Returns parsed result count and page info.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'type', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Search open data for Fahrrad', q: 'Fahrrad', type: 'opendata' },
                { _description: 'Search OEPNV data', q: 'OEPNV', type: 'opendata' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { query: { type: 'string' }, resultHtml: { type: 'string' } } }
            }
        }
    }
}

export const handlers = ( { sharedLists, libraries } ) => ( {
    searchRecords: {
        executeRequest: async ( { struct, payload } ) => {
            const { maxRecords, startPosition } = payload
            const max = maxRecords || 10
            const start = startPosition || 1

            const url = `https://metaver.de/csw?service=CSW&version=2.0.2&request=GetRecords&typeNames=csw:Record&resultType=results&ElementSetName=summary&maxRecords=${max}&startPosition=${start}`
            const res = await fetch( url )
            const xml = await res.text()

            const totalMatch = xml.match( /numberOfRecordsMatched="(\d+)"/ )
            const returnedMatch = xml.match( /numberOfRecordsReturned="(\d+)"/ )

            const metadataBlocks = xml.match( /<gmd:MD_Metadata[\s\S]*?<\/gmd:MD_Metadata>/g ) || []

            const records = metadataBlocks
                .map( ( block ) => {
                    const titleMatch = block.match( /<gmd:title>[\s\S]*?<gco:CharacterString>([\s\S]*?)<\/gco:CharacterString>/ )
                    const identifierMatch = block.match( /<gmd:fileIdentifier>[\s\S]*?<gco:CharacterString>([\s\S]*?)<\/gco:CharacterString>/ )
                    const abstractMatch = block.match( /<gmd:abstract>[\s\S]*?<gco:CharacterString>([\s\S]*?)<\/gco:CharacterString>/ )

                    const keywordMatches = block.match( /<gmd:keyword>[\s\S]*?<gco:CharacterString>([\s\S]*?)<\/gco:CharacterString>/g ) || []
                    const keywords = keywordMatches
                        .map( ( k ) => {
                            const val = ( k.match( /<gco:CharacterString>([\s\S]*?)<\/gco:CharacterString>/ ) || [] )[ 1 ] || ''

                            return val.trim()
                        } )

                    return {
                        title: titleMatch ? titleMatch[ 1 ].trim() : '',
                        identifier: identifierMatch ? identifierMatch[ 1 ].trim() : '',
                        abstract: abstractMatch ? abstractMatch[ 1 ].trim() : '',
                        keywords
                    }
                } )

            const response = {
                numberOfRecordsMatched: totalMatch ? totalMatch[ 1 ] : '0',
                numberOfRecordsReturned: returnedMatch ? returnedMatch[ 1 ] : '0',
                records
            }

            return { response }
        }
    },
    getRecordById: {
        executeRequest: async ( { struct, payload } ) => {
            const { Id } = payload

            const url = `https://metaver.de/csw?service=CSW&version=2.0.2&request=GetRecordById&Id=${Id}&ElementSetName=full`
            const res = await fetch( url )
            const xml = await res.text()

            const titleMatch = xml.match( /<gmd:title>[\s\S]*?<gco:CharacterString>([\s\S]*?)<\/gco:CharacterString>/ )
            const identifierMatch = xml.match( /<gmd:fileIdentifier>[\s\S]*?<gco:CharacterString>([\s\S]*?)<\/gco:CharacterString>/ )
            const abstractMatch = xml.match( /<gmd:abstract>[\s\S]*?<gco:CharacterString>([\s\S]*?)<\/gco:CharacterString>/ )

            const urlMatches = xml.match( /<gmd:URL>([\s\S]*?)<\/gmd:URL>/g ) || []
            const links = urlMatches
                .map( ( l ) => {
                    const linkUrl = ( l.match( /<gmd:URL>([\s\S]*?)<\/gmd:URL>/ ) || [] )[ 1 ] || ''

                    return linkUrl.trim()
                } )
                .filter( ( linkUrl ) => linkUrl.length > 0 )

            const response = {
                title: titleMatch ? titleMatch[ 1 ].trim() : '',
                identifier: identifierMatch ? identifierMatch[ 1 ].trim() : '',
                abstract: abstractMatch ? abstractMatch[ 1 ].trim() : '',
                links
            }

            return { response }
        }
    },
    webSearch: {
        executeRequest: async ( { struct, payload } ) => {
            const { q, type } = payload
            const params = new URLSearchParams()
            if( q ) { params.set( 'q', q ) }
            if( type ) { params.set( 'type', type ) }

            const url = `https://metaver.de/freitextsuche?${params.toString()}`
            const res = await fetch( url )
            const html = await res.text()

            const countMatch = html.match( /(\d+[\.\d]*)\s*Treffer/ ) || html.match( /Ergebnisse:\s*(\d+)/ )
            const titleMatches = html.match( /<h3[^>]*class="[^"]*title[^"]*"[^>]*>([\s\S]*?)<\/h3>/g ) || []

            const titles = titleMatches
                .map( ( t ) => {
                    const val = t.replace( /<[^>]*>/g, '' ).trim()

                    return val
                } )

            const response = {
                query: q || '',
                type: type || 'all',
                resultCount: countMatch ? countMatch[ 1 ] : 'unknown',
                url,
                sampleTitles: titles.slice( 0, 10 )
            }

            return { response }
        }
    }
} )
