export const main = {
    namespace: 'serlo',
    name: 'Serlo.org Education Platform',
    description: 'Access the Serlo.org open education platform via GraphQL. Browse subjects, retrieve articles, exercises, taxonomy trees, and recent activity for the German OER learning platform. Free, no API key required.',
    version: '4.0.0',
    docs: ['https://lenabi.serlo.org/docs'],
    tags: ['education', 'oer', 'learning', 'graphql', 'cacheTtlDaily'],
    root: 'https://api.serlo.org',
    requiredServerParams: [],
    headers: { 'Content-Type': 'application/json' },
    tools: {
        getSchema: {
            method: 'POST',
            path: '/graphql',
            description: 'Retrieve the GraphQL schema via introspection. Returns all available types, fields, and their descriptions from the Serlo API.',
            parameters: [],
            tests: [
                { _description: 'Introspect Serlo GraphQL schema' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { queryType: { type: 'object', properties: { name: { type: 'string' } } }, types: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, kind: { type: 'string' }, fields: { type: 'array' } } } } } }
            }
        },
        listSubjects: {
            method: 'POST',
            path: '/graphql',
            description: 'List all available subjects (Faecher) on Serlo.org for a given language instance. Returns subject IDs and names.',
            parameters: [
                { position: { key: 'instance', value: '{{INSTANCE}}', location: 'body' }, z: { primitive: 'enum(de,en,es,fr,hi,ta)', options: ['default(de)'] } }
            ],
            tests: [
                { _description: 'List German subjects', instance: 'de' },
                { _description: 'List English subjects', instance: 'en' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { subjects: { type: 'array', items: { type: 'object', properties: { id: { type: 'number' }, name: { type: 'string' } } } } } }
            }
        },
        getContentById: {
            method: 'POST',
            path: '/graphql',
            description: 'Retrieve any Serlo content entity by its numeric ID. Returns type, title, content, and taxonomy information for articles, exercises, videos, and courses.',
            parameters: [
                { position: { key: 'id', value: '{{CONTENT_ID}}', location: 'body' }, z: { primitive: 'number()', options: ['min(1)'] } }
            ],
            tests: [
                { _description: 'Get article Zylinder (id 1555)', id: 1555 },
                { _description: 'Get article Addition (id 1495)', id: 1495 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { __typename: { type: 'string' }, id: { type: 'number' }, instance: { type: 'string' }, title: { type: 'string' }, content: { type: 'string' }, taxonomyTerms: { type: 'array', items: { type: 'string' } } } }
            }
        },
        getTaxonomyTerm: {
            method: 'POST',
            path: '/graphql',
            description: 'Retrieve a taxonomy term by ID with its children. Returns the term name, description, type, and child entities (articles, exercises, sub-terms).',
            parameters: [
                { position: { key: 'id', value: '{{TAXONOMY_ID}}', location: 'body' }, z: { primitive: 'number()', options: ['min(1)'] } }
            ],
            tests: [
                { _description: 'Get taxonomy term Prozentrechnung (id 23869)', id: 23869 }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { id: { type: 'number' }, name: { type: 'string' }, type: { type: 'string' }, childCount: { type: 'number' }, children: { type: 'array', items: { type: 'object', properties: { __typename: { type: 'string' }, id: { type: 'number' }, name: { type: 'string' }, title: { type: 'string' } } } } } }
            }
        },
        getRecentActivity: {
            method: 'POST',
            path: '/graphql',
            description: 'Fetch recent activity events on Serlo.org. Returns creation, revision, and moderation events with entity references and timestamps.',
            parameters: [
                { position: { key: 'first', value: '{{LIMIT}}', location: 'body' }, z: { primitive: 'number()', options: ['min(1)', 'max(50)', 'default(10)'] } },
                { position: { key: 'instance', value: '{{INSTANCE}}', location: 'body' }, z: { primitive: 'enum(de,en,es,fr,hi,ta)', options: ['default(de)', 'optional()'] } }
            ],
            tests: [
                { _description: 'Get 5 recent events on German instance', first: 5, instance: 'de' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { events: { type: 'array', items: { type: 'object', properties: { __typename: { type: 'string' }, date: { type: 'string' }, entityId: { type: 'number' }, entityType: { type: 'string' } } } } } }
            }
        },
        queryGraphql: {
            method: 'POST',
            path: '/graphql',
            description: 'Execute a custom GraphQL query against the Serlo API. Allows full flexibility for advanced queries not covered by predefined routes.',
            parameters: [
                { position: { key: 'query', value: '{{QUERY}}', location: 'body' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Get Serlo API version', query: '{ version }' },
                { _description: 'Get article by ID', query: '{ uuid(id: 1555) { __typename ... on Article { id currentRevision { title } instance } } }' }
            ],
            output: {
                mimeType: 'application/json',
                schema: { type: 'object', properties: { data: { type: 'object' } } }
            }
        }
    }
}


