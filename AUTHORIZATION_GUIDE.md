# TodoList Integration - Authorization Guide

## Overview
To enable TodoList operations on Algorand, the relayer must be authorized in the Executor app. This is a one-time setup that requires funding the deployer account.

---

## Prerequisites Checklist

- [ ] Deployer account: `62NPUZXFM7A4LQONLOBLH5RSYOT6YQJXWJBM3O6ABIZROBO2DHVVRUHKAE`
- [ ] Relayer account: `MBZRAQJZPHSNISYKVZVJZLOIXI3PPX2CRHGLKZMBSBVSV2FU6FRULGIIJA` (already funded ~1.99 ALGO)
- [ ] Executor app: `762834559` (already deployed)
- [ ] Counter app: `762834496` (working ✓)

---

## Step-by-Step Authorization

### 1. Fund the Deployer Account (5 minutes)

The deployer needs ~2 ALGO to pay for the authorization transaction and box storage.

**Option A: Using AlgoFaucet (Recommended)**

1. Open: https://testnet.algoexplorer.io/dispenser
2. Enter address: `62NPUZXFM7A4LQONLOBLH5RSYOT6YQJXWJBM3O6ABIZROBO2DHVVRUHKAE`
3. Click "Claim"
4. Wait 30 seconds for funding
5. Verify: Open https://testnet.algoexplorer.io/address/62NPUZXFM7A4LQONLOBLH5RSYOT6YQJXWJBM3O6ABIZROBO2DHVVRUHKAE
6. Confirm balance > 2 ALGO

**Option B: Using Command Line**

```bash
# Check current balance
curl -s https://testnet-api.algonode.cloud/v2/accounts/62NPUZXFM7A4LQONLOBLH5RSYOT6YQJXWJBM3O6ABIZROBO2DHVVRUHKAE | jq '.amount'
```

---

### 2. Run Authorization Script (2 minutes)

Once deployer has funds:

```bash
cd /Users/maroti/Algorand\ Dev/Universal\ Algorand\ Kit/web3-hardhat-intent

# Run the authorization script
npx ts-node scripts/authorize-relayer-final.ts
```

**Expected Output:**
```
🔐 Authorizing relayer in Executor app...
📱 Deployer: 62NPUZXFM7A4LQONLOBLH5RSYOT6YQJXWJBM3O6ABIZROBO2DHVVRUHKAE
🔑 Relayer: MBZRAQJZPHSNISYKVZVJZLOIXI3PPX2CRHGLKZMBSBVSV2FU6FRULGIIJA
⏳ Submitting transaction...
✅ Authorization successful!
📋 Transaction ID: <XXXXXXXXXXXXXXXX>
```

---

### 3. Verify Authorization (1 minute)

Check that relayer is now authorized:

```bash
# Query Executor app state
curl -s https://testnet-api.algonode.cloud/v2/applications/762834559 | jq '.params.global-state'

# Or check the authorization box
curl -s https://testnet-api.algonode.cloud/v2/applications/762834559/boxes | jq '.boxes[] | select(.name | contains("relayer"))'
```

**Expected:** Box with key `relayer_` + relayer public key should exist with value `0x01` (authorized = true)

---

## 4. Test TodoList Functionality (3 minutes)

### Terminal 1: Start Relayer

```bash
cd /Users/maroti/Algorand\ Dev/Universal\ Algorand\ Kit/web3-hardhat-intent
pnpm run relayer
```

**Expected Output (startup):**
```
🤖 Secure Relayer Started
🔌 Source RPC: https://dream-rpc.somnia.network/
🔌 Algod URL: https://testnet-api.algonode.cloud
✅ Algorand relayer address: MBZRAQJZPHSNISYKVZVJZLOIXI3PPX2CRHGLKZMBSBVSV2FU6FRULGIIJA
✅ Executor app exists (762834559)
💡 Relayer address: MBZRAQJZPHSNISYKVZVJZLOIXI3PPX2CRHGLKZMBSBVSV2FU6FRULGIIJA
👂 Listening to source chain from block XXXXXXXX
```

### Terminal 2: Send TodoList Intent

```bash
cd /Users/maroti/Algorand\ Dev/Universal\ Algorand\ Kit/web3-hardhat-intent
npx ts-node scripts/test-flow.ts
```

**At menu, select:**
- `6` - Forward addTodo intent to Arc
- Enter text: "Buy groceries"

**Expected Output:**
```
⏳ Forwarding addTodo intent...
📤 Transaction sent: 0x...
⏳ Waiting for confirmation...
✅ Intent forwarded!
   Block: XXXXXXX

💡 The relayer should pick this up and execute on Arc
   Check relayer logs for execution status
```

### Check Relayer Log (Terminal 1)

**Expected:**
```
📨 Intent: 0xDEFADE...ABC123-1 target=0x0c885d... nonce=1 data=XXX bytes
⏱️  Received intent at: 2026-05-19T...
🔀 Routing TodoList intent through Executor (app 762834559)
⏱️  Executed on destination in XXXX ms
✅ Success YYYYYYYYYYYYYYYYYYYYYY
```

---

## Troubleshooting

### "logic eval error: assert failed pc=138"
**Cause:** Relayer not authorized in Executor
**Solution:** Run authorization script (Step 2)

### "invalid Box reference"
**Cause:** Box storage not properly configured
**Solution:** Ensure deployer has sufficient balance (~2 ALGO)

### "Insufficient funds"
**Cause:** Deployer account balance < transaction fee + box MBR
**Solution:** Request more ALGO from faucet

### "Cannot find application"
**Cause:** App ID wrong or app doesn't exist
**Solution:** Verify app IDs in `.env`:
```bash
grep "APP_ID" .env
```

---

## Verification Checklist ✓

After authorization:

- [ ] Deployer has ~1 ALGO remaining (after auth fee)
- [ ] Relayer startup logs show "Executor app exists"
- [ ] TodoList intent forwarded successfully
- [ ] Relayer logs show "Routing TodoList intent through Executor"
- [ ] Algorand transaction confirmed on testnet
- [ ] Counter operations still work (regression test)

---

## Rollback (if needed)

To disable relayer:

```bash
npx ts-node << 'EOF'
import algosdk from "algosdk";
import * as dotenv from "dotenv";
dotenv.config();

const algod = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "");
const deployer = algosdk.mnemonicToSecretKey(process.env.DEPLOYER_MNEMONIC!);
const relayerAddr = algosdk.mnemonicToSecretKey(process.env.ALGORAND_RELAYER_MNEMONIC!).addr;

// Call set_relayer_authorization with authorized=false
// ... transaction code ...

console.log("✅ Relayer disabled");
EOF
```

---

## Support

For issues:
1. Check relayer logs: `tail -f relayer.log`
2. Verify balances: Use AlgoExplorer
3. Test Counter: Ensure Counter still works
4. Check app state: Query Executor and TodoList apps

---

**Estimated Time to Complete:** 10-15 minutes (including faucet wait time)

**Once Complete:** TodoList, Counter, and Executor fully integrated and operational! 🚀
