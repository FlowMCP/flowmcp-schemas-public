// Schema for #318 — DuckDuckGo Instant Answer API
// No API key required — fully public

export const main = {
    namespace: 'duckduckgo',
    name: 'DuckDuckGo Instant Answers',
    description: 'Get instant answers, article summaries, related topics, and definitions from DuckDuckGo. Returns structured knowledge data from hundreds of sources. No API key required.',
    version: '4.0.0',
    docs: ['https://github.com/duckduckgo/duckduckgo-publisher/blob/master/share/site/duckduckgo/api.tx'],
    tags: ['search', 'knowledge', 'reference', 'cacheTtlDaily'],
    root: 'https://api.duckduckgo.com',
    requiredServerParams: [],
    headers: {},
    tools: {
        instantAnswer: {
            method: 'GET',
            path: '/',
            description: 'Get an instant answer for a query. Returns article abstracts, related topics, definitions, and direct answers from hundreds of knowledge sources. Check the Type field to determine the response category.',
            parameters: [
                {
                    position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'string()', options: ['min(1)'] }
                },
                {
                    position: { key: 'format', value: 'json', location: 'query' },
                    z: { primitive: 'string()', options: [] }
                },
                {
                    position: { key: 'no_html', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'enum(0,1)', options: ['optional()', 'default(1)'] }
                },
                {
                    position: { key: 'skip_disambig', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'enum(0,1)', options: ['optional()', 'default(0)'] }
                },
                {
                    position: { key: 'no_redirect', value: '{{USER_PARAM}}', location: 'query' },
                    z: { primitive: 'enum(0,1)', options: ['optional()', 'default(1)'] }
                },
                {
                    position: { key: 't', value: 'flowmcp', location: 'query' },
                    z: { primitive: 'string()', options: [] }
                }
            ],
            tests: [
                { _description: 'Instant answer for Berlin', q: 'Berlin' },
                { _description: 'Instant answer for Bitcoin', q: 'Bitcoin' },
                { _description: 'Instant answer for Albert Einstein', q: 'Albert Einstein' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'DuckDuckGo instant answer response with structured knowledge data',
                    properties: {
                        Abstract: { type: 'string', description: 'Short topic summary text (may contain HTML unless no_html=1)' },
                        AbstractText: { type: 'string', description: 'Plain text version of the abstract without HTML' },
                        AbstractSource: { type: 'string', description: 'Source of the abstract (e.g. "Wikipedia")' },
                        AbstractURL: { type: 'string', description: 'URL to the full source article' },
                        Image: { type: 'string', description: 'URL of the topic image (empty string if none)' },
                        Heading: { type: 'string', description: 'Main heading/title of the result' },
                        Answer: { type: 'string', description: 'Instant answer text for computation or fact queries (empty if not applicable)' },
                        AnswerType: { type: 'string', description: 'Category of the instant answer (e.g. "calc", "ip", empty for none)' },
                        Definition: { type: 'string', description: 'Dictionary definition text (empty if not a definition query)' },
                        DefinitionSource: { type: 'string', description: 'Source of the definition (e.g. "Wiktionary")' },
                        DefinitionURL: { type: 'string', description: 'URL to the full definition source' },
                        Type: { type: 'string', description: 'Response type: A (article), D (disambiguation), C (category), N (name), E (exclusive), or empty' },
                        Redirect: { type: 'string', description: 'Redirect URL for !bang queries (empty if not a redirect)' },
                        RelatedTopics: {
                            type: 'array',
                            description: 'Array of topics related to the query, useful for disambiguation or exploration',
                            items: {
                                type: 'object',
                                properties: {
                                    Result: { type: 'string', description: 'HTML snippet with link and summary text' },
                                    FirstURL: { type: 'string', description: 'URL to the related topic page' },
                                    Text: { type: 'string', description: 'Plain text description of the related topic' },
                                    Icon: {
                                        type: 'object',
                                        description: 'Icon/thumbnail image for this related topic',
                                        properties: {
                                            URL: { type: 'string', description: 'Icon image URL (empty if none)' },
                                            Height: { type: 'string', description: 'Icon height in pixels (empty string if unknown)' },
                                            Width: { type: 'string', description: 'Icon width in pixels (empty string if unknown)' }
                                        }
                                    }
                                }
                            }
                        },
                        Results: {
                            type: 'array',
                            description: 'Array of direct result links for the query (typically from official sources)',
                            items: {
                                type: 'object',
                                properties: {
                                    Result: { type: 'string', description: 'HTML snippet with link and result text' },
                                    FirstURL: { type: 'string', description: 'URL to the result page' },
                                    Text: { type: 'string', description: 'Plain text description of the result' },
                                    Icon: {
                                        type: 'object',
                                        description: 'Icon/thumbnail image for this result',
                                        properties: {
                                            URL: { type: 'string', description: 'Icon image URL (empty if none)' },
                                            Height: { type: 'string', description: 'Icon height in pixels (empty string if unknown)' },
                                            Width: { type: 'string', description: 'Icon width in pixels (empty string if unknown)' }
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
