export const main = {
    namespace: 'chembl',
    name: 'ChEMBL',
    description: 'Access the ChEMBL database of bioactive drug-like small molecules. Search 2.4M+ molecules, targets, activities, assays, and mechanisms of action from the European Bioinformatics Institute.',
    version: '4.0.0',
    docs: ['https://chembl.gitbook.io/chembl-interface-documentation/web-services/chembl-data-web-services'],
    tags: ['science', 'chemistry', 'drugs', 'pharmacology', 'bioactivity', 'cacheTtlDaily'],
    root: 'https://www.ebi.ac.uk/chembl/api/data',
    requiredServerParams: [],
    headers: {
        'Accept': 'application/json'
    },
    tools: {
        getMolecule: {
            method: 'GET',
            path: '/molecule/:chemblId.json',
            description: 'Get detailed molecule information by ChEMBL ID. Returns molecular properties, structures (SMILES, InChI), synonyms, ATC classifications, approval status, and cross-references.',
            parameters: [
                { position: { key: 'chemblId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'ChEMBL molecule identifier, e.g. CHEMBL25 for Aspirin' }
            ],
            tests: [
                { _description: 'Get Aspirin molecule data', chemblId: 'CHEMBL25' },
                { _description: 'Get Ibuprofen molecule data', chemblId: 'CHEMBL521' },
                { _description: 'Get Caffeine molecule data', chemblId: 'CHEMBL113' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Detailed molecule record from ChEMBL',
                    properties: {
                        molecule_chembl_id: { type: 'string', description: 'ChEMBL molecule identifier (e.g. CHEMBL25)' },
                        max_phase: { type: 'string', description: 'Highest clinical trial phase reached (4 = approved drug)' },
                        molecule_properties: { type: 'object', description: 'Calculated molecular properties', properties: { full_mwt: { type: 'string', description: 'Full molecular weight in Daltons' }, alogp: { type: 'string', description: 'Calculated octanol/water partition coefficient (lipophilicity)' }, psa: { type: 'string', description: 'Polar surface area in square Angstroms' }, num_ro5_violations: { type: 'number', description: 'Number of Lipinski Rule of 5 violations (0 = drug-like)' }, full_molformula: { type: 'string', description: 'Molecular formula (e.g. C9H8O4 for Aspirin)' } } },
                        molecule_structures: { type: 'object', description: 'Chemical structure representations', properties: { canonical_smiles: { type: 'string', description: 'Canonical SMILES string for the molecule' }, standard_inchi_key: { type: 'string', description: 'Standard InChI key for unique identification' } } },
                        molecule_synonyms: { type: 'array', description: 'Known synonyms and trade names for this molecule' },
                        atc_classifications: { type: 'array', description: 'WHO ATC (Anatomical Therapeutic Chemical) classification codes' },
                        first_approval: { type: 'number', description: 'Year of first regulatory approval, null if not approved' }
                    }
                }
            },
        },
        searchMolecules: {
            method: 'GET',
            path: '/molecule/search.json',
            description: 'Free-text search across molecules by name, synonym, or description. Returns matching molecules with properties and structures. Paginated results.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Search query string for molecule name, synonym, or description' },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(100)'] }, description: 'Maximum number of results per page (1-100, default 20)' },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] }, description: 'Number of results to skip for pagination (default 0)' }
            ],
            tests: [
                { _description: 'Search for aspirin molecules', q: 'aspirin', limit: 5, offset: 0 },
                { _description: 'Search for paracetamol', q: 'paracetamol', limit: 5 },
                { _description: 'Search for insulin molecules', q: 'insulin', limit: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated molecule search results',
                    properties: {
                        page_meta: { type: 'object', description: 'Pagination metadata', properties: { total_count: { type: 'number', description: 'Total matching molecules across all pages' }, limit: { type: 'number', description: 'Maximum results per page' }, offset: { type: 'number', description: 'Number of results skipped' } } },
                        molecules: { type: 'array', description: 'Matching molecule records', items: { type: 'object', properties: { molecule_chembl_id: { type: 'string', description: 'ChEMBL molecule identifier' }, max_phase: { type: 'string', description: 'Highest clinical phase reached' }, molecule_properties: { type: 'object', description: 'Molecular weight, lipophilicity, PSA, etc.' }, molecule_structures: { type: 'object', description: 'SMILES and InChI Key representations' } } } }
                    }
                }
            },
        },
        getTarget: {
            method: 'GET',
            path: '/target/:chemblId.json',
            description: 'Get detailed target information by ChEMBL ID. Returns target name, organism, target type, components with UniProt accessions, and cross-references.',
            parameters: [
                { position: { key: 'chemblId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'ChEMBL target identifier, e.g. CHEMBL230 for Cyclooxygenase-2' }
            ],
            tests: [
                { _description: 'Get Cyclooxygenase-2 target', chemblId: 'CHEMBL230' },
                { _description: 'Get EGFR target', chemblId: 'CHEMBL203' },
                { _description: 'Get Acetylcholinesterase target', chemblId: 'CHEMBL220' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Detailed drug target record from ChEMBL',
                    properties: {
                        target_chembl_id: { type: 'string', description: 'ChEMBL target identifier (e.g. CHEMBL230)' },
                        pref_name: { type: 'string', description: 'Preferred target name (e.g. Cyclooxygenase-2)' },
                        organism: { type: 'string', description: 'Source organism (e.g. Homo sapiens)' },
                        target_type: { type: 'string', description: 'Target classification (SINGLE PROTEIN, PROTEIN COMPLEX, etc.)' },
                        target_components: { type: 'array', description: 'Protein components of this target', items: { type: 'object', properties: { accession: { type: 'string', description: 'UniProt accession number' }, component_description: { type: 'string', description: 'Component protein name' }, component_type: { type: 'string', description: 'Component type (e.g. PROTEIN)' } } } }
                    }
                }
            },
        },
        searchTargets: {
            method: 'GET',
            path: '/target/search.json',
            description: 'Free-text search across drug targets by name, gene symbol, or description. Returns matching targets with organism and component information.',
            parameters: [
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Search query for target name, gene symbol, or description' },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(100)'] }, description: 'Maximum number of results per page (1-100, default 20)' },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] }, description: 'Number of results to skip for pagination (default 0)' }
            ],
            tests: [
                { _description: 'Search for kinase targets', q: 'kinase', limit: 5, offset: 0 },
                { _description: 'Search for dopamine targets', q: 'dopamine', limit: 5 },
                { _description: 'Search for GABA targets', q: 'GABA', limit: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated target search results',
                    properties: {
                        page_meta: { type: 'object', description: 'Pagination metadata', properties: { total_count: { type: 'number', description: 'Total matching targets' }, limit: { type: 'number', description: 'Results per page' }, offset: { type: 'number', description: 'Results skipped' } } },
                        targets: { type: 'array', description: 'Matching drug target records', items: { type: 'object', properties: { target_chembl_id: { type: 'string', description: 'ChEMBL target identifier' }, pref_name: { type: 'string', description: 'Preferred target name' }, organism: { type: 'string', description: 'Source organism' }, target_type: { type: 'string', description: 'Target classification type' } } } }
                    }
                }
            },
        },
        getActivities: {
            method: 'GET',
            path: '/activity.json',
            description: 'Get bioactivity data for a molecule. Returns assay results including activity type, standard values, target information, and publication references.',
            parameters: [
                { position: { key: 'molecule_chembl_id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'ChEMBL molecule identifier to get activities for, e.g. CHEMBL25' },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(100)'] }, description: 'Maximum number of activity records per page (1-100, default 20)' },
                { position: { key: 'offset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] }, description: 'Number of results to skip for pagination (default 0)' }
            ],
            tests: [
                { _description: 'Get activities for Aspirin', molecule_chembl_id: 'CHEMBL25', limit: 5, offset: 0 },
                { _description: 'Get activities for Ibuprofen', molecule_chembl_id: 'CHEMBL521', limit: 5 },
                { _description: 'Get activities for Caffeine', molecule_chembl_id: 'CHEMBL113', limit: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated bioactivity data results',
                    properties: {
                        page_meta: { type: 'object', description: 'Pagination metadata', properties: { total_count: { type: 'number', description: 'Total activity records for this molecule' }, limit: { type: 'number', description: 'Results per page' }, offset: { type: 'number', description: 'Results skipped' } } },
                        activities: { type: 'array', description: 'Bioactivity measurement records', items: { type: 'object', properties: { activity_id: { type: 'number', description: 'Unique activity record identifier' }, molecule_chembl_id: { type: 'string', description: 'ChEMBL ID of the tested molecule' }, molecule_pref_name: { type: 'string', description: 'Preferred name of the tested molecule' }, target_chembl_id: { type: 'string', description: 'ChEMBL ID of the biological target' }, target_pref_name: { type: 'string', description: 'Preferred name of the target' }, standard_type: { type: 'string', description: 'Activity measurement type (e.g. IC50, Ki, EC50)' }, standard_value: { type: 'string', description: 'Standardized activity value' }, standard_units: { type: 'string', description: 'Units for the standard value (e.g. nM)' }, pchembl_value: { type: 'number', description: 'Negative log molar activity value (-log10), comparable across assays' } } } }
                    }
                }
            },
        },
        getAssay: {
            method: 'GET',
            path: '/assay/:chemblId.json',
            description: 'Get assay details by ChEMBL assay ID. Returns assay description, type, organism, target assignment, confidence score, and BAO classification.',
            parameters: [
                { position: { key: 'chemblId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'ChEMBL assay identifier, e.g. CHEMBL1217643 for hERG binding assay' }
            ],
            tests: [
                { _description: 'Get hERG binding assay details', chemblId: 'CHEMBL1217643' },
                { _description: 'Get COX-2 inhibition assay', chemblId: 'CHEMBL615110' },
                { _description: 'Get kinase assay details', chemblId: 'CHEMBL1794345' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Detailed assay record from ChEMBL',
                    properties: {
                        assay_chembl_id: { type: 'string', description: 'ChEMBL assay identifier' },
                        description: { type: 'string', description: 'Full assay description including methodology' },
                        assay_type: { type: 'string', description: 'Assay type code (B=Binding, F=Functional, A=ADMET, T=Toxicity, P=Physicochemical)' },
                        assay_type_description: { type: 'string', description: 'Human-readable assay type name' },
                        assay_organism: { type: 'string', description: 'Organism used in the assay' },
                        target_chembl_id: { type: 'string', description: 'ChEMBL ID of the primary target' },
                        confidence_score: { type: 'number', description: 'Target assignment confidence (0-9, higher = more confident)' },
                        confidence_description: { type: 'string', description: 'Human-readable confidence level description' },
                        bao_format: { type: 'string', description: 'BioAssay Ontology format identifier' },
                        bao_label: { type: 'string', description: 'BioAssay Ontology format label (e.g. cell-based, biochemical)' }
                    }
                }
            },
        },
        getMechanism: {
            method: 'GET',
            path: '/mechanism.json',
            description: 'Get mechanism of action data for a molecule. Returns action type, target, molecular mechanism details, and literature references.',
            parameters: [
                { position: { key: 'molecule_chembl_id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'ChEMBL molecule identifier to get mechanisms for, e.g. CHEMBL25' },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(100)'] }, description: 'Maximum number of mechanism records per page (1-100, default 20)' }
            ],
            tests: [
                { _description: 'Get mechanism of action for Aspirin', molecule_chembl_id: 'CHEMBL25', limit: 10 },
                { _description: 'Get mechanism for Metformin', molecule_chembl_id: 'CHEMBL1431', limit: 5 },
                { _description: 'Get mechanism for Omeprazole', molecule_chembl_id: 'CHEMBL1503', limit: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated mechanism of action results',
                    properties: {
                        page_meta: { type: 'object', description: 'Pagination metadata', properties: { total_count: { type: 'number', description: 'Total mechanism records' }, limit: { type: 'number', description: 'Results per page' }, offset: { type: 'number', description: 'Results skipped' } } },
                        mechanisms: { type: 'array', description: 'Mechanism of action records', items: { type: 'object', properties: { action_type: { type: 'string', description: 'Type of pharmacological action (e.g. INHIBITOR, AGONIST, ANTAGONIST)' }, mechanism_of_action: { type: 'string', description: 'Textual description of the mechanism' }, molecule_chembl_id: { type: 'string', description: 'ChEMBL ID of the drug molecule' }, target_chembl_id: { type: 'string', description: 'ChEMBL ID of the target' }, max_phase: { type: 'number', description: 'Highest clinical trial phase for this mechanism' }, mechanism_refs: { type: 'array', description: 'Literature references supporting this mechanism (PubMed IDs, URLs)' } } } }
                    }
                }
            },
        },
        getSimilarMolecules: {
            method: 'GET',
            path: '/similarity/:chemblId/:similarity.json',
            description: 'Find molecules structurally similar to a given molecule. Uses fingerprint-based Tanimoto similarity with a configurable cutoff percentage (0-100).',
            parameters: [
                { position: { key: 'chemblId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'ChEMBL molecule identifier to find similar molecules for, e.g. CHEMBL25' },
                { position: { key: 'similarity', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(40)', 'max(100)'] }, description: 'Minimum Tanimoto similarity percentage (40-100), higher means more similar' },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(20)', 'min(1)', 'max(100)'] }, description: 'Maximum number of similar molecules to return (1-100, default 20)' }
            ],
            tests: [
                { _description: 'Find molecules 70% similar to Aspirin', chemblId: 'CHEMBL25', similarity: 70, limit: 5 },
                { _description: 'Find highly similar Ibuprofen analogues', chemblId: 'CHEMBL521', similarity: 85, limit: 5 },
                { _description: 'Broad similarity search for Caffeine', chemblId: 'CHEMBL113', similarity: 50, limit: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Paginated structural similarity search results',
                    properties: {
                        page_meta: { type: 'object', description: 'Pagination metadata', properties: { total_count: { type: 'number', description: 'Total similar molecules found' }, limit: { type: 'number', description: 'Results per page' }, offset: { type: 'number', description: 'Results skipped' } } },
                        molecules: { type: 'array', description: 'Structurally similar molecules sorted by similarity', items: { type: 'object', properties: { molecule_chembl_id: { type: 'string', description: 'ChEMBL ID of the similar molecule' }, similarity: { type: 'number', description: 'Tanimoto similarity score (0-100)' }, molecule_properties: { type: 'object', description: 'Molecular properties (weight, lipophilicity, PSA, etc.)' }, molecule_structures: { type: 'object', description: 'Chemical structure representations (SMILES, InChI Key)' } } } }
                    }
                }
            },
        }
    }
}
