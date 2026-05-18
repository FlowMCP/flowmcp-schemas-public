// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-imports
// Namespace: "passportOnchain" -> "passportonchain"
// requiredLibraries: ethers
// Import: import { ethers, Interface } from 'ethers'
// Module-level code: 50 lines

export const main = {
    namespace: 'passportonchain',
    name: 'Passport On-Chain Data API',
    description: 'Access Passport scores, credentials, and attestations directly from smart contracts on Ethereum and Arbitrum',
    version: '4.0.0',
    docs: ['https://docs.passport.xyz/building-with-passport/stamps/smart-contracts/contract-reference'],
    tags: ['identity', 'attestation', 'gitcoin', 'cacheTtlDaily'],
    root: 'https://passport-rpc-resolver.local?_ak={{ALCHEMY_API_KEY}}',
    requiredServerParams: ['ALCHEMY_API_KEY'],
    tools: {
        getFullPassportData: {
            method: 'GET',
            path: '/',
            description: 'Get complete Passport data (score, credentials, humanity status) for an address across all networks using multicall',
            parameters: [
                { position: { key: 'userAddress', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: ['min(42)', 'max(42)'] } }
            ],
            tests: [
                { _description: 'Get full passport data for test address', userAddress: '0xc383D7319191276E8BEA6643583466c092b49517' },
                {
                    _description: 'Get passport data for another test address',
                    userAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
                },
                { _description: 'Test with address that has no data', userAddress: '0x0000000000000000000000000000000000000001' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        userAddress: { type: 'string', description: 'Queried wallet address' },
                        results: { type: 'object', description: 'Per-network passport data' },
                        summary: { type: 'object', properties: { networksChecked: { type: 'number' }, successfulNetworks: { type: 'number' }, hasScore: { type: 'boolean' }, hasPassport: { type: 'boolean' }, isHuman: { type: 'boolean' } } },
                        timestamp: { type: 'string', description: 'ISO 8601 timestamp' }
                    }
                }
            },
        }
    },
    requiredLibraries: ['ethers']
}


