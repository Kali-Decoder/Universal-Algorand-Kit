# Algorand Contracts

This folder contains the Algorand application sources that the SDK uses for settlement.

## Contents

- `smart_contracts/counter/contract.py` - counter app
- `smart_contracts/todo/contract.py` - todo app
- `smart_contracts/executor/contract.py` - executor app for relayed app calls

## Build

Run from this folder:

```bash
algokit project run build
```

## Deploy

Run from this folder:

```bash
algokit project deploy testnet
```