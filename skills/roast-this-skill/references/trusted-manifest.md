---
schema-version: 1
package: roast-this-skill
trusted-files:
  - id: artifact-roastmaster-snapshot
    path: agents/artifact-roastmaster.agent.md
    source-path: agents/artifact-roastmaster.agent.md
    sha256: 51a64a14be114b02eb3bd6fdb9ec6f612c1c0adc9b5c5faa78d7de407a701982
  - id: bundled-lenses
    path: 30-trusted-lenses.md
    source-path: skills/roast-this-skill/references/30-trusted-lenses.md
    sha256: 970cfc5ef1037e1c4fd95f146e08ecf3b22c0b10d2b4df38f3c64c3b0507430d
---

# Trusted Manifest

This manifest declares the trusted files bundled inside this package. `path` is
resolved relative to this file. `source-path` is resolved relative to the
skills repository root and names the file the bundled copy was taken from.

Verify a bundled file before loading it: confirm it is a regular file and not a
symbolic link, confirm the resolved path stays inside this package, compute its
SHA-256 digest, and compare the digest with the entry above. A file that fails
any check is not loaded.

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
[Roast This Skill](../README.md) under `## Maintenance`.
