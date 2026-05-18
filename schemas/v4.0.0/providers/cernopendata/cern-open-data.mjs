export const main = {
    namespace: 'cernopendata',
    name: 'CERN Open Data Portal',
    description: 'Access the CERN Open Data Portal for particle physics datasets, software, and documentation. Search 50,000+ records from LHC experiments (ATLAS, CMS, LHCb, ALICE), including collision data, simulated data, analysis tools, and educational resources. Data covers the Higgs boson discovery and beyond. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://opendata.cern.ch/docs/about'],
    tags: ['science', 'physics', 'opendata', 'research', 'cacheTtlDaily'],
    root: 'https://opendata.cern.ch',
    requiredServerParams: [],
    headers: {
        'Accept': 'application/json'
    },
    tools: {
        searchRecords: {
            method: 'GET',
            path: '/api/records/',
            description: 'Search CERN Open Data records. Query particle physics datasets, software, documentation, and educational materials. Filter by experiment (CMS, ATLAS, LHCb, ALICE, OPERA), type (Dataset, Software, Documentation, Environment), and keywords. Returns metadata including title, abstract, authors, experiment, date, and file information.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default()'] }, description: 'Free-text search query across record titles, abstracts, and metadata' },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'max(100)'] }, description: 'Number of results per page (max 100, default 10)' },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)'] }, description: 'Page number for pagination, starting at 1' },
                { position: { key: 'type', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(Dataset,Software,Documentation,Environment)', options: ['optional()'] }, description: 'Record type filter: Dataset, Software, Documentation, or Environment' },
                { position: { key: 'experiment', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(CMS,ATLAS,LHCb,ALICE,OPERA,PHENIX)', options: ['optional()'] }, description: 'LHC experiment filter: CMS, ATLAS, LHCb, ALICE, OPERA, or PHENIX' }
            ],
            tests: [
                { _description: 'Search for Higgs datasets', q: 'Higgs', size: 3 },
                { _description: 'CMS datasets', experiment: 'CMS', type: 'Dataset', size: 3 },
                { _description: 'ATLAS software records', experiment: 'ATLAS', type: 'Software', size: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        hits: {
                            type: 'object',
                            description: 'Search results container',
                            properties: {
                                total: { type: 'number', description: 'Total number of matching records across all pages' },
                                hits: { type: 'array', description: 'Array of matching records for this page', items: { type: 'object', properties: { id: { type: 'number', description: 'Internal record ID' }, created: { type: 'string', description: 'ISO 8601 record creation date' }, updated: { type: 'string', description: 'ISO 8601 last update date' }, metadata: { type: 'object', description: 'Record metadata', properties: { title: { type: 'string', description: 'Record title' }, abstract: { type: 'object', description: 'Abstract/description text object' }, experiment: { type: 'array', description: 'List of experiments (e.g. CMS, ATLAS)' }, type: { type: 'object', description: 'Record type classification (Dataset, Software, etc.)' }, date_published: { type: 'string', description: 'Publication date' }, keywords: { type: 'array', description: 'Subject keywords' }, recid: { type: 'number', description: 'Public-facing record ID usable with getRecord' } } } } } }
                            }
                        },
                        links: { type: 'object', description: 'Pagination links (self, next, prev)' }
                    }
                }
            }
        },
        getRecord: {
            method: 'GET',
            path: '/api/records/:recid',
            description: 'Get a specific CERN Open Data record by its record ID. Returns full metadata including title, abstract, authors, experiment, files, methodology, and usage instructions.',
            parameters: [
                { position: { key: 'recid', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] }, description: 'CERN Open Data record ID number, e.g. 5500 for Higgs to four leptons' }
            ],
            tests: [
                { _description: 'Get Higgs to four leptons example', recid: 5500 },
                { _description: 'Get CMS primary dataset', recid: 6021 },
                { _description: 'Get ATLAS open data record', recid: 15005 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', description: 'Internal record ID' },
                        created: { type: 'string', description: 'ISO 8601 record creation date' },
                        updated: { type: 'string', description: 'ISO 8601 last update date' },
                        metadata: {
                            type: 'object',
                            description: 'Full record metadata',
                            properties: {
                                title: { type: 'string', description: 'Record title' },
                                abstract: { type: 'object', description: 'Abstract/description with text content' },
                                experiment: { type: 'array', description: 'Experiments that produced this data (e.g. CMS, ATLAS)' },
                                type: { type: 'object', description: 'Record type classification' },
                                date_published: { type: 'string', description: 'Publication date' },
                                authors: { type: 'array', description: 'List of author names and affiliations' },
                                files: { type: 'array', description: 'Downloadable data files with URIs and sizes' },
                                methodology: { type: 'object', description: 'Data collection and processing methodology' },
                                usage: { type: 'object', description: 'Usage instructions and examples' },
                                license: { type: 'object', description: 'Data license information (typically CC0 or CC-BY)' }
                            }
                        }
                    }
                }
            }
        }
    }
}