export const handlers = ( { sharedLists, libraries } ) => {
    const ethers = libraries['ethers']
    const { Interface } = ethers

    const passportDecoderAbi = [
        'function getPassport(address userAddress) view returns (bytes32[])',
        'function getScore(address userAddress) view returns (uint256)',
        'function isHuman(address userAddress) view returns (bool)'
    ]
    const multicall3Abi = [{
        name: 'aggregate3',
        inputs: [{
            components: [
                { name: 'target', type: 'address' },
                { name: 'allowFailure', type: 'bool' },
                { name: 'callData', type: 'bytes' }
            ],
            name: 'calls',
            type: 'tuple[]'
        }],
        outputs: [{
            components: [
                { name: 'success', type: 'bool' },
                { name: 'returnData', type: 'bytes' }
            ],
            name: 'returnData',
            type: 'tuple[]'
        }],
        stateMutability: 'view',
        type: 'function'
    }]
    const easAbi = [
        'function getAttestation(bytes32 uid) view returns (tuple(bytes32 uid, bytes32 schema, uint64 time, uint64 expirationTime, uint64 revocationTime, bytes32 refUID, address recipient, address attester, bool revocable, bytes data))',
        'function getAttestations(bytes32[] calldata uids) view returns (tuple(bytes32 uid, bytes32 schema, uint64 time, uint64 expirationTime, uint64 revocationTime, bytes32 refUID, address recipient, address attester, bool revocable, bytes data)[])'
    ]
    const iface = new Interface(passportDecoderAbi)
    const contractAddresses = {
        ETHEREUM_MAINNET: {
            decoder: null, // No decoder on Ethereum mainnet yet
            eas: '0xA1207F3BBa224E2c9c3c6D5aF63D0eb1582Ce587'
        },
        ARBITRUM_MAINNET: {
            decoder: '0x2050256A91cbABD7C42465aA0d5325115C1dEB43',
            eas: '0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458',
            gitcoinResolver: '0x90E2C4472Df225e8D31f44725B75FFaA244d5D33',
            gitcoinVerifier: '0xc4858e4D177Bf0d14571F91401492d62aa608047',
            gitcoinAttester: '0x7848a3578Ff2E1F134659a23f64A404a4D710475'
        }
    }
    const schemaUIDs = {
        passport: '0x8ae6ee946bf1c936584cacc969bf7e9d0b274631c818df7e45c246051b364341',
        score: '0x24620f482734b3806102678e4b8bb68baafb1adc1ec29e524bcd69c85f15b915'
    }
    const availableProviders = {}

    return {
        getFullPassportData: {
            preRequest: async ( { struct, payload } ) => {
                if( Object.keys(availableProviders).length !== 0 ) { return { struct } }
                // REV-15: ALCHEMY_API_KEY arrives interpolated into struct.url (FlowMCP v3 pattern: root template with {{ALCHEMY_API_KEY}})
                const parsed = new URL( struct.url )
                const alchemyKey = parsed.searchParams.get( '_ak' )
                if( !alchemyKey ) {
                struct.status = false
                struct.messages.push('ALCHEMY_API_KEY not found in struct.url query (_ak)')
                return { struct }
                }

                const networks = [
                [ 'ETHEREUM_MAINNET', `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}` ],
                [ 'ARBITRUM_MAINNET', `https://arb-mainnet.g.alchemy.com/v2/${alchemyKey}` ]
                ]

                for( const [ key, url ] of networks ) {
                const provider = new ethers.JsonRpcProvider(url)
                availableProviders[ key ] = {
                provider: provider,
                contract: contractAddresses[ key ].decoder ? new ethers.Contract(
                contractAddresses[ key ].decoder,
                passportDecoderAbi,
                provider
                ) : null
                }
                }

                return { struct }
            },
            executeRequest: async ( { struct, payload } ) => {
                const { userParams } = payload
                const { userAddress } = userParams

                try {
                const results = {}
                const multicall3Address = '0xca11bde05977b3631167028862be2a173976ca11'

                for( const networkKey of Object.keys(availableProviders) ) {
                const { provider } = availableProviders[networkKey]

                try {
                const decoderAddress = contractAddresses[networkKey].decoder

                if( decoderAddress ) {
                // Create calls for all 3 functions using multicall
                const calls = [
                {
                target: decoderAddress,
                allowFailure: true,
                callData: iface.encodeFunctionData('getScore', [userAddress])
                },
                {
                target: decoderAddress,
                allowFailure: true,
                callData: iface.encodeFunctionData('getPassport', [userAddress])
                },
                {
                target: decoderAddress,
                allowFailure: true,
                callData: iface.encodeFunctionData('isHuman', [userAddress])
                }
                ]

                // Execute multicall
                const multicallContract = new ethers.Contract(multicall3Address, multicall3Abi, provider)
                const multicallResults = await multicallContract.aggregate3(calls)

                // Decode results
                const score = multicallResults[0].success ?
                iface.decodeFunctionResult('getScore', multicallResults[0].returnData)[0] : null
                const passport = multicallResults[1].success ?
                iface.decodeFunctionResult('getPassport', multicallResults[1].returnData)[0] : null
                const isHuman = multicallResults[2].success ?
                iface.decodeFunctionResult('isHuman', multicallResults[2].returnData)[0] : null

                results[networkKey] = {
                network: networkKey,
                contract: decoderAddress,
                score: {
                value: score ? score.toString() : null,
                number: score ? Number(score) : null,
                success: multicallResults[0].success
                },
                passport: {
                credentials: passport ? passport.map(cred => cred.toString()) : [],
                credentialCount: passport ? passport.length : 0,
                success: multicallResults[1].success
                },
                isHuman: {
                value: isHuman,
                humanityVerified: isHuman === true,
                success: multicallResults[2].success
                },
                multicallSuccess: true
                }
                } else {
                results[networkKey] = {
                network: networkKey,
                easContract: contractAddresses[networkKey].eas,
                passportSchemaUID: schemaUIDs.passport,
                scoreSchemaUID: schemaUIDs.score,
                note: "No decoder contract available - use EAS for direct queries",
                multicallSuccess: false
                }
                }
                } catch (error) {
                results[networkKey] = {
                network: networkKey,
                error: error.message,
                multicallSuccess: false
                }
                }
                }

                struct.data = {
                userAddress,
                results,
                summary: {
                networksChecked: Object.keys(results).length,
                successfulNetworks: Object.values(results).filter(r => r.multicallSuccess).length,
                hasScore: Object.values(results).some(r => r.score?.success && r.score?.value),
                hasPassport: Object.values(results).some(r => r.passport?.success && r.passport?.credentialCount > 0),
                isHuman: Object.values(results).some(r => r.isHuman?.success && r.isHuman?.value === true)
                },
                timestamp: new Date().toISOString()
                }

                struct.status = true

                } catch (error) {
                struct.status = false
                struct.messages.push(`Error fetching full passport data: ${error.message}`)
                }

                return { struct }
            }
        }
    }
}
