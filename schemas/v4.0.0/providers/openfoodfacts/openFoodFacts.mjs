export const main = {
    namespace: 'openfoodfacts',
    name: 'OpenFoodFacts',
    description: 'Look up food products from the Open Food Facts database with 3M+ items. Retrieve nutrition data, ingredients, allergens, Nutri-Score grades, and eco-scores by barcode or search by category and nutrition grade.',
    version: '4.0.0',
    docs: ['https://openfoodfacts.github.io/openfoodfacts-server/api/'],
    tags: ['food', 'nutrition', 'health', 'barcode', 'opendata', 'cacheTtlDaily'],
    root: 'https://world.openfoodfacts.org',
    requiredServerParams: [],
    headers: {
        'User-Agent': 'FlowMCP/2.0.0 (https://github.com/FlowMCP)'
    },
    tools: {
        getProductByBarcode: {
            method: 'GET',
            path: '/api/v2/product/:barcode',
            description: 'Look up a food product by its barcode (EAN-13, UPC, etc.). Returns full product details including name, ingredients, allergens, nutrition facts, Nutri-Score, Eco-Score, and images.',
            parameters: [
                { position: { key: 'barcode', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } },
                { position: { key: 'fields', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get full details for Nutella by barcode', barcode: '3017624010701' },
                { _description: 'Get Coca-Cola product details', barcode: '5000112602920' },
                { _description: 'Get specific fields for a product (name, nutriscore, nutrients)', barcode: '3017624010701', fields: 'product_name,nutrition_grades,nutriments,ingredients_text' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        status: { type: 'number', description: '1 if product found, 0 if not found' },
                        code: { type: 'string', description: 'Product barcode' },
                        product: {
                            type: 'object',
                            description: 'Product details object',
                            properties: {
                                product_name: { type: 'string', description: 'Product name' },
                                brands: { type: 'string', description: 'Brand name(s)' },
                                categories: { type: 'string', description: 'Product categories' },
                                ingredients_text: { type: 'string', description: 'Full ingredients list' },
                                allergens: { type: 'string', description: 'Allergen information' },
                                nutrition_grades: { type: 'string', description: 'Nutri-Score grade (a-e)' },
                                ecoscore_grade: { type: 'string', description: 'Eco-Score environmental impact grade' },
                                nutriments: { type: 'object', description: 'Detailed nutrition data per 100g' },
                                image_url: { type: 'string', description: 'Product image URL' },
                                countries: { type: 'string', description: 'Countries where product is sold' }
                            }
                        }
                    }
                }
            }
        },
        searchProducts: {
            method: 'GET',
            path: '/api/v2/search',
            description: 'Search and filter products from the Open Food Facts database. Filter by category, nutrition grade, or other criteria. Returns a paginated list of matching products.',
            parameters: [
                { position: { key: 'categories_tags_en', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'nutrition_grades_tags', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(a,b,c,d,e)', options: ['optional()'] } },
                { position: { key: 'fields', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'sort_by', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(product_name,last_modified_t,popularity_key,nutriscore_score)', options: ['optional()', 'default(last_modified_t)'] } },
                { position: { key: 'page', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(1)', 'min(1)'] } },
                { position: { key: 'page_size', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(24)', 'min(1)', 'max(200)'] } }
            ],
            tests: [
                { _description: 'Search for orange juice with grade A nutrition', categories_tags_en: 'Orange Juice', nutrition_grades_tags: 'a', fields: 'code,product_name,nutrition_grades' },
                { _description: 'Search for chocolate products sorted by popularity', categories_tags_en: 'Chocolates', sort_by: 'popularity_key', fields: 'code,product_name,brands,nutrition_grades' },
                { _description: 'Search for cereals with all fields', categories_tags_en: 'Breakfast Cereals', page_size: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: { type: 'number', description: 'Total number of matching products' },
                        page: { type: 'number', description: 'Current page number' },
                        page_size: { type: 'number', description: 'Number of results per page' },
                        products: {
                            type: 'array',
                            description: 'Array of matching product objects',
                            items: {
                                type: 'object',
                                properties: {
                                    code: { type: 'string', description: 'Product barcode' },
                                    product_name: { type: 'string', description: 'Product name' },
                                    brands: { type: 'string', description: 'Brand name(s)' },
                                    nutrition_grades: { type: 'string', description: 'Nutri-Score grade (a-e)' },
                                    ecoscore_grade: { type: 'string', description: 'Eco-Score grade' }
                                }
                            }
                        }
                    }
                }
            }
        },
        getProductsByCategory: {
            method: 'GET',
            path: '/category/:category.json',
            description: 'Get products in a specific category. Returns a list of products with their names, barcodes, and nutrition grades for that category.',
            parameters: [
                { position: { key: 'category', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get all chocolate products', category: 'chocolates' },
                { _description: 'Get all cereals', category: 'cereals' },
                { _description: 'Get biscuits and cookies', category: 'biscuits' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: { type: 'number', description: 'Total products in category' },
                        tags: { type: 'array', description: 'Array of product objects in this category' }
                    }
                }
            }
        },
        getProductsByBrand: {
            method: 'GET',
            path: '/brand/:brand.json',
            description: 'Get all products from a specific brand. Returns products by that brand with basic information.',
            parameters: [
                { position: { key: 'brand', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get all Nestle products', brand: 'nestle' },
                { _description: 'Get all Ferrero products', brand: 'ferrero' },
                { _description: 'Get all Danone products', brand: 'danone' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        count: { type: 'number', description: 'Total products by this brand' },
                        products: { type: 'array', description: 'Array of product objects for this brand' }
                    }
                }
            }
        }
    }
}
