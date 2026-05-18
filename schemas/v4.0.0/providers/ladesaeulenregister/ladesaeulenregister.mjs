// Schema for #283 — BNetzA Ladesäulenregister (EV Charging Stations Germany)

export const main = {
    namespace: 'ladesaeulenregister',
    name: 'BNetzA Ladesäulenregister',
    description: 'Official registry of 175,000+ public EV charging stations in Germany maintained by the Bundesnetzagentur. Query by location, city, state, operator, or power level via ArcGIS FeatureServer.',
    version: '4.0.0',
    docs: ['https://www.bundesnetzagentur.de/DE/Fachthemen/ElektrizitaetundGas/E-Mobilitaet/start.html'],
    tags: ['ev', 'charging', 'transport', 'energy', 'germany', 'geospatial', 'government', 'cacheTtlDaily'],
    root: 'https://services2.arcgis.com/jUpNdisbWqRpMo35/arcgis/rest/services/Ladesaeulen_in_Deutschland/FeatureServer/0',
    tools: {
        queryStations: {
            method: 'GET',
            path: '/query',
            description: 'Query EV charging stations with SQL WHERE filter. Supports filtering by city (Ort), state (Bundesland), operator (Betreiber), power (Nennleistung_Ladeeinrichtung__k), or connector type (Steckertypen1). Use getRecordCount first to plan pagination.',
            parameters: [
                { position: { key: 'where', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['default(1=1)'] } },
                { position: { key: 'outFields', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['default(Betreiber,Straße,Hausnummer,Postleitzahl,Ort,Bundesland,Breitengrad,Längengrad,Art_der_Ladeeinrichtung,Nennleistung_Ladeeinrichtung__k,Anzahl_Ladepunkte,Steckertypen1,Inbetriebnahmedatum)'] } },
                { position: { key: 'resultRecordCount', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(2000)'] } },
                { position: { key: 'resultOffset', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] } },
                { position: { key: 'orderByFields', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'returnGeometry', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(true,false)', options: ['optional()', 'default(false)'] } },
                { position: { key: 'f', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Charging stations in Berlin (first 3)', where: "Ort='Berlin'", outFields: 'Betreiber,Straße,Ort,Postleitzahl,Nennleistung_Ladeeinrichtung__k,Steckertypen1', resultRecordCount: 3 },
                { _description: 'Fast chargers above 50 kW', where: 'Nennleistung_Ladeeinrichtung__k>=50', outFields: 'Betreiber,Ort,Nennleistung_Ladeeinrichtung__k,Steckertypen1', resultRecordCount: 3 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'ArcGIS FeatureServer response with charging station records as feature attributes',
                    properties: {
                        features: {
                            type: 'array',
                            description: 'Array of charging station feature records',
                            items: {
                                type: 'object',
                                properties: {
                                    attributes: {
                                        type: 'object',
                                        description: 'Station data fields',
                                        properties: {
                                            Betreiber: { type: 'string', description: 'Charging station operator/company name' },
                                            Straße: { type: 'string', description: 'Street name of the station location' },
                                            Hausnummer: { type: 'string', description: 'House/building number' },
                                            Postleitzahl: { type: 'string', description: '5-digit German postal code' },
                                            Ort: { type: 'string', description: 'City or town name' },
                                            Bundesland: { type: 'string', description: 'German federal state (e.g. Bayern, Berlin)' },
                                            Breitengrad: { type: 'number', description: 'Latitude in decimal degrees (WGS84)' },
                                            Längengrad: { type: 'number', description: 'Longitude in decimal degrees (WGS84)' },
                                            Art_der_Ladeeinrichtung: { type: 'string', description: 'Type of charging facility (e.g. Normalladeeinrichtung, Schnellladeeinrichtung)' },
                                            Nennleistung_Ladeeinrichtung__k: { type: 'number', description: 'Rated power output in kW' },
                                            Anzahl_Ladepunkte: { type: 'number', description: 'Number of individual charging points at this station' },
                                            Steckertypen1: { type: 'string', description: 'Connector type (e.g. Typ 2, CCS, CHAdeMO)' },
                                            Inbetriebnahmedatum: { type: 'number', description: 'Commissioning date as Unix timestamp in milliseconds' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        queryByLocation: {
            method: 'GET',
            path: '/query',
            description: 'Find charging stations near a geographic point. Pass a bounding box as comma-separated envelope coordinates (xmin,ymin,xmax,ymax) in WGS84. To create a ~2km box around a point: subtract/add 0.015 to lon (xmin/xmax) and 0.01 to lat (ymin/ymax).',
            parameters: [
                { position: { key: 'geometry', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'geometryType', value: 'esriGeometryEnvelope', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'spatialRel', value: 'esriSpatialRelIntersects', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'inSR', value: '4326', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'outFields', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['default(Betreiber,Straße,Ort,Nennleistung_Ladeeinrichtung__k,Steckertypen1,Breitengrad,Längengrad)'] } },
                { position: { key: 'resultRecordCount', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'min(1)', 'max(2000)'] } },
                { position: { key: 'returnGeometry', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(true,false)', options: ['optional()', 'default(false)'] } },
                { position: { key: 'f', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Stations near Berlin Mitte (bounding box ~2km)', geometry: '13.37,52.51,13.40,52.53', outFields: 'Betreiber,Straße,Ort,Nennleistung_Ladeeinrichtung__k,Steckertypen1', resultRecordCount: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'ArcGIS FeatureServer response with stations intersecting the bounding box',
                    properties: {
                        features: {
                            type: 'array',
                            description: 'Charging stations within the geographic envelope',
                            items: {
                                type: 'object',
                                properties: {
                                    attributes: {
                                        type: 'object',
                                        description: 'Station data fields',
                                        properties: {
                                            Betreiber: { type: 'string', description: 'Charging station operator name' },
                                            Straße: { type: 'string', description: 'Street name' },
                                            Ort: { type: 'string', description: 'City or town name' },
                                            Nennleistung_Ladeeinrichtung__k: { type: 'number', description: 'Rated power output in kW' },
                                            Steckertypen1: { type: 'string', description: 'Connector type (e.g. Typ 2, CCS)' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        getRecordCount: {
            method: 'GET',
            path: '/query',
            description: 'Get the total count of charging stations matching a filter. Call before queryStations to plan pagination, or use for statistics (e.g., total stations per city or state).',
            parameters: [
                { position: { key: 'where', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['default(1=1)'] } },
                { position: { key: 'returnCountOnly', value: 'true', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'f', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Total stations in Germany', where: '1=1' },
                { _description: 'Stations in Bayern', where: "Bundesland='Bayern'" }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Record count result from ArcGIS FeatureServer',
                    properties: {
                        count: { type: 'number', description: 'Total number of charging stations matching the WHERE filter' }
                    }
                }
            }
        }
    }
}
