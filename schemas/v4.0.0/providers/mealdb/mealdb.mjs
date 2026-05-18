export const main = {
    namespace: 'mealdb',
    name: 'TheMealDB',
    description: 'Access TheMealDB, an open crowd-sourced database of recipes from around the world. Search meals by name, browse by category or cuisine, get detailed recipes with ingredients and instructions. Covers 300+ meals with images, video tutorials, and step-by-step guides. Free tier uses API key "1" for testing.',
    version: '4.0.0',
    docs: ['https://www.themealdb.com/api.php'],
    tags: ['food', 'recipes', 'cooking', 'opendata', 'cacheTtlDaily'],
    root: 'https://www.themealdb.com',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchMeals: {
            method: 'GET',
            path: '/api/json/v1/1/search.php',
            description: 'Search meals by name. Returns detailed meal information including ingredients, measurements, instructions, category, cuisine, and image. Use getMeal with the returned idMeal for full recipe details.',
            parameters: [
                { position: { key: 's', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Search Arrabiata', s: 'Arrabiata' },
                { _description: 'Search Chicken', s: 'chicken' },
                { _description: 'Search Pasta', s: 'pasta' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Search results containing matching meals with full recipe details',
                    properties: {
                        meals: {
                            type: 'array',
                            description: 'Array of matching meal objects, null if no matches found',
                            items: {
                                type: 'object',
                                properties: {
                                    idMeal: { type: 'string', description: 'Unique meal identifier, use with getMeal for direct lookup' },
                                    strMeal: { type: 'string', description: 'Meal name (e.g., Spicy Arrabiata Penne)' },
                                    strCategory: { type: 'string', description: 'Meal category (e.g., Vegetarian, Chicken, Dessert)' },
                                    strArea: { type: 'string', description: 'Cuisine origin country or region (e.g., Italian, Japanese)' },
                                    strInstructions: { type: 'string', description: 'Full cooking instructions as plain text' },
                                    strMealThumb: { type: 'string', description: 'URL to meal thumbnail image' },
                                    strYoutube: { type: 'string', description: 'YouTube video tutorial URL, may be empty' },
                                    strIngredient1: { type: 'string', description: 'First ingredient name (up to strIngredient20 available)' },
                                    strMeasure1: { type: 'string', description: 'Measurement for first ingredient (up to strMeasure20 available)' }
                                }
                            }
                        }
                    }
                }
            }
        },
        getMeal: {
            method: 'GET',
            path: '/api/json/v1/1/lookup.php',
            description: 'Get detailed meal recipe by ID. Returns full recipe with all ingredients, measurements, instructions, and video link. Use searchMeals or filterByArea to find meal IDs.',
            parameters: [
                { position: { key: 'i', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get Arrabiata (52771)', i: '52771' },
                { _description: 'Get Pad Thai (52773)', i: '52773' },
                { _description: 'Get Teriyaki Chicken (52772)', i: '52772' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Full recipe details for the requested meal',
                    properties: {
                        meals: {
                            type: 'array',
                            description: 'Single-element array with the meal object, null if ID not found',
                            items: {
                                type: 'object',
                                properties: {
                                    idMeal: { type: 'string', description: 'Unique meal identifier' },
                                    strMeal: { type: 'string', description: 'Meal name' },
                                    strCategory: { type: 'string', description: 'Meal category (e.g., Chicken, Dessert)' },
                                    strArea: { type: 'string', description: 'Cuisine origin (e.g., Italian, Japanese)' },
                                    strInstructions: { type: 'string', description: 'Full cooking instructions as plain text' },
                                    strMealThumb: { type: 'string', description: 'URL to meal thumbnail image' },
                                    strYoutube: { type: 'string', description: 'YouTube video tutorial URL' }
                                }
                            }
                        }
                    }
                }
            }
        },
        listCategories: {
            method: 'GET',
            path: '/api/json/v1/1/categories.php',
            description: 'List all meal categories with descriptions and thumbnail images. Returns categories like Beef, Chicken, Dessert, Pasta, Seafood. Use category names with searchMeals to find meals in a category.',
            parameters: [],
            tests: [
                { _description: 'List all categories' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Complete list of all meal categories in the database',
                    properties: {
                        categories: {
                            type: 'array',
                            description: 'Array of category objects with descriptions and images',
                            items: {
                                type: 'object',
                                properties: {
                                    idCategory: { type: 'string', description: 'Unique category identifier' },
                                    strCategory: { type: 'string', description: 'Category name (e.g., Beef, Chicken, Dessert, Pasta)' },
                                    strCategoryThumb: { type: 'string', description: 'URL to category thumbnail image' },
                                    strCategoryDescription: { type: 'string', description: 'Multi-sentence description of the category' }
                                }
                            }
                        }
                    }
                }
            }
        },
        filterByArea: {
            method: 'GET',
            path: '/api/json/v1/1/filter.php',
            description: 'Filter meals by cuisine/area. Returns meals from a specific country or region (e.g., Italian, Japanese, Mexican, British, American). Use getMeal with the returned idMeal for full recipe details.',
            parameters: [
                { position: { key: 'a', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Italian meals', a: 'Italian' },
                { _description: 'Japanese meals', a: 'Japanese' },
                { _description: 'Mexican meals', a: 'Mexican' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'List of meals matching the requested cuisine area',
                    properties: {
                        meals: {
                            type: 'array',
                            description: 'Array of meal summaries for the selected cuisine',
                            items: {
                                type: 'object',
                                properties: {
                                    strMeal: { type: 'string', description: 'Meal name' },
                                    strMealThumb: { type: 'string', description: 'URL to meal thumbnail image' },
                                    idMeal: { type: 'string', description: 'Unique meal ID, use with getMeal for full recipe' }
                                }
                            }
                        }
                    }
                }
            }
        },
        getRandomMeal: {
            method: 'GET',
            path: '/api/json/v1/1/random.php',
            description: 'Get a random meal recipe. Returns one random meal with full recipe details including ingredients and instructions. Each call returns a different meal.',
            parameters: [],
            tests: [
                { _description: 'Get random meal' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Single random meal with full recipe details',
                    properties: {
                        meals: {
                            type: 'array',
                            description: 'Single-element array with a random meal object',
                            items: {
                                type: 'object',
                                properties: {
                                    idMeal: { type: 'string', description: 'Unique meal identifier' },
                                    strMeal: { type: 'string', description: 'Meal name' },
                                    strCategory: { type: 'string', description: 'Meal category (e.g., Seafood, Dessert)' },
                                    strArea: { type: 'string', description: 'Cuisine origin (e.g., British, Chinese)' },
                                    strInstructions: { type: 'string', description: 'Full cooking instructions as plain text' },
                                    strMealThumb: { type: 'string', description: 'URL to meal thumbnail image' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
