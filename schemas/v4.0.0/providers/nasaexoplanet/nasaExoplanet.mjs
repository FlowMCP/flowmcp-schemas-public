export const main = {
    namespace: 'nasaexoplanet',
    name: 'NASA Exoplanet Archive',
    description: 'Query the NASA Exoplanet Archive via TAP/ADQL — search 6100+ confirmed exoplanets by name, discovery method, year, habitability criteria, and stellar properties.',
    version: '4.0.0',
    docs: ['https://exoplanetarchive.ipac.caltech.edu/docs/TAP/usingTAP.html', 'https://exoplanetarchive.ipac.caltech.edu/docs/API_PS_columns.html'],
    tags: ['astronomy', 'exoplanets', 'nasa', 'opendata', 'cacheTtlDaily'],
    root: 'https://exoplanetarchive.ipac.caltech.edu',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchByName: {
            method: 'GET',
            path: '/TAP/sync',
            description: 'Search exoplanets by planet name or host star name. Returns planet name, host star, discovery year, method, orbital period, mass, and radius.',
            parameters: [
                { position: { key: 'REQUEST', value: 'doQuery', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'LANG', value: 'ADQL', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'FORMAT', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'QUERY', value: 'SELECT DISTINCT pl_name,hostname,disc_year,discoverymethod,pl_orbper,pl_massj,pl_radj,pl_eqt,sy_dist FROM ps WHERE pl_name LIKE \'%{{SEARCH_TERM}}%\' OR hostname LIKE \'%{{SEARCH_TERM}}%\'', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Search for Kepler exoplanets', SEARCH_TERM: 'Kepler-22' },
                { _description: 'Search for TRAPPIST system', SEARCH_TERM: 'TRAPPIST' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Array of matching exoplanet records',
                    items: {
                        type: 'object',
                        properties: {
                            pl_name: { type: 'string', description: 'Planet name' },
                            hostname: { type: 'string', description: 'Host star name' },
                            disc_year: { type: 'number', description: 'Discovery year' },
                            discoverymethod: { type: 'string', description: 'Discovery method (Transit, Radial Velocity, etc.)' },
                            pl_orbper: { type: 'number', description: 'Orbital period in days' },
                            pl_massj: { type: 'number', description: 'Planet mass in Jupiter masses' },
                            pl_radj: { type: 'number', description: 'Planet radius in Jupiter radii' },
                            pl_eqt: { type: 'number', description: 'Equilibrium temperature in Kelvin' },
                            sy_dist: { type: 'number', description: 'Distance from Earth in parsecs' }
                        }
                    }
                }
            }
        },
        recentDiscoveries: {
            method: 'GET',
            path: '/TAP/sync',
            description: 'Get the most recently discovered exoplanets, sorted by discovery year descending. Returns key planetary and stellar parameters.',
            parameters: [
                { position: { key: 'REQUEST', value: 'doQuery', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'LANG', value: 'ADQL', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'FORMAT', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'QUERY', value: 'SELECT TOP {{LIMIT}} pl_name,hostname,disc_year,discoverymethod,disc_facility,pl_orbper,pl_massj,pl_radj,pl_eqt,sy_dist FROM ps WHERE disc_year IS NOT NULL ORDER BY disc_year DESC,pl_name ASC', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get 20 most recently discovered exoplanets', LIMIT: '20' },
                { _description: 'Get 50 most recently discovered exoplanets', LIMIT: '50' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Array of recently discovered exoplanet records sorted by discovery year',
                    items: {
                        type: 'object',
                        properties: {
                            pl_name: { type: 'string', description: 'Planet name' },
                            hostname: { type: 'string', description: 'Host star name' },
                            disc_year: { type: 'number', description: 'Discovery year' },
                            discoverymethod: { type: 'string', description: 'Discovery method' },
                            disc_facility: { type: 'string', description: 'Discovery facility' },
                            pl_orbper: { type: 'number', description: 'Orbital period in days' },
                            pl_massj: { type: 'number', description: 'Planet mass in Jupiter masses' },
                            pl_radj: { type: 'number', description: 'Planet radius in Jupiter radii' },
                            pl_eqt: { type: 'number', description: 'Equilibrium temperature in Kelvin' },
                            sy_dist: { type: 'number', description: 'Distance in parsecs' }
                        }
                    }
                }
            }
        },
        habitableZoneCandidates: {
            method: 'GET',
            path: '/TAP/sync',
            description: 'Find potentially habitable exoplanets by filtering for Earth-like equilibrium temperature (180-310 K) and radius (0.5-2.0 Earth radii).',
            parameters: [
                { position: { key: 'REQUEST', value: 'doQuery', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'LANG', value: 'ADQL', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'FORMAT', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'QUERY', value: 'SELECT DISTINCT pl_name,hostname,disc_year,discoverymethod,pl_orbper,pl_masse,pl_rade,pl_eqt,st_teff,sy_dist FROM ps WHERE pl_eqt BETWEEN {{TEMP_MIN}} AND {{TEMP_MAX}} AND pl_rade BETWEEN {{RADIUS_MIN}} AND {{RADIUS_MAX}} ORDER BY pl_eqt ASC', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Earth-like habitable zone candidates (180-310K, 0.5-2.0 Re)', TEMP_MIN: '180', TEMP_MAX: '310', RADIUS_MIN: '0.5', RADIUS_MAX: '2.0' },
                { _description: 'Broader habitable zone search (150-350K, 0.3-3.0 Re)', TEMP_MIN: '150', TEMP_MAX: '350', RADIUS_MIN: '0.3', RADIUS_MAX: '3.0' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Array of habitable zone candidate exoplanets',
                    items: {
                        type: 'object',
                        properties: {
                            pl_name: { type: 'string', description: 'Planet name' },
                            hostname: { type: 'string', description: 'Host star name' },
                            disc_year: { type: 'number', description: 'Discovery year' },
                            discoverymethod: { type: 'string', description: 'Discovery method' },
                            pl_orbper: { type: 'number', description: 'Orbital period in days' },
                            pl_masse: { type: 'number', description: 'Planet mass in Earth masses' },
                            pl_rade: { type: 'number', description: 'Planet radius in Earth radii' },
                            pl_eqt: { type: 'number', description: 'Equilibrium temperature in Kelvin' },
                            st_teff: { type: 'number', description: 'Stellar effective temperature in Kelvin' },
                            sy_dist: { type: 'number', description: 'Distance in parsecs' }
                        }
                    }
                }
            }
        },
        byDiscoveryMethod: {
            method: 'GET',
            path: '/TAP/sync',
            description: 'Get exoplanets discovered by a specific method (Transit, Radial Velocity, Imaging, Microlensing, etc.).',
            parameters: [
                { position: { key: 'REQUEST', value: 'doQuery', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'LANG', value: 'ADQL', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'FORMAT', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'QUERY', value: 'SELECT TOP {{LIMIT}} pl_name,hostname,disc_year,discoverymethod,disc_facility,pl_orbper,pl_massj,pl_radj,pl_eqt FROM ps WHERE discoverymethod=\'{{METHOD}}\' ORDER BY disc_year DESC', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get 20 exoplanets discovered by Transit', METHOD: 'Transit', LIMIT: '20' },
                { _description: 'Get 20 exoplanets discovered by Radial Velocity', METHOD: 'Radial Velocity', LIMIT: '20' },
                { _description: 'Get 10 exoplanets discovered by Imaging', METHOD: 'Imaging', LIMIT: '10' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Array of exoplanets discovered by the specified method',
                    items: {
                        type: 'object',
                        properties: {
                            pl_name: { type: 'string', description: 'Planet name' },
                            hostname: { type: 'string', description: 'Host star name' },
                            disc_year: { type: 'number', description: 'Discovery year' },
                            discoverymethod: { type: 'string', description: 'Discovery method' },
                            disc_facility: { type: 'string', description: 'Discovery facility' },
                            pl_orbper: { type: 'number', description: 'Orbital period in days' },
                            pl_massj: { type: 'number', description: 'Planet mass in Jupiter masses' },
                            pl_radj: { type: 'number', description: 'Planet radius in Jupiter radii' },
                            pl_eqt: { type: 'number', description: 'Equilibrium temperature in Kelvin' }
                        }
                    }
                }
            }
        },
        stellarHosts: {
            method: 'GET',
            path: '/TAP/sync',
            description: 'Get stellar host properties for systems with exoplanets. Returns effective temperature, luminosity, metallicity, and number of planets per star.',
            parameters: [
                { position: { key: 'REQUEST', value: 'doQuery', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'LANG', value: 'ADQL', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'FORMAT', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'QUERY', value: 'SELECT TOP {{LIMIT}} hostname,st_teff,st_rad,st_mass,st_met,st_lum,sy_dist,sy_pnum FROM stellarhosts ORDER BY sy_pnum DESC', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get 20 stellar hosts with most planets', LIMIT: '20' },
                { _description: 'Get top 50 stellar hosts', LIMIT: '50' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Array of stellar host records sorted by number of planets',
                    items: {
                        type: 'object',
                        properties: {
                            hostname: { type: 'string', description: 'Host star name' },
                            st_teff: { type: 'number', description: 'Stellar effective temperature in Kelvin' },
                            st_rad: { type: 'number', description: 'Stellar radius in solar radii' },
                            st_mass: { type: 'number', description: 'Stellar mass in solar masses' },
                            st_met: { type: 'number', description: 'Stellar metallicity [Fe/H]' },
                            st_lum: { type: 'number', description: 'Stellar luminosity in log solar luminosities' },
                            sy_dist: { type: 'number', description: 'Distance in parsecs' },
                            sy_pnum: { type: 'number', description: 'Number of planets in system' }
                        }
                    }
                }
            }
        },
        discoveryStatistics: {
            method: 'GET',
            path: '/TAP/sync',
            description: 'Get exoplanet discovery statistics grouped by year and method. Returns the count of confirmed planets per year and discovery method.',
            parameters: [
                { position: { key: 'REQUEST', value: 'doQuery', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'LANG', value: 'ADQL', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'FORMAT', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'QUERY', value: 'SELECT disc_year,discoverymethod,COUNT(*) AS planet_count FROM ps WHERE disc_year IS NOT NULL AND disc_year >= {{YEAR_MIN}} GROUP BY disc_year,discoverymethod ORDER BY disc_year DESC,planet_count DESC', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Discovery statistics from 2020 onward', YEAR_MIN: '2020' },
                { _description: 'Discovery statistics from 2000 onward', YEAR_MIN: '2000' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Array of discovery statistics grouped by year and method',
                    items: {
                        type: 'object',
                        properties: {
                            disc_year: { type: 'number', description: 'Discovery year' },
                            discoverymethod: { type: 'string', description: 'Discovery method' },
                            planet_count: { type: 'number', description: 'Number of planets discovered' }
                        }
                    }
                }
            }
        },
        coneSearch: {
            method: 'GET',
            path: '/TAP/sync',
            description: 'Search exoplanets within a circular sky region defined by right ascension, declination, and angular radius in degrees.',
            parameters: [
                { position: { key: 'REQUEST', value: 'doQuery', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'LANG', value: 'ADQL', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'FORMAT', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'QUERY', value: 'SELECT DISTINCT pl_name,hostname,ra,dec,disc_year,discoverymethod,pl_orbper,pl_massj,pl_radj,sy_dist FROM ps WHERE CONTAINS(POINT(\'ICRS\',ra,dec),CIRCLE(\'ICRS\',{{RA}},{{DEC}},{{RADIUS}}))=1 ORDER BY sy_dist ASC', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Search exoplanets within 5 degrees of Kepler field center', RA: '290.67', DEC: '44.5', RADIUS: '5' },
                { _description: 'Search exoplanets near Orion Nebula region', RA: '83.82', DEC: '-5.39', RADIUS: '3' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Array of exoplanets within the specified sky region',
                    items: {
                        type: 'object',
                        properties: {
                            pl_name: { type: 'string', description: 'Planet name' },
                            hostname: { type: 'string', description: 'Host star name' },
                            ra: { type: 'number', description: 'Right ascension in degrees' },
                            dec: { type: 'number', description: 'Declination in degrees' },
                            disc_year: { type: 'number', description: 'Discovery year' },
                            discoverymethod: { type: 'string', description: 'Discovery method' },
                            pl_orbper: { type: 'number', description: 'Orbital period in days' },
                            pl_massj: { type: 'number', description: 'Planet mass in Jupiter masses' },
                            pl_radj: { type: 'number', description: 'Planet radius in Jupiter radii' },
                            sy_dist: { type: 'number', description: 'Distance in parsecs' }
                        }
                    }
                }
            }
        }
    }
}
