export const main = {
    namespace: 'reisewarnung',
    name: 'Reisewarnung Auswaertiges Amt',
    description: 'Access travel and security warnings from the German Federal Foreign Office (Auswaertiges Amt). Covers travel advisories, country-specific security information, and diplomatic mission contacts.',
    version: '4.0.0',
    docs: ['https://travelwarning.api.bund.dev/'],
    tags: ['germany', 'travel', 'safety', 'warnings', 'opendata'],
    root: 'https://www.auswaertiges-amt.de/opendata',
    requiredServerParams: [],
    headers: {},
    tools: {
        getAllWarnings: {
            method: 'GET',
            path: '/travelwarning',
            description: 'Get all current travel and security warnings from the Auswaertiges Amt. Returns country-specific advisories with safety levels, text descriptions, and last update dates.. Use IDs from results in getWarningById',
            parameters: [],
            tests: [
                { _description: 'Get all travel warnings' }
            ],
            output: {
                      "mimeType": "application/json",
                      "description": "Map of country content IDs to travel warning objects from Auswaertiges Amt",
                      "schema": {
                                "type": "object",
                                "description": "Key-value map where keys are content IDs and values are warning objects",
                                "properties": {
                                          "contentId": {
                                                    "type": "object",
                                                    "description": "Travel warning keyed by content ID",
                                                    "properties": {
                                                              "countryName": {
                                                                        "type": "string",
                                                                        "description": "Name of the country"
                                                              },
                                                              "warning": {
                                                                        "type": "boolean",
                                                                        "description": "Whether an active travel warning exists"
                                                              },
                                                              "partialWarning": {
                                                                        "type": "boolean",
                                                                        "description": "Whether a partial travel warning exists"
                                                              },
                                                              "lastModified": {
                                                                        "type": "number",
                                                                        "description": "Unix timestamp of last modification"
                                                              }
                                                    }
                                          }
                                }
                      }
            },
        },
        getWarningById: {
            method: 'GET',
            path: '/travelwarning/:contentId',
            description: 'Get a specific travel warning by its content ID. Returns detailed advisory text, safety level, and related information.. Use getAllWarnings first to find valid IDs',
            parameters: [
                { position: { key: 'contentId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get warning for a specific country', contentId: '199124' }
            ],
            output: {
                      "mimeType": "application/json",
                      "description": "Detailed travel warning for a specific country",
                      "schema": {
                                "type": "object",
                                "description": "Full travel advisory details",
                                "properties": {
                                          "countryName": {
                                                    "type": "string",
                                                    "description": "Name of the country"
                                          },
                                          "content": {
                                                    "type": "string",
                                                    "description": "HTML content of the travel advisory"
                                          },
                                          "lastModified": {
                                                    "type": "number",
                                                    "description": "Unix timestamp of last update"
                                          },
                                          "warning": {
                                                    "type": "boolean",
                                                    "description": "Active travel warning flag"
                                          }
                                }
                      }
            },
        },
        getStateNames: {
            method: 'GET',
            path: '/stateNames',
            description: 'Get the directory of all country/state names with their ISO codes and content IDs for use with other endpoints.',
            parameters: [],
            tests: [
                { _description: 'Get all state/country names' }
            ],
            output: {
                      "mimeType": "application/json",
                      "description": "Directory of country names with ISO codes and content IDs",
                      "schema": {
                                "type": "object",
                                "description": "Map of content IDs to country names",
                                "properties": {
                                          "contentId": {
                                                    "type": "object",
                                                    "description": "Country entry",
                                                    "properties": {
                                                              "countryName": {
                                                                        "type": "string",
                                                                        "description": "Official country name"
                                                              },
                                                              "iso3": {
                                                                        "type": "string",
                                                                        "description": "ISO 3166-1 alpha-3 code"
                                                              },
                                                              "contentId": {
                                                                        "type": "string",
                                                                        "description": "Content ID for use in getWarningById"
                                                              }
                                                    }
                                          }
                                }
                      }
            },
        },
        getHealthcare: {
            method: 'GET',
            path: '/healthcare',
            description: 'Get health service information sheets for countries. Covers vaccination requirements, health risks, and medical care availability.. Use getAllWarnings first to find valid IDs',
            parameters: [],
            tests: [
                { _description: 'Get healthcare information' }
            ],
            output: {
                      "mimeType": "application/json",
                      "description": "Healthcare information sheets for countries",
                      "schema": {
                                "type": "object",
                                "description": "Map of content IDs to healthcare information",
                                "properties": {
                                          "contentId": {
                                                    "type": "object",
                                                    "description": "Healthcare entry",
                                                    "properties": {
                                                              "countryName": {
                                                                        "type": "string",
                                                                        "description": "Country name"
                                                              },
                                                              "content": {
                                                                        "type": "string",
                                                                        "description": "HTML healthcare advisory content"
                                                              }
                                                    }
                                          }
                                }
                      }
            },
        }
    }
}
