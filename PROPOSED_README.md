![TabGroupSaver Banner](https://raw.githubusercontent.com/chirag127/TabGroupSaver-Session-Manager-VSCode-Extension/main/assets/banner.png)

[![Build Status](https://github.com/chirag127/TabGroupSaver-Session-Manager-VSCode-Extension/actions/workflows/ci.yml/badge.svg?branch=main&style=flat-square)](https://github.com/chirag127/TabGroupSaver-Session-Manager-VSCode-Extension/actions)
[![Coverage Status](https://codecov.io/gh/chirag127/TabGroupSaver-Session-Manager-VSCode-Extension/branch/main/graph/badge.svg?style=flat-square)](https://codecov.io/gh/chirag127/TabGroupSaver-Session-Manager-VSCode-Extension)
[![Tech Stack](https://img.shields.io/badge/Tech-Typescript%20%7C%20VSCode%20Extension-blue?style=flat-square)]()
[![Lint](https://img.shields.io/badge/Lint-Biome-success?style=flat-square)]()
[![License](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey?style=flat-square)](LICENSE)
[![Stars](https://img.shields.io/github/stars/chirag127/TabGroupSaver-Session-Manager-VSCode-Extension?style=flat-square)](https://github.com/chirag127/TabGroupSaver-Session-Manager-VSCode-Extension/stargazers)

⭐ **Star this repo** to stay updated on future releases!

## 📌 Quick Pitch
TabGroupSaver empowers VS Code users to capture, restore, and organize groups of open tabs as named sessions, boosting workflow continuity across projects. Featuring auto‑save, default groups, and multi‑scope storage, it turns tab chaos into structured productivity.

## 🏗️ Architecture Overview
text
TabGroupSaver/
├─ src/
│  ├─ commands/          # VS Code command implementations
│  ├─ services/          # Session storage & retrieval logic
│  ├─ utils/             # Helper utilities (debounce, serialization)
│  └─ activation.ts      # Extension entry point
├─ tests/
│  ├─ unit/              # Vitest unit tests
│  └─ integration/       # VS Code integration tests (Playwright)
├─ .github/
│  └─ workflows/ci.yml   # CI pipeline
└─ package.json


## 📖 Table of Contents
- [Quick Pitch](#-quick-pitch)
- [Architecture Overview](#-architecture-overview)
- [AI Agent Directives](#-ai-agent-directives)
- [Development Standards](#-development-standards)
- [Setup & Scripts](#-setup--scripts)
- [Contribution Guidelines](#-contribution-guidelines)

## 🤖 AI Agent Directives
<details open>
<summary>Technical Blueprint & Automation Commands</summary>

**Tech Stack Definition**
- **Language:** TypeScript (strict mode)
- **Runtime:** Node.js ≥18
- **Extension API:** VS Code Extension Host
- **Package Manager:** npm (via `package.json`)
- **Lint/Format:** Biome (`biome.json`)
- **Testing:** Vitest (unit) + Playwright (integration)
- **CI/CD:** GitHub Actions (Ubuntu latest)

**Architectural Patterns**
- **SOLID**: Each service (e.g., `SessionService`) adheres to Single Responsibility.
- **DRY**: Shared utilities live under `utils/`.
- **Hexagonal** (Ports & Adapters) for storage backends (local file, workspace state).

**Verification Commands**
bash
# Install dependencies
npm ci

# Lint & format check
npm run lint

# Run full test suite with coverage
npm test -- --coverage

# Verify build (VSIX package)
pm run package

These commands are invoked automatically by the CI workflow to ensure Zero‑Defect delivery.

</details>

## 🛠️ Development Standards
| Script                | Description                                          |
|-----------------------|------------------------------------------------------|
| `npm ci`              | Clean install of exact dependencies                  |
| `npm run lint`        | Run Biome linter and auto‑fix                        |
| `npm test`            | Execute Vitest unit tests                            |
| `npm run test:e2e`    | Run Playwright integration tests                     |
| `npm run build`       | Compile TypeScript to JavaScript (`tsc`)            |
| `npm run package`     | Package the extension into a `.vsix` file            |

**Core Principles**
- **SOLID** – decouple features for extensibility.
- **DRY** – utilities prevent duplication.
- **YAGNI** – only implement needed session features.
- **Continuous Validation** – CI runs on every PR.

## 🤝 Contribution Guidelines
Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for code standards, pull‑request workflow, and how to report bugs.

--- 

© 2025 chirag127 – Licensed under **CC BY‑NC 4.0**.
