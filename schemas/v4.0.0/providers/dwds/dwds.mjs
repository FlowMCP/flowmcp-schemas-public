export const main = {
    namespace: 'dwds',
    name: 'DWDS',
    description: 'Look up German word definitions, word frequencies, pronunciation (IPA), and dictionary snippets using the Digitales Woerterbuch der deutschen Sprache API.',
    docs: ['https://www.dwds.de/d/api'],
    tags: ['dictionary', 'language', 'german', 'linguistics', 'cacheTtlDaily'],
    version: '4.0.0',
    root: 'https://www.dwds.de',
    requiredServerParams: [],
    headers: {},
    tools: {
        getWordFrequency: {
            method: 'GET',
            path: '/api/frequency',
            description: 'Get lemmatized word frequency data. Returns cumulative frequencies across all word forms sharing the same lemma. Supports multiple words separated by pipe character. Use getDictionarySnippet for related data. Use getRandomEntries for related data.',
            parameters: [
                {
                    position: {
                        key: 'q',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                }
            ],
            tests: [
                {
                    _description: 'Get frequency for the word Haus',
                    q: 'Haus'
                },
                {
                    _description: 'Get frequency for the word Freiheit',
                    q: 'Freiheit'
                },
                {
                    _description: 'Get frequency for multiple words',
                    q: 'Haus|Wohnung'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from getWordFrequency',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        getDictionarySnippet: {
            method: 'GET',
            path: '/api/wb/snippet',
            description: 'Get short dictionary snippets for a word including part of speech, lemma, and URL to the full entry. Supports multiple lemmas separated by pipe character. Use getWordFrequency for related data. Use getRandomEntries for related data.',
            parameters: [
                {
                    position: {
                        key: 'q',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                }
            ],
            tests: [
                {
                    _description: 'Get snippet for Wanderlust',
                    q: 'Wanderlust'
                },
                {
                    _description: 'Get snippet for Zeitgeist',
                    q: 'Zeitgeist'
                },
                {
                    _description: 'Get snippets for multiple words',
                    q: 'Haus|Garten'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from getDictionarySnippet',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        getRandomEntries: {
            method: 'GET',
            path: '/api/wb/random',
            description: 'Get 5 random dictionary entries with metadata including part of speech, genera, article date, and URL to the full entry. Use getWordFrequency for related data. Use getDictionarySnippet for related data.',
            parameters: [],
            tests: [
                {
                    _description: 'Get random dictionary entries'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from getRandomEntries',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        getIpaPronunciation: {
            method: 'GET',
            path: '/api/ipa',
            description: 'Get IPA phonetic transcription for a German word. Maximum 20 characters. Returns IPA string and status (auto-generated or manually proved). Use getWordFrequency for related data. Use getDictionarySnippet for related data.',
            parameters: [
                {
                    position: {
                        key: 'q',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                }
            ],
            tests: [
                {
                    _description: 'Get IPA for Schokolade',
                    q: 'Schokolade'
                },
                {
                    _description: 'Get IPA for Eichhoernchen',
                    q: 'Eichhoernchen'
                },
                {
                    _description: 'Get IPA for Glueck',
                    q: 'Glueck'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from getIpaPronunciation',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        getGoetheWordList: {
            method: 'GET',
            path: '/api/lemma/goethe/:level.json',
            description: 'Get the Goethe-Institut vocabulary list for a specific CEFR proficiency level (A1, A2, or B1) as JSON. Use getWordFrequency for related data. Use getDictionarySnippet for related data.',
            parameters: [
                {
                    position: {
                        key: 'level',
                        value: '{{USER_PARAM}}',
                        location: 'insert'
                    },
                    z: {
                        primitive: 'enum(A1,A2,B1)',
                        options: []
                    }
                }
            ],
            tests: [
                {
                    _description: 'Get A1 vocabulary list',
                    level: 'A1'
                },
                {
                    _description: 'Get B1 vocabulary list',
                    level: 'B1'
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from getGoetheWordList',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        },
        searchCorpus: {
            method: 'GET',
            path: '/r',
            description: 'Search the DWDS text corpus and export results. Supports DDC query syntax, corpus selection, date ranges, and multiple output formats. Use getWordFrequency for related data. Use getDictionarySnippet for related data.',
            parameters: [
                {
                    position: {
                        key: 'q',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: []
                    }
                },
                {
                    position: {
                        key: 'corpus',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()', 'default(zeitungen)']
                    }
                },
                {
                    position: {
                        key: 'date-start',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'date-end',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'string()',
                        options: ['optional()']
                    }
                },
                {
                    position: {
                        key: 'format',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'enum(json,csv,tsv,tcf)',
                        options: ['optional()', 'default(json)']
                    }
                },
                {
                    position: {
                        key: 'limit',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'number()',
                        options: ['optional()', 'default(10)']
                    }
                },
                {
                    position: {
                        key: 'sort',
                        value: '{{USER_PARAM}}',
                        location: 'query'
                    },
                    z: {
                        primitive: 'enum(date_asc,date_desc,random)',
                        options: ['optional()']
                    }
                }
            ],
            tests: [
                {
                    _description: 'Search for Klimawandel in newspapers',
                    q: 'Klimawandel',
                    corpus: 'zeitungen',
                    format: 'json',
                    limit: 5
                },
                {
                    _description: 'Search for Digitalisierung',
                    q: 'Digitalisierung',
                    format: 'json',
                    limit: 3
                }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'Response from searchCorpus',
                    properties: {
                        result: {
                            type: 'object',
                            description: 'Result data from the API'
                        }
                    }
                }
            }
        }
    }
}
