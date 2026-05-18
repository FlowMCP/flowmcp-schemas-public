export const main = {
    namespace: 'openlibrary',
    name: 'OpenLibrary',
    description: 'Search and retrieve book data from Open Library — 20M+ editions, works, authors, and subjects from the Internet Archive.',
    version: '4.0.0',
    docs: ['https://openlibrary.org/developers/api'],
    tags: ['books', 'library', 'literature', 'education', 'cacheTtlDaily'],
    root: 'https://openlibrary.org',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchBooks: {
            method: 'GET',
            path: '/search.json',
            description: 'Search for books and works across Open Library. Supports full-text query, author, title, and ISBN filtering. Use work keys from results in getWorkByKey for full details, or author keys in getAuthorByKey.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'title', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'author', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'isbn', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'subject', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'sort', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(relevance,new,old,random)', options: ['optional()', 'default(relevance)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(100)'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)', 'min(1)'] } }
            ],
            tests: [
                { _description: 'Search for books about machine learning', q: 'machine learning', limit: 10 },
                { _description: 'Search by author name — George Orwell', author: 'George Orwell', limit: 5 },
                { _description: 'Search by title — 1984', title: '1984', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        start: { type: 'number', description: 'Offset of first result' },
                        num_found: { type: 'number', description: 'Total number of matching results' },
                        docs: {
                            type: 'array',
                            description: 'Array of matching works/books',
                            items: {
                                type: 'object',
                                properties: {
                                    key: { type: 'string', description: 'Open Library work key e.g. /works/OL45804W' },
                                    title: { type: 'string' },
                                    author_name: { type: 'array', items: { type: 'string' } },
                                    first_publish_year: { type: 'number' },
                                    isbn: { type: 'array', items: { type: 'string' } },
                                    subject: { type: 'array', items: { type: 'string' } },
                                    cover_i: { type: 'number', description: 'Cover image ID' },
                                    edition_count: { type: 'number' },
                                    language: { type: 'array', items: { type: 'string' } }
                                }
                            }
                        }
                    }
                }
            }
        },
        getWorkByKey: {
            method: 'GET',
            path: '/works/:workId.json',
            description: 'Retrieve a work (book) record by its Open Library work ID. Returns title, description, subjects, and links to editions. Use work keys from searchBooks or getSubjectBooks.',
            parameters: [
                { position: { key: 'workId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get The Wonderful Wizard of Oz work', workId: 'OL18417W' },
                { _description: 'Get 1984 by George Orwell work', workId: 'OL1168002W' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        key: { type: 'string', description: 'Work key e.g. /works/OL18417W' },
                        title: { type: 'string' },
                        description: { type: 'object', description: 'Work description (may be string or {type, value} object)' },
                        subjects: { type: 'array', items: { type: 'string' } },
                        subject_places: { type: 'array', items: { type: 'string' } },
                        subject_times: { type: 'array', items: { type: 'string' } },
                        authors: { type: 'array', description: 'Author references', items: { type: 'object' } },
                        covers: { type: 'array', items: { type: 'number' }, description: 'Cover image IDs' },
                        created: { type: 'object', properties: { type: { type: 'string' }, value: { type: 'string' } } },
                        last_modified: { type: 'object' }
                    }
                }
            }
        },
        getBookByIsbn: {
            method: 'GET',
            path: '/isbn/:isbn.json',
            description: 'Look up an edition by its ISBN (ISBN-10 or ISBN-13). Returns edition metadata including publisher, publish date, and pages. Use ISBNs from searchBooks results.',
            parameters: [
                { position: { key: 'isbn', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Look up Dune by ISBN-13', isbn: '9780441013593' },
                { _description: 'Look up The Hobbit by ISBN-10', isbn: '0261103458' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        key: { type: 'string', description: 'Edition key e.g. /books/OL7353617M' },
                        title: { type: 'string' },
                        authors: { type: 'array', items: { type: 'object' } },
                        publishers: { type: 'array', items: { type: 'string' } },
                        publish_date: { type: 'string' },
                        number_of_pages: { type: 'number' },
                        isbn_10: { type: 'array', items: { type: 'string' } },
                        isbn_13: { type: 'array', items: { type: 'string' } },
                        covers: { type: 'array', items: { type: 'number' } },
                        works: { type: 'array', items: { type: 'object' } }
                    }
                }
            }
        },
        getAuthorByKey: {
            method: 'GET',
            path: '/authors/:authorId.json',
            description: 'Retrieve an author record by their Open Library author ID. Returns name, bio, birth/death dates, and links.',
            parameters: [
                { position: { key: 'authorId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get J.R.R. Tolkien author record', authorId: 'OL26320A' },
                { _description: 'Get George Orwell author record', authorId: 'OL18933A' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        key: { type: 'string', description: 'Author key e.g. /authors/OL26320A' },
                        name: { type: 'string' },
                        personal_name: { type: 'string' },
                        birth_date: { type: 'string' },
                        death_date: { type: 'string' },
                        bio: { type: 'object', description: 'Biography (string or {type, value} object)' },
                        photos: { type: 'array', items: { type: 'number' }, description: 'Photo IDs for Covers API' },
                        wikipedia: { type: 'string' },
                        links: { type: 'array' }
                    }
                }
            }
        },
        searchAuthors: {
            method: 'GET',
            path: '/search/authors.json',
            description: 'Search for authors by name. Returns author records with work count and top subjects.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(100)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] } }
            ],
            tests: [
                { _description: 'Search for authors named Tolkien', q: 'Tolkien', limit: 5 },
                { _description: 'Search for authors named Mark Twain', q: 'Mark Twain', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        start: { type: 'number' },
                        num_found: { type: 'number' },
                        docs: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    key: { type: 'string', description: 'Author key e.g. OL26320A' },
                                    name: { type: 'string' },
                                    alternate_names: { type: 'array', items: { type: 'string' } },
                                    birth_date: { type: 'string' },
                                    death_date: { type: 'string' },
                                    top_subjects: { type: 'array', items: { type: 'string' } },
                                    work_count: { type: 'number' }
                                }
                            }
                        }
                    }
                }
            }
        },
        getSubjectBooks: {
            method: 'GET',
            path: '/subjects/:subject.json',
            description: 'Retrieve works by subject. Returns a list of books matching the subject with optional ebook filtering.',
            parameters: [
                { position: { key: 'subject', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'ebooks', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(true,false)', options: ['optional()', 'default(false)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(12)', 'min(1)', 'max(50)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] } }
            ],
            tests: [
                { _description: 'Get books about science fiction subject', subject: 'science_fiction', limit: 10 },
                { _description: 'Get ebooks about philosophy', subject: 'philosophy', ebooks: 'true', limit: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        key: { type: 'string', description: 'Subject key e.g. /subjects/science_fiction' },
                        name: { type: 'string', description: 'Subject display name' },
                        subject_type: { type: 'string' },
                        work_count: { type: 'number' },
                        works: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    key: { type: 'string' },
                                    title: { type: 'string' },
                                    edition_count: { type: 'number' },
                                    cover_id: { type: 'number' },
                                    authors: { type: 'array' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
