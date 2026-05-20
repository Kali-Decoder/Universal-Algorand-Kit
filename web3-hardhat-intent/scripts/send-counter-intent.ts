import { ethers } from "hardhat";
import { ArcGateway__factory } from "../typechain-types";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const ARC_GATEWAY_ADDRESS = process.env.ARC_GATEWAY_ADDRESS!;
  const COUNTER_ADDRESS = process.env.COUNTER_ADDRESS!;
  
  const [signer] = await ethers.getSigners();
  console.log("Using signer:", signer.address);

  const gateway = ArcGateway__factory.connect(ARC_GATEWAY_ADDRESS, signer);
  const counterInterface = new ethers.Interface(["function increment()"]);
  const callData = counterInterface.encodeFunctionData("increment");

  console.log("Sending counter increment intent...");
  const tx = await gateway.requestIntent(
    COUNTER_ADDRESS,
    callData,
    { value: 0 }
  );

  console.log("Transaction hash:", tx.hash);
  await tx.wait();
  console.log("Intent sent and confirmed!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
