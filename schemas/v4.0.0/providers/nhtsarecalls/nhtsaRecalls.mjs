export const main = {
    namespace: 'nhtsarecalls',
    name: 'NhtsaRecalls',
    description: 'Access official US vehicle safety recalls and consumer complaints from the NHTSA (National Highway Traffic Safety Administration). Look up recalls by vehicle make/model/year, search by campaign number, and retrieve consumer complaint reports.',
    version: '4.0.0',
    docs: ['https://api.nhtsa.gov/'],
    tags: ['vehicles', 'automotive', 'safety', 'recalls', 'usa', 'government', 'cacheTtlFrequent'],
    root: 'https://api.nhtsa.gov',
    requiredServerParams: [],
    headers: {},
    tools: {
        recallsByVehicle: {
            method: 'GET',
            path: '/recalls/recallsByVehicle',
            description: 'Get all safety recalls for a specific vehicle by make, model, and model year. Returns recall campaign numbers, affected components, safety consequences, and remedy instructions.',
            parameters: [
                { position: { key: 'make', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'model', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'modelYear', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Get recalls for 2020 Toyota Camry', make: 'toyota', model: 'camry', modelYear: 2020 },
                { _description: 'Get recalls for 2019 Ford F-150', make: 'ford', model: 'f-150', modelYear: 2019 },
                { _description: 'Get recalls for 2021 Tesla Model 3', make: 'tesla', model: 'model 3', modelYear: 2021 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        Count: { type: 'number', description: 'Number of recall records found' },
                        Message: { type: 'string', description: 'API response status message' },
                        results: {
                            type: 'array',
                            description: 'Array of recall objects',
                            items: {
                                type: 'object',
                                properties: {
                                    Manufacturer: { type: 'string', description: 'Vehicle manufacturer name' },
                                    NHTSACampaignNumber: { type: 'string', description: 'NHTSA recall campaign identifier' },
                                    ReportReceivedDate: { type: 'string', description: 'Date NHTSA received the recall report' },
                                    Component: { type: 'string', description: 'Affected vehicle component' },
                                    Summary: { type: 'string', description: 'Description of the defect and affected vehicles' },
                                    Consequence: { type: 'string', description: 'Potential safety risk to drivers/passengers' },
                                    Remedy: { type: 'string', description: 'Steps to fix the defect' },
                                    Notes: { type: 'string', description: 'Additional notes including NHTSA hotline' },
                                    ModelYear: { type: 'string', description: 'Vehicle model year' },
                                    Make: { type: 'string', description: 'Vehicle make' },
                                    Model: { type: 'string', description: 'Vehicle model' },
                                    parkIt: { type: 'boolean', description: 'Whether owners should park the vehicle' },
                                    parkOutSide: { type: 'boolean', description: 'Whether vehicle should be parked outside' }
                                }
                            }
                        }
                    }
                }
            }
        },
        complaintsByVehicle: {
            method: 'GET',
            path: '/complaints/complaintsByVehicle',
            description: 'Get consumer complaints filed with NHTSA for a specific vehicle by make, model, and model year. Returns incident details, injury/death counts, crash flags, and complaint summaries.',
            parameters: [
                { position: { key: 'make', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'model', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'modelYear', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'Get complaints for 2020 Toyota Camry', make: 'TOYOTA', model: 'CAMRY', modelYear: 2020 },
                { _description: 'Get complaints for 2018 Honda CR-V', make: 'HONDA', model: 'CR-V', modelYear: 2018 },
                { _description: 'Get complaints for 2019 Chevrolet Silverado', make: 'CHEVROLET', model: 'SILVERADO 1500', modelYear: 2019 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: { type: 'number', description: 'Total number of complaints' },
                        message: { type: 'string', description: 'API response message' },
                        results: {
                            type: 'array',
                            description: 'Array of complaint objects',
                            items: {
                                type: 'object',
                                properties: {
                                    odiNumber: { type: 'number', description: 'NHTSA ODI complaint number' },
                                    manufacturer: { type: 'string', description: 'Vehicle manufacturer' },
                                    crash: { type: 'boolean', description: 'Whether incident involved a crash' },
                                    fire: { type: 'boolean', description: 'Whether incident involved a fire' },
                                    numberOfInjuries: { type: 'number', description: 'Number of injuries reported' },
                                    numberOfDeaths: { type: 'number', description: 'Number of deaths reported' },
                                    dateOfIncident: { type: 'string', description: 'Date of the incident (MM/DD/YYYY)' },
                                    dateComplaintFiled: { type: 'string', description: 'Date complaint was filed (MM/DD/YYYY)' },
                                    vin: { type: 'string', description: 'Partial VIN of affected vehicle' },
                                    components: { type: 'string', description: 'Affected components (pipe-delimited)' },
                                    summary: { type: 'string', description: 'Detailed description of the complaint' },
                                    products: { type: 'array', description: 'Product details (year, make, model)' }
                                }
                            }
                        }
                    }
                }
            }
        },
        recallsByVehicleModelYears: {
            method: 'GET',
            path: '/products/vehicle/modelYears',
            description: 'Get all available model years that have recall records in the NHTSA database. Use the issueType parameter to filter for recalls (r) or complaints (c).',
            parameters: [
                { position: { key: 'issueType', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(r,c)', options: ['optional()', 'default(r)'] } }
            ],
            tests: [
                { _description: 'Get all model years with recall records', issueType: 'r' },
                { _description: 'Get all model years with complaint records', issueType: 'c' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        Count: { type: 'number', description: 'Number of model years' },
                        Message: { type: 'string', description: 'API response message' },
                        results: {
                            type: 'array',
                            description: 'Array of model year objects',
                            items: {
                                type: 'object',
                                properties: {
                                    modelYear: { type: 'number', description: 'Vehicle model year' }
                                }
                            }
                        }
                    }
                }
            }
        },
        recallsByVehicleMakes: {
            method: 'GET',
            path: '/products/vehicle/makes',
            description: 'Get all vehicle makes that have safety records for a given model year. Use to discover which manufacturers have recalls or complaints in a specific year.',
            parameters: [
                { position: { key: 'modelYear', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'issueType', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(r,c)', options: ['optional()', 'default(r)'] } }
            ],
            tests: [
                { _description: 'Get all makes with recalls for 2020', modelYear: 2020, issueType: 'r' },
                { _description: 'Get all makes with complaints for 2019', modelYear: 2019, issueType: 'c' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        Count: { type: 'number', description: 'Number of makes' },
                        Message: { type: 'string', description: 'API response message' },
                        results: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    make: { type: 'string', description: 'Vehicle make name' }
                                }
                            }
                        }
                    }
                }
            }
        },
        recallsByVehicleModels: {
            method: 'GET',
            path: '/products/vehicle/models',
            description: 'Get all vehicle models for a given make and model year that have safety records. Use to enumerate all models before fetching recall or complaint details.',
            parameters: [
                { position: { key: 'modelYear', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'make', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'issueType', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(r,c)', options: ['optional()', 'default(r)'] } }
            ],
            tests: [
                { _description: 'Get all Toyota models with recalls for 2021', modelYear: 2021, make: 'toyota', issueType: 'r' },
                { _description: 'Get all Ford models with complaints for 2020', modelYear: 2020, make: 'ford', issueType: 'c' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        Count: { type: 'number', description: 'Number of models' },
                        Message: { type: 'string', description: 'API response message' },
                        results: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    model: { type: 'string', description: 'Vehicle model name' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
