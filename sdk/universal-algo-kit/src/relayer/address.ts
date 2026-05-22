import { ethers } from "ethers";

export function evmUserToAlgorandBytes(user: string): Uint8Array {
  const ethAddress = ethers.getBytes(ethers.getAddress(user)); // 20 bytes
  const padded = new Uint8Array(32);
  padded.set(ethAddress, 12);
  return padded;
}

