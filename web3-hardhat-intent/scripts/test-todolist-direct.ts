import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.SOMNIA_TESTNET_RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    
    // ArcGateway contract
    const arcGatewayAddress = process.env.ARC_GATEWAY_ADDRESS;
    const arcGatewayAbi = [
        'function forward(address targetChain, bytes32 target, uint64 nonce, bytes calldata data) external payable returns (bytes32)'
    ];
    
    const gateway = new ethers.Contract(arcGatewayAddress, arcGatewayAbi, signer);
    
    // Encode todo data: method=addTodo
    // In real usage, this would be the encoded ARC4 arguments
    const todoData = ethers.utils.defaultAbiCoder.encode(
        ['uint8', 'string'],
        [6, 'Buy groceries from Somnia']
    );
    
    console.log('📤 Sending addTodo intent to ArcGateway...');
    console.log(`   Target: Algorand TodoList App (762834537)`);
    console.log(`   Text: "Buy groceries from Somnia"`);
    
    try {
        const tx = await gateway.forward(
            ethers.constants.AddressZero,  // Target chain (Algorand)
            ethers.constants.HashZero.replace('00', '01'),  // Target identifier
            0,  // Nonce
            todoData,
            { value: ethers.utils.parseEther('0') }
        );
        
        console.log(`✅ Intent forwarded!`);
        console.log(`📋 Transaction: ${tx.hash}`);
        
        // Wait for confirmation
        const receipt = await tx.wait(1);
        console.log(`✨ Confirmed in block ${receipt.blockNumber}`);
        console.log(`\n💡 Check relayer logs for Executor routing and settlement status`);
        
    } catch (error) {
        console.error('❌ Error forwarding intent:', error);
        process.exit(1);
    }
}

main().catch(console.error);
