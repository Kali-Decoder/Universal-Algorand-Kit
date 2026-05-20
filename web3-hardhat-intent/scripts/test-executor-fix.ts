import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("🧪 Testing TodoList Intent via Executor\n");

  const [signer] = await ethers.getSigners();
  const gatewayAddress = process.env.ARC_GATEWAY_ADDRESS!;
  const todoAddress = process.env.TODO_ADDRESS!;

  const gateway = await ethers.getContractAt("ArcGateway", gatewayAddress);

  console.log("📝 Sending addTodo intent...");
  console.log(`   User: ${signer.address}`);
  console.log(`   Target: ${todoAddress}`);
  console.log(`   Gateway: ${gatewayAddress}\n`);

  // Encode addTodo("Test from fixed relayer") manually
  // Function selector for addTodo(string): 0x6a1db1bf
  const functionSelector = "0x6a1db1bf";
  const text = "Test from fixed relayer";
  
  // ABI encode the string parameter
  const abiCoder = ethers.AbiCoder.defaultAbiCoder();
  const encodedParams = abiCoder.encode(["string"], [text]);
  const calldata = functionSelector + encodedParams.slice(2);

  const tx = await gateway.forwardIntentWithData(todoAddress, calldata);
  const receipt = await tx.wait();

  console.log("✅ Intent sent!");
  console.log(`   Tx: ${receipt?.hash}`);
  console.log(`   Block: ${receipt?.blockNumber}\n`);

  console.log("⏳ Waiting 10 seconds for relayer to process...");
  await new Promise((r) => setTimeout(r, 10000));

  console.log("\n✅ Test complete!");
  console.log("   Check relayer logs for execution status");
  console.log("   If successful, TodoList box should be created on Algorand");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
