// Hochwasserzentralen API — Flood Monitoring (LHP)
// Free public API, no auth required, CC BY 4.0
// Source: hochwasserzentralen.de

export const main = {
    namespace: 'hochwasserzentralen',
    name: 'Hochwasserzentralen (Flood Monitoring)',
    description: 'Real-time flood monitoring data from the German cross-state flood portal (LHP) — current flood situation at ~1,200 gauging stations and active regional flood warnings across all 16 federal states.',
    version: '4.0.0',
    docs: ['https://www.hochwasserzentralen.de/developers/api-docs', 'https://hochwasserzentralen.api.bund.dev/'],
    tags: ['government', 'environment', 'flood', 'weather', 'germany', 'opendata', 'cacheTtlRealtime'],
    root: 'https://api.hochwasserzentralen.de/public/v1',
    requiredServerParams: [],
    tools: {
        getStations: {
            method: 'GET',
            path: '/data/stations',
            description: 'Get current flood situation at all gauging stations in Germany. Returns station name, river, flood class (0-4), coordinates, and link to state portal. Use getAlerts for active warnings.',
            parameters: [
                { position: { key: 'states', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get all stations across Germany', states: 'BY,BW' },
                { _description: 'Get stations in Bavaria and Baden-Wuerttemberg', states: 'BY,BW' },
                { _description: 'Get stations in Nordrhein-Westfalen', states: 'NW' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Array of gauging stations with current flood status across Germany',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string', description: 'Station name' },
                            river: { type: 'string', description: 'River name where the station is located' },
                            floodClass: { type: 'number', description: 'Current flood class (0=normal, 1=info, 2=warning, 3=alarm, 4=extreme)' },
                            state: { type: 'string', description: 'Federal state abbreviation (BY, NW, SN, etc.)' },
                            latitude: { type: 'number', description: 'Station latitude coordinate' },
                            longitude: { type: 'number', description: 'Station longitude coordinate' },
                            url: { type: 'string', description: 'URL to the state flood portal for this station' }
                        }
                    }
                }
            }
        },
        getAlerts: {
            method: 'GET',
            path: '/data/alerts',
            description: 'Get active regional flood warnings from all German federal states. Returns alert area, warning headline, flood class, and polygon geometry. Use getStations for individual station data.',
            parameters: [
                { position: { key: 'states', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get all active flood alerts', states: 'SN,TH' },
                { _description: 'Get flood alerts for Sachsen and Thueringen', states: 'SN,TH' },
                { _description: 'Get flood alerts for Bayern', states: 'BY' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Array of active flood warnings from German federal states',
                    items: {
                        type: 'object',
                        properties: {
                            area: { type: 'string', description: 'Geographic area affected by the warning' },
                            headline: { type: 'string', description: 'Warning headline with severity description' },
                            floodClass: { type: 'number', description: 'Flood warning class (1=info, 2=warning, 3=alarm, 4=extreme)' },
                            state: { type: 'string', description: 'Federal state abbreviation issuing the warning' },
                            geometry: { type: 'object', description: 'GeoJSON polygon geometry of the affected area' }
                        }
                    }
                }
            }
        }
    }
}
