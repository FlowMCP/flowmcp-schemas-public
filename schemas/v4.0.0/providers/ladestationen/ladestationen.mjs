export const main = {
    namespace: 'ladestationen',
    name: 'Ladestationen BNetzA',
    description: 'Query the official German EV charging station registry (Ladesaeulenregister) from the Bundesnetzagentur via ArcGIS FeatureServer. Contains all registered public charging stations in Germany.',
    version: '4.0.0',
    docs: ['https://www.bundesnetzagentur.de/DE/Fachthemen/ElektrizitaetundGas/E-Mobilitaet/Ladesaeulenkarte/start.html'],
    tags: ['germany', 'mobility', 'ev', 'charging', 'opendata'],
    root: 'https://services2.arcgis.com/jUpNdisbWqRpMo35/arcgis/rest/services/Ladesaeulen_in_Deutschland/FeatureServer/0',
    tools: {
        queryStations: {
            method: 'GET',
            path: '/query',
            description: 'Query EV charging stations from the German Ladesaeulenregister. Supports SQL-like where filters for city, operator, power output, postal code, and state.',
            parameters: [
                { position: { key: 'where', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'outFields', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(Betreiber,Straße,Hausnummer,Postleitzahl,Ort,Bundesland,Nennleistung_Ladeeinrichtung__k,Anzahl_Ladepunkte,Status,Steckertypen1,Inbetriebnahmedatum)'] } },
                { position: { key: 'returnGeometry', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(false)'] } },
                { position: { key: 'outSR', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(4326)'] } },
                { position: { key: 'resultRecordCount', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(100)', 'max(2000)'] } },
                { position: { key: 'f', value: 'json', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(json)'] } }
            ],
            tests: [
                { _description: 'Get charging stations in Munich', where: "Ort='München'", resultRecordCount: 5 },
                { _description: 'Query stations in Berlin by postal code', where: "Postleitzahl='10115'", resultRecordCount: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'ArcGIS FeatureServer response with EV charging station records',
                    properties: {
                        features: {
                            type: 'array',
                            description: 'Array of charging station feature records',
                            items: {
                                type: 'object',
                                properties: {
                                    attributes: {
                                        type: 'object',
                                        description: 'Station data fields with German column names from BNetzA registry',
                                        properties: {
                                            Betreiber: { type: 'string', description: 'Charging station operator/company name' },
                                            Straße: { type: 'string', description: 'Street name' },
                                            Hausnummer: { type: 'string', description: 'House/building number' },
                                            Postleitzahl: { type: 'string', description: '5-digit German postal code' },
                                            Ort: { type: 'string', description: 'City or town name' },
                                            Bundesland: { type: 'string', description: 'German federal state' },
                                            Nennleistung_Ladeeinrichtung__k: { type: 'number', description: 'Rated power output in kW' },
                                            Anzahl_Ladepunkte: { type: 'number', description: 'Number of charging points at this station' },
                                            Status: { type: 'string', description: 'Operational status of the station' },
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
        }
    }
}
