# Images and Assets

## Choice

Ask during crawl planning whether images are required. The default is no image
retrieval: preserve useful alt text and the absolute source URL.

When images are approved, include only images referenced by the extracted main
body. Exclude logos, avatars, tracking pixels, navigation icons, ads, and
decorative backgrounds unless the user explicitly includes them.

## Persistence Mechanisms

Before asking the user to approve images, probe the active provider and state
which of these mechanisms it actually supports. Do not promise a mechanism the
provider does not offer.

Choose exactly one mechanism per accepted asset, in this order:

1. **Browser-context retrieval.** Optional, because a provider may not be able
   to persist bytes without routing them through the model context. It is the
   only permitted mechanism whenever the asset's origin needs the current
   session. When it is available, ask the provider to retrieve the referenced
   asset inside the active browser context and persist its bytes to a local
   path under the crawl root. Never route asset bytes through the model
   context, and never base64-encode an asset into a message.
2. **Bounded unauthenticated fetch.** Allowed only when the asset origin needs
   no session. Issue one `execute` request per asset with the exact recorded
   absolute URL; no cookie, authorization, or credential header; no browser
   storage; at most two redirects, and only inside the approved origin set; a
   bounded timeout; and streaming that aborts at the per-image cap.
3. **Degrade.** When no mechanism is available for an asset, including every
   session-protected asset while browser-context retrieval is unsupported, keep
   the alt text and the absolute source URL, record the reason in the manifest,
   and continue.

Never export cookies or tokens to a shell command, and never retrieve an
authentication-gated asset outside the browser context.

## Retrieval Contract

For each accepted image:

1. resolve lazy-loaded and responsive source candidates;
2. prefer the image actually displayed at crawl time;
3. verify an image content type, and enforce the size cap while streaming
   rather than trusting `Content-Length`;
4. retrieve it through the mechanism selected above;
5. hash the bytes and deduplicate identical assets. The winning path is the one
   derived from the first accepted URL in crawl order; every later URL for the
   same hash points at that path and is recorded in the manifest;
6. map the asset to `_assets/<hostname>/<URL path>/<file name>`: sanitize the
   hostname and every URL-path segment with the rules in
   [Content extraction and URL mapping](./40-content-and-url-mapping.md),
   resolve the canonical target beneath `_assets/`, and verify it remains inside
   the crawl root before writing. Reject and record any asset whose path
   resolves outside the root;
7. write it through an allowlisted temporary sibling and atomic rename, exactly
   as pages are published;
8. use the extension derived from the verified content type:

   | Content type | Extension |
   | --- | --- |
   | `image/png` | `.png` |
   | `image/jpeg` | `.jpg` |
   | `image/gif` | `.gif` |
   | `image/webp` | `.webp` |
   | `image/avif` | `.avif` |
   | `image/x-icon` or `image/vnd.microsoft.icon` | `.ico` |
   | `image/svg+xml` | `.svg`, only when explicitly approved |

   Degrade any other content type to its remote URL;
9. rewrite the page Markdown to a relative local path;
10. retain alt text and an optional source-URL note in the manifest.

Default limits are 25 MiB per image and 500 MiB for the crawl. Ask before
raising either limit.

If an asset cannot be retrieved safely, retain its absolute URL and record the
failure. Do not fail an otherwise valid page unless the image is essential to
its meaning; ask the user when essentiality is unclear.

Treat Scalable Vector Graphics as scriptable content: exclude it by default,
include it only on explicit approval, and never execute or evaluate it. Never
retrieve an executable file through the image workflow. Do not embed data URLs
or secrets in Markdown.
