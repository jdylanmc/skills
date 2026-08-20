# Domain Model - Test Coverage Doctrine

## Confirmed Domain Model

No confirmed entries. No cycle has run, so no `/domain-mapping` handoff has been
made. This section mirrors only explicitly confirmed results, each citing the
canonical artifact named by `docs/agents/domain.md`: the root `CONTEXT.md`, or an
approved Architecture Decision Record under `docs/adr/`.

## Candidate and Unconfirmed

### Candidate terms

- **Seam** - the boundary at which the anchor requires full coverage. Undefined.
  At least four readings are plausible and they classify code differently: a
  public interface; a dependency boundary; a module port; or Michael Feathers'
  original sense of a place where behavior can be altered without editing in
  that place.
- **Internal** - the complement of a seam, which the anchor calls "the internal
  bits" and exempts from the coverage target.
- **Coverage** - the proportion of code executed by a test run.

### Proposed boundaries

None. The seam-versus-internal boundary is the substance of the topic and is
entirely undefined at recording time.

### Open domain questions

- Is a seam a property of the code, of the design, or of the test? The same
  function can be a seam for one consumer and an internal for another.
- Does "100 percent at the seams" mean line coverage, branch coverage, or
  behavioral coverage of the contract? These give different verdicts on the same
  code, and the existing doctrine already distinguishes execution from assertion
  quality.
- Does the doctrine's guidance presuppose that SOLID principles were followed,
  and if so what does it say about code where they were not?

### Conflicts awaiting `/domain-mapping`

- None recorded yet as a lexicon conflict. The tension with
  `doctrine/testing.doctrine.md` is recorded as fog on n-0003 rather than as a
  vocabulary conflict, because no term has yet been shown to carry two
  incompatible definitions.
