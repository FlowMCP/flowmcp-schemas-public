export const main = {
    namespace: 'pubchem',
    name: 'PubChem Chemical Database',
    description: 'Access PubChem, the world\'s largest free chemistry database by NCBI/NIH. Search 115M+ chemical compounds by name, formula, or structure. Get molecular properties (weight, formula, SMILES, InChI), bioactivity data, and chemical classifications. Covers drugs, metabolites, toxins, food additives, and industrial chemicals. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest'],
    tags: ['chemistry', 'science', 'drugs', 'opendata', 'cacheTtlDaily'],
    root: 'https://pubchem.ncbi.nlm.nih.gov',
    requiredServerParams: [],
    headers: {},
    tools: {
        getCompoundByName: {
            method: 'GET',
            path: '/rest/pug/compound/name/:name/JSON',
            description: 'Get full compound record by chemical name. Returns complete PubChem compound data. For specific properties use getCompoundProperties with CID. Use autocompleteCompound to verify chemical names.',
            parameters: [
                { position: { key: 'name', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get aspirin compound', name: 'aspirin' },
                { _description: 'Get caffeine compound', name: 'caffeine' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { PC_Compounds: { type: 'array', items: { type: 'object', properties: { id: { type: 'object', properties: { id: { type: 'object', properties: { cid: { type: 'number' } } } } }, atoms: { type: 'object' }, bonds: { type: 'object' }, coords: { type: 'array' }, props: { type: 'array' } } } } } }
            }
        },
        getCompoundProperties: {
            method: 'GET',
            path: '/rest/pug/compound/cid/:cid/property/:properties/JSON',
            description: 'Get specific molecular properties of a compound by CID. Properties: MolecularFormula, MolecularWeight, IUPACName, CanonicalSMILES, IsomericSMILES, InChI, InChIKey, XLogP, ExactMass, TPSA, Complexity, HBondDonorCount, HBondAcceptorCount, RotatableBondCount, HeavyAtomCount, Charge. Use CIDs from searchCompoundByName.',
            parameters: [
                { position: { key: 'cid', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'properties', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['default(MolecularFormula,MolecularWeight,IUPACName,CanonicalSMILES,XLogP)'] } }
            ],
            tests: [
                { _description: 'Aspirin properties (CID 2244)', cid: 2244, properties: 'MolecularFormula,MolecularWeight,IUPACName,CanonicalSMILES,XLogP' },
                { _description: 'Caffeine properties (CID 2519)', cid: 2519, properties: 'MolecularFormula,MolecularWeight,IUPACName' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { PropertyTable: { type: 'object', properties: { Properties: { type: 'array', items: { type: 'object', properties: { CID: { type: 'number' }, MolecularFormula: { type: 'string' }, MolecularWeight: { type: 'string' }, IUPACName: { type: 'string' }, CanonicalSMILES: { type: 'string' }, XLogP: { type: 'number' }, ExactMass: { type: 'string' }, TPSA: { type: 'number' }, Complexity: { type: 'number' }, HBondDonorCount: { type: 'number' }, HBondAcceptorCount: { type: 'number' }, RotatableBondCount: { type: 'number' }, HeavyAtomCount: { type: 'number' } } } } } } } }
            }
        },
        searchCompoundByName: {
            method: 'GET',
            path: '/rest/pug/compound/name/:name/cids/JSON',
            description: 'Search for compound CIDs by chemical name. Returns matching PubChem CIDs. Use these CIDs in getCompoundProperties, getCompoundSynonyms, or getCompoundByName for full records.',
            parameters: [
                { position: { key: 'name', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Search glucose CIDs', name: 'glucose' },
                { _description: 'Search ibuprofen CIDs', name: 'ibuprofen' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { IdentifierList: { type: 'object', properties: { CID: { type: 'array', items: { type: 'number' } } } } } }
            }
        },
        autocompleteCompound: {
            method: 'GET',
            path: '/rest/autocomplete/compound/:query/json',
            description: 'Autocomplete compound names. Returns matching name suggestions. Use verified names in getCompoundByName or searchCompoundByName to find CIDs.',
            parameters: [
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'max(100)'] } }
            ],
            tests: [
                { _description: 'Autocomplete aspir', query: 'aspir', limit: 5 },
                { _description: 'Autocomplete metform', query: 'metform', limit: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { status: { type: 'object', properties: { code: { type: 'number' } } }, total: { type: 'number' }, dictionary_terms: { type: 'object', properties: { compound: { type: 'array', items: { type: 'string' } } } } } }
            }
        },
        getCompoundSynonyms: {
            method: 'GET',
            path: '/rest/pug/compound/cid/:cid/synonyms/JSON',
            description: 'Get all known synonyms, trade names, and identifiers for a compound by CID. Returns generic names, brand names, registry numbers. Use CIDs from searchCompoundByName.',
            parameters: [
                { position: { key: 'cid', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Aspirin synonyms (CID 2244)', cid: 2244 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { InformationList: { type: 'object', properties: { Information: { type: 'array', items: { type: 'object', properties: { CID: { type: 'number' }, Synonym: { type: 'array', items: { type: 'string' } } } } } } } } }
            }
        }
    }
}
