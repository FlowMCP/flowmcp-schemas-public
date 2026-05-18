export const main = {
    namespace: 'dottescooter',
    name: 'Dott E-Scooter Sharing (GBFS)',
    description: 'Access Dott e-scooter and e-bike sharing data for Berlin and 125+ German/European cities via GBFS v2.3. Get real-time vehicle availability, station locations, pricing, and geofencing zones. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://ridedott.com/', 'https://gbfs.api.ridedott.com/public/v2/berlin/gbfs.json'],
    tags: ['transport', 'escooter', 'sharing', 'berlin', 'germany', 'mobility', 'gbfs', 'cacheTtlFrequent'],
    root: 'https://gbfs.api.ridedott.com/public/v2/berlin',
    requiredServerParams: [],
    headers: {},
    tools: {
        getFreeBikes: {
            method: 'GET',
            path: '/free_bike_status.json',
            description: 'Get all available e-scooters and e-bikes in Berlin with real-time GPS coordinates, battery level, range, and vehicle type. Use getVehicleTypes to decode vehicle_type_id values.',
            parameters: [],
            tests: [
                { _description: 'Get all available Dott vehicles in Berlin' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'GBFS free bike status feed with real-time vehicle positions',
                    properties: {
                        data: { type: 'object', description: 'Wrapper containing the bikes array', properties: { bikes: { type: 'array', description: 'List of currently available vehicles', items: { type: 'object', properties: { bike_id: { type: 'string', description: 'Unique vehicle identifier' }, lat: { type: 'number', description: 'GPS latitude of the vehicle' }, lon: { type: 'number', description: 'GPS longitude of the vehicle' }, is_reserved: { type: 'boolean', description: 'Whether the vehicle is currently reserved by a user' }, is_disabled: { type: 'boolean', description: 'Whether the vehicle is disabled and not available for rent' }, vehicle_type_id: { type: 'string', description: 'References a type from getVehicleTypes (e.g. escooter, ebike)' }, current_range_meters: { type: 'number', description: 'Estimated remaining range in meters based on battery level' } } } } } },
                        last_updated: { type: 'number', description: 'Unix timestamp of last data update' },
                        ttl: { type: 'number', description: 'Seconds until data should be refreshed' }
                    }
                }
            }
        },
        getVehicleTypes: {
            method: 'GET',
            path: '/vehicle_types.json',
            description: 'Get available vehicle types (e-scooter, e-bike) with propulsion type, max range, and form factor. Use vehicle_type_id to decode types returned by getFreeBikes.',
            parameters: [],
            tests: [
                { _description: 'Get Dott vehicle types' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'GBFS vehicle types feed defining available vehicle categories',
                    properties: {
                        data: { type: 'object', description: 'Wrapper containing the vehicle_types array', properties: { vehicle_types: { type: 'array', description: 'List of vehicle type definitions', items: { type: 'object', properties: { vehicle_type_id: { type: 'string', description: 'Unique type identifier referenced by getFreeBikes' }, form_factor: { type: 'string', description: 'Physical form (e.g. scooter, bicycle)' }, propulsion_type: { type: 'string', description: 'Power source (e.g. electric, electric_assist)' }, name: { type: 'string', description: 'Human-readable vehicle type name' }, max_range_meters: { type: 'number', description: 'Maximum range on a full charge in meters' } } } } } },
                        last_updated: { type: 'number', description: 'Unix timestamp of last data update' }
                    }
                }
            }
        },
        getPricing: {
            method: 'GET',
            path: '/system_pricing_plans.json',
            description: 'Get pricing plans for Dott vehicles including unlock fees, per-minute rates, and subscription options. Prices are in the local currency.',
            parameters: [],
            tests: [
                { _description: 'Get Dott pricing plans' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'GBFS pricing plans feed with cost details for vehicle rental',
                    properties: {
                        data: { type: 'object', description: 'Wrapper containing the plans array', properties: { plans: { type: 'array', description: 'List of available pricing plans', items: { type: 'object', properties: { plan_id: { type: 'string', description: 'Unique pricing plan identifier' }, name: { type: 'string', description: 'Plan name (e.g. "Standard", "Day Pass")' }, currency: { type: 'string', description: 'ISO 4217 currency code (e.g. EUR)' }, price: { type: 'number', description: 'Base unlock price in the plan currency' }, is_taxable: { type: 'boolean', description: 'Whether tax applies to this plan' }, description: { type: 'string', description: 'Human-readable plan description' }, per_min_pricing: { type: 'array', description: 'Array of per-minute rate tiers' } } } } } },
                        last_updated: { type: 'number', description: 'Unix timestamp of last data update' }
                    }
                }
            }
        },
        getGeofencingZones: {
            method: 'GET',
            path: '/geofencing_zones.json',
            description: 'Get geofencing zones defining where vehicles can operate, park, and which areas are restricted. Returns GeoJSON FeatureCollection with speed limits and rules.',
            parameters: [],
            tests: [
                { _description: 'Get Berlin geofencing zones' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'GBFS geofencing zones feed with operational area boundaries',
                    properties: {
                        data: { type: 'object', description: 'Wrapper containing the geofencing_zones GeoJSON', properties: { geofencing_zones: { type: 'object', description: 'GeoJSON FeatureCollection of operational zones', properties: { type: { type: 'string', description: 'GeoJSON type, always "FeatureCollection"' }, features: { type: 'array', description: 'Array of GeoJSON Features with zone polygons and rule properties' } } } } },
                        last_updated: { type: 'number', description: 'Unix timestamp of last data update' }
                    }
                }
            }
        },
        getSystemInfo: {
            method: 'GET',
            path: '/system_information.json',
            description: 'Get system-level information about Dott in this city including operator name, timezone, contact details, and app download links.',
            parameters: [],
            tests: [
                { _description: 'Get Dott Berlin system info' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'GBFS system information feed with operator metadata',
                    properties: {
                        data: { type: 'object', description: 'System metadata for this GBFS deployment', properties: { system_id: { type: 'string', description: 'Unique GBFS system identifier' }, language: { type: 'string', description: 'BCP 47 language code for this feed' }, name: { type: 'string', description: 'Public-facing system name (e.g. "Dott Berlin")' }, operator: { type: 'string', description: 'Name of the system operator (e.g. "Dott")' }, timezone: { type: 'string', description: 'IANA timezone (e.g. "Europe/Berlin")' }, email: { type: 'string', description: 'Contact email for customer support' }, url: { type: 'string', description: 'URL of the operator website' } } },
                        last_updated: { type: 'number', description: 'Unix timestamp of last data update' }
                    }
                }
            }
        }
    }
}
