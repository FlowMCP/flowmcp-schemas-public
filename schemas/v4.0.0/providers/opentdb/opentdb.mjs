export const main = {
    namespace: 'opentdb',
    name: 'Open Trivia Database',
    description: 'Access the Open Trivia Database with 4,000+ verified trivia questions across 24 categories. Get multiple choice and true/false questions at easy, medium, or hard difficulty. Categories include Science, History, Geography, Entertainment, Sports, and more. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://opentdb.com/api_config.php'],
    tags: ['entertainment', 'trivia', 'education', 'opendata', 'cacheTtlDaily'],
    root: 'https://opentdb.com',
    requiredServerParams: [],
    headers: {},
    tools: {
        getQuestions: {
            method: 'GET',
            path: '/api.php',
            description: 'Get trivia questions. Specify amount, category, difficulty, and type. Use listCategories to find category IDs. Use getCategoryCount to check available questions before requesting.',
            parameters: [
                { position: { key: 'amount', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['default(10)', 'max(50)'] } },
                { position: { key: 'category', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()'] } },
                { position: { key: 'difficulty', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(easy,medium,hard)', options: ['optional()'] } },
                { position: { key: 'type', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'enum(multiple,boolean)', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Get 5 general questions', amount: 5, category: 9 },
                { _description: 'Get 3 hard science questions', amount: 3, category: 17, difficulty: 'hard' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { response_code: { type: 'number' }, results: { type: 'array', items: { type: 'object', properties: { type: { type: 'string' }, difficulty: { type: 'string' }, category: { type: 'string' }, question: { type: 'string' }, correct_answer: { type: 'string' }, incorrect_answers: { type: 'array', items: { type: 'string' } } } } } } }
            }
        },
        listCategories: {
            method: 'GET',
            path: '/api_category.php',
            description: 'List all available trivia categories with IDs and names. Use category IDs in getQuestions to filter by topic, or in getCategoryCount to check question availability.',
            parameters: [],
            tests: [
                { _description: 'List all categories' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { trivia_categories: { type: 'array', items: { type: 'object', properties: { id: { type: 'number' }, name: { type: 'string' } } } } } }
            }
        },
        getCategoryCount: {
            method: 'GET',
            path: '/api_count.php',
            description: 'Get the number of questions available in a specific category. Returns total and per-difficulty counts. Use category IDs from listCategories. Check counts before requesting in getQuestions.',
            parameters: [
                { position: { key: 'category', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: [] } }
            ],
            tests: [
                { _description: 'General Knowledge count (9)', category: 9 },
                { _description: 'Science count (17)', category: 17 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { category_id: { type: 'number' }, category_question_count: { type: 'object', properties: { total_question_count: { type: 'number' }, total_easy_question_count: { type: 'number' }, total_medium_question_count: { type: 'number' }, total_hard_question_count: { type: 'number' } } } } }
            }
        }
    }
}
