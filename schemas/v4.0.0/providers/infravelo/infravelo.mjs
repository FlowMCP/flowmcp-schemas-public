export const main = {
    namespace: 'infravelo',
    name: 'infraVelo - Berlin Cycling Infrastructure',
    description: 'Access Berlin cycling infrastructure project data from infraVelo. Get details on bike lanes, parking facilities, traffic signals, and infrastructure projects with geographic coordinates, status, milestones, and costs. GeoJSON format. Free, no API key required. License: dl-de/by-2-0.',
    version: '4.0.0',
    docs: ['https://www.infravelo.de/api/', 'https://www.infravelo.de/api/description/'],
    tags: ['cycling', 'infrastructure', 'berlin', 'germany', 'geojson', 'open-data', 'cacheTtlDaily'],
    root: 'https://www.infravelo.de/api/v1',
    requiredServerParams: [],
    headers: {},
    tools: {
        getAllProjects: {
            method: 'GET',
            path: '/projects/collections/projekte/',
            description: 'Get all cycling infrastructure projects in Berlin as GeoJSON FeatureCollection. Includes bike lanes, parking, traffic signals with coordinates, status, district, and cost info. Use getProjectsByDistrict to filter by a specific Berlin district.',
            parameters: [],
            tests: [
                { _description: 'Get all Berlin cycling projects' },
                { _description: 'Retrieve complete project catalog' },
                { _description: 'Get full cycling infrastructure overview' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'GeoJSON FeatureCollection of all Berlin cycling infrastructure projects',
                    properties: {
                        type: { type: 'string', description: 'GeoJSON type, always FeatureCollection' },
                        features: {
                            type: 'array',
                            description: 'Array of GeoJSON Feature objects, each representing one infrastructure project',
                            items: {
                                type: 'object',
                                properties: {
                                    type: { type: 'string', description: 'GeoJSON type, always Feature' },
                                    geometry: { type: 'object', description: 'GeoJSON geometry with coordinates (Point, LineString, or Polygon)' },
                                    properties: { type: 'object', description: 'Project metadata attributes', properties: { title: { type: 'string', description: 'Project title/name' }, district: { type: 'string', description: 'Berlin district (Bezirk) name, use as parameter for getProjectsByDistrict' }, status: { type: 'string', description: 'Current project status (e.g. in Planung, in Bau, fertiggestellt)' }, project_type: { type: 'string', description: 'Infrastructure type: Radverkehrsanlage, Fahrradparken, Lichtsignalanlage, etc.' } } }
                                }
                            }
                        }
                    }
                }
            }
        },
        getProjectsByDistrict: {
            method: 'GET',
            path: '/projects/district/:district/',
            description: 'Get cycling infrastructure projects filtered by Berlin district (Bezirk). Returns GeoJSON FeatureCollection. Use getAllProjects to see available district names.',
            parameters: [
                { position: { key: 'district', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] }, description: 'Berlin district slug in lowercase with hyphens (e.g. mitte, friedrichshain-kreuzberg, charlottenburg-wilmersdorf)' }
            ],
            tests: [
                { _description: 'Get Mitte projects', district: 'mitte' },
                { _description: 'Get Friedrichshain-Kreuzberg projects', district: 'friedrichshain-kreuzberg' },
                { _description: 'Get Charlottenburg-Wilmersdorf projects', district: 'charlottenburg-wilmersdorf' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'GeoJSON FeatureCollection of cycling projects in the specified Berlin district',
                    properties: {
                        type: { type: 'string', description: 'GeoJSON type, always FeatureCollection' },
                        features: { type: 'array', description: 'Array of GeoJSON Feature objects for projects in this district', items: { type: 'object', description: 'GeoJSON Feature with geometry and project properties' } }
                    }
                }
            }
        }
    }
}
