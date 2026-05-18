// Schema for #144 -- Berlin Schools (Schulen) via WFS GeoJSON
// No API key required -- public Berlin GDI service

export const main = {
    namespace: 'berlin',
    name: 'Berlin Schools',
    description: 'Query Berlin school locations and details via public WFS GeoJSON API. Returns school name, type, district, address and contact info. No API key required.',
    version: '4.0.0',
    docs: ['https://gdi.berlin.de/viewer/schulen/'],
    tags: ['berlin', 'education', 'geojson', 'government', 'cacheTtlDaily'],
    root: 'https://gdi.berlin.de/services/wfs/schulen',
    tools: {
        getSchools: {
            method: 'GET',
            path: '/?service=WFS&version=2.0.0&request=GetFeature&typeNames=schulen&outputFormat=application/json',
            description: 'Get Berlin schools as GeoJSON. Returns school name, type (Grundschule, Gymnasium, etc.), district, address and contact. Use count to limit results.',
            parameters: [
                { position: { key: 'count', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(50)', 'max(1000)'] }, description: 'Maximum number of school features to return (1-1000, default 50)' },
                { position: { key: 'startIndex', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(0)'] }, description: 'Offset index for pagination, starting at 0' }
            ],
            output: { mimeType: 'application/json', schema: { type: 'object', properties: { type: { type: 'string' }, features: { type: 'array', items: { type: 'object', properties: { type: { type: 'string' }, id: { type: 'string' }, geometry: { type: 'object', properties: { type: { type: 'string' }, coordinates: { type: 'array' } } }, geometry_name: { type: 'string' }, properties: { type: 'object', properties: { bsn: { type: 'string' }, schulname: { type: 'string' }, schulart: { type: 'string' }, traeger: { type: 'string' }, schultyp: { type: 'string' }, bezirk: { type: 'string' }, ortsteil: { type: 'string' }, plz: { type: 'string' }, strasse: { type: 'string' }, hausnr: { type: 'string' }, telefon: { type: 'string' }, fax: { type: 'string' }, email: { type: 'string' }, internet: { type: 'string' }, schuljahr: { type: 'string' } } }, bbox: { type: 'array', items: { type: 'number' } } } } }, totalFeatures: { type: 'number' } } } },
            tests: [
                { _description: 'First 10 Berlin schools', count: 10 },
                { _description: 'Schools page 2', count: 10, startIndex: 10 },
                { _description: 'First 5 Berlin schools', count: 5 }
            ],
        }
    }
}
