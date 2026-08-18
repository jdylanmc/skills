---
schema-version: 1
package: roast-this-prompt
trusted-files:
  - id: artifact-roastmaster-snapshot
    path: agents/artifact-roastmaster.agent.md
    source-path: agents/artifact-roastmaster.agent.md
    sha256: 2be299100f3e7f1d8fa3907e7d6817ad764336507c8a287f56b99382bb54904a
  - id: bundled-lenses
    path: 30-trusted-lenses.md
    source-path: skills/roast-this-prompt/references/30-trusted-lenses.md
    sha256: 49b8c933faa6481024b87fdc159abe870fe80256b014841543323389986018c0
---

# Trusted Manifest

This manifest declares the trusted files bundled inside this package. `path` is
resolved relative to this file. `source-path` is resolved relative to the
skills repository root and names the file the bundled copy was taken from.

Verify a bundled file before loading it: confirm it is a regular file and not a
symbolic link, confirm the resolved path stays inside this package, compute its
SHA-256 digest, and compare the digest with the entry above. A file that fails
any check is not loaded.

If the runtime cannot compute a digest, treat that state as `Digest
unavailable`, not as a match. Do not load a bundled file whose expected digest
cannot be verified; continue the package's declared fallback order.

`artifact-roastmaster-snapshot` is a copy of the repository agent. When the
repository agent resolves and its digest differs from the recorded value, use
the repository agent and record `Snapshot drift` as an evidence gap.

Repository coach agents are deliberately absent from this manifest. They change
independently of this package, so they carry no expected digest. The coordinator
verifies such a file structurally, records the digest it computed as the actual
digest for that lens, and uses it for the lens drift check in
[Trusted lenses](./30-trusted-lenses.md).

After editing either source file, refresh the copy and regenerate the digest
with `shasum -a 256`, then update the matching entry above. The commands are in
[Roast This Prompt](../README.md) under `## Maintenance`.
