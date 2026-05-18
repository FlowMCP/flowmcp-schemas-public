export const main = {
    namespace: 'uniprot',
    name: 'UniProt',
    description: 'Query the Universal Protein Resource (UniProt) for protein sequences, functions, classifications, and cross-references. Covers 250M+ protein entries across all organisms.',
    version: '4.0.0',
    docs: ['https://www.uniprot.org/help/api', 'https://www.uniprot.org/help/query-fields'],
    tags: ['science', 'biology', 'proteins', 'genomics', 'bioinformatics', 'cacheTtlDaily'],
    root: 'https://rest.uniprot.org',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchProteins: {
            method: 'GET',
            path: '/uniprotkb/search',
            description: 'Search UniProtKB for protein entries using structured queries with logical operators. Supports field-specific searches (gene, organism, function, etc.) and pagination via cursor.. Use IDs from results in getProteinEntry',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(json,tsv,fasta,xml,list)', options: ['optional()', 'default(json)'] } },
                { position: { key: 'fields', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(25)', 'min(1)', 'max(500)'] } },
                { position: { key: 'cursor', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Search for human insulin proteins', query: 'insulin AND organism_id:9606', format: 'json', size: 5 },
                { _description: 'Search for p53 tumor suppressor', query: 'gene:TP53 AND reviewed:true', format: 'json', size: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        results: { type: 'array', items: { type: 'object', properties: { primaryAccession: { type: 'string' }, uniProtkbId: { type: 'string' }, organism: { type: 'object' }, proteinDescription: { type: 'object' }, genes: { type: 'array' }, sequence: { type: 'object' } } } }
                    }
                }
            },
        },
        getProteinEntry: {
            method: 'GET',
            path: '/uniprotkb/:accession',
            description: 'Retrieve a single protein entry by its UniProtKB accession number. Returns full annotation including function, structure, interactions, subcellular location, and disease associations.. Use searchProteins first to find valid IDs',
            parameters: [
                { position: { key: 'accession', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(json,tsv,fasta,xml)', options: ['optional()', 'default(json)'] } }
            ],
            tests: [
                { _description: 'Get human insulin entry', accession: 'P01308', format: 'json' },
                { _description: 'Get human p53 entry', accession: 'P04637', format: 'json' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        primaryAccession: { type: 'string' },
                        uniProtkbId: { type: 'string' },
                        entryType: { type: 'string' },
                        organism: { type: 'object' },
                        proteinDescription: { type: 'object' },
                        genes: { type: 'array' },
                        comments: { type: 'array' },
                        features: { type: 'array' },
                        references: { type: 'array' },
                        sequence: { type: 'object' }
                    }
                }
            },
        },
        searchUniref: {
            method: 'GET',
            path: '/uniref/search',
            description: 'Search UniRef protein cluster databases (UniRef100, UniRef90, UniRef50) for sequence similarity clusters. Reduces redundancy in protein sequence data.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(json,tsv,fasta,xml,list)', options: ['optional()', 'default(json)'] } },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(25)', 'min(1)', 'max(500)'] } },
                { position: { key: 'cursor', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Search UniRef90 for hemoglobin clusters', query: 'hemoglobin AND identity:0.9', format: 'json', size: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        results: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, memberCount: { type: 'number' }, representativeMember: { type: 'object' } } } }
                    }
                }
            },
        },
        searchUniparc: {
            method: 'GET',
            path: '/uniparc/search',
            description: 'Search the UniProt Archive (UniParc) for non-redundant protein sequences. UniParc stores all unique sequences from major protein databases.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(json,tsv,fasta,xml,list)', options: ['optional()', 'default(json)'] } },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(25)', 'min(1)', 'max(500)'] } },
                { position: { key: 'cursor', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Search UniParc for human sequences', query: 'taxonomy_id:9606', format: 'json', size: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        results: { type: 'array', items: { type: 'object', properties: { uniParcId: { type: 'string' }, sequence: { type: 'object' }, uniParcCrossReferences: { type: 'array' } } } }
                    }
                }
            },
        },
        searchProteomes: {
            method: 'GET',
            path: '/proteomes/search',
            description: 'Search for complete proteome sets by organism or keyword. Proteomes represent the full set of proteins expressed by an organism.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(json,tsv,xml,list)', options: ['optional()', 'default(json)'] } },
                { position: { key: 'size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(25)', 'min(1)', 'max(500)'] } },
                { position: { key: 'cursor', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Search for human reference proteome', query: 'organism_id:9606 AND proteome_type:1', format: 'json', size: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        results: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, taxonomy: { type: 'object' }, proteinCount: { type: 'number' }, description: { type: 'string' }, superkingdom: { type: 'string' } } } }
                    }
                }
            },
        }
    }
}
