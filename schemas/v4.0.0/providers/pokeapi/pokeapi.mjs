export const main = {
    namespace: 'pokeapi',
    name: 'PokeAPI Pokemon Data',
    description: 'Access PokeAPI, the RESTful Pokemon API with data on 1,300+ Pokemon. Get detailed stats, abilities, types, moves, and evolution chains. Covers all generations from Red/Blue to Scarlet/Violet. Also includes berries, items, locations, and machines. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://pokeapi.co/docs/v2'],
    tags: ['entertainment', 'gaming', 'opendata', 'cacheTtlStatic'],
    root: 'https://pokeapi.co',
    requiredServerParams: [],
    headers: {},
    tools: {
        getPokemon: {
            method: 'GET',
            path: '/api/v2/pokemon/:nameOrId',
            description: 'Get detailed Pokemon data by name or ID. Returns stats, abilities, types, moves, sprites. Use names from listPokemon, ability names in getAbility, type names in getType.',
            parameters: [
                { position: { key: 'nameOrId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get Pikachu', nameOrId: 'pikachu' },
                { _description: 'Get Charizard by ID', nameOrId: '6' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { id: { type: 'number' }, name: { type: 'string' }, height: { type: 'number' }, weight: { type: 'number' }, base_experience: { type: 'number' }, types: { type: 'array', items: { type: 'object', properties: { slot: { type: 'number' }, type: { type: 'object', properties: { name: { type: 'string' } } } } } }, abilities: { type: 'array' }, stats: { type: 'array' }, moves: { type: 'array' }, sprites: { type: 'object' } } }
            }
        },
        listPokemon: {
            method: 'GET',
            path: '/api/v2/pokemon',
            description: 'List Pokemon with pagination. Returns names and URLs. Use Pokemon names from results in getPokemon for full details.',
            parameters: [
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'max(100)'] } },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } }
            ],
            tests: [
                { _description: 'First 5 Pokemon', limit: 5 },
                { _description: 'Pokemon 151-155', limit: 5, offset: 150 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { count: { type: 'number' }, next: { type: 'string' }, previous: { type: 'string' }, results: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, url: { type: 'string' } } } } } }
            }
        },
        getAbility: {
            method: 'GET',
            path: '/api/v2/ability/:nameOrId',
            description: 'Get details about a Pokemon ability by name or ID. Returns effect, generation, and which Pokemon can have this ability.',
            parameters: [
                { position: { key: 'nameOrId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get Overgrow ability', nameOrId: 'overgrow' },
                { _description: 'Get Levitate ability', nameOrId: 'levitate' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { id: { type: 'number' }, name: { type: 'string' }, is_main_series: { type: 'boolean' }, generation: { type: 'object', properties: { name: { type: 'string' } } }, effect_entries: { type: 'array' }, pokemon: { type: 'array' } } }
            }
        },
        getType: {
            method: 'GET',
            path: '/api/v2/type/:nameOrId',
            description: 'Get Pokemon type details by name or ID. Returns damage relations (strengths/weaknesses), which Pokemon have this type, and type matchups.',
            parameters: [
                { position: { key: 'nameOrId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get Fire type', nameOrId: 'fire' },
                { _description: 'Get Dragon type', nameOrId: 'dragon' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { id: { type: 'number' }, name: { type: 'string' }, damage_relations: { type: 'object', properties: { double_damage_from: { type: 'array' }, double_damage_to: { type: 'array' }, half_damage_from: { type: 'array' }, half_damage_to: { type: 'array' }, no_damage_from: { type: 'array' }, no_damage_to: { type: 'array' } } }, pokemon: { type: 'array' } } }
            }
        },
        getEvolutionChain: {
            method: 'GET',
            path: '/api/v2/evolution-chain/:id',
            description: 'Get Pokemon evolution chain by chain ID. Returns the full evolution tree with species names, evolution triggers, and conditions. Use species names from the chain in getPokemon.',
            parameters: [
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Bulbasaur chain (1)', id: 1 },
                { _description: 'Pikachu chain (10)', id: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { id: { type: 'number' }, chain: { type: 'object', properties: { species: { type: 'object', properties: { name: { type: 'string' } } }, evolves_to: { type: 'array' }, evolution_details: { type: 'array' } } } } }
            }
        }
    }
}
