require('dotenv').config();
const ethers = require('ethers');

(async () => {
  const provider = new ethers.JsonRpcProvider(process.env.SOMNIA_TESTNET_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  const gateway = new ethers.Contract(
    process.env.ARC_GATEWAY_ADDRESS,
    ["function forwardIntentWithData(address target, bytes data) external"],
    wallet
  );
  
  const todoAbi = ["function addTodo(string memory text) external"];
  const todoInterface = new ethers.Interface(todoAbi);
  const data = todoInterface.encodeFunctionData("addTodo", ["Test Todo " + Date.now()]);
  
  const tx = await gateway.forwardIntentWithData(process.env.TODO_ADDRESS, data);
  console.log("Intent TX:", tx.hash);
  await tx.wait();
  console.log("Confirmed on Somnia");
})();
