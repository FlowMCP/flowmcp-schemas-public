// Migrated from v1.2.0 -> v2.0.0
// Category: simple

export const main = {
    namespace: 'geoapify',
    name: 'Geoapify Geocoding',
    description: 'Forward geocoding, reverse geocoding, and address autocomplete via Geoapify — convert addresses to coordinates, coordinates to addresses, and type-ahead suggestions.',
    version: '4.0.0',
    docs: ['https://apidocs.geoapify.com/docs/geocoding/'],
    tags: ['geocoding', 'maps', 'places', 'cacheTtlDaily'],
    root: 'https://api.geoapify.com',
    requiredServerParams: ['GEOAPIFY_API_KEY'],
    tools: {
        forwardGeocode: {
            method: 'GET',
            path: '/v1/geocode/search?apiKey={{GEOAPIFY_API_KEY}}',
            description: 'Convert an address or place name into geographic coordinates. Required: text. Optional filters: lang, limit. Use autocomplete for type-ahead suggestions before calling this tool.',
            parameters: [
                { position: { key: 'text', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lang', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(50)', 'optional()'] } }
            ],
            output: {mimeType:'application/json',schema:{type:'object',description:'GeoJSON FeatureCollection with geocoding results',properties:{type:{type:'string',description:'Always "FeatureCollection"'},features:{type:'array',description:'Array of GeoJSON Feature objects, one per matched location',items:{type:'object',properties:{type:{type:'string',description:'Always "Feature"'},properties:{type:'object',description:'Structured address fields including name, street, city, state, country, postcode, formatted address, and result confidence'},geometry:{type:'object',description:'GeoJSON Point geometry with coordinates',properties:{type:{type:'string',description:'Always "Point"'},coordinates:{type:'array',description:'[longitude, latitude] coordinate pair',items:{type:'number'}}}}}}}}}},
            tests: [
                { _description: 'Geocode Berlin address', text: 'Brandenburger Tor, Berlin' },
                { _description: 'Geocode with language', text: 'Eiffel Tower, Paris', lang: 'en', limit: 3 }
            ],
        },
        reverseGeocode: {
            method: 'GET',
            path: '/v1/geocode/reverse?apiKey={{GEOAPIFY_API_KEY}}',
            description: 'Convert geographic coordinates into an address via Geoapify. Returns the same GeoJSON FeatureCollection format as forwardGeocode.',
            parameters: [
                { position: { key: 'lat', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(-90)', 'max(90)'] } },
                { position: { key: 'lon', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(-180)', 'max(180)'] } }
            ],
            output: {mimeType:'application/json',schema:{type:'object',description:'GeoJSON FeatureCollection with reverse geocoding result',properties:{type:{type:'string',description:'Always "FeatureCollection"'},features:{type:'array',description:'Array of GeoJSON Feature objects (usually one for reverse geocoding)',items:{type:'object',properties:{type:{type:'string',description:'Always "Feature"'},properties:{type:'object',description:'Structured address fields including name, street, city, country, postcode, and formatted address'},geometry:{type:'object',description:'GeoJSON Point geometry'}}}}}}},
            tests: [
                { _description: 'Reverse geocode Berlin coordinates', lat: 52.5163, lon: 13.3777 }
            ],
        },
        autocomplete: {
            method: 'GET',
            path: '/v1/geocode/autocomplete?apiKey={{GEOAPIFY_API_KEY}}',
            description: 'Get address suggestions as you type for autocomplete functionality. Required: text. Optional filters: lang, limit. Provides partial-match suggestions suitable for use with forwardGeocode.',
            parameters: [
                { position: { key: 'text', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'lang', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'limit', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(50)', 'optional()'] } }
            ],
            output: {mimeType:'application/json',schema:{type:'object',description:'GeoJSON FeatureCollection with autocomplete suggestions',properties:{type:{type:'string',description:'Always "FeatureCollection"'},features:{type:'array',description:'Array of GeoJSON Feature objects representing address suggestions',items:{type:'object',properties:{type:{type:'string',description:'Always "Feature"'},properties:{type:'object',description:'Suggested address fields including formatted address, city, country, and match confidence'},geometry:{type:'object',description:'GeoJSON Point geometry for the suggestion'}}}}}}},
            tests: [
                { _description: 'Autocomplete Berlin address', text: 'Alexanderpl' },
                { _description: 'Autocomplete with limit', text: 'Münch', lang: 'de', limit: 5 }
            ],
        }
    }
}
