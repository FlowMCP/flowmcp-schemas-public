// Migrated from v1.2.0 -> v2.0.0
// Category: simple

export const main = {
    namespace: 'hnrss',
    name: 'Hacker News JSON Feeds',
    description: 'Access Hacker News content via realtime JSON feeds: new posts, comments, jobs, replies, favorites, and more.',
    version: '4.0.0',
    docs: ['https://hnrss.org'],
    tags: ['news', 'hackernews', 'feeds', 'cacheTtlDaily'],
    root: 'https://hnrss.org',
    tools: {
        getFeed: {
            method: 'GET',
            path: '/:feedPath',
            description: 'Retrieves a Hacker News JSON Feed based on feed type and optional filters like query, points, or comment count.',
            parameters: [
                { position: { key: 'feedPath', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'enum(newest.jsonfeed,newcomments.jsonfeed,frontpage.jsonfeed,replies.jsonfeed,bestcomments.jsonfeed,item.jsonfeed,ask.jsonfeed,show.jsonfeed,polls.jsonfeed,classic.jsonfeed,best.jsonfeed,invited.jsonfeed,pool.jsonfeed,active.jsonfeed,launches.jsonfeed,jobs.jsonfeed,whoishiring/jobs.jsonfeed,whoishiring/hired.jsonfeed,whoishiring/freelance.jsonfeed,whoishiring.jsonfeed,submitted.jsonfeed,threads.jsonfeed,user.jsonfeed,favorites.jsonfeed)', options: [] } },
                { position: { key: 'q', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'points', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'optional()'] } },
                { position: { key: 'comments', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'optional()'] } },
                { position: { key: 'count', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(1)', 'max(100)', 'optional()'] } },
                { position: { key: 'search_attrs', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'link', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'description', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'number()', options: ['min(0)', 'max(1)', 'optional()'] } },
                { position: { key: 'author', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } },
                { position: { key: 'id', value: '{{USER_PARAM}}', location: 'query' }, z: { primitive: 'string()', options: ['optional()'] } }
            ],
            tests: [
                { _description: 'Front page posts', feedPath: 'frontpage.jsonfeed' },
                { _description: 'Ask HN with 10+ comments', feedPath: 'ask.jsonfeed', comments: 10 },
                { _description: 'Search for React Native', feedPath: 'newest.jsonfeed', q: 'React Native' },
                { _description: 'Favorites from user edavis', feedPath: 'favorites.jsonfeed', id: 'edavis' },
                { _description: 'Replies to user jerf', feedPath: 'replies.jsonfeed', id: 'jerf' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    description: 'JSON Feed (v1.1) with Hacker News items matching the feed type and filters',
                    properties: {
                        version: { type: 'string', description: 'JSON Feed version (https://jsonfeed.org/version/1.1)' },
                        title: { type: 'string', description: 'Feed title describing the content type' },
                        description: { type: 'string', description: 'Feed description with source info' },
                        home_page_url: { type: 'string', description: 'URL to the corresponding Hacker News page' },
                        items: { type: 'array', description: 'Array of feed items (posts, comments, jobs, etc.)', items: { type: 'object', properties: { id: { type: 'string', description: 'Unique item URL on Hacker News' }, title: { type: 'string', description: 'Post title or comment excerpt' }, content_html: { type: 'string', description: 'HTML content of the item (comments, job descriptions)' }, url: { type: 'string', description: 'Hacker News discussion URL' }, external_url: { type: 'string', description: 'External link URL (the submitted article/site)' }, date_published: { type: 'string', description: 'ISO 8601 publication timestamp' }, author: { type: 'object', description: 'Author object with name and url fields' } } } }
                    }
                }
            },
        }
    }
}
