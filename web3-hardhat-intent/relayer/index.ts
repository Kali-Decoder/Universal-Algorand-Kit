import { ethers } from "ethers";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

// -------------------- CONFIG --------------------
const SOURCE_RPC =
  process.env.SOMNIA_TESTNET_RPC_URL ||
  "https://dream-rpc.somnia.network/";

const ARC_RPC =
  process.env.ARC_TESTNET_RPC_URL ||
  "https://rpc.testnet.arc.network";

const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const ARC_GATEWAY_ADDRESS = process.env.ARC_GATEWAY_ADDRESS!;
const ARC_EXECUTOR_ADDRESS = process.env.ARC_EXECUTOR_ADDRESS!;

const COUNTER_ADDRESS = (process.env.COUNTER_ADDRESS || "").toLowerCase();
const TODO_ADDRESS = (process.env.TODO_ADDRESS || "").toLowerCase();

const POLL_INTERVAL = Number(process.env.RELAYER_POLL_INTERVAL || 5000);
const CONFIRMATIONS = 3;
const MAX_RETRIES = 3;

// -------------------- STORAGE --------------------
const INTENT_HISTORY_FILE = path.resolve(
  __dirname,
  "../../public/intent-history.json"
);

// -------------------- SECURITY --------------------
const ALLOWED_TARGETS = new Set([
  COUNTER_ADDRESS,
  TODO_ADDRESS,
]);

const userRateLimit = new Map<string, number>();
const userNonces = new Map<string, number>();

// -------------------- ABIs --------------------
const ARC_GATEWAY_ABI = [
  "event IntentForwarded(address indexed user, address indexed target, uint256 nonce, uint256 timestamp)",
  "event IntentForwardedWithData(address indexed user, address indexed target, bytes data, uint256 nonce, uint256 timestamp)",
];

const ARC_EXECUTOR_ABI = [
  "function execute(address user, address target) external",
  "function executeWithData(address user, address target, bytes calldata data) external",
  "function authorizedRelayers(address) external view returns (bool)",
];

// -------------------- UTIL --------------------
async function executeWithRetry(fn: () => Promise<any>, retries = MAX_RETRIES) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
    }
  }
}

function checkRateLimit(user: string) {
  const count = userRateLimit.get(user) || 0;
  if (count > 10) throw new Error("Rate limit exceeded");
  userRateLimit.set(user, count + 1);
}

function validateNonce(user: string, nonce: number) {
  if (!userNonces.has(user)) {
    // First time seeing this user in this relayer process; assume the event
    // nonce is the next expected and seed state accordingly.
    userNonces.set(user, nonce - 1);
  }
  const last = userNonces.get(user) || 0;
  if (nonce !== last + 1) {
    throw new Error("Invalid nonce order");
  }
  userNonces.set(user, nonce);
}

function validateTarget(target: string) {
  if (!ALLOWED_TARGETS.has(target.toLowerCase())) {
    throw new Error("Unauthorized target");
  }
}

function validateCalldata(data?: string) {
  if (data && data.length < 10) {
    throw new Error("Invalid calldata");
  }
}

// -------------------- RELAYER --------------------
class ArcRelayer {
  sourceProvider: ethers.JsonRpcProvider;
  arcProvider: ethers.JsonRpcProvider;
  wallet: ethers.Wallet;
  gateway: ethers.Contract;
  executor: ethers.Contract;

  lastProcessedBlock = 0;
  processedIntents = new Set<string>();

  constructor() {
    const dir = path.dirname(INTENT_HISTORY_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(INTENT_HISTORY_FILE)) {
      fs.writeFileSync(INTENT_HISTORY_FILE, JSON.stringify([], null, 2));
    }

    this.sourceProvider = new ethers.JsonRpcProvider(SOURCE_RPC);
    this.arcProvider = new ethers.JsonRpcProvider(ARC_RPC);
    this.wallet = new ethers.Wallet(PRIVATE_KEY, this.arcProvider);

    this.gateway = new ethers.Contract(
      ARC_GATEWAY_ADDRESS,
      ARC_GATEWAY_ABI,
      this.sourceProvider
    );

    this.executor = new ethers.Contract(
      ARC_EXECUTOR_ADDRESS,
      ARC_EXECUTOR_ABI,
      this.wallet
    );
  }

