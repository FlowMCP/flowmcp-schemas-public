export const main = {
    namespace: 'coreac',
    name: 'CORE',
    description: 'Search and access 200M+ open access research papers from CORE. Query works, outputs, data providers, and journals with full-text access and metadata from thousands of repositories worldwide. Use searchWorks to find papers, getWork with a CORE ID for full details, and discoverFulltext to find PDF download links by DOI or title.',
    version: '4.0.0',
    docs: ['https://api.core.ac.uk/docs/v3'],
    tags: ['science', 'openaccess', 'research', 'publications', 'repositories', 'cacheTtlDaily'],
    root: 'https://api.core.ac.uk/v3',
    requiredServerParams: ['CORE_API_KEY'],
    headers: {
        'Authorization': 'Bearer {{CORE_API_KEY}}'
    },
    tools: {
        searchWorks: {
            method: 'GET',
            path: '/search/works/',
            description: 'Search scholarly works across 200M+ records. Supports field-specific queries (title:"phrase", authors:Name, doi:10.xxx), boolean operators (AND, OR), range queries (yearPublished>=2020), and existence checks (_exists_:fullText). Use returned IDs in getWork for full metadata.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [], description: 'Search query string — supports field-specific (title:"phrase"), boolean (AND, OR), range (yearPublished>=2020), and existence checks (_exists_:fullText)' } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(100)'], description: 'Maximum number of results to return per page (1-100)' } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'], description: 'Number of results to skip for pagination' } },
                { position: { key: 'scroll', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'], description: 'Enable scroll mode for iterating through large result sets (returns scrollId)' } },
                { position: { key: 'stats', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(false)'], description: 'When true, include aggregation statistics in the response' } }
            ],
            tests: [
                { _description: 'Search for quantum computing papers', q: 'quantum computing', limit: 3 },
                { _description: 'Search for papers with full text by year range', q: 'deep learning AND yearPublished>=2023 AND _exists_:fullText', limit: 3 },
                { _description: 'Search for machine learning papers with stats', q: 'machine learning', limit: 5, stats: true }
            ],
            output: {
                description: 'Paginated search results of scholarly works with metadata, abstracts, and download links',
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'CORE search response containing hit count, pagination info, and array of matching work records',
                    properties: {
                        totalHits: { type: 'number', description: 'Total number of works matching the query (may exceed returned results)' },
                        limit: { type: 'number', description: 'Maximum results per page as requested' },
                        offset: { type: 'number', description: 'Number of results skipped (current pagination position)' },
                        scrollId: { type: 'string', description: 'Scroll cursor for iterating through large result sets (only present when scroll=true)' },
                        results: { type: 'array', description: 'Array of scholarly work objects matching the search query', items: { type: 'object', properties: { id: { type: 'number', description: 'Unique CORE work ID. Use in getWork for full metadata.' }, title: { type: 'string', description: 'Title of the scholarly work' }, authors: { type: 'array', description: 'Array of author objects with name fields' }, abstract: { type: 'string', description: 'Paper abstract text' }, doi: { type: 'string', description: 'Digital Object Identifier (e.g. 10.1038/nature12373). Use in discoverFulltext.' }, yearPublished: { type: 'number', description: 'Year the work was published' }, downloadUrl: { type: 'string', description: 'Direct URL to download the full-text PDF (if available)' }, publisher: { type: 'string', description: 'Publisher name' }, documentType: { type: 'string', description: 'Type of document (e.g. journal article, conference paper, thesis)' }, fieldOfStudy: { type: 'string', description: 'Primary field of study classification' } } } }
                    }
                }
            },
        },
        getWork: {
            method: 'GET',
            path: '/works/:workId',
            description: 'Get detailed metadata for a specific work by its CORE ID. Returns full record including title, authors, abstract, DOI, full text, download URL, references, and linked outputs. Use IDs from searchWorks.',
            parameters: [
                { position: { key: 'workId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [], description: 'CORE work ID (numeric identifier for the scholarly work)' } }
            ],
            tests: [
                { _description: 'Get work by CORE ID', workId: '3849028' },
                { _description: 'Get another work by ID', workId: '1000000' },
                { _description: 'Get work with a different ID', workId: '5000000' }
            ],
            output: {
                description: 'Full metadata record for a scholarly work including full text, references, and all linked outputs',
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Complete CORE work record with all available metadata fields',
                    properties: {
                        id: { type: 'number', description: 'Unique CORE work ID' },
                        title: { type: 'string', description: 'Title of the scholarly work' },
                        authors: { type: 'array', description: 'Array of author objects with name and affiliation fields' },
                        contributors: { type: 'array', description: 'Array of contributor objects (editors, translators, etc.)' },
                        abstract: { type: 'string', description: 'Paper abstract text' },
                        doi: { type: 'string', description: 'Digital Object Identifier' },
                        arxivId: { type: 'string', description: 'arXiv preprint identifier (if applicable)' },
                        pubmedId: { type: 'string', description: 'PubMed identifier (if applicable)' },
                        yearPublished: { type: 'number', description: 'Year the work was published' },
                        publishedDate: { type: 'string', description: 'Full publication date in ISO 8601 format' },
                        downloadUrl: { type: 'string', description: 'Direct URL to download the full-text PDF' },
                        fullText: { type: 'string', description: 'Full text content of the paper (if available in CORE)' },
                        publisher: { type: 'string', description: 'Publisher name' },
                        documentType: { type: 'string', description: 'Type of document (e.g. journal article, thesis)' },
                        fieldOfStudy: { type: 'string', description: 'Primary field of study classification' },
                        citationCount: { type: 'number', description: 'Number of citations this work has received' },
                        references: { type: 'array', description: 'Array of referenced work objects cited by this paper' },
                        dataProviders: { type: 'array', description: 'Array of repositories that provide this work (use IDs in searchDataProviders)' },
                        outputs: { type: 'array', description: 'Array of output manifestations of this work across repositories (use IDs in getOutput)' },
                        links: { type: 'array', description: 'Array of related links (publisher page, repository page, etc.)' }
                    }
                }
            },
        },
        searchOutputs: {
            method: 'GET',
            path: '/search/outputs/',
            description: 'Search individual research outputs (specific manifestations of works as deposited in repositories). Supports the same query syntax as searchWorks including field-specific and boolean queries. Use returned IDs in getOutput for full details.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [], description: 'Search query string — supports field-specific (title:"phrase"), boolean (AND, OR), and existence checks (_exists_:fullText)' } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(100)'], description: 'Maximum number of results to return per page (1-100)' } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'], description: 'Number of results to skip for pagination' } },
                { position: { key: 'scroll', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'], description: 'Enable scroll mode for iterating through large result sets' } },
                { position: { key: 'stats', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(false)'], description: 'When true, include aggregation statistics in the response' } }
            ],
            tests: [
                { _description: 'Search outputs for climate change with full text', q: 'climate change AND _exists_:fullText', limit: 3 },
                { _description: 'Search outputs for renewable energy', q: 'renewable energy', limit: 5 },
                { _description: 'Search for biology outputs with offset', q: 'biology', limit: 3, offset: 10 }
            ],
            output: {
                description: 'Paginated search results of individual research outputs deposited in repositories',
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'CORE search response for research outputs with pagination and matching records',
                    properties: {
                        totalHits: { type: 'number', description: 'Total number of outputs matching the query' },
                        limit: { type: 'number', description: 'Maximum results per page as requested' },
                        offset: { type: 'number', description: 'Number of results skipped' },
                        scrollId: { type: 'string', description: 'Scroll cursor for large result sets (only when scroll=true)' },
                        results: { type: 'array', description: 'Array of research output objects', items: { type: 'object', properties: { id: { type: 'number', description: 'Unique CORE output ID. Use in getOutput for full details.' }, title: { type: 'string', description: 'Output title' }, authors: { type: 'array', description: 'Array of author objects' }, abstract: { type: 'string', description: 'Abstract text' }, doi: { type: 'string', description: 'Digital Object Identifier' }, downloadUrl: { type: 'string', description: 'Direct URL to download the full text' }, language: { type: 'object', description: 'Language metadata with code and name fields' }, depositedDate: { type: 'string', description: 'ISO 8601 date when deposited in the repository' } } } }
                    }
                }
            },
        },
        getOutput: {
            method: 'GET',
            path: '/outputs/:outputId',
            description: 'Retrieve a specific research output by its CORE output ID. Returns full metadata including title, authors, abstract, identifiers, dates, and download URL. Use IDs from searchOutputs.',
            parameters: [
                { position: { key: 'outputId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [], description: 'CORE output ID (numeric identifier for the research output)' } }
            ],
            tests: [
                { _description: 'Get a specific output by ID', outputId: '3849028' },
                { _description: 'Get another output by ID', outputId: '1000000' },
                { _description: 'Get output with a different ID', outputId: '2500000' }
            ],
            output: {
                description: 'Full metadata record for a specific research output including text, dates, and identifiers',
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Complete CORE output record with all available metadata',
                    properties: {
                        id: { type: 'number', description: 'Unique CORE output ID' },
                        title: { type: 'string', description: 'Output title' },
                        authors: { type: 'array', description: 'Array of author objects with name fields' },
                        abstract: { type: 'string', description: 'Abstract text' },
                        doi: { type: 'string', description: 'Digital Object Identifier' },
                        downloadUrl: { type: 'string', description: 'Direct URL to download the full text' },
                        fullText: { type: 'string', description: 'Full text content (if available)' },
                        language: { type: 'object', description: 'Language metadata with ISO code and name' },
                        depositedDate: { type: 'string', description: 'ISO 8601 date when deposited in the repository' },
                        publishedDate: { type: 'string', description: 'ISO 8601 publication date' },
                        updatedDate: { type: 'string', description: 'ISO 8601 date of last metadata update' }
                    }
                }
            },
        },
        searchDataProviders: {
            method: 'GET',
            path: '/search/data-providers/',
            description: 'Search institutional and disciplinary repositories that provide content to CORE. Returns repository metadata including name, URL, location, and content statistics.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [], description: 'Search query to find repositories by name, URL, or description' } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(100)'], description: 'Maximum number of results to return per page (1-100)' } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'], description: 'Number of results to skip for pagination' } },
                { position: { key: 'stats', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(false)'], description: 'When true, include content statistics per repository' } }
            ],
            tests: [
                { _description: 'Search for MIT repository', q: 'MIT', limit: 3 },
                { _description: 'Search for Oxford repositories', q: 'Oxford', limit: 5 },
                { _description: 'Search for German repositories', q: 'Germany', limit: 3, stats: true }
            ],
            output: {
                description: 'Paginated list of institutional repositories with metadata and optional content statistics',
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'CORE search response for data provider repositories',
                    properties: {
                        totalHits: { type: 'number', description: 'Total number of repositories matching the query' },
                        limit: { type: 'number', description: 'Maximum results per page as requested' },
                        offset: { type: 'number', description: 'Number of results skipped' },
                        results: { type: 'array', description: 'Array of repository objects', items: { type: 'object', properties: { id: { type: 'number', description: 'Unique CORE data provider ID' }, name: { type: 'string', description: 'Repository or institution name' }, email: { type: 'string', description: 'Contact email for the repository' }, uri: { type: 'string', description: 'Repository homepage URL' }, type: { type: 'string', description: 'Repository type (e.g. institutional, disciplinary)' }, location: { type: 'object', description: 'Geographic location with country and coordinates' }, stats: { type: 'object', description: 'Content statistics: total outputs, full-text count, metadata-only count (when stats=true)' } } } }
                    }
                }
            },
        },
        searchJournals: {
            method: 'GET',
            path: '/search/journals/',
            description: 'Search academic journals indexed in CORE. Find journals by name, ISSN, publisher, or subject area.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [], description: 'Search query to find journals by name, ISSN, publisher, or subject area' } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(100)'], description: 'Maximum number of results to return per page (1-100)' } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'], description: 'Number of results to skip for pagination' } },
                { position: { key: 'stats', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(false)'], description: 'When true, include content statistics per journal' } }
            ],
            tests: [
                { _description: 'Search for biology journals', q: 'biology', limit: 3 },
                { _description: 'Search for physics journals', q: 'physics', limit: 5 },
                { _description: 'Search for Nature journals', q: 'Nature', limit: 3 }
            ],
            output: {
                description: 'Paginated list of academic journals with publication metadata and identifiers',
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'CORE search response for academic journals',
                    properties: {
                        totalHits: { type: 'number', description: 'Total number of journals matching the query' },
                        limit: { type: 'number', description: 'Maximum results per page as requested' },
                        offset: { type: 'number', description: 'Number of results skipped' },
                        results: { type: 'array', description: 'Array of journal objects', items: { type: 'object', properties: { title: { type: 'string', description: 'Journal title' }, publisher: { type: 'string', description: 'Publisher name' }, subjects: { type: 'array', description: 'Array of subject area strings' }, language: { type: 'string', description: 'Primary publication language' }, identifiers: { type: 'array', description: 'Array of identifiers including ISSN, EISSN' } } } }
                    }
                }
            },
        },
        discoverFulltext: {
            method: 'POST',
            path: '/discover',
            description: 'Find fulltext download links for a paper by DOI or title. Returns a direct link to the open access PDF if available in CORE. Use DOIs from searchWorks results for best matching accuracy.',
            parameters: [
                { position: { key: 'doi', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: ['optional()'], description: 'Digital Object Identifier of the paper (e.g. 10.1038/nature12373)' } },
                { position: { key: 'title', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: ['optional()'], description: 'Title of the paper to search for (partial matches supported)' } },
                { position: { key: 'year', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'number()', options: ['optional()'], description: 'Publication year to narrow results' } }
            ],
            tests: [
                { _description: 'Discover fulltext link for a paper by DOI', doi: '10.1038/nature12373' },
                { _description: 'Discover fulltext by title', title: 'Attention Is All You Need' },
                { _description: 'Discover by DOI and year', doi: '10.1145/3442188.3445922', year: 2021 }
            ],
            output: {
                description: 'Direct download link to the open access fulltext PDF if found in CORE repositories',
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'CORE discover response with fulltext link and source repository info',
                    properties: {
                        fullTextLink: { type: 'string', description: 'Direct URL to download the open access PDF' },
                        source: { type: 'string', description: 'Name of the repository or source providing the fulltext' }
                    }
                }
            },
        }
    }
}
