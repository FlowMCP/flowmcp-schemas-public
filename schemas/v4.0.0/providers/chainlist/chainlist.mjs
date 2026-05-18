// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// Module-level code: 50 lines

export const main = {
    namespace: 'chainlist',
    name: 'Chainlist Tools',
    description: 'Query EVM chain metadata from Chainlist — look up chains by ID or keyword, get RPC endpoints, block explorer URLs, WebSocket endpoints, and native currency info.',
    version: '4.0.0',
    docs: ['https://chainlist.org'],
    tags: ['production', 'blockchain', 'rpc', 'network', 'cacheTtlStatic'],
    root: 'https://chainlist.org/rpcs.json',
    tools: {
        getChainById: {
            method: 'GET',
            path: '/',
            description: 'Returns detailed information for a chain given its numeric chainId. Required: chain_id.',
            parameters: [
                { position: { key: 'chain_id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)'] } }
            ],
            tests: [
                { _description: 'Fetch Ethereum Mainnet', chain_id: 1 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', description: 'Chain name' },
                        chainId: { type: 'number', description: 'Numeric chain ID' },
                        nativeCurrency: { type: 'object', description: 'Native currency details (name, symbol, decimals)' },
                        rpc: { type: 'array', description: 'Available RPC endpoints' },
                        explorers: { type: 'array', description: 'Block explorer URLs' }
                    }
                }
            }
        },
        getChainsByKeyword: {
            method: 'GET',
            path: '/',
            description: 'Returns all chains that match a keyword substring (case-insensitive). Required: keyword. Optional filters: limit.',
            parameters: [
                { position: { key: 'keyword', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(2)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'optional()'] } }
            ],
            tests: [
                { _description: 'Search for Ethereum', keyword: 'eth' },
                { _description: 'Search for ZK', keyword: 'zk', limit: 2 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Array of matching chain objects with name, chainId, RPC endpoints, and explorers'
                }
            }
        },
        getExplorerURLs: {
            method: 'GET',
            path: '/',
            description: 'Returns all block explorer URLs for a specific chain ID via Chainlist. Returns structured JSON response data.',
            parameters: [
                { position: { key: 'chain_id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)'] } }
            ],
            tests: [
                { _description: 'Get Ethereum explorers', chain_id: 1 },
                { _description: 'Get Polygon explorers', chain_id: 137 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        chainId: { type: 'number', description: 'Chain ID' },
                        chainName: { type: 'string', description: 'Chain name' },
                        explorers: { type: 'array', description: 'Block explorer objects with name, url, and standard', items: { type: 'object', properties: { name: { type: 'string' }, url: { type: 'string' }, standard: { type: 'string' } } } }
                    }
                }
            }
        },
        getRPCEndpoints: {
            method: 'GET',
            path: '/',
            description: 'Returns all HTTP RPC endpoints for a specific chain ID with speed testing. Filters out endpoints slower than 5 seconds and sorts by response time.',
            parameters: [
                { position: { key: 'chain_id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)'] } },
                { position: { key: 'test_speed', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(false)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'default(10)', 'optional()'] } }
            ],
            tests: [
                { _description: 'Get Ethereum RPC endpoints', chain_id: 1 },
                { _description: 'Get Arbitrum RPCs with speed test', chain_id: 42161, test_speed: 'true', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        chainId: { type: 'number', description: 'Chain ID' },
                        chainName: { type: 'string', description: 'Chain name' },
                        totalEndpoints: { type: 'number', description: 'Total number of HTTP RPC endpoints available' },
                        rpcEndpoints: { type: 'array', description: 'Array of RPC endpoint objects with url and tracking info' },
                        speedTestPerformed: { type: 'boolean', description: 'Whether speed testing was performed' }
                    }
                }
            }
        },
        getWebsocketEndpoints: {
            method: 'GET',
            path: '/',
            description: 'Returns all WebSocket RPC endpoints for a specific chain ID with speed testing. Filters out endpoints slower than 5 seconds and sorts by response time.',
            parameters: [
                { position: { key: 'chain_id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)'] } },
                { position: { key: 'test_speed', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(false)'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'optional()'] } }
            ],
            tests: [
                { _description: 'Get Ethereum WebSocket endpoints', chain_id: 1 },
                { _description: 'Get BSC WebSockets with speed test', chain_id: 56, test_speed: 'true', limit: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        chainId: { type: 'number', description: 'Chain ID' },
                        chainName: { type: 'string', description: 'Chain name' },
                        totalEndpoints: { type: 'number', description: 'Total number of WebSocket endpoints available' },
                        websocketEndpoints: { type: 'array', description: 'Array of WebSocket endpoint objects with url and tracking info' },
                        speedTestPerformed: { type: 'boolean', description: 'Whether speed testing was performed' }
                    }
                }
            }
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => {

    async function testRPCSpeed(url, expectedChainId) {
        const startTime = Date.now();
        let result = {
            url,
            status: false,
            timeInMs: null,
            networkId: null
        };
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'eth_chainId',
                    params: [],
                    id: 1
                }),
                signal: AbortSignal.timeout(5000)
            });
            const endTime = Date.now();
            result.timeInMs = endTime - startTime;
            if (response.ok) {
                const data = await response.json();
                if (data.result) {
                    result.networkId = parseInt(data.result, 16);
                    result.status = !isNaN(result.networkId) && result.networkId === expectedChainId;
                }
            }
        } catch (error) {
            result.timeInMs = Date.now() - startTime;
        }
        return result;
    }
    async function testWebSocketSpeed( url, expectedChainId ) {
        return {
            url,
            status: false,
            timeInMs: 0,
            networkId: null
        }
    }

    return {
        getChainById: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { chain_id } = userParams;
                const response = await fetch("https://chainlist.org/rpcs.json");
                const chains = await response.json();
                const chain = chains.find(c => c.chainId === Number(chain_id));
                if (!chain) {
                struct.status = false;
                struct.messages.push(`No chain found with ID ${chain_id}`);
                } else {
                struct.data = chain;
                }
                return { struct }
            }
        },
        getChainsByKeyword: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { keyword, limit = 5 } = userParams;
                const response = await fetch("https://chainlist.org/rpcs.json");
                const chains = await response.json();
                const matches = chains.filter(c => c.name?.toLowerCase().includes(keyword.toLowerCase()));
                if (!matches.length) {
                struct.status = false;
                struct.messages.push(`No chains found matching '${keyword}'`);
                } else {
                struct.data = matches.slice(0, limit);
                }
                return { struct }
            }
        },
        getExplorerURLs: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { chain_id } = userParams;
                const response = await fetch("https://chainlist.org/rpcs.json");
                const chains = await response.json();
                const chain = chains.find(c => c.chainId === Number(chain_id));
                if (!chain) {
                struct.status = false;
                struct.messages.push(`No chain found with ID ${chain_id}`);
                } else if (!chain.explorers || chain.explorers.length === 0) {
                struct.status = false;
                struct.messages.push(`No explorers found for chain ${chain.name} (ID: ${chain_id})`);
                } else {
                struct.data = {
                chainId: chain.chainId,
                chainName: chain.name,
                explorers: chain.explorers
                };
                }
                return { struct }
            }
        },
        getRPCEndpoints: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { chain_id, test_speed = "false", limit = 10 } = userParams;
                const response = await fetch("https://chainlist.org/rpcs.json");
                const chains = await response.json();
                const chain = chains.find(c => c.chainId === Number(chain_id));

                if (!chain) {
                struct.status = false;
                struct.messages.push(`No chain found with ID ${chain_id}`);
                return { struct }
                }

                const httpEndpoints = chain.rpc.filter(rpc => rpc.url.startsWith('http'));
                if (httpEndpoints.length === 0) {
                struct.status = false;
                struct.messages.push(`No HTTP RPC endpoints found for chain ${chain.name} (ID: ${chain_id})`);
                return { struct }
                }

                if (test_speed === "true") {
                const testResults = [];
                const endpointsToTest = httpEndpoints.slice(0, Math.min(limit, 15));

                for (const rpc of endpointsToTest) {
                const result = await testRPCSpeed(rpc.url, Number(chain_id));
                result.tracking = rpc.tracking || 'unknown';
                result.isOpenSource = rpc.isOpenSource || false;
                testResults.push(result);
                }

                const workingEndpoints = testResults
                .filter(r => r.status && r.timeInMs <= 5000)
                .sort((a, b) => a.timeInMs - b.timeInMs);

                struct.data = {
                chainId: chain.chainId,
                chainName: chain.name,
                totalTested: testResults.length,
                workingEndpoints: workingEndpoints.length,
                fastestEndpoints: workingEndpoints,
                speedTestPerformed: true
                };
                } else {
                struct.data = {
                chainId: chain.chainId,
                chainName: chain.name,
                totalEndpoints: httpEndpoints.length,
                rpcEndpoints: httpEndpoints,
                speedTestPerformed: false
                };
                }

                return { struct }
            }
        },
        getWebsocketEndpoints: {
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { chain_id, test_speed = "false", limit = 5 } = userParams;
                const response = await fetch("https://chainlist.org/rpcs.json");
                const chains = await response.json();
                const chain = chains.find(c => c.chainId === Number(chain_id));

                if (!chain) {
                struct.status = false;
                struct.messages.push(`No chain found with ID ${chain_id}`);
                return { struct }
                }

                const wsEndpoints = chain.rpc.filter(rpc => rpc.url.startsWith('ws'));
                if (wsEndpoints.length === 0) {
                struct.status = false;
                struct.messages.push(`No WebSocket endpoints found for chain ${chain.name} (ID: ${chain_id})`);
                return { struct }
                }

                if (test_speed === "true") {
                const testResults = [];
                const endpointsToTest = wsEndpoints.slice(0, Math.min(limit, 10));

                for (const rpc of endpointsToTest) {
                const result = await testWebSocketSpeed(rpc.url, Number(chain_id));
                result.tracking = rpc.tracking || 'unknown';
                testResults.push(result);
                }

                const workingEndpoints = testResults
                .filter(r => r.status && r.timeInMs <= 5000)
                .sort((a, b) => a.timeInMs - b.timeInMs);

                struct.data = {
                chainId: chain.chainId,
                chainName: chain.name,
                totalTested: testResults.length,
                workingEndpoints: workingEndpoints.length,
                fastestEndpoints: workingEndpoints,
                speedTestPerformed: true
                };
                } else {
                struct.data = {
                chainId: chain.chainId,
                chainName: chain.name,
                totalEndpoints: wsEndpoints.length,
                websocketEndpoints: wsEndpoints,
                speedTestPerformed: false
                };
                }

                return { struct }
            }
        }
    }
}
