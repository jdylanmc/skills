# Domain Model - Atomic Skill Composition

## Confirmed Domain Model

Mirrors only explicitly confirmed `/domain-mapping` results, each citing the
canonical artifact that is the source of truth for it.

### Atom

The smallest unit of skill composition: one single operation as judged from the
caller's point of view, expressed as a single Markdown file whose frontmatter is
consistent across all atoms. An atom references no other unit of composition;
anything that references another unit is not an atom.

Discouraged aliases: `primitive`, `ingredient`.

- Confirmed: c-0001, handoff key `atomic-skill-composition/c-0001/f12548796134`
- Canonical artifact: root [CONTEXT.md](../../../../CONTEXT.md), section
  `## Language` -> `### Skill composition`
- Artifact digest at time of mirroring: sha256
  `d812205bfc2005abfae530f36fabf814ebf9cbc2a5c7c2acaeb4060fd5a91cca`

Two refinements were produced by scenario stress-testing during the handoff and
are part of the confirmed definition:

1. "Single operation" is judged from the caller's point of view. Internal steps
   such as authentication, retry, or checksum verification never split an atom.
2. "References no other unit" makes the atom boundary mechanically checkable by
   the existing dependency-graph validator, rather than a matter of taste.

### Molecule

A unit of skill composition that composes two or more atoms or molecules by
reference to produce one bounded outcome, expressed as a single Markdown file.
A molecule declares what it composes; what it may use and what consumes it are
derived from that declaration rather than authored.

- Confirmed: c-0002, handoff key
  `atomic-skill-composition/c-0002/molecule-8f2a11c4`
- Canonical artifact: root [CONTEXT.md](../../../../CONTEXT.md), section
  `## Language` -> `### Skill composition`
- Artifact digest at time of mirroring: sha256
  `398c6907df230a1cc869e37c199bacc3fb88d1b1011d1964604c6aab4ea41759`

The user amended the proposed definition during the confirmation gate to allow a
molecule to compose other molecules, not only atoms. Two consequences follow and
are recorded as requirements rather than vocabulary:

1. The composition graph can contain cycles, so the validator must detect them.
2. A molecule's derived tool set is a transitive union, not a one-level union.

### Skill

The only unit of skill composition that may be invoked directly, by a router or
by a person: the contract the agent understands. A skill composes molecules and
atoms rather than restating what a shared unit already defines.

Discouraged aliases: `organism`.

- Confirmed: c-0003, handoff key `atomic-skill-composition/c-0003/skill-3d71b0a9`
- Canonical artifact: root [CONTEXT.md](../../../../CONTEXT.md), section
  `## Language` -> `### Skill composition`
- Artifact digest at time of mirroring: sha256
  `e9b4fb986f490f59d6c414fd53e1a0bf48561ebe84cd988cb00e0ba483d2f760`

The user supplied the framing "a skill is the contract that the agent
understands" during the confirmation gate, and it is part of the written
definition. It explains why the skill is the invocable level: it is the only
level the agent's router is asked to understand.

All three composition levels are now confirmed vocabulary.

## Candidate and Unconfirmed

### Candidate terms

- **Molecule** - confirmed in c-0002. See the confirmed section above.
- **Skill** - confirmed in c-0003. See the confirmed section above.
- **Level namespace** - an underscore-prefixed directory under `skills/_base/`
  holding units of exactly one composition level, such as `_atoms/` or
  `_molecules/`. The prefix marks it as a namespace rather than a package.
- **Recipe** - the mental model for what a skill is: an invocable procedure that
  names what it needs and the steps it runs. Explicitly not a structural level.
- **Composition level** - the declared position of a unit in the
  atom-molecule-skill ordering. `Tier` is a discouraged alias because Discovery
  Loop already binds "tier" to the tracker hierarchy Branch, Story, and Task.
- **Base package** - **deprecated** as of c-0003, superseded by level
  namespaces. The c-0002 conflict was resolved by retiring the term rather than
  by choosing between its two readings: once Chronicler decomposes, no
  package-shaped directory remains under `skills/_base/`.

### Deprecated and rejected terms

- **Organism** - the original name for the third composition level, superseded
  by Skill in c-0001.
- **Ingredient** - proposed in c-0001 as a fourth level and rejected. In the
  cooking metaphor that supplies the word, an ingredient is the primitive, so
  placing it above molecule inverts the metaphor. Recorded so it is not
  reproposed without new argument.

### Proposed boundaries

- Atom: references no other unit. Confirmed and mechanically checkable.
- Molecule: composes two or more atoms or molecules. Confirmed in c-0002. The
  "two or more" clause makes a one-reference file a mere alias rather than a
  molecule, which is also checkable.
- Skill: the only directly invocable unit. Confirmed in c-0003. All three
  boundaries are now settled.

### Open domain questions

- How is a referenced unit's instruction text actually incorporated at runtime,
  given that `includes` is a dependency mirror rather than a loading directive?
- Which of the 165 existing reference files are genuinely duplicated, as opposed
  to merely similar?

### Conflicts awaiting `/domain-mapping`

- None. The `Base package` conflict raised in c-0002 was resolved in c-0003 by
  deprecating the term.
