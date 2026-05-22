import crypto from "crypto";

export function arc4Selector(signature: string): Uint8Array {
  const digest = crypto.createHash("sha512-256").update(signature).digest();
  return new Uint8Array(digest.subarray(0, 4));
}

export function uint64ToBigEndianBytes(value: number | bigint): Uint8Array {
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64BE(BigInt(value));
  return new Uint8Array(buffer);
}

