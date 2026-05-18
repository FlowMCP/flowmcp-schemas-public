// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean
// Namespace: "mcpRegistry" -> "mcpregistry"

export const main = {
    namespace: 'mcpregistry',
    name: 'MCP Server Registry',
    description: 'Browse and search the official Model Context Protocol server registry to discover available MCP servers',
    version: '4.0.0',
    docs: ['https://registry.modelcontextprotocol.io/', 'https://modelcontextprotocol.io/'],
    tags: ['mcp', 'registry', 'ai', 'tools', 'cacheTtlDaily'],
    root: 'https://registry.modelcontextprotocol.io/v0',
    tools: {
        listServers: {
            method: 'GET',
            path: '/servers',
            description: 'List MCP servers from the official registry with cursor-based pagination. Use the nextCursor from the response to fetch the next page. searchServers uses the same endpoint but is intended for keyword-based browsing.',
            parameters: [
                { position: { key: 'count', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'default(30)', 'optional()'] } },
                { position: { key: 'cursor', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'List first 5 servers', count: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated list of MCP servers (transformed by postRequest handler into a flat structure)',
                    properties: {
                        source: { type: 'string', description: 'Data source identifier (MCP Server Registry)' },
                        serverCount: { type: 'number', description: 'Number of servers returned in this page' },
                        nextCursor: { type: 'string', description: 'Cursor token for fetching the next page, null if no more pages' },
                        servers: { type: 'array', description: 'MCP server entries', items: { type: 'object', properties: { name: { type: 'string', description: 'Server name/identifier' }, description: { type: 'string', description: 'What the server does' }, version: { type: 'string', description: 'Server version (semver)' }, repository: { type: 'string', description: 'Source code repository URL' }, packages: { type: 'array', description: 'Available installation packages (npm, pip, etc.)', items: { type: 'object', properties: { registryType: { type: 'string', description: 'Package registry (npm, pip, docker, etc.)' }, identifier: { type: 'string', description: 'Package identifier in the registry' }, transportType: { type: 'string', description: 'MCP transport type (stdio, sse, streamable-http)' } } } }, remotes: { type: 'array', description: 'Remote server endpoints', items: { type: 'object', properties: { type: { type: 'string', description: 'Remote type' }, url: { type: 'string', description: 'Remote endpoint URL' } } } }, status: { type: 'string', description: 'Registry status (e.g. active)' }, publishedAt: { type: 'string', description: 'ISO timestamp when published to registry' }, isLatest: { type: 'boolean', description: 'Whether this is the latest version' } } } }
                    }
                }
            },
        },
        searchServers: {
            method: 'GET',
            path: '/servers',
            description: 'Search MCP servers by name or keyword using the registry endpoint. Uses the same endpoint as listServers; both return the same paginated format.',
            parameters: [
                { position: { key: 'count', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'default(30)', 'optional()'] } },
                { position: { key: 'cursor', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'List servers for search', count: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated MCP server search results (transformed by postRequest handler)',
                    properties: {
                        source: { type: 'string', description: 'Data source identifier' },
                        serverCount: { type: 'number', description: 'Number of servers returned' },
                        nextCursor: { type: 'string', description: 'Cursor for next page, null if no more' },
                        servers: { type: 'array', description: 'Matching MCP server entries', items: { type: 'object', properties: { name: { type: 'string', description: 'Server name' }, description: { type: 'string', description: 'Server description' }, version: { type: 'string', description: 'Version (semver)' }, repository: { type: 'string', description: 'Source code URL' }, packages: { type: 'array', description: 'Installation packages', items: { type: 'object', properties: { registryType: { type: 'string', description: 'Package registry type' }, identifier: { type: 'string', description: 'Package identifier' }, transportType: { type: 'string', description: 'MCP transport type' } } } }, remotes: { type: 'array', description: 'Remote endpoints', items: { type: 'object', properties: { type: { type: 'string', description: 'Remote type' }, url: { type: 'string', description: 'Endpoint URL' } } } }, status: { type: 'string', description: 'Registry status' }, publishedAt: { type: 'string', description: 'Publication timestamp' }, isLatest: { type: 'boolean', description: 'Latest version flag' } } } }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    listServers: {
        postRequest: async ( { response, struct, payload } ) => {
            try {
            const raw = response
            if( !raw || !raw.servers ) {
            return { response }}

            const servers = raw.servers
            .map( ( entry ) => {
            const s = entry.server || {}
            const meta = entry._meta || {}
            const officialMeta = meta['io.modelcontextprotocol.registry/official'] || {}

            const packages = ( s.packages || [] )
            .map( ( pkg ) => {
            const result = {
            registryType: pkg.registryType,
            identifier: pkg.identifier,
            transportType: pkg.transport && pkg.transport.type
            }

            return result
            } )

            const remotes = ( s.remotes || [] )
            .map( ( remote ) => {
            const result = {
            type: remote.type,
            url: remote.url
            }

            return result
            } )

            const result = {
            name: s.name,
            description: s.description,
            version: s.version,
            repository: s.repository && s.repository.url,
            packages: packages.length > 0 ? packages : undefined,
            remotes: remotes.length > 0 ? remotes : undefined,
            status: officialMeta.status,
            publishedAt: officialMeta.publishedAt,
            isLatest: officialMeta.isLatest
            }

            return result
            } )

            const nextCursor = raw.metadata && raw.metadata.nextCursor

            response = {
            source: "MCP Server Registry",
            serverCount: servers.length,
            nextCursor: nextCursor || null,
            servers
            }
            } catch( error ) {
            struct.status = false
            struct.messages.push( `Error formatting server list: ${error.message}` )
            }

            return { response }
        }
    },
    searchServers: {
        postRequest: async ( { response, struct, payload } ) => {
            try {
            const raw = response
            if( !raw || !raw.servers ) {
            return { response }}

            const servers = raw.servers
            .map( ( entry ) => {
            const s = entry.server || {}
            const meta = entry._meta || {}
            const officialMeta = meta['io.modelcontextprotocol.registry/official'] || {}

            const packages = ( s.packages || [] )
            .map( ( pkg ) => {
            const result = {
            registryType: pkg.registryType,
            identifier: pkg.identifier,
            transportType: pkg.transport && pkg.transport.type
            }

            return result
            } )

            const remotes = ( s.remotes || [] )
            .map( ( remote ) => {
            const result = {
            type: remote.type,
            url: remote.url
            }

            return result
            } )

            const result = {
            name: s.name,
            description: s.description,
            version: s.version,
            repository: s.repository && s.repository.url,
            packages: packages.length > 0 ? packages : undefined,
            remotes: remotes.length > 0 ? remotes : undefined,
            status: officialMeta.status,
            publishedAt: officialMeta.publishedAt,
            isLatest: officialMeta.isLatest
            }

            return result
            } )

            const nextCursor = raw.metadata && raw.metadata.nextCursor

            response = {
            source: "MCP Server Registry",
            serverCount: servers.length,
            nextCursor: nextCursor || null,
            servers
            }
            } catch( error ) {
            struct.status = false
            struct.messages.push( `Error formatting server list: ${error.message}` )
            }

            return { response }
        }
    }
} )
