export const main = {
    namespace: 'internetarchive',
    name: 'Internet Archive',
    description: 'Search and access 40M+ items in the Internet Archive digital library. Search across books, audio, video, software, and web pages. Retrieve full item metadata, file listings, and view statistics.',
    version: '4.0.0',
    docs: ['https://archive.org/developers/', 'https://archive.org/developers/md-read.html'],
    tags: ['archive', 'library', 'books', 'media', 'search', 'opendata', 'cacheTtlDaily'],
    root: 'https://archive.org',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchItems: {
            method: 'GET',
            path: '/advancedsearch.php',
            description: 'Search the Internet Archive catalog with full-text queries. Supports Lucene query syntax with field filters like collection, mediatype, creator, date. Returns matching items with selected metadata fields. Use getMetadata to retrieve full details for any result identifier.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Lucene query string (e.g. "collection:opensource AND mediatype:texts", "creator:NASA")' },
                { position: { key: 'fl[]', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(identifier,title,description,mediatype,date,creator)'] }, description: 'Comma-separated fields to return (identifier, title, description, mediatype, date, creator, etc.)' },
                { position: { key: 'rows', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(100)'] }, description: 'Number of results per page (max 100)' },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)', 'min(1)'] }, description: 'Page number for pagination' },
                { position: { key: 'sort[]', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Sort field and direction (e.g. "downloads desc", "date asc")' },
                { position: { key: 'output', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Response format, fixed to json' }
            ],
            tests: [
                { _description: 'Search for open source texts', q: 'collection:opensource AND mediatype:texts', rows: 3 },
                { _description: 'Search for NASA audio recordings', q: 'creator:NASA AND mediatype:audio', rows: 3 },
                { _description: 'Search for public domain movies', q: 'mediatype:movies AND licenseurl:publicdomain', rows: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Solr-style search result with header and paginated document matches',
                    properties: {
                        responseHeader: {
                            type: 'object',
                            description: 'Search engine response metadata',
                            properties: {
                                status: { type: 'number', description: 'HTTP-like status code (0 = success)' },
                                QTime: { type: 'number', description: 'Query execution time in milliseconds' }
                            }
                        },
                        response: {
                            type: 'object',
                            description: 'Search result container with total count and matched documents',
                            properties: {
                                numFound: { type: 'number', description: 'Total number of items matching the query' },
                                start: { type: 'number', description: 'Zero-based offset of the first result' },
                                docs: { type: 'array', description: 'Array of matched items with requested fields (identifier usable with getMetadata)', items: { type: 'object', description: 'Item record with fields specified in fl[] parameter' } }
                            }
                        }
                    }
                }
            },
        },
        getMetadata: {
            method: 'GET',
            path: '/metadata/:identifier',
            description: 'Retrieve the complete metadata record for an Internet Archive item by its unique identifier. Returns item metadata, file listings with checksums, server information, and file count. Use searchItems to find identifiers. Use getMetadataField to fetch a specific section.',
            parameters: [
                { position: { key: 'identifier', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'Unique Internet Archive item identifier (from searchItems results)' }
            ],
            tests: [
                { _description: 'Get metadata for the Prelinger Archives', identifier: 'prelinger' },
                { _description: 'Get metadata for a public domain book', identifier: 'adventuresofali00craigoog' },
                { _description: 'Get metadata for the Grateful Dead collection', identifier: 'GratefulDead' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Complete metadata record for an Internet Archive item including files and server info',
                    properties: {
                        created: { type: 'number', description: 'Unix timestamp when the item was created' },
                        d1: { type: 'string', description: 'Primary storage server hostname' },
                        d2: { type: 'string', description: 'Secondary storage server hostname' },
                        dir: { type: 'string', description: 'Storage directory path on the archive server' },
                        files: { type: 'array', description: 'List of all files in this item', items: { type: 'object', properties: { name: { type: 'string', description: 'Filename' }, source: { type: 'string', description: 'File source: original (uploaded) or derivative (generated)' }, format: { type: 'string', description: 'File format (e.g. PDF, JPEG, MP3)' }, size: { type: 'string', description: 'File size in bytes' }, md5: { type: 'string', description: 'MD5 checksum for integrity verification' } } } },
                        files_count: { type: 'number', description: 'Total number of files in this item' },
                        item_last_updated: { type: 'number', description: 'Unix timestamp of last item update' },
                        item_size: { type: 'number', description: 'Total size of all files in bytes' },
                        metadata: { type: 'object', description: 'Item metadata fields (title, creator, description, subject, date, etc.)' },
                        server: { type: 'string', description: 'Current serving server hostname' },
                        uniq: { type: 'number', description: 'Unique item counter' }
                    }
                }
            },
        },
        getMetadataField: {
            method: 'GET',
            path: '/metadata/:identifier/:field',
            description: 'Retrieve a specific metadata field for an Internet Archive item. Use to fetch only the metadata, files, or other top-level fields without downloading the full record. Use getMetadata to see all available fields.',
            parameters: [
                { position: { key: 'identifier', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'Unique Internet Archive item identifier' },
                { position: { key: 'field', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(metadata,files,files_count,item_size,item_last_updated,created,server,dir)', options: [] }, description: 'Top-level field to retrieve from the item record' }
            ],
            tests: [
                { _description: 'Get only file listings for an item', identifier: 'prelinger', field: 'files' },
                { _description: 'Get only metadata for an item', identifier: 'prelinger', field: 'metadata' },
                { _description: 'Get file count for an item', identifier: 'adventuresofali00craigoog', field: 'files_count' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Single metadata field value for the requested item',
                    properties: {
                        result: { type: 'object', description: 'The requested field value (type varies: object for metadata, array for files, number for counts)' }
                    }
                }
            },
        },
        getFilesSlice: {
            method: 'GET',
            path: '/metadata/:identifier/files',
            description: 'Retrieve a paginated slice of the file listing for an Internet Archive item. Useful for items with many files where you need to page through the list. Use getMetadata to get the files_count first.',
            parameters: [
                { position: { key: 'identifier', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'Unique Internet Archive item identifier' },
                { position: { key: 'start', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] }, description: 'Zero-based starting index for file listing pagination' },
                { position: { key: 'count', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(1000)'] }, description: 'Number of files to return (max 1000)' }
            ],
            tests: [
                { _description: 'Get first 5 files of an item', identifier: 'prelinger', start: 0, count: 5 },
                { _description: 'Get files 10-20 of an item', identifier: 'prelinger', start: 10, count: 10 },
                { _description: 'Get first 3 files of a book item', identifier: 'adventuresofali00craigoog', start: 0, count: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated slice of the file listing for an Internet Archive item',
                    properties: {
                        result: { type: 'array', description: 'Array of file records in the requested range', items: { type: 'object', properties: { name: { type: 'string', description: 'Filename' }, source: { type: 'string', description: 'File source: original or derivative' }, format: { type: 'string', description: 'File format (e.g. PDF, JPEG)' }, size: { type: 'string', description: 'File size in bytes' } } } }
                    }
                }
            },
        },
        checkAvailability: {
            method: 'GET',
            path: '/wayback/available',
            description: 'Check if a URL has been archived in the Wayback Machine. Returns the closest available snapshot with its archive URL and timestamp. Quick availability check without full CDX query.',
            parameters: [
                { position: { key: 'url', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'URL to check for Wayback Machine snapshots' },
                { position: { key: 'timestamp', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Target timestamp in YYYYMMDD format to find the closest snapshot to' }
            ],
            tests: [
                { _description: 'Check if example.com is archived', url: 'example.com' },
                { _description: 'Check archive near specific date', url: 'google.com', timestamp: '20100101' },
                { _description: 'Check Wayback availability for Wikipedia', url: 'wikipedia.org', timestamp: '20050101' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Wayback Machine availability check result with closest snapshot info',
                    properties: {
                        url: { type: 'string', description: 'The URL that was checked' },
                        archived_snapshots: {
                            type: 'object',
                            description: 'Available snapshots, keyed by proximity type',
                            properties: {
                                closest: {
                                    type: 'object',
                                    description: 'Closest archived snapshot to the requested timestamp',
                                    properties: {
                                        status: { type: 'string', description: 'HTTP status code of the archived page (e.g. 200)' },
                                        available: { type: 'boolean', description: 'Whether an archived snapshot exists' },
                                        url: { type: 'string', description: 'Full Wayback Machine URL to access the archived page' },
                                        timestamp: { type: 'string', description: 'Timestamp of the snapshot in YYYYMMDDHHmmss format' }
                                    }
                                }
                            }
                        }
                    }
                }
            },
        }
    }
}
