// Gesetze aus dem Internet — Law Content (on-demand)
// Category: handlers-clean
// Source: https://gadi.netlify.app (https://github.com/nfelger/gesetze-aus-dem-internet)
// Note: Fetches individual law JSON files on demand.
// Each law is 50KB-2.7MB depending on size (GG=270KB, BGB=2.7MB, StGB=911KB).
// No API key required — public static site.

export const main = {
    namespace: 'gesetzedecontent',
    name: 'German Federal Laws Content',
    description: 'Read and search within individual German federal laws — get paragraphs, full-text search, table of contents, and structured law content from gesetze-im-internet.de',
    version: '4.0.0',
    docs: ['https://gadi.netlify.app', 'https://github.com/nfelger/gesetze-aus-dem-internet'],
    tags: ['law', 'germany', 'government', 'legal', 'opendata', 'fulltext'],
    root: 'https://gadi.netlify.app',
    tools: {
        getLawOverview: {
            method: 'GET',
            path: '/laws/{{slug}}.json',
            description: 'Get metadata and table of contents for a specific law. Returns title, abbreviation, publication info, and a list of all articles and headings (without body text). Use returned article names with getParagraph to read full text, or getLawStructure for hierarchical view.',
            parameters: [
                { position: { key: 'slug', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } }
            ],
            tests: [
                { _description: 'Grundgesetz overview', slug: 'gg' },
                { _description: 'BGB overview', slug: 'bgb' },
                { _description: 'StGB overview', slug: 'stgb' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Law metadata and flat table of contents listing all articles and headings',
                    properties: {
                        source: { type: 'string', description: 'Data source identifier (Gesetze aus dem Internet)' },
                        slug: { type: 'string', description: 'URL slug for the law (e.g. gg, bgb, stgb)' },
                        abbreviation: { type: 'string', description: 'Official law abbreviation (e.g. GG, BGB, StGB)' },
                        titleLong: { type: 'string', description: 'Full official title of the law' },
                        firstPublished: { type: 'string', description: 'Date of first publication' },
                        lastUpdated: { type: 'string', description: 'Timestamp of last source update' },
                        articleCount: { type: 'number', description: 'Total number of articles/paragraphs in the law' },
                        headingCount: { type: 'number', description: 'Total number of section headings' },
                        tableOfContents: { type: 'array', description: 'Flat list of all articles and headings in document order', items: { type: 'object', properties: { type: { type: 'string', description: 'Entry type: article or heading' }, name: { type: 'string', description: 'Article/heading identifier (e.g. Art 1, Paragraph 433) — use with getParagraph' }, title: { type: 'string', description: 'Title text of the article or heading' } } } }
                    }
                }
            }
        },
        getParagraph: {
            method: 'GET',
            path: '/laws/{{slug}}.json',
            description: 'Get a specific paragraph/article from a law by name (e.g. "Art 1", "§ 1", "§ 433"). Returns the full text content including any footnotes. Use getLawOverview to find valid paragraph names.',
            parameters: [
                { position: { key: 'slug', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'paragraph', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } }
            ],
            tests: [
                { _description: 'GG Art 1 (human dignity)', slug: 'gg', paragraph: 'Art 1' },
                { _description: 'BGB § 433 (Kaufvertrag)', slug: 'bgb', paragraph: '§ 433' },
                { _description: 'StGB § 242 (Diebstahl)', slug: 'stgb', paragraph: '§ 242' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Single paragraph/article from a German federal law with full text',
                    properties: {
                        source: { type: 'string', description: 'Data source identifier' },
                        slug: { type: 'string', description: 'URL slug for the law' },
                        abbreviation: { type: 'string', description: 'Official law abbreviation' },
                        titleLong: { type: 'string', description: 'Full official title of the law' },
                        paragraph: { type: 'object', description: 'The requested paragraph content', properties: { name: { type: 'string', description: 'Paragraph identifier (e.g. Art 1, Paragraph 433)' }, title: { type: 'string', description: 'Paragraph title' }, body: { type: 'string', description: 'Full text content with HTML stripped' }, section: { type: 'string', description: 'Parent section heading ID (null if top-level)' } } },
                        section: { type: 'object', description: 'Parent section heading info (null if paragraph is top-level)', properties: { name: { type: 'string', description: 'Section name' }, title: { type: 'string', description: 'Section title' } } }
                    }
                }
            }
        },
        searchInLaw: {
            method: 'GET',
            path: '/laws/{{slug}}.json',
            description: 'Full-text search within a specific law. Searches through all paragraph bodies and returns matching articles with highlighted context.',
            parameters: [
                { position: { key: 'slug', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(2)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'default(20)', 'optional()'] } }
            ],
            tests: [
                { _description: 'Search GG for Wuerde', slug: 'gg', q: 'Würde', limit: 5 },
                { _description: 'Search BGB for Schadenersatz', slug: 'bgb', q: 'Schadensersatz', limit: 10 },
                { _description: 'Search StGB for Freiheitsstrafe', slug: 'stgb', q: 'Freiheitsstrafe', limit: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Full-text search results within a specific law showing matching paragraphs with context',
                    properties: {
                        source: { type: 'string', description: 'Data source identifier' },
                        slug: { type: 'string', description: 'URL slug for the law' },
                        abbreviation: { type: 'string', description: 'Official law abbreviation' },
                        query: { type: 'string', description: 'The search query used' },
                        matchCount: { type: 'number', description: 'Number of paragraphs matching the query' },
                        limit: { type: 'number', description: 'Maximum matches returned' },
                        matches: { type: 'array', description: 'Array of matching paragraphs with context excerpts', items: { type: 'object', properties: { name: { type: 'string', description: 'Paragraph identifier — use with getParagraph for full text' }, title: { type: 'string', description: 'Paragraph title' }, context: { type: 'string', description: 'Text excerpt around the query match (80 chars before and after)' } } } }
                    }
                }
            }
        },
        getParagraphRange: {
            method: 'GET',
            path: '/laws/{{slug}}.json',
            description: 'Get a range of consecutive articles from a law. Specify a start article name and how many articles to return. Use getLawOverview to find valid starting names.',
            parameters: [
                { position: { key: 'slug', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'from', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'count', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(50)', 'default(10)', 'optional()'] } }
            ],
            tests: [
                { _description: 'GG Art 1-5 (Grundrechte)', slug: 'gg', from: 'Art 1', count: 5 },
                { _description: 'BGB § 433-435', slug: 'bgb', from: '§ 433', count: 3 },
                { _description: 'StGB § 1-5', slug: 'stgb', from: '§ 1', count: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Consecutive range of articles from a law with full text',
                    properties: {
                        source: { type: 'string', description: 'Data source identifier' },
                        slug: { type: 'string', description: 'URL slug for the law' },
                        abbreviation: { type: 'string', description: 'Official law abbreviation' },
                        range: { type: 'object', description: 'Requested range parameters', properties: { from: { type: 'string', description: 'Starting paragraph name' }, count: { type: 'number', description: 'Requested number of articles' } } },
                        totalArticles: { type: 'number', description: 'Total number of articles in the law' },
                        returnedCount: { type: 'number', description: 'Actual number of articles returned (may be less than count if near end)' },
                        articles: { type: 'array', description: 'Array of consecutive articles with full text', items: { type: 'object', properties: { name: { type: 'string', description: 'Paragraph identifier' }, title: { type: 'string', description: 'Paragraph title' }, body: { type: 'string', description: 'Full text content with HTML stripped' }, section: { type: 'string', description: 'Parent section heading ID' } } } }
                    }
                }
            }
        },
        getLawStructure: {
            method: 'GET',
            path: '/laws/{{slug}}.json',
            description: 'Get the hierarchical structure of a law with headings (chapters/sections) and their articles. Shows how the law is organized without full body text. Unlike getLawOverview (flat list), this groups articles under their section headings.',
            parameters: [
                { position: { key: 'slug', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(1)'] } }
            ],
            tests: [
                { _description: 'GG structure', slug: 'gg' },
                { _description: 'StGB structure', slug: 'stgb' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Hierarchical structure of a law with articles grouped under section headings',
                    properties: {
                        source: { type: 'string', description: 'Data source identifier' },
                        slug: { type: 'string', description: 'URL slug for the law' },
                        abbreviation: { type: 'string', description: 'Official law abbreviation' },
                        titleLong: { type: 'string', description: 'Full official title of the law' },
                        topLevelArticles: { type: 'array', description: 'Articles not assigned to any section heading', items: { type: 'object', properties: { name: { type: 'string', description: 'Article identifier' }, title: { type: 'string', description: 'Article title' } } } },
                        sections: { type: 'array', description: 'Law sections with their contained articles', items: { type: 'object', properties: { name: { type: 'string', description: 'Section heading name (e.g. I. Die Grundrechte)' }, title: { type: 'string', description: 'Section heading title' }, articles: { type: 'array', description: 'Articles belonging to this section', items: { type: 'object', properties: { name: { type: 'string', description: 'Article identifier — use with getParagraph' }, title: { type: 'string', description: 'Article title' } } } } } } }
                    }
                }
            }
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => {
    const BASE_URL = 'https://gadi.netlify.app/laws'

    const stripHtml = ( { html } ) => {
        const text = html
            .replace( /<br\s*\/?>/gi, '\n' )
            .replace( /<\/P>/gi, '\n' )
            .replace( /<\/?(P|DL|DT|DD|TABLE|TR|TD|TH|SPAN|DIV|STRONG|EM|B|I|U|SUP|SUB|A|ABBR|PRE|BLOCKQUOTE|UL|OL|LI|H[1-6]|NOBR|SMALL|IMG|LA|FnR|F)[^>]*>/gi, '' )
            .replace( /\n{3,}/g, '\n\n' )
            .trim()

        return text
    }

    const fetchLaw = async ( { slug } ) => {
        const url = `${BASE_URL}/${slug}.json`
        const response = await fetch( url )
        if( !response.ok ) {
            throw new Error( `Law "${slug}" not found (HTTP ${response.status})` )
        }

        const json = await response.json()
        const law = json.data

        return law
    }

    const formatArticle = ( { article } ) => {
        const bodyText = article.body ? stripHtml( { html: article.body } ) : ''
        const result = {
            name: article.name || null,
            title: article.title || null,
            body: bodyText,
            section: article.parent?.type === 'heading' ? article.parent.id : null
        }

        return result
    }

    return {
        getLawOverview: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { userParams } = payload
                    const law = await fetchLaw( { slug: userParams.slug } )
                    const articles = law.contents
                        .filter( ( c ) => c.type === 'article' )
                    const headings = law.contents
                        .filter( ( c ) => c.type === 'heading' )

                    const toc = law.contents
                        .map( ( c ) => {
                            const entry = {
                                type: c.type,
                                name: c.name || null,
                                title: c.title || null
                            }

                            return entry
                        } )

                    struct.data = {
                        source: 'Gesetze aus dem Internet',
                        slug: law.slug,
                        abbreviation: law.abbreviation || null,
                        titleLong: law.titleLong || null,
                        firstPublished: law.firstPublished || null,
                        lastUpdated: law.sourceTimestamp || null,
                        publicationInfo: law.publicationInfo || [],
                        statusInfo: law.statusInfo || [],
                        articleCount: articles.length,
                        headingCount: headings.length,
                        tableOfContents: toc
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error fetching law overview: ${error.message}` )
                }

                return { struct }
            }
        },
        getParagraph: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { userParams } = payload
                    const law = await fetchLaw( { slug: userParams.slug } )
                    const searchName = userParams.paragraph.trim()
                    const searchLower = searchName.toLowerCase()

                    const article = law.contents
                        .find( ( c ) => {
                            if( c.type !== 'article' ) { return false }
                            const nameLower = ( c.name || '' ).toLowerCase()

                            return nameLower === searchLower
                        } )

                    if( !article ) {
                        struct.status = false
                        struct.messages.push( `Paragraph "${searchName}" not found in ${law.abbreviation || userParams.slug}` )

                        return { struct }
                    }

                    const sectionHeading = article.parent
                        ? law.contents.find( ( c ) => c.type === 'heading' && c.id === article.parent.id )
                        : null

                    struct.data = {
                        source: 'Gesetze aus dem Internet',
                        slug: law.slug,
                        abbreviation: law.abbreviation || null,
                        titleLong: law.titleLong || null,
                        paragraph: formatArticle( { article } ),
                        section: sectionHeading
                            ? { name: sectionHeading.name, title: sectionHeading.title }
                            : null
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error fetching paragraph: ${error.message}` )
                }

                return { struct }
            }
        },
        searchInLaw: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { userParams } = payload
                    const law = await fetchLaw( { slug: userParams.slug } )
                    const q = userParams.q.toLowerCase()
                    const limit = userParams.limit || 20

                    const matches = law.contents
                        .filter( ( c ) => {
                            if( c.type !== 'article' ) { return false }
                            const bodyText = ( c.body || '' ).toLowerCase()
                            const nameText = ( c.name || '' ).toLowerCase()
                            const titleText = ( c.title || '' ).toLowerCase()

                            return bodyText.includes( q ) || nameText.includes( q ) || titleText.includes( q )
                        } )
                        .slice( 0, limit )
                        .map( ( article ) => {
                            const bodyPlain = stripHtml( { html: article.body || '' } )
                            const qLower = q
                            const idx = bodyPlain.toLowerCase().indexOf( qLower )
                            let context = ''

                            if( idx >= 0 ) {
                                const start = Math.max( 0, idx - 80 )
                                const end = Math.min( bodyPlain.length, idx + q.length + 80 )
                                context = ( start > 0 ? '...' : '' ) +
                                    bodyPlain.substring( start, end ) +
                                    ( end < bodyPlain.length ? '...' : '' )
                            }

                            const result = {
                                name: article.name || null,
                                title: article.title || null,
                                context
                            }

                            return result
                        } )

                    struct.data = {
                        source: 'Gesetze aus dem Internet',
                        slug: law.slug,
                        abbreviation: law.abbreviation || null,
                        query: userParams.q,
                        matchCount: matches.length,
                        limit,
                        matches
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error searching in law: ${error.message}` )
                }

                return { struct }
            }
        },
        getParagraphRange: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { userParams } = payload
                    const law = await fetchLaw( { slug: userParams.slug } )
                    const fromName = userParams.from.trim().toLowerCase()
                    const count = userParams.count || 10

                    const articles = law.contents
                        .filter( ( c ) => c.type === 'article' )
                    const startIdx = articles
                        .findIndex( ( a ) => ( a.name || '' ).toLowerCase() === fromName )

                    if( startIdx === -1 ) {
                        struct.status = false
                        struct.messages.push( `Starting paragraph "${userParams.from}" not found in ${law.abbreviation || userParams.slug}` )

                        return { struct }
                    }

                    const rangeArticles = articles
                        .slice( startIdx, startIdx + count )
                        .map( ( article ) => formatArticle( { article } ) )

                    struct.data = {
                        source: 'Gesetze aus dem Internet',
                        slug: law.slug,
                        abbreviation: law.abbreviation || null,
                        range: { from: userParams.from, count },
                        totalArticles: articles.length,
                        returnedCount: rangeArticles.length,
                        articles: rangeArticles
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error fetching paragraph range: ${error.message}` )
                }

                return { struct }
            }
        },
        getLawStructure: {
            executeRequest: async ( { struct, payload } ) => {
                try {
                    const { userParams } = payload
                    const law = await fetchLaw( { slug: userParams.slug } )

                    const headingMap = {}
                    law.contents
                        .filter( ( c ) => c.type === 'heading' )
                        .forEach( ( h ) => {
                            headingMap[h.id] = {
                                name: h.name || null,
                                title: h.title || null,
                                articles: []
                            }
                        } )

                    const topLevel = []

                    law.contents
                        .filter( ( c ) => c.type === 'article' )
                        .forEach( ( article ) => {
                            const entry = { name: article.name || null, title: article.title || null }

                            if( article.parent && headingMap[article.parent.id] ) {
                                headingMap[article.parent.id].articles.push( entry )
                            } else {
                                topLevel.push( entry )
                            }
                        } )

                    const sections = Object.values( headingMap )
                        .filter( ( section ) => section.articles.length > 0 )

                    struct.data = {
                        source: 'Gesetze aus dem Internet',
                        slug: law.slug,
                        abbreviation: law.abbreviation || null,
                        titleLong: law.titleLong || null,
                        topLevelArticles: topLevel,
                        sections
                    }
                } catch( error ) {
                    struct.status = false
                    struct.messages.push( `Error fetching law structure: ${error.message}` )
                }

                return { struct }
            }
        }
    }
}
