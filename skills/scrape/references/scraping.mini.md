---
synthesis-stage: mini
synthesis-schema-version: 1
---

# Interactive Scraping Model

Treat scraping as a provider-independent crawl, not a loop over URLs. Keep five
models explicit: browser provider, approved plan, normalized queue,
URL-to-artifact map, and durable manifest.

## Plan Before Traversal

Ask one question at a time for the seed, output root, traversal mode, depth,
page cap, domains, query handling, inclusion rules, images, authentication, and
state-changing interactions. Check `llms.txt` for site context. Require a
finite plan and exact approval before broad navigation.

Use serial traversal by default. A URL enters the queue only when it satisfies
the approved limits and has a recorded discovery reason. Normalize before
fetching; remove fragments, resolve relative links, deduplicate, and reject
infinite calendars, facets, tracking variants, and unbounded pagination.

## Browse Safely

Use snapshots to understand state, stable semantic targets for interaction,
and content-specific waits for dynamic pages. Record redirects. Ask before
cross-domain navigation, ambiguous `Next` controls, downloads, forms, or
server-side changes.

For login or multi-factor authentication, pause and let the user act directly
in the visible browser. Never request, type, inspect, or persist credentials,
tokens, cookies, form values, or browser storage. CAPTCHA, paywalls, access
denials, and bot challenges stop that branch; do not evade them.

## Extract and Map

Select an approved main region, semantic `main` or `article`, or a
user-confirmed dominant content region. Remove headers, footers, repeated
navigation, irrelevant sidebars, overlays, forms, scripts, styles, and hidden
duplicates. Preserve headings, prose, lists, tables, code, links, warnings,
images, and order.

Write one Markdown file per page with source URL, final URL, title, and capture
time. Map `/` to `index.md`, trailing paths to nested `index.md`, and content
paths to matching `.md` files. Prefix extra domains, ignore fragments, hash
approved queries, sanitize segments, and verify every canonical path remains
inside the crawl root.

## Images

Ask whether images are required. If not, keep alt text and remote URLs. If yes,
download only body images, validate type and size, use the authenticated
browser context when necessary, hash and deduplicate, save under a bounded
asset tree, and rewrite local references. Never export session secrets.

## Persist and Prove

Publish pages with temporary siblings and atomic rename. Update a machine
manifest and Markdown index after every page. Resume only from a validated
manifest; unknown existing files are collisions.

Completion reconciles queue totals, files, local links, assets, limits,
failures, temporary cleanup, secret handling, and browser closure. On
cancellation, keep completed pages and mark the manifest partial.

## Checklist

- Finite approved plan?
- Provider available and replaceable?
- Queue normalized before navigation?
- User controls authentication and mutations?
- Main body extracted without site furniture?
- Paths deterministic and root-contained?
- Images optional and bounded?
- Manifest supports validation and resume?