export const handlers = ( { sharedLists, libraries } ) => ( {
    getSchema: {
        preRequest: async ( { struct, payload } ) => {
            struct['body'] = { query: '{ __schema { queryType { name } types { name kind fields { name } } } }' }

            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            const data = response?.data?.__schema || response?.data || {}

            return { response: data }
        }
    },
    listSubjects: {
        preRequest: async ( { struct, payload } ) => {
            const instance = payload?.instance || 'de'
            struct['body'] = { query: `{ subject { subjects(instance: ${instance}) { id taxonomyTerm { name } } } }` }

            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            const subjects = ( response?.data?.subject?.subjects || [] )
                .map( ( s ) => {
                    const item = { id: s.id, name: s.taxonomyTerm?.name }

                    return item
                } )

            return { response: { subjects } }
        }
    },
    getContentById: {
        preRequest: async ( { struct, payload } ) => {
            const id = payload?.id
            struct['body'] = { query: `{ uuid(id: ${id}) { __typename ... on Article { id instance currentRevision { title content } taxonomyTerms { nodes { name } } } ... on Exercise { id instance currentRevision { content } } ... on Video { id instance currentRevision { title url } } ... on Course { id instance currentRevision { title content } } } }` }

            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            const entity = response?.data?.uuid
            if( !entity ) { return { response: { error: 'No entity found' } } }

            const result = { __typename: entity.__typename, id: entity.id, instance: entity.instance }

            if( entity.currentRevision?.title ) { result.title = entity.currentRevision.title }
            if( entity.currentRevision?.content ) { result.content = entity.currentRevision.content }
            if( entity.taxonomyTerms ) {
                result.taxonomyTerms = entity.taxonomyTerms.nodes
                    .map( ( n ) => {
                        const name = n.name

                        return name
                    } )
            }

            return { response: result }
        }
    },
    getTaxonomyTerm: {
        preRequest: async ( { struct, payload } ) => {
            const id = payload?.id
            struct['body'] = { query: `{ uuid(id: ${id}) { __typename ... on TaxonomyTerm { id name description type children { nodes { __typename ... on TaxonomyTerm { id name } ... on Article { id currentRevision { title } } ... on Exercise { id } ... on Video { id currentRevision { title } } ... on Course { id currentRevision { title } } } } } } }` }

            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            const term = response?.data?.uuid
            if( !term ) { return { response: { error: 'Not found' } } }

            const children = ( term.children?.nodes || [] )
                .map( ( child ) => {
                    const item = { __typename: child.__typename, id: child.id }

                    if( child.name ) { item.name = child.name }
                    if( child.currentRevision?.title ) { item.title = child.currentRevision.title }

                    return item
                } )

            return { response: { id: term.id, name: term.name, type: term.type, childCount: children.length, children } }
        }
    },
    getRecentActivity: {
        preRequest: async ( { struct, payload } ) => {
            const first = payload?.first || 10
            const instance = payload?.instance
            const instanceArg = instance ? `, instance: ${instance}` : ''
            struct['body'] = { query: `{ events(first: ${first}${instanceArg}) { nodes { __typename ... on CreateEntityNotificationEvent { date entity { __typename id } } ... on CreateEntityRevisionNotificationEvent { date entity { __typename id } } ... on CheckoutRevisionNotificationEvent { date repository { __typename id } } } } }` }

            return { struct }
        },
        postRequest: async ( { response, struct, payload } ) => {
            const events = ( response?.data?.events?.nodes || [] )
                .map( ( event ) => {
                    const item = { __typename: event.__typename, date: event.date }

                    if( event.entity ) { item.entityId = event.entity.id; item.entityType = event.entity.__typename }
                    if( event.repository ) { item.entityId = event.repository.id; item.entityType = event.repository.__typename }

                    return item
                } )

            return { response: { events } }
        }
    },
    queryGraphql: {
        preRequest: async ( { struct, payload } ) => {
            const query = payload?.query
            struct['body'] = { query }

            return { struct }
        }
    }
} )
