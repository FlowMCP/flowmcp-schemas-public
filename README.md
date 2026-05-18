# FlowMCP Public Schema Library v4

![Version](https://img.shields.io/badge/version-4.0.0-blue) ![Schemas](https://img.shields.io/badge/schemas-365-green) ![License](https://img.shields.io/badge/license-MIT-blue)

> 365 production-graded MCP tools (Grade A+B) — verified, tested, ready to use.

## What is FlowMCP?

FlowMCP normalizes heterogeneous APIs into uniform, AI-callable tools through deterministic schema definitions. This repository is the **public schema library** containing the curated subset of schemas that meet our quality bar (Score >= 3.5).

## Quickstart

```bash
# Install FlowMCP CLI
npm install -g github:FlowMCP/flowmcp-cli

# Initialize
flowmcp init

# Import this repo
flowmcp import https://github.com/FlowMCP/flowmcp-schemas-public

# Search for tools
flowmcp search weather
flowmcp search bitcoin
flowmcp search government

# Add a tool
flowmcp add flowmcp-schemas-public/brightsky/bright-sky.mjs

# Call it
flowmcp call brightsky_getWeather '{"lat":52.52,"lon":13.405,"date":"2026-05-18"}'
```

## Schema Distribution

| Grade | Count | Score Range |
|-------|------:|-------------|
| **A** | 128 | >= 4.5 |
| **B** | 237 | 3.5 – 4.5 |
| **Total** | **365** | >= 3.5 |

See [registry.json](./registry.json) for the full schema list with grade metadata.

## Schemas with API-Key Requirements

90 of 365 schemas require an API key (`requiredServerParams` field). Set the corresponding ENV variable per provider. Common examples:

| Provider | ENV Variable | Where to get |
|----------|--------------|--------------|
| Etherscan | `ETHERSCAN_API_KEY` | https://etherscan.io/apis |
| Moralis | `MORALIS_API_KEY` | https://moralis.io |
| Alchemy | `ALCHEMY_API_KEY` | https://www.alchemy.com |
| Geoapify | `GEOAPIFY_API_KEY` | https://www.geoapify.com |
| Open Charge Map | `OPENCHARGEMAP_API_KEY` | https://openchargemap.org/site/develop |

**No fake/placeholder keys included.** Users obtain keys themselves. Run `flowmcp dev env doctor` for coverage check.

## License & Terms of Services

FlowMCP schema definitions are **MIT-licensed**.

**However**, individual schemas access third-party APIs, each with their own Terms of Services. We document the ToS URL where available (`meta.termsOfService` field per schema) and the date we last verified the link.

**We do not classify or interpret these Terms of Services.** Users are solely responsible for reviewing each provider's terms before using a schema commercially or in production.

FlowMCP makes no warranty about ToS compliance, data licensing, or fitness for any purpose.

See [DISCLAIMER.md](./DISCLAIMER.md) for details. For a detailed FAQ:
- https://flowmcp.github.io/docs/license-faq/

## Architecture

This repository is a **mirror** of curated, production-graded schemas from the private source-of-truth repository. Schemas are deployed manually through a confirmation-prompted workflow (`npm run mirror`). No fake keys, no per-schema metadata files in public — only `registry.json` as single-source-of-truth.

```
flowmcp-schemas-public/
├── archive/v3.0.0/        # Legacy v3 schemas (frozen, not deployed)
├── schemas/v4.0.0/        # Production v4 schemas
│   └── providers/         # 365 Grade A+B schemas
├── registry.json          # Single-source metadata (grade, score, hash)
├── scripts/
│   ├── mirror-from-private.mjs
│   └── generate-schemas-json.mjs
└── tests/
```

## Related

| Repo | Description |
|------|-------------|
| [flowmcp-core](https://github.com/FlowMCP/flowmcp-core) | Schema execution engine (MIT) |
| [flowmcp-cli](https://github.com/FlowMCP/flowmcp-cli) | CLI tooling (MIT) |
| [flowmcp-spec](https://github.com/FlowMCP/flowmcp-spec) | Specification v4.0.0 (MIT) |
| [Documentation](https://flowmcp.github.io) | Full docs site |

## Contributing

Schema requests and improvements are welcome. Open an issue with the API you'd like to see covered.

## License

MIT — see [LICENSE](./LICENSE) and [DISCLAIMER.md](./DISCLAIMER.md).
