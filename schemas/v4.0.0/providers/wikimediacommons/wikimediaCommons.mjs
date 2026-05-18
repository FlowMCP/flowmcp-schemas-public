export const main = {
    namespace: 'wikimediacommons',
    name: 'Wikimedia Commons',
    description: 'Search and access 100M+ free media files on Wikimedia Commons. Search files by keyword, browse categories, retrieve image metadata including dimensions, MIME type, license, and author. All content freely licensed under Creative Commons.',
    version: '4.0.0',
    docs: ['https://commons.wikimedia.org/w/api.php', 'https://www.mediawiki.org/wiki/API:Main_page'],
    tags: ['media', 'images', 'opendata', 'creativecommons', 'wikipedia', 'cacheTtlDaily'],
    root: 'https://commons.wikimedia.org',
    requiredServerParams: [],
    headers: {
        'User-Agent': 'FlowMCP/1.0 (https://github.com/FlowMCP)'
    },
    tools: {
        searchFiles: {
            method: 'GET',
            path: '/w/api.php',
            description: 'Search for media files on Wikimedia Commons by keyword. Returns file titles, page IDs, snippets, and timestamps. Searches in File namespace (ns=6) by default to find images, audio, and video.. Use IDs from results in getFileCategories',
            parameters: [
                { position: { key: 'action', value: 'query', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'list', value: 'search', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'srsearch', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'srnamespace', value: '6', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'srlimit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(50)'] } },
                { position: { key: 'sroffset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'origin', value: '*', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Search for sunset images', srsearch: 'sunset', srlimit: 3 },
                { _description: 'Search for NASA photos', srsearch: 'NASA space', srlimit: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        batchcomplete: { type: 'string' },
                        continue: { type: 'object', properties: { sroffset: { type: 'number' }, continue: { type: 'string' } } },
                        query: {
                            type: 'object',
                            properties: {
                                searchinfo: { type: 'object', properties: { totalhits: { type: 'number' } } },
                                search: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            ns: { type: 'number' },
                                            title: { type: 'string' },
                                            pageid: { type: 'number' },
                                            size: { type: 'number' },
                                            wordcount: { type: 'number' },
                                            snippet: { type: 'string' },
                                            timestamp: { type: 'string' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
        },
        getImageInfo: {
            method: 'GET',
            path: '/w/api.php',
            description: 'Get detailed metadata for a specific file on Wikimedia Commons. Returns image URL, dimensions, file size, MIME type, uploader, and upload timestamp. File title must include the . Use searchFiles first to find valid IDs"File:" prefix.',
            parameters: [
                { position: { key: 'action', value: 'query', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'titles', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'prop', value: 'imageinfo', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'iiprop', value: 'url|size|mime|user|timestamp', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'origin', value: '*', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get info for a featured sunset photo', titles: 'File:Sunset 2007-1.jpg' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'object',
                            properties: {
                                pages: {
                                    type: 'object'
                                }
                            }
                        }
                    }
                }
            },
        },
        getExtendedMetadata: {
            method: 'GET',
            path: '/w/api.php',
            description: 'Get extended metadata for a file including license, description, author, GPS coordinates, and categories. Returns rich metadata extracted from file EXIF data and Commons page content.. Use searchFiles first to find valid IDs',
            parameters: [
                { position: { key: 'action', value: 'query', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'titles', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'prop', value: 'imageinfo', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'iiprop', value: 'url|size|mime|extmetadata', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'origin', value: '*', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get extended metadata for a featured photo', titles: 'File:Sunset 2007-1.jpg' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'object',
                            properties: {
                                pages: {
                                    type: 'object'
                                }
                            }
                        }
                    }
                }
            },
        },
        getCategoryMembers: {
            method: 'GET',
            path: '/w/api.php',
            description: 'List files in a Wikimedia Commons category. Returns page titles and IDs for files belonging to the specified category. Category title must include the "Category:" prefix.',
            parameters: [
                { position: { key: 'action', value: 'query', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'list', value: 'categorymembers', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'cmtitle', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'cmtype', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(file,subcat,page)', options: ['optional()', 'default(file)'] } },
                { position: { key: 'cmlimit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(50)'] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'origin', value: '*', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'List files in the Sunsets category', cmtitle: 'Category:Sunsets', cmlimit: 3 },
                { _description: 'List subcategories of Nature', cmtitle: 'Category:Nature', cmtype: 'subcat', cmlimit: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'object',
                            properties: {
                                categorymembers: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            pageid: { type: 'number' },
                                            ns: { type: 'number' },
                                            title: { type: 'string' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
        },
        searchWithImageInfo: {
            method: 'GET',
            path: '/w/api.php',
            description: 'Search for files and include image info (URL, size, MIME type) in a single request. Uses generator search to combine search and imageinfo queries. Returns file pages with embedded image metadata.',
            parameters: [
                { position: { key: 'action', value: 'query', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'generator', value: 'search', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'gsrsearch', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'gsrnamespace', value: '6', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'gsrlimit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(50)'] } },
                { position: { key: 'prop', value: 'imageinfo', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'iiprop', value: 'url|size|mime', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'origin', value: '*', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Search sunset landscapes with image URLs', gsrsearch: 'sunset landscape', gsrlimit: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'object',
                            properties: {
                                pages: {
                                    type: 'object'
                                }
                            }
                        }
                    }
                }
            },
        },
        getFileCategories: {
            method: 'GET',
            path: '/w/api.php',
            description: 'Get the categories assigned to a specific file on Wikimedia Commons. Returns a list of category titles for the given file page. File title must include the "File:" prefix.',
            parameters: [
                { position: { key: 'action', value: 'query', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'titles', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'prop', value: 'categories', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'cllimit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(50)'] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'origin', value: '*', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get categories of a featured photo', titles: 'File:Sunset 2007-1.jpg', cllimit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        query: {
                            type: 'object',
                            properties: {
                                pages: {
                                    type: 'object'
                                }
                            }
                        }
                    }
                }
            },
        }
    }
}
