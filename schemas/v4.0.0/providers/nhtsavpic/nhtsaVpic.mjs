export const main = {
    namespace: 'nhtsavpic',
    name: 'NhtsaVpic',
    description: 'Decode US vehicle VINs and look up vehicle make, model, and manufacturer data via the NHTSA vPIC (Vehicle Product Information Catalog) API. Provides official US government vehicle identification data with no API key required.',
    version: '4.0.0',
    docs: ['https://vpic.nhtsa.dot.gov/api/'],
    tags: ['vehicles', 'automotive', 'vin', 'usa', 'government', 'cacheTtlStatic'],
    root: 'https://vpic.nhtsa.dot.gov/api/vehicles',
    requiredServerParams: [],
    headers: {},
    tools: {
        decodeVinValues: {
            method: 'GET',
            path: '/DecodeVinValues/:vin',
            description: 'Decode a VIN and return all vehicle attributes as flat key-value pairs. Returns make, model, model year, vehicle type, body class, manufacturer, plant location, engine specs, and 50+ other fields. Use decodeWmi for manufacturer-only lookup from the first 3 characters.',
            parameters: [
                { position: { key: 'vin', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'modelyear', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Decode a Honda Civic VIN', vin: '1HGBH41JXMN109186' },
                { _description: 'Decode a Ford F-150 VIN', vin: '1FTFW1ET5DFA77788' },
                { _description: 'Decode a Tesla Model 3 VIN', vin: '5YJ3E1EA7JF000316' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'NHTSA vPIC response with decoded VIN attributes',
                    properties: {
                        Count: { type: 'number', description: 'Number of result records (always 1 for VIN decode)' },
                        Message: { type: 'string', description: 'API response message with decode status details' },
                        SearchCriteria: { type: 'string', description: 'The VIN that was decoded' },
                        Results: {
                            type: 'array',
                            description: 'Array with one decoded VIN result object containing 50+ vehicle attributes',
                            items: {
                                type: 'object',
                                properties: {
                                    VIN: { type: 'string', description: 'The decoded VIN' },
                                    Make: { type: 'string', description: 'Vehicle make (e.g. HONDA, FORD, TESLA)' },
                                    MakeId: { type: 'string', description: 'Numeric make identifier' },
                                    Model: { type: 'string', description: 'Vehicle model (e.g. Civic, F-150, Model 3)' },
                                    ModelId: { type: 'string', description: 'Numeric model identifier' },
                                    ModelYear: { type: 'string', description: 'Model year (e.g. 2021)' },
                                    VehicleType: { type: 'string', description: 'Type of vehicle (e.g. PASSENGER CAR, TRUCK, MULTIPURPOSE PASSENGER VEHICLE)' },
                                    BodyClass: { type: 'string', description: 'Body style classification (e.g. Sedan/Saloon, Pickup, Hatchback/Liftback)' },
                                    Manufacturer: { type: 'string', description: 'Full manufacturer name (e.g. HONDA MOTOR CO., LTD)' },
                                    ManufacturerId: { type: 'string', description: 'Numeric manufacturer identifier' },
                                    PlantCity: { type: 'string', description: 'City where the vehicle was assembled' },
                                    PlantCountry: { type: 'string', description: 'Country where the vehicle was assembled' },
                                    PlantState: { type: 'string', description: 'State where the vehicle was assembled (US only)' },
                                    ErrorCode: { type: 'string', description: 'Error code for the decode (0 = no error, other values indicate issues)' },
                                    ErrorText: { type: 'string', description: 'Human-readable error description if decode had issues' }
                                }
                            }
                        }
                    }
                }
            }
        },
        decodeWmi: {
            method: 'GET',
            path: '/DecodeWMI/:wmi',
            description: 'Decode a 3 or 6-character World Manufacturer Identifier (WMI -- first 3 or 6 digits of a VIN) to identify the manufacturer, vehicle type, and country of origin. Lighter than decodeVinValues when only manufacturer info is needed.',
            parameters: [
                { position: { key: 'wmi', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Decode WMI for Toyota (JTD)', wmi: 'JTD' },
                { _description: 'Decode WMI for Ford (1FT)', wmi: '1FT' },
                { _description: 'Decode WMI for BMW (WBA)', wmi: 'WBA' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'NHTSA vPIC response with decoded WMI manufacturer information',
                    properties: {
                        Count: { type: 'number', description: 'Number of WMI results returned' },
                        Results: {
                            type: 'array',
                            description: 'Array of WMI decode results with manufacturer details',
                            items: {
                                type: 'object',
                                properties: {
                                    CommonName: { type: 'string', description: 'Common manufacturer brand name (e.g. Toyota, Ford)' },
                                    Country: { type: 'string', description: 'Country of the manufacturer headquarters' },
                                    CreatedOn: { type: 'string', description: 'Date the WMI was registered in the NHTSA database' },
                                    DateAvailableToRSA: { type: 'string', description: 'Date the WMI became available to road safety authorities' },
                                    Name: { type: 'string', description: 'Full legal manufacturer name' },
                                    VehicleType: { type: 'string', description: 'Type of vehicle this WMI is assigned to (e.g. Passenger Car, Truck)' },
                                    WMI: { type: 'string', description: 'The 3-character World Manufacturer Identifier code' }
                                }
                            }
                        }
                    }
                }
            }
        },
        getModelsForMakeYear: {
            method: 'GET',
            path: '/GetModelsForMakeYear/make/:make/modelyear/:year/vehicleType/:vehicleType',
            description: 'Get all models for a specific vehicle make, model year, and vehicle type. Returns a list of model names and IDs. Use getAllMakes to find valid make names and getVehicleTypesForMake to find valid vehicle types.',
            parameters: [
                { position: { key: 'make', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'year', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: [] } },
                { position: { key: 'vehicleType', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get all Toyota car models for 2022', make: 'toyota', year: 2022, vehicleType: 'car' },
                { _description: 'Get all Ford truck models for 2023', make: 'ford', year: 2023, vehicleType: 'truck' },
                { _description: 'Get all Honda car models for 2021', make: 'honda', year: 2021, vehicleType: 'car' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'NHTSA vPIC response with models filtered by make, year, and vehicle type',
                    properties: {
                        Count: { type: 'number', description: 'Number of matching models found' },
                        Results: {
                            type: 'array',
                            description: 'Array of vehicle model records matching the criteria',
                            items: {
                                type: 'object',
                                properties: {
                                    Make_ID: { type: 'number', description: 'Numeric make identifier' },
                                    Make_Name: { type: 'string', description: 'Make name (e.g. TOYOTA, FORD)' },
                                    Model_ID: { type: 'number', description: 'Numeric model identifier' },
                                    Model_Name: { type: 'string', description: 'Model name (e.g. Camry, F-150, Civic)' }
                                }
                            }
                        }
                    }
                }
            }
        },
        getModelsForMake: {
            method: 'GET',
            path: '/GetModelsForMake/:make',
            description: 'Get all vehicle models for a specific make name. Returns all models ever produced by that manufacturer across all years and types. For year-specific results, use getModelsForMakeYear instead.',
            parameters: [
                { position: { key: 'make', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get all Honda models', make: 'honda' },
                { _description: 'Get all Tesla models', make: 'tesla' },
                { _description: 'Get all Ford models', make: 'ford' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'NHTSA vPIC response with all models ever produced by the specified make',
                    properties: {
                        Count: { type: 'number', description: 'Total number of models found for this make' },
                        Results: {
                            type: 'array',
                            description: 'Array of all vehicle model records for the make',
                            items: {
                                type: 'object',
                                properties: {
                                    Make_ID: { type: 'number', description: 'Numeric make identifier' },
                                    Make_Name: { type: 'string', description: 'Make name (e.g. HONDA, TESLA)' },
                                    Model_ID: { type: 'number', description: 'Numeric model identifier' },
                                    Model_Name: { type: 'string', description: 'Model name (e.g. Civic, Model 3, Accord)' }
                                }
                            }
                        }
                    }
                }
            }
        },
        getAllMakes: {
            method: 'GET',
            path: '/GetAllMakes',
            description: 'Get a complete list of all vehicle makes registered in the NHTSA database. Returns thousands of makes with their IDs. Use returned make names with getModelsForMake, getModelsForMakeYear, or getVehicleTypesForMake.',
            parameters: [
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get all registered vehicle makes' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'NHTSA vPIC response with the complete make registry',
                    properties: {
                        Count: { type: 'number', description: 'Total number of registered vehicle makes' },
                        Results: {
                            type: 'array',
                            description: 'Array of all registered vehicle make records',
                            items: {
                                type: 'object',
                                properties: {
                                    Make_ID: { type: 'number', description: 'Numeric make identifier' },
                                    Make_Name: { type: 'string', description: 'Make name (e.g. TOYOTA, HONDA, BMW)' }
                                }
                            }
                        }
                    }
                }
            }
        },
        getVehicleTypesForMake: {
            method: 'GET',
            path: '/GetVehicleTypesForMake/:make',
            description: 'Get all vehicle types associated with a specific make name. Useful for determining what categories a manufacturer produces (cars, trucks, motorcycles, etc.). Use returned type names with getModelsForMakeYear.',
            parameters: [
                { position: { key: 'make', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'format', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get vehicle types for Toyota', make: 'toyota' },
                { _description: 'Get vehicle types for Harley-Davidson', make: 'harley-davidson' },
                { _description: 'Get vehicle types for Mercedes-Benz', make: 'mercedes-benz' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'NHTSA vPIC response with vehicle type classifications for the specified make',
                    properties: {
                        Count: { type: 'number', description: 'Number of vehicle types found for this make' },
                        Results: {
                            type: 'array',
                            description: 'Array of vehicle type records associated with the make',
                            items: {
                                type: 'object',
                                properties: {
                                    MakeId: { type: 'number', description: 'Numeric make identifier' },
                                    MakeName: { type: 'string', description: 'Make name (e.g. TOYOTA, HARLEY-DAVIDSON)' },
                                    VehicleTypeId: { type: 'number', description: 'Numeric vehicle type identifier' },
                                    VehicleTypeName: { type: 'string', description: 'Vehicle type name (e.g. Passenger Car, Truck, Motorcycle)' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
