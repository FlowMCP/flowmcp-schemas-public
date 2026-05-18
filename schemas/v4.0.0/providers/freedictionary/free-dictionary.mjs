export const main = {
    namespace: 'freedictionary',
    name: 'Free Dictionary',
    description: 'Look up English word definitions, phonetics, synonyms, antonyms, and usage examples using the Free Dictionary API.',
    docs: ['https://dictionaryapi.dev/'],
    tags: ['dictionary', 'language', 'english', 'definitions', 'cacheTtlDaily'],
    version: '4.0.0',
    root: 'https://api.dictionaryapi.dev',
    requiredServerParams: [],
    headers: {},
    tools: {
        getWordDefinition: {
            method: 'GET',
            path: '/api/v2/entries/en/:word',
            description: 'Get complete dictionary entry for an English word including definitions, phonetics, synonyms, antonyms, and example sentences. Returns an array since some words have multiple entries with different origins.',
            parameters: [
                { position: { key: 'word', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Look up the word hello', word: 'hello' },
                { _description: 'Look up the word ephemeral', word: 'ephemeral' },
                { _description: 'Look up the word serendipity', word: 'serendipity' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'array',
                    description: 'Array of dictionary entries for the word (multiple entries if the word has different etymological origins)',
                    items: {
                        type: 'object',
                        properties: {
                            word: { type: 'string', description: 'The looked-up word' },
                            phonetic: { type: 'string', description: 'IPA phonetic transcription of the word' },
                            phonetics: {
                                type: 'array',
                                description: 'Array of phonetic variants with optional audio URLs',
                                items: {
                                    type: 'object',
                                    properties: {
                                        text: { type: 'string', description: 'IPA phonetic transcription' },
                                        audio: { type: 'string', description: 'URL to MP3 pronunciation audio (empty string if unavailable)' }
                                    }
                                }
                            },
                            meanings: {
                                type: 'array',
                                description: 'Array of meanings grouped by part of speech (noun, verb, adjective, etc.)',
                                items: {
                                    type: 'object',
                                    properties: {
                                        partOfSpeech: { type: 'string', description: 'Part of speech (noun, verb, adjective, adverb, etc.)' },
                                        definitions: {
                                            type: 'array',
                                            description: 'Array of definitions for this part of speech',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    definition: { type: 'string', description: 'The definition text' },
                                                    example: { type: 'string', description: 'Usage example sentence (may be absent)' },
                                                    synonyms: { type: 'array', description: 'List of synonym words' },
                                                    antonyms: { type: 'array', description: 'List of antonym words' }
                                                }
                                            }
                                        },
                                        synonyms: { type: 'array', description: 'Synonyms for this part of speech overall' },
                                        antonyms: { type: 'array', description: 'Antonyms for this part of speech overall' }
                                    }
                                }
                            },
                            sourceUrls: { type: 'array', description: 'Source URLs for the dictionary data (e.g. Wiktionary)' }
                        }
                    }
                }
            }
        }
    },
}