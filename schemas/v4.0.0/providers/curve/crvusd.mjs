// Curve Finance — crvUSD & CRV Supply
// Free public API, no auth required

export const main = {
    namespace: 'curve',
    name: 'Curve crvUSD & CRV Supply',
    description: 'Curve stablecoin (crvUSD) and CRV token supply data — circulating supply, total supply, and crvUSD AMM trading volumes.',
    version: '4.0.0',
    docs: ['https://api.curve.finance/v1/documentation'],
    tags: ['defi', 'stablecoin', 'crvusd', 'supply', 'cacheTtlFrequent'],
    root: 'https://api.curve.finance/v1',
    requiredServerParams: [],
    tools: {
        getCrvCircSupply: {
            method: 'GET',
            path: '/getCrvCircSupply',
            description: 'Get the CRV token circulating supply.',
            parameters: [],
            tests: [
                { _description: 'Get CRV circulating supply' },
                { _description: 'Fetch current CRV token circulation' },
                { _description: 'Query CRV supply data' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        data: { type: 'object', properties: { crvCirculatingSupply: { type: 'string' } } },
                        generatedTimeMs: { type: 'number' }
                    }
                }
            }
        },
        getCrvusdTotalSupply: {
            method: 'GET',
            path: '/getCrvusdTotalSupply',
            description: 'Get the crvUSD stablecoin total supply.',
            parameters: [],
            tests: [
                { _description: 'Get crvUSD total supply' },
                { _description: 'Fetch current crvUSD minted supply' },
                { _description: 'Query crvUSD stablecoin supply' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        data: { type: 'object', properties: { crvusdTotalSupply: { type: 'number' } } },
                        generatedTimeMs: { type: 'number' }
                    }
                }
            }
        },
        getCrvusdAmmVolumes: {
            method: 'GET',
            path: '/getVolumes/ethereum/crvusd-amms',
            description: 'Get daily trading volumes for crvUSD AMMs on Ethereum.',
            parameters: [],
            tests: [
                { _description: 'Get crvUSD AMM volumes' },
                { _description: 'Fetch crvUSD AMM daily trading volumes on Ethereum' },
                { _description: 'Query Ethereum crvUSD AMM volume data' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        data: { type: 'object', properties: { amms: { type: 'array', items: { type: 'object', properties: { address: { type: 'string' }, volumeUSD: { type: 'number' } } } } } },
                        generatedTimeMs: { type: 'number' }
                    }
                }
            }
        }
    }
}
