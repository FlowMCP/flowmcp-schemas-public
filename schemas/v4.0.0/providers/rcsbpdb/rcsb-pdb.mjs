export const main = {
    namespace: 'rcsbpdb',
    name: 'RCSB Protein Data Bank',
    description: 'Access the RCSB Protein Data Bank (PDB), the single worldwide archive for 3D structure data of biological macromolecules. Search 220,000+ experimentally determined structures of proteins, nucleic acids, and complex assemblies. Get atomic coordinates, experimental details, and annotations. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://data.rcsb.org/redoc/index.html', 'https://search.rcsb.org/index.html'],
    tags: ['biology', 'science', 'protein', 'opendata', 'cacheTtlDaily'],
    root: 'https://data.rcsb.org',
    requiredServerParams: [],
    headers: {
        'Accept': 'application/json'
    },
    tools: {
        getEntry: {
            method: 'GET',
            path: '/rest/v1/core/entry/:entryId',
            description: 'Get detailed information about a PDB entry by its 4-character ID. Returns experimental method, resolution, release date, structure title, authors, citation, and entity descriptions. Example IDs: 4HHB (hemoglobin), 1BNA (DNA), 6LU7 (SARS-CoV-2 main protease).',
            parameters: [
                { position: { key: 'entryId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get hemoglobin structure 4HHB', entryId: '4HHB' },
                { _description: 'Get SARS-CoV-2 protease 6LU7', entryId: '6LU7' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { rcsb_id: { type: 'string' }, struct: { type: 'object', properties: { title: { type: 'string' } } }, rcsb_entry_info: { type: 'object', properties: { experimental_method: { type: 'string' }, resolution_combined: { type: 'array' }, deposited_atom_count: { type: 'number' }, deposited_model_count: { type: 'number' }, molecular_weight: { type: 'number' } } }, rcsb_accession_info: { type: 'object', properties: { deposit_date: { type: 'string' }, initial_release_date: { type: 'string' } } }, audit_author: { type: 'array' }, citation: { type: 'array' } } }
            }
        },
        getEntityInfo: {
            method: 'GET',
            path: '/rest/v1/core/polymer_entity/:entryId/:entityId',
            description: 'Get information about a specific polymer entity (protein chain, nucleic acid) within a PDB entry. Returns sequence, organism source, taxonomy, gene names, and entity type.',
            parameters: [
                { position: { key: 'entryId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'entityId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Hemoglobin alpha chain', entryId: '4HHB', entityId: 1 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { rcsb_id: { type: 'string' }, entity_poly: { type: 'object', properties: { pdbx_seq_one_letter_code: { type: 'string' }, pdbx_seq_one_letter_code_can: { type: 'string' }, type: { type: 'string' } } }, rcsb_entity_source_organism: { type: 'array', items: { type: 'object', properties: { ncbi_taxonomy_id: { type: 'number' }, scientific_name: { type: 'string' } } } }, rcsb_polymer_entity: { type: 'object', properties: { pdbx_description: { type: 'string' } } } } }
            }
        },
        getUniprotMapping: {
            method: 'GET',
            path: '/rest/v1/core/uniprot/:uniprotId',
            description: 'Get PDB structures mapped to a UniProt protein accession. Returns all PDB entries containing the protein, with chain mappings and coverage information. Useful for finding all known structures of a specific protein.',
            parameters: [
                { position: { key: 'uniprotId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Structures for human insulin (P01308)', uniprotId: 'P01308' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { rcsb_id: { type: 'string' }, rcsb_uniprot_container_identifiers: { type: 'object', properties: { uniprot_id: { type: 'string' } } }, rcsb_uniprot_protein: { type: 'object', properties: { name: { type: 'object' }, sequence: { type: 'string' } } } } }
            }
        },
        getAssembly: {
            method: 'GET',
            path: '/rest/v1/core/assembly/:entryId/:assemblyId',
            description: 'Get biological assembly information for a PDB entry. Returns the biologically relevant form of the structure, including oligomeric state, total polymer count, and assembly details. Assembly ID 1 is typically the most relevant biological unit.',
            parameters: [
                { position: { key: 'entryId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'assemblyId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['default(1)'] } }
            ],
            tests: [
                { _description: 'Hemoglobin biological assembly', entryId: '4HHB', assemblyId: 1 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { rcsb_id: { type: 'string' }, rcsb_assembly_info: { type: 'object', properties: { polymer_entity_count: { type: 'number' }, polymer_entity_instance_count: { type: 'number' }, total_polymer_entity_count_DNA: { type: 'number' }, total_polymer_entity_count_RNA: { type: 'number' } } }, rcsb_struct_symmetry: { type: 'array' } } }
            }
        },
        getChemicalComponent: {
            method: 'GET',
            path: '/rest/v1/core/chemcomp/:compId',
            description: 'Get information about a chemical component (ligand, modified residue) by its 3-letter code. Returns formula, name, type, molecular weight, and SMILES. Example codes: ATP, HEM (heme), NAG (N-acetylglucosamine).',
            parameters: [
                { position: { key: 'compId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get ATP ligand info', compId: 'ATP' },
                { _description: 'Get heme component', compId: 'HEM' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { rcsb_id: { type: 'string' }, chem_comp: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, formula: { type: 'string' }, formula_weight: { type: 'number' }, type: { type: 'string' } } }, rcsb_chem_comp_descriptor: { type: 'object', properties: { SMILES: { type: 'string' }, InChI: { type: 'string' }, InChIKey: { type: 'string' } } } } }
            }
        }
    }
}
