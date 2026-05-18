export const main = {
    namespace: 'usdafooddata',
    name: 'UsdaFoodData',
    description: 'Query USDA FoodData Central for nutritional data — search foods, get nutrient details, and browse the comprehensive USDA food composition database.',
    version: '4.0.0',
    docs: ['https://fdc.nal.usda.gov/api-guide/', 'https://fdc.nal.usda.gov/api-spec/fdc_api.html'],
    tags: ['nutrition', 'food', 'health', 'science', 'government', 'cacheTtlDaily'],
    root: 'https://api.nal.usda.gov',
    requiredServerParams: ['API_DATA_GOV_KEY'],
    headers: {},
    tools: {
        searchFoods: {
            method: 'GET',
            path: '/fdc/v1/foods/search',
            description: 'Search for foods matching keyword criteria. Returns food names, FDC IDs, data types, and basic nutrient information.',
            parameters: [
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'query', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['min(1)'] } },
                { position: { key: 'dataType', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(Branded,Foundation,Survey (FNDDS),SR Legacy)', options: ['optional()'] } },
                { position: { key: 'pageSize', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(25)', 'min(1)', 'max(200)'] } },
                { position: { key: 'pageNumber', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)', 'min(1)'] } },
                { position: { key: 'sortBy', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(dataType.keyword,lowercaseDescription.keyword,fdcId,publishedDate)', options: ['optional()'] } },
                { position: { key: 'sortOrder', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(asc,desc)', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Search for chicken breast nutrition data', query: 'chicken breast', pageSize: 5 },
                { _description: 'Search Foundation foods for broccoli', query: 'broccoli', dataType: 'Foundation', pageSize: 10 },
                { _description: 'Search branded foods for protein bar', query: 'protein bar', dataType: 'Branded', pageSize: 5, sortBy: 'dataType.keyword', sortOrder: 'asc' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        totalHits: { type: 'number', description: 'Total number of matching foods' },
                        currentPage: { type: 'number' },
                        totalPages: { type: 'number' },
                        foods: {
                            type: 'array',
                            description: 'Array of food items matching the search query',
                            items: {
                                type: 'object',
                                properties: {
                                    fdcId: { type: 'number', description: 'Unique FoodData Central identifier' },
                                    description: { type: 'string', description: 'Food description/name' },
                                    dataType: { type: 'string', description: 'Data source type' },
                                    brandOwner: { type: 'string', description: 'Brand owner (for Branded foods)' },
                                    ingredients: { type: 'string', description: 'Ingredient list (for Branded foods)' },
                                    foodNutrients: {
                                        type: 'array',
                                        description: 'Array of nutrient values',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                nutrientId: { type: 'number' },
                                                nutrientName: { type: 'string' },
                                                nutrientNumber: { type: 'string' },
                                                unitName: { type: 'string' },
                                                value: { type: 'number' }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        getFoodById: {
            method: 'GET',
            path: '/fdc/v1/food/:fdcId',
            description: 'Retrieve full nutritional details for a single food item by its FDC identifier. Returns comprehensive nutrient data, portions, and metadata.',
            parameters: [
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'fdcId', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'number()', options: ['min(1)'] } }
            ],
            tests: [
                { _description: 'Get nutrition data for cheddar cheese (Foundation)', fdcId: 2261425 },
                { _description: 'Get nutrition data for raw banana (SR Legacy)', fdcId: 173944 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        fdcId: { type: 'number' },
                        description: { type: 'string' },
                        dataType: { type: 'string' },
                        publicationDate: { type: 'string' },
                        foodNutrients: {
                            type: 'array',
                            description: 'Complete nutrient profile',
                            items: {
                                type: 'object',
                                properties: {
                                    nutrient: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'number' },
                                            name: { type: 'string' },
                                            unitName: { type: 'string' },
                                            number: { type: 'string' }
                                        }
                                    },
                                    amount: { type: 'number', description: 'Nutrient amount per 100g' }
                                }
                            }
                        },
                        foodPortions: {
                            type: 'array',
                            description: 'Standard portion sizes',
                            items: {
                                type: 'object',
                                properties: {
                                    gramWeight: { type: 'number' },
                                    amount: { type: 'number' },
                                    modifier: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        },
        listFoods: {
            method: 'GET',
            path: '/fdc/v1/foods/list',
            description: 'Get a paginated list of foods in abbreviated format. Useful for browsing the database without search criteria.',
            parameters: [
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'pageSize', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(25)', 'min(1)', 'max(200)'] } },
                { position: { key: 'pageNumber', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)', 'min(1)'] } },
                { position: { key: 'sortBy', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(dataType.keyword,lowercaseDescription.keyword,fdcId,publishedDate)', options: ['optional()'] } },
                { position: { key: 'sortOrder', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(asc,desc)', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'List first 10 foods sorted by FDC ID', pageSize: 10, sortBy: 'fdcId', sortOrder: 'asc' },
                { _description: 'List recently published foods', pageSize: 5, sortBy: 'publishedDate', sortOrder: 'desc' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Array of food items in abbreviated format',
                    items: {
                        type: 'object',
                        properties: {
                            fdcId: { type: 'number' },
                            description: { type: 'string' },
                            dataType: { type: 'string' },
                            publicationDate: { type: 'string' },
                            foodCode: { type: 'string' }
                        }
                    }
                }
            }
        },
        getMultipleFoods: {
            method: 'POST',
            path: '/fdc/v1/foods',
            description: 'Retrieve nutritional data for multiple foods at once by providing an array of FDC IDs. More efficient than multiple single requests.',
            parameters: [
                { position: { key: 'api_key', value: '{{API_DATA_GOV_KEY}}', location: 'query' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'fdcIds', value: '{{USER_PARAM}}', location: 'body' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get nutrition for banana and apple', fdcIds: '[173944, 171688]' },
                { _description: 'Get nutrition for common proteins', fdcIds: '[171705, 174608]' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Array of full food detail objects',
                    items: {
                        type: 'object',
                        properties: {
                            fdcId: { type: 'number' },
                            description: { type: 'string' },
                            dataType: { type: 'string' },
                            foodNutrients: { type: 'array', items: { type: 'object' } }
                        }
                    }
                }
            }
        }
    }
}
