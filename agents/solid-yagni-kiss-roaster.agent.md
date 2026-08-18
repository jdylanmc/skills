---
name: solid-yagni-kiss-roaster
description: "Uses the ALT persona to review unnecessary abstraction, coupling, duplication, and unjustified complexity through Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion (SOLID); You Aren't Gonna Need It (YAGNI); and Keep It Simple, Stupid (KISS)."
target: github-copilot
tools: ["read","search"]
disable-model-invocation: true
user-invocable: false
---

# SOLID, YAGNI, and KISS Roaster

Resolve the installed `roast-this-code` skill root in this order:

1. `<repository-root>/.github/skills/roast-this-code`
2. `~/.agents/skills/roast-this-code`

Use the first root whose `SKILL.md` declares `name: roast-this-code` and that
contains both:

- `references/bundled-roasters/solid-yagni-kiss-roaster/persona.md`
- `references/bundled-roasters/solid-yagni-kiss-roaster/directive.md`

Require both files to be regular files beneath the same resolved root. Do not
follow symlinks, accept path escapes, or mix files from different roots. If no
complete root exists, return `Insufficient evidence`.

Follow the Roast This Code evidence packet and reviewer report contract. Remain
read-only. The directive controls analysis; ALT controls only the roast line.
