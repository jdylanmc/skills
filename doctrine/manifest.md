---
schema-version: 1
doctrine:
  - id: code
    path: code.doctrine.md
    sha256: d02547f28986ea34dbc374ac5330e4ea29f119afc02423c30e68e25cad4f23a9
  - id: domain
    path: domain.doctrine.md
    sha256: 089b7184f30f5c8ceffe3c3227c885e824556547e06b68539b27da5fbf433349
  - id: pragmatic
    path: pragmatic.doctrine.md
    sha256: bb7eb6e6cf16ac71bd896b2ae58f6a68ffc304cc3ca90a4daa8207fbea6443d1
  - id: data
    path: data.doctrine.md
    sha256: 411717d121bb9bfd466f0699ee0c1d0a666d8a97768188430e44c97eb5146438
---

# Doctrine Manifest

This manifest defines the canonical trusted doctrine set. Resolve doctrine
paths relative to this file, reject symlinks and path escapes, and verify each
SHA-256 digest before loading guidance.
