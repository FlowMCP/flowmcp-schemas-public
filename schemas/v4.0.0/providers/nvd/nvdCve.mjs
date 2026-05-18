export const main = {
    namespace: 'nvd',
    name: 'NvdCve',
    description: 'Query the NIST National Vulnerability Database (NVD) for CVE records, severity scores, affected products, and vulnerability change history.',
    version: '4.0.0',
    docs: ['https://nvd.nist.gov/developers/vulnerabilities'],
    tags: ['security', 'vulnerability', 'cve', 'cpe', 'cacheTtlDaily'],
    root: 'https://services.nvd.nist.gov',
    requiredServerParams: [],
    headers: {},
    tools: {
        getCveById: {
            method: 'GET',
            path: '/rest/json/cves/2.0',
            description: 'Retrieve a single CVE record by its identifier. Returns full vulnerability details including CVSS scores, description, and affected products.',
            parameters: [
                { position: { key: 'cveId', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get CVE-2021-44228 (Log4Shell)', cveId: 'CVE-2021-44228' },
                { _description: 'Get CVE-2014-0160 (Heartbleed)', cveId: 'CVE-2014-0160' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        resultsPerPage: { type: 'number', description: 'Number of results returned' },
                        startIndex: { type: 'number', description: 'Pagination offset' },
                        totalResults: { type: 'number', description: 'Total matching records' },
                        timestamp: { type: 'string', description: 'Response generation time' },
                        vulnerabilities: {
                            type: 'array',
                            description: 'Array of CVE objects',
                            items: {
                                type: 'object',
                                properties: {
                                    cve: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'string', description: 'CVE identifier' },
                                            sourceIdentifier: { type: 'string', description: 'Source of the CVE' },
                                            published: { type: 'string', description: 'Publication date (ISO-8601)' },
                                            lastModified: { type: 'string', description: 'Last modification date' },
                                            vulnStatus: { type: 'string', description: 'Vulnerability status' },
                                            descriptions: { type: 'array', description: 'CVE descriptions in multiple languages' },
                                            metrics: { type: 'object', description: 'CVSS score metrics' },
                                            weaknesses: { type: 'array', description: 'CWE weakness classifications' },
                                            configurations: { type: 'array', description: 'Affected product configurations (CPE)' },
                                            references: { type: 'array', description: 'External reference links' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        searchCvesBySeverity: {
            method: 'GET',
            path: '/rest/json/cves/2.0',
            description: 'Search CVEs filtered by CVSS v3 severity level. Returns paginated vulnerability records. Use CVE IDs from results in getCveById for full details or getCveChangeHistory for modification tracking.',
            parameters: [
                { position: { key: 'cvssV3Severity', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(LOW,MEDIUM,HIGH,CRITICAL)', options: [] } },
                { position: { key: 'resultsPerPage', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(2000)'] } },
                { position: { key: 'startIndex', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] } }
            ],
            tests: [
                { _description: 'Search for CRITICAL severity CVEs (first 10)', cvssV3Severity: 'CRITICAL', resultsPerPage: 10 },
                { _description: 'Search for HIGH severity CVEs', cvssV3Severity: 'HIGH', resultsPerPage: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        resultsPerPage: { type: 'number' },
                        startIndex: { type: 'number' },
                        totalResults: { type: 'number' },
                        vulnerabilities: { type: 'array', items: { type: 'object' } }
                    }
                }
            }
        },
        searchCvesByKeyword: {
            method: 'GET',
            path: '/rest/json/cves/2.0',
            description: 'Search CVEs by keyword in their description text. Supports exact phrase matching when keywordExactMatch is included. Use getCveById with results for full CVSS scores and affected products.',
            parameters: [
                { position: { key: 'keywordSearch', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'keywordExactMatch', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'resultsPerPage', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(2000)'] } },
                { position: { key: 'startIndex', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] } }
            ],
            tests: [
                { _description: 'Search CVEs mentioning remote code execution', keywordSearch: 'remote code execution', resultsPerPage: 10 },
                { _description: 'Search CVEs for Apache Log4j', keywordSearch: 'Apache Log4j', resultsPerPage: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        resultsPerPage: { type: 'number' },
                        startIndex: { type: 'number' },
                        totalResults: { type: 'number' },
                        vulnerabilities: { type: 'array', items: { type: 'object' } }
                    }
                }
            }
        },
        searchCvesByDateRange: {
            method: 'GET',
            path: '/rest/json/cves/2.0',
            description: 'Search CVEs published within a specific date range. Dates must be in ISO-8601 format (e.g. 2024-01-01T00:00:00.000).',
            parameters: [
                { position: { key: 'pubStartDate', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'pubEndDate', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'resultsPerPage', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(2000)'] } },
                { position: { key: 'startIndex', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] } }
            ],
            tests: [
                { _description: 'Get CVEs published in January 2024', pubStartDate: '2024-01-01T00:00:00.000', pubEndDate: '2024-01-31T23:59:59.000', resultsPerPage: 10 },
                { _description: 'Get CVEs published in first week of 2025', pubStartDate: '2025-01-01T00:00:00.000', pubEndDate: '2025-01-07T23:59:59.000', resultsPerPage: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        resultsPerPage: { type: 'number' },
                        startIndex: { type: 'number' },
                        totalResults: { type: 'number' },
                        vulnerabilities: { type: 'array', items: { type: 'object' } }
                    }
                }
            }
        },
        searchCvesByCwe: {
            method: 'GET',
            path: '/rest/json/cves/2.0',
            description: 'Search CVEs by CWE (Common Weakness Enumeration) identifier. Returns vulnerabilities classified under the specified weakness type.',
            parameters: [
                { position: { key: 'cweId', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'resultsPerPage', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(2000)'] } },
                { position: { key: 'startIndex', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)', 'min(0)'] } }
            ],
            tests: [
                { _description: 'Search CVEs for CWE-79 (Cross-site Scripting)', cweId: 'CWE-79', resultsPerPage: 10 },
                { _description: 'Search CVEs for CWE-89 (SQL Injection)', cweId: 'CWE-89', resultsPerPage: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        resultsPerPage: { type: 'number' },
                        startIndex: { type: 'number' },
                        totalResults: { type: 'number' },
                        vulnerabilities: { type: 'array', items: { type: 'object' } }
                    }
                }
            }
        },
        getCveChangeHistory: {
            method: 'GET',
            path: '/rest/json/cvehistory/2.0',
            description: 'Retrieve change history for a specific CVE. Shows when and why a vulnerability record was modified in the NVD.',
            parameters: [
                { position: { key: 'cveId', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'resultsPerPage', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(5000)'] } }
            ],
            tests: [
                { _description: 'Get change history for Log4Shell', cveId: 'CVE-2021-44228' },
                { _description: 'Get change history for Heartbleed', cveId: 'CVE-2014-0160' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        resultsPerPage: { type: 'number' },
                        startIndex: { type: 'number' },
                        totalResults: { type: 'number' },
                        timestamp: { type: 'string' },
                        cveChanges: {
                            type: 'array',
                            description: 'Array of change records',
                            items: {
                                type: 'object',
                                properties: {
                                    change: {
                                        type: 'object',
                                        properties: {
                                            cveId: { type: 'string' },
                                            eventName: { type: 'string', description: 'Type of change event' },
                                            cveChangeId: { type: 'string' },
                                            sourceIdentifier: { type: 'string' },
                                            created: { type: 'string' },
                                            details: { type: 'array', description: 'List of specific changes' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        searchRecentlyModifiedCves: {
            method: 'GET',
            path: '/rest/json/cves/2.0',
            description: 'Search CVEs that were last modified within a specific date range. Useful for tracking vulnerability database updates.',
            parameters: [
                { position: { key: 'lastModStartDate', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'lastModEndDate', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'resultsPerPage', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(2000)'] } }
            ],
            tests: [
                { _description: 'Get CVEs modified in the last week of Jan 2025', lastModStartDate: '2025-01-24T00:00:00.000', lastModEndDate: '2025-01-31T23:59:59.000', resultsPerPage: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        resultsPerPage: { type: 'number' },
                        startIndex: { type: 'number' },
                        totalResults: { type: 'number' },
                        vulnerabilities: { type: 'array', items: { type: 'object' } }
                    }
                }
            }
        }
    }
}
