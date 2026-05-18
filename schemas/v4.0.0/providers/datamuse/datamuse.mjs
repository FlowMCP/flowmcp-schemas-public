export const main = {
    namespace: 'datamuse',
    name: 'Datamuse Word API',
    description: 'Access the Datamuse API for finding words and phrases. Find words with similar meaning, words that rhyme, words that match a spelling pattern, and autocomplete suggestions. Powers word-finding tools for writers, crossword solvers, and language learners. Covers 100,000+ English words. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://www.datamuse.com/api/'],
    tags: ['language', 'reference', 'nlp', 'opendata', 'cacheTtlStatic'],
    root: 'https://api.datamuse.com',
    requiredServerParams: [],
    headers: {},
    tools: {
        findWords: {
            method: 'GET',
            path: '/words',
            description: 'Find words matching various constraints. Use ml (meaning like) for synonyms, rel_rhy for rhymes, sp for spelling pattern (? = single char, * = any), sl for sounds like. Combine multiple constraints for precise results.',
            parameters: [
                { position: { key: 'ml', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Meaning like — find words with similar meaning, e.g. ocean returns sea, water, deep' },
                { position: { key: 'sl', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Sounds like — find words that sound similar, e.g. jirraf returns giraffe' },
                { position: { key: 'sp', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Spelled like — pattern match with ? (single char) and * (any), e.g. t?? returns the, too, two' },
                { position: { key: 'rel_rhy', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Perfect rhyme — find words that rhyme with the given word, e.g. love returns dove, above, shove' },
                { position: { key: 'rel_trg', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Trigger word — find words commonly associated with the given word, e.g. cow returns milk, barn' },
                { position: { key: 'max', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'max(1000)'] }, description: 'Maximum number of results to return (1-1000, default 10)' },
                { position: { key: 'md', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] }, description: 'Metadata flags — d (definitions), p (parts of speech), s (syllable count), r (pronunciation), f (frequency)' }
            ],
            tests: [
                { _description: 'Words meaning like ocean', ml: 'ocean', max: 5 },
                { _description: 'Words rhyming with love', rel_rhy: 'love', max: 5 },
                { _description: 'Words matching t??', sp: 't??', max: 5 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'array', items: { type: 'object', properties: { word: { type: 'string' }, score: { type: 'number' }, tags: { type: 'array', items: { type: 'string' } } } } }
            }
        },
        autocomplete: {
            method: 'GET',
            path: '/sug',
            description: 'Get autocomplete suggestions for a word prefix. Returns up to 10 suggestions ranked by frequency. Useful for search-as-you-type interfaces.',
            parameters: [
                { position: { key: 's', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: [] }, description: 'Word prefix to autocomplete, e.g. hel returns hello, help, helmet' },
                { position: { key: 'max', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['optional()', 'default(10)', 'max(25)'] }, description: 'Maximum number of suggestions to return (1-25, default 10)' }
            ],
            tests: [
                { _description: 'Autocomplete hel', s: 'hel', max: 5 },
                { _description: 'Autocomplete comp', s: 'comp', max: 5 },
                { _description: 'Autocomplete trans', s: 'trans', max: 10 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'array', items: { type: 'object', properties: { word: { type: 'string' }, score: { type: 'number' } } } }
            }
        }
    }
}
