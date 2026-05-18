export const main = {
    namespace: 'restcountries',
    name: 'REST Countries',
    description: 'Access detailed information about 250+ countries including names, capitals, currencies, languages, flags, and geographic data.',
    docs: ['https://restcountries.com/'],
    tags: ['countries', 'geography', 'world', 'international', 'cacheTtlDaily'],
    version: '4.0.0',
    root: 'https://restcountries.com',
    requiredServerParams: [],
    headers: {},
    tools: {
        getAllCountries: {
            method: 'GET',
            path: '/v3.1/all',
            description: 'Retrieve a list of all countries with selected fields. The fields parameter is required to avoid overly large responses.. Use IDs from results in getCountriesByRegion',
            parameters: [
                { position: { key: 'fields', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()', 'default(name,capital,region,flags,population)'] } }
            ],
            tests: [
                { _description: 'Get all countries with basic fields', fields: 'name,capital,region,flags,population' },
                { _description: 'Get all countries with currency info', fields: 'name,currencies,region' },
                { _description: 'Get all countries with language info', fields: 'name,languages,region' }
            ],
            output: {
                      "mimeType": "application/json",
                      "description": "Array of country objects with requested fields",
                      "schema": {
                                "type": "array",
                                "items": {
                                          "type": "object",
                                          "properties": {
                                                    "name": {
                                                              "type": "object",
                                                              "description": "Country name in common and official forms",
                                                              "properties": {
                                                                        "common": {
                                                                                  "type": "string"
                                                                        },
                                                                        "official": {
                                                                                  "type": "string"
                                                                        }
                                                              }
                                                    },
                                                    "capital": {
                                                              "type": "array",
                                                              "description": "Capital city names"
                                                    },
                                                    "region": {
                                                              "type": "string",
                                                              "description": "Geographic region"
                                                    },
                                                    "population": {
                                                              "type": "number",
                                                              "description": "Total population"
                                                    },
                                                    "flags": {
                                                              "type": "object",
                                                              "description": "Flag image URLs",
                                                              "properties": {
                                                                        "png": {
                                                                                  "type": "string"
                                                                        },
                                                                        "svg": {
                                                                                  "type": "string"
                                                                        }
                                                              }
                                                    }
                                          }
                                }
                      }
            },
        },
        getCountryByName: {
            method: 'GET',
            path: '/v3.1/name/:name',
            description: 'Search for countries by name. Returns partial matches by default. Use fullText=true for exact name matching.',
            parameters: [
                { position: { key: 'name', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'fullText', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'boolean()', options: ['optional()', 'default(false)'] } },
                { position: { key: 'fields', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Search for Germany', name: 'germany' },
                { _description: 'Full text search for United States of America', name: 'United States of America', fullText: true },
                { _description: 'Search for France with specific fields', name: 'france', fields: 'name,capital,currencies,languages' }
            ],
            output: {
                      "mimeType": "application/json",
                      "description": "Array of countries matching the name search",
                      "schema": {
                                "type": "array",
                                "items": {
                                          "type": "object",
                                          "properties": {
                                                    "name": {
                                                              "type": "object",
                                                              "description": "Country name",
                                                              "properties": {
                                                                        "common": {
                                                                                  "type": "string"
                                                                        },
                                                                        "official": {
                                                                                  "type": "string"
                                                                        }
                                                              }
                                                    },
                                                    "capital": {
                                                              "type": "array",
                                                              "description": "Capital cities"
                                                    },
                                                    "region": {
                                                              "type": "string",
                                                              "description": "Geographic region"
                                                    },
                                                    "subregion": {
                                                              "type": "string",
                                                              "description": "Geographic sub-region"
                                                    },
                                                    "languages": {
                                                              "type": "object",
                                                              "description": "Official languages keyed by ISO code"
                                                    },
                                                    "currencies": {
                                                              "type": "object",
                                                              "description": "Currencies used"
                                                    }
                                          }
                                }
                      }
            },
        },
        getCountryByCode: {
            method: 'GET',
            path: '/v3.1/alpha/:code',
            description: 'Retrieve a country by its ISO 3166-1 alpha-2, alpha-3, or numeric country code.. Use getAllCountries first to find valid IDs',
            parameters: [
                { position: { key: 'code', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'fields', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get country by alpha-2 code (DE for Germany)', code: 'DE' },
                { _description: 'Get country by alpha-3 code (USA)', code: 'USA' },
                { _description: 'Get country by alpha-2 with fields', code: 'JP', fields: 'name,capital,population,currencies' }
            ],
            output: {
                      "mimeType": "application/json",
                      "description": "Country details by ISO code",
                      "schema": {
                                "type": "array",
                                "items": {
                                          "type": "object",
                                          "properties": {
                                                    "name": {
                                                              "type": "object",
                                                              "properties": {
                                                                        "common": {
                                                                                  "type": "string"
                                                                        },
                                                                        "official": {
                                                                                  "type": "string"
                                                                        }
                                                              }
                                                    },
                                                    "cca2": {
                                                              "type": "string",
                                                              "description": "ISO 3166-1 alpha-2 code"
                                                    },
                                                    "cca3": {
                                                              "type": "string",
                                                              "description": "ISO 3166-1 alpha-3 code"
                                                    },
                                                    "population": {
                                                              "type": "number"
                                                    },
                                                    "capital": {
                                                              "type": "array"
                                                    },
                                                    "region": {
                                                              "type": "string"
                                                    }
                                          }
                                }
                      }
            },
        },
        getCountriesByRegion: {
            method: 'GET',
            path: '/v3.1/region/:region',
            description: 'Get all countries in a geographic region such as Africa, Americas, Asia, Europe, Oceania, or Antarctic.. Use getAllCountries first to find valid IDs',
            parameters: [
                { position: { key: 'region', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(africa,americas,asia,europe,oceania,antarctic)', options: [] } },
                { position: { key: 'fields', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get all European countries', region: 'europe' },
                { _description: 'Get all Asian countries with population', region: 'asia', fields: 'name,population,capital' },
                { _description: 'Get all African countries', region: 'africa', fields: 'name,region,subregion' }
            ],
            output: {
                      "mimeType": "application/json",
                      "description": "Array of countries in the specified region",
                      "schema": {
                                "type": "array",
                                "items": {
                                          "type": "object",
                                          "properties": {
                                                    "name": {
                                                              "type": "object",
                                                              "properties": {
                                                                        "common": {
                                                                                  "type": "string"
                                                                        },
                                                                        "official": {
                                                                                  "type": "string"
                                                                        }
                                                              }
                                                    },
                                                    "capital": {
                                                              "type": "array"
                                                    },
                                                    "region": {
                                                              "type": "string"
                                                    },
                                                    "subregion": {
                                                              "type": "string"
                                                    },
                                                    "population": {
                                                              "type": "number"
                                                    }
                                          }
                                }
                      }
            },
        },
        getCountriesByCurrency: {
            method: 'GET',
            path: '/v3.1/currency/:currency',
            description: 'Find all countries that use a specific currency by currency code (e.g. EUR, USD) or currency name.',
            parameters: [
                { position: { key: 'currency', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'fields', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get countries using the Euro', currency: 'eur' },
                { _description: 'Get countries using USD', currency: 'usd', fields: 'name,capital,region' },
                { _description: 'Get countries using the Swiss Franc', currency: 'chf' }
            ],
            output: {
                      "mimeType": "application/json",
                      "description": "Array of countries using the specified currency",
                      "schema": {
                                "type": "array",
                                "items": {
                                          "type": "object",
                                          "properties": {
                                                    "name": {
                                                              "type": "object",
                                                              "properties": {
                                                                        "common": {
                                                                                  "type": "string"
                                                                        }
                                                              }
                                                    },
                                                    "capital": {
                                                              "type": "array"
                                                    },
                                                    "region": {
                                                              "type": "string"
                                                    },
                                                    "currencies": {
                                                              "type": "object",
                                                              "description": "Currency details"
                                                    }
                                          }
                                }
                      }
            },
        },
        getCountriesByLanguage: {
            method: 'GET',
            path: '/v3.1/lang/:language',
            description: 'Find all countries where a specific language is spoken by language code (e.g. eng, deu) or language name.. Use getAllCountries first to find valid IDs',
            parameters: [
                { position: { key: 'language', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'fields', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get countries where Spanish is spoken', language: 'spa' },
                { _description: 'Get countries where French is spoken', language: 'fra', fields: 'name,capital,region' },
                { _description: 'Get countries where Arabic is spoken', language: 'ara' }
            ],
            output: {
                      "mimeType": "application/json",
                      "description": "Array of countries where the specified language is spoken",
                      "schema": {
                                "type": "array",
                                "items": {
                                          "type": "object",
                                          "properties": {
                                                    "name": {
                                                              "type": "object",
                                                              "properties": {
                                                                        "common": {
                                                                                  "type": "string"
                                                                        }
                                                              }
                                                    },
                                                    "capital": {
                                                              "type": "array"
                                                    },
                                                    "region": {
                                                              "type": "string"
                                                    },
                                                    "languages": {
                                                              "type": "object",
                                                              "description": "Official languages"
                                                    }
                                          }
                                }
                      }
            },
        }
    },
}