---
name: redact-sensitive
description: Replace secrets, credentials, and personally identifiable information with explicit redaction markers, idempotently, so a reader can see that something was removed.
level: atom
allowed-tools: ["execute"]
includes: ["_base/_atoms/redact-sensitive/redact-sensitive.mjs"]
composes: []
used-by: ["_base/_molecules/persist-bounded-handoff/persist-bounded-handoff.md"]
---

# Sensitive Content Redaction

Remove sensitive spans from text and leave a visible marker where each one was.
This atom owns the deterministic floor. It owns nothing about what the text is
for or where it will be stored.

Deleting a secret silently produces a document that reads as if the secret was
never there, which is how an incomplete handoff gets mistaken for a complete
one. Every replacement here is announced.

## Required Files

1. [Redaction entry point](./redact-sensitive.mjs)

## Operation

```text
node <atoms>/redact-sensitive.mjs --stdin
```

Exit `0` prints `text` and `redactions` as JSON. `redactions` counts the spans
this call actually changed, grouped by category. Any non-zero exit prints a
stable failure category on standard error. Check availability with `--probe`, which prints
`handoff: available`.

## Markers

Every replacement is `[REDACTED:<category>]`:

| Category | What it replaces |
| --- | --- |
| `private-key` | A PEM private-key block, header and body and footer. |
| `credential` | A `Bearer` or `Basic` authorization value, and a cloud access-key identifier. |
| `token` | A recognizable provider token or a JSON Web Token. |
| `secret` | The value of an assignment whose key names a secret. |
| `email` | An electronic mail address. |
| `phone` | A telephone number written with separators or a country code. |

A key names a secret when any of its segments is one of `password`, `passwd`,
`pwd`, `passphrase`, `secret`, `token`, `key`, `credential`, `sas`, `sig`,
`signature`, `authorization`, `auth`, or `pat`, or when the key with its
separators removed contains a compound such as `apikey`, `accountkey`,
`accesskey`, `clientsecret`, `privatekey`, `connectionstring`, or
`refreshtoken`. The keyword may sit anywhere in the key, so `secret_key`,
`signing_key`, and a bare `key` are all covered.

## Rules

- A value is replaced; the key that named it stays, so a reader can tell which
  secret was present.
- An unquoted value ends at whitespace or at punctuation that carries
  structure, so a link, a list item, or a sentence around the value survives
  intact.
- An assignment nested inside another one is still found. `https://host/x?token=...`
  matches first with the key `https`, which names nothing; scanning resumes
  inside it and redacts the `token`.
- The floor is **eager on purpose**. `token: bounded` in ordinary prose is
  redacted. Rewrite the sentence rather than weakening the rule.
- A reference of the form `git@host:owner/repo` is read as an address and
  redacted. Use the HTTPS form of a remote in a reference.
- A commit identifier, a version, a port range, and an issue number are not
  redacted.
- Input is limited to 65536 UTF-8 bytes. Redaction is a bounded scan, not a
  log filter.

## Guarantees

- **Idempotent.** Redacting already-redacted text returns the same text and
  reports no further replacements. A marker is never relabelled, re-bracketed,
  or nested.
- Every replacement is visible as a marker. Nothing is deleted quietly.
- The categories are stable names a caller can report and a test can assert.

## Boundaries

This atom is a floor, not a guarantee of safety. Pattern matching cannot see a
secret that carries no recognizable shape, a customer name in a sentence, or an
internal host name that matters. **The caller is still responsible for the
content it supplies** and must remove what patterns cannot recognize before
calling.

This atom does not render, write, classify a document, or decide whether a
redacted document is fit to share.
