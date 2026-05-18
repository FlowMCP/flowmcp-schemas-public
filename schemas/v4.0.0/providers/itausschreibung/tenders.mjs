// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'itausschreibung',
    name: 'IT-Ausschreibung.de RSS Feed',
    description: 'German IT procurement and tender platform providing RSS feeds for IT-related tenders across categories like software, hardware, internet, telecom, and consulting',
    version: '4.0.0',
    docs: ['https://www.it-ausschreibung.de/rss'],
    tags: ['procurement', 'germany', 'tenders', 'it', 'cacheTtlDaily'],
    root: 'https://www.it-ausschreibung.de',
    tools: {
        getAllTenders: {
            method: 'GET',
            path: '/ausschreibungen-auftraege/rss_ausschreibungen.xml',
            description: 'Get all recent IT tenders and procurement notices across all categories. Returns title, description, link, and publication date.',
            parameters: [],
            tests: [
                { _description: 'Get all recent IT tenders' }
            ],
        },
        getSoftwareTenders: {
            method: 'GET',
            path: '/ausschreibungen-auftraege/rss_software.xml',
            description: 'Get recent IT tenders in the software development category. Returns title, description, link, and publication date.',
            parameters: [],
            tests: [
                { _description: 'Get software tenders' }
            ],
        },
        getHardwareTenders: {
            method: 'GET',
            path: '/ausschreibungen-auftraege/rss_hardware.xml',
            description: 'Get recent IT tenders in the hardware category. Returns title, description, link, and publication date.',
            parameters: [],
            tests: [
                { _description: 'Get hardware tenders' }
            ],
        },
        getInternetTenders: {
            method: 'GET',
            path: '/ausschreibungen-auftraege/rss_internet_multimedia_marketing.xml',
            description: 'Get recent IT tenders in the internet, multimedia, and marketing category. Returns title, description, link, and publication date.',
            parameters: [],
            tests: [
                { _description: 'Get internet and multimedia tenders' }
            ],
        },
        getTelecomTenders: {
            method: 'GET',
            path: '/ausschreibungen-auftraege/rss_telekommunikation_tk.xml',
            description: 'Get recent IT tenders in the telecommunications category. Returns title, description, link, and publication date.',
            parameters: [],
            tests: [
                { _description: 'Get telecom tenders' }
            ],
        },
        getConsultingTenders: {
            method: 'GET',
            path: '/ausschreibungen-auftraege/rss_schulung_beratung.xml',
            description: 'Get recent IT tenders in the training and consulting category. Returns title, description, link, and publication date.',
            parameters: [],
            tests: [
                { _description: 'Get consulting and training tenders' }
            ],
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getAllTenders: {
        executeRequest: async ( { struct, payload } ) => {
            const __routeName = 'getAllTenders'
            const feedMap = {
            getAllTenders: 'rss_ausschreibungen.xml',
            getSoftwareTenders: 'rss_software.xml',
            getHardwareTenders: 'rss_hardware.xml',
            getInternetTenders: 'rss_internet_multimedia_marketing.xml',
            getTelecomTenders: 'rss_telekommunikation_tk.xml',
            getConsultingTenders: 'rss_schulung_beratung.xml'
            }

            const file = feedMap[ __routeName ]
            if( !file ) {
            struct.status = false
            struct.messages.push( `Unknown route: ${__routeName}` )

            return { struct }}

            const url = `https://www.it-ausschreibung.de/ausschreibungen-auftraege/${file}`
            const response = await fetch( url )

            if( !response.ok ) {
            struct.status = false
            struct.messages.push( `RSS feed error: ${response.status}` )

            return { struct }}

            const xml = await response.text()
            const items = []
            const itemRegex = /<item>([\s\S]*?)<\/item>/g
            let match

            match = itemRegex.exec( xml )
            Array.from( { length: 100 } )
            .forEach( () => {
            if( !match ) { return }

            const extract = ( tag ) => {
            const tagRegex = new RegExp( `<${tag}><!\\[CDATA\\[\\s*([\\s\\S]*?)\\s*\\]\\]><\\/${tag}>|<${tag}>([^<]*)<\\/${tag}>` )
            const found = match[ 1 ].match( tagRegex )

            const result = found ? ( found[ 1 ] || found[ 2 ] || '' ).trim() : null

            return result
            }

            items.push( {
            title: extract( 'title' ),
            description: extract( 'description' ),
            link: extract( 'link' ),
            pubDate: extract( 'pubDate' ),
            guid: extract( 'guid' )
            } )

            match = itemRegex.exec( xml )
            } )

            struct.data = { items }

            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.items ) { return { response }}

            const tenders = raw.items
            .map( ( item ) => {
            const idMatch = item.link ? item.link.match( /\/ausschreibung\/(\d+)\// ) : null

            const result = {
            id: idMatch ? idMatch[ 1 ] : null,
            title: item.title || null,
            description: item.description ? item.description.substring( 0, 300 ) : null,
            url: item.link || null,
            publishedDate: item.pubDate || null
            }

            return result
            } )

            response = {
            tenderCount: tenders.length,
            tenders
            }

            return { response }
        }
    },
    getSoftwareTenders: {
        executeRequest: async ( { struct, payload } ) => {
            const __routeName = 'getSoftwareTenders'
            const feedMap = {
            getAllTenders: 'rss_ausschreibungen.xml',
            getSoftwareTenders: 'rss_software.xml',
            getHardwareTenders: 'rss_hardware.xml',
            getInternetTenders: 'rss_internet_multimedia_marketing.xml',
            getTelecomTenders: 'rss_telekommunikation_tk.xml',
            getConsultingTenders: 'rss_schulung_beratung.xml'
            }

            const file = feedMap[ __routeName ]
            if( !file ) {
            struct.status = false
            struct.messages.push( `Unknown route: ${__routeName}` )

            return { struct }}

            const url = `https://www.it-ausschreibung.de/ausschreibungen-auftraege/${file}`
            const response = await fetch( url )

            if( !response.ok ) {
            struct.status = false
            struct.messages.push( `RSS feed error: ${response.status}` )

            return { struct }}

            const xml = await response.text()
            const items = []
            const itemRegex = /<item>([\s\S]*?)<\/item>/g
            let match

            match = itemRegex.exec( xml )
            Array.from( { length: 100 } )
            .forEach( () => {
            if( !match ) { return }

            const extract = ( tag ) => {
            const tagRegex = new RegExp( `<${tag}><!\\[CDATA\\[\\s*([\\s\\S]*?)\\s*\\]\\]><\\/${tag}>|<${tag}>([^<]*)<\\/${tag}>` )
            const found = match[ 1 ].match( tagRegex )

            const result = found ? ( found[ 1 ] || found[ 2 ] || '' ).trim() : null

            return result
            }

            items.push( {
            title: extract( 'title' ),
            description: extract( 'description' ),
            link: extract( 'link' ),
            pubDate: extract( 'pubDate' ),
            guid: extract( 'guid' )
            } )

            match = itemRegex.exec( xml )
            } )

            struct.data = { items }

            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.items ) { return { response }}

            const tenders = raw.items
            .map( ( item ) => {
            const idMatch = item.link ? item.link.match( /\/ausschreibung\/(\d+)\// ) : null

            const result = {
            id: idMatch ? idMatch[ 1 ] : null,
            title: item.title || null,
            description: item.description ? item.description.substring( 0, 300 ) : null,
            url: item.link || null,
            publishedDate: item.pubDate || null
            }

            return result
            } )

            response = {
            tenderCount: tenders.length,
            tenders
            }

            return { response }
        }
    },
    getHardwareTenders: {
        executeRequest: async ( { struct, payload } ) => {
            const __routeName = 'getHardwareTenders'
            const feedMap = {
            getAllTenders: 'rss_ausschreibungen.xml',
            getSoftwareTenders: 'rss_software.xml',
            getHardwareTenders: 'rss_hardware.xml',
            getInternetTenders: 'rss_internet_multimedia_marketing.xml',
            getTelecomTenders: 'rss_telekommunikation_tk.xml',
            getConsultingTenders: 'rss_schulung_beratung.xml'
            }

            const file = feedMap[ __routeName ]
            if( !file ) {
            struct.status = false
            struct.messages.push( `Unknown route: ${__routeName}` )

            return { struct }}

            const url = `https://www.it-ausschreibung.de/ausschreibungen-auftraege/${file}`
            const response = await fetch( url )

            if( !response.ok ) {
            struct.status = false
            struct.messages.push( `RSS feed error: ${response.status}` )

            return { struct }}

            const xml = await response.text()
            const items = []
            const itemRegex = /<item>([\s\S]*?)<\/item>/g
            let match

            match = itemRegex.exec( xml )
            Array.from( { length: 100 } )
            .forEach( () => {
            if( !match ) { return }

            const extract = ( tag ) => {
            const tagRegex = new RegExp( `<${tag}><!\\[CDATA\\[\\s*([\\s\\S]*?)\\s*\\]\\]><\\/${tag}>|<${tag}>([^<]*)<\\/${tag}>` )
            const found = match[ 1 ].match( tagRegex )

            const result = found ? ( found[ 1 ] || found[ 2 ] || '' ).trim() : null

            return result
            }

            items.push( {
            title: extract( 'title' ),
            description: extract( 'description' ),
            link: extract( 'link' ),
            pubDate: extract( 'pubDate' ),
            guid: extract( 'guid' )
            } )

            match = itemRegex.exec( xml )
            } )

            struct.data = { items }

            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.items ) { return { response }}

            const tenders = raw.items
            .map( ( item ) => {
            const idMatch = item.link ? item.link.match( /\/ausschreibung\/(\d+)\// ) : null

            const result = {
            id: idMatch ? idMatch[ 1 ] : null,
            title: item.title || null,
            description: item.description ? item.description.substring( 0, 300 ) : null,
            url: item.link || null,
            publishedDate: item.pubDate || null
            }

            return result
            } )

            response = {
            tenderCount: tenders.length,
            tenders
            }

            return { response }
        }
    },
    getInternetTenders: {
        executeRequest: async ( { struct, payload } ) => {
            const __routeName = 'getInternetTenders'
            const feedMap = {
            getAllTenders: 'rss_ausschreibungen.xml',
            getSoftwareTenders: 'rss_software.xml',
            getHardwareTenders: 'rss_hardware.xml',
            getInternetTenders: 'rss_internet_multimedia_marketing.xml',
            getTelecomTenders: 'rss_telekommunikation_tk.xml',
            getConsultingTenders: 'rss_schulung_beratung.xml'
            }

            const file = feedMap[ __routeName ]
            if( !file ) {
            struct.status = false
            struct.messages.push( `Unknown route: ${__routeName}` )

            return { struct }}

            const url = `https://www.it-ausschreibung.de/ausschreibungen-auftraege/${file}`
            const response = await fetch( url )

            if( !response.ok ) {
            struct.status = false
            struct.messages.push( `RSS feed error: ${response.status}` )

            return { struct }}

            const xml = await response.text()
            const items = []
            const itemRegex = /<item>([\s\S]*?)<\/item>/g
            let match

            match = itemRegex.exec( xml )
            Array.from( { length: 100 } )
            .forEach( () => {
            if( !match ) { return }

            const extract = ( tag ) => {
            const tagRegex = new RegExp( `<${tag}><!\\[CDATA\\[\\s*([\\s\\S]*?)\\s*\\]\\]><\\/${tag}>|<${tag}>([^<]*)<\\/${tag}>` )
            const found = match[ 1 ].match( tagRegex )

            const result = found ? ( found[ 1 ] || found[ 2 ] || '' ).trim() : null

            return result
            }

            items.push( {
            title: extract( 'title' ),
            description: extract( 'description' ),
            link: extract( 'link' ),
            pubDate: extract( 'pubDate' ),
            guid: extract( 'guid' )
            } )

            match = itemRegex.exec( xml )
            } )

            struct.data = { items }

            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.items ) { return { response }}

            const tenders = raw.items
            .map( ( item ) => {
            const idMatch = item.link ? item.link.match( /\/ausschreibung\/(\d+)\// ) : null

            const result = {
            id: idMatch ? idMatch[ 1 ] : null,
            title: item.title || null,
            description: item.description ? item.description.substring( 0, 300 ) : null,
            url: item.link || null,
            publishedDate: item.pubDate || null
            }

            return result
            } )

            response = {
            tenderCount: tenders.length,
            tenders
            }

            return { response }
        }
    },
    getTelecomTenders: {
        executeRequest: async ( { struct, payload } ) => {
            const __routeName = 'getTelecomTenders'
            const feedMap = {
            getAllTenders: 'rss_ausschreibungen.xml',
            getSoftwareTenders: 'rss_software.xml',
            getHardwareTenders: 'rss_hardware.xml',
            getInternetTenders: 'rss_internet_multimedia_marketing.xml',
            getTelecomTenders: 'rss_telekommunikation_tk.xml',
            getConsultingTenders: 'rss_schulung_beratung.xml'
            }

            const file = feedMap[ __routeName ]
            if( !file ) {
            struct.status = false
            struct.messages.push( `Unknown route: ${__routeName}` )

            return { struct }}

            const url = `https://www.it-ausschreibung.de/ausschreibungen-auftraege/${file}`
            const response = await fetch( url )

            if( !response.ok ) {
            struct.status = false
            struct.messages.push( `RSS feed error: ${response.status}` )

            return { struct }}

            const xml = await response.text()
            const items = []
            const itemRegex = /<item>([\s\S]*?)<\/item>/g
            let match

            match = itemRegex.exec( xml )
            Array.from( { length: 100 } )
            .forEach( () => {
            if( !match ) { return }

            const extract = ( tag ) => {
            const tagRegex = new RegExp( `<${tag}><!\\[CDATA\\[\\s*([\\s\\S]*?)\\s*\\]\\]><\\/${tag}>|<${tag}>([^<]*)<\\/${tag}>` )
            const found = match[ 1 ].match( tagRegex )

            const result = found ? ( found[ 1 ] || found[ 2 ] || '' ).trim() : null

            return result
            }

            items.push( {
            title: extract( 'title' ),
            description: extract( 'description' ),
            link: extract( 'link' ),
            pubDate: extract( 'pubDate' ),
            guid: extract( 'guid' )
            } )

            match = itemRegex.exec( xml )
            } )

            struct.data = { items }

            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.items ) { return { response }}

            const tenders = raw.items
            .map( ( item ) => {
            const idMatch = item.link ? item.link.match( /\/ausschreibung\/(\d+)\// ) : null

            const result = {
            id: idMatch ? idMatch[ 1 ] : null,
            title: item.title || null,
            description: item.description ? item.description.substring( 0, 300 ) : null,
            url: item.link || null,
            publishedDate: item.pubDate || null
            }

            return result
            } )

            response = {
            tenderCount: tenders.length,
            tenders
            }

            return { response }
        }
    },
    getConsultingTenders: {
        executeRequest: async ( { struct, payload } ) => {
            const __routeName = 'getConsultingTenders'
            const feedMap = {
            getAllTenders: 'rss_ausschreibungen.xml',
            getSoftwareTenders: 'rss_software.xml',
            getHardwareTenders: 'rss_hardware.xml',
            getInternetTenders: 'rss_internet_multimedia_marketing.xml',
            getTelecomTenders: 'rss_telekommunikation_tk.xml',
            getConsultingTenders: 'rss_schulung_beratung.xml'
            }

            const file = feedMap[ __routeName ]
            if( !file ) {
            struct.status = false
            struct.messages.push( `Unknown route: ${__routeName}` )

            return { struct }}

            const url = `https://www.it-ausschreibung.de/ausschreibungen-auftraege/${file}`
            const response = await fetch( url )

            if( !response.ok ) {
            struct.status = false
            struct.messages.push( `RSS feed error: ${response.status}` )

            return { struct }}

            const xml = await response.text()
            const items = []
            const itemRegex = /<item>([\s\S]*?)<\/item>/g
            let match

            match = itemRegex.exec( xml )
            Array.from( { length: 100 } )
            .forEach( () => {
            if( !match ) { return }

            const extract = ( tag ) => {
            const tagRegex = new RegExp( `<${tag}><!\\[CDATA\\[\\s*([\\s\\S]*?)\\s*\\]\\]><\\/${tag}>|<${tag}>([^<]*)<\\/${tag}>` )
            const found = match[ 1 ].match( tagRegex )

            const result = found ? ( found[ 1 ] || found[ 2 ] || '' ).trim() : null

            return result
            }

            items.push( {
            title: extract( 'title' ),
            description: extract( 'description' ),
            link: extract( 'link' ),
            pubDate: extract( 'pubDate' ),
            guid: extract( 'guid' )
            } )

            match = itemRegex.exec( xml )
            } )

            struct.data = { items }

            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.items ) { return { response }}

            const tenders = raw.items
            .map( ( item ) => {
            const idMatch = item.link ? item.link.match( /\/ausschreibung\/(\d+)\// ) : null

            const result = {
            id: idMatch ? idMatch[ 1 ] : null,
            title: item.title || null,
            description: item.description ? item.description.substring( 0, 300 ) : null,
            url: item.link || null,
            publishedDate: item.pubDate || null
            }

            return result
            } )

            response = {
            tenderCount: tenders.length,
            tenders
            }

            return { response }
        }
    }
} )
