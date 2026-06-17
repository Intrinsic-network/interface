# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A fork of the **Uniswap V3 web interface** rebranded as the **Intrinsic Interface**, targeting the **Intrinsic Network** on RSK / Rootstock chains. Most of the codebase is upstream Uniswap; the fork's substance is in chain config, contract addresses, and swapping `@uniswap/*` core/SDK packages for `@intrinsic-network/*` equivalents. When in doubt about a generic component or hook, assume it behaves like upstream Uniswap.

Supported chains (`src/constants/chains.ts`): `RSK_MAINNET = 30`, `RSK_TESTNET = 31`. Native currency is RBTC/WRBTC; the governance/protocol token is INT.

## Commands

Use **yarn** (npm is blocked via `engines`). Note version drift: `.nvmrc` pins Node `18.16.0` while `package.json engines` says `20.x` — prefer 18.16.0 locally unless something requires 20.

- `yarn install` — install deps (runs `patch-package` postinstall; see `patches/`).
- `yarn prepare` — **codegen; required before build/test/start on a fresh checkout.** Runs `contracts:compile` (typechain ABIs → `src/abis/types` and `src/types/v3`), `graphql:fetch` (downloads schemas), `graphql:generate` (Relay artifacts), and `i18n`. CI runs this before `yarn test` and `yarn build`.
- `yarn start` — dev server (craco) at http://localhost:3000.
- `yarn build` / `yarn serve` — production build / serve it locally.
- `yarn lint` — ESLint over the repo.
- `yarn test` — Jest unit tests via craco (coverage on). Append `--watchAll` to run all tests; pass a path/pattern to run one file, e.g. `yarn test src/hooks/useBestTrade.test.ts`.
- `yarn cypress:open` / `yarn cypress:run` — E2E tests. Require a server: run `yarn start` (or `yarn serve`) in another tab first. Cypress forks mainnet via `cypress-hardhat` (`hardhat.config.js`).

Regenerate code after changing the relevant source:
- Contract ABIs (`src/abis/*.json`) → `yarn contracts:compile`
- GraphQL queries → `yarn graphql:generate` (Relay). Schema changed upstream → `yarn graphql:fetch` first.
- Lingui translation strings → `yarn i18n`

## Architecture

**Stack:** Create React App + **craco** (config override) + TypeScript, React 18. SPA using **`HashRouter`** (routes are hash-based, e.g. `/#/swap`).

**Entry / providers** (`src/index.tsx`): deeply nested provider tree — Redux `store` → FeatureFlags → react-query → HashRouter → Language (Lingui) → Web3 → Relay → BlockNumber → Theme → `App`. A sibling `<Updaters />` group mounts background sync components (lists, transactions, multicall, logs, application, user) that watch chain/store state and dispatch — **side-effecting state sync lives in `*/updater.tsx` files, not in components.**

**State — Redux Toolkit** (`src/state/index.ts`): slices include `application`, `user`, `connection`, `transactions`, `wallets`, `swap`, `mint`/`mintV3`, `burn`/`burnV3`, `multicall`, `lists`, `logs`, and `routingApi` (RTK Query). Only `user`, `transactions`, `lists` are persisted to localStorage. V3 features generally live in `v3/` subfolders alongside their V2 counterparts.

**Web3 / wallets** (`src/connection/index.ts`): web3-react v8. Connector types: `INJECTED` (MetaMask), `COINBASE_WALLET`, `WALLET_CONNECT`, `NETWORK`, `GNOSIS_SAFE`. Access contracts through the `useContract` family in `src/hooks/useContract.ts`, which resolve addresses from chain-keyed `AddressMap`s in `src/constants/addresses.ts`.

**GraphQL — three clients coexist:**
- `src/graphql/data` (Relay) — Uniswap data API (tokens, NFTs, prices).
- `src/graphql/thegraph` (Relay) — The Graph subgraph for V3 pool/tick data.
- Apollo Client — used elsewhere for data fetching.
Each Relay setup has its own `RelayEnvironment.ts`, `fetchGraphQL.ts`, `schema.graphql`, and config (`relay.config.js`, `relay_thegraph.config.js`).

**Styling — two systems, both live:** legacy/main UI uses **styled-components** with the theme in `src/theme`; newer code (much of `src/nft` and some components) uses **vanilla-extract** (`*.css.ts`, compiled via babel/webpack plugins in `craco.config.cjs`). Match whichever the surrounding file uses.

**i18n:** Lingui macros (`t`, `Trans`). Strings are extracted to `src/locales`; never edit compiled catalogs by hand — run `yarn i18n`.

**Pages** (`src/pages`): Swap, Pool, AddLiquidity (+`AddLiquidityV2`), RemoveLiquidity, PoolFinder, Tokens, TokenDetails, Vote, CreateProposal, Earn (staking), MigrateV2.

## Fork-specific gotchas

- **Adding/changing networks or contracts** touches a coordinated set: `src/constants/chains.ts` (the `SupportedChainId` enum + the L1/L2/testnet ID arrays), `src/constants/addresses.ts` (per-chain contract addresses), `src/constants/networks.ts` (RPC URLs), `src/constants/chainInfo.ts`, and `src/constants/tokens.ts`. Keep them consistent.
- **`@intrinsic-network/*` vs `@uniswap/*`:** V3 core/periphery, `sdk-core`, `smart-order-router`, `router-sdk`, `redux-multicall`, and governance come from `@intrinsic-network`; V2 SDKs, universal-router, widgets, analytics, etc. are still `@uniswap`. `useContract.ts` imports V3 contract artifacts from `@intrinsic-network/periphery`. RBTC/WRBTC native-currency types come from `@intrinsic-network/sdk-core`.
- Despite the rebrand, much UI text, asset names, and identifiers still say "Uniswap" — expected, not a bug to fix unless asked.

## Conventions

- **Absolute imports from `src`** (`tsconfig.json baseUrl: "src"`): `import { SupportedChainId } from 'constants/chains'`, not deep relative paths.
- **ESLint** extends `@uniswap/eslint-config/react` plus a local rule dir (`eslint_rules/`). Some imports are restricted — e.g. import from the local `analytics` wrapper, not `@uniswap/analytics` directly; check `.eslintrc.js` before adding cross-package imports.
- TypeScript is `strict` but `noImplicitAny: false` — untyped values won't always error.
- Type checking and linting are **disabled in production builds** (done only in dev/CI) — don't rely on `yarn build` to catch type errors; use `yarn lint` / your editor.
- `patches/` modifies installed packages (mostly web3-react connectors, `@vercel/og`) via patch-package; edit the patch, don't hand-edit `node_modules`.

## Cloudflare Functions (`functions/`)

Edge functions that inject Open Graph meta tags server-side and generate dynamic OG images for token/NFT/collection pages. Separate `tsconfig.json`, `babel.config.js`, and `jest.config.json`; tested against a local `wrangler` proxy. Note: `functions/README.md` documents `yarn start:cloud` / `yarn test:cloud`, but those scripts are not currently defined in `package.json` — run the underlying `wrangler` / `jest --config=functions/jest.config.json` commands directly (see that README) or re-add the scripts.
