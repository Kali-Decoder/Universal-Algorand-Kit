# ✅ TodoList Integration - Complete Test Guide

## Current Status: 🎉 READY FOR TESTING

✅ Counter app (762834496) - Deployed & Tested  
✅ TodoList app (762834537) - Deployed & Ready  
✅ Executor app (762834559) - Deployed & Authorized  
✅ Relayer - Funded & Running  

---

## Quick Test (5 minutes)

### Step 1: Start the Relayer

**Terminal 1:**
```bash
cd /Users/maroti/Algorand\ Dev/Universal\ Algorand\ Kit/web3-hardhat-intent
pnpm run relayer
```

**Expected Output:**
```
🤖 Secure Relayer Started
🔌 Source RPC: https://dream-rpc.somnia.network/
🔌 Algod URL: https://testnet-api.algonode.cloud
✅ Algorand relayer address: MBZRAQJZPHSNISYKVZVJZLOIXI3PPX2CRHGLKZMBSBVSV2FU6FRULGIIJA
✅ Executor app exists (762834559) ✨
💡 Relayer address: MBZRAQJZPHSNISYKVZVJZLOIXI3PPX2CRHGLKZMBSBVSV2FU6FRULGIIJA
👂 Listening to source chain from block XXXXXXXX
```

### Step 2: Send Test Intent

**Terminal 2:**
```bash
cd /Users/maroti/Algorand\ Dev/Universal\ Algorand\ Kit/web3-hardhat-intent
npx ts-node scripts/test-flow.ts
```

**Menu Options:**
```
1. Get Counter Value
2. Forward counter intent (increment)
3. Forward counter intent (decrement)
4. Check TodoList
5. Forward toggle todo intent
6. Forward addTodo intent
7. Forward deleteTodo intent
...
```

### Step 3: Test Counter (Quick Verification)

At the menu, select: **2** (Forward counter increment intent)

**Expected Output in Terminal 2:**
```
⏳ Forwarding counter intent...
📤 Transaction sent: 0x...
⏳ Waiting for confirmation...
✅ Intent forwarded!
   Block: XXXXXXX
💡 The relayer should pick this up and execute on Arc
```

**Expected Output in Terminal 1 (Relayer):**
```
📨 Intent: 0x... target=0x20371... nonce=1 data=XXX bytes
⏱️  Received intent at: 2026-05-19T...
📱 Calling Counter app directly (app 762834496)
⏱️  Executed on destination in XXXX ms
✅ Success YYYYYYYYYYYYYYYYYYYYYY
```

### Step 4: Test TodoList (New Feature!)

At the menu, select: **6** (Forward addTodo intent)

**Prompt:** "Enter todo item text:"
```
Buy groceries from Somnia
```

**Expected Output in Terminal 2:**
```
⏳ Forwarding addTodo intent...
📤 Transaction sent: 0x...
⏳ Waiting for confirmation...
✅ Intent forwarded!
   Block: XXXXXXX
💡 The relayer should pick this up and execute on Arc
```

**Expected Output in Terminal 1 (Relayer):**
```
📨 Intent: 0x... target=0x0c88... nonce=2 data=XXX bytes
⏱️  Received intent at: 2026-05-19T...
🔀 Routing TodoList intent through Executor (app 762834559)
⏱️  Executed on destination in XXXX ms
✅ Success ZZZZZZZZZZZZZZZZZZZZZZZZ
```

---

## Verification Checklist

After running tests:

### ✓ Relayer Console
- [ ] Relayer started without errors
- [ ] Executor app (762834559) detected
- [ ] "Listening to source chain" appears
- [ ] "✅ Success" messages for Counter intent
- [ ] "🔀 Routing TodoList intent through Executor" for TodoList intent

### ✓ Somnia (Source Chain)
- [ ] Intent transaction hash shown
- [ ] Block confirmation received
- [ ] No revert errors

### ✓ Algorand (Settlement Layer)
- [ ] Counter or TodoList transaction ID in logs
- [ ] Transaction confirmed on testnet

### ✓ Check App State

**Counter Value:**
```bash
curl -s https://testnet-idx.algonode.cloud/v2/applications/762834496 | jq '.application.params."global-state"' | grep -A5 "counter"
```

Should show incremented counter value.

**TodoList State:**
```bash
curl -s https://testnet-idx.algonode.cloud/v2/applications/762834537/boxes | jq '.boxes'
```

Should show boxes for stored todos.

**Executor Box Storage:**
```bash
curl -s https://testnet-api.algonode.cloud/v2/applications/762834559/boxes | jq '.boxes'
```

Should show:
- `relayer_...` box (authorization) ✓
- Possibly `nonce_...` boxes (nonce tracking for each user)

---

## Test Results Summary

### What Should Be Working ✅

| Feature | Command | Expected Result |
|---------|---------|-----------------|
| Relayer Startup | `pnpm run relayer` | Connects to Somnia & Algorand |
| Counter Increment | Menu option 2 | Counter value increases |
| Counter Decrement | Menu option 3 | Counter value decreases |
| TodoList Add | Menu option 6 | New todo stored in BoxMap |
| TodoList Toggle | Menu option 5 | Todo status toggled |
| Executor Routing | Monitor logs | "🔀 Routing TodoList" appears |

---

## Troubleshooting

### Problem: Relayer shows "Listening" but no intents processed

**Cause:** No intents sent from Somnia yet  
**Solution:** Use `test-flow.ts` to send intents (see Step 2 above)

### Problem: "Routing TodoList intent" doesn't appear

**Cause:** TodoList not being properly identified  
**Solution:** Check relayer logs for error messages

### Problem: Transaction fails with "assert failed"

**Cause:** Relayer not authorized or nonce conflict  
**Solution:** 
```bash
# Verify relayer is authorized
curl -s https://testnet-api.algonode.cloud/v2/applications/762834559/boxes | jq '.boxes' | grep relayer
```

### Problem: Executor app account out of funds

**Cause:** App ran out of Minimum Balance for boxes  
**Solution:** Send more ALGO to app account: `Y6IZCOXXFWJ22NSTDUNIDPISXDKIPS5ETBOXU37R3D6WLLRJFA6CZOVFBE`

---

## Advanced Testing

### Test Different User (if needed)

Edit the `test-flow.ts` or create a new script that sends intents with different addresses to verify per-user nonce tracking works.

### Stress Test Rate Limiting

Send multiple intents in rapid succession - system should rate limit after 10 intents.

### Check Transaction History

View confirmed transactions on Algorand testnet explorer:
```
https://testnet.algoexplorer.io/app/762834559  (Executor)
https://testnet.algoexplorer.io/app/762834537  (TodoList)
https://testnet.algoexplorer.io/app/762834496  (Counter)
```

---

## Performance Expectations

- **Event Detection:** < 100ms
- **Relayer Processing:** 100-500ms
- **Algorand Settlement:** 3-5 seconds
- **Total E2E:** 4-6 seconds

---

## Success Criteria ✅

System is fully operational when:

1. ✅ Relayer starts without errors
2. ✅ Counter intents are processed and counter value changes
3. ✅ TodoList intents are routed through Executor
4. ✅ "🔀 Routing TodoList intent" appears in logs
5. ✅ All transactions confirmed on Algorand testnet
6. ✅ No "assertion failed" or "logic eval error" messages

---

**If all above work, your Algorand-Somnia cross-chain SDK is production-ready! 🚀**
