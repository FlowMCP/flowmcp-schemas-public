// Schema for #182 — Cosmos Bank LCD REST API
// No API key required — public LCD endpoints via cosmos.directory

export const main = {
    namespace: 'cosmos',
    name: 'Cosmos Hub Bank & Staking',
    description: 'Query Cosmos Hub account balances, token supply, staking validators, delegations and governance proposals via public LCD REST API. No API key required. Use getBalances with a cosmos1 address to check balances, getDelegations with the same address for staking info, and getValidators to find validator details.',
    version: '4.0.0',
    docs: ['https://cosmos.network/rpc/', 'https://rest.cosmos.directory/cosmoshub'],
    tags: ['cosmos', 'staking', 'governance', 'cacheTtlFrequent'],
    root: 'https://rest.cosmos.directory/cosmoshub',
    tools: {
        getBalances: {
            method: 'GET',
            path: '/cosmos/bank/v1beta1/balances/:address',
            description: 'Get all token balances for a Cosmos Hub address. Returns denom and amount for each token held. The same address can be used in getDelegations to see staking positions.',
            parameters: [
                { position: { key: 'address', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(44)', 'regex(^cosmos1[a-z0-9]+$)'], description: 'Cosmos Hub bech32 address starting with cosmos1 (e.g. cosmos1fl48vsnmsdzcv85q5d2q4z5ajdha8yu34mf0eh)' } },
                { position: { key: 'pagination.limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)'], description: 'Maximum number of token denominations to return per page' } }
            ],
            output: { mimeType: 'application/json', description: 'Token balances for the queried Cosmos Hub address with pagination support', schema: { type: 'object', description: 'Cosmos LCD response containing token balance array and pagination cursor', properties: { balances: { type: 'array', description: 'Array of token balance objects held by this address', items: { type: 'object', properties: { denom: { type: 'string', description: 'Token denomination identifier (e.g. uatom for micro-ATOM, ibc/... for IBC tokens)' }, amount: { type: 'string', description: 'Token amount in smallest unit as a string (e.g. "1000000" = 1 ATOM for uatom)' } } } }, pagination: { type: 'object', description: 'Cosmos SDK pagination cursor for multi-page results', properties: { next_key: { type: 'string', nullable: true, description: 'Base64-encoded key for the next page (null if last page)' }, total: { type: 'string', description: 'Total number of token denominations held by this address' } } } } } },
            tests: [
                { _description: 'Get balances for Cosmos whale', address: 'cosmos1fl48vsnmsdzcv85q5d2q4z5ajdha8yu34mf0eh' },
                { _description: 'Get balances with small page size', address: 'cosmos1fl48vsnmsdzcv85q5d2q4z5ajdha8yu34mf0eh', 'pagination.limit': 5 },
                { _description: 'Get balances with pagination', address: 'cosmos1fl48vsnmsdzcv85q5d2q4z5ajdha8yu34mf0eh', 'pagination.limit': 10 }
            ],
        },
        getSupply: {
            method: 'GET',
            path: '/cosmos/bank/v1beta1/supply',
            description: 'Get the total supply of all tokens on Cosmos Hub. Paginated — use pagination.limit to control results.',
            parameters: [
                { position: { key: 'pagination.limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)'], description: 'Maximum number of token denominations to return per page' } }
            ],
            output: { mimeType: 'application/json', description: 'Total token supply across all denominations on Cosmos Hub', schema: { type: 'object', description: 'Cosmos LCD response with total supply array and pagination', properties: { supply: { type: 'array', description: 'Array of total supply entries for each token denomination on the chain', items: { type: 'object', properties: { denom: { type: 'string', description: 'Token denomination identifier (e.g. uatom, ibc/... for IBC tokens)' }, amount: { type: 'string', description: 'Total supply in smallest unit as a string' } } } }, pagination: { type: 'object', description: 'Pagination cursor for multi-page results', properties: { next_key: { type: 'string', nullable: true, description: 'Base64-encoded key for the next page (null if last page)' }, total: { type: 'string', description: 'Total number of token denominations on the chain' } } } } } },
            tests: [
                { _description: 'Get top 5 supply denoms', 'pagination.limit': 5 },
                { _description: 'Get top 10 supply denoms', 'pagination.limit': 10 },
                { _description: 'Get supply with default pagination', 'pagination.limit': 5 }
            ],
        },
        getValidators: {
            method: 'GET',
            path: '/cosmos/staking/v1beta1/validators',
            description: 'List staking validators on Cosmos Hub. Filter by bonding status. Returns moniker, commission, tokens and delegator shares. Validator operator_address values correspond to delegation targets in getDelegations.',
            parameters: [
                { position: { key: 'status', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(BOND_STATUS_BONDED,BOND_STATUS_UNBONDED,BOND_STATUS_UNBONDING)', options: ['optional()', 'default(BOND_STATUS_BONDED)'], description: 'Filter validators by bonding status: bonded (active), unbonded, or unbonding' } },
                { position: { key: 'pagination.limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)'], description: 'Maximum number of validators to return per page' } }
            ],
            output: { mimeType: 'application/json', description: 'List of staking validators with commission rates, delegator shares, and status details', schema: { type: 'object', description: 'Cosmos LCD response with validator array and pagination', properties: { validators: { type: 'array', description: 'Array of validator objects with staking details', items: { type: 'object', properties: { operator_address: { type: 'string', description: 'Validator operator address (cosmosvaloper1...). This is the validator_address in delegation responses.' }, consensus_pubkey: { type: 'object', description: 'Consensus public key used for block signing (type + key fields)' }, jailed: { type: 'boolean', description: 'Whether the validator is currently jailed (penalized for misbehavior)' }, status: { type: 'string', description: 'Bonding status string (BOND_STATUS_BONDED, BOND_STATUS_UNBONDED, BOND_STATUS_UNBONDING)' }, tokens: { type: 'string', description: 'Total staked tokens in uatom (smallest unit). Divide by 1000000 for ATOM.' }, delegator_shares: { type: 'string', description: 'Total delegator shares (used for reward calculation, may differ from tokens due to slashing)' }, description: { type: 'object', description: 'Validator self-description metadata', properties: { moniker: { type: 'string', description: 'Validator display name (e.g. Coinbase Custody, Binance Staking)' }, identity: { type: 'string', description: 'Keybase identity for logo verification' }, website: { type: 'string', description: 'Validator website URL' }, details: { type: 'string', description: 'Free-text validator description' } } }, commission: { type: 'object', description: 'Commission rate configuration', properties: { commission_rates: { type: 'object', description: 'Current and maximum commission rates', properties: { rate: { type: 'string', description: 'Current commission rate as decimal string (e.g. "0.100000000000000000" = 10%)' }, max_rate: { type: 'string', description: 'Maximum commission rate the validator can set' }, max_change_rate: { type: 'string', description: 'Maximum daily commission rate change' } } } } } } } }, pagination: { type: 'object', description: 'Pagination cursor' } } } },
            tests: [
                { _description: 'Top 5 bonded validators', status: 'BOND_STATUS_BONDED', 'pagination.limit': 5 },
                { _description: 'Top 3 unbonding validators', status: 'BOND_STATUS_UNBONDING', 'pagination.limit': 3 },
                { _description: 'Get bonded validators with default limit', status: 'BOND_STATUS_BONDED' }
            ],
        },
        getDelegations: {
            method: 'GET',
            path: '/cosmos/staking/v1beta1/delegations/:delegatorAddr',
            description: 'Get all staking delegations for a Cosmos Hub address. Returns validator address and delegation amount. Use the same address from getBalances. Validator addresses can be looked up in getValidators.',
            parameters: [
                { position: { key: 'delegatorAddr', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['min(44)', 'regex(^cosmos1[a-z0-9]+$)'], description: 'Cosmos Hub delegator bech32 address starting with cosmos1' } }
            ],
            output: { mimeType: 'application/json', description: 'Staking delegations for the queried address showing validators and staked amounts', schema: { type: 'object', description: 'Cosmos LCD response with delegation details and pagination', properties: { delegation_responses: { type: 'array', description: 'Array of delegation entries showing each validator stake', items: { type: 'object', properties: { delegation: { type: 'object', description: 'Delegation relationship details', properties: { delegator_address: { type: 'string', description: 'Delegator cosmos1 address that staked tokens' }, validator_address: { type: 'string', description: 'Validator cosmosvaloper1 address receiving the delegation (matches operator_address in getValidators)' }, shares: { type: 'string', description: 'Delegation shares (may differ from token amount due to slashing)' } } }, balance: { type: 'object', description: 'Current token balance of this delegation', properties: { denom: { type: 'string', description: 'Token denomination (typically uatom)' }, amount: { type: 'string', description: 'Staked amount in smallest unit. Divide by 1000000 for ATOM.' } } } } } }, pagination: { type: 'object', description: 'Pagination cursor for multi-page results' } } } },
            tests: [
                { _description: 'Delegations for Cosmos address', delegatorAddr: 'cosmos1fl48vsnmsdzcv85q5d2q4z5ajdha8yu34mf0eh' },
                { _description: 'Delegations for validator delegator', delegatorAddr: 'cosmos1sjllsnramtg3ewxqwwrwjxfgc4n4ef9u2lcnj0' },
                { _description: 'Delegations for another address', delegatorAddr: 'cosmos1z8mzakma7vnaajysmtkwt4wgjqr2m84tzvyfkz' }
            ],
        },
        getProposals: {
            method: 'GET',
            path: '/cosmos/gov/v1/proposals',
            description: 'List governance proposals on Cosmos Hub. Returns title, status, voting period and tally results.',
            parameters: [
                { position: { key: 'pagination.limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)'], description: 'Maximum number of proposals to return per page' } },
                { position: { key: 'pagination.reverse', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(true,false)', options: ['optional()', 'default(true)'], description: 'When true, return results in reverse chronological order (newest first)' } },
                { position: { key: 'proposal_status', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(PROPOSAL_STATUS_VOTING_PERIOD,PROPOSAL_STATUS_PASSED,PROPOSAL_STATUS_REJECTED,PROPOSAL_STATUS_DEPOSIT_PERIOD)', options: ['optional()'], description: 'Filter proposals by status: voting, passed, rejected, or deposit period' } }
            ],
            output: { mimeType: 'application/json', description: 'Governance proposals with status, voting periods, and tally results', schema: { type: 'object', description: 'Cosmos LCD response with proposal array and pagination', properties: { proposals: { type: 'array', description: 'Array of governance proposal objects', items: { type: 'object', properties: { id: { type: 'string', description: 'Unique proposal ID number as string' }, title: { type: 'string', description: 'Proposal title text' }, summary: { type: 'string', description: 'Brief summary or description of the proposal' }, status: { type: 'string', description: 'Current proposal status (PROPOSAL_STATUS_PASSED, PROPOSAL_STATUS_REJECTED, etc.)' }, submit_time: { type: 'string', description: 'ISO 8601 timestamp when the proposal was submitted' }, deposit_end_time: { type: 'string', description: 'ISO 8601 deadline for deposit contributions' }, voting_start_time: { type: 'string', description: 'ISO 8601 timestamp when voting period began' }, voting_end_time: { type: 'string', description: 'ISO 8601 timestamp when voting period ends' }, final_tally_result: { type: 'object', description: 'Final vote tally (populated after voting ends)', properties: { yes_count: { type: 'string', description: 'Total voting power that voted Yes (in uatom)' }, abstain_count: { type: 'string', description: 'Total voting power that abstained' }, no_count: { type: 'string', description: 'Total voting power that voted No' }, no_with_veto_count: { type: 'string', description: 'Total voting power that voted No With Veto' } } } } } }, pagination: { type: 'object', description: 'Pagination cursor for multi-page results' } } } },
            tests: [
                { _description: 'Latest 5 proposals', 'pagination.limit': 5, 'pagination.reverse': 'true' },
                { _description: 'Passed proposals', proposal_status: 'PROPOSAL_STATUS_PASSED', 'pagination.limit': 3 },
                { _description: 'Rejected proposals', proposal_status: 'PROPOSAL_STATUS_REJECTED', 'pagination.limit': 3 }
            ],
        },
        getCommunityPool: {
            method: 'GET',
            path: '/cosmos/distribution/v1beta1/community_pool',
            description: 'Get the Cosmos Hub community pool balances. Shows all token denominations and amounts available for governance spending.',
            parameters: [],
            output: { mimeType: 'application/json', description: 'Community pool token balances available for governance spending proposals', schema: { type: 'object', description: 'Cosmos LCD response with community pool balance array', properties: { pool: { type: 'array', description: 'Array of token balance objects in the community pool', items: { type: 'object', properties: { denom: { type: 'string', description: 'Token denomination (e.g. uatom for micro-ATOM)' }, amount: { type: 'string', description: 'Pool balance in smallest unit as a decimal string (may include fractional amounts)' } } } } } } },
            tests: [
                { _description: 'Get community pool balances' },
                { _description: 'Verify community pool response structure' },
                { _description: 'Fetch current community pool state' }
            ],
        }
    }
}
