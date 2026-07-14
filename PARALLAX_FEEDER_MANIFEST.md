# PARALLAX Feeder Manifest

This repository feeds the PARALLAX authority repo:

```text
ItsNotAILABS/PARALLAX-Exchange-Clearinghouse
```

## Lane

```text
memory_and_product_surface
```

## What this repo may feed

- memory receipt patterns,
- proof-room UI requirements,
- operator/control tower surface requirements,
- runtime state summaries,
- research mint display contracts,
- lineage and memory-link schemas.

## What this repo must not feed

- private user data,
- raw memory exports,
- unclassified conversation logs,
- secrets or credentials,
- personal data without explicit classification,
- unapproved private-core runtime state.

## PARALLAX target surfaces

- Proof Room,
- Control Tower,
- Research Mint,
- Governance,
- Federation Registry.

## Promotion rule

A memory, UI, lineage, or proof-room pattern from this repo becomes PARALLAX authority only after:

1. source commit or artifact hash is recorded,
2. personal/private/public boundary is assigned,
3. proof-room target surface is declared,
4. receipt and memory-link behavior is mapped,
5. explicit integration PR is opened in `PARALLAX-Exchange-Clearinghouse`.

## Current boundary

This feeder may help PARALLAX remember and display proof, but it must not leak private memory, raw user records, or unclassified internal state.
