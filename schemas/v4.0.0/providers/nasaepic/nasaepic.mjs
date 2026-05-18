export const main = {
    namespace: 'nasaepic',
    name: 'NasaEpic',
    description: 'Access NASA EPIC (Earth Polychromatic Imaging Camera) full-disc Earth imagery from the DSCOVR satellite — natural color, enhanced color, aerosol, and cloud imagery with metadata and spatial coordinates.',
    docs: ['https://epic.gsfc.nasa.gov/about/api', 'https://api.nasa.gov/'],
    tags: ['nasa', 'earth', 'satellite', 'images', 'science', 'climate', 'cacheTtlDaily'],
    version: '4.0.0',
    root: 'https://api.nasa.gov',
    requiredServerParams: ['API_DATA_GOV_KEY'],
    headers: {},
    tools: {
        getNaturalLatest: {
            method: 'GET',
            description: 'Get the most recent natural color full-disc Earth images from DSCOVR EPIC camera. Returns image metadata including filename, caption, capture date, Earth centroid coordinates, and satellite position data. via nasaepic.',
            path: '/EPIC/api/natural',
            parameters: [
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get the latest natural color Earth images from EPIC' }
            ],
        },
        getNaturalByDate: {
            method: 'GET',
            description: 'Get natural color full-disc Earth images captured on a specific date. Returns all images for that date with metadata, centroid coordinates, and DSCOVR satellite position. via nasaepic.',
            path: '/EPIC/api/natural/date/:date',
            parameters: [
                { position: { key: 'date', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get natural color Earth images for New Year\'s Day 2024', date: '2024-01-01' },
                { _description: 'Get natural color Earth images for the summer solstice 2023', date: '2023-06-21' }
            ],
        },
        getEnhancedLatest: {
            method: 'GET',
            description: 'Get the most recent enhanced color full-disc Earth images. Enhanced imagery uses different band combinations to highlight vegetation, oceans, and atmospheric features. via nasaepic.',
            path: '/EPIC/api/enhanced',
            parameters: [
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get the latest enhanced color Earth images from EPIC' }
            ],
        },
        getEnhancedByDate: {
            method: 'GET',
            description: 'Get enhanced color full-disc Earth images captured on a specific date. Returns image filenames to construct full archive URLs for PNG, JPG, or thumbnail access. via nasaepic.',
            path: '/EPIC/api/enhanced/date/:date',
            parameters: [
                { position: { key: 'date', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get enhanced color Earth images for Earth Day 2024', date: '2024-04-22' },
                { _description: 'Get enhanced Earth images for the winter solstice 2023', date: '2023-12-21' }
            ],
        },
        getAvailableDates: {
            method: 'GET',
            description: 'Get a list of all dates for which natural color EPIC imagery is available since June 2015. Use returned dates to query specific imagery. via nasaepic.',
            path: '/EPIC/api/natural/all',
            parameters: [
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get all available dates for natural color EPIC imagery' }
            ],
        }
    },
}
