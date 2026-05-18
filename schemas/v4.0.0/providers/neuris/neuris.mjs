export const main = {
    namespace: 'neuris',
    name: 'NeuRIS Federal Legal Information',
    description: 'German federal legal information system (Rechtsinformationsportal des Bundes) providing access to legislation, case law, and legal documents via JSON REST API. Operated by the Federal Ministry of Justice.',
    version: '4.0.0',
    docs: ['https://docs.rechtsinformationen.bund.de/'],
    tags: ['law', 'germany', 'legislation', 'courtdecisions', 'opendata', 'cacheTtlDaily'],
    root: 'https://testphase.rechtsinformationen.bund.de/v1',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchDocuments: {
            method: 'GET',
            path: '/document',
            description: 'Global full-text search across all document types (legislation, case law, literature, administrative directives). Returns paginated Hydra Collection with text match highlights. Use documentKind filter to narrow results. For complex queries, use luceneSearch instead.',
            parameters: [
                { position: { key: 'searchTerm', value: '{{SEARCH_TERM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'documentKind', value: '{{DOCUMENT_KIND}}', location: 'query' }, z: { primitive: 'enum(legislation,case-law,literature,administrative-directive)', options: ['optional()'] } },
                { position: { key: 'dateFrom', value: '{{DATE_FROM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'dateTo', value: '{{DATE_TO}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'size', value: '{{SIZE}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(100)'] } },
                { position: { key: 'pageIndex', value: '{{PAGE_INDEX}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } }
            ],
            tests: [
                { _description: 'Search all documents for Datenschutz', SEARCH_TERM: 'Datenschutz', SIZE: '5' },
                { _description: 'Search legislation only', SEARCH_TERM: 'Grundgesetz', DOCUMENT_KIND: 'legislation', SIZE: '5' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated Hydra Collection of matching documents',
                    properties: {
                        member: { type: 'array', description: 'Array of matching document objects with metadata and text highlights', items: { type: 'object' } },
                        totalMembers: { type: 'number', description: 'Total number of documents matching the search criteria' }
                    }
                }
            }
        },
        searchLegislation: {
            method: 'GET',
            path: '/legislation',
            description: 'Search German federal legislation (Gesetze und Verordnungen). Filter by ELI identifier, temporal coverage, date range, or full-text search term. Use searchDocuments for cross-type search or luceneSearch for complex boolean queries.',
            parameters: [
                { position: { key: 'searchTerm', value: '{{SEARCH_TERM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'eli', value: '{{ELI}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'dateFrom', value: '{{DATE_FROM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'dateTo', value: '{{DATE_TO}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'size', value: '{{SIZE}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(100)'] } },
                { position: { key: 'pageIndex', value: '{{PAGE_INDEX}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } }
            ],
            tests: [
                { _description: 'Search legislation for Grundgesetz', SEARCH_TERM: 'Grundgesetz', SIZE: '3' },
                { _description: 'Search legislation by date range', DATE_FROM: '2024-01-01', DATE_TO: '2024-12-31', SIZE: '3' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated Hydra Collection of matching legislation documents',
                    properties: {
                        member: { type: 'array', description: 'Array of matching legislation records with ELI identifiers and metadata', items: { type: 'object' } },
                        totalMembers: { type: 'number', description: 'Total number of legislation documents matching the search criteria' }
                    }
                }
            }
        },
        searchCaseLaw: {
            method: 'GET',
            path: '/case-law',
            description: 'Search German federal court decisions (Rechtsprechung). Filter by file number, ECLI, court, legal effect, decision type, or full-text search. Use listCourts to get valid court identifiers. Use getCaseLawDecision with document number for full text.',
            parameters: [
                { position: { key: 'searchTerm', value: '{{SEARCH_TERM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'court', value: '{{COURT}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'fileNumber', value: '{{FILE_NUMBER}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'ecli', value: '{{ECLI}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'dateFrom', value: '{{DATE_FROM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'dateTo', value: '{{DATE_TO}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'size', value: '{{SIZE}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(100)'] } },
                { position: { key: 'pageIndex', value: '{{PAGE_INDEX}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } }
            ],
            tests: [
                { _description: 'Search case law for Datenschutz', SEARCH_TERM: 'Datenschutz', SIZE: '3' },
                { _description: 'Search BGH decisions', COURT: 'BGH', SIZE: '3' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated Hydra Collection of matching court decisions',
                    properties: {
                        member: { type: 'array', description: 'Array of matching court decision records with ECLI, file number, and metadata', items: { type: 'object' } },
                        totalMembers: { type: 'number', description: 'Total number of case law documents matching the search criteria' }
                    }
                }
            }
        },
        getCaseLawDecision: {
            method: 'GET',
            path: '/case-law/:documentNumber',
            description: 'Get full metadata and text of a single court decision by document number. Returns case facts, decision grounds, guiding principle, and tenor. Use document numbers from searchCaseLaw results.',
            parameters: [
                { position: { key: 'documentNumber', value: '{{DOCUMENT_NUMBER}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get BAG decision on data protection', DOCUMENT_NUMBER: 'KARE600069049' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Full court decision document with metadata and text content',
                    properties: {
                        documentNumber: { type: 'string', description: 'Unique NeuRIS document identifier' },
                        court: { type: 'string', description: 'Court abbreviation (e.g. BGH, BVerfG, BAG)' },
                        decisionDate: { type: 'string', description: 'Date of the court decision in ISO format' },
                        fileNumber: { type: 'string', description: 'Court file reference number (Aktenzeichen)' },
                        ecli: { type: 'string', description: 'European Case Law Identifier for cross-border referencing' }
                    }
                }
            }
        },
        listCourts: {
            method: 'GET',
            path: '/case-law/courts',
            description: 'List all available German federal courts with case counts. Optionally filter by court type prefix (e.g. BV for BVerfG and BVerwG). Use returned court names as filter in searchCaseLaw.',
            parameters: [
                { position: { key: 'prefix', value: '{{PREFIX}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'List all courts', PREFIX: 'BV' },
                { _description: 'List courts starting with BV', PREFIX: 'BV' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'List of available courts with their decision counts',
                    items: {
                        type: 'object',
                        properties: {
                            court: { type: 'string', description: 'Court abbreviation (e.g. BGH, BVerfG, BVerwG, BAG)' },
                            count: { type: 'number', description: 'Number of published decisions from this court' }
                        }
                    }
                }
            }
        },
        luceneSearch: {
            method: 'GET',
            path: '/document/lucene-search',
            description: 'Advanced Lucene query search across all document types. Supports AND, OR, NOT operators for complex search expressions. More powerful than searchDocuments for boolean combinations and field-specific queries.',
            parameters: [
                { position: { key: 'query', value: '{{QUERY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'size', value: '{{SIZE}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(100)'] } },
                { position: { key: 'pageIndex', value: '{{PAGE_INDEX}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } }
            ],
            tests: [
                { _description: 'Lucene search for Grundgesetz', QUERY: 'Grundgesetz', SIZE: '3' },
                { _description: 'Lucene search for DSGVO and Schadenersatz', QUERY: 'DSGVO AND Schadenersatz', SIZE: '3' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated Hydra Collection from Lucene query results',
                    properties: {
                        member: { type: 'array', description: 'Array of matching document objects across all document types', items: { type: 'object' } },
                        totalMembers: { type: 'number', description: 'Total number of documents matching the Lucene query' }
                    }
                }
            }
        },
        getStatistics: {
            method: 'GET',
            path: '/statistics',
            description: 'Get statistics about the total number of documents available, broken down by type (legislation, case-law, literature, administrative-directive). Useful for understanding the scope of the database.',
            parameters: [],
            tests: [
                { _description: 'Get document statistics' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Database statistics with document counts per type',
                    properties: {
                        totalDocuments: { type: 'number', description: 'Total number of documents across all types' },
                        byType: { type: 'object', description: 'Document counts broken down by type (legislation, case-law, literature, administrative-directive)' }
                    }
                }
            }
        }
    }
}
