# NOVA Living Document Intelligence Canon

## Principle

Every document in NOVA OVO is a living entity. It has version history, lineage tracking, a doctrine level (N1–N12), and a gate requirement. Documents evolve through recital — each invocation may produce an updated version.

## Document Anatomy

```yaml
id: uuid
title: string
version: semantic (major.minor.patch)
doctrineLevel: 1-12 (N1=highest authority)
content: markdown
metadata:
  author: string
  createdAt: ISO timestamp
  updatedAt: ISO timestamp
  ring: 1-12
  beat: integer
  gateRequired: A | B | C | null
lineage: [prior version titles]
active: boolean
```

## Doctrine Levels

Documents at N1 require Gate A green status and Sovereign approval to create or modify. Documents at N2–N4 require Gate A. Documents at N5–N12 can be created with standard operator permissions.

## Lineage

When a document is updated, the prior version title is appended to the lineage array. This creates an auditable chain of every version the document has passed through.

## Recital Protocol

A document is "recited" when it is read in context of an active operation. Recital increases the document's resonance score, making it more likely to appear in subsequent dual reads.
