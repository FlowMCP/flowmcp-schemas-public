export const main = {
    namespace: 'cocktaildb',
    name: 'TheCocktailDB',
    description: 'Access TheCocktailDB, an open crowd-sourced database of cocktail recipes. Search drinks by name or ingredient, browse categories, get detailed recipes with instructions and measurements. Covers 600+ cocktails with images, ingredients, and glass types. Free tier uses API key "1" for testing.',
    version: '4.0.0',
    docs: ['https://www.thecocktaildb.com/api.php'],
    tags: ['food', 'beverage', 'recipes', 'opendata', 'cacheTtlDaily'],
    root: 'https://www.thecocktaildb.com',
    requiredServerParams: [],
    headers: {},
    tools: {
        searchCocktails: {
            method: 'GET',
            path: '/api/json/v1/1/search.php',
            description: 'Search cocktails by name. Returns detailed drink information including ingredients, measurements, instructions, glass type, and image.',
            parameters: [
                { position: { key: 's', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Cocktail name or partial name to search for' }
            ],
            tests: [
                { _description: 'Search Margarita', s: 'margarita' },
                { _description: 'Search Mojito', s: 'mojito' },
                { _description: 'Search Old Fashioned', s: 'old fashioned' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { drinks: { type: 'array', description: 'Matching cocktail recipes, null if no matches', items: { type: 'object', properties: { idDrink: { type: 'string', description: 'Unique drink ID, usable with getCocktail' }, strDrink: { type: 'string', description: 'Cocktail display name' }, strCategory: { type: 'string', description: 'Drink category (Ordinary Drink, Cocktail, Shot, etc.)' }, strAlcoholic: { type: 'string', description: 'Alcoholic, Non alcoholic, or Optional alcohol' }, strGlass: { type: 'string', description: 'Recommended glass type (e.g. Cocktail glass, Highball glass)' }, strInstructions: { type: 'string', description: 'Step-by-step preparation instructions' }, strDrinkThumb: { type: 'string', description: 'Drink thumbnail image URL' }, strIngredient1: { type: 'string', description: 'First ingredient name (up to strIngredient15)' }, strMeasure1: { type: 'string', description: 'Measurement for first ingredient (up to strMeasure15)' } } } } } }
            }
        },
        getCocktail: {
            method: 'GET',
            path: '/api/json/v1/1/lookup.php',
            description: 'Get detailed cocktail recipe by ID. Returns full recipe with all 15 ingredient/measurement slots, instructions in multiple languages, glass type, category, and image.',
            parameters: [
                { position: { key: 'i', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'TheCocktailDB drink ID number as string, e.g. 11007 for Margarita' }
            ],
            tests: [
                { _description: 'Get Margarita (11007)', i: '11007' },
                { _description: 'Get Old Fashioned (11001)', i: '11001' },
                { _description: 'Get Mojito (11000)', i: '11000' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { drinks: { type: 'array', description: 'Single-element array with the full cocktail record', items: { type: 'object', properties: { idDrink: { type: 'string', description: 'Unique drink ID' }, strDrink: { type: 'string', description: 'Cocktail display name' }, strCategory: { type: 'string', description: 'Drink category' }, strAlcoholic: { type: 'string', description: 'Alcoholic classification' }, strGlass: { type: 'string', description: 'Recommended glass type' }, strInstructions: { type: 'string', description: 'English preparation instructions' }, strDrinkThumb: { type: 'string', description: 'Drink thumbnail image URL' } } } } } }
            }
        },
        filterByIngredient: {
            method: 'GET',
            path: '/api/json/v1/1/filter.php',
            description: 'Filter cocktails by ingredient. Returns list of cocktails that contain the specified ingredient with name, thumbnail, and ID. Use getCocktail with the returned idDrink for full recipe.',
            parameters: [
                { position: { key: 'i', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Ingredient name to filter cocktails by, e.g. Gin, Vodka, Rum' }
            ],
            tests: [
                { _description: 'Filter by Gin', i: 'Gin' },
                { _description: 'Filter by Vodka', i: 'Vodka' },
                { _description: 'Filter by Tequila', i: 'Tequila' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { drinks: { type: 'array', description: 'Cocktails containing the specified ingredient', items: { type: 'object', properties: { strDrink: { type: 'string', description: 'Cocktail display name' }, strDrinkThumb: { type: 'string', description: 'Thumbnail image URL' }, idDrink: { type: 'string', description: 'Drink ID for use with getCocktail' } } } } } }
            }
        },
        listCategories: {
            method: 'GET',
            path: '/api/json/v1/1/list.php',
            description: 'List all cocktail categories. Returns available categories like Ordinary Drink, Cocktail, Shake, Beer, Coffee/Tea, Punch/Party Drink, etc.',
            parameters: [
                { position: { key: 'c', value: 'list', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Fixed value list to retrieve all categories' }
            ],
            tests: [
                { _description: 'List all categories' },
                { _description: 'Get category list' },
                { _description: 'Fetch all drink categories' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { drinks: { type: 'array', description: 'All available drink categories', items: { type: 'object', properties: { strCategory: { type: 'string', description: 'Category name (e.g. Ordinary Drink, Cocktail, Shot)' } } } } } }
            }
        },
        getRandomCocktail: {
            method: 'GET',
            path: '/api/json/v1/1/random.php',
            description: 'Get a random cocktail recipe. Returns one random drink with full recipe details including all ingredients, measurements, instructions, glass type, and image.',
            parameters: [],
            tests: [
                { _description: 'Get random cocktail' },
                { _description: 'Get a surprise cocktail' },
                { _description: 'Random drink suggestion' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { drinks: { type: 'array', description: 'Single-element array with a random cocktail', items: { type: 'object', properties: { idDrink: { type: 'string', description: 'Unique drink ID' }, strDrink: { type: 'string', description: 'Cocktail display name' }, strCategory: { type: 'string', description: 'Drink category' }, strGlass: { type: 'string', description: 'Recommended glass type' }, strInstructions: { type: 'string', description: 'Preparation instructions' }, strDrinkThumb: { type: 'string', description: 'Drink thumbnail image URL' } } } } } }
            }
        }
    }
}
