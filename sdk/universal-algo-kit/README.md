# universal-algo-kit

Universal Algo Kit (UAK) is a TypeScript SDK + CLI for **cross-chain intents**:

- Source: **EVM** (Somnia / Ethereum-compatible)
- Destination: **Algorand** (settlement via Algorand app calls, with optional Executor routing)

This package is extracted from the working reference implementation in this repo (`web3-hardhat-intent/`) and is meant to be published as a standalone SDK.

## Install

```bash
npm i universal-algo-kit
```

## Quick start (SDK)

```ts
import { createUniversalAlgoKit } from "universal-algo-kit";

const uak = createUniversalAlgoKit({
  evm: {
    rpcUrl: process.env.SOMNIA_TESTNET_RPC_URL!,
    gatewayAddress: process.env.ARC_GATEWAY_ADDRESS!,
    privateKey: process.env.PRIVATE_KEY, // required to SEND intents
  },
  algorand: {
    algodUrl: process.env.ALGORAND_ALGOD_URL!,
    indexerUrl: process.env.ALGORAND_INDEXER_URL,
    relayerMnemonic: process.env.ALGORAND_RELAYER_MNEMONIC!, // required to SETTLE intents
  },
  targets: {
    counterAddress: process.env.COUNTER_ADDRESS,
    todoAddress: process.env.TODO_ADDRESS,
  },
  appIds: {
    counterAppId: Number(process.env.COUNTER_APP_ID),
    todoAppId: Number(process.env.TODO_APP_ID),
    executorAppId: Number(process.env.EXECUTOR_APP_ID),
  },
});

// 1) Send an intent on EVM
await uak.sender.sendCounterIncrement();

// 2) Run the relayer to settle on Algorand
await uak.relayer.start();
```

## Quick start (CLI)

```bash
# from your app repo
npx uak relayer
```

Send intents:

```bash
npx uak send-counter
npx uak send-todo-add --text "hello"
npx uak send-todo-toggle --id 1
npx uak send-todo-delete --id 1
```

## Environment variables

Minimum required for **sending intents**:

- `SOMNIA_TESTNET_RPC_URL` (or `EVM_RPC_URL`)
- `ARC_GATEWAY_ADDRESS`
- `PRIVATE_KEY` (sender)
- `COUNTER_ADDRESS` and/or `TODO_ADDRESS`

Minimum required for **relaying / settlement**:

- `ALGORAND_ALGOD_URL`
- `ALGORAND_INDEXER_URL` (recommended)
- `ALGORAND_RELAYER_MNEMONIC`
- `COUNTER_APP_ID` and/or `TODO_APP_ID`
- `EXECUTOR_APP_ID` (required if using `TODO_ADDRESS`)

Optional relayer tuning:

- `RELAYER_POLL_INTERVAL` (ms, default `5000`)
- `RELAYER_CONFIRMATIONS` (default `3`)
- `RELAYER_LOOKBACK_BLOCKS` (default `50`)
- `RELAYER_MAX_RETRIES` (default `3`)

## What it supports today

- Counter intents: `increment()` and `decrement()` (settled by calling the Counter Algorand app directly)
- Todo intents: `addTodo(string)`, `toggleTodo(uint256)`, `deleteTodo(uint256)` (settled via the Algorand Executor app)

## Deployment note

This SDK focuses on **intent sending** + **relaying**. Contract/app deployment is still handled by the reference projects in this repo:

- EVM contracts + gateway: `web3-hardhat-intent/`
- Algorand apps (Counter/Todo/Executor): `executor/`

## Publishing (npm)

From `sdk/universal-algo-kit/`:

```bash
npm publish --access public
```

Before publishing, update:

- `sdk/universal-algo-kit/package.json` (`version`, `repository.url`, `author`)

