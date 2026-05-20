const algosdk = require('algosdk');
const crypto = require('crypto');
const ethers = require('ethers');

// Pad Somnia address to 32 bytes
const ethAddr = ethers.getBytes(ethers.getAddress('0xdAF0182De86F904918Db8d07c7340A1EfcDF8244'));
const paddedAddr = new Uint8Array(32);
paddedAddr.set(ethAddr, 12);
console.log('User address (padded 32 bytes):', Buffer.from(paddedAddr).toString('hex'));

// Test ARC4 encoding of address
const addrType = algosdk.ABIType.from('address');
const addrEncoded = addrType.encode(paddedAddr);
console.log('Address ARC4 encoded length:', addrEncoded.length);
console.log('Address ARC4 encoded hex:', Buffer.from(addrEncoded).toString('hex').substring(0, 64) + '...');

// uint64 for target app
const uint64Type = algosdk.ABIType.from('uint64');
const appIdEncoded = uint64Type.encode(762834537);
console.log('AppID (762834537) encoded length:', appIdEncoded.length);
console.log('AppID encoded hex:', Buffer.from(appIdEncoded).toString('hex'));

// Method selector for add_todo
const sig1 = 'add_todo(byte[],string,string)void';
const h1 = crypto.createHash('sha512-256').update(sig1).digest();
const selector = h1.subarray(0, 4);
console.log('add_todo selector:', Buffer.from(selector).toString('hex'));

// byte[] encoding of selector
const byteArrayType = algosdk.ABIType.from('byte[]');
const selectorEncoded = byteArrayType.encode(selector);
console.log('Selector as byte[] encoded length:', selectorEncoded.length);
console.log('Selector as byte[] encoded hex:', Buffer.from(selectorEncoded).toString('hex'));

// Now check the Executor selector
const execSig = 'execute_with_data(address,uint64,byte[],byte[])void';
const execH = crypto.createHash('sha512-256').update(execSig).digest();
const execSelector = execH.subarray(0, 4);
console.log('\nExecutor execute_with_data selector:', Buffer.from(execSelector).toString('hex'));
console.log('Should be: 1d94fb92');
