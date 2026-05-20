const { ethers } = require('ethers');
require('dotenv').config();

async function sendTodoIntent() {
    const provider = new ethers.JsonRpcProvider(process.env.SOMNIA_TESTNET_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const gateway = new ethers.Contract(
        process.env.ARC_GATEWAY_ADDRESS,
        ['function forwardIntentWithData(address target, bytes calldata data) external'],
        wallet
    );
    
    const todoInterface = new ethers.Interface(['function addTodo(string memory text) external returns (uint256)']);
    const data = todoInterface.encodeFunctionData('addTodo', ['Test from Somnia']);
    
    console.log('Sending intent...');
    const tx = await gateway.forwardIntentWithData(process.env.TODO_ADDRESS, data);
    console.log('TX:', tx.hash);
    const receipt = await tx.wait();
    console.log('Block:', receipt.blockNumber);
}

sendTodoIntent().catch(console.error);
