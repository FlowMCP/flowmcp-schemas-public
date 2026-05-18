export const main = {
    namespace: 'shodan',
    name: 'ShodanInternetDB',
    description: 'Look up open ports, CPEs, hostnames, tags, and known CVE vulnerabilities for any IP address via the Shodan InternetDB — no API key required.',
    version: '4.0.0',
    docs: ['https://internetdb.shodan.io/'],
    tags: ['security', 'network', 'infosec', 'vulnerability', 'ports', 'cacheTtlDaily'],
    root: 'https://internetdb.shodan.io',
    requiredServerParams: [],
    headers: {},
    tools: {
        lookupIp: {
            method: 'GET',
            path: '/:ip',
            description: 'Look up open ports, hostnames, CPEs, tags, and known CVE vulnerabilities for a given IP address. Data is updated weekly.',
            parameters: [
                { position: { key: 'ip', value: '{{USER_PARAM}}', location: 'insert' }, z: { primitive: 'string()', options: [] } }
            ],
            tests: [
                { _description: 'Look up Google DNS IP address', ip: '8.8.8.8' },
                { _description: 'Look up Cloudflare DNS IP address', ip: '1.1.1.1' },
                { _description: 'Look up a well-known public IP', ip: '208.67.222.222' }
            ],
            output: {
                mimeType: 'application/json',
                schema: {
                    type: 'object',
                    properties: {
                        ip: { type: 'string', description: 'The queried IP address' },
                        ports: { type: 'array', items: { type: 'number' }, description: 'List of open ports detected on the host' },
                        hostnames: { type: 'array', items: { type: 'string' }, description: 'Hostnames associated with this IP address' },
                        cpes: { type: 'array', items: { type: 'string' }, description: 'Common Platform Enumeration identifiers for detected services' },
                        tags: { type: 'array', items: { type: 'string' }, description: 'Categorical labels (e.g. vpn, tor, cloud)' },
                        vulns: { type: 'array', items: { type: 'string' }, description: 'CVE identifiers for known vulnerabilities on this host' }
                    }
                }
            }
        }
    }
}
