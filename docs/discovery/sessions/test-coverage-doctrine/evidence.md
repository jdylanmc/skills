# Evidence - Test Coverage Doctrine

Every claim used in a decision must be traceable to an entry here. No cycle has
run, so nothing here has been used in a decision yet.

## Sources

| Source | Read date | Revision | What it establishes | Node |
| --- | --- | --- | --- | --- |
| `doctrine/testing.doctrine.md` | 2026-08-20 | commit `e98a372`, 152 lines | Line 29: "Prefer value over test count or coverage. Improve or remove tests that are weak, slow, costly, or implementation-coupled." Line 35: "Coverage measures execution, not assertion quality. Use it to find unexecuted behavior, then create a black-box test with an independently meaningful expected result." Line 37: "**Warning - never treat a numerical coverage target as a quality verdict.**" | n-0003 |
| `doctrine/manifest.md` and `AGENTS.md` Doctrine section | 2026-08-20 | commit `e98a372` | Doctrine files are integrity-controlled: the manifest carries a SHA-256 per file, and `AGENTS.md` requires regenerating the digest with `shasum -a 256` after any doctrine edit. Any amendment arising from this session must update the manifest entry. | n-0003 |

## Unverified Sources

Supplied by the user. **Titles were fetched and are verified. Content is not.**
No claim from any of these may be recorded as evidence until a transcript is
retrieved or supplied.

| Source | Verified title | Verification status | Node |
| --- | --- | --- | --- |
| https://www.youtube.com/watch?v=C5IH0ABmyc0 | TDD: Theme & Variations (Kent Beck) | Title fetched 2026-08-20. Transcript not retrieved. Content unverified. | n-0004 |
| https://www.youtube.com/watch?v=ILkT_HV9DVU | Open Lecture by James Bach on Software Testing | Title fetched 2026-08-20. Transcript not retrieved. Content unverified. | n-0004 |
| https://www.youtube.com/watch?v=EZ05e7EMOLM | TDD, Where Did It All Go Wrong (Ian Cooper) | Title fetched 2026-08-20. Transcript not retrieved. Content unverified. | n-0004 |

The user asked for a synthesis of the Kent Beck talk. That synthesis has **not**
been produced, because producing it from recall rather than from the source
would be fabricated evidence. The task is recorded as `needs-research`.

## Research Results

None. No research has been run.

## Prototype Outputs

None. No prototype has been proposed or approved.

## Limitations

- `docs/` is untracked in git, so this package is outside version control.
- Video content cannot be read by the available fetch tool, which returns page
  chrome rather than a transcript. A read-only research subagent, a transcript
  service, or a user-supplied transcript is required before n-0004 can advance.
- No cycle has run. Nothing in this package has been reinterpreted, selected,
  interrogated, or confirmed, and the seed nodes are the loop's reading of the
  anchor rather than agreed structure.
