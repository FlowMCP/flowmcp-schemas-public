export const main = {
    namespace: 'nasaapod',
    name: 'NasaApod',
    description: 'Access NASA Astronomy Picture of the Day — retrieve daily space images with titles, explanations, and high-resolution URLs since 1995.',
    version: '4.0.0',
    docs: ['https://github.com/nasa/apod-api', 'https://api.nasa.gov/'],
    tags: ['nasa', 'astronomy', 'space', 'images', 'science', 'cacheTtlDaily'],
    root: 'https://api.nasa.gov',
    requiredServerParams: ['API_DATA_GOV_KEY'],
    headers: {},
    tools: {
        getApod: {
            method: 'GET',
            path: '/planetary/apod',
            description: 'Get the Astronomy Picture of the Day for a specific date, including title, explanation, image URL, and optional HD URL.',
            parameters: [
                { position: { key: 'date', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'hd', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(false)'] } },
                { position: { key: 'thumbs', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(false)'] } },
                { position: { key: 'concept_tags', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(false)'] } },
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get the Astronomy Picture of the Day for today', date: '2024-07-04' },
                { _description: 'Get APOD for a specific historic date', date: '2024-07-04' },
                { _description: 'Get APOD with HD image for another date', date: '2023-12-25', hd: true }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        date: { type: 'string', description: 'Date of the APOD in YYYY-MM-DD format' },
                        title: { type: 'string', description: 'Title of the image' },
                        explanation: { type: 'string', description: 'Descriptive text about the image' },
                        url: { type: 'string', description: 'URL of the image or video' },
                        hdurl: { type: 'string', description: 'URL of the high-resolution image' },
                        media_type: { type: 'string', description: 'Type of media: image or video' },
                        copyright: { type: 'string', description: 'Copyright attribution if applicable' },
                        service_version: { type: 'string', description: 'API service version used' }
                    }
                }
            }
        },
        getApodRange: {
            method: 'GET',
            path: '/planetary/apod',
            description: 'Get a range of Astronomy Pictures of the Day between two dates (max 7 days recommended).',
            parameters: [
                { position: { key: 'start_date', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'end_date', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'thumbs', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(false)'] } },
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get APODs for a week in January 2024', start_date: '2024-01-01', end_date: '2024-01-07' },
                { _description: 'Get APODs for a 3-day range with thumbnails', start_date: '2023-06-15', end_date: '2023-06-17', thumbs: true }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Array of APOD records for the requested date range',
                    items: {
                        type: 'object',
                        properties: {
                            date: { type: 'string', description: 'Date of the APOD' },
                            title: { type: 'string', description: 'Title of the image' },
                            url: { type: 'string', description: 'URL of the image or video' },
                            media_type: { type: 'string', description: 'Type: image or video' }
                        }
                    }
                }
            }
        },
        getApodRandom: {
            method: 'GET',
            path: '/planetary/apod',
            description: 'Get a set of randomly selected Astronomy Pictures of the Day from the full archive.',
            parameters: [
                { position: { key: 'count', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'default(1)'] } },
                { position: { key: 'thumbs', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(false)'] } },
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get 5 random APOD images', count: 5 },
                { _description: 'Get 3 random APODs including video thumbnails', count: 3, thumbs: true }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Array of randomly selected APOD records',
                    items: {
                        type: 'object',
                        properties: {
                            date: { type: 'string', description: 'Date of the APOD' },
                            title: { type: 'string', description: 'Title of the image' },
                            url: { type: 'string', description: 'Image or video URL' },
                            explanation: { type: 'string', description: 'Descriptive text' }
                        }
                    }
                }
            }
        }
    }
}
