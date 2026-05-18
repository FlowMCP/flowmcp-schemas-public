export const main = {
    namespace: 'bsbmdz',
    name: 'BSB MDZ',
    description: 'Bayerische Staatsbibliothek Muenchener Digitalisierungszentrum — 3.16M+ digitized items accessible via IIIF Presentation and Image APIs. Manuscripts, early prints, maps, music, and historical materials.',
    version: '4.0.0',
    docs: ['https://www.digitale-sammlungen.de/', 'https://iiif.io/api/presentation/2.1/'],
    tags: ['library', 'iiif', 'digitization', 'manuscripts', 'germany', 'cultural-heritage', 'cacheTtlStatic'],
    root: 'https://api.digitale-sammlungen.de',
    requiredServerParams: [],
    headers: {
        'Accept': 'application/json'
    },
    tools: {
        getManifest: {
            method: 'GET',
            path: '/iiif/presentation/v2/:bsbId/manifest',
            description: 'Get IIIF Presentation manifest for a digitized item by its BSB identifier. Returns complete metadata, page sequences, and image references.',
            parameters: [
                { position: { key: 'bsbId', value: '{{BSB_ID}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get manifest for Actorum Bohemicorum (early print)', BSB_ID: 'bsb10000001' },
                { _description: 'Get manifest for a different item', BSB_ID: 'bsb12095605' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        '@context': { type: 'string' },
                        '@type': { type: 'string' },
                        '@id': { type: 'string' },
                        label: { type: 'string' },
                        metadata: { type: 'array', items: { type: 'object' } },
                        sequences: { type: 'array', items: { type: 'object' } },
                        attribution: { type: 'string' }
                    }
                }
            }
        },
        getTopCollection: {
            method: 'GET',
            path: '/iiif/presentation/v2/collection/top',
            description: 'Get the top-level IIIF collection with total item count (3.16M+). Returns the entry point for browsing all digitized items with cursor pagination.',
            parameters: [],
            tests: [
                { _description: 'Get top-level collection overview' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        '@type': { type: 'string' },
                        label: { type: 'string' },
                        total: { type: 'number' },
                        first: { type: 'string' }
                    }
                }
            }
        },
        browseCollection: {
            method: 'GET',
            path: '/iiif/presentation/v2/collection/top',
            description: 'Browse the digitized collection with cursor-based pagination. Returns a page of manifest references with links to the next page.',
            parameters: [
                { position: { key: 'cursor', value: '{{CURSOR}}', location: 'query' }, z: { primitive: 'string()', options: ['default(initial)'] } }
            ],
            tests: [
                { _description: 'Get first page of collection', CURSOR: 'initial' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        '@type': { type: 'string' },
                        label: { type: 'string' },
                        manifests: { type: 'array', items: { type: 'object' } },
                        next: { type: 'string' }
                    }
                }
            }
        },
        getCanvas: {
            method: 'GET',
            path: '/iiif/presentation/v2/:bsbId/canvas/:pageNumber',
            description: 'Retrieve a specific canvas (page) from a digitized item. Returns image annotations with dimensions, OCR seeAlso link, attribution, and license.',
            parameters: [
                { position: { key: 'bsbId', value: '{{BSB_ID}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'pageNumber', value: '{{PAGE_NUMBER}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Get first page canvas of a book', BSB_ID: 'bsb10015730', PAGE_NUMBER: '1' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        '@type': { type: 'string' },
                        '@id': { type: 'string' },
                        label: { type: 'string' },
                        width: { type: 'number' },
                        height: { type: 'number' },
                        images: { type: 'array', items: { type: 'object' } },
                        seeAlso: { type: 'object' }
                    }
                }
            }
        },
        getImageInfo: {
            method: 'GET',
            path: '/iiif/image/v2/:imageId/info.json',
            description: 'Get IIIF Image API info for a specific page/image. Returns dimensions, available sizes, tile information, and supported formats (jpg, png, gif, tif, webp).',
            parameters: [
                { position: { key: 'imageId', value: '{{IMAGE_ID}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get image info for first page of bsb10000001', IMAGE_ID: 'bsb10000001_00001' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        '@context': { type: 'string' },
                        '@id': { type: 'string' },
                        width: { type: 'number' },
                        height: { type: 'number' },
                        tiles: { type: 'array', items: { type: 'object' } },
                        sizes: { type: 'array', items: { type: 'object' } },
                        profile: { type: 'array' }
                    }
                }
            }
        }
    }
}
