export const main = {
    namespace: 'metmuseum',
    name: 'MetMuseum',
    description: 'Access the Metropolitan Museum of Art collection with 470K+ artworks — search by keyword, filter by department, retrieve full object details including images, artist info, and provenance. All data is CC0 licensed.',
    version: '4.0.0',
    docs: ['https://metmuseum.github.io/'],
    tags: ['art', 'museum', 'culture', 'opendata', 'cacheTtlStatic'],
    root: 'https://collectionapi.metmuseum.org/public/collection/v1',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchObjects: {
            method: 'GET',
            path: '/search',
            description: 'Search the Met collection by keyword. Returns a list of matching object IDs. Supports filtering by department, highlight status, date range, medium, and geo location. Use getObject with returned IDs for full details.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'departmentId', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'isHighlight', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] } },
                { position: { key: 'hasImages', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] } },
                { position: { key: 'isOnView', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()'] } },
                { position: { key: 'medium', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'geoLocation', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'dateBegin', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'dateEnd', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Search for sunflowers artworks', q: 'sunflowers' },
                { _description: 'Search for Van Gogh artworks that are highlights with images', q: 'van gogh', isHighlight: true, hasImages: true },
                { _description: 'Search for Japanese prints in Asian Art department', q: 'samurai', departmentId: 6 },
                { _description: 'Search for Egyptian artworks by geo location', q: 'sphinx', geoLocation: 'Egypt' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Search results with total count and matching object IDs for further lookup',
                    properties: {
                        total: { type: 'number', description: 'Total number of artworks matching the search query and filters' },
                        objectIDs: { type: 'array', description: 'Array of numeric object IDs, use with getObject for full artwork details' }
                    }
                }
            }
        },
        getObject: {
            method: 'GET',
            path: '/objects/:objectID',
            description: 'Retrieve full details for a single artwork by its object ID. Returns title, artist, date, medium, dimensions, images, department, culture, provenance, and more. Use searchObjects or getObjects to find object IDs.',
            parameters: [
                { position: { key: 'objectID', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Get details for Quail and Millet by Kiyohara Yukinobu', objectID: 45734 },
                { _description: 'Get details for a funerary coffin from ancient Egypt', objectID: 546303 },
                { _description: 'Get details for a famous Van Gogh artwork', objectID: 436532 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Complete artwork record with metadata, images, and provenance information',
                    properties: {
                        objectID: { type: 'number', description: 'Unique numeric identifier for this artwork' },
                        title: { type: 'string', description: 'Official artwork title' },
                        artistDisplayName: { type: 'string', description: 'Artist name as displayed (may include life dates)' },
                        artistDisplayBio: { type: 'string', description: 'Artist biographical details including nationality and dates' },
                        artistNationality: { type: 'string', description: 'Artist nationality or cultural origin' },
                        objectDate: { type: 'string', description: 'Date or date range when the artwork was created (e.g., ca. 1670, 1889)' },
                        medium: { type: 'string', description: 'Materials and techniques used (e.g., Oil on canvas, Ink on silk)' },
                        dimensions: { type: 'string', description: 'Physical dimensions with measurements in cm and inches' },
                        primaryImage: { type: 'string', description: 'URL to high-resolution primary image, empty if restricted' },
                        primaryImageSmall: { type: 'string', description: 'URL to smaller version of primary image for thumbnails' },
                        additionalImages: { type: 'array', description: 'URLs to additional photographs or views of the artwork' },
                        department: { type: 'string', description: 'Museum department name (e.g., Asian Art, Egyptian Art)' },
                        culture: { type: 'string', description: 'Cultural or geographic origin of the artwork' },
                        period: { type: 'string', description: 'Historical period (e.g., Edo period, New Kingdom)' },
                        isHighlight: { type: 'boolean', description: 'Whether this artwork is a curated highlight of the collection' },
                        isPublicDomain: { type: 'boolean', description: 'Whether images are freely available under CC0 license' },
                        creditLine: { type: 'string', description: 'How the artwork was acquired (e.g., Gift of, Purchase)' },
                        objectURL: { type: 'string', description: 'Direct URL to the artwork page on metmuseum.org' },
                        tags: { type: 'array', description: 'Subject keyword tags describing themes and content' }
                    }
                }
            }
        },
        getDepartments: {
            method: 'GET',
            path: '/departments',
            description: 'List all museum departments with their IDs and display names. Use department IDs to filter searchObjects and getObjects results by collection area.',
            parameters: [],
            tests: [
                { _description: 'Get all museum departments' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Complete list of Met Museum curatorial departments',
                    properties: {
                        departments: {
                            type: 'array',
                            description: 'Array of department objects with IDs for use as search filters',
                            items: {
                                type: 'object',
                                properties: {
                                    departmentId: { type: 'number', description: 'Numeric department ID for use with searchObjects departmentId filter' },
                                    displayName: { type: 'string', description: 'Full department name (e.g., American Decorative Arts, Asian Art, Egyptian Art)' }
                                }
                            }
                        }
                    }
                }
            }
        },
        getObjects: {
            method: 'GET',
            path: '/objects',
            description: 'Get a list of all valid object IDs in the collection, optionally filtered by department or last metadata update date. Returns up to 470K+ object IDs. Use getObject with individual IDs for details.',
            parameters: [
                { position: { key: 'metadataDate', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'departmentIds', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get all object IDs updated after a specific date', metadataDate: '2024-01-01' },
                { _description: 'Get all objects in the Egyptian Art department (ID 10)', departmentIds: '10' },
                { _description: 'Get objects in multiple departments', departmentIds: '1|3|6' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Complete list of object IDs matching the optional filters',
                    properties: {
                        total: { type: 'number', description: 'Total number of objects matching the filters' },
                        objectIDs: { type: 'array', description: 'Array of numeric object IDs, use with getObject for full details' }
                    }
                }
            }
        }
    }
}
