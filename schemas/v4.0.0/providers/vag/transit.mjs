// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'vag',
    name: 'VAG Nuernberg Transit API',
    description: 'Real-time public transit data for Nuremberg (VAG) including stops, departures, and service information for buses, trams, and subway',
    version: '4.0.0',
    docs: ['https://bundesapi.github.io/vag-api/'],
    tags: ['transit', 'germany', 'realtime', 'nuremberg', 'cacheTtlStatic'],
    root: 'https://start.vag.de/dm/api/v1',
    tools: {
        getStops: {
            method: 'GET',
            path: '/haltestellen.json/VGN',
            description: 'Get all public transit stops in the Nuremberg VGN network. Returns stop name, coordinates, and available transport modes.',
            parameters: [],
            tests: [
                { _description: 'Get all VGN transit stops' }
            ,
                { _description: 'Default test for getStops' }],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        Metadata: { type: 'object', properties: { Version: { type: 'string' }, Timestamp: { type: 'string' } } },
                        Haltestellen: { type: 'array', items: { type: 'object', properties: { Haltestellenname: { type: 'string' }, VAGKennung: { type: 'string' }, VGNKennung: { type: 'number' }, Longitude: { type: 'number' }, Latitude: { type: 'number' }, Produkte: { type: 'string' } } } }
                    }
                }
            },
        },
        getDepartures: {
            method: 'GET',
            path: '/abfahrten.json/VGN/:stopId',
            description: 'Get real-time departures for a specific stop. Use VGN stop ID from getStops. Returns line, direction, scheduled and actual departure times.',
            parameters: [
                { position: { key: 'stopId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['default("510")'] } }
            ],
            tests: [
                { _description: 'Get departures for Nuernberg Hauptbahnhof', stopId: '510' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        Metadata: { type: 'object', properties: { Version: { type: 'string' }, Timestamp: { type: 'string' } } },
                        Haltestellenname: { type: 'string' },
                        VAGKennung: { type: 'string' },
                        VGNKennung: { type: 'number' },
                        Abfahrten: { type: 'array', items: { type: 'object', properties: { Linienname: { type: 'string' }, Haltepunkt: { type: 'string' }, Richtung: { type: 'string' }, Richtungstext: { type: 'string' }, AbfahrtszeitSoll: { type: 'string' }, AbfahrtszeitIst: { type: 'string' }, Produkt: { type: 'string' }, Longitude: { type: 'number' }, Latitude: { type: 'number' }, Fahrtnummer: { type: 'number' }, Betriebstag: { type: 'string' }, Fahrtartnummer: { type: 'number' }, Besetzgrad: { type: 'string' }, Prognose: { type: 'boolean' }, HaltesteigText: { type: 'string' } } } }
                    }
                }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getStops: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.Haltestellen ) { return { response }}

            const stops = raw.Haltestellen
            .map( ( stop ) => {
            const result = {
            name: stop.Haltestellenname,
            vagId: stop.VAGKennung,
            vgnId: stop.VGNKennung,
            longitude: stop.Longitude,
            latitude: stop.Latitude,
            products: stop.Produkte
            }

            return result
            } )

            response = {
            stopCount: stops.length,
            stops
            }

            return { response }
        }
    },
    getDepartures: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.Abfahrten ) { return { response }}

            const departures = raw.Abfahrten
            .map( ( dep ) => {
            const result = {
            line: dep.Linienname,
            direction: dep.Richtungstext,
            scheduledTime: dep.AbfahrtszeitSoll,
            actualTime: dep.AbfahrtszeitIst,
            product: dep.Produkt,
            platform: dep.HaltesteigText || null,
            delay: dep.Prognose === true
            }

            return result
            } )

            response = {
            stopName: raw.Haltestellenname || null,
            departureCount: departures.length,
            departures,
            serviceInfo: raw.Sonderinformationen || []
            }

            return { response }
        }
    }
} )
