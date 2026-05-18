export const main = {
    namespace: 'wipoipc',
    name: 'WIPO IPC',
    description: 'Check validity of International Patent Classification (IPC) symbols and retrieve classification details via the WIPO IPCPUB API. Returns section, class, subclass, main group, subgroup, version indicator, and validity status.',
    version: '4.0.0',
    docs: [
        'https://www.wipo.int/classifications/ipc/en/',
        'https://www.wipo.int/ipc/itos4ipc/ITSupport_and_download_area/Documentation/IPC_Internet_URL_Web_Services_specification/'
    ],
    tags: ['patents', 'intellectualproperty', 'classification', 'government', 'international', 'cacheTtlStatic'],
    root: 'https://ipcpub.wipo.int',
    requiredServerParams: [],
    headers: {},
    tools: {
        checkSymbolValidity: {
            method: 'GET',
            path: '/api/v1/scheme/getSymbolValidity',
            description: 'Check validity of an IPC symbol. Returns parsed symbol components (section, class, subclass, main group, subgroup), the IPC version in which the symbol was last revised, its category (K=Keyword, I=Indexing, D=Deleted), and whether it is valid (V) or not valid (N) for the specified IPC version.',
            parameters: [
                { position: { key: 'symbol', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'version', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(latest)'] } }
            ],
            tests: [
                { _description: 'Check validity of A01N 65/03 (biocides from plants)', symbol: 'A01N0065030000', version: 'latest' },
                { _description: 'Check validity of G06F 40/40 (NLP text processing)', symbol: 'G06F0040400000', version: 'latest' },
                { _description: 'Check class-level symbol A01B', symbol: 'A01B', version: 'latest' },
                { _description: 'Check symbol in specific IPC version 2020.01', symbol: 'A01B0001000000', version: '20200101' },
                { _description: 'Check invalid symbol returns N validity', symbol: 'Z99Z9999999999', version: 'latest' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        symbol: { type: 'string' },
                        section: { type: 'string' },
                        ipcClass: { type: 'string' },
                        subclass: { type: 'string' },
                        mainGroup: { type: 'string' },
                        subGroup: { type: 'string' },
                        versionIndicator: { type: 'string' },
                        validity: { type: 'string' },
                        category: { type: 'string' }
                    }
                }
            },
        }
    }
}