  async start() {
    console.log("🤖 Secure Relayer Started");
    console.log(`🔌 Source RPC: ${SOURCE_RPC || "not set"}`);
    console.log(`🔌 ARC RPC: ${ARC_RPC || "not set"}`);
    await this.verifyAuthorization();

    this.lastProcessedBlock = await this.sourceProvider.getBlockNumber();
    console.log(
      `👂 Listening to source chain from block ${this.lastProcessedBlock + 1}`
    );

    while (true) {
      await this.poll();
      await this.sleep(POLL_INTERVAL);
    }
  }

  async verifyAuthorization() {
    const sourceNet = await this.sourceProvider.getNetwork();
    const arcNet = await this.arcProvider.getNetwork();
    console.log(`🌐 Source chainId: ${sourceNet.chainId.toString()}`);
    console.log(`🌐 Arc chainId: ${arcNet.chainId.toString()}`);

    const gatewayCode = await this.sourceProvider.getCode(ARC_GATEWAY_ADDRESS);
    const executorCode = await this.arcProvider.getCode(ARC_EXECUTOR_ADDRESS);
    if (gatewayCode === "0x") {
      console.log("⚠️  ARC_GATEWAY_ADDRESS has no contract code on source chain");
    }
    if (executorCode === "0x") {
      console.log("⚠️  ARC_EXECUTOR_ADDRESS has no contract code on Arc chain");
    }

    const ok = await this.executor.authorizedRelayers(this.wallet.address);
    if (!ok) throw new Error("Relayer not authorized");
    console.log("✅ Authorized");
  }

  async poll() {
    const currentBlock = await this.sourceProvider.getBlockNumber();
    const safeBlock = currentBlock - CONFIRMATIONS;

    if (safeBlock <= this.lastProcessedBlock) return;

    const events = await this.gateway.queryFilter(
      "*",
      this.lastProcessedBlock + 1,
      safeBlock
    );

    for (const e of events) {
      await this.handleIntent(e);
    }

    this.lastProcessedBlock = safeBlock;
  }

  async handleIntent(event: any) {
    const { user, target, nonce } = event.args;
    const intentId = `${user}-${nonce}`;
    const startTime = Date.now();

    if (this.processedIntents.has(intentId)) return;

    try {
      // ---------------- SECURITY CHECKS ----------------
      checkRateLimit(user);
      validateNonce(user, Number(nonce));
      validateTarget(target);

      const withData = !!event.args.data;
      const data = event.args.data;

      validateCalldata(data);

      console.log(
        `📨 Intent: ${intentId} target=${target} nonce=${nonce} data=${data ? data.length : 0} bytes`
      );
      console.log(`⏱️  Received intent at: ${new Date(startTime).toISOString()}`);

      let tx;

      if (withData) {
        // Preflight static call to surface revert reasons before sending
        try {
          await this.executor.executeWithData.staticCall(user, target, data);
        } catch (err: any) {
          console.error("❌ Preflight revert:", err?.shortMessage || err?.message || err);
        }
        tx = await executeWithRetry(() =>
          this.executor.executeWithData(user, target, data, {
            gasLimit: 300000,
          })
        );
      } else {
        try {
          await this.executor.execute.staticCall(user, target);
        } catch (err: any) {
          console.error("❌ Preflight revert:", err?.shortMessage || err?.message || err);
        }
        tx = await executeWithRetry(() =>
          this.executor.execute(user, target, {
            gasLimit: 200000,
          })
        );
      }

      const receipt = await Promise.race([
        tx.wait(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 60000)
        ),
      ]);
      const endTime = Date.now();
      const elapsedMs = endTime - startTime;
      console.log(`⏱️  Executed on destination in ${elapsedMs} ms`);

      console.log(
        receipt.status === 1 ? "✅ Success" : "❌ Failed",
        tx.hash
      );

      this.processedIntents.add(intentId);
    } catch (err: any) {
      console.error("❌ Error:", err.message);
    }
  }

  sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }
}

// -------------------- RUN --------------------
(async () => {
  try {
    const relayer = new ArcRelayer();
    await relayer.start();
  } catch (err) {
    console.error("Relayer crashed:", err);
    process.exit(1);
  }
})();
