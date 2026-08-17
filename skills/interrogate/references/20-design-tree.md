## Design Tree

Model the subject as a design tree whose nodes represent material decisions, facts, assumptions, unknowns, risks, boundaries, and success criteria.

A node may have:

- a stable ID;
- a concise title;
- a type;
- prerequisites;
- dependent branches;
- an owner: agent, user, or delegated;
- a status;
- evidence or a recorded limitation;
- the consequence of leaving it unresolved.

Assign each node an ID when it first becomes material. Never reuse or renumber an ID merely because the tree changes. Suggested prefixes are:

- `D-###` - decision;
- `F-###` - researched fact;
- `A-###` - assumption or unknown;
- `R-###` - risk;
- `S-###` - success criterion or boundary.

Use statuses such as:

- `unsettled`;
- `ready`;
- `researching`;
- `settled`;
- `delegated`;
- `deferred`;
- `blocked`;
- `accepted-unknown`;
- `superseded`;
- `reopened`.

Add, split, merge, block, supersede, or reopen nodes as understanding changes. Preserve lineage when doing so.

A node is material when different resolutions could meaningfully alter scope, architecture, cost, schedule, risk, commitments, success criteria, or downstream choices. Do not create nodes for trivia or questions asked solely to appear thorough.

Keep detailed reasoning internal. Never expose private chain-of-thought. Share concise conclusions, evidence, dependencies, status changes, and decision-register summaries.
