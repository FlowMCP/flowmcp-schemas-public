export const main = {
    namespace: 'geonames',
    name: 'GeoNames',
    description: 'Access 11M+ geographic names, postal codes, elevations, and timezone data. Search places, reverse geocode coordinates, and retrieve country information.',
    version: '4.0.0',
    docs: ['https://www.geonames.org/export/web-services.html'],
    tags: ['geography', 'geocoding', 'places', 'postalcodes', 'timezone', 'elevation', 'cacheTtlDaily'],
    root: 'https://secure.geonames.org',
    requiredServerParams: ['GEONAMES_USERNAME'],
    headers: {},
    tools: {
        search: {
            method: 'GET',
            path: '/searchJSON',
            description: 'Full text search over all GeoNames attributes including place name, country name, and admin codes. Returns matching places with coordinates and metadata. Use get for related data. Use postalCodeSearch for related data.',
            parameters: [
                {
                    position: {
                        key: 'q',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'name',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'name_equals',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'country',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'featureClass',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'enum(A,H,L,P,R,S,T,U,V)',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'featureCode',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'lang',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'style',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'enum(SHORT,MEDIUM,LONG,FULL)',
                        options: ['optional()', 'default(MEDIUM)']
                    }
                },
                {
                    position: {
                        key: 'maxRows',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(10)']
                    }
                },
                {
                    position: {
                        key: 'startRow',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(0)']
                    }
                },
                {
                    position: {
                        key: 'orderby',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'enum(population,elevation,relevance)',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'username',
                        value: '{{GEONAMES_USERNAME}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                }
            ],
            tests: [
                {
                    _description: 'Search for Berlin',
                    q: 'Berlin',
                    maxRows: 5
                },
                {
                    _description: 'Search for cities in Japan',
                    q: 'Tokyo',
                    country: 'JP',
                    maxRows: 3
                },
                {
                    _description: 'Search for mountains in Switzerland',
                    q: 'Matterhorn',
                    country: 'CH',
                    featureClass: 'T',
                    maxRows: 3
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        totalResultsCount: {
                            type: 'number',
                            description: 'TotalResultsCount numeric value'
                        },
                        geonames: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    geonameId: {
                                        type: 'number',
                                        description: 'GeonameId numeric value'
                                    },
                                    name: {
                                        type: 'string',
                                        description: 'Display name'
                                    },
                                    toponymName: {
                                        type: 'string',
                                        description: 'ToponymName value'
                                    },
                                    lat: {
                                        type: 'string',
                                        description: 'Geographic latitude'
                                    },
                                    lng: {
                                        type: 'string',
                                        description: 'Geographic longitude'
                                    },
                                    countryCode: {
                                        type: 'string',
                                        description: 'ISO country code'
                                    },
                                    countryName: {
                                        type: 'string',
                                        description: 'CountryName value'
                                    },
                                    population: {
                                        type: 'number',
                                        description: 'Population numeric value'
                                    },
                                    fcl: {
                                        type: 'string',
                                        description: 'Fcl value'
                                    },
                                    fcode: {
                                        type: 'string',
                                        description: 'Fcode value'
                                    },
                                    adminName1: {
                                        type: 'string',
                                        description: 'AdminName1 value'
                                    }
                                },
                                description: 'Individual item in the geonames collection'
                            },
                            description: 'Collection of geonames items'
                        }
                    }
                }
            }
        },
        get: {
            method: 'GET',
            path: '/getJSON',
            description: 'Retrieve detailed attributes for a specific geographic feature by its GeoNames ID. Use search for related data. Use postalCodeSearch for related data.',
            parameters: [
                {
                    position: {
                        key: 'geonameId',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'lang',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'style',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'enum(SHORT,MEDIUM,LONG,FULL)',
                        options: ['optional()', 'default(MEDIUM)']
                    }
                },
                {
                    position: {
                        key: 'username',
                        value: '{{GEONAMES_USERNAME}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                }
            ],
            tests: [
                {
                    _description: 'Get details for Berlin (geonameId 2950159)',
                    geonameId: 2950159
                },
                {
                    _description: 'Get details for Tokyo with full style',
                    geonameId: 1850147,
                    style: 'FULL'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        geonameId: {
                            type: 'number',
                            description: 'GeonameId numeric value'
                        },
                        name: {
                            type: 'string',
                            description: 'Display name'
                        },
                        toponymName: {
                            type: 'string',
                            description: 'ToponymName value'
                        },
                        lat: {
                            type: 'string',
                            description: 'Geographic latitude'
                        },
                        lng: {
                            type: 'string',
                            description: 'Geographic longitude'
                        },
                        countryCode: {
                            type: 'string',
                            description: 'ISO country code'
                        },
                        countryName: {
                            type: 'string',
                            description: 'CountryName value'
                        },
                        population: {
                            type: 'number',
                            description: 'Population numeric value'
                        },
                        elevation: {
                            type: 'number',
                            description: 'Elevation numeric value'
                        },
                        fcl: {
                            type: 'string',
                            description: 'Fcl value'
                        },
                        fcode: {
                            type: 'string',
                            description: 'Fcode value'
                        },
                        adminName1: {
                            type: 'string',
                            description: 'AdminName1 value'
                        },
                        adminCode1: {
                            type: 'string',
                            description: 'AdminCode1 value'
                        },
                        timezone: {
                            type: 'object',
                            properties: {
                                gmtOffset: {
                                    type: 'number',
                                    description: 'GmtOffset numeric value'
                                },
                                timeZoneId: {
                                    type: 'string',
                                    description: 'TimeZoneId value'
                                },
                                dstOffset: {
                                    type: 'number',
                                    description: 'DstOffset numeric value'
                                }
                            },
                            description: 'Timezone details'
                        }
                    }
                }
            }
        },
        postalCodeSearch: {
            method: 'GET',
            path: '/postalCodeSearchJSON',
            description: 'Search for postal codes and associated places by postal code or location name. Use search for related data. Use get for related data.',
            parameters: [
                {
                    position: {
                        key: 'postalcode',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'placename',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'country',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'maxRows',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(10)']
                    }
                },
                {
                    position: {
                        key: 'style',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'enum(SHORT,MEDIUM,LONG,FULL)',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'username',
                        value: '{{GEONAMES_USERNAME}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                }
            ],
            tests: [
                {
                    _description: 'Search for postal code 10115 in Germany',
                    postalcode: '10115',
                    country: 'DE',
                    maxRows: 5
                },
                {
                    _description: 'Search for postal codes in Zurich',
                    placename: 'Zurich',
                    country: 'CH',
                    maxRows: 5
                },
                {
                    _description: 'Search for US postal code 90210',
                    postalcode: '90210',
                    country: 'US',
                    maxRows: 3
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        postalCodes: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    postalCode: {
                                        type: 'string',
                                        description: 'PostalCode value'
                                    },
                                    placeName: {
                                        type: 'string',
                                        description: 'PlaceName value'
                                    },
                                    countryCode: {
                                        type: 'string',
                                        description: 'ISO country code'
                                    },
                                    lat: {
                                        type: 'number',
                                        description: 'Geographic latitude'
                                    },
                                    lng: {
                                        type: 'number',
                                        description: 'Geographic longitude'
                                    },
                                    adminName1: {
                                        type: 'string',
                                        description: 'AdminName1 value'
                                    },
                                    adminCode1: {
                                        type: 'string',
                                        description: 'AdminCode1 value'
                                    },
                                    adminName2: {
                                        type: 'string',
                                        description: 'AdminName2 value'
                                    },
                                    adminCode2: {
                                        type: 'string',
                                        description: 'AdminCode2 value'
                                    }
                                },
                                description: 'Individual item in the postalCodes collection'
                            },
                            description: 'Collection of postalCodes items'
                        }
                    }
                }
            }
        },
        countryInfo: {
            method: 'GET',
            path: '/countryInfoJSON',
            description: 'Get country information including capital, population, area, bounding box, languages, and currency. Use search for related data. Use get for related data.',
            parameters: [
                {
                    position: {
                        key: 'country',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'lang',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'username',
                        value: '{{GEONAMES_USERNAME}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                }
            ],
            tests: [
                {
                    _description: 'Get info for Germany',
                    country: 'DE'
                },
                {
                    _description: 'Get info for Japan in English',
                    country: 'JP',
                    lang: 'en'
                },
                {
                    _description: 'Get info for all countries (no filter)',
                    lang: 'en'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        geonames: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    countryCode: {
                                        type: 'string',
                                        description: 'ISO country code'
                                    },
                                    countryName: {
                                        type: 'string',
                                        description: 'CountryName value'
                                    },
                                    capital: {
                                        type: 'string',
                                        description: 'Capital value'
                                    },
                                    population: {
                                        type: 'string',
                                        description: 'Population value'
                                    },
                                    areaInSqKm: {
                                        type: 'string',
                                        description: 'AreaInSqKm value'
                                    },
                                    continent: {
                                        type: 'string',
                                        description: 'Continent value'
                                    },
                                    currencyCode: {
                                        type: 'string',
                                        description: 'CurrencyCode value'
                                    },
                                    languages: {
                                        type: 'string',
                                        description: 'Languages value'
                                    },
                                    isoAlpha3: {
                                        type: 'string',
                                        description: 'IsoAlpha3 value'
                                    },
                                    geonameId: {
                                        type: 'number',
                                        description: 'GeonameId numeric value'
                                    },
                                    north: {
                                        type: 'number',
                                        description: 'North numeric value'
                                    },
                                    south: {
                                        type: 'number',
                                        description: 'South numeric value'
                                    },
                                    east: {
                                        type: 'number',
                                        description: 'East numeric value'
                                    },
                                    west: {
                                        type: 'number',
                                        description: 'West numeric value'
                                    }
                                },
                                description: 'Individual item in the geonames collection'
                            },
                            description: 'Collection of geonames items'
                        }
                    }
                }
            }
        },
        timezone: {
            method: 'GET',
            path: '/timezoneJSON',
            description: 'Get timezone information for coordinates including current time, sunrise/sunset, and GMT offset. Use search for related data. Use get for related data.',
            parameters: [
                {
                    position: {
                        key: 'lat',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'lng',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'radius',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'lang',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'date',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'username',
                        value: '{{GEONAMES_USERNAME}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                }
            ],
            tests: [
                {
                    _description: 'Timezone for Berlin coordinates',
                    lat: 52.52,
                    lng: 13.405
                },
                {
                    _description: 'Timezone for New York coordinates',
                    lat: 40.7128,
                    lng: -74.006
                },
                {
                    _description: 'Timezone for Tokyo coordinates',
                    lat: 35.6762,
                    lng: 139.6503
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        countryCode: {
                            type: 'string',
                            description: 'ISO country code'
                        },
                        countryName: {
                            type: 'string',
                            description: 'CountryName value'
                        },
                        timezoneId: {
                            type: 'string',
                            description: 'TimezoneId value'
                        },
                        time: {
                            type: 'string',
                            description: 'Time value'
                        },
                        sunrise: {
                            type: 'string',
                            description: 'Sunrise value'
                        },
                        sunset: {
                            type: 'string',
                            description: 'Sunset value'
                        },
                        rawOffset: {
                            type: 'number',
                            description: 'RawOffset numeric value'
                        },
                        gmtOffset: {
                            type: 'number',
                            description: 'GmtOffset numeric value'
                        },
                        dstOffset: {
                            type: 'number',
                            description: 'DstOffset numeric value'
                        },
                        lat: {
                            type: 'number',
                            description: 'Geographic latitude'
                        },
                        lng: {
                            type: 'number',
                            description: 'Geographic longitude'
                        }
                    }
                }
            }
        },
        findNearbyPlaceName: {
            method: 'GET',
            path: '/findNearbyPlaceNameJSON',
            description: 'Find the closest populated place for given coordinates. Reverse geocoding for place names. Use search for related data. Use get for related data.',
            parameters: [
                {
                    position: {
                        key: 'lat',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'lng',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'radius',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'maxRows',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(5)']
                    }
                },
                {
                    position: {
                        key: 'lang',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'style',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'enum(SHORT,MEDIUM,LONG,FULL)',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'username',
                        value: '{{GEONAMES_USERNAME}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                }
            ],
            tests: [
                {
                    _description: 'Find places near Eiffel Tower',
                    lat: 48.8584,
                    lng: 2.2945,
                    maxRows: 3
                },
                {
                    _description: 'Find places near Times Square',
                    lat: 40.758,
                    lng: -73.9855,
                    maxRows: 3
                },
                {
                    _description: 'Find places near Sydney Opera House',
                    lat: -33.8568,
                    lng: 151.2153,
                    maxRows: 3
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        geonames: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    geonameId: {
                                        type: 'number',
                                        description: 'GeonameId numeric value'
                                    },
                                    name: {
                                        type: 'string',
                                        description: 'Display name'
                                    },
                                    toponymName: {
                                        type: 'string',
                                        description: 'ToponymName value'
                                    },
                                    lat: {
                                        type: 'string',
                                        description: 'Geographic latitude'
                                    },
                                    lng: {
                                        type: 'string',
                                        description: 'Geographic longitude'
                                    },
                                    countryCode: {
                                        type: 'string',
                                        description: 'ISO country code'
                                    },
                                    countryName: {
                                        type: 'string',
                                        description: 'CountryName value'
                                    },
                                    distance: {
                                        type: 'string',
                                        description: 'Distance value'
                                    },
                                    fcl: {
                                        type: 'string',
                                        description: 'Fcl value'
                                    },
                                    fcode: {
                                        type: 'string',
                                        description: 'Fcode value'
                                    },
                                    adminName1: {
                                        type: 'string',
                                        description: 'AdminName1 value'
                                    }
                                },
                                description: 'Individual item in the geonames collection'
                            },
                            description: 'Collection of geonames items'
                        }
                    }
                }
            }
        },
        elevation: {
            method: 'GET',
            path: '/srtm3JSON',
            description: 'Get elevation data (SRTM3, ~90m resolution) for given coordinates. Returns elevation in meters. Use search for related data. Use get for related data.',
            parameters: [
                {
                    position: {
                        key: 'lat',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'lng',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'username',
                        value: '{{GEONAMES_USERNAME}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                }
            ],
            tests: [
                {
                    _description: 'Elevation at Mount Everest base',
                    lat: 27.9881,
                    lng: 86.925
                },
                {
                    _description: 'Elevation at Death Valley',
                    lat: 36.2326,
                    lng: -116.8168
                },
                {
                    _description: 'Elevation at Berlin',
                    lat: 52.52,
                    lng: 13.405
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        srtm3: {
                            type: 'number',
                            description: 'Srtm3 numeric value'
                        },
                        lat: {
                            type: 'number',
                            description: 'Geographic latitude'
                        },
                        lng: {
                            type: 'number',
                            description: 'Geographic longitude'
                        }
                    }
                }
            }
        },
        weather: {
            method: 'GET',
            path: '/findNearByWeatherJSON',
            description: 'Find the nearest weather station and its most recent weather observation for given coordinates. Use search for related data. Use get for related data.',
            parameters: [
                {
                    position: {
                        key: 'lat',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'lng',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'radius',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'username',
                        value: '{{GEONAMES_USERNAME}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                }
            ],
            tests: [
                {
                    _description: 'Weather near Berlin',
                    lat: 52.52,
                    lng: 13.405
                },
                {
                    _description: 'Weather near London',
                    lat: 51.5074,
                    lng: -0.1278
                },
                {
                    _description: 'Weather near Tokyo',
                    lat: 35.6762,
                    lng: 139.6503
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        weatherObservation: {
                            type: 'object',
                            properties: {
                                observation: {
                                    type: 'string',
                                    description: 'Observation value'
                                },
                                ICAO: {
                                    type: 'string',
                                    description: 'ICAO value'
                                },
                                stationName: {
                                    type: 'string',
                                    description: 'StationName value'
                                },
                                temperature: {
                                    type: 'string',
                                    description: 'Temperature value'
                                },
                                humidity: {
                                    type: 'number',
                                    description: 'Humidity numeric value'
                                },
                                windSpeed: {
                                    type: 'string',
                                    description: 'WindSpeed value'
                                },
                                windDirection: {
                                    type: 'number',
                                    description: 'WindDirection numeric value'
                                },
                                clouds: {
                                    type: 'string',
                                    description: 'Clouds value'
                                },
                                cloudsCode: {
                                    type: 'string',
                                    description: 'CloudsCode value'
                                },
                                weatherCondition: {
                                    type: 'string',
                                    description: 'WeatherCondition value'
                                },
                                hectoPascAltimeter: {
                                    type: 'number',
                                    description: 'HectoPascAltimeter numeric value'
                                },
                                datetime: {
                                    type: 'string',
                                    description: 'Datetime value'
                                },
                                lat: {
                                    type: 'number',
                                    description: 'Geographic latitude'
                                },
                                lng: {
                                    type: 'number',
                                    description: 'Geographic longitude'
                                },
                                countryCode: {
                                    type: 'string',
                                    description: 'ISO country code'
                                }
                            },
                            description: 'WeatherObservation details'
                        }
                    }
                }
            }
        }
    }
}
