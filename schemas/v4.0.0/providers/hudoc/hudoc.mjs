export const main = {
    namespace: 'hudoc',
    name: 'HUDOC ECHR',
    description: 'Search 90K+ European Court of Human Rights case law documents including judgments, decisions, and communications since 1959 via the HUDOC search API.',
    version: '4.0.0',
    docs: ['https://hudoc.echr.coe.int/', 'https://www.echr.coe.int/documents/d/echr/HUDOC_Manual_ENG'],
    tags: ['legal', 'humanrights', 'europe', 'courts', 'cacheTtlDaily'],
    root: 'https://hudoc.echr.coe.int',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchCases: {
            method: 'GET',
            path: '/app/query/results',
            description: 'Search ECHR case law using HUDOC query syntax. Supports filtering by respondent state (respondent:DEU), article (article:6), document type (doctype:HEJUD for judgments, HEDEC for decisions, HECOM for communicated cases), language (languageisocode:"ENG"), and originating body (originatingbody:1 for Grand Chamber). Use searchJudgments, searchDecisions, searchCommunicatedCases, or searchGrandChamber for pre-filtered queries.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'HUDOC query string using Lucene-style syntax (e.g. contentsitename:ECHR AND respondent:DEU)' },
                { position: { key: 'select', value: 'itemid,docname,doctype,appno,conclusion,importance,originatingbody,typedescription,kpdate,respondent,ecli,article', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Comma-separated list of metadata fields to return in results' },
                { position: { key: 'sort', value: 'kpdate Descending', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Sort field and direction (e.g. kpdate Descending for newest first)' },
                { position: { key: 'start', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['default(0)'] }, description: 'Zero-based offset for pagination' },
                { position: { key: 'length', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['default(20)', 'max(500)'] }, description: 'Number of results to return per page (max 500)' }
            ],
            tests: [
                { _description: 'Search all English ECHR case law (most recent)', query: 'contentsitename:ECHR AND (NOT (doctype:PR OR doctype:HFCOMOLD OR doctype:HECOMOLD)) AND ((languageisocode:"ENG"))', start: 0, length: 5 },
                { _description: 'Search cases against Germany', query: 'contentsitename:ECHR AND respondent:DEU', start: 0, length: 5 },
                { _description: 'Search cases citing Article 3 (prohibition of torture)', query: 'contentsitename:ECHR AND article:3', start: 0, length: 5 },
                { _description: 'Search Grand Chamber judgments', query: 'contentsitename:ECHR AND doctype:HEJUD AND originatingbody:1 AND ((languageisocode:"ENG"))', start: 0, length: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'HUDOC search result containing total count and paginated case law documents',
                    properties: {
                        resultcount: { type: 'number', description: 'Total number of documents matching the query' },
                        results: { type: 'array', description: 'Array of case law documents with selected metadata columns', items: { type: 'object', properties: { columns: { type: 'object', description: 'Key-value map of requested metadata fields (itemid, docname, appno, conclusion, etc.)' } } } }
                    }
                }
            },
        },
        searchJudgments: {
            method: 'GET',
            path: '/app/query/results',
            description: 'Search specifically for ECHR judgments in English (doctype:HEJUD). Returns only final court judgments with metadata including separate opinion indicators. Use searchCases for custom query syntax or searchGrandChamber for highest-importance rulings.',
            parameters: [
                { position: { key: 'query', value: 'contentsitename:ECHR AND doctype:HEJUD AND ((languageisocode:"ENG"))', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Pre-built query filtering for English ECHR judgments' },
                { position: { key: 'select', value: 'itemid,docname,appno,conclusion,importance,originatingbody,kpdate,respondent,ecli,article,separateopinion', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Comma-separated list of metadata fields including separateopinion indicator' },
                { position: { key: 'sort', value: 'kpdate Descending', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Sort field and direction (newest first by default)' },
                { position: { key: 'start', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['default(0)'] }, description: 'Zero-based offset for pagination' },
                { position: { key: 'length', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['default(20)', 'max(500)'] }, description: 'Number of results to return per page (max 500)' }
            ],
            tests: [
                { _description: 'Get most recent English judgments', start: 0, length: 5 },
                { _description: 'Get judgments page 2', start: 20, length: 5 },
                { _description: 'Get judgments page 3', start: 40, length: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'HUDOC search result containing ECHR judgments with separate opinion indicators',
                    properties: {
                        resultcount: { type: 'number', description: 'Total number of judgments matching the query' },
                        results: { type: 'array', description: 'Array of judgment documents with metadata columns', items: { type: 'object', properties: { columns: { type: 'object', description: 'Key-value map of judgment metadata (itemid, appno, conclusion, separateopinion, etc.)' } } } }
                    }
                }
            },
        },
        searchDecisions: {
            method: 'GET',
            path: '/app/query/results',
            description: 'Search ECHR admissibility decisions in English (doctype:HEDEC). These determine whether cases are admissible before the Court. Use searchCases for custom queries or searchJudgments for final rulings.',
            parameters: [
                { position: { key: 'query', value: 'contentsitename:ECHR AND doctype:HEDEC AND ((languageisocode:"ENG"))', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Pre-built query filtering for English ECHR admissibility decisions' },
                { position: { key: 'select', value: 'itemid,docname,appno,conclusion,importance,kpdate,respondent,ecli,article', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Comma-separated list of metadata fields to return' },
                { position: { key: 'sort', value: 'kpdate Descending', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Sort field and direction (newest first by default)' },
                { position: { key: 'start', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['default(0)'] }, description: 'Zero-based offset for pagination' },
                { position: { key: 'length', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['default(20)', 'max(500)'] }, description: 'Number of results to return per page (max 500)' }
            ],
            tests: [
                { _description: 'Get most recent admissibility decisions', start: 0, length: 5 },
                { _description: 'Get admissibility decisions page 2', start: 20, length: 5 },
                { _description: 'Get admissibility decisions page 3', start: 40, length: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'HUDOC search result containing ECHR admissibility decisions',
                    properties: {
                        resultcount: { type: 'number', description: 'Total number of admissibility decisions matching the query' },
                        results: { type: 'array', description: 'Array of admissibility decision documents with metadata columns', items: { type: 'object', properties: { columns: { type: 'object', description: 'Key-value map of decision metadata (itemid, appno, conclusion, respondent, etc.)' } } } }
                    }
                }
            },
        },
        searchCommunicatedCases: {
            method: 'GET',
            path: '/app/query/results',
            description: 'Search communicated cases in English (doctype:HECOM). These are pending cases where the Court has asked the respondent government to submit observations. Use searchCases for custom queries or searchJudgments for decided cases.',
            parameters: [
                { position: { key: 'query', value: 'contentsitename:ECHR AND doctype:HECOM AND ((languageisocode:"ENG"))', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Pre-built query filtering for English communicated cases' },
                { position: { key: 'select', value: 'itemid,docname,appno,importance,kpdate,respondent,article', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Comma-separated list of metadata fields to return' },
                { position: { key: 'sort', value: 'kpdate Descending', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Sort field and direction (newest first by default)' },
                { position: { key: 'start', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['default(0)'] }, description: 'Zero-based offset for pagination' },
                { position: { key: 'length', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['default(20)', 'max(500)'] }, description: 'Number of results to return per page (max 500)' }
            ],
            tests: [
                { _description: 'Get most recent communicated cases', start: 0, length: 5 },
                { _description: 'Get communicated cases page 2', start: 20, length: 5 },
                { _description: 'Get communicated cases page 3', start: 40, length: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'HUDOC search result containing communicated cases pending government response',
                    properties: {
                        resultcount: { type: 'number', description: 'Total number of communicated cases matching the query' },
                        results: { type: 'array', description: 'Array of communicated case documents with metadata columns', items: { type: 'object', properties: { columns: { type: 'object', description: 'Key-value map of case metadata (itemid, appno, respondent, article, etc.)' } } } }
                    }
                }
            },
        },
        searchGrandChamber: {
            method: 'GET',
            path: '/app/query/results',
            description: 'Search Grand Chamber judgments in English - the highest importance ECHR decisions. These are landmark cases with major legal significance decided by the full court. Use searchJudgments for all judgments or searchCases for custom queries.',
            parameters: [
                { position: { key: 'query', value: 'contentsitename:ECHR AND doctype:HEJUD AND originatingbody:1 AND ((languageisocode:"ENG"))', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Pre-built query filtering for English Grand Chamber judgments' },
                { position: { key: 'select', value: 'itemid,docname,appno,conclusion,importance,kpdate,respondent,ecli,article', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Comma-separated list of metadata fields to return' },
                { position: { key: 'sort', value: 'kpdate Descending', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Sort field and direction (newest first by default)' },
                { position: { key: 'start', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['default(0)'] }, description: 'Zero-based offset for pagination' },
                { position: { key: 'length', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['default(20)', 'max(500)'] }, description: 'Number of results to return per page (max 500)' }
            ],
            tests: [
                { _description: 'Get most recent Grand Chamber judgments', start: 0, length: 5 },
                { _description: 'Get Grand Chamber judgments page 2', start: 20, length: 5 },
                { _description: 'Get Grand Chamber judgments page 3', start: 40, length: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'HUDOC search result containing landmark Grand Chamber judgments',
                    properties: {
                        resultcount: { type: 'number', description: 'Total number of Grand Chamber judgments matching the query' },
                        results: { type: 'array', description: 'Array of Grand Chamber judgment documents with metadata columns', items: { type: 'object', properties: { columns: { type: 'object', description: 'Key-value map of judgment metadata (itemid, appno, conclusion, importance, ecli, etc.)' } } } }
                    }
                }
            },
        }
    }
}
