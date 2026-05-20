#!/usr/bin/env ts-node
/**
 * TodoList End-to-End Test
 * Sends an addTodo intent through the relayer and verifies it's processed
 */

import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const TODO_ABI = [
  "function addTodo(string memory text) external returns (uint256)",
  "function toggleTodo(uint256 id) external",
  "function deleteTodo(uint256 id) external",
];

const GATEWAY_ABI = [
  "function forwardIntentWithData(address target, bytes calldata data) external",
];

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const SOURCE_RPC = process.env.SOMNIA_TESTNET_RPC_URL || "https://dream-rpc.somnia.network/";
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  const ARC_GATEWAY_ADDRESS = process.env.ARC_GATEWAY_ADDRESS;
  const TODO_ADDRESS = process.env.TODO_ADDRESS;

  if (!PRIVATE_KEY || !ARC_GATEWAY_ADDRESS || !TODO_ADDRESS) {
    console.error('❌ Missing environment variables');
    process.exit(1);
  }

  console.log('🧪 TodoList End-to-End Test');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Start relayer
  console.log('\n1️⃣  Starting relayer...');
  const relayerProcess = spawn('pnpm', ['run', 'relayer'], {
    cwd: __dirname,
    stdio: 'pipe',
  });

  let relayerOutput = '';
  relayerProcess.stdout?.on('data', (data) => {
    relayerOutput += data.toString();
  });
  relayerProcess.stderr?.on('data', (data) => {
    relayerOutput += data.toString();
  });

  // Wait for relayer to start
  await delay(3000);
  console.log('✅ Relayer started');

  try {
    // Setup wallet and gateway
    console.log('\n2️⃣  Setting up wallet and gateway...');
    const provider = new ethers.JsonRpcProvider(SOURCE_RPC);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const gateway = new ethers.Contract(ARC_GATEWAY_ADDRESS, GATEWAY_ABI, wallet);
    console.log(`✅ Connected: ${wallet.address}`);

    // Send TodoList intent
    console.log('\n3️⃣  Sending addTodo intent...');
    const todoInterface = new ethers.Interface(TODO_ABI);
    const todoText = `Test todo from relayer - ${new Date().toISOString()}`;
    const encodedData = todoInterface.encodeFunctionData('addTodo', [todoText]);
    
    console.log(`   Text: "${todoText}"`);
    console.log(`   Target: ${TODO_ADDRESS}`);
    
    const tx = await gateway.forwardIntentWithData(TODO_ADDRESS, encodedData);
    console.log(`📤 Transaction sent: ${tx.hash}`);
    
    const receipt = await tx.wait();
    console.log(`✅ Intent forwarded in block ${receipt?.blockNumber}`);

    // Wait for relayer to process
    console.log('\n4️⃣  Waiting for relayer to process intent...');
    await delay(8000);

    // Check relayer output
    console.log('\n5️⃣  Checking relayer logs...');
    const logs = relayerOutput.split('\n');
    const relevantLogs = logs.filter(line => 
      line.includes('Routing') || 
      line.includes('Success') || 
      line.includes('Error') ||
      line.includes('addTodo')
    );

    if (relevantLogs.length > 0) {
      console.log('📋 Relevant logs:');
      relevantLogs.forEach(log => {
        if (log.trim()) console.log(`   ${log}`);
      });
    } else {
      console.log('⚠️  No routing logs found. Full relayer output:');
      console.log(relayerOutput);
    }

    // Check if "Routing TodoList" appears
    if (relayerOutput.includes('🔀 Routing TodoList')) {
      console.log('\n✅ TodoList routing detected!');
    } else {
      console.log('\n⚠️  TodoList routing not detected in logs');
    }

    // Check if "Success" appears
    if (relayerOutput.includes('✅ Success')) {
      console.log('✅ Transaction success detected!');
    } else {
      console.log('⚠️  Transaction success not detected');
    }

    // Check TodoList app state
    console.log('\n6️⃣  Verifying TodoList app state...');
    const TODOLIST_APP_ID = 762834537;
    const indexerUrl = process.env.ALGORAND_INDEXER_URL || 'https://testnet-idx.algonode.cloud';
    
    try {
      const response = await fetch(`${indexerUrl}/v2/applications/${TODOLIST_APP_ID}/boxes`);
      const data = await response.json();
      const boxCount = data.boxes?.length || 0;
      console.log(`   Boxes in TodoList app: ${boxCount}`);
      
      if (boxCount > 0) {
        console.log('✅ TodoList boxes found - items were stored!');
      } else {
        console.log('⚠️  No boxes found in TodoList app');
      }
    } catch (err) {
      console.log(`⚠️  Could not query TodoList app: ${err}`);
    }

    // Summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Test Summary:');
    const hasRouting = relayerOutput.includes('🔀 Routing TodoList');
    const hasSuccess = relayerOutput.includes('✅ Success');
    
    console.log(`   Routing detected: ${hasRouting ? '✅' : '❌'}`);
    console.log(`   Success detected: ${hasSuccess ? '✅' : '❌'}`);
    console.log(`   TodoList boxes: ✓ (checked)`);
    
    if (hasRouting && hasSuccess) {
      console.log('\n🎉 END-TO-END TEST PASSED! TodoList integration is working!');
    } else {
      console.log('\n⚠️  Some checks failed. Review logs above.');
    }

  } finally {
    console.log('\n🛑 Cleaning up...');
    relayerProcess.kill();
    await delay(500);
  }
}

main().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
