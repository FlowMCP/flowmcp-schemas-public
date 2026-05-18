# Disclaimer

FlowMCP schema code is MIT-licensed. However, the schemas in this repository orchestrate calls to third-party APIs that have their own Terms of Services.

## Three-Layer License Model

1. **FlowMCP Code (MIT):** Schema definitions in this repository. Covered by the LICENSE file.
2. **API Provider Terms of Services:** Each API has its own ToS. Schemas may include an optional `meta.termsOfService` field with the provider's ToS URL and the date we last verified the link. **We do not classify or interpret these Terms of Services.**
3. **Data License of Responses:** Data returned by APIs may have its own license. Always review.

## What We Do

- Document the ToS URL (where available) per schema
- Document the date we last checked the link
- Document the language of the ToS

## What We Do NOT Do

- Classify ToS into legal categories
- Provide recommendations regarding commercial use
- Reproduce ToS content in our schemas
- Make any representation about ToS compliance or fitness for any purpose

## User Responsibility

You are solely responsible for:

- Reviewing each API provider's Terms of Services before use
- Complying with rate limits, attribution requirements, and data licenses
- Determining suitability for commercial, research, or production use
- Adhering to LLM-training restrictions and re-distribution clauses

## No Warranty

FlowMCP is provided "as is" without warranty of any kind. The authors and contributors make no representation about ToS compliance, data licensing, or fitness for any purpose. Use at your own risk.

## API-Key Requirements

90 of 365 schemas require an API key (`requiredServerParams` field). We **do not** include any fake or placeholder keys. Users obtain keys themselves from each provider.

## More Info

- License FAQ: https://flowmcp.github.io/docs/license-faq/
- Spec: https://github.com/FlowMCP/flowmcp-spec/blob/main/spec/v4.0.0/23-license-and-tos.md
- Memo 041 in the development memos: Terms of Services + License Strategy (private)
