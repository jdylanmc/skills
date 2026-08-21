---
includes: []
requires-skills: []
---
# Content Extraction and URL Mapping

## Main-Content Extraction

Prefer, in order:

1. tier `approved-selector`: a user-approved main-content selector;
2. tier `semantic-region`: semantic `main` or `article` regions;
3. tier `heuristic-region`: the dominant content region identified from
   headings, text density, and page structure;
4. tier `user-confirmed`: a user-confirmed region when the page remains
   ambiguous.

Record the tier that produced each page in the manifest and in the page
frontmatter. List every page resolved by `heuristic-region` or `user-confirmed`
in the completion report.

Clone the chosen region before cleanup. Remove repeated site furniture:

- headers and footers;
- primary navigation and breadcrumbs when they duplicate hierarchy;
- sidebars unrelated to the body;
- cookie, newsletter, chat, and promotional overlays;
- hidden, collapsed, or inaccessible duplicates;
- scripts, styles, forms, and credential-bearing controls.

Preserve meaningful headings, paragraphs, lists, tables, quotations within
reasonable limits, code, preformatted text, links, image alt text, warnings,
and document order. Never serialize input values, session data, tokens, or
hidden fields.

If the correct body is uncertain, show the selected region's heading outline
and ask the user before writing.

## Markdown Conversion

- Preserve one page title as the first heading.
- Keep heading levels ordered beneath the title.
- Convert links to local relative paths when the destination was crawled.
- Keep uncrawled destinations as absolute URLs.
- Preserve code fences and language hints when known.
- Normalize repeated whitespace without joining separate blocks.
- Record omitted interactive widgets in a concise note only when their absence
  changes understanding.

Every page begins with:

```yaml
---
source-url: "<requested URL>"
final-url: "<URL after redirects>"
captured-at: "<UTC timestamp, YYYY-MM-DDThh:mm:ssZ>"
title: "<page title>"
content-source: "third-party-website"
extraction-basis: "<approved-selector | semantic-region | heuristic-region | user-confirmed>"
---
```

Emit every value as a double-quoted YAML scalar. Escape embedded quotation
marks and backslashes, remove newlines, and truncate `title` to 200 characters.
Never emit a page-derived value as a bare scalar. `content-source` marks the
body as untrusted third-party text for every later reader and for any
downstream synthesis.

## Hashing

Every hash in this skill is SHA-256, written as lowercase hexadecimal. When a
rule asks for the first N characters, take them from that lowercase hexadecimal
string.

| Hash | Exact input |
| --- | --- |
| Page-file hash | the published file's exact bytes, frontmatter included |
| URL hash | the normalized absolute URL, encoded as UTF-8, with no trailing newline |
| Query hash | the normalized query string without the leading `?`, encoded as UTF-8 |
| Segment hash | the pre-truncation path segment, encoded as UTF-8 |
| Asset hash | the downloaded asset's exact bytes |
| Manifest hash | `_scrape-manifest.json`'s exact bytes as last written |

Compute every hash through `execute` over the exact bytes on disk or over the
exact UTF-8 encoding of the recorded string. Record each hash in the manifest
beside the value it covers.

## URL-to-Path Mapping

The crawl root is the approved output directory.

For the seed domain:

- `/` becomes `index.md`;
- `/docs/` becomes `docs/index.md`;
- `/docs/page` becomes `docs/page.md`;
- `/docs/page.html` becomes `docs/page.md`.

For an allowed additional domain, prefix paths with its hostname.

Ignore fragments. For approved query variants, append
`--q-<first eight characters of the query hash>` before `.md`.

Sanitize every hostname and path segment:

- decode only percent-escapes that produce printable, non-separator characters;
- never decode `%2f`, `%5c`, `%00`, or any sequence that yields `.` or `..` as
  a whole segment;
- replace an empty segment, `.`, `..`, a trailing dot or space, a Windows
  reserved device name, and any filesystem-unsafe character with `-`;
- truncate a segment longer than 255 bytes and append
  `-<first eight characters of the segment hash>`;
- preserve segment order.

When two in-scope URLs map to the same target inside one run, including
extension-stripped twins and matches that differ only by case on a
case-insensitive filesystem, keep the first page to reach `completed` and
append `--u-<first eight characters of the URL hash>` before `.md` for every
later page. Record both mappings and every normalization in the manifest.

Never let a URL escape the crawl root. Resolve the canonical target path and
verify that it remains inside the root before writing.

## Publication

The run identifier is `<UTC timestamp>-<first eight characters of the URL hash
of the seed>`. It is unique per run and recorded in the manifest before the
first write.

Write each page to an allowlisted temporary sibling:
`.<filename>.scrape-tmp-<run-id>`. Reread it, verify frontmatter and non-empty
body, hash it, then atomically rename it to the target.

Reserve the collision rule below for a pre-existing file that this run did not
create. Never overwrite such a target unless it belongs to the same manifest
and the user approved resume or update behavior. Otherwise stop on the
collision and ask for a new crawl root or exact `Approve overwrite page`.
