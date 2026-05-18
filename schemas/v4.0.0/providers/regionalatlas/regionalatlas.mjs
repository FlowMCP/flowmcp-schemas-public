export const main = {
    namespace: 'regionalatlas',
    name: 'Regionalatlas Deutschland',
    description: 'Access 160+ statistical indicators for German federal states, administrative districts, and Kreise from the Regionalatlas Deutschland — population density, demographics, economy, education, environment, and more.',
    version: '4.0.0',
    docs: ['https://github.com/bundesAPI/regionalatlas-api', 'https://regionalatlas.statistikportal.de'],
    tags: ['germany', 'statistics', 'demographics', 'regional', 'opendata', 'cacheTtlDaily'],
    root: 'https://www.gis-idmz.nrw.de',
    requiredServerParams: [],
    headers: {},
    tools: {
        getIndicatorByState: {
            method: 'GET',
            path: '/arcgis/rest/services/stba/regionalatlas/MapServer/dynamicLayer/query',
            description: 'Get a statistical indicator for all German federal states (Bundeslaender). Use table codes from the Regionalatlas services catalog (e.g. ai002_1_5 for population).',
            parameters: [
                { position: { key: 'layer', value: '{"source":{"dataSource":{"geometryType":"esriGeometryPolygon","workspaceId":"gdb","query":"SELECT * FROM verwaltungsgrenzen_gesamt LEFT OUTER JOIN {{USER_PARAM}} ON ags = ags2 and jahr = jahr2 WHERE typ = 1 AND jahr = {{USER_PARAM}} AND (jahr2 = {{USER_PARAM}} OR jahr2 IS NULL)","oidFields":"id","spatialReference":{"wkid":25832},"type":"queryTable"},"type":"dataLayer"}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'where', value: '1=1', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'outFields', value: '*', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'returnGeometry', value: 'false', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'f', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Population indicators for all states 2022', layer: '{"source":{"dataSource":{"geometryType":"esriGeometryPolygon","workspaceId":"gdb","query":"SELECT * FROM verwaltungsgrenzen_gesamt LEFT OUTER JOIN ai002_1_5 ON ags = ags2 and jahr = jahr2 WHERE typ = 1 AND jahr = 2022 AND (jahr2 = 2022 OR jahr2 IS NULL)","oidFields":"id","spatialReference":{"wkid":25832},"type":"queryTable"},"type":"dataLayer"}}' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        displayFieldName: { type: 'string', description: 'Primary display field name' },
                        fields: {
                            type: 'array',
                            description: 'Field definitions with name, type, and alias',
                            items: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    type: { type: 'string' },
                                    alias: { type: 'string' }
                                }
                            }
                        },
                        features: {
                            type: 'array',
                            description: 'Array of feature objects with attribute values',
                            items: {
                                type: 'object',
                                properties: {
                                    attributes: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'number', description: 'Internal row ID' },
                                            typ: { type: 'number', description: 'Regional level (1=state, 2=district, 3=Kreis, 5=municipality)' },
                                            ags: { type: 'string', description: 'Official municipality key (Amtlicher Gemeindeschluessel)' },
                                            jahr: { type: 'number', description: 'Reference year' },
                                            gen: { type: 'string', description: 'Region name' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        getIndicatorByKreis: {
            method: 'GET',
            path: '/arcgis/rest/services/stba/regionalatlas/MapServer/dynamicLayer/query',
            description: 'Get a statistical indicator for all German Kreise (districts and independent cities). Filter by state using AGS prefix (e.g. 05 for NRW).',
            parameters: [
                { position: { key: 'layer', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'where', value: '1=1', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'outFields', value: '*', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'returnGeometry', value: 'false', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'f', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Population indicators for NRW Kreise 2022', layer: '{"source":{"dataSource":{"geometryType":"esriGeometryPolygon","workspaceId":"gdb","query":"SELECT * FROM verwaltungsgrenzen_gesamt LEFT OUTER JOIN ai002_1_5 ON ags = ags2 and jahr = jahr2 WHERE typ = 3 AND jahr = 2022 AND ags LIKE \'05%\' AND (jahr2 = 2022 OR jahr2 IS NULL)","oidFields":"id","spatialReference":{"wkid":25832},"type":"queryTable"},"type":"dataLayer"}}' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        displayFieldName: { type: 'string' },
                        fields: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, type: { type: 'string' }, alias: { type: 'string' } } } },
                        features: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    attributes: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'number' },
                                            typ: { type: 'number', description: 'Regional level (3 = Kreis)' },
                                            ags: { type: 'string', description: 'Amtlicher Gemeindeschluessel' },
                                            jahr: { type: 'number', description: 'Reference year' },
                                            gen: { type: 'string', description: 'Kreis name' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        getIndicatorByRegierungsbezirk: {
            method: 'GET',
            path: '/arcgis/rest/services/stba/regionalatlas/MapServer/dynamicLayer/query',
            description: 'Get a statistical indicator for all German administrative districts (Regierungsbezirke). Level 2 in the regional hierarchy.',
            parameters: [
                { position: { key: 'layer', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'where', value: '1=1', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'outFields', value: '*', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'returnGeometry', value: 'false', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'f', value: 'json', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Population indicators for all Regierungsbezirke 2022', layer: '{"source":{"dataSource":{"geometryType":"esriGeometryPolygon","workspaceId":"gdb","query":"SELECT * FROM verwaltungsgrenzen_gesamt LEFT OUTER JOIN ai002_1_5 ON ags = ags2 and jahr = jahr2 WHERE typ = 2 AND jahr = 2022 AND (jahr2 = 2022 OR jahr2 IS NULL)","oidFields":"id","spatialReference":{"wkid":25832},"type":"queryTable"},"type":"dataLayer"}}' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        displayFieldName: { type: 'string' },
                        fields: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, type: { type: 'string' }, alias: { type: 'string' } } } },
                        features: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    attributes: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'number' },
                                            typ: { type: 'number', description: 'Regional level (2 = Regierungsbezirk)' },
                                            ags: { type: 'string' },
                                            jahr: { type: 'number' },
                                            gen: { type: 'string', description: 'Regierungsbezirk name' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        listAvailableIndicators: {
            method: 'GET',
            path: '/arcgis/rest/services/stba/regionalatlas/MapServer/dynamicLayer/query',
            description: 'Retrieve the catalog of all available indicator tables and topics from the Regionalatlas. Returns table codes, titles, available years, and geographic levels. Use the table codes in other routes.',
            parameters: [],
            tests: [
                { _description: 'Get full indicator catalog' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Hierarchical list of topics with indicator groups',
                    items: {
                        type: 'object',
                        properties: {
                            title: { type: 'string', description: 'Topic category name (e.g. Bevoelkerung, Bildung)' },
                            children: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        code: { type: 'string', description: 'Table code for use in queries (e.g. AI002-1-5)' },
                                        title_short: { type: 'string', description: 'Short indicator title' },
                                        title_long: { type: 'string', description: 'Detailed indicator description' },
                                        attributes: {
                                            type: 'array',
                                            description: 'Available metrics within this indicator group',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    code: { type: 'string', description: 'Attribute code (e.g. AI0201)' },
                                                    title_short: { type: 'string' },
                                                    unit: { type: 'string', description: 'Measurement unit (e.g. Prozent, qm)' }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

export const handlers = () => ( {
    listAvailableIndicators: {
        executeRequest: async () => {
            const response = await fetch( 'https://regionalatlas.statistikportal.de/taskrunner/services.json' )
            const data = await response.json()

            return { response: data }
        }
    }
} )
