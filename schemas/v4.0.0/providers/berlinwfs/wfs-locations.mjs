// Migrated from v1.2.0 -> v2.0.0
// Category: simple

export const main = {
    namespace: 'berlinwfs',
    name: 'Berlin WFS Locations API',
    description: 'Access to Berlin geographic data including dog parks and BBQ areas via WFS services',
    version: '4.0.0',
    docs: ['https://gdi.berlin.de/'],
    tags: ['berlin', 'geodata', 'opendata', 'cacheTtlDaily'],
    root: 'https://gdi.berlin.de',
    tools: {
        dog_parks: {
            method: 'GET',
            path: '/services/wfs/hundefreilauf?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=hundefreilauf%3Ahundefreilauf&OUTPUTFORMAT=application/json',
            description: 'All dog parks (Hundefreilauefe) in Berlin as GeoJSON FeatureCollection via Berlin.de.',
            parameters: [],
            tests: [
                { _description: 'Get all dog parks in Berlin as GeoJSON' },
                { _description: 'Verify dog park data availability' },
                { _description: 'Check Hundefreilauf endpoint' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        type: { type: 'string' },
                        features: { type: 'array', items: { type: 'object', properties: { type: { type: 'string' }, id: { type: 'string' }, geometry: { type: 'object', properties: { type: { type: 'string' }, coordinates: { type: 'array' } } }, geometry_name: { type: 'string' }, properties: { type: 'object', properties: { gisid: { type: 'number' }, uid: { type: 'string' }, bezirk: { type: 'string' }, typ: { type: 'string' }, info: { type: 'string' }, adresse: { type: 'string' }, bezeich: { type: 'string' }, zustaendig: { type: 'string' }, datum: { type: 'string' } } }, bbox: { type: 'array', items: { type: 'number' } } } } },
                        totalFeatures: { type: 'number' },
                        numberMatched: { type: 'number' },
                        numberReturned: { type: 'number' },
                        timeStamp: { type: 'string' },
                        crs: { type: 'object', properties: { type: { type: 'string' }, properties: { type: 'object', properties: { name: { type: 'string' } } } } },
                        bbox: { type: 'array', items: { type: 'number' } }
                    }
                }
            },
        },
        bbq_areas: {
            method: 'GET',
            path: '/services/wfs/grillflaechen?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAMES=grillflaechen%3Agrillflaechen&OUTPUTFORMAT=application/json',
            description: 'All BBQ areas (Grillflaechen) in Berlin as GeoJSON FeatureCollection via Berlin.de.',
            parameters: [],
            tests: [
                { _description: 'Get all BBQ areas in Berlin as GeoJSON' },
                { _description: 'Verify BBQ area data availability' },
                { _description: 'Check Grillflaechen endpoint' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        type: { type: 'string' },
                        features: { type: 'array', items: { type: 'object', properties: { type: { type: 'string' }, id: { type: 'string' }, geometry: { type: 'object', properties: { type: { type: 'string' }, coordinates: { type: 'array' } } }, geometry_name: { type: 'string' }, properties: { type: 'object', properties: { uid: { type: 'string' }, bezirk: { type: 'string' }, bezeichn: { type: 'string' }, adresse: { type: 'string' }, grillarea: { type: 'string' }, gebuehr: { type: 'string' }, buchen: { type: 'string' }, regeln: { type: 'string' }, zustaendig: { type: 'string' }, datum: { type: 'string' } } }, bbox: { type: 'array', items: { type: 'number' } } } } },
                        totalFeatures: { type: 'number' },
                        numberMatched: { type: 'number' },
                        numberReturned: { type: 'number' },
                        timeStamp: { type: 'string' },
                        crs: { type: 'object', properties: { type: { type: 'string' }, properties: { type: 'object', properties: { name: { type: 'string' } } } } },
                        bbox: { type: 'array', items: { type: 'number' } }
                    }
                }
            },
        }
    }
}
