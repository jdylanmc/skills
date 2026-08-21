---
synthesis-stage: nano
synthesis-schema-version: 1
includes: []
---

# Scraping Essentials

Model a scrape as **provider + approved plan + normalized queue + URL map +
manifest**. The browser technology is replaceable; scope and evidence are not.

1. Ask for seed, output root, traversal mode, depth, page cap, domains, query
   policy, images, authentication, and mutation rules. Check `llms.txt`.
2. Require a finite approved plan. Normalize and deduplicate URLs before
   navigation. Never silently broaden scope.
3. Use snapshots, stable interactions, and content-specific waits. Pause for
   user-controlled login. Never capture credentials or evade CAPTCHA, paywalls,
   access denial, or bot controls.
4. Extract the confirmed main body; remove headers, footers, repeated
   navigation, overlays, forms, scripts, and hidden duplicates.
5. Write one metadata-bearing Markdown file per page in a deterministic,
   root-contained URL tree. Rewrite crawled links locally.
6. Download only approved body images; validate, bound, deduplicate, and keep
   authenticated retrieval inside the browser session.
7. Update the manifest after every page. Validate queue totals, files, links,
   assets, limits, failures, cleanup, and browser closure.

Stop and ask whenever traversal, content selection, authentication, domain
scope, or state-changing behavior is ambiguous.
