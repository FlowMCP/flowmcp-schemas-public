// Migrated from v1.2.0 -> v2.0.0
// Category: handlers-clean

export const main = {
    namespace: 'smard',
    name: 'SMARD Energy Data API',
    description: 'German energy market data from SMARD (Strommarktdaten) by Bundesnetzagentur. Provides electricity generation, consumption, and market data.',
    version: '4.0.0',
    docs: ['https://smard.api.bund.dev/'],
    tags: ['energy', 'germany', 'electricity', 'market', 'cacheTtlStatic'],
    root: 'https://www.smard.de/app/chart_data',
    tools: {
        getFilterIndex: {
            method: 'GET',
            path: '/:filterId/DE/index_hour.json',
            description: 'Get available timestamps for a SMARD data filter. Filter IDs: 1223=realized generation, 1224=forecasted generation, 1225=total grid load, 4169=installed capacity.',
            parameters: [
                { position: { key: 'filterId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['default("1223")'] } }
            ],
            tests: [
                { _description: 'Get index for realized generation', filterId: '1223' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        timestamps: { type: 'array', items: { type: 'number' } }
                    }
                }
            },
        },
        getLatestData: {
            method: 'GET',
            path: '/:filterId/DE/index_hour.json',
            description: 'Get the latest energy data for a filter. Automatically fetches the most recent timestamp from the index. Filter IDs: 1223=realized generation, 1224=forecasted generation, 1225=total grid load.',
            parameters: [
                { position: { key: 'filterId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: ['default("1223")'] } }
            ],
            tests: [
                { _description: 'Get latest realized generation data', filterId: '1223' },
                { _description: 'Get latest grid load data', filterId: '1225' }
            ],
            output: {
                      "mimeType": "application/json",
                      "description": "Latest energy market data from SMARD/Bundesnetzagentur",
                      "schema": {
                                "type": "object",
                                "properties": {
                                          "filterId": {
                                                    "type": "string",
                                                    "description": "SMARD filter ID used for the query"
                                          },
                                          "region": {
                                                    "type": "string",
                                                    "description": "Region code (DE)"
                                          },
                                          "timestamp": {
                                                    "type": "number",
                                                    "description": "Unix timestamp of the data period"
                                          },
                                          "date": {
                                                    "type": "string",
                                                    "description": "ISO 8601 formatted date"
                                          },
                                          "totalEntries": {
                                                    "type": "number",
                                                    "description": "Total data points in the response"
                                          },
                                          "validEntries": {
                                                    "type": "number",
                                                    "description": "Data points with non-null values"
                                          },
                                          "series": {
                                                    "type": "array",
                                                    "description": "Time series data points with timestamp and value",
                                                    "items": {
                                                              "type": "object",
                                                              "properties": {
                                                                        "timestamp": {
                                                                                  "type": "number"
                                                                        },
                                                                        "date": {
                                                                                  "type": "string"
                                                                        },
                                                                        "value": {
                                                                                  "type": "number"
                                                                        }
                                                              }
                                                    }
                                          }
                                }
                      }
            },
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getFilterIndex: {
        postRequest: async ( { response, struct, payload } ) => {
            const raw = struct?.data
            if( !raw?.timestamps ) { return { response }}

            const timestamps = raw.timestamps
            const latest = timestamps[ timestamps.length - 1 ]

            response = {
            timestampCount: timestamps.length,
            latestTimestamp: latest,
            latestDate: new Date( latest ).toISOString(),
            oldestTimestamp: timestamps[ 0 ],
            oldestDate: new Date( timestamps[ 0 ] ).toISOString()
            }

            return { response }
        }
    },
    getLatestData: {
        executeRequest: async ( { struct, payload } ) => {
            try {
            const indexUrl = payload.url
            const indexResponse = await fetch( indexUrl )

            if( !indexResponse.ok ) {
            struct.status = false
            struct.messages.push( `Index fetch failed: HTTP ${indexResponse.status}` )

            return { struct }}

            const indexData = await indexResponse.json()
            const timestamps = indexData.timestamps

            if( !timestamps || timestamps.length === 0 ) {
            struct.status = false
            struct.messages.push( 'No timestamps available in index' )

            return { struct }}

            const latestTimestamp = timestamps[ timestamps.length - 1 ]
            const pathParts = indexUrl.replace( 'https://www.smard.de/app/chart_data/', '' ).split( '/' )
            const filterId = pathParts[ 0 ]
            const region = pathParts[ 1 ]
            const dataUrl = `https://www.smard.de/app/chart_data/${filterId}/${region}/${filterId}_${region}_hour_${latestTimestamp}.json`

            const dataResponse = await fetch( dataUrl )

            if( !dataResponse.ok ) {
            struct.status = false
            struct.messages.push( `Data fetch failed: HTTP ${dataResponse.status}` )

            return { struct }}

            const rawData = await dataResponse.json()
            const series = rawData.series || []
            const validEntries = series
            .filter( ( entry ) => {
            const hasValue = entry[ 1 ] !== null

            return hasValue
            } )

            struct.data = {
            filterId,
            region,
            timestamp: latestTimestamp,
            date: new Date( latestTimestamp ).toISOString(),
            totalEntries: series.length,
            validEntries: validEntries.length,
            metaData: rawData.meta_data || null,
            series: validEntries
            .slice( 0, 48 )
            .map( ( entry ) => {
            const result = {
            timestamp: entry[ 0 ],
            date: new Date( entry[ 0 ] ).toISOString(),
            value: entry[ 1 ]
            }

            return result
            } )
            }
            } catch( error ) {
            struct.status = false
            struct.messages.push( `Error fetching SMARD data: ${error.message}` )
            }

            return { struct }
        }
    }
} )
